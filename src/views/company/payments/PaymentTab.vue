<template>
  <div>
    <div class="mt-4"></div>
    <vx-card>
      <div class="card-header p-6" slot="no-body"></div>
      <div>
        <iframe
          width="100%"
          style="height: 500px"
          scrolling="no"
          frameborder="0"
          src="https://app.paykickstart.com/billing?portal=809LqB6hq3COxnbdKT7V6fqvhqVzFQ4DQTcJZdnz0kml4BXqda"
        ></iframe>
      </div>
    </vx-card>
  </div>
</template>

<script>
export default {
  mounted() {
    let recaptchaScript = document.createElement("script");
    recaptchaScript.setAttribute(
      "src",
      "https://app.paykickstart.com/billing-portal/js/809LqB6hq3COxnbdKT7V6fqvhqVzFQ4DQTcJZdnz0kml4BXqda"
    );
    document.head.appendChild(recaptchaScript);
  },
};
</script>

<style>
</style>