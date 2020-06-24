<template>
  <el-tabs v-model="activeName" @tab-click="handleClick" style="margin:10px">
    <el-tab-pane label="筛选简历" name="first">
      <Resume></Resume>
    </el-tab-pane>
    <el-tab-pane label="面试" name="second">
      <Interview></Interview>
    </el-tab-pane>

    <el-tab-pane label="offer" name="thired">
      <Offer></Offer>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
  import Resume from "./resume";
  import Offer from "./offer";
  import Interview from "./interview"
  export default {
  components:{Offer, Interview, Resume},
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
