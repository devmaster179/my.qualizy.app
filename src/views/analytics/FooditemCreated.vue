<template>
    <div id="fooditem-created">
        <statistics-card-line icon="ServerIcon" statistic="10 Items" statisticTitle="Food items created" :chartData="chatData" type='area'></statistics-card-line>
        {{chatData}}
    </div>
</template>

<script>
import StatisticsCardLine from '@/components/statistics-cards/StatisticsCardLine.vue'

export default {
    props: {
        filters: {
            type: Array
        }
    },
    components: {
        StatisticsCardLine
    },
    data() {
        return {
        }
    },
    computed: {
        chatData() {
            var datas = this.getCreatedItems() 
            return { "chartOptions": { "grid": { "show": false, "padding": { "left": 0, "right": 0 } }, "chart": { "toolbar": { "show": false }, "sparkline": { "enabled": true } }, "fill": { "type": "gradient", "gradient": { "shadeIntensity": 0.9, "opacityFrom": 0.7, "opacityTo": 0.5, "stops": [ 0, 80, 100 ] } }, "xaxis": { "categories": [ "2019-10-26T15:00:00.000Z", "2019-10-27T15:00:00.000Z", "2019-10-28T15:00:00.000Z", "2019-10-29T15:00:00.000Z", "2019-10-30T15:00:00.000Z", "2019-10-31T15:00:00.000Z", "2019-11-01T15:00:00.000Z", "2019-11-02T15:00:00.000Z", "2019-11-03T15:00:00.000Z", "2019-11-04T15:00:00.000Z", "2019-11-05T15:00:00.000Z" ], "type": "datetime", "lines": { "show": true }, "axisBorder": { "show": true }, "labels": { "show": true } }, "yaxis": [ { "y": 0, "offsetX": 0, "offsetY": 0, "padding": { "left": 0, "right": 0 } } ], "tooltip": { "x": { "format": "dd/MM/yy HH:mm" } } }, "series": [ { "name": "Created Items", "data": [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ] } ] }
            // return {
            //     chartOptions: {
            //         grid: {
            //             show: false,
            //             padding: {
            //                 left: 0,
            //                 right: 0
            //             }
            //         },
            //         chart: {
            //             toolbar: {
            //                 show: false,
            //             },
            //             sparkline: {
            //                 enabled: true
            //             }
            //         },
            //         fill: {
            //             type: 'gradient',
            //             gradient: {
            //                 shadeIntensity: 0.9,
            //                 opacityFrom: 0.7,
            //                 opacityTo: 0.5,
            //                 stops: [0, 80, 100]
            //             }
            //         },
            //         xaxis: {
            //             categories: datas.categories,
            //             type: 'datetime',
            //             lines: {
            //                 show: true,
            //             },
            //             axisBorder: {
            //                 show: true,
            //             },
            //             labels: { show: true }
            //         },
            //         yaxis: [{
            //             y: 0,
            //             offsetX: 0,
            //             offsetY: 0,
            //             padding: { left: 0, right: 0 },
            //         }],
            //         tooltip: {
            //             x: { format: 'dd/MM/yy HH:mm' }
            //         },
            //     },
            //     series: [{
            //         name: 'Created Items',
            //         data: datas.series
            //     }]
            // }
        }
    },
    methods: {
        getCreatedItems() {
            var dateRange = this.dateRange()
            var createdDate = dateRange.from.getTime()
            var categories = []
            var series = []
            for (let day = 0; day <= (dateRange.to.getTime()-dateRange.from.getTime())/(24*60*60*1000); day++) {
                createdDate+= 24*60*60*1000
                categories.push(new Date(createdDate))
                series.push(day)
            }
            return {categories: categories, series:series}
        },
        dateRange() {
            var now = new Date()
            var from = this.filters.find(filter=> filter.key=='from')
            var to = this.filters.find(filter => filter.key=='to')
            
            if(from === undefined) from = new Date(now.getTime()-10*24*60*60*1000)
            else from = new Date(from.value.getFullYear(),from.value.getMonth(),from.value.getDate())
            if(to === undefined) to = new Date(now.getFullYear(),now.getMonth(),now.getDate())
            else to = new Date(to.value.getFullYear(),to.value.getMonth(),to.value.getDate())
            
            return {from:from,to:to}
        }
    },
    created() {
        // this.getCreatedItems()
    }   
}
</script>