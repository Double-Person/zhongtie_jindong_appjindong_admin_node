<template>
<ve-histogram :data="chartData" height="278px" :settings="chartSettings">
    </ve-histogram>
</template>

<script>
import VeLine from 'v-charts/lib/line.common'
import VeHistogram from 'v-charts/lib/histogram.common'
export default {
    components: {
        VeHistogram,
        VeLine
    },
    data() {
        return {
            chartSettings : {
                metrics: ['历史进洞车辆', '历史出洞车辆', '当前在洞车辆'],
                showLine: ['当前在洞车辆']
            },
            chartData: {
            columns: ['日期', '历史进洞车辆', '历史出洞车辆', '当前在洞车辆'],
                rows: [
                    { '日期': '1/1', '历史进洞车辆': 1393, '历史出洞车辆': 1093, '当前在洞车辆': 1000 },
                    { '日期': '1/2', '历史进洞车辆': 3530, '历史出洞车辆': 3230, '当前在洞车辆': 120 },
                    { '日期': '1/3', '历史进洞车辆': 2923, '历史出洞车辆': 2623, '当前在洞车辆': 0.76 },
                    { '日期': '1/4', '历史进洞车辆': 1723, '历史出洞车辆': 1423, '当前在洞车辆': 0.49 },
                    { '日期': '1/5', '历史进洞车辆': 3792, '历史出洞车辆': 3492, '当前在洞车辆': 0.323 },
                    { '日期': '1/6', '历史进洞车辆': 4593, '历史出洞车辆': 4293, '当前在洞车辆': 0.78 }
                ]
            }
        }
    }
}
</script>

<style scoped>

</style>
