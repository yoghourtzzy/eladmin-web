<template>
  <div class="app-container clearfix">

    <div class="clockin-container">

      <el-card class="box-card" id="box-checkincard"  :body-style="checkinBodyStyle">
        <div slot="header" class="clearfix">
          <span>签到</span>
          <el-button style="float: right" type="primary" @click="checkin" :disabled="checkinButton">点击签到</el-button>
        </div>
        <div class="text item">
          {{checkinContent}}
        </div>
      </el-card>

      <el-card class="box-card" id="box-checkoutcard" :body-style="checkoutBodyStyle">
        <div slot="header" class="clearfix">
          <span>签退</span>
          <el-button style="float: right" type="primary"    @click="checkout"  :disabled="!checkinButton">点击签退</el-button>
        </div>
        <div class="text item">
          {{checkoutContent}}
        </div>
      </el-card>
    </div>

<!--    <div class="calender-container">-->
<!--      <el-calendar v-model="showDateValue">-->
<!--        <template-->
<!--          slot="dateCell"-->
<!--          slot-scope="{date, data}">-->
<!--          <p>-->
<!--            {{ date.getDay()}} {{stateFlag(date)}}-->
<!--          </p>-->
<!--        </template>-->
<!--      </el-calendar>-->
<!--    </div>-->

  </div>
</template>

<script>
  import request from '@/utils/request'
  import opAttendance from '@/api/attendance/attendance'
  import dateFormat from "@/utils/dateFormat"
  import attendance from "../../../api/attendance/attendance";

  export default {
    data() {
      return {
        checkinContent:null,
        checkoutContent:null,
        checkinBodyStyle:null,
        checkoutBodyStyle:null,
        checkinButton:false,
        checkoutButton:false,
        // attendances:null,
        // showDateValue: new Date(),
      }
    },

    created() {
      //请求签到签退数据
      opAttendance.queryToday().then(data=>{
          //还没有打卡
          if(data===''){
            this.checkinContent='未签到，请打卡';
            this.checkoutContent='未签退';
            this.checkinBodyStyle={background:'#FF6D6D'};
            this.checkoutBodyStyle={background:'#FF6D6D'};
            this.checkinButton=false;
          }else if(data.finishTime===null){
            //还未签退
            this.checkinContent="签到成功,时间为:"+dateFormat(data.startTime);
            this.checkoutContent='未签退';
            this.checkinBodyStyle={background:'#85CE61'};
            this.checkoutBodyStyle={background:'#FF6D6D'};
            this.checkinButton=true;
          }else{
            //已经签到和签退
            this.checkinContent="签到成功,时间为:"+dateFormat(data.startTime);
            this.checkoutContent="签退成功,时间为:"+dateFormat(data.finishTime);
            this.checkinBodyStyle={background:'#85CE61'};
            this.checkoutBodyStyle={background:'#85CE61'};
            this.checkinButton=true;
          }
      });
      // //请求本月签到签退数据
      // var fromDate=new Date();
      // fromDate.setFullYear(this.showDateValue.getFullYear());
      // fromDate.setMonth(this.showDateValue.getMonth());
      // fromDate.setDate(1);
      // var toDate=new Date();
      // toDate.setFullYear(this.showDateValue.getFullYear());
      // toDate.setMonth(this.showDateValue.getMonth());
      // toDate.setDate(getDaysOfMonth(this.showDateValue.getFullYear(),this.showDateValue.getMonth()));
      // opAttendance.queryAttendancs(fromDate,toDate).then(data=>{
      //   this.attendances=data;
      //   //console.log(this.attendances);
      // })
    },

    methods:{
      checkin(){
        opAttendance.checkin().then(data=>{
          //更新背景颜色
          this.checkinBodyStyle={background:' #85CE61'};
          //更新卡片内容
          this.checkinContent="签到成功,时间为:"+dateFormat(data.startTime);
          //按钮设置为不可用
          this.checkinButton=true;
        })
      },
      checkout(){
        opAttendance.checkout().then(data=>{
          //更新背景颜色
          this.checkoutBodyStyle={background:' #85CE61'};
          //更新卡片内容
          this.checkoutContent="签退成功,时间为:"+dateFormat(data.finishTime);
        })
      },

      // stateFlag(date){
      //     //从集合中查找
      //   if(this.attendances===null){
      //     return null;
      //   }
      //   var record=this.attendances.find(element=>{
      //     return (element.recDate===date.valueOf());
      //   });
      //  // console.log(record);
      //   // //
      //   // '✔',
      //   //   '🔴 '//出差 请假
      //   //  '🔵'
      //   //  '❌'
      // }

    }
  }
</script>

<style scoped>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;

  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 40%;
    margin-top: 50px;
    margin-right: 25px;
  }
  #box-checkincard{
    float:left;
  }
  #box-checkoutcard{
    float: right;
  }
  /*#box-checkoutcard{*/
  /*  margin-top: 150px;*/
  /*}*/

  /*.clockin-container{*/
  /*  width:35%;*/
  /*  float:left;*/
  /*}*/

  /*.calender-container{*/
  /*    float:left;*/
  /*    width:65%;*/
  /*}*/
</style>
