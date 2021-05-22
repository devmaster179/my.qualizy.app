<template>
  <div  class="bg-white list-view" >
    <div class="flex w-full font-bold export_table">
      <p class="mr-5">Menu items</p>
      <div class="mx-auto"><p>Allergen</p></div>
    </div>
    <table class="w-full print_allergen">
      <thead>
        <tr>
          <th class="text-sm font-black">
            {{ user.name }}
          </th>
          <th
            class="text-xs"
            v-for="(allergen, index) in allergens"
            :key="index"
          >
            <div class="flex flex-col items-center justify-items-center">
              <img
                v-if="$t(allergen.name) == 'Fish'"
                :src="require('@/assets/images/allergies/fish.png')"
                class="w-8 rounded-full"
                alt=""
              />
              <img
                v-else-if="$t(allergen.name) == 'Celery'"
                :src="require('@/assets/images/allergies/celery.png')"
                class="w-8 rounded-full"
                alt=""
              />
              <img
                v-else-if="$t(allergen.name) == 'Crustaceans'"
                :src="require('@/assets/images/allergies/crustaceans.png')"
                class="w-8 rounded-full"
                alt=""
              />
              <img
                v-else-if="$t(allergen.name) == 'Eggs'"
                :src="require('@/assets/images/allergies/egg.png')"
                class="w-8 rounded-full"
                alt=""
              />
              <img
                v-else-if="$t(allergen.name) == 'Gluten'"
                :src="require('@/assets/images/allergies/gluten.png')"
                class="w-8 rounded-full"
                alt=""
              />
              <img
                v-else-if="$t(allergen.name) == 'Lupin'"
                :src="require('@/assets/images/allergies/Lupin.png')"
                class="w-8 rounded-full"
                alt=""
              />
              <img
                v-else-if="$t(allergen.name) == 'Milk'"
                :src="require('@/assets/images/allergies/milk.png')"
                class="w-8 rounded-full"
                alt=""
              />
              <img
                v-else-if="$t(allergen.name) == 'Molluscs'"
                :src="require('@/assets/images/allergies/molluscs.png')"
                class="w-8 rounded-full"
                alt=""
              />
              <img
                v-else-if="$t(allergen.name) == 'Mustard'"
                :src="require('@/assets/images/allergies/mustard.png')"
                class="w-8 rounded-full"
                alt=""
              />
              <img
                v-else-if="$t(allergen.name) == 'Nuts'"
                :src="require('@/assets/images/allergies/tree-nuts.png')"
                class="w-8 rounded-full"
                alt=""
              />
              <img
                v-else-if="$t(allergen.name) == 'Peanuts'"
                :src="require('@/assets/images/allergies/peanuts.png')"
                class="w-8 rounded-full"
                alt=""
              />
              <img
                v-else-if="$t(allergen.name) == 'Sesame seeds'"
                :src="require('@/assets/images/allergies/sesame.png')"
                class="w-8 rounded-full"
                alt=""
              />
              <img
                v-else-if="$t(allergen.name) == 'Soy'"
                :src="require('@/assets/images/allergies/soyabeans.png')"
                class="w-8 rounded-full"
                alt=""
              />
              <img
                v-else-if="$t(allergen.name) == 'Sulphur dioxide'"
                :src="require('@/assets/images/allergies/sulphur.png')"
                class="w-8 rounded-full"
                alt=""
              />
              <span class="text-xs font-bold"> {{ $t(allergen.name) }}</span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in fooditems"
          :key="index"
          v-show="expireDate(item.forever, item.e_date).key === 'success'"
        >
          <td class="text-sm font-black">
            {{ item.name }}
          </td>
          <!-- <td class="text-xs" v-for="(allergen, i) in item.allergens" :key="i"> -->
          <td class="text-xs td-allergen-item" v-for="i in 14" :key="i">
            <span
              class="text-lg allergy-mark"
              v-if="getAllergen(item.allergens[i-1]).name"
            >
              X
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    allergens: {
      type: Array | Object,
      default: null,
    },
    fooditems: {
      type: Array | Object,
      default: null,
    },
    user: {
      type: Array | Object,
      default: null,
    },
  },
  data() {
    return {
      now: new Date(),
    };
  },
  computed: {
    getAllergen() {
      return (item) => {
        if (item === undefined) {
          return false;
        }
        return this.$store.getters["app/getAllergenById"](item);
      };
    },
  },
  methods: {
    expireDate(item_forever, item_e_date) {
      var e_date;
      console.log(item_forever);
      if (item_forever)
        return { val: "no", date: this.$t("no expiry"), key: "success" };
      if (item_e_date.seconds !== undefined) e_date = item_e_date.toDate();
      else e_date = item_e_date;
      var key = "success";

      if (e_date.getTime() < this.now.getTime()) key = "danger";
      else if (e_date.getTime() < this.now.getTime() - 3600 * 24 * 1000)
        key = "warning";
      return {
        date: this.$moment(e_date).format("DD/MM/YYYY"),
        key,
        val: e_date,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
/* Allergers table body */
.print_allergen {
  border-collapse: collapse;
}
.print_allergen tbody tr {
  box-shadow: none;
}
.allergy-mark {
  color: red;
}
.print_allergen tbody tr td {
  background: none;
  padding: 1.5rem 10px;
  border: 1px solid black;
  border-collapse: collapse;
}
.print_allergen th {
  border: 1px solid black;
  border-collapse: collapse;
  padding: 0px;
}
.td-allergen-item {
  text-align: center;
}
</style>