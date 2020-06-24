<template>
  <div>
    <div id="myChart" :style="{width: '1200px', height: '400px'}"></div>
  </div>
</template>

<script>
  import request from '@/utils/request'
  import {getUrlWithPara} from  "../../../utils/urlUtil";
  import dateFormat from "../../../utils/dateFormat";
  // 引入基本模板
  let echarts = require("echarts/lib/echarts");
  // 引入柱状图组件
  require("echarts/lib/chart/bar");
  require("echarts/lib/chart/line");
  // 引入提示框和title组件
  require("echarts/lib/component/tooltip");
  require("echarts/lib/component/title");
  export default {
    name: 'Chart',
    data() {
      return {
        dataSize:6,

        option: {
          title: {text: '绩效统计图'},
          tooltip: {},
          xAxis: {
            data: ["2020-1", "2020-2", "2020-3", "2020-4", "2020-5", "2020-6"]
          },
          yAxis: {
          },
          series: [{
            name: '绩效',
            type: 'line',
            data: [4.7, 4.0, 5.0, 4.4, 4.8]
          }]
        }
      }
    },

   mounted() {
      request({
        url:getUrlWithPara('api/performance/myperformance',{
          page:0,
          size:this.dataSize
        }),
        method:'get',
      }).then(result=>{
        var points=result.map(function (element) {
            return element.finalScore;
        }).reverse();
        this.option.series[0].data=points;
        var xa=  result.map(function (element) {
          return dateFormat(element.month,"yyyy-MM");
        }).reverse();
        this.option.xAxis.data=xa;
        this.drawLine();
      })

   },
    methods: {
      drawLine() {
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById('myChart'))
        // 绘制图表
        myChart.setOption(this.option);
      },


    }
  };
</script>

<style scoped>

</style>
