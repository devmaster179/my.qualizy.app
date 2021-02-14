// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

const secretKey = "sk_test_yftTn2I9tnfLeyQFW749SK4b";
const stripe = require('stripe')(secretKey);
const price = "price_1IHPxUKotMxlCKnOdtNBY2tq"
const product = "prod_IsZ9Lj8hlIhhO8"
const customer = "cus_IscIBx0xptrAf3"


exports.getInvoicesByCus = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    const customerStripeId = req.query.customerStripeId;
    const startingAfter = req.query.startingAfter;
    const limit = req.query.limit;

    const invoices = await stripe.invoices.list({
      customer: customerStripeId,
      starting_after: startingAfter,
      limit: limit,
    });

    const upcomingInvoice = await stripe.invoices.retrieveUpcoming({
      customer: customerStripeId,
    });

    res.json({ invoices: invoices.data, upcomingInvoice });
  });
});

exports.setupBillingDetail = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    try {
      const uid = req.query.uid;
      const email = req.query.email;
      const success_url = req.query.success_url;
      const cancel_url = req.query.cancel_url;
      const price = req.query.price;

      const customerData = {
        metadata: {
          firebaseUID: uid,
        },
      };

      if (email) {
        customerData.email = email;
      }

      // create customer
      const customer = await stripe.customers.create(customerData);
      // Add a mapping record in Cloud Firestore.
      const customerRecord = {
        stripeId: customer.id,
        stripeLink: `https://dashboard.stripe.com${customer.livemode ? '' : '/test'}/customers/${customer.id}`,
      };
      await admin
        .firestore()
        .collection('customers').doc(uid).set(customerRecord);

      // create sessopm
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'setup',
        customer: customer.id,
        success_url,
        cancel_url,
      });

      admin
        .firestore()
        .collection("customers")
        .doc(customer.id)
        .collection("checkout_sessions")
        .add(session);

      res.json({ result: { customer, session } });
    }
    catch (error) {
      res.json({ result: null });
    }
  });
});

exports.handleStripeWebhookEvents = functions.https.onRequest(
  async (req, resp) => {
    return cors(req, resp, async () => {
      const relevantEvents = new Set([
        'product.created',
        'product.updated',
        'product.deleted',
        'price.created',
        'price.updated',
        'price.deleted',
        'checkout.session.completed',
        'customer.subscription.created',
        'customer.subscription.updated',
        'customer.subscription.deleted',
        'tax_rate.created',
        'tax_rate.updated',
      ]);
      let event;

      try {
        event = stripe.webhooks.constructEvent(
          req.rawBody,
          req.headers['stripe-signature'],
          'whsec_YenyYyr9dgJY582PY4n3W2aG7kL8Aap8'
        );
      } catch (error) {
        resp.status(401).send('Webhook Error: Invalid Secret');
        return;
      }

      if (relevantEvents.has(event.type)) {
        try {
          switch (event.type) {
            case 'checkout.session.completed':
              const checkoutSession = event.data.object;
              if (checkoutSession.mode === 'setup') {
                console.log('checkout.session.completed', checkoutSession)
                const subscription = await stripe.subscriptions.create({
                  customer: checkoutSession.customer,
                  items: [
                    { price },
                  ],
                });
                admin
                  .firestore()
                  .collection("sub_check")
                  .add({ created_at: new Date(), checkoutSession: checkoutSession });
              }
              break;
            default:
              return new Error('Unhandled relevant event!')
          }
        } catch (error) {
          resp.json({
            error: 'Webhook handler failed. View function logs in Firebase.',
          });
          return;
        }
      }

      // Return a response to Stripe to acknowledge receipt of the event.
      resp.json({ received: true });
    });
  });


// exports.addUsageToSubscription = functions.firestore.document('/log_usages/{documentId}')
//   .onCreate((snap, context) => {
//     // Grab the current value of what was written to Firestore.
//     const usage = snap.data();

//     // Access the parameter `{documentId}` with `context.params`
//     functions.logger.log('Adding usage', context.params.documentId);

//     const usageRecord = await stripe.subscriptionItems.createUsageRecord(
//       subscriptionItem,
//       { quantity: 100, timestamp: new Date() }
//     );

//     return snap.ref.set({ addedToStripe: true }, { merge: true });
//   });

exports.addUsageToSubscription = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    const usageCount = req.query.usageCount;
    const subscription = req.query.subscription;
    const subscriptionItems = await stripe.subscriptionItems.list({
      subscription,
    });
    if (subscriptionItems.data.length < 1) {
      res.json({ result: 'error' });
    } else {
      const usageRecord = await stripe.subscriptionItems.createUsageRecord(
        subscriptionItems.data[0].id,
        { quantity: usageCount, timestamp: new Date() }
      );
      res.json({ result: usageRecord });
    }
  });
});
