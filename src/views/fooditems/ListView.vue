<template>
  <tr>
    <td>
      <p class="fooditem-name karla-bold">{{item.name}}</p>
      <span class="note">{{item.desc | truncate(40)}}</span>
    </td>
    <td v-if="!item.forever">{{item.e_date.toDate() | moment("DD/MMM/YYYY") | capitalize}}</td>
    <td v-else>{{$t("forever") | capitalize}}</td>
    <td>{{item.created_at.toDate() | moment("DD/MMM/YYYY") | capitalize}}</td>
    <td class="quentity">
      <template
        v-if="item.measure !==undefined"
      >{{item.measure.quantity}} {{item.measure.unit|capitalize}}</template>
    </td>
    <td>{{item.batch}}</td>
    <td>
      <template>{{supplier(item)}}</template>
    </td>
    <td>
      <div class="inline-block items-center">
        <div class="bg-clip py-2 px-3 mt-2 rounded-lg inline-block">
          <vs-icon icon-pack="feather" :icon="state(item).icon" v-if="!state(item).icon_pack" />
          <vs-icon v-else :icon="state(item).icon" />
          <span class="karla item-text ml-2">{{state(item).text}}</span>
        </div>

        <div
          class="bg-clip py-2 px-3 rounded-lg ml-2 inline-block mt-2"
          v-for="(allergen,i) in item.allergens"
          :class="{'hidden': getAllergen(allergen)=== undefined || (i!=1 && !showAllAllergens)}"
          :key="i"
        >
          <div class="h-2 w-2 rounded-full mr-1 bg-primary inline-block"></div>
          <span class="karla item-text">{{getAllergen(allergen).name}}</span>
        </div>

        <div
          v-if="item.allergens.length>1"
          class="bg-clip py-2 px-3 rounded-lg ml-2 mt-2 inline-block cursor-pointer"
          @click="showAllAllergens=!showAllAllergens"
        >
          <span class="karla item-text mr-1" v-if="!showAllAllergens">+{{item.allergens.length-1}}</span>
          <vs-icon :icon="showAllAllergens ?  'arrow_drop_up':'arrow_drop_down' " class="times2" />
        </div>
      </div>
    </td>
    <td>
      <div class="con-vs-alert py-2" :class="`con-vs-alert-${expireDate(item).key}`">
        <div class="vs-alert p-0">
          <p class="karla text-center" v-if="expireDate(item).val == 'no'">{{$t('no expiry')}}</p>
          <p
            class="karla text-center"
            v-else
          >{{expireDate(item).val.getTime()-now.getTime()>0? $t("expire") : $t("expired") | capitalize}} {{expireDate(item).val.getTime()-now.getTime() | duration('humanize' , true) | capitalize}}</p>
        </div>
      </div>
    </td>
    <td>
      <vs-dropdown vs-custom-content class="cursor-pointer">
        <feather-icon icon="MoreVerticalIcon" class="p-2 cursor-pointer" style="height:2.6rem;" />
        <vs-dropdown-menu class="vx-navbar-dropdown">
          <ul style="min-width: 9rem" class="p-0">
            <li
              v-if="role<4"
              class="flex py-1 px-2 my-1 cursor-pointer hover:bg-primary hover:text-white"
              @click="$emit('process' , item.id)"
            >
              <feather-icon icon="DropletIcon" svgClasses="w-4 h-4"></feather-icon>
              <span class="ml-2 karla">{{$t("process")}}</span>
            </li>
            <li
              v-if="item.type=='prepared'"
              class="flex py-1 px-2 my-1 cursor-pointer hover:bg-primary hover:text-white"
              @click="$emit('indShow' , item)"
            >
              <feather-icon icon="GiftIcon" svgClasses="w-4 h-4"></feather-icon>
              <span class="ml-2 karla">{{$t("ingredient")}}</span>
            </li>
            <li
              class="flex py-1 px-2 my-1 cursor-pointer hover:bg-primary hover:text-white"
              @click="$emit('print' , item)"
            >
              <feather-icon icon="PrinterIcon" svgClasses="w-4 h-4"></feather-icon>
              <span class="ml-2 karla">{{$t("print")}}</span>
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
              v-if="role<4"
              class="flex py-1 px-2 my-1 cursor-pointer hover:bg-primary hover:text-white"
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
    </td>
  </tr>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showAllAllergens: false,
      now: new Date(),
    };
  },
  computed: {
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
        return `${item.measure.quantity} ${item.measure.unit}`;
      };
    },
    expireDate() {
      return (item) => {
        var e_date;
        if (item.forever)
          return { val: "no", date: this.$t("no expiry"), key: "success" };
        if (item.e_date.seconds !== undefined) e_date = item.e_date.toDate();
        else e_date = item.e_date;
        var key = "success";

        if (e_date.getTime() < this.now.getTime()) key = "danger";
        else if (e_date.getTime() < this.now.getTime() - 3600 * 24 * 1000)
          key = "warning";
        return {
          date: this.$moment(e_date).format("DD/MM/YYYY"),
          key,
          val: e_date,
        };
      };
    },
  },
};
</script>

<style scoped>
.pageTitle {
  font-size: 24px;
  color: #1e1c26;
}
.bg-clip {
  background: #ebebf1;
}

/* .fooditem-table tbody {
} */
tr {
  box-shadow: rgba(0, 0, 0, 0.05) 0px 4px 20px 0px;
}
tr td {
  padding: 1.5rem 10px;
  background: white;
  color: 1e1c26;
  font-family: "Karla";
}
tr td.quentity {
  text-align: center;
}
tr td:first-child {
  padding: 1.5rem 2rem;
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
}

tr td:last-child {
  border-top-right-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}
.fooditem-name {
  font-size: 14px;
}
.note {
  font-size: 12px;
}
.times2 {
  transition: all 0.2 ease;
  transform: rotate(0deg) scale(1.6);
}
.times2.rotate180 {
  transform: rotate(180deg) scale(1.6);
}
</style>
