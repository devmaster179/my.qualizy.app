<template>
    <div class="p-4 mt-4" v-if="template">
        <div class="vx-row w-full">
            <div class="px-2 vx-col md:w-1/4 sm:w-1/2 w-full my-1" v-if="score">
                <div class="rounded-lg border border-solid d-theme-border-grey-light p-4">
                    <div class="text-center">
                        <feather-icon
                            class="text-primary p-3 inline-flex rounded-full"
                            icon="EyeIcon"
                            style="background: rgba(var(--vs-primary),.15);"
                        />
                    </div>
                    <h2 class="text-center mt-4 mb-2 font-bold">{{ reportInfo.score }}</h2>
                    <p class="text-center">{{$t("general score")}}</p>
                </div>
            </div>
            <div class="px-2 vx-col md:w-1/4 sm:w-1/2 w-full my-1 sm:mt-0" v-if="compliance">
                <div class="rounded-lg border border-solid d-theme-border-grey-light p-4">
                    <div class="text-center">
                        <feather-icon
                            class="p-3 inline-flex rounded-full"
                            icon="ClipboardIcon"
                            style="background: #3980f626; color: #3980F6;"
                        />
                    </div>
                    <h2 class="text-center mt-4 mb-2 font-bold">{{ reportInfo.closedAnswers == 0? 0 : 100 - Math.round (reportInfo.faildAnswers*1000/reportInfo.closedAnswers)/10 }} %</h2>
                    <p class="text-center">{{$t("compliance")}}</p>
                </div>
            </div>
            <div class="px-2 vx-col md:w-1/4 sm:w-1/2 w-full md:mt-0 my-1" v-if="completed_on_time">
                <div class="rounded-lg border border-solid d-theme-border-grey-light p-4">
                    <div class="text-center">
                        <feather-icon
                        class="text-success p-3 inline-flex rounded-full"
                        icon="CalendarIcon"
                        style="background: rgba(var(--vs-success),.15)"
                        ></feather-icon>
                    </div>
                    <h2 class="text-center mb-2 mt-4 font-bold">{{ reportInfo.ontime }}</h2>
                    <p class="text-center">{{$t("completed on time")}}</p>
                </div>
            </div>
            <div class="px-2 vx-col md:w-1/4 sm:w-1/2 w-full md:mt-0 my-1"  v-if="failed_response">
                <div class="rounded-lg border border-solid d-theme-border-grey-light p-4">
                <div class="text-center">
                    <feather-icon
                    class="text-warning p-3 inline-flex rounded-full"
                    icon="XIcon"
                    style="background: rgba(var(--vs-warning),.15)"
                    ></feather-icon>
                </div>
                <h2 class="text-center mb-2 mt-4 font-bold">{{ reportInfo.faildAnswers }}</h2>
                <p class="text-center">{{$t("failed response")}}</p>
                </div>
            </div>
            <div class="px-2 vx-col md:w-1/4 sm:w-1/2 w-full md:mt-0 my-1"  v-if="completed_tasks">
                <div class="rounded-lg border border-solid d-theme-border-grey-light p-4">
                <div class="text-center">
                    <feather-icon
                    class="text-warning p-3 inline-flex rounded-full"
                    icon="XIcon"
                    style="background: rgba(var(--vs-warning),.15)"
                    ></feather-icon>
                </div>
                <h2 class="text-center mb-2 mt-4 font-bold">{{ reportInfo.completedTasks }}</h2>
                <p class="text-center">{{$t("Completed Tasks")}}</p>
                </div>
            </div>
        </div>
        <div class="w-full mt-base" v-if="Object.keys(reportInfo.faildAnswersInfo).length > 0 && failed_list">
            <h3 class="karla mb-2">{{$t("failed response")}} </h3>
            <div class="faild-answer-content rounded-lg border border-solid d-theme-border-grey-light">
                <table class="w-full mt-base logStatusTable">
                    <thead>
                        <tr>
                            <th
                            class="py-2"
                            width="30%"
                            >{{$t("page") | capitalize}}</th>
                            <th
                            class="py-2"
                            width="25%"
                            >{{$t("question")}}</th>
                            <th
                            class="py-2"
                            width="25%"
                            >{{$t("answer")}}</th>
                            <th
                            class="py-2 "
                            width="10%"
                            >{{$t("value") | capitalize}}</th>
                            <th
                            class="hidden sm:table-cell py-2"
                            width="10%"
                            >{{$t("date")}}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr :key="i+'Table'" v-for="(content,i) in reportInfo.faildAnswersInfo[template]">
                            <td v-for="(item,ii) in content" :key="ii+'td'"
                                class="py-5 pl-3 border border-solid d-theme-border-grey-light border-b-0 border-l-0 border-r-0"
                            >{{item}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        score: {
            type: Boolean,
            default: true
        },
        compliance: {
            type: Boolean,
            default: true
        },
        completed_on_time: {
            type: Boolean,
            default: true
        },
        failed_response: {
            type: Boolean,
            default: true
        },
        failed_list: {
            type: Boolean,
            default: true
        },
        completed_tasks: {
            type: Boolean,
            default: true
        },
        template: {
            type: String
        },
        users: {
            type: Array
        },
        teams: {
            type: Array
        },
    },
    computed: {
        templateInfo() {
            return this.$store.getters['app/getTemplateById'](this.template)
        },
        getTemplateType() {
            return id=> {
                return  this.$store.getters["app/getTemplateTypeById"](id);
            }
        },
        filteredLogs() {
            var logs = this.$store.getters["app/logs"];
            var checkLog = []
            logs = logs.filter((log) => {
                if(log.templateID != this.template) return false
                var template = this.templateInfo;
                if(!template) return false

                if(log.time && log.time.seconds) {
                    if(checkLog.find(check=> check.templateID == log.templateID && check.time == log.time.seconds))
                        return false
                    checkLog.push({templateID: log.templateID , time: log.time.seconds})
                }
                
                if (this.users.length > 0) {
                    if(this.users.indexOf(log.updated_by) < 0) return false
                }
                if (this.teams.length > 0) {
                    var users = []
                    this.teams.map(team=> {
                        let user = this.$store.getters['app/getUsersByTeam'](team)
                        users = users.concat(user)
                    })
                    if(!users.find(user=> user.id == log.updated_by)) return false
                }

                return true

            });
            return logs.sort(
                (a, b) =>
                b.updated_at.toDate().getTime() - a.updated_at.toDate().getTime()
            );
        },
        getTime() {
            return time => {
                if(time.seconds)
                    return this.$moment(time.toDate()).format("YY-MM-Do@hh:mm")
                else 
                    return this.$moment(time).format("YY-Mo-Do@hh:mm")
            }
        },
        reportInfo() {
            let logs = this.filteredLogs;
            var scores = 0;
            var score = 0;
            var tasks = 0;
            var complted = 0;
            var ontime = 0;
            var scheduled = 0;
            var ontimeTask = true;
            var checkOnTimeTask = 0;
            var faildAnswers = 0
            var faildAnswersInfo = {}
            var closedAnswers = 0
            var defaultScore = 0
            logs.map((log) => {
                var template = this.templateInfo
                ontime = 0;
                ontimeTask = true;

                if (log.key === undefined || log.key != "pinned") {
                    if (log.time !== undefined) {
                        scheduled++;
                        ontime = log.time.toDate().getTime();
                    }
                }
                log.logs.map((page,p) => {
                    page.questions.map((question,q) => {
                        question.answers.map((answer,a) => {
                            score = 0;
                            if (
                                this.getTemplateType(answer.ref.type.id).content !=
                                "instruction"
                            ) {
                                if (answer.ref.mandatory) {
                                tasks++;
                                if (answer.loged) complted++;
                                }
                            }
                            if (ontime != 0 && answer.ref.mandatory) {
                                ontimeTask =
                                ontimeTask &&
                                answer.loged &&
                                answer.time.toDate().getTime() <= ontime;
                            }
                            if (answer.loged) {
                                if (this.getTemplateType(answer.ref.type.id).content == "temperature") {
                                    if (answer.ref.score === undefined || !Array.isArray(answer.ref.score)) {
                                        score = 10;
                                    } else {
                                        var checkedScore = false;
                                        answer.ref.score.map((scoreItem, sindex) => {
                                        if (checkedScore) return;
                                        if (sindex == 0) defaultScore = scoreItem.score;
                                        else {
                                            if (scoreItem.condition == "equal") {
                                            if (scoreItem.value0 == answer.value) {
                                                checkedScore = true;
                                                score = scoreItem.score;
                                            } else score = defaultScore;
                                            } else if (scoreItem.condition == "Nequal") {
                                            if (scoreItem.value0 != answer.value) {
                                                checkedScore = true;
                                                score = scoreItem.score;
                                            } else score = defaultScore;
                                            } else if (scoreItem.condition == "less") {
                                            if (scoreItem.value0 > answer.value) {
                                                {
                                                checkedScore = true;
                                                score = scoreItem.score;
                                                }
                                            } else score = defaultScore;
                                            } else if (scoreItem.condition == "Eless") {
                                            if (scoreItem.value0 >= answer.value) {
                                                checkedScore = true;
                                                score = scoreItem.score;
                                            } else score = defaultScore;
                                            } else if (scoreItem.condition == "than") {
                                            if (scoreItem.value0 < answer.value) {
                                                checkedScore = true;
                                                score = scoreItem.score;
                                            } else score = defaultScore;
                                            } else if (scoreItem.condition == "Ethan") {
                                            if (scoreItem.value0 <= answer.value) {
                                                checkedScore = true;
                                                score = scoreItem.score;
                                            } else score = defaultScore;
                                            } else if (scoreItem.condition == "between") {
                                            if (
                                                scoreItem.value0 <= answer.value &&
                                                scoreItem.value1 >= answer.value
                                            ) {
                                                checkedScore = true;
                                                score = scoreItem.score;
                                            } else score = defaultScore;
                                            }
                                        }
                                        });
                                    }
                                    scores += Math.round(score * 10) / 10;
                                } else if (
                                this.getTemplateType(answer.ref.type.id).type ==
                                "closed answers"
                                ) {
                                    closedAnswers ++
                                    if(answer.ref.type.failedAnswer && answer.value == answer.ref.type.failedAnswer) {
                                        faildAnswers ++
                                        if(!faildAnswersInfo[template.id]) {
                                            faildAnswersInfo[template.id] = []
                                        }
                                        faildAnswersInfo[template.id].push([page.title,question.title,answer.ref.title, answer.value, this.getTime(answer.time)])
                                    }
                                    if (
                                        answer.ref.score === undefined ||
                                        !Array.isArray(answer.ref.score) ||
                                        answer.ref.score.length == 0
                                    ) {
                                        score = 10;
                                    } else {
                                        score = answer.ref.score.find(
                                        (scoreItem) => scoreItem.key == answer.value
                                        ).score;
                                    }
                                    scores += Math.round(score * 10) / 10;
                                }
                            }
                        });
                    });
                });
                if (ontime != 0 && ontimeTask) checkOnTimeTask++;
        });
            return {
                score: scores,
                tasks: `${complted}/${tasks}`,
                ontime: `${checkOnTimeTask}/${scheduled}`,
                closedAnswers: closedAnswers,
                faildAnswers: faildAnswers,
                faildAnswersInfo: faildAnswersInfo,
                completedTasks: checkOnTimeTask
            };
        },
    }
}
</script>