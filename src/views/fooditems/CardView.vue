<template>
  <vx-card class="mb-base" v-if="item.id!==undefined">
    <div slot="no-body">
      <div
        class="con-vs-alert p-0 border-l-b-0 border-b-r-0"
        :class="`con-vs-alert-${expireDate.key}`"
        style="border-bottom-left-radius: 0!important; border-bottom-right-radius: 0!important;"
      >
        <div class="vs-alert py-1">
          <p class="karla text-center" v-if="expireDate.val == 'no'">{{$t('no expiry')}}</p>
          <p
            class="karla text-center"
            v-else
          >{{expireDate.val.getTime()-now.getTime()>0? $t("expire") : $t("expired") | capitalize}} {{expireDate.val.getTime()-now.getTime() | duration('humanize' , true) | capitalize}}</p>
        </div>
      </div>
      <div class="item-content p-4">
        <p class="karla-bold item-title">{{item.name}}</p>
        <div class="flex items-center justify-between mt-4">
          <span class="karla item-text">{{$t("expiry")|capitalize}} :</span>
          <span class="karla-bold item-text">{{expireDate.date}}</span>
        </div>
        <div class="flex items-center justify-between mt-1">
          <span class="karla item-text">{{$t("created")|capitalize}} :</span>
          <span class="karla-bold item-text">{{item.created_at.toDate() | moment("DD/MM/YYYY")}}</span>
        </div>
        <div class="flex items-center justify-between mt-1">
          <span class="karla item-text">{{$t("quantity")|capitalize}} :</span>
          <span class="karla-bold item-text">{{quantity(item)}}</span>
        </div>
        <div class="flex items-center justify-between mt-1">
          <span class="karla item-text">{{$t("batch number")}} :</span>
          <span class="karla-bold item-text">{{item.batch}}</span>
        </div>

        <div class="flex items-center justify-between mt-1">
          <span class="karla item-text">{{$t("supplier")}} :</span>
          <span class="karla-bold item-text">{{supplier(item)}}</span>
        </div>
        <div class="mt-3">
          <span class="karla item-text truncate block" style="min-height: 1.3rem">{{item.desc}}</span>
        </div>
        <div class="inline-block items-center">
          <div class="bg-clip py-2 px-3 mt-3 mr-2 rounded-lg inline-block">
            <vs-icon icon-pack="feather" :icon="state(item).icon" v-if="!state(item).icon_pack" />
            <vs-icon v-else :icon="state(item).icon" />
            <span class="karla item-text ml-2">{{state(item).text}}</span>
          </div>
          <div class="inline-block">
            <div
              class="bg-clip py-2 px-3 rounded-lg mr-2 inline-block mt-3"
              v-for="(allergen,i) in allergens"
              :class="{'hidden': i!=1 && !showAllAllergens}"
              :key="i"
            >
              <div class="h-2 w-2 rounded-full mr-1 bg-primary inline-block"></div>
              <span class="karla item-text">{{$t(getAllergen(allergen).name)}}</span>
            </div>

            <div
              v-if="allergens.length>1 && !showAllAllergens"
              class="bg-clip py-2 px-3 rounded-lg mr-2 mt-3 inline-block"
            >
              <span class="karla item-text">+{{allergens.length-1}}</span>
            </div>
            <div
              @click="showAllAllergens=!showAllAllergens"
              v-if="allergens.length>1"
              class="bg-clip py-2 px-3 rounded-lg inline-block mt-3 cursor-pointer"
            >
              <vs-icon
                icon="arrow_drop_down"
                :class="{'rotate180':showAllAllergens}"
                class="times2"
              />
            </div>
          </div>
        </div>
        <div class="flex items-center mt-3">
          <vs-dropdown vs-custom-content class="cursor-pointer" vs-trigger-click>
            <feather-icon
              icon="MoreVerticalIcon"
              class="p-2 shadow-drop rounded-lg bg-btn cursor-pointer"
              style="height:2.6rem;"
            />
            <vs-dropdown-menu class="vx-navbar-dropdown">
              <ul style="min-width: 9rem" class="p-0">
                <li
                  v-if="item.type=='prepared'"
                  class="flex py-1 px-2 my-1 cursor-pointer hover:bg-primary hover:text-white"
                  @click="$emit('indShow' , item)"
                >
                  <feather-icon icon="GiftIcon" svgClasses="w-4 h-4"></feather-icon>
                  <span class="ml-2 karla">{{$t("ingredient")}}</span>
                </li>
                <li
                  v-if="role<4"
                  class="flex py-1 px-2 my-1 cursor-pointer hover:bg-primary hover:text-white"
                  @click="$emit('duplicate' , item)"
                >
                  <feather-icon icon="CopyIcon" svgClasses="w-4 h-4"></feather-icon>
                  <span class="ml-2 karla">{{$t("duplicate")}}</span>
                </li>
                <li
                  @click="$emit('history' , item)"
                  class="flex py-1 px-2 my-1 cursor-pointer hover:bg-primary hover:text-white"
                >
                  <feather-icon icon="ClockIcon" svgClasses="w-4 h-4"></feather-icon>
                  <span class="ml-2 karla">{{$t("history")}}</span>
                </li>
                <li
                  class="flex py-1 px-2 my-1 cursor-pointer hover:bg-primary hover:text-white"
                  v-if="role<4"
                  @click="$emit('edit' , item)"
                >
                  <feather-icon icon="Edit3Icon" svgClasses="w-4 h-4"></feather-icon>
                  <span class="ml-2 karla">{{$t("edit")}}</span>
                </li>
                <li
                  v-if="role<3"
                  class="flex py-1 px-2 my-1 cursor-pointer hover:bg-primary hover:text-white"
                  @click="$emit('remove' , item)"
                >
                  <feather-icon icon="Trash2Icon" svgClasses="w-4 h-4"></feather-icon>
                  <span class="ml-2 karla">{{$t("delete")|capitalize}}</span>
                </li>
              </ul>
            </vs-dropdown-menu>
          </vs-dropdown>
          <feather-icon
            @click="$emit('print' , item)"
            icon="PrinterIcon"
            class="p-2 shadow-drop rounded-lg bg-btn ml-3 cursor-pointer"
            style="height:2.6rem;"
          />
          <vs-button
            :disabled="role>3"
            @click="$emit('process' , item.id)"
            class="w-full karla-bold ml-3"
            color="rgb(241, 238, 254)"
            text-color="#6C50F0"
            type="filled"
          >{{$t("process")}}</vs-button>
        </div>
      </div>
    </div>
  </vx-card>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
    },
  },
  data() {
    return {
      now: new Date(),
      showAllAllergens: false,
    };
  },
  computed: {
    allergens() {
      var allergens = []
      this.item.allergens.map(item=> {
        if(this.$store.getters["app/getAllergenById"](item)) {
          allergens.push(item)
        }
      })

      if(this.item.ingredients && Array.isArray(this.item.ingredients)) {
        var iFoodItem
        this.item.ingredients.map(item=> {
          iFoodItem = this.$store.getters["app/getItemById"](item.id)
          if(iFoodItem && iFoodItem.allergens) {
            iFoodItem.allergens.map(al=> {
              if(allergens.indexOf(al) < 0 && this.$store.getters["app/getAllergenById"](al))
                allergens.push(al)
            })
          }
        })
      }
      return allergens
    },
    role() {
      var cUser = this.$store.getters["app/currentUser"];
      if (cUser == undefined || cUser.role === undefined) {
        return 4;
      }
      return cUser.role.key;
    },
    getAllergen() {
      return (item) => {
        return this.$store.getters["app/getAllergenById"](item);
      };
    },
    state() {
      return (item) => {
        if (item.type === undefined)
          return {
            icon_pack: false,
            icon: "icon-alert-octagon",
            text: this.$t("unset"),
          };
        else if (item.type === "delivered") {
          return {
            icon_pack: false,
            icon: "icon-package",
            text: this.$t("delivered"),
          };
        } else if (item.type === "prepared") {
          return {
            icon_pack: true,
            icon: "room_service",
            text: this.$t("prepared"),
          };
        }
      };
    },
    supplier() {
      return (item) => {
        if (
          item.supplier === undefined ||
          this.$store.getters["app/getSupplierByID"](item.supplier) ===
            undefined
        )
          return this.$t("unset");
        return this.$store.getters["app/getSupplierByID"](item.supplier).name;
      };
    },
    quantity() {
      return (item) => {
        if (item.measure === undefined) return this.$t("unset");
        return `${item.measure.quantity} ${this.$options.filters.capitalize(
          item.measure.unit
        )}`;
      };
    },
    expireDate() {
      var e_date;
      if (this.item.forever)
        return { val: "no", date: this.$t("no expiry"), key: "success" };
      if (this.item.e_date.seconds !== undefined)
        e_date = this.item.e_date.toDate();
      else e_date = this.item.e_date;
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

<style scoped>
.bg-clip {
  background: #ebebf1;
}

.times2 {
  transition: all 0.2 ease;
  transform: rotate(0deg) scale(1.6);
}
.times2.rotate180 {
  transform: rotate(180deg) scale(1.6);
}
</style>
<style>