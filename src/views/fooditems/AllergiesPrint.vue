<template>
  <div class="bg-white list-view px-5">
    <div class="flex w-full font-bold export_table mb-6 pt-6 ">
      <p class="mr-5 text-black">{{ user.name }} Allergen Quick reference</p>
      <p class="ml-auto text-black">Allergens Marked With an X</p>
    </div>
    <table class="w-full print_allergen">
      <thead>
        <tr>
          <th class="text-sm font-black text-center text-black">
            Menu items
          </th>
          <th
            class="text-sm"
            :colspan="allergens.length"
          >
            <div class="flex flex-col items-center justify-items-center">
              
              <span class="text-sm font-bold text-black"> Allergen</span>
            </div>
          </th>
        </tr>
        <tr>
          <th class="text-sm font-black text-left text-black">
            {{ user.name }}
          </th>
          <th
            class="text-xs"
            v-for="(allergen, index) in allergens"
            :key="index"
          >
            <div class="flex flex-col items-center justify-items-center">
              <img
                :src="require('@/assets/images/allergies/'+$t(allergen.name)+'.png')"
                class="w-8 rounded-full"
                alt=""
              />
              
              <span class="text-xs font-bold"> {{ $t(allergen.name) }}</span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in activeItems" :key="index">
          <td class="text-sm text-right">
            <span class="font-black text-black">
              {{ item.name }}
              </span> 
          </td>
          <!-- <td class="text-xs" v-for="(allergen, i) in item.allergens" :key="i"> -->
          <td class="text-xs td-allergen-item" v-for="(allergen, index) in allergens" :key="index">
            <span
              class="text-lg allergy-mark"
              v-if="getAllergen(item.allergens, allergen.name)"
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
      return (allergens, item) => {
        if (item === undefined) {
          return false;
        }
        for (let i = 0; i < allergens.length; i++) {
          const allergen = allergens[i];
          if (this.$store.getters["app/getAllergenById"](allergen).name === item) {
            return true;
          }
        }
      };
    },
    activeItems() {
      return this.fooditems.filter(fooditem => {
        return this.expireDate(fooditem.forever, fooditem.e_date).key === 'success';
      });
    }
  },
  methods: {
    expireDate(item_forever, item_e_date) {
      var e_date;
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
.export_table{
  border-bottom-style: solid;
  border-bottom-color: hsl(1deg 23% 42%);
  border-bottom-width: 8px;
}
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