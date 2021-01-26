<template>
  <div class="vx-row items-grid-view match-height">
    Payment Page
    <div class="row w-100 m-0 mb-5 justify-content-between sum">
      <div class="col-md-4 pl-0">
        <div class="h-100 bg-white row m-0 align-items-center">
          <div
            class="col-7 h-100 row justify-content-center align-items-center"
          >
            <div
              class="icon-bg row justify-content-center align-items-center"
              style="background-color: #cfecf5"
            >
              <vs-icon
                icon-pack="feather"
                icon="icon-tablet"
                size="20px"
                color="#3980f6"
              />
            </div>
          </div>
          <div class="col-8">
            <small class="text-muted"
              >Failed / Non failed (Compliance rate)</small
            >
            <h3 class="h3">{{ complianceRate }}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-5 pl-0">
        <div class="h-100 bg-white row m-0 align-items-center"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>