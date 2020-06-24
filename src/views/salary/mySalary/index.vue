<template>
  <div style="margin: 25px">
    <el-card style="height: 800px">
      <el-form  :inline="true" size="small"  label-width="90px">
        <el-form-item>
          <el-date-picker
            v-model="selectedMonth"
            type="month"
            placeholder="选择月">
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="search()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="pubSalaryFormRevise=true">发布工资</el-button>
        </el-form-item>
      </el-form>

      <div style="height: 30px"></div>
      <el-table  :data="tableData" border highlight-current-row   style="width: 100%">
        <el-table-column  prop="month" label="月份" >
<!--          <template slot-scope="scope">-->
<!--            <span>{{ scope.row.month|dateFormat("yyyy-MM")}}</span>-->
<!--          </template>-->
        </el-table-column>
        <el-table-column  prop="userName" label="员工姓名" >
        </el-table-column>

        <el-table-column  prop="deptName" label="部门">
        </el-table-column>
        <el-table-column  prop="jobName" label="岗位">
        </el-table-column>
        <el-table-column  prop="baseSalary" label="基本工资" >
        </el-table-column>

        <el-table-column  prop="trafficSalary" label="交通补贴" >
        </el-table-column>

        <el-table-column  prop="lunchSalary" label="午餐补贴" >
        </el-table-column>

        <el-table-column  prop="finalBonus" label="最终奖金" >
        </el-table-column>
        <el-table-column  prop="insurance" label="五险一金扣除" >
        </el-table-column>
        <el-table-column  prop="tax" label="个人所得税" >
        </el-table-column>
        <el-table-column  prop="attendanceDeduction" label="缺勤扣除" >
        </el-table-column>
        <el-table-column  prop="finanlSalary" label="最终工资   " >
        </el-table-column>
      </el-table>

      <el-pagination @current-change="handleCurrentChange" background layout="prev, pager, next":total="total" :current-page="currentPage" :page-size	="pageSize"	>
      </el-pagination>

      <el-dialog title="创建绩效考核" :visible.sync="pubSalaryFormRevise" width="50%">
        <el-form :model="pubSalaryForm"  :inline="true" size="small">
          <el-row>
            <el-col :span="11"  >
              <el-form-item label="工资月份">
                <el-date-picker
                  v-model="month"
                  type="month"
                  placeholder="选择月">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="部门">
                <el-select v-model="deptId"   placeholder="请选择">
                  <el-option
                    v-for="item in depts"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="pubSalaryFormRevise = false">取 消</el-button>
          <el-button type="primary" @click="pubSalary()" >确 定</el-button>
        </div>
      </el-dialog>



    </el-card>

  </div>
</template>

<script>
  import opPerformance from '@/api/performance/performance'
  import request from '@/utils/request'
  import opAttendanceApply from '@/api/attendance/attendanceApply'
  import opRruitmentJob from '@/api/recruitment/recruitmentJob'
  import dateFormat from "../../../utils/dateFormat";
  import {getUrlWithPara} from  "../../../utils/urlUtil";
  export default {
    data() {
      return {
        dialogName:'aa',
        checkList: ['',],
        tableData: [{
          month:'2020-4',
          userName:'test',
          deptName:'研发部',
          jobName:'测试',
          baseSalary:5000,
          trafficSalary:100,
          lunchSalary:100,
          finalBonus:970,
          insurance:875,
          tax:185.1,
          attendanceDeduction:0,
          finanlSalary:5109.9
        },
          {
            month:'2020-5',
            userName:'test',
            deptName:'研发部',
            jobName:'测试',
            baseSalary:5000,
            trafficSalary:100,
            lunchSalary:100,
            finalBonus:950,
            insurance:875,
            tax:184.5,
            attendanceDeduction:0,
            finanlSalary:5090.5
          }
        ],

        //------------------筛选器
        //selectedMonth:this.getFirstDay(),
        //------------------筛选器


        //---------------------------发布工资
        pubSalaryFormRevise:false,
        depts:[],//部门数据

        //创建绩效考核表单
        pubSalaryForm:{

        },
        month:null,
        deptId:null,
        //--------------------------

        //--------------评分
        //



        //------------------------分页
        currentPage:1,
        pageSize:10,
        total:null,
        //------------------------分页




        add: false,
        addWidth: '120px',
      }
    },




    created:function(){
      //请求部门数据
      request({
        url:'api/dept/list',
        method: 'get'
      }).then(data=>{
        this.depts =data;
      });
      //请求表格数据
      //this.getPerformance();
    },


    methods:{
      handleCloseClick(data){
        data.state=1;
        opRruitmentJob.edit(data);
        var para={
          state:this.selectedState,
          page:this.currentPage-1,
          size:this.pageSize
        };
        this.getRecruitmentJob(para);
      },
      handleOpenClick(data){
        data.state=0;
        opRruitmentJob.edit(data);
        var para={
          state:this.selectedState,
          page:this.currentPage-1,
          size:this.pageSize
        };
        this.getRecruitmentJob(para);
      },

      handleDelClick(data){
        opRruitmentJob.del([data.id]);
        var para={
          state:this.selectedState,
          page:this.currentPage-1,
          size:this.pageSize
        };
        this.getRecruitmentJob(para);
      },
      computePerformance(){
        this.assForm.finalScore=this.assForm.taskScore/2+this.assForm.monthlyScore/2;
      },
      cancelAssessment(){
        this.assForm.taskScore=null;
        this.assForm.finalScore=null;
        this.assForm.monthlyScore=null;
        this.assForm.comment=null;
        this.assessmentRevise=false;
      },
      openAssessmentDialog(data){
        this.assessmentRevise=true;
        //加载任务数据
        request({
          url:getUrlWithPara('api/task/ave',{
            userid:data.userId
          }),
          method:'get'
        }).then(result=>{
          console.log(result);
          this.assForm.taskScore=result
        })
      },


      //创建绩效考核
      pubSalary(){
          this.$message.error("请在次月月初之后进行工资发布")
      },

      //获取绩效考核
      // getPerformance(){
      //   request({
      //     url:getUrlWithPara('api/performance',{
      //       month:dateFormat(this.selectedMonth.valueOf()),
      //       page:this.currentPage-1,
      //       size:this.pageSize
      //     }),
      //     method: 'get'
      //   }).then(data=>{
      //     this.tableData =data.content;
      //     this.total=data.totalElements;
      //   })
      // },



      //分页
      handleCurrentChange(val){
        this.currentPage=val;
       // this.getPerformance()
      },
      //查询
      search:function () {
        //this.getPerformance()
      },

      getFirstDay(){
        var date = new Date();
        date.setDate(1);
        date.setHours(0);
        date.setSeconds(0);
        date.setMinutes(0);
        return date;
      }

    }

  }
</script>

<style>
  .el-checkbox+.el-checkbox {
    margin-right: 20px;
    margin-left: 0px;
  }
</style>
