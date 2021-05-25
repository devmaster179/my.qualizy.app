<template>
  <div id="food-items" class="px-2">
    <template v-if="!auth('food items', 'view')">
      <no-auth />
    </template>
    <template v-else>
      <template v-if="!isSidebarActive">
        <div class="items-center justify-between sm:flex">
          <p class="pageTitle karla-bold">
            {{ $t("food items") | capitalize }}
          </p>
          <div class="justify-end page-tools sm:flex">
            <div class="flex justify-end">
              <feather-icon
                @click="printAllergy()"
                icon="PrinterIcon"
                class="hidden p-2 ml-2 rounded-lg cursor-pointer card d-theme-dark-bg md:block"
                style="height:40px;"
              />
              <feather-icon
                @click="viewMode = 'card'"
                icon="GridIcon"
                class="hidden p-2 ml-2 rounded-lg cursor-pointer d-theme-dark-bg md:block"
                :class="{ 'text-primary': viewMode == 'card' }"
                style="height:40px;"
              />
              <feather-icon
                @click="viewMode = 'list'"
                icon="ListIcon"
                :class="{ 'text-primary': viewMode == 'list' }"
                class="hidden p-2 mx-2 rounded-lg cursor-pointer d-theme-dark-bg md:block"
                style="height:40px;"
              />
              <vs-input
                class="hidden bg-white md:block"
                v-model="search"
                :placeholder="$t('Search')"
                icon="icon-search"
                icon-pack="feather"
                icon-no-border
              />
              <feather-icon
                v-if="role < 4"
                @click="activeUpload = true"
                icon="DownloadIcon"
                class="ml-2 rounded-lg cursor-pointer d-theme-dark-bg"
                style="height:40px; width:40px; padding:.6rem"
              />
              <feather-icon
                @click="activeFilter = true"
                icon="FilterIcon"
                class="ml-2 rounded-lg cursor-pointer d-theme-dark-bg"
                style="height:40px; width:40px; padding:.7rem"
              />
              <vs-button @click="addFoodItem" class="ml-2">
                <span class="karla"
                  >+ {{ $t("add food item") | capitalize }}</span
                >
              </vs-button>
            </div>
          </div>
        </div>
        <div class="video-launcher">
          <a href="#" @click="howtoTemplate">{{
            $t("Watch this video to see how it works")
          }}</a>
        </div>
        <vs-input
          class="block w-full my-2 bg-white md:hidden"
          v-model="search"
          :placeholder="$t('Search')"
          icon="icon-search"
          icon-pack="feather"
          icon-no-border
        />

       <div ref="exportPdf" v-show="false">
          <allergies-print :allergens="allergens" :fooditems="fooditems" :user="user" />
       </div>

        <div class="page-content">
          <template v-if="fooditems.length > 0">
            <div
              class="w-full card-view vx-row mt-base"
              v-if="viewMode == 'card'"
            >
              <div
                class="w-full p-0 vx-col lg:w-1/4 md:w-2/1 sm:w-1/2 sm:px-2"
                v-for="(item, index) in fooditems"
                :key="index"
              >
                <card-view
                  :item="item"
                  @edit="edit"
                  @remove="remove"
                  @print="print"
                  @history="history"
                  @process="process"
                  @duplicate="duplicate"
                  @indShow="indShow"
                />
              </div>
            </div>
            <div class="list-view" v-else>
              <table class="w-full fooditem-table">
                <thead>
                  <tr>
                    <th width="15%">{{ $t("name") }}</th>
                    <th>{{ $t("expiry") }}</th>
                    <th>{{ $t("created") }}</th>
                    <th>{{ $t("quantity") }}</th>
                    <th>{{ $t("batch number") }}</th>
                    <th>{{ $t("supplier") }}</th>
                    <th width="18%">{{ $t("tags") }}</th>
                    <th width="10%">{{ $t("status") }}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <list-view
                    v-for="(item, index) in fooditems"
                    :key="index"
                    :item="item"
                    @edit="edit"
                    @remove="remove"
                    @print="print"
                    @process="process"
                    @history="history"
                    @duplicate="duplicate"
                    @indShow="indShow"
                  />
                </tbody>
              </table>
            </div>
          </template>
          <template v-else>
            <div class="flex w-full mt-base">
              <div
                class="flex flex-col items-center justify-center mx-auto mt-0 text-center vx-col sm:w-1/2 md:w-3/5 lg:w-3/4 xl:w-1/2 sm:mt-base"
              >
                <img
                  :src="require('@/assets/images/pages/report/empty-docs.svg')"
                  class="mx-auto mb-4"
                />
                <h5
                  class="mx-4 mb-4 sm:mx-0 sm:text-2xl sm:text-1xl d-theme-heading-color"
                >
                  {{ $t("You don’t have any food items yet") }},
                  {{ $t("would you like to create one") }}?
                </h5>
                <vs-button class="ml-2" @click="addFoodItem">{{
                  $t("add food item")
                }}</vs-button>
              </div>
            </div>
          </template>
        </div>
      </template>

      <fooditem-type
        :open="activeType"
        @close="activeType = false"
        @selectType="selectType"
      />
      <fooditemadd-sidebar
        :item="selectedItem"
        :type="type"
        :open="activeAdd"
        :duplicateFlag="duplicateFlag"
        @close="activeAdd = false"
      />
      <fooditem-filter
        :activeFilter="activeFilter"
        @filter="filter"
        @close="activeFilter = false"
      />
      <fooditem-history
        :open="activeHistory"
        :id="historyID"
        @close="activeHistory = false"
      />
      <fooditem-print
        :open="activePrint"
        :item="printItem"
        @close="activePrint = false"
      />
      <fooditem-upload :open="activeUpload" @close="activeUpload = false" />
      <fooditem-process
        :open="activeProcess"
        @close="activeProcess = false"
        @assginTemplate="assginTemplate"
      />
      <log-sidebar
        parent="#food-items"
        :logID="logID"
        :pages="pages"
        :template="template"
        :isSidebarActive="isSidebarActive"
        @closeSidebar="isSidebarActive = false"
      />
      <fooditem-ingredient
        :item="showInd"
        :open="activeIngredient"
        @close="activeIngredient = false"
      />
    </template>
  </div>
</template>
<script>
// import FooditemAdd from "./FooditemAdd";
import FooditemIngredient from "./FooditemIngredient";
import FooditemType from "./FooditemType";
import FooditemaddSidebar from "./FooditemaddSidebar";
import FooditemUpload from "./FooditemUpload";
import FooditemFilter from "./FooditemFilter";
import CardView from "./CardView";
import ListView from "./ListView";
import FooditemHistory from "./FooditemHistory";
import FooditemPrint from "./FooditemPrint";
import FooditemProcess from "./FooditemProcess";
import AllergiesPrint from "./AllergiesPrint.vue";
import LogSidebar from "../tasks/LogSidebar";
import { db } from "@/firebase/firebaseConfig";
import NoAuth from "@/components/no-auth/NoAuth";

import html2pdf from "html2pdf.js";

export default {
  components: {
    FooditemaddSidebar,
    FooditemFilter,
    FooditemType,
    FooditemHistory,
    FooditemPrint,
    FooditemUpload,
    CardView,
    ListView,
    FooditemProcess,
    LogSidebar,
    FooditemIngredient,
    NoAuth,
    AllergiesPrint,
  },
  data() {
    return {
      activeIngredient: false,
      duplicateFlag: false,
      showAllAllergens: false,
      activeUpload: false,
      activePrint: false,
      printItem: {},
      showInd: {},
      activeHistory: false,
      historyID: "",
      now: new Date(),
      selectedItem: {},
      type: "",
      activeType: false,
      activeFilter: false,
      filters: {},
      search: "",
      activeAdd: false,
      viewMode: "card",
      processID: "",
      activeProcess: false,
      logID: "",
      pages: [],
      template: "",
      isSidebarActive: false,
    };
  },
  methods: {
    printAllergy() {
      const file_name = this.user.name+" Allergens Quick Index";
      const reportComponent = this.$refs.exportPdf.innerHTML;
      const pdfOptions = {
        margin: 0.2,
        image: { type: "jpeg", quality: 2 },
        html2canvas: {
          scale: 2,
        },
        jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
        filename: file_name + ".pdf",
        pagebreak: {
          before: ".beforeClass",
          after: ["#after1", "#after2"],
          avoid: "img",
        },
      };
      html2pdf()
        .from(reportComponent)
        .set(pdfOptions)
        .toPdf()
        .get("pdf")
        .then(function(pdf) {
          const allPages = pdf.internal.getNumberOfPages();
          const pdfPages = pdf.internal.getNumberOfPages() - 1;

          const pageUrl = window.location.href;

          const d = new Date();
          const pdfDate =
            d.getMonth() + "/" + d.getDate() + "/" + d.getFullYear();

          for (let i = 1; i <= pdfPages; i++) {
            pdf.setPage(i);
            pdf.setFontSize(10);
            pdf.setTextColor("#000");
            pdf.deletePage(allPages);
            pdf.text(
              i + "/" + pdfPages,
              pdf.internal.pageSize.getWidth() - 0.9,
              pdf.internal.pageSize.getHeight() - 0.3
            );
            pdf.text(
              pageUrl,
              pdf.internal.pageSize.getWidth() - 8.2,
              pdf.internal.pageSize.getHeight() - 0.3
            );
            pdf.text(
              file_name,
              pdf.internal.pageSize.getWidth() / 2.3,
              pdf.internal.pageSize.getHeight() - 10.3
            );
            pdf.text(
              pdfDate,
              pdf.internal.pageSize.getWidth() - 7.3,
              pdf.internal.pageSize.getHeight() - 10.3
            );
          }
        })
        .save();
    },
    howtoTemplate(event) {
      event.preventDefault();
      this.$userflow.start("3eb696b5-0344-41fd-9143-5d61ee1b1bd7");
    },
    addFoodItem() {
      if (!this.auth("food items", "create")) {
        this.roleError("create");
        return false;
      }
      this.selectedItem = {};
      this.duplicateFlag = false;
      this.activeType = true;
    },
    roleError(action) {
      this.$vs.notify({
        time: 5000,
        title: "Authorization Error",
        text: `You don't have authorization for ${action}.\n Please contact with your super admin`,
        color: "danger",
        iconPack: "feather",
        icon: "icon-lock",
      });
    },
    async assginTemplate(task) {
      var that = this;
      var cUser = this.$store.getters["app/currentUser"];
      if (cUser == undefined || cUser.role === undefined) {
        this.roleError();
        return false;
      }
      if (cUser.role.key > 3) {
        this.roleError();
        return false;
      }
      this.$vs.loading();
      var pages = [];
      let template = this.$store.getters["app/getTemplateById"](
        task.templateID
      );
      template.content.pages.map((page, pIndex) => {
        var questions = [];
        page.questions.map((question, qIndex) => {
          var answers = [];
          question.answers.map((answer, aIndex) => {
            var date = new Date();
            let answerType = this.$store.getters["app/getTemplateTypeById"](
              answer.type.id
            );
            if (answerType == undefined) return;

            if (
              (answerType.type == "opened answers" &&
                answerType.content == "number") ||
              answerType.content == "temperature" ||
              answerType.content == "score" ||
              answerType.content == "star"
            )
              answers.push({
                ref: answer,
                loged: false,
                value: 0,
                time: "",
                user: "",
              });
            else if (answerType.content == "items")
              answers.push({
                ref: answer,
                loged: true,
                value: this.processID,
                time: new Date(),
                user: JSON.parse(localStorage.getItem("userInfo")).id,
              });
            else if (answerType.content == "date")
              answers.push({
                ref: answer,
                loged: false,
                value: "",
                time: "",
                user: "",
              });
            else if (answerType.content == "automatic date and time stamp")
              answers.push({
                ref: answer,
                loged: true,
                value: new Date(),
                time: date,
                user: JSON.parse(localStorage.getItem("userInfo")).id,
              });
            else if (answerType.content == "automatic user stamp")
              answers.push({
                ref: answer,
                loged: true,
                value: JSON.parse(localStorage.getItem("userInfo")).id,
                time: date,
                user: JSON.parse(localStorage.getItem("userInfo")).id,
              });
            else if (answerType.type == "attachments")
              answers.push({
                ref: answer,
                loged: false,
                images: [],
                time: "",
                user: "",
              });
            else if (answerType.content == "instruction")
              answers.push({
                ref: answer,
                loged: true,
                value: "",
                time: date,
                user: JSON.parse(localStorage.getItem("userInfo")).id,
              });
            else
              answers.push({
                ref: answer,
                loged: false,
                value: "",
                time: "",
                user: "",
              });
          });
          questions.push({ answers: answers, title: question.title });
        });
        pages.push({ questions: questions, title: page.title });
      });
      var updated_at = new Date();
      db.collection("logs").add({
        key: "pinned",
        initial: false,
        templateID: task.templateID,
        logs: pages,
        updated_at: updated_at,
        updated_by: JSON.parse(localStorage.getItem("userInfo")).id,
        group: JSON.parse(localStorage.getItem("userInfo")).group,
      });

      that.getLogID(updated_at, task.templateID).then((id) => {
        that.$vs.loading.close();
        that.logID = id;
        that.pages = pages;
        that.template = task.templateID;
        that.isSidebarActive = true;
      });
    },

    getLogID(createdAt, templateID) {
      return new Promise((resolve, reject) => {
        var id = "";
        var date = "";
        db.collection("logs")
          .where(
            "group",
            "==",
            JSON.parse(localStorage.getItem("userInfo")).group
          )
          .where("updated_at", "==", createdAt)
          .onSnapshot({ includeMetadataChanges: true }, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
              if (change.type === "added") {
                if (change.doc.data().updated_at.nanoseconds !== undefined)
                  date = change.doc.data().updated_at.toDate();
                else date = change.doc.data().updated_at;
                if (
                  date.getTime() == createdAt.getTime() &&
                  change.doc.data().templateID == templateID
                )
                  id = change.doc.id;
              }
            });
            if (id != "") resolve(id);
          });
      });
    },

    process(id) {
      if (!this.auth("records", "create")) {
        this.roleError("create log");
        return false;
      }
      this.processID = id;
      this.activeProcess = true;
    },
    history(item) {
      this.historyID = item.id;
      this.activeHistory = true;
    },
    print(item) {
      this.printItem = item;
      this.activePrint = true;
    },
    remove(item) {
      if (!this.auth("food items", "delete")) {
        this.roleError("delete");
        return false;
      }
      this.deleteID = item.id;
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: this.$t(`are you sure to delete ?`),
        text: `${this.$t("you are about to delete")} "${item.name}"`,
        accept: this.deleteRecord,
        acceptText: this.$t("delete"),
        cancelText: this.$t("cancel"),
      });
    },
    deleteRecord() {
      db.collection("fooditems")
        .doc(this.deleteID)
        .update({
          deleted: true,
          updated_at: new Date(),
          updated_by: JSON.parse(localStorage.getItem("userInfo")).id,
        });
    },
    duplicate(item) {
      if (!this.auth("food items", "create")) {
        this.roleError("create");
        return false;
      }
      this.duplicateFlag = true;
      this.selectedItem = item;
      if (item.type === undefined) this.type = "delivered";
      else this.type = item.type;
      this.activeAdd = true;
    },
    indShow(item) {
      this.showInd = item;
      this.activeIngredient = true;
    },
    edit(item) {
      if (!this.auth("food items", "edit")) {
        this.roleError("edit");
        return false;
      }
      this.duplicateFlag = false;
      this.selectedItem = item;
      if (item.type === undefined) this.type = "delivered";
      else this.type = item.type;
      this.activeAdd = true;
    },
    filter(val) {
      this.filters = val;
    },
    selectType(val) {
      this.type = val;
      this.activeType = false;
      this.activeAdd = true;
    },
  },
  computed: {
    auth() {
      return (sub, action) => {
        let authList = this.$store.getters["app/auth"];
        var cUser = this.$store.getters["app/currentUser"];
        if (cUser == undefined || cUser.role == undefined) return false;
        else if (cUser.role.key == 0) return true;
        else if (authList[sub][cUser.role.name.toLowerCase()][action])
          return true;
        else return false;
      };
    },
    user() {
      return this.$store.getters["app/currentUser"];
    },
    role() {
      var cUser = this.$store.getters["app/currentUser"];
      if (cUser == undefined || cUser.role === undefined) {
        return 4;
      }
      return cUser.role.key;
    },
    fooditems() {
      let fooditems = this.$store.getters["app/items"]
        .filter((item) => {
          if (item.deleted !== undefined && item.deleted) return false;
          var e_date = item.e_date.toDate();
          e_date = new Date(
            e_date.getFullYear(),
            e_date.getMonth(),
            e_date.getDate()
          );

          if (item.name.toLowerCase().indexOf(this.search.toLowerCase()) < 0)
            return false;
          if (
            this.filters.expire !== undefined &&
            this.filters.expire.from != "" &&
            !item.forever
          ) {
            var from = this.filters.expire.from;
            from = new Date(
              from.getFullYear(),
              from.getMonth(),
              from.getDate()
            );
            if (e_date.getTime() < from.getTime()) return false;
          }
          if (
            this.filters.expire !== undefined &&
            this.filters.expire.to != "" &&
            !item.forever
          ) {
            var to = this.filters.expire.to;
            to = new Date(to.getFullYear(), to.getMonth(), to.getDate());
            if (e_date.getTime() > to.getTime()) return false;
          }

          if (
            this.filters.created !== undefined &&
            this.filters.created != ""
          ) {
            var created = item.created_at.toDate();
            created = new Date(
              created.getFullYear(),
              created.getMonth(),
              created.getDate()
            );
            var fCreated = this.filters.created;
            fCreated = new Date(
              fCreated.getFullYear(),
              fCreated.getMonth(),
              fCreated.getDate()
            );

            if (created.getTime() != fCreated.getTime()) return false;
          }
          if (this.filters.state !== undefined && this.filters.state != "") {
            if (this.filters.state == "no") {
              if (!item.forever) return false;
            } else if (this.filters.state == "expired") {
              var now = new Date();
              now = new Date(now.getFullYear(), now.getMonth(), now.getDate());
              if (e_date.getTime() >= now.getTime() || item.forever)
                return false;
            }
          }

          if (
            this.filters.allergens !== undefined &&
            this.filters.allergens.length > 0
          ) {
            if (
              !item.allergens.some((allergen) =>
                this.filters.allergens.includes(allergen)
              )
            )
              return false;
          }
          if (this.$store.getters["app/locationList"].length > 0) {
            let user = this.$store.getters["app/getUserById"](item.updated_by);
            if (
              !(
                user &&
                user.location &&
                this.$store.getters["app/locationList"].some((location) =>
                  user.location.includes(location)
                )
              )
            )
              return false;
          }

          return true;
        })
        .sort(
          (a, b) =>
            b.updated_at.toDate().getTime() - a.updated_at.toDate().getTime()
        );
      return fooditems;
    },
    allergens() {
      return this.$store.getters["app/allergens"];
    },
  },
};
</script>
<style scoped>
.pageTitle {
  font-size: 24px;
  color: #1e1c26;
}
</style>
<style scoped>
.bg-clip {
  background: #ebebf1;
}
.fooditem-table {
  border-collapse: separate;
  border-spacing: 0px 1.3rem;
}
.fooditem-table thead tr th {
  font-family: "Karla";
  font-size: 14px;
  color: #1e1c26;
}
.fooditem-table thead tr th:first-child {
  padding-left: 2rem;
}

/* .fooditem-table tbody {
} */
.export_table {
  border: black;
  border-style: solid;
}
.fooditem-table tbody tr {
  box-shadow: rgba(0, 0, 0, 0.05) 0px 4px 20px 0px;
}
.fooditem-table tbody tr td {
  padding: 1.5rem 10px;
  background: white;
  color: 1e1c26;
  font-family: "Karla";
}
.fooditem-table tbody tr td.quentity {
  text-align: center;
}
.fooditem-table tbody tr td:first-child {
  padding: 1.5rem 2rem;
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
}

.fooditem-table tbody tr td:last-child {
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
.video-launcher {
  font-size: 10px;
  height: 12px;
  color: #844cf5;
}
</style>
<style>
.con-vs-dropdown--menu {
  z-index: 52000;
}
</style>
