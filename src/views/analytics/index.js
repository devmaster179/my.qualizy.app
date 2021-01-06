import AnalyFilter from "./AnalyFilter";
import AnalyticsItem from "./AnalyticsItem"
import VSelect from "vue-select"
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import { db } from "@/firebase/firebaseConfig.js";
import Vue from 'vue';
import { Table, Tag, Tabs, Button, Collapse, Icon } from 'buefy';
import 'bootstrap';
import Apexchart from 'vue-apexcharts';
import $ from 'jquery';
import TemperatureSection from './TemperatureSection';

Vue.use(Table);
Vue.use(Tag);
Vue.use(Tabs);
Vue.use(Button);
Vue.use(Collapse);
Vue.use(Icon);

export default {
    components: {
        AnalyFilter,
        AnalyticsItem,
        VSelect,
        VuePerfectScrollbar,
        Apexchart,
        TemperatureSection
    },
    data() {
        return {
            init: true,
            saved: false,
            team: [],
            visible: 0,
            visibles: [
                {key:0, text: 'public'},
                {key:1, text: 'teams'},
                {key:2, text: 'Just me'}
            ],
            updateFlag: false,
            settings: {
                maxScrollbarLength: 60,
                wheelSpeed: 0.6,
            },
            analyticsName: "",
            saveAnalyticsActive: false,
            analytic: null,
            from: "",
            to: "",
            filterSidebar: false,
            date: '',
            isOpen: -1,
            selectedTemplates: [],
            filters: {
                date: "today",
                template: [],
                users: [],
                teams: [],
                options: [],
            },
            activeTab: 0,
            allTasks: 0,
            allTemplates: 0,
            compliancePerTemplates: [],
            compliancePerLocations: [],
            compliancePerLocationsFiltered: [],
            overdueTasks: [],
            overdueTasksFiltered: [],
            failedAnswerTemplates: [],
            failedAnswerTemplatesFiltered: [],
            alerts: [],
            pieChart1Options: {
                labels: [],
                series: [],
                quantities: {},
                colors:['#6C50F0', '#5ECB89', '#54BAF8', '#EF7A69', '#5D5C63', '#EDE358'],
                legend: {
                    show: false,
                },
                plotOptions: {
                    pie: {
                        customScale: 1.1,
                        donut: {
                            size: '40%',
                            labels: {
                                show: false,
                            }
                        }
                    }
                },
                dataLabels: {
                    enabled: false,
                }
            },
            pieChart2Options: {
                labels: [],
                series: [],
                quantities: {},
                colors:['#6C50F0', '#5ECB89', '#54BAF8', '#EF7A69', '#5D5C63', '#EDE358'],
                legend: {
                    show: false,
                },
                plotOptions: {
                    pie: {
                        customScale: 1.1,
                        donut: {
                            size: '40%',
                            labels: {
                                show: false,
                            }
                        }
                    }
                },
                dataLabels: {
                    enabled: false,
                }
            },
            barChart1Options: {
                quantities: [],
                series: [
                    {
                        data: []
                    }
                ],
                chart: {
                    type: 'bar',
                    toolbar: {
                        show: false
                    }
                },
                yaxis: {
                    opposite: true,
                },
                xaxis: {
                    type: 'datetime',
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        stroke: {
                            show: true,
                            width: 2,
                            dashArray: 10,
                        },
                        columnWidth: '50%',
                    },

                },
                dataLabels: {
                    enabled: false,
                }
            },
            barChart2Options: {
                quantities:[],
                series:[],
                chart: {
                    type: 'line',
                    toolbar: {
                        show: false
                    }
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        stroke: {
                            show: true,
                            width: 2,
                            dashArray: 10,
                        },
                    },
                },
                dataLabels: {
                    enabled: false,
                },
                yaxis: {
                    opposite: true,
                },
                xaxis: {
                    type: 'datetime',
                },
                markers: {
                    size: 1
                }
            },
            barChart3Options: {
                quantities:[],
                series:[],
                chart: {
                    height: '100%',
                    type: 'line',
                    toolbar: {
                        show: false
                    }
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        stroke: {
                            show: true,
                            width: 2,
                            dashArray: 10,
                        },
                    },
                },
                dataLabels: {
                    enabled: false,
                },
                yaxis: {
                    opposite: true,
                },
                xaxis: {
                    type: 'datetime',
                },
                markers: {
                    size: 1
                }
            },
            barChart4Options: {
                quantities: [],
                series: [
                    {
                        data: []
                    }
                ],
                chart: {
                    type: 'bar',
                    toolbar: {
                        show: false
                    }
                },
                yaxis: {
                    opposite: true,
                },
                xaxis: {
                    type: 'datetime',
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        stroke: {
                            show: true,
                            width: 2,
                            dashArray: 10,
                        },
                        columnWidth: '50%',
                    },

                },
                dataLabels: {
                    enabled: false,
                }
            },
        };
    },
    mounted() {
        $('.dropdown-submenu .sub-menu').on("click", function(e) {
            e.stopPropagation();
            e.preventDefault();
            $('.dropdown-submenu .dropdown-menu').not($(this).next('ul')).hide();
            $(this).next('ul').toggle();
        });

        this.getOverdueTasks();
        this.getFailedAnswers();
        this.getAlerts();
    },
    methods: {
        updateAnalytics() {
            db.collection('analytics').doc(this.analytic.id).update({
                locations: this.$store.getters['app/locationList'],
                name: this.analyticsName,
                filters: this.filters,
                updated_at: new Date(),
                updated_by: JSON.parse(localStorage.getItem('userInfo')).id,
                visible: this.visible,
                teams: this.team
            })
        },
        saveAnalytics() {
            this.saved = true
            if(this.updateFlag) {
                this.updateAnalytics()
            }
            else {
                const that = this
                var newAnanlytics = db.collection('analytics').doc()
                newAnanlytics.set({
                    locations: this.$store.getters['app/locationList'],
                    filters: this.filters,
                    name: this.analyticsName,
                    visible: this.visible,
                    teams: this.team,
                    updated_at: new Date(),
                    updated_by: JSON.parse(localStorage.getItem('userInfo')).id,
                    group: JSON.parse(localStorage.getItem('userInfo')).group,
                }).then(()=> {
                    that.analytic = {
                        id: newAnanlytics.id,
                        name: that.analyticsName
                    }
                });
            }
        },
        chnOption(options,template,key) {
            var temp = options
            temp.template = template
            temp[key] = !temp[key]
            let index = this.filters.options.findIndex(item=> item.template == template)
            if( index>-1 ) {
                this.filters.options[index] = temp
            }
            else {
                this.filters.options.push(temp)
            }
        },
        setLog() {
            var today = new Date();
            var val = this.filters.date
            if(!val) val = ""
            if (Array.isArray(val)) {
                this.from = val[0].seconds ? val[0].toDate(): val[0];
                this.to = val[1].seconds ? val[1].toDate(): val[1];
            } else if (val == "today") {
                this.from = this.to = new Date();
            } else if (val == "this week") {
                this.to = today;
                var today1 = new Date();
                var day = today1.getDay();
                var diff = today1.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
                this.from = new Date(today1.setDate(diff));
            } else if (val == "this month") {
                this.to = today;
                this.from = new Date(today.getFullYear(), today.getMonth(), 1);
            } else if (val == "this quarter") {
                this.to = today;
                this.from = new Date(
                    today.getFullYear(),
                    Math.floor(today.getMonth() / 3) * 3,
                    1
                );
            } else if (val == "this year") {
                this.to = today;
                this.from = new Date(today.getFullYear(), 0, 1);
            } else if (val == "yesterday") {
                this.to = today;
                this.from = new Date(today.getTime() - 24 * 60 * 60 * 1000);
            } else if (val == "previous week") {
                var today1 = new Date();
                var day = today1.getDay();
                var diff = today1.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
                this.to = new Date(today1.setDate(diff - 1));
                this.from = new Date(today.setDate(diff - 7));
            } else if (val == "previous month") {
                this.to = new Date(today.getFullYear(), today.getMonth(), 0);
                this.from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            } else if (val == "previous quarter") {
                this.to = new Date(
                    today.getFullYear(),
                    Math.floor(today.getMonth() / 3) * 3,
                    0
                );
                this.from = new Date(this.to.getFullYear(), this.to.getMonth() - 2, 1);
            } else if (val == "previous year") {
                this.to = new Date(today.getFullYear(), 0, 0);
                this.from = new Date(today.getFullYear() - 1, 0, 1);
            } else if (val == "all time" || val == "") {
                this.to = this.from = "";
            }

            if(this.from =='') this.from= new Date(0)
            if(this.to =='') this.to= new Date()

            if(this.filters.template.length) {
                this.$vs.loading()
                db.collection("logs").where('templateID', 'in' , this.filters.template)
                    .where('updated_at' , '>=' , this.from)
                    .where('updated_at' , '<=' , this.to)
                    .get().then((q) => {
                    this.$vs.loading.close()
                    let logs = [];
                    q.forEach((doc) => {
                        logs.push(Object.assign({}, doc.data(), { id: doc.id }));
                    });
                    this.$store.dispatch("app/setLogs", logs);
                });
                db.collection('sensorDatas').where('templateID', 'in', this.filters.template).where('time', '>=' , this.from).where('time','<=' , this.to).orderBy('time','asc').get().then(q=> {
                    let sensorDatas = []
                    q.forEach(doc=> {
                        sensorDatas.push(Object.assign({}, doc.data(), {id: doc.id}))
                    })
                    this.$store.commit('app/SET_SENSOR_DATA', sensorDatas)
                })
            }
        },
        chnFilter(filter) {
            this.filters.date = filter.date
            var ft = []
            filter.template.map(ftt=> {
                ft.push(ftt.id)
            })
            this.filters.template = ft
            var ft = []
            filter.users.map(ftt=> {
                ft.push(ftt.id)
            })
            this.filters.users = ft
            var ft = []
            filter.teams.map(ftt=> {
                ft.push(ftt.id)
            })
            this.filters.teams = ft
            this.filterSidebar = false;
            this.setLog()
            this.updateOverdueTasks()
            this.updateFailedAnswers()
        },
        showFilter() {
            this.filterSidebar = true;
        },
        removeFlters() {
            this.filters = {
                date: "today",
                template: [],
                users: [],
                teams: [],
                options: [],
            };
            this.compliancePerTemplates = [];
            this.compliancePerLocations = [];
        },
        getFilterName(ids, key) {
            (key == 'users') && (key = 'user');
            (key == 'teams') && (key = 'team');

            let index = `app/get${key.charAt(0).toUpperCase() + key.slice(1)}ById`;
            let names = [];
            ids.forEach(id => {
                let obj = this.$store.getters[index](id);
                if(key == 'template') {
                    names.push(obj.content.templateTitle);
                } else {
                    names.push(obj.name);
                }
            });
            return names.join(', ');
        },
        getOverdueTasks() {
            if(!this.overdueTasks.length) {
                let vm = this;
                this.$vs.loading();
                db.collection("schedules")
                    .where(
                        "group",
                        "==",
                        JSON.parse(localStorage.getItem("userInfo")).group
                    )
                    .onSnapshot((q) => {
                        q.forEach((doc) => {
                            let data = doc.data();
                            this.allTasks++;
                            if(data.active) {
                                let date = new Date(data.dueTimes[data.dueTimes.length - 1].toDate());
                                if(date < new Date()) {
                                    let task = Object.assign({}, data, { id: doc.id });
                                    let correctDate = date.toLocaleDateString();
                                    // let key = correctDate.substring(0, correctDate.length - 5);

                                    task.team = this.$store.getters["app/teams"].length ? this.$store.getters["app/teams"][0].name : '';
                                    task.deadline = correctDate;
                                    task.overdue = Math.ceil(Math.abs(new Date() - date) / (1000 * 60 * 60 * 24));
                                    task.active ? task.status = 'Active' : task.status = 'Failed';

                                    if(!vm.barChart1Options.quantities[correctDate]) {
                                        vm.barChart1Options.quantities[correctDate] = 1;
                                    } else {
                                        vm.barChart1Options.quantities[correctDate]++;
                                    }

                                    if(data.location) {
                                        let loc = data.location[0];
                                        this.$vs.loading()
                                        db.collection('locations')
                                            .doc(loc)
                                            .get()
                                            .then(snapshot => {
                                                let location = snapshot.data();
                                                task.location = location.name;
                                                task.locationId = loc;
                                                if(!vm.pieChart1Options.quantities[loc]) {
                                                    vm.pieChart1Options.quantities[loc] = {
                                                        name: location.name,
                                                        count: 1
                                                    };
                                                } else {
                                                    vm.pieChart1Options.quantities[loc].count++;
                                                }
                                                if(!vm.barChart2Options.quantities[loc]) {
                                                    vm.barChart2Options.quantities[loc] = {
                                                        location: location.name,
                                                        dates: [
                                                            {
                                                                x: correctDate,
                                                                y: 1
                                                            }
                                                        ]
                                                    }
                                                } else {
                                                    let date = vm.barChart2Options.quantities[loc].dates.find(el => el.x == correctDate);
                                                    if (date) {
                                                        date.y++;
                                                    } else {
                                                        vm.barChart2Options.quantities[loc].dates.push({
                                                            x: correctDate,
                                                            y: 1
                                                        })
                                                    }
                                                }
                                                this.$vs.loading.close();
                                            })
                                    }

                                    let temp = data.template;
                                    this.$vs.loading();
                                    db.collection('templates')
                                        .doc(temp)
                                        .get()
                                        .then(snapshot => {
                                            let data1 = snapshot.data();
                                            if(data1) {
                                                task.template = data1.content.templateTitle;
                                                if(!vm.barChart3Options.quantities[temp]) {
                                                    vm.barChart3Options.quantities[temp] = {
                                                        template: data1.content.templateTitle,
                                                        dates: [
                                                            {
                                                                x: correctDate,
                                                                y: 1
                                                            }
                                                        ]
                                                    }
                                                } else {
                                                    let date = vm.barChart3Options.quantities[temp].dates.find(el => el.x == correctDate);
                                                    if (date) {
                                                        date.y++;
                                                    } else {
                                                        vm.barChart3Options.quantities[temp].dates.push({
                                                            x: correctDate,
                                                            y: 1
                                                        })
                                                    }
                                                }
                                            }
                                            this.$vs.loading.close();
                                        });

                                    vm.overdueTasks.push(task);
                                }
                            }
                        });
                        this.$vs.loading.close();
                    });
            }
        },
        getFailedAnswers() {
            if(!this.failedAnswerTemplates.length) {
                this.$vs.loading();
                db.collection("templates")
                    .where(
                        "group",
                        "==",
                        JSON.parse(localStorage.getItem("userInfo")).group
                    )
                    .onSnapshot((q) => {
                        q.forEach((doc) => {
                            this.allTemplates++;
                            let data = doc.data();
                            let date = new Date(data.updated_at.toDate());
                            let correctDate = date.toLocaleDateString();
                            // let key = correctDate.substring(0, correctDate.length - 5);
                            if(data.content.pages && data.content.pages.length) {
                                data.content.pages.forEach(page => {
                                    if(page.questions.length) {
                                        page.questions.forEach(question => {
                                            if(question.answers.length) {
                                                question.answers.forEach(answer => {
                                                    let failed = answer.type.failedAnswer;
                                                    let template = Object.assign({}, data, { id: doc.id });

                                                    if(failed == 'Yes' || failed == 'Si' || failed == 'Oui' || failed == 'Sì') {

                                                        question.team = this.$store.getters["app/teams"].length ? this.$store.getters["app/teams"][0].name : '';
                                                        question.template = data.content.templateTitle;


                                                        if(template.content.location && template.content.location.length) {
                                                            let loc = template.content.location[0];

                                                            if(!this.barChart4Options.quantities[correctDate]) {
                                                                this.barChart4Options.quantities[correctDate] = 1;
                                                            } else {
                                                                this.barChart4Options.quantities[correctDate]++;
                                                            }

                                                            db.collection('locations')
                                                                .doc(loc)
                                                                .get()
                                                                .then(snapshot => {
                                                                    let location = snapshot.data();
                                                                    template.location = location.name;
                                                                    template.locationId = loc;
                                                                    question.location = location.name;

                                                                    if(!this.pieChart2Options.quantities[loc]) {
                                                                        this.pieChart2Options.quantities[loc] = {
                                                                            name: location.name,
                                                                            count: 1
                                                                        };
                                                                    } else {
                                                                        this.pieChart2Options.quantities[loc].count++;
                                                                    }
                                                                })
                                                        }
                                                        let tmp = this.failedAnswerTemplates.find(el => el.id == template.id);
                                                        if(!tmp) {
                                                            this.failedAnswerTemplates.push(template);
                                                        }
                                                    }
                                                })
                                            }
                                        })
                                    }
                                });
                            }
                        });
                        this.$vs.loading.close();
                    });
            }
        },
        getAlerts() {
            if(!this.alerts.length) {
                this.$vs.loading();
                db.collection("notifications")
                    // .where(
                    //     "group",
                    //     "==",
                    //     JSON.parse(localStorage.getItem("userInfo")).group
                    // )
                    .onSnapshot((q) => {
                        q.forEach((doc) => {
                            let alert = Object.assign({}, doc.data(), { id: doc.id });
                            let teams = [];
                            alert.toTeam.forEach(team => {
                                db.collection('teams')
                                    .doc(team)
                                    .get()
                                    .then(snapshot => {
                                        teams.push(snapshot.data().name);
                                    });
                            });
                            alert.teams = teams;
                            this.alerts.push(alert);
                        });
                        this.$vs.loading.close();
                    });
            }
        },
        getData(tab) {
            switch(tab) {
                case 0:
                    break;
                case 1:
                    break;
                case 2:
                    this.updateOverdueTasks();
                    break;
                case 3:
                    this.updateFailedAnswers();
                    break;
                case 4:
                    break;
                case 5:
                    break;
            }
        },
        updateOverdueTasks() {
            let locations = this.$store.getters['app/locationList'];
            let locs = [];
            this.pieChart1Options.series = [];
            this.pieChart1Options.labels = [];
            this.barChart2Options.series = [];
            this.barChart3Options.series = [];
            this.barChart1Options.series[0].data = [];
            Vue.set(this.barChart1Options.series[0], 'data', []);
            let ulen = this.filters.users.length;

            if(ulen) {
                this.filters.users.map(u => {
                    let user = this.$store.getters['app/getUserById'](u);
                    locs.concat(user.location);
                });
            }

            this.compliancePerLocationsFiltered = this.compliancePerLocations.filter(el => {
                if(ulen) {
                    return locations.includes(el.id) && locs.includes(el.id);
                } else {
                    return locations.includes(el.id);
                }
            });

            for(let key in this.pieChart1Options.quantities) {
                if((ulen ? locs.includes(key) : true) && locations.includes(key) && !this.pieChart1Options.labels.find(el => el == this.pieChart1Options.quantities[key].name)) {
                    this.pieChart1Options.series.push(+this.pieChart1Options.quantities[key].count);
                    this.pieChart1Options.labels.push(this.pieChart1Options.quantities[key].name);
                }
            }
            for(let key in this.barChart1Options.quantities) {
                let date = new Date(key);
                if(date >= this.from && date <= this.to && !this.barChart1Options.series[0].data.find(el => el.x == key)) {
                    // Vue.set(this.barChart1Options.series[0].data, this.barChart1Options.series[0].data.length, {
                    //     x: key,
                    //     y: this.barChart1Options.quantities[key]
                    // });
                    this.barChart1Options.series[0].data.push({
                        x: key,
                        y: this.barChart1Options.quantities[key]
                    });
                }
            }
            for(let key in this.barChart2Options.quantities) {
                if((ulen ? locs.includes(key) : true) && locations.includes(key) && !this.barChart2Options.series.find(el => el.name == this.barChart2Options.quantities[key].location)) {
                    this.barChart2Options.series.push({
                        name: this.barChart2Options.quantities[key].location,
                        data: this.barChart2Options.quantities[key].dates
                    });
                }
            }
            for(let key in this.barChart3Options.quantities) {
                if(this.templates.includes(key) && !this.barChart3Options.series.find(el => el.name == this.barChart3Options.quantities[key].template)) {
                    this.barChart3Options.series.push({
                        name: this.barChart3Options.quantities[key].template,
                        data: this.barChart3Options.quantities[key].dates
                    });
                }
            }

            this.overdueTasksFiltered = this.overdueTasks.filter(task => {
                if(task.location) {
                    return locations.includes(task.locationId);
                } else {
                    return true;
                }
            });
        },
        updateFailedAnswers() {
            let locations = this.$store.getters['app/locationList'];
            let locs = [];
            this.pieChart2Options.series = [];
            this.pieChart2Options.labels = [];
            let ulen = this.filters.users.length;

            if(ulen) {
                this.filters.users.map(u => {
                    let user = this.$store.getters['app/getUserById'](u);
                    locs.concat(user.location);
                });
            }

            for(let key in this.pieChart2Options.quantities) {
                if((ulen ? locs.includes(key) : true) && locations.includes(key) && !this.pieChart2Options.labels.find(el => el == this.pieChart2Options.quantities[key].name)) {
                    this.pieChart2Options.series.push(+this.pieChart2Options.quantities[key].count);
                    this.pieChart2Options.labels.push(this.pieChart2Options.quantities[key].name);
                }
            }
            for(let key in this.barChart4Options.quantities) {
                let date = new Date(key);
                if(date >= this.from && date <= this.to && !this.barChart4Options.series[0].data.find(el => el.x == key)) {
                    this.barChart4Options.series[0].data.push({
                        x: key,
                        y: this.barChart4Options.quantities[key]
                    });
                }
            }
            this.failedAnswerTemplatesFiltered = this.failedAnswerTemplates.filter(temp => {
                if(temp.location) {
                    return locations.includes(temp.locationId);
                } else {
                    return true;
                }
            })
        }
    },
    watch: {
        saveAnalyticsActive(val) {
            if(val) {
                if(this.analytic == null) {
                    this.visible = 0
                    this.team = []
                    this.analyticsName = ""
                    if(!this.init) {
                        this.filters = {
                            date: "today",
                            template: [],
                            users: [],
                            teams: [],
                            options: [],
                        }
                    }

                } else {
                    let analytic = JSON.parse(JSON.stringify(this.$store.getters['app/getAnalyticsByID'](this.analytic.id)))
                    this.analyticsName = analytic.name
                    this.visible = analytic.visible,
                        this.team = analytic.teams
                }
            }
        },
        analytic(val) {
            if(val == null) {
                this.init = true
                this.visible = 0
                this.team = []
                this.analyticsName = ""
                this.filters = {
                    date: "today",
                    template: [],
                    users: [],
                    teams: [],
                    options: [],
                }
            }
            else {
                let analytic = JSON.parse(JSON.stringify(this.$store.getters['app/getAnalyticsByID'](this.analytic.id)))
                var cUser = this.$store.getters["app/currentUser"]
                var locationList = []
                var savedLocationList = analytic.locations || []
                if(cUser.role == undefined || cUser.role.key == undefined || cUser.role.key>0) {
                    if(cUser.location !== undefined && Array.isArray(cUser.location) && cUser.location.length>0) {
                        locationList = cUser.location.filter(lo => savedLocationList.includes(sl=>sl == lo))
                    } else {
                        locationList = []
                    }
                } else {
                    locationList = savedLocationList
                }
                if(!this.saved)
                    this.$store.commit('app/SET_LOCATION_LIST' , locationList)
                this.init = false

                this.filters = analytic.filters
                this.analyticsName = analytic.name
                this.visible = analytic.visible,
                    this.team = analytic.teams
                if(!this.saved) this.setLog()
                else this.saved = false
            }
        },
        locations() {
            this.updateOverdueTasks();
            this.updateFailedAnswers();
        }
    },
    computed: {
        canSave() {
            return true
        },
        locations() {
          return this.$store.getters['app/locationList'];
        },
        complianceRate() {
            if(!this.compliancePerTemplates.length) return 'N / A';

            let total = 0;
            let failed = 0;
            this.compliancePerTemplates.forEach(tmp => {
               total += tmp.totalTasks;
               failed += tmp.failedTasks;
            });

            return `${failed} / ${total - failed} (${failed / (total - failed) * 100} %)`;
        },
        leastPerformingLocation() {
            if(!this.compliancePerLocationsFiltered.length) return 'N / A';
            this.compliancePerLocationsFiltered.sort((a, b) => a.failedTasks - b.failedTasks);
            return this.compliancePerLocationsFiltered[0].failedTasks > 0 ? this.compliancePerLocationsFiltered[0].name : 'N / A';
        },
        failureRateLocation() {
            let arr = [];
            this.overdueTasks.forEach(task => {
                if(task.location && this.locations.includes(task.locationId)) {
                    let obj = arr.find(el => el.name == task.location);
                    if(obj) {
                        obj.count++;
                    } else {
                        arr.push({
                           name: task.location,
                           count: 1
                        });
                    }
                }
            });
            if(arr.length) {
                arr.sort((a,b) => a.count - b.count);
                return arr[0].name;
            } else {
                return 'N / A';
            }
        },
        failureAnswersLocation() {
            let arr = Object.values(this.pieChart2Options.quantities);
            arr.sort((a, b) => (a.count - b.count));
            if(arr.length && this.pieChart2Options.labels.includes(arr[0].name)) {
                return arr[0].name
            }
            return 'N / A';
        },
        failureTasksTeam() {
            let arr = [];
            this.overdueTasks.forEach(task => {
                if(task.team) {
                    let obj = arr.find(el => el.name == task.team);
                    if(obj) {
                        obj.count++;
                    } else {
                        arr.push({
                           name: task.team,
                           count: 1
                        });
                    }
                }
            });
            if(arr.length) {
                arr.sort((a,b) => a.count - b.count);
                return arr[0].name;
            } else {
                return 'N / A';
            }
        },
        failedAnswersCompliance() {
            if(!this.failedAnswerTemplatesFiltered.length) return 'N / A';
            return `${this.failedAnswerTemplatesFiltered.length} / ${this.allTemplates} (${(this.failedAnswerTemplatesFiltered.length / (this.allTemplates - this.failedAnswerTemplatesFiltered.length) * 100).toFixed(2)} %)`;
        },
        biggestAlertsLocation() {
            let arr = [];
            this.alerts.forEach(alert => {
                if(alert.location) {
                    let obj = arr.find(el => el.name == alert.location);
                    if(obj) {
                        obj.count++;
                    } else {
                        arr.push({
                            name: alert.location,
                            count: 1
                        });
                    }
                }
            });
            if(arr.length) {
                arr.sort((a,b) => a.count - b.count);
                return arr[0].name;
            } else {
                return 'N / A';
            }
        },
        biggestAlertsTeam() {
            let arr = [];
            this.alerts.forEach(alert => {
                if(alert.teams) {
                    let obj = arr.find(el => el.name == alert.teams);
                    if(obj) {
                        obj.count++;
                    } else {
                        arr.push({
                            name: alert.teams,
                            count: 1
                        });
                    }
                }
            });
            if(arr.length) {
                arr.sort((a,b) => a.count - b.count);
                return arr[0].name.join(', ');
            } else {
                return 'N / A';
            }
        },
        templates() {
            var templates = []
            var cUser = this.$store.getters["app/currentUser"]
            var locationList = this.$store.getters['app/locationList']

            if(locationList.length==0) {
                if(cUser.role == undefined || cUser.role.key == undefined || cUser.role.key > 0) {
                    if(cUser.location !== undefined && Array.isArray(cUser.location) && cUser.location.length>0) {
                        locationList = cUser.location
                    } else {
                        locationList = ['no']
                    }
                }
            }

            this.filters.template.map(item => {
                var template = this.$store.getters['app/getTemplateById'](item);
                if(!template) return false;

                template.failedTasks = 0;
                template.totalTasks = 0;
                template.content.pages.forEach(page => {
                   page.questions.forEach(question => {
                       question.answers.forEach(answer => {
                           template.totalTasks++;
                           let failed = answer.type.failedAnswer;
                           if(failed == 'Yes' || failed == 'Si' || failed == 'Oui' || failed == 'Sì') {
                               template.failedTasks++;
                               if(template.content.location.length) {
                                   let location = this.$store.getters["app/getLocationById"](template.content.location[0]);
                                   let exist = this.compliancePerLocations.find(el => el.id == location.id);
                                   if(exist) {
                                       exist.totalTasks++;
                                       exist.failedTasks++;
                                   } else {
                                       this.compliancePerLocations.push({
                                           id: location.id,
                                           name: location.name,
                                           totalTasks: 1,
                                           failedTasks: 1
                                       });
                                   }
                               }
                           } else {
                               if(template.content.location.length) {
                                   let location = this.$store.getters["app/getLocationById"](template.content.location[0]);
                                   let exist = this.compliancePerLocations.find(el => el.id == location.id);
                                   if(exist) {
                                       exist.totalTasks++;
                                   } else {
                                       this.compliancePerLocations.push({
                                           id: location.id,
                                           name: location.name,
                                           totalTasks: 1,
                                           failedTasks: 0
                                       });
                                   }
                               }
                           }
                       });
                   });
                });
                template.compliance = (template.totalTasks - template.failedTasks) / template.totalTasks * 100;
                let tmp = this.compliancePerTemplates.find(el => el.id == template.id);
                !tmp && this.compliancePerTemplates.push(template);
                if(locationList.length > 0) {
                    if(!template.content.location || !Array.isArray(template.content.location) || !template.content.location.some(lo=>locationList.includes(lo))) return
                }
                templates.push(item);
            });

            return templates
        },
        teams() {
            var cUser = this.$store.getters["app/currentUser"]
            var locationList = this.$store.getters['app/locationList']
            if(locationList.length==0) {
                if(cUser.role == undefined || cUser.role.key == undefined || cUser.role.key>0) {
                    if(cUser.location !== undefined && Array.isArray(cUser.location) && cUser.location.length>0) {
                        locationList = cUser.location
                    } else {
                        locationList = ['no']
                    }
                }
            }
            let teams = this.$store.getters["app/teams"].filter(team=> {
                if (locationList.length > 0) {
                    if(team.location == undefined || !Array.isArray(team.location)) return false
                    if(!team.location.some(item => locationList.includes(item))) return false
                }
                return team.active && !team.deleted
            });
            return teams
        },
        analytics() {
            let analytics =  this.$store.getters['app/analytics']
            var analytics1 = []
            var cUser = this.$store.getters["app/currentUser"]

            analytics.map(item=> {
                if(item.visible == 1) {
                    if(!cUser.team.some(ut=> item.teams.includes(ut))) return
                }
                else if (item.visible == 2) {
                    if(cUser.id != item.updated_by) return
                }

                analytics1.push({id: item.id, name: item.name})
            })
            return analytics1
        },
        dateFilterDisp() {
            var value = this.filters.date
            if(Array.isArray(value)) {
                return `${this.$t('date')}: ${this.$t('from')}: ${this.$moment(value[0]).format("Do/MM/YYYY")} ~ ${this.$t('to')}: ${this.$moment(value[1]).format("Do/MM/YYYY")}`
            } else {
                return `${this.$t('date')}: ${this.$t(value)}`
            }
        },
    },
};
