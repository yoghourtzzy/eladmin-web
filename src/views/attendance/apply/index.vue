<template>
  <el-tabs v-model="activeName" @tab-click="handleClick" style="margin:10px">
    <el-tab-pane label="请假申请" name="first">
      <LeaveApply></LeaveApply>
    </el-tab-pane>
    <el-tab-pane label="出差申请" name="second">
      <BussinessTripApply></BussinessTripApply>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
  import LeaveApply from "./leaveApply";
  import BussinessTripApply from "./businessTripApply"
  export default {
    components: {LeaveApply,BussinessTripApply},
    data() {
      return {
        activeName: 'first'
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
  };
</script>
