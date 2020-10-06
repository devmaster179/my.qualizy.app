<template>
    <statistics-card-line icon="ServerIcon" statistic="3 Items" statisticTitle="Food items discarded" :chartData="data" color='warning' type='area'></statistics-card-line>
</template>
<script>
import StatisticsCardLine from '@/components/statistics-cards/StatisticsCardLine.vue'
export default {
    components: {
        StatisticsCardLine
    },
    data() {
        return {
            data: {
                series: [{
                    name: 'Orders',
                    data: [10, 15, 8, 15, 7, 12, 8]
                }],
                chartOptions: {
                    grid: {
                        show: false,
                        padding: {
                            left: 0,
                            right: 0
                        }
                    },
                    chart: {
                        toolbar: {
                            show: false,
                        },
                        sparkline: {
                            enabled: true
                        }
                    },
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        curve: 'smooth',
                        width: 2.5
                    },
                    fill: {
                        type: 'gradient',
                        gradient: {
                            shadeIntensity: 0.9,
                            opacityFrom: 0.7,
                            opacityTo: 0.5,
                            stops: [0, 80, 100]
                        }
                    },
                    xaxis: {
                        type: 'numeric',
                        lines: {
                            show: false,
                        },
                        axisBorder: {
                            show: false,
                        },
                        labels: { show: false }
                    },
                    yaxis: [{
                        y: 0,
                        offsetX: 0,
                        offsetY: 0,
                        padding: { left: 0, right: 0 },
                    }],
                    tooltip: {
                        x: { show: false }
                    },
                },
            },
        }
    }    
}
</script>