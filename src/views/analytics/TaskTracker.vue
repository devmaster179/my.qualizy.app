<template>
  <div id="task-tracker">
    <vx-card :title="$t('task tracker')">
      <template slot="actions">
        <span class="text-medium text-success">{{timeRange}}</span>
      </template>
      <!-- CARD ACTION -->
      <div slot="no-body">
        <div class="vx-row text-center">
          <div class="vx-col sm:w-1/5 w-full flex flex-col justify-between mb-4">
            <div class="ml-6 mt-6">
              <h1 class="font-bold text-5xl">{{calcAllTaks.all}}</h1>
              <small>{{$t("tasks") | capitalize}}</small>
            </div>
          </div>
          <div class="vx-col sm:w-4/5 justify-center mx-auto">
            <vue-apex-charts
              type="radialBar"
              height="385"
              :options="chartData.chartOptions"
              :series="chartData.series"
            />
          </div>
        </div>
        <div class="flex flex-row justify-between px-8 pb-4">
          <p class="text-center">
            <span class="block">{{$t("task completed") | capitalize}}</span>
            <span class="text-4xl">{{calcAllTaks.completed}}</span>
          </p>
          <p class="text-center">
            <span class="block">{{$t("overdue tasks") | capitalize}}</span>
            <span class="text-4xl">{{calcAllTaks.overdue }}</span>
          </p>
        </div>
      </div>
    </vx-card>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
export default {
  components: {
    VueApexCharts
  },
  props: {
    filters: {
      type: Array
    }
  },
  data() {
    return {
      now: "",
      now1: "",
      chartData: {
        series: [0],
        chartOptions: {
          plotOptions: {
            radialBar: {
              size: 150,
              offsetY: -40,
              startAngle: -135,
              endAngle: 135,
              hollow: {
                size: "55%"
              },
              track: {
                // background: "rgba(0,0,0,0.1)",
                strokeWidth: "100%"
              },
              dataLabels: {
                value: {
                  offsetY: 30,
                  color: "#99a2ac",
                  fontSize: "2rem"
                }
              }
            }
          },
          colors: ["#EA5455"],
          fill: {
            type: "gradient",
            gradient: {
              // enabled: true,
              shade: "dark",
              type: "horizontal",
              shadeIntensity: 0.15,
              gradientToColors: ["#7367F0"],
              inverseColors: false,
              opacityFrom: 1,
              opacityTo: 1,
              stops: [0, 100]
            }
          },
          stroke: {
            dashArray: 8
          },
          chart: {
            sparkline: {}
          },
          labels: [this.$t("Completed Tasks")]
        }
      }
    };
  },
  computed: {
    timeRange() {
      var timeInfor = this.getTimeInfo();
      return (
        this.$moment(timeInfor.from).format("Do/MM/YYYY") +
        " ~ " +
        this.$moment(timeInfor.to).format("Do/MM/YYYY")
      );
    },
    calcAllTaks() {
      var schedules = this.$store.getters["app/schedules"];
      var completed = 0;
      var overdue = 0;
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
          if (
            templateFilter.value.find(item => item.id == schedule.template) ===
            undefined
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
          if (this.checkCompleted(task)) {
            completed++;
            if (this.overdueTask(task)) overdue++;
          }
        });
      });
      if (all > 0) {
        this.chartData.series = [Math.round((completed / all) * 1000) / 10];
        // this.data.chartOptions.plotOptions.radialBar.endAngle = Math.round(90 + 360*completed / all)
      }

      return { all: all, completed: completed, overdue: overdue };
    }
  },
  methods: {
    overdueTask(task) {
      var log = this.$store.getters["app/getLogByTidTime"](
        task.template,
        task.time
      );
      if (log.updated_at.toDate().getTime() > log.time.toDate().getTime())
        return true;
      return false;
    },
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
      var timeInfor = this.getTimeInfo();
      var diff =
        (timeInfor.to.getTime() - timeInfor.from.getTime()) /
        24 /
        60 /
        60 /
        1000;

      var tasks = [];
      var from = new Date(schedule.dueTimes[0].toDate());
      from = new Date(from.getFullYear(), from.getMonth(), from.getDate());
      for (let i = 0; i <= diff; i++) {
        var now1 = new Date(timeInfor.from.getTime() + 24 * 60 * 60 * 1000 * i);

        if (from.getTime() > now1.getTime()) continue;

        schedule.dueTimes.map(dueTime => {
          var time = new Date(
            now1.getFullYear(),
            now1.getMonth(),
            now1.getDate(),
            dueTime.toDate().getHours(),
            dueTime.toDate().getMinutes()
          );
          var day;
          var days;
          if (schedule._repeat === "No Repeat") {
            if (from.getTime() === now1.getTime())
              tasks.push({ time: time, template: schedule.template });
          } else if (schedule._repeat === "Daily")
            tasks.push({ time: time, template: schedule.template });
          else if (schedule._repeat === "Weekly") {
            day = this.now.getDay();
            days = [];
            schedule.selectedDays.map(day => {
              days.push(day.value);
            });
            if (days.indexOf(day) > -1)
              tasks.push({ time: time, template: schedule.template });
          } else if (schedule._repeat === "Monthly") {
            day = this.now.getDate();
            if (schedule.selectedDays.indexOf(day) > -1)
              tasks.push({ time: time, template: schedule.template });
          }
        });
      }
      return tasks;
    },
    getTimeInfo() {
      var from = this.filters.find(filter => filter.key == "from");
      var to = this.filters.find(filter => filter.key == "to");

      if (from === undefined)
        from = new Date(this.now1.getTime() - 10 * 24 * 60 * 60 * 1000);
      else
        from = new Date(
          from.value.getFullYear(),
          from.value.getMonth(),
          from.value.getDate()
        );
      if (to === undefined) to = this.now1;
      else
        to = new Date(
          to.value.getFullYear(),
          to.value.getMonth(),
          to.value.getDate()
        );

      return { from: from, to: to };
    }
  },
  created() {
    this.now = new Date();
    this.now1 = new Date(
      this.now.getFullYear(),
      this.now.getMonth(),
      this.now.getDate(),
      23,
      59,
      59
    );
    setInterval(() => {
      this.now = new Date();
      this.now1 = new Date(
        this.now.getFullYear(),
        this.now.getMonth(),
        this.now.getDate()
      );
    }, 60 * 60 * 1000);
  }
};
</script>