<template>
        <div class="p-4 m-4 vs-con-loading__container  mt-base rounded-lg border border-solid d-theme-border-grey-light" v-if="template">
            <div class="section-header">
                <p class="karla text-lg font-bold">Temperature for [{{ $store.getters['app/getTemplateById'](template).content.templateTitle }} - Fridge]</p>
            </div>
            <div class="section-content mt-4">
                <apexchart type="line" height="350" :options="chartOptions" :series="series"></apexchart>
            </div>
        </div>
</template>

<script>
import Apexchart from 'vue-apexcharts'
import VSelect from 'vue-select'

export default {
    props: {
        template: {
            type: String
        },
        date: {
        }
    },
    components: {
        VSelect,
        Apexchart
        
    },
    data() {
        return {
            from: "",
            to: "",
            
            chartOptions: {
                chart: {
                    height: '100%',
                    type: 'line',
                    toolbar: {
                        show: false
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'smooth'
                },
                xaxis: {
                    type: 'datetime',
                    categories: [],
                    labels: {
                        datetimeUTC: false
                    }

                },
                yaxis: {
                    type: 'string',
                    opposite: true,
                },
            },
        }
    },
    computed: {
        series() {
            var series = []
            let template = this.$store.getters['app/getTemplateById'](this.template)
            var tempData = []
            if(!template) return []

            let sensorData = this.$store.getters['app/sensorDatas'].filter(item=> item.templateID == this.template)
            sensorData.map(data=> {
                if(!template.content.pages[data.page] || !template.content.pages[data.page].questions[data.question] || !template.content.pages[data.page].questions[data.question].answers[data.answer]) return
                var ti = tempData.findIndex(td=> td.p == data.page && td.q== data.question && td.a== data.answer)
                if(ti<0) {
                    tempData.push({
                        p: data.page,
                        q: data.question,
                        a: data.answer,
                        caption: template.content.pages[data.page].questions[data.question].title,
                        data: [[data.time.toDate().getTime(),data.temperature]]
                    })
                } else {
                    tempData[ti].data.push([data.time.toDate().getTime(),data.temperature])
                }
            })

            var indexes = []
            template.content.pages.map((page, pIndex)=> {
                page.questions.map((question, qIndex)=> {
                    question.answers.map((answer,aIndex) => {
                        let type = this.$store.getters['app/getTemplateTypeById'](answer.type.id)
                        if(!type || type.content != 'temperature') return 
                        indexes.push([pIndex,qIndex,aIndex])
                    })
                })
            })

            let logs = this.$store.getters['app/logs'].filter(item=> item.templateID == this.template)
            logs.map(log=> {
                indexes.map(index => {
                    if(!log.logs[index[0]] || !log.logs[index[0]].questions[index[1]] || !log.logs[index[0]].questions[index[1]].answers[index[2]]) return
                    var value = log.logs[index[0]].questions[index[1]].answers[index[2]].value
                    var time = log.logs[index[0]].questions[index[1]].answers[index[2]].time
                    if(time == '') return
                    time = time.seconds ? time.toDate().getTime(): time.getTime()
                    var ti = tempData.findIndex(td=> td.p == index[0] && td.q== index[1] && td.a== index[2])
                    if(ti<0) {
                        tempData.push({
                            p: index[0],
                            q: index[1],
                            a: index[2],
                            caption: template.content.pages[index[0]].questions[index[1]].title,
                            data: [[time, value]]
                        })
                    } else {
                        if(!tempData[ti].data.find(tdt=> tdt[0] <= time+10*60*1000 && tdt[0] >= time-6*60*1000))
                            tempData[ti].data.push([time, value])
                    }
                })
            })

            tempData.map(sensor=> {
                series.push({
                    name: sensor.caption,
                    data: sensor.data.sort((a,b)=> a[0] - b[0])
                })
            })
            return series
        }
    },
}
</script>
