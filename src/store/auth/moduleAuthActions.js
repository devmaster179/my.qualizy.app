/*=========================================================================================
  File Name: moduleAuthActions.js
  Description: Auth Module Actions
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import firebase from 'firebase/app'
import 'firebase/auth'
import '@firebase/analytics'
import router from '@/router'

import {
  db
} from "../../firebase/firebaseConfig"

import { Base64 } from "@/encode/encode.js";

import CryptoJS from "crypto-js"
import { industryConfig } from "./industryConfig"

var getCompany = (payload) => {
  return new Promise((resolve) => {
    db.collection("companies").doc(payload.group).get().then(company => {
      resolve(Object.assign({}, company.data(), { id: company.id }))
    })
  })
}
var getTeams = (payload) => {
  return new Promise((resolve) => {
    db.collection("teams").where("group", "==", payload.group).get().then(q => {
      let teams = [];
      q.forEach((doc) => {
        teams.push(Object.assign({}, doc.data(), { id: doc.id }));
      });
      resolve(teams);
    });
  });
}
var getLocations = (payload) => {
  return new Promise((resolve) => {
    db.collection("locations").where("group", "==", payload.group).get().then(q => {
      let locations = [];
      q.forEach((doc) => {
        locations.push(Object.assign({}, doc.data(), { id: doc.id }));
      });
      resolve(locations);
    });
  });
}
export default {
  loginWithDigit({
    state,
    dispatch
  }, payload) {
    if (state.isUserLoggedIn()) {
      // Close animation if passed as payload
      if (payload.closeAnimation) payload.closeAnimation()

      payload.notify({
        time: 7000,
        title: 'Login Attempt',
        text: 'You are already logged in!',
        iconPack: 'feather',
        icon: 'icon-alert-circle',
        color: 'warning'
      });

      return false
    }
    firebase.auth().signInAnonymously()
      .then(() => {
        dispatch('getCurrentUser', {
          email: payload.userDetails.email,
        }).then(() => {
          firebase.auth().currentUser.delete()
          router.push(router.currentRoute.query.to || '/');
        }).catch(err => {
          if (payload.closeAnimation) payload.closeAnimation()
          firebase.auth().currentUser.delete()
          firebase.auth().signOut()
          payload.notify({
            time: 7000,
            title: 'Error',
            text: err,
            iconPack: 'feather',
            icon: 'icon-alert-circle',
            color: 'danger',
          });
        })
      })
      .catch(error => {
        if (payload.closeAnimation) payload.closeAnimation()
        payload.notify({
          time: 7000,
          title: 'Error',
          text: error.message,
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          color: 'danger'
        });
      })
  },
  loginDigit({
    dispatch
  }, payload) {
    const newPayload = {
      userDetails: payload.userDetails,
      notify: payload.notify,
      closeAnimation: payload.closeAnimation,
    }
    if (!payload.checkbox_remember_me) {
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        // If success try to login
        .then(function () {
          dispatch('loginWithDigit', newPayload)
        })
        // If error notify
        .catch(function (err) {
          // Close animation if passed as payload
          if (payload.closeAnimation) payload.closeAnimation()
          payload.notify({
            time: 7000,
            title: 'Error',
            text: err.message,
            iconPack: 'feather',
            icon: 'icon-alert-circle',
            color: 'danger'
          });
        });
    } else {
      dispatch('loginWithDigit', newPayload)

    }

  },
  loginAttempt({
    dispatch
  }, payload) {

    // New payload for login action
    const newPayload = {
      userDetails: payload.userDetails,
      notify: payload.notify,
      closeAnimation: payload.closeAnimation,
      userflow: payload.userflow,
      gist: payload.gist
    }
    // If remember_me is enabled change firebase Persistence
    if (!payload.checkbox_remember_me) {
      // Change firebase Persistence
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        // If success try to login
        .then(function () {
          dispatch('login', newPayload)
        })

        // If error notify
        .catch(function (err) {
          // Close animation if passed as payload
          if (payload.closeAnimation) payload.closeAnimation()

          payload.notify({
            time: 7000,
            title: 'Error',
            text: err.message,
            iconPack: 'feather',
            icon: 'icon-alert-circle',
            color: 'danger'
          });
        });
    } else {
      // Try to login
      dispatch('login', newPayload)
    }
  },
  getCurrentUser({
    commit,
    dispatch
  }, payload) {
    return new Promise((resolve, reject) => {
      db.collection('users').where('email', '==', payload.email).get().then(async (result) => {
        var user
        if (!result.empty) {
          user = Object.assign({}, result.docs[0].data(), { id: result.docs[0].id })
        }
        else {
          reject(new Error('There is no user have this email. \n Please register to login.'))
        }
        if (!user.status)
          reject(new Error('This email address blocked already. \n Please contact your admin.'))
        else if (user.deleted !== undefined && user.deleted)
          reject(new Error('This email address deleted already. \n Please contact your admin.'))
        var company = await getCompany({ group: user.group })
        var teams = await getTeams({ group: user.group })
        var locations = await getLocations({ group: user.group })

        var role = 4
        var roles = [
          "Super admin",
          "Admin",
          "Supervisor",
          "Operator",
          "Auditor"
        ]
        if (user.role !== undefined)
          role = user.role.key

        var location = []
        if (user.location !== undefined && user.location !== null && user.location !== '') {
          var lo
          user.location.map(item => {
            lo = locations.find(l => l.id == item)
            if (lo)
              location.push(lo.name)
          })
        }
        location = location.join(", ")

        var phone = ''
        if (user.phone !== undefined && user.phone !== null && user.phone !== '')
          phone = user.phone

        var team = []
        if (user.team !== undefined && user.team !== null && user.team !== '') {
          var te
          user.team.map(item => {
            te = teams.find(t => t.id == item)
            if (te)
              team.push(te.name)
          })
        }
        team = team.join(", ")

        firebase.analytics().setUserProperties({
          'user_id': result.docs[0].id
        });
        firebase.analytics().setUserProperties({
          'email': user.email
        });
        firebase.analytics().setUserProperties({
          'group': user.group
        });
        firebase.analytics().setUserProperties({
          'user_name': user.name
        });
        firebase.analytics().setUserProperties({
          'role': roles[role]
        });

        if (location != '')
          firebase.analytics().setUserProperties({
            'location': location
          });
        if (phone != '')
          firebase.analytics().setUserProperties({
            'phone': phone
          });

        if (team != '')
          firebase.analytics().setUserProperties({
            'team': team
          })

        firebase.analytics().setUserProperties({
          'created_at': user.created_at.toDate()
        });

        firebase.analytics().logEvent('login', {
          email: user.email
        });

        const hash = CryptoJS.HmacSHA256(result.docs[0].id, "ex0dlTc4U8KIzX7pw9udCQK5G9ukYhQauuU_7gQK")
        const hash1 = CryptoJS.enc.Hex.stringify(hash)
        var userLocation = ''
        if (user.location && Array.isArray(user.location))
          userLocation = user.location.join()

        payload.gist.identify(user.id, {
          name: user.name,
          email: user.email,
          "Job Title": user.job_title || "",
          "Role": roles[role],
          "Group id": user.group,
          "Group name": company.bussiness,
          "Team id": user.team.join() || "",
          "Team name": team,
          "Location id": userLocation,
          "Location name": location,
          lang: user.lang || "en-us",
          phone: phone,
          "App creator": !!user.who,
          "Company name": company.bussiness,
          "Company size": company.employee || 5,
          "Company industry": company.industry || "Business owner",
          "Number of locations": locations.length || 0,
          company: {
            id: company.id,
            name: company.bussiness,
            "Company size": company.employee || 5,
            "Company industry": company.industry || "Business owner",
            "Number of locations": locations.length || 0,
          }
        });

        payload.gist.track('Log In', {
          email: user.email,
          name: user.name,
        })

        if (!payload.userflow.isIdentified()) {
          payload.userflow.identify(user.id, {
            name: user.name,
            email: user.email,
            "Job Title": user.job_title || "",
            "Role": roles[role],
            "Group ID": user.group,
            "Group Name": company.bussiness,
            "Team id": user.team.join() || "",
            "Team Name": team,
            "Location ID": userLocation,
            "Location Name": location,
            phone: phone,
            role: roles[role],
            locale_code: user.lang || "en-us",
            "Company size": company.employee || 5,
            "Company industry": company.industry || "Business owner",
            "Number of locations": locations.length || 0,
            "App creator": !!user.who,
            // "Job title": company.job || "Job title"
          })
        }

        payload.userflow.track("Log In", {
          email: user.email,
        })

        db.collection('users').doc(user.id).update({
          last_visit: new Date(),
          chatStatus: 'online'
        })
        commit('UPDATE_AUTHENTICATED_USER', user)
        resolve("Success!");
      })
    })

  },
  login({
    state,
    dispatch
  }, payload) {
    // If user is already logged in notify and exit
    if (state.isUserLoggedIn()) {
      if (payload.closeAnimation) {
        setTimeout(() => {
          payload.closeAnimation()
        }, 10);
      }
      payload.notify({
        time: 7000,
        title: 'Login Attempt',
        text: 'You are already logged in!',
        iconPack: 'feather',
        icon: 'icon-alert-circle',
        color: 'warning'
      });
      // router.push(router.currentRoute.query.to || '/');

      //kkkkk
      return false
    }
    // Try to sigin
    firebase.auth().signInWithEmailAndPassword(payload.userDetails.email, payload.userDetails.password)
      .then(() => {
        // Close animation if passed as payload
        dispatch('getCurrentUser', {
          email: payload.userDetails.email,
          userflow: payload.userflow,
          gist: payload.gist
        }).then(() => {
          if (payload.signUp) {
            if (router.currentRoute.query.to == undefined)
              router.push('/dashboard');
            else if (router.currentRoute.query.to.includes('templates'))
              router.push(router.currentRoute.query.to)
            else
              router.push('/dashboard');
          } else
            router.push(router.currentRoute.query.to || '/');

          if (payload.closeAnimation) payload.closeAnimation()
        }).catch(error => {
          if (payload.closeAnimation) payload.closeAnimation()
          firebase.auth().signOut()
          payload.notify({
            time: 7000,
            title: 'Error',
            text: error,
            iconPack: 'feather',
            icon: 'icon-alert-circle',
            color: 'danger',
          });
        })

      }, (err) => {

        // Close animation if passed as payload
        if (payload.closeAnimation) payload.closeAnimation()

        payload.notify({
          time: 7000,
          title: 'Error',
          text: err.message,
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          color: 'danger'
        });
      })
  },

  // Google Login
  loginWithGoogle({
    state,
    dispatch
  }, payload) {
    if (state.isUserLoggedIn()) {
      payload.notify({
        time: 7000,
        title: 'Login Attempt',
        text: 'You are already logged in!',
        iconPack: 'feather',
        icon: 'icon-alert-circle',
        color: 'warning'
      });
      return false
    }
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)
      .then((result) => {
        dispatch('getCurrentUser', {
          email: result.user.providerData[0].email,
        }).then(() => {
          // commit('UPDATE_AUTHENTICATED_USER', result.user.providerData[0])
          router.push(router.currentRoute.query.to || '/');
        }).catch((error) => {
          payload.closeAnimation()
          firebase.auth().signOut()
          payload.notify({
            time: 7000,
            title: 'Error',
            text: error,
            iconPack: 'feather',
            icon: 'icon-alert-circle',
            color: 'danger',
          });
        })
      }).catch((err) => {
        payload.notify({
          time: 7000,
          title: 'Error',
          text: err.message,
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          color: 'danger'
        });
      })
    // firebase.auth().onAuthStateChanged(function(user) {
    //     if (user) {
    //         user.updateProfile({
    //             roles: ['admin'],
    //         }).then(function() {
    //             this.$vs.notify({
    //                 title: 'Success',
    //                 text: "done",
    //                 iconPack: 'feather',
    //                 icon: 'icon-check',
    //                 color: 'success'
    //             });
    //         }, function(error) {
    //             this.$vs.notify({
    //                 title: 'Error',
    //                 text: error.message,
    //                 iconPack: 'feather',
    //                 icon: 'icon-alert-circle',
    //                 color: 'danger'
    //             });
    //         });

    //     }
    // });
  },
  getRepeatByTemplateTitle(title) {
    var repeat = false;
    var dailyTitles = [
      "Fridge temperature logs",
      "Freezer temperature logs",
      "Opening checks",
      "Closing checks",
      "Daily Cleaning schedule",
      "Dialy internal audit",
      "Personal Hygiene",
    ];
    var weeklyTitles = [
      "Weekly food safety checklist",
      "Weekly internal audit",
    ];
    var monthlyTitles = ["Monthly internal audit", "Thermometer calibration"];
    if (dailyTitles.indexOf(title) > -1) {
      repeat = "Daily";
    } else if (weeklyTitles.indexOf(title) > -1) {
      repeat = "Weekly";
    } else if (monthlyTitles.indexOf(title) > -1) {
      repeat = "Monthly";
    }

    return repeat;
  },
  registerUser({
    dispatch
  }, payload) {
    function getRepeatByTemplateTitle(title) {
      var repeat = false;
      var dailyTitles = [
        "Fridge temperature logs",
        "Freezer temperature logs",
        "Opening checks",
        "Closing checks",
        "Daily Cleaning schedule",
        "Dialy internal audit",
        "Personal Hygiene",
      ];
      var weeklyTitles = [
        "Weekly food safety checklist",
        "Weekly internal audit",
      ];
      var monthlyTitles = ["Monthly internal audit", "Thermometer calibration"];
      if (dailyTitles.indexOf(title) > -1) {
        repeat = "Daily";
      } else if (weeklyTitles.indexOf(title) > -1) {
        repeat = "Weekly";
      } else if (monthlyTitles.indexOf(title) > -1) {
        repeat = "Monthly";
      }

      return repeat;
    }
    // create user using firebase
    firebase.auth().createUserWithEmailAndPassword(payload.userDetails.email, payload.userDetails.password)
      .then((result) => {
        firebase.analytics().logEvent('sign-up', {
          email: payload.userDetails.email.email
        });

        if (payload.closeAnimation) payload.closeAnimation()

        payload.notify({
          time: 7000,
          title: 'Account Created',
          text: `You are successfully registered!
                Please wait for sign in!`,
          iconPack: 'feather',
          icon: 'icon-check',
          color: 'success'
        });

        var group = result.user.uid;

        const newPayload = {
          userDetails: payload.userDetails,
          notify: payload.notify,
          updateUsername: true,
          userflow: payload.userflow,
          gist: payload.gist,
          signUp: true
        }

        var company = payload.userDetails.company
        const createdDate = new Date()
        db.collection('companies').doc(group).set({
          logo: '',
          bussiness: company,
          address: 'Address',
          phone: payload.userDetails.phone,
          employee: payload.userDetails.employee,
          industry: payload.userDetails.industry,
          job: payload.userDetails.job,
          trial: true,
          created_at: createdDate,
          updated_at: createdDate
        })

        db.collection("locations").add({
          active: true,
          created_at: createdDate,
          group: group,
          address: {
            country: payload.userDetails.locationInfo.country_name,
            fAddress: `${payload.userDetails.locationInfo.city}, ${payload.userDetails.locationInfo.region_name}, ${payload.userDetails.locationInfo.country_name}`,
            latitude: payload.userDetails.locationInfo.latitude,
            longitude: payload.userDetails.locationInfo.longitude
          },
          region: payload.userDetails.locationInfo.region_name,
          area: payload.userDetails.locationInfo.city,
          name: company
        }).then(res => {
          db.collection('teams').add({
            active: true,
            group: group,
            name: "Front of the house",
            created_at: createdDate,
            updated_at: createdDate,
            created_by: 'app-creator',
            location: [res.id],
          })
          db.collection('teams').add({
            active: true,
            group: group,
            name: "Back of the house",
            created_at: createdDate,
            updated_at: createdDate,
            created_by: 'app-creator',
            location: [res.id],
          })

          db.collection('teams').add({
            active: true,
            group: group,
            name: payload.userDetails.username + ' - Team',
            created_at: createdDate,
            updated_at: createdDate,
            created_by: 'app-creator',
            location: [res.id],
          }).then(res1 => {
            let country_code = payload.userDetails.locationInfo.country_code ? payload.userDetails.locationInfo.country_code : ''

            var language = "en-gb"
            if (country_code.toLowerCase() == "us") {
              language = "en-us"
            }
            else if (country_code.toLowerCase() == "fr" || country_code.toLowerCase() == "es" || country_code.toLowerCase() == "it") {
              language = country_code.toLowerCase()
            }
            db.collection('users').doc(group).set({
              name: payload.userDetails.username,
              email: payload.userDetails.email,
              phone: payload.userDetails.phone,
              status: true,
              who: 'app-creator',
              role: {
                key: 0,
                name: 'super admin'
              },
              location: [res.id],
              lang: language,
              password: Base64.encode(payload.userDetails.password),
              team: [res1.id],
              created_at: createdDate,
              updated_at: createdDate,
              group: group
            })
            payload.userflow.identify(group, {
              name: payload.userDetails.username,
              email: payload.userDetails.email,
              "Job Title": "",
              "Role": "Super admin",
              "Group ID": group,
              "Group Name": company,
              "Team id": res1.id,
              "Team Name": payload.userDetails.username + ' - Team',
              "Location ID": res.id,
              "Location Name": company,
              phone: payload.userDetails.phone,
              role: 0,
              locale_code: language,
              created_at: createdDate.toISOString()
            })

            dispatch('login', newPayload) //kkkkkkkk


            // BEGIN activating templates/schedules/reports/knowledge_bases
            let userIndustry = parseInt(payload.userDetails.industry)

            if (userIndustry == 1000) {
              userIndustry = "Other"
            } else {
              userIndustry = industryConfig[userIndustry][language]
            }


            console.log('payload: ', payload)
            console.log('payload.userDetails.locationInfo: ', payload.userDetails.locationInfo)
            console.log('userIndustry: ', userIndustry)

            let tags = [];
            db.collection("template_labels") // get tag ids by industry name == tag name && group == global
              .where("group", "in", [
                "global",
              ])
              .where("name", "==", userIndustry)
              .where("lang", "==", language)
              .get().then((q) => {
                q.forEach((doc) => {
                  tags.push(doc.id);
                });
                console.log("getTemplateLabels", tags);

                db.collection("templates") // get templates that has tag(same name with user industry)
                  .where("group", "==", "global")
                  .get().then((q) => {
                    let publicTemplates = [];
                    q.forEach((doc) => {
                      publicTemplates.push(
                        Object.assign({}, doc.data(), { id: doc.id })
                      );
                    });

                    let templates = publicTemplates.filter((template) => // filter template by tag
                      template.content.templateLabel.some((labels) =>
                        tags.includes(labels)
                      )
                    );

                    console.log("result.user", result.user);
                    console.log("tag filtered templates", templates);
                    let tempBatch = db.batch()
                    let newTemps = []
                    templates.map((t) => {
                      var updated_at = new Date();
                      let temp = Object.assign({}, t,
                        {
                          starred: false,
                          trashed: false,
                          created_by: result.user.id,
                          updated_by: result.user.id,
                          created_at: updated_at,
                          updated_at: updated_at,
                          group: result.user.uid
                        })
                      console.log('each before save', temp)
                      var docRef = db.collection("templates").doc(); //automatically generate unique id
                      tempBatch.set(docRef, temp);

                      newTemps.push({ id: docRef.id, temp: temp })
                    })
                    tempBatch.commit();

                    let scheduBatch = db.batch()
                    let repoBatch = db.batch()

                    newTemps.map(nt => {
                      console.log('newTemps', nt)
                      let temp = nt.temp
                      // BEGIN activating schedules
                      if (temp.content.templateSD == "schedule this template") {
                        var assignDates = [];
                        var from = new Date();
                        var beforeItem = "";
                        var aTimes = [{ value: "08:00" }];
                        aTimes.map((item) => {
                          if (item.value == beforeItem) return;
                          beforeItem = item.value;
                          assignDates.push(
                            new Date(
                              from.getFullYear(),
                              from.getMonth(),
                              from.getDate(),
                              item.value.split(":")[0],
                              item.value.split(":")[1]
                            )
                          );
                        });

                        var teams = [res1.id];
                        var mUser = [res1.id];
                        var repeat = getRepeatByTemplateTitle(
                          temp.content.templateTitle
                        );
                        var title = repeat
                          ? temp.content.templateTitle + "-" + repeat
                          : temp.content.templateTitle;

                        let newSchedule = {
                          location: [res.id],
                          title: title,
                          template: nt.id,
                          assign: teams,
                          monitor: mUser,
                          _repeat: repeat ? repeat : "No Repeat",
                          dueTimes: assignDates,
                          selectedDays: [],
                          // interval: this.interval,
                          group: result.user.uid,
                          created_by: result.user.id,
                          created_at: new Date(),
                          updated_by: result.user.id,
                          updated_at: new Date(),
                          active: true,
                        }
                        console.log('schedule created', newSchedule)
                        var scdRef = db.collection("schedules").doc(); //automatically generate unique id
                        scheduBatch.set(scdRef, newSchedule);
                      }
                      // END activating schedules

                      // BEGIN activating reports
                      let reportTitle = temp.content.templateTitle + " - This week"
                      let newReport = {
                        title: reportTitle,
                        description: '',
                        visible: 'Public',
                        teams: [],
                        tags: temp.content.templateLabel,
                        filter: {
                          date: "thisW",
                          template: [nt.id],
                          team: [],
                          label: [],
                          user: [],
                          status: ''
                        },
                        location: [res.id],
                        created_at: new Date(),
                        updated_at: new Date(),
                        created_by: result.user.id,
                        group: result.user.uid,
                      }
                      console.log('report created', newReport)
                      var repoRef = db.collection("reports").doc(); //automatically generate unique id
                      repoBatch.set(repoRef, newReport);
                      // END activating reports
                    })

                    scheduBatch.commit();
                    repoBatch.commit();
                  });

                // BEGIN activating knowledge_bases

                db.collection("knowledge").add({
                  name: payload.userDetails.industry,
                  type: "category",
                  image: "",
                  comment: '',
                  locations: [res.id],
                  group: result.user.uid,
                  updated_by: result.user.id,
                  updated_at: new Date(),
                })
                  .then(function (docRef) {
                    db.collection("knowledge")
                      .where("type", "==", "article")
                      .where("group", "==", "global")
                      .where("tags", "array-contains-any", tags)
                      .get()
                      .then((q) => {
                        let kngBatch = db.batch()

                        q.forEach((doc) => {
                          if (doc.data().trashed) return;

                          let newKng = Object.assign({}, doc.data(), {
                            category: docRef.id,
                            group: result.user.uid,
                            updated_by: result.user.id,
                            updated_at: new Date(),
                          });

                          console.log('knowledge created', newKng)
                          var articleRef = db.collection("knowledge").doc(); //automatically generate unique id
                          kngBatch.set(articleRef, newKng);

                          // db.collection("knowledge").add(newKng);
                        });

                        kngBatch.commit()
                      })
                      .catch(function (error) {
                        console.error("Error adding knowledgebase article: ", error);
                      });
                  })
                  .catch(function (error) {
                    console.error("Error adding knowledgebase category: ", error);
                  });

              });
            // END activating knowledge_bases

            // END activating templates/schedules/reports/knowledge_bases
          })
        })



      }, (error) => {
        if (payload.closeAnimation) payload.closeAnimation()
        payload.notify({
          time: 7000,
          title: 'Error',
          text: error.message,
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          color: 'danger'
        });
      })
  },



  updateUsername({
    commit
  }, payload) {
    payload.user.updateProfile({
      displayName: payload.username
    }).then(() => {

      // If username update is success
      // update in localstorage
      let newUserData = Object.assign({}, payload.user.providerData[0])
      newUserData.displayName = payload.username
      commit('UPDATE_AUTHENTICATED_USER', newUserData)

      // If reload is required to get fresh data after update
      // Reload current page
      if (payload.isReloadRequired) {
        router.push(router.currentRoute.query.to || '/')
      }
    }).catch((err) => {
      payload.notify({
        time: 8800,
        title: 'Error',
        text: err.message,
        iconPack: 'feather',
        icon: 'icon-alert-circle',
        color: 'danger'
      });
    })
  },
  updateAuthenticatedUser({
    commit
  }, payload) {
    commit('UPDATE_AUTHENTICATED_USER', payload)
  },
}