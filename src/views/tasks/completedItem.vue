<template>
  <vx-card class="w-full mb-4 cursor-pointer task-card">
    <div slot="no-body" class>
      <div
        v-if="task.time!==undefined && calcOverTime<0"
        class="flex items-center mb-2 p-2 rounded-lg justify-center"
        style="background: rgba(var(--vs-danger) , .2); border-bottom-left-radius: 0!important; border-bottom-right-radius: 0!important;"
      >
        <vs-icon icon-pack="feather" icon="icon-clock" color="rgba(var(--vs-danger) , .8)"></vs-icon>
        <span
          class="karla-bold ml-2"
          style="font-size:12px; color:rgba(var(--vs-danger) , .8);"
        >{{$t('overdue')}}</span>
        <span
          class="karla-bold ml-2"
          style="font-size:12px;  color:rgba(var(--vs-danger) , .8);"
        >{{calcOverTime | duration('humanize' , true) | capitalize}}</span>
      </div>
      <div class="py-8 px-5">
        <div class="flex items-center mb-5">
          <img
            :src="require(`../../assets/images/template_image/${templateInfo(task.templateID).content.templateImage}`)"
            width="48px"
            height="48px"
            class="mr-4"
          />
          <div>
            <p
              class="karla-bold templateTitle"
            >{{templateInfo(task.templateID).content.templateTitle}}</p>
            <!-- <vs-icon size="12px" icon-pack="feather" icon="icon-map-pin"></vs-icon>
            <span class="karla locationText pl-1">{{templateLocation(task.templateID)}}</span> -->
          </div>
        </div>
        <div class="flex justify-between">
          <p class="karla-bold dueText">
            <label class="text-success">{{$t('completed')}}</label>
            <span
              class="pl-2"
            >{{calcTime(task.updated_at) | duration('humanize' , true) | capitalize}}</span>
          </p>
          <p v-if="task.logs !==undefined && pinned"></p>
          <p class="karla-bold text-success">{{calcComplete.text}}</p>
        </div>
        <vs-progress
          :percent="calcComplete.percent"
          color="success"
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
      </div>
    </div>
  </vx-card>
</template>

<script>
export default {
  props: {
    pinned: {
      type: Boolean,
      default: false
    },
    task: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      labelColapes: false,
      now: new Date()
    };
  },
  computed: {
    calcOverTime() {
      var dueTime, logTime;
      if (this.task.time === undefined) return -1;
      if (this.task.time.nanoseconds === undefined) dueTime = this.task.time;
      else dueTime = this.task.time.toDate();
      if (this.task.updated_at.nanoseconds === undefined)
        logTime = this.task.updated_at;
      else logTime = this.task.updated_at.toDate();
      return dueTime.getTime() - logTime.getTime();
    },
    calcComplete() {
      var total = 0,
        complated = 0;
      if (this.task.logs === undefined) {
        let template = this.templateInfo(this.task.templateID);
        template.content.pages.map(page => {
          page.questions.map(question => {
            question.answers.map(answer => {
              if (answer.mandatory) total++;
            });
          });
        });
      } else {
        this.task.logs.map(page => {
          page.questions.map(question => {
            question.answers.map(answer => {
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
        text: `${complated}/${total}`
      };
    },
    templateLocation() {
      return id => {
        let template = this.templateInfo(id);
        if (
          template.content.location === undefined ||
          template.content.location.length == 0
        )
          return this.$t("no location");
        else {
          let location = this.$store.getters["app/getLocationById"](
            template.content.location[0]
          ).name;
          if (template.content.location.length == 1) return location;
          else return `${location} + ${template.content.location.length - 1}`;
        }
      };
    },
    calcTime() {
      return time => {
        if (time.nanoseconds !== undefined)
          return time.toDate().getTime() - this.now.getTime();

        return time.getTime() - this.now.getTime();
      };
    },
    templateInfo() {
      return id => {
        return this.$store.getters["app/getTemplateById"](id);
      };
    },
    labelInfo() {
      return id => {
        return this.$store.getters["app/getLabelById"](id);
      };
    }
  },
  created() {
    setInterval(() => {
      this.now = new Date();
    }, 1000);
  }
};
</script>
<style scoped>
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
  color: #1e1c26;
}
.dueText span {
  opacity: 0.54;
}
.templateLabelBadge {
  background: #f5f5fa;
}
.templateLabelBadge p {
  color: 0;
  opacity: 0.54;
}
.task-card:hover {
  transform: translateY(-5px);
  box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.25);
}
</style>