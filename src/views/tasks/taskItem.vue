<template>
  <vx-card class="w-full mb-4 cursor-pointer task-card">
    <div slot="no-body">
      <div
        v-if="role>1 && task.time!== undefined && calcTime(task.time)>0 && calcTime(task.time)<7200*1000"
        class="flex items-center mb-2 p-2 rounded-lg justify-center"
        style="background: rgba(var(--vs-danger) , .2); border-bottom-left-radius: 0!important; border-bottom-right-radius: 0!important;"
      >
        <vs-icon icon-pack="feather" icon="icon-clock" color="rgba(var(--vs-danger) , .8)"></vs-icon>

        <span
          class="karla-bold ml-2"
          style="font-size:12px;  color:rgba(var(--vs-danger) , .8);"
        >{{calcTime(task.time) | duration('humanize' , true) | leftTime}} left</span>
      </div>
      <div class="pt-8 pb-4 px-5">
        <div class="flex items-center mb-5">
          <img
            :src="require(`../../assets/images/template_image/${templateInfo(task.templateID).content.templateImage}`)"
            class="mr-4"
            :alt="templateInfo(task.templateID).content.templateTitle"
          />
          <div>
            <p
              class="karla-bold templateTitle"
            >{{templateInfo(task.templateID).content.templateTitle}}</p>
            <template v-if="task.schedule">
              <vs-icon size="12px" icon-pack="feather" icon="icon-map-pin"></vs-icon>
              <span class="karla locationText pl-1">{{scheduleLocation(task.schedule)}}</span>
            </template>
          </div>
        </div>
        <div class="flex justify-between">
          <p class="karla-bold dueText" v-if="task.time!==undefined">
            <!-- {{task.time.seconds!=undefined ? new Date(task.time.toDate()) : task.time}} -->
            <label v-if="progress" class="dueText text-primary">{{$t("in progress")}}</label>
            <label
              v-else
              class="dueText"
              :class="{'text-red':calcTime(task.time)<0}"
            >{{calcTime(task.time)<0 ? $t("overdue"): $t("to do") | capitalize}}</label>
            <span
              class="pl-2"
            >{{calcTime(task.time)<0 ? "" : 'Due'}} {{calcTime(task.time) | duration('humanize' , true) | capitalize}}</span>
          </p>
          <p
            class="text-primary karla-bold dueText"
            v-if="task.logs !==undefined && task.time===undefined"
          >{{$t('in progress')}}</p>
          <p
            class="karla-bold dueText"
            :class="{'text-red':calcProgressColor=='danger'}"
            v-if="!pinned || task.logs !==undefined"
          >{{calcComplete.text}}</p>
        </div>
        <vs-progress
          :percent="calcComplete.percent"
          :color="calcProgressColor"
          v-if="!pinned || task.logs!==undefined"
        ></vs-progress>
        <div
          v-for="(label, index) in templateInfo(task.templateID).content.templateLabel"
          :key="index"
          class="p-2 rounded-lg ml-1 templateLabelBadge inline-block mt-2"
          :class="[{'hidden': labelInfo(label) == undefined || (index !=1 && !labelColapes)}]"
        >
          <template v-if="labelInfo(label) != undefined">
            <div class="flex items-center">
              <div
                class="h-2 w-2 rounded-full mr-2"
                :style="'background-color:' + labelInfo(label).color"
              ></div>
              <p class="karla">{{labelInfo(label).name | truncate(20)}}</p>
            </div>
          </template>
        </div>
        <div
          v-if="templateInfo(task.templateID).content.templateLabel.length>1 && !labelColapes"
          class="p-2 rounded-lg ml-1 templateLabelBadge inline-block mt-2"
        >
          <span
            class="karla-bold"
          >+ {{templateInfo(task.templateID).content.templateLabel.length-1}}</span>
        </div>
        <div
          v-if="templateInfo(task.templateID).content.templateLabel.length>1"
          class="p-2 rounded-lg ml-1 templateLabelBadge text-right inline-block mt-2 ml-2"
          @click.stop="labelColapes = !labelColapes"
        >
          <vs-icon icon="arrow_drop_down" :class="{'rotate180':labelColapes}" class="times2" />
        </div>
        <div class="flex items-center justify-between mt-4" v-if="task.logs!==undefined">
          <div></div>
          <div class="flex items-center">
            <vs-icon icon-pack="feather" icon="icon-clock"></vs-icon>
            <span
              class="karla ml-2 locationText"
            >{{calcTime(task.updated_at)|duration('humanize' , true) | capitalize}}</span>
          </div>
        </div>
        <div class="flex items-center justify-between mt-2">
          <div>
            <vs-icon @click.stop="deleteLog"  v-if="progress ||  (task.logs !==undefined && task.time===undefined)" class="hover:text-red" icon-pack="feather" icon="icon-trash-2" size="18px"/>
          </div>
          <div class="flex items-center mt-1 text-black" v-if="monitor">
            <span class="karla mr-1 ">{{$t('monitoring')}}</span>
            <vs-icon icon-pack="feather" icon="icon-eye" class="mt-1" />
          </div>
        </div>
      </div>
    </div>
  </vx-card>
</template>

<script>
import { db } from "@/firebase/firebaseConfig";

export default {
  props: {
    progress: {
      type: Boolean,
      default: false,
    },
    pinned: {
      type: Boolean,
      default: false,
    },
    task: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      labelColapes: false,
      now: new Date(),
    };
  },
  methods: {
    deleteLog() {
      if(!this.auth('delete')) {
        this.roleError('delete')
        return false
      }
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: this.$t(`are you sure to delete ?`),
        text: `${this.$t("you are about to delete")}`,
        accept: this.deleteLog1,
        acceptText: this.$t("delete"),
        cancelText: this.$t("cancel"),
      });
    },
    deleteLog1() {
      db.collection("logs").doc(this.task.id).delete()
      this.$store.commit('app/DELETE_LOG' , this.task.id)
    },
    roleError(action) {
      this.$vs.notify({
        time: 5000,
        title: "Authorization Error",
        text:
          `You don't have authorization for ${action} log.\n Please contact with your super admin`,
        color: "danger",
        iconPack: "feather",
        icon: "icon-lock",
        // position:'bottom-center'
      });
    }
  },
  computed: {
    auth() {
      return action => {
        let authList = this.$store.getters['app/auth']
        var cUser = this.$store.getters["app/currentUser"];
        if(cUser == undefined || cUser.role == undefined) return false
        else if(cUser.role.key == 0) 
          return true
        else if(authList.records[cUser.role.name.toLowerCase()][action])
          return true
        else 
          return false
      }
    },
    scheduleLocation() {
      return id => {
        if(!id) return this.$t('no location')
        let schedule = this.$store.getters['app/getScheduleById'](id)
        if(!schedule || !schedule.location) return this.$t('no location')
        var location = this.$store.getters['app/getLocationById'](schedule.location[0])
        if(!location)  return this.$t('no location')
        return location.name
      }
    },
    monitor() {
      if(this.task.schedule == undefined) return false
      let schedule = this.$store.getters['app/getScheduleById'](this.task.schedule)
      var cUser = this.$store.getters["app/currentUser"];
      var cTeam = cUser.team || []
      if(!Array.isArray(cTeam)) cTeam = []
      return !cTeam.some(ct=>schedule.assign.includes(ct))
    },
    role() {
      var cUser = this.$store.getters["app/currentUser"];
      if (cUser == undefined || cUser.role === undefined) {
        return 4;
      }
      return cUser.role.key;
    },
    calcProgressColor() {
      if (this.pinned) return "primary";
      else {
        return this.calcTime(this.task.time) < 0 ? "danger" : "primary";
      }
    },
    calcComplete() {
      var total = 0,
        complated = 0;
      if (this.task.logs === undefined) {
        let template = this.templateInfo(this.task.templateID);
        template.content.pages.map((page) => {
          page.questions.map((question) => {
            question.answers.map((answer) => {
              if (answer.mandatory) total++;
            });
          });
        });
      } else {
        this.task.logs.map((page) => {
          page.questions.map((question) => {
            question.answers.map((answer) => {
              if (answer.ref.mandatory) {
                total++;
                if (answer.loged) complated++;
              }
            });
          });
        });
      }
      return {
        percent: total == 0 ? 0 : Math.round((complated * 100) / total),
        text: `${complated}/${total}`,
      };
    },
    templateLocation() {
      return (id) => {
        let template = this.templateInfo(id);
        if (
          template.content.location === undefined ||
          template.content.location.length == 0
        )
          return this.$t("no location");
        else {
          var locations = template.content.location
          locations = locations.filter(item=> !!this.$store.getters["app/getLocationById"](item))
          if(locations.length == 0)
            return this.$t("no location");
          else {
            let location = this.$store.getters["app/getLocationById"](
              template.content.location[0]
            ).name;
            if (locations.length == 1) return location;
            else return `${location} + ${locations.length - 1}`;
          }
        }
      };
    },
    calcTime() {
      return (time) => {
        if (time.nanoseconds !== undefined)
          return time.toDate().getTime() - this.now.getTime();

        return time.getTime() - this.now.getTime();
      };
    },
    templateInfo() {
      return (id) => {
        return this.$store.getters["app/getTemplateById"](id);
      };
    },
    labelInfo() {
      return (id) => {
        return this.$store.getters["app/getLabelById"](id);
      };
    },
  },
  created() {
    setInterval(() => {
      this.now = new Date();
    }, 1000);
  },
};
</script>
<style scoped>
.dueText.text-red {
  color: #b10000;
}
.times2 {
  transition: all 0.2 ease;
  transform: rotate(0deg) scale(1.6);
}
.times2.rotate180 {
  transform: rotate(180deg) scale(1.6);
}
.templateTitle {
  font-size: 16px;
}
.locationText {
  font-size: 12px;
  color: #1e1c26;
  opacity: 0.7;
}
.dueText {
  color: #1f1c2dc4;
}
.templateLabelBadge {
  background: #f5f5fa;
}
.task-card:hover {
  transform: translateY(-5px);
  box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.25);
}
</style>