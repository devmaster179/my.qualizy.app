<template>
  <vx-card class="border border-solid d-theme-border-grey-light my-4 overflow-hidden">
    <div slot="no-body">
      <div class="plan-header py-4 text-white text-center" :class="plan.planName">
        <h1 class="text-white">{{plan.planName | capitalize}}</h1>
        <p class="text-white" style="font-size:1.4em;font-weight:500;">
          <template v-if="pMode=='Monthly' && engament=='Yes'">${{plan.price.my}}</template>
          <template v-else-if="pMode=='Monthly' && engament=='No'">${{plan.price.mn}}</template>
          <template v-else-if="pMode=='Yearly'">${{plan.price.yearly}}</template>
          <span style="font-size:0.8em;font-weight:400;" v-if="pMode=='Monthly'">/ month</span>
          <span style="font-size:0.8em;font-weight:400;" v-else>/ year</span>
        </p>
      </div>
      <div v-for="(list,index) in plan.list" :key="'list'+ index" class="px-4">
        <h4 class="mt-4">{{list.key | capitalize}}</h4>
        <div
          v-for="(value,index) in list.values"
          :key="'value' + index"
          class="ml-4 flex items-center justify-between"
        >
          <p class="font-semibold">{{value.key | capitalize}}</p>
          <p class="mb-2">
            <template v-if="value.type=='boolean'">
              <vs-icon
                v-if="value.value"
                icon-pack="feather"
                icon="icon-check"
                color="success"
                size="20px"
              ></vs-icon>
              <vs-icon v-else icon-pack="feather" icon="icon-x" color="danger" size="20px"></vs-icon>
            </template>
            <template v-else>{{value.value|capitalize}}</template>
          </p>
        </div>
      </div>
      <div
        class="plan-header p-4 text-white flex items-center justify-between"
        :class="plan.planName"
      >
        <div>
          <h1 class="text-white">{{plan.planName | capitalize}}</h1>
          <p class="text-white" style="font-size:1.4em;font-weight:500;">
            <template v-if="pMode=='Monthly' && engament=='Yes'">${{plan.price.my}}</template>
            <template v-else-if="pMode=='Monthly' && engament=='No'">${{plan.price.mn}}</template>
            <template v-else-if="pMode=='Yearly'">${{plan.price.yearly}}</template>
            <span style="font-size:0.8em;font-weight:400;" v-if="pMode=='Monthly'">/ month</span>
            <span style="font-size:0.8em;font-weight:400;" v-else>/ year</span>
          </p>
        </div>
        <div>
          <vs-button
            color="#9ecc38"
            class="mt-4"
            type="border"
          >{{plan.planName=='free'? "Start Now" : "Select Plan"}}</vs-button>
        </div>
      </div>
    </div>
  </vx-card>
</template>

<script>
export default {
  props: {
    plan: {
      type: Object
    },
    pMode: {
      type: String,
      required: true
    },
    engament: {
      type: String
    }
  }
};
</script>

<style scoped>
.standard {
  background-color: rgba(var(--vs-primary), 1) !important;
}
.free {
  background-color: #039be5;
}
.pro {
  background-color: rgba(var(--vs-dark), 1) !important;
}
</style>