<template>
  <div id="congratulation">
    <vx-card slot="no-body" class="text-center bg-primary-gradient greet-user">
      <img
        src="../../assets/images/elements/decore-left.png"
        class="decore-left"
        alt="Decore Left"
        width="200"
      />
      <img
        src="../../assets/images/elements/decore-right.png"
        class="decore-right"
        alt="Decore Right"
        width="175"
      />
      <feather-icon
        icon="AwardIcon"
        class="p-6 mb-8 bg-primary inline-flex rounded-full text-white shadow"
        svgClasses="h-8 w-8"
      ></feather-icon>
      <h1 class="mb-6 text-white">{{$t("congratulations") | capitalize}} {{ name | capitalize }}</h1>
      <p
        class="xl:w-3/4 lg:w-4/5 md:w-2/3 w-4/5 mx-auto text-white"
        v-if="taskComplete()==''"
      >{{$t("You have no any task today")}} {{$t("Check your new badge in your profile")}}.</p>
      <p class="xl:w-3/4 lg:w-4/5 md:w-2/3 w-4/5 mx-auto text-white" v-else>
        {{$t("You have completed")}}
        <strong>{{taskComplete()}}</strong>
        {{$t("of your task today")}}.{{$t("Check your new badge in your profile")}}.
      </p>
    </vx-card>
  </div>
</template>
<script>
export default {
  props: {
    filters: {
      type: Array
    }
  },
  data() {
    return {
      now: new Date()
    };
  },
  computed: {
    name() {
      return JSON.parse(localStorage.getItem("userInfo")).name;
    },
    taskComplete() {
      return () => {
        var schedules = this.$store.getters["app/schedules"];
        var completed = 0;
        var all = 0;
        var tasks = [];
        var currentUser = this.$store.getters["app/getUserById"](
          JSON.parse(localStorage.getItem("userInfo")).id
        );
        if (currentUser == undefined) return "";
        var currentTeam = currentUser.team;
        if (currentTeam == undefined) return "";
        schedules = schedules.filter(schedule =>
          schedule.assign.some(item => currentTeam.includes(item))
        );
        schedules.map(schedule => {
          if (schedule.deleted) return;
          var template = this.$store.getters["app/getTemplateById"](
            schedule.template
          );
          if (template === undefined) return;
          var templateFilter = this.filters.find(
            filter => filter.key == "template"
          );
          var labelFilter = this.filters.find(filter => filter.key == "label");
          if (templateFilter !== undefined) {
            var _templateFilter = [];
            if (
              templateFilter.value.find(
                item => item.id == schedule.template
              ) === undefined
            )
              return;
          }
          if (labelFilter !== undefined) {
            var _labelFilter = [];
            labelFilter.value.map(item => {
              _labelFilter.push(item.id);
            });
            _labelFilter = _labelFilter.join();
            var flag = false;
            template.content.templateLabel.map(label => {
              if (flag) return;
              if (_labelFilter.indexOf(label) > -1) flag = true;
            });
            if (!flag) return;
          }
          tasks = this.getTasks(schedule);
          tasks.map(task => {
            if (task.time === undefined) return;
            all++;
            if (this.checkCompleted(task)) completed++;
          });
        });

        if (all == 0) return "";
        else return Math.round((completed / all) * 10000) / 100 + "%";
      };
    }
  },
  methods: {
    checkCompleted(task) {
      var log = this.$store.getters["app/getLogByTidTime"](
        task.template,
        task.time
      );
      if (log === undefined) return false;
      var result = true;
      log.logs.map(page => {
        page.questions.map(question => {
          question.answers.map(answer => {
            if (answer.ref.mandatory) {
              result = result && answer.loged;
            }
          });
        });
      });
      return result;
    },
    getTasks(schedule) {
      var tasks = [];
      var from = new Date(schedule.dueTimes[0].toDate());
      from = new Date(from.getFullYear(), from.getMonth(), from.getDate());
      var _now = new Date(
        this.now.getFullYear(),
        this.now.getMonth(),
        this.now.getDate()
      );

      if (from.getTime() > _now.getTime()) return [];

      schedule.dueTimes.map(dueTime => {
        var time = new Date(
          this.now.getFullYear(),
          this.now.getMonth(),
          this.now.getDate(),
          dueTime.toDate().getHours(),
          dueTime.toDate().getMinutes()
        );
        if (schedule._repeat === "No Repeat") {
          if (from.getTime() === _now.getTime())
            tasks.push({ time: time, template: schedule.template });
        } else if (schedule._repeat === "Daily")
          tasks.push({ time: time, template: schedule.template });
        else if (schedule._repeat === "Weekly") {
          var day = this.now.getDay();
          var days = [];
          schedule.selectedDays.map(day => {
            days.push(day.value);
          });
          if (days.indexOf(day) > -1)
            tasks.push({ time: time, template: schedule.template });
        } else if (schedule._repeat === "Monthly") {
          var day = this.now.getDate();
          if (schedule.selectedDays.indexOf(day) > -1)
            tasks.push({ time: time, template: schedule.template });
        }
      });
      return tasks;
    }
  },
  created() {
    setInterval(() => {
      this.now = new Date();
    }, 1000 * 60);
  }
};
</script>