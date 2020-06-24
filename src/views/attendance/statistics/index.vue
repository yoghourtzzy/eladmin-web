<template>
  <div style="margin: 25px">
    <el-card style="height: 800px">

      <el-row :gutter="20">
        <el-col :span="8">
          <el-row>
            <el-col>
              <el-card shadow="hover" class="mgb20">
                <div class="user-info">
                  <img src="static/img/img.jpg" class="user-avator" alt="">
                  <div class="user-info-cont">
                    <div class="user-info-name"></div>
                    <div></div>
                  </div>
                </div>
<!--                <div class="user-info-list">姓名:zzy</div>-->
                <div class="user-info-list"></div>
              </el-card>
              <el-card shadow="hover">
                <div slot="header" class="clearfix">
                  <span></span>
                </div>
                出勤时间
                <el-progress :percentage="100" color="#42b983"></el-progress>
                请假
                <el-progress :percentage="0" color="#f1e05a"></el-progress>
                出差
                <el-progress :percentage="0" color="#f56c6c"></el-progress>
              </el-card>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="16">
          <el-row :gutter="20" class="mgb20">
            <el-col :span="8">
              <el-card shadow="hover" :body-style="{padding: '0px'}">
                <div class="grid-content grid-con-1">
                  <i class="el-icon-view grid-con-icon"></i>
                  <div class="grid-cont-right">
                    <div class="grid-num">12</div>
                    <div>出勤时间</div>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card shadow="hover" :body-style="{padding: '0px'}">
                <div class="grid-content grid-con-2">
                  <i class="el-icon-message grid-con-icon"></i>
                  <div class="grid-cont-right">
                    <div class="grid-num">0</div>
                    <div>请假次数</div>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card shadow="hover" :body-style="{padding: '0px'}">
                <div class="grid-content grid-con-3">
                  <i class="el-icon-goods grid-con-icon"></i>
                  <div class="grid-cont-right">
                    <div class="grid-num">0</div>
                    <div>出差时间</div>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
          <el-card shadow="hover" >

            <div slot="header" class="clearfix">
              <span>待办</span>
            </div>

<!--            <el-row class="tac" >-->
<!--              <el-col :span="12"  style="width: 1000px;"  >-->
<!--                <el-menu  router :default-active="$route.path"-->
<!--                          default-active="2"-->
<!--                          class="el-menu-vertical-demo"-->
<!--                          @open="handleOpen"-->
<!--                          @close="handleClose"-->
<!--                          background-color="#909399"-->
<!--                          text-color="#E6A23C"-->
<!--                          active-text-color="#ffd04b">-->
<!--                  <el-submenu index="1"  >-->
<!--                    <template slot="title" >-->
<!--                      <i class="el-icon-location"></i>-->
<!--                      <span >考勤处理</span>-->
<!--                    </template>-->
<!--                    <el-menu-item-group>-->
<!--                      <template slot="title">审批处理</template>-->
<!--                      <el-menu-item index="/dealPage0">请假处理</el-menu-item>-->
<!--                      <el-menu-item index="/dealPage1">加班处理</el-menu-item>-->
<!--                      <el-menu-item index="/dealPage2">出差处理</el-menu-item>-->
<!--                    </el-menu-item-group>-->

<!--                    <el-menu-item-group title="补签">-->
<!--                      <el-menu-item index="/DealRetroactive">补签处理</el-menu-item>-->
<!--                    </el-menu-item-group>-->

<!--                    <el-submenu index="1-4">-->
<!--                      <template slot="title">排班处理</template>-->
<!--                      <el-menu-item index="/arrangeClass">排班处理</el-menu-item>-->
<!--                    </el-submenu>-->
<!--                  </el-submenu>-->


<!--                  <el-menu-item index="2" disabled>-->
<!--                    <i class="el-icon-document"></i>-->
<!--                    <span slot="title">个人考勤</span>-->
<!--                  </el-menu-item>-->
<!--                </el-menu>-->
<!--              </el-col>-->
<!--            </el-row>-->



            <el-calendar></el-calendar>








          </el-card>

        </el-col>
      </el-row>

    </el-card>
  </div>


</template>


<script>
  export default {
    name:'Statistic',
    data() {
      return {
        userName:'zzy',
        uid:'',

      }
    },


    created(){
      this.getData()
    },



    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },

      getData(){
        var _this = this;
        var userName = sessionStorage.getItem('userName');
        _this.userName = userName;

      }
    },

    mounted() {
      var user = sessionStorage.getItem('user');
      if (user) {
        user= JSON.parse(user);
      }
      this.sysUserName = user.uUsername;

      var formData={
        uid: user.uid
      }
      var qs = require('querystring')
      var _self = this;
      this.$ajax.post('/cms-attendance-web/getPermission',
        qs.stringify(formData)).then(function(result) {
        var list = result.data.list;
      })

    },












  }





</script>


<style scoped>
  .el-row {
    margin-bottom: 20px;
  }

  .grid-content {
    display: flex;
    align-items: center;
    height: 100px;
  }

  .grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 12px;
    color: #999;
  }

  .grid-num {
    font-size: 30px;
    font-weight: bold;
  }

  .grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
  }

  .grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
  }

  .grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
  }

  .grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
  }

  .grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
  }

  .grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
  }

  .grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
  }

  .user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
  }

  .user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
  }

  .user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
  }

  .user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
  }

  .user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
  }

  .user-info-list span {
    margin-left: 70px;
  }

  .mgb20 {
    margin-bottom: 20px;
  }


</style>
