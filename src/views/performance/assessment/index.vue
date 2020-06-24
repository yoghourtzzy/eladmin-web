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
          <el-button type="primary" @click="cpFormRevise=true">创建绩效考核</el-button>
        </el-form-item>

      </el-form>

      <div style="height: 30px"></div>
      <el-table  :data="tableData" border highlight-current-row   style="width: 100%">
        <el-table-column  prop="name" label="考核名称" >
        </el-table-column>
        <el-table-column  prop="month" label="考核月份"  >
          <template slot-scope="scope">
            <span>{{ scope.row.month|dateFormat("yyyy-MM")}}</span>
          </template>
        </el-table-column>
        <el-table-column  prop="userName" label="员工姓名" >
        </el-table-column>
        <el-table-column  prop="deptName" label="部门">
        </el-table-column>
        <el-table-column  prop="finalScore" label="绩效分">
          <template slot-scope="scope">
            <span v-if="scope.row.finalScore===null">未打分</span>
            <span v-else>{{scope.row.finalScore}}</span>
          </template>
        </el-table-column>

        <el-table-column  label="操作">

          <template slot-scope="scope">
            <el-button type="success" round size="small" @click="openAssessmentDialog(scope.row)" >打分</el-button>
            <el-button type="danger"  round size="small" @click="handleDelClick" >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="handleCurrentChange" background layout="prev, pager, next":total="total" :current-page="currentPage" :page-size	="pageSize"	>
      </el-pagination>

      <el-dialog title="创建绩效考核" :visible.sync="cpFormRevise" width="50%">
        <el-form :model="cpForm"  :inline="true" size="small">
          <el-row>
            <el-col :span="11"  >
              <el-form-item label="绩效考核名称" >
                <el-input v-model="cpForm.name" placeholder="请输入内容" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="考核部门">
                <el-select v-model="cpForm.deptId"   placeholder="请选择">
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
          <el-row>
            <el-col :span="11">
              <el-form-item label="考核月份">
                <el-date-picker
                  v-model="cpForm.month"
                  type="month"
                  placeholder="选择月">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="考核人">
                <el-input
                  placeholder="部门主管"
                  :disabled="true">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="cpFormRevise = false">取 消</el-button>
          <el-button type="primary" @click="createPerformance()" >确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="绩效评定" :visible.sync="assessmentRevise" width="50%">
        <el-form :model="assForm"  :inline="true" size="small">
          <el-row>
            <el-col :span="11"  >
              <el-form-item label="本月任务评分" >
                <el-input v-model="assForm.taskScore"    :disabled="true" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item   label="月末打分">
                <el-input v-model="assForm.monthlyScore"  ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="最终绩效" >
                <el-input  v-model="assForm.finalScore"   :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入评语"
            v-model="assForm.comment">
          </el-input>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="cancelAssessment()">取 消</el-button>
          <el-button type="primary" @click="computePerformance()" >计算绩效</el-button>
          <el-button type="primary" @click="assessment()" >确 定</el-button>
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
          id:1,
          name:'2020年5月研发部绩效考核',
          month:null,
          userName:'李好甜',
          deptName:'开发部',
          finalScore:3
        }],

        //------------------筛选器
        selectedMonth:this.getFirstDay(),
        //------------------筛选器


        //---------------------------创建绩效考核
        cpFormRevise:false,
        jobOptionDisabled:true,
        depts:[],//部门数据

        //创建绩效考核表单
        cpForm:{

        },
        //--------------------------

        //--------------评分
        assessmentRevise:false,
        assForm:{
          id:null,
          taskScore:null,
          monthlyScore:null,
          finalScore:null,
          comment:null
        },
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
      this.getPerformance();
    },



    methods:{



      handleDelClick(data){
        opPerformance.del([data.id]).then(data=>{
          this.getPerformance();
        });
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
        this.assForm.id=data.id;
        //加载任务数据
        request({
            url:getUrlWithPara('api/task/ave',{
              userid:data.userId,
              month:dateFormat(data.month.valueOf())
            }),
            method:'get'
        }).then(result=>{
           console.log(result);
           this.assForm.taskScore=result.toFixed(2  );
        })
      },

      //绩效考核
      assessment(){
        opPerformance.edit(this.assForm).then(data=>{
          this.$message.success("评分成功");
          this.assessmentRevise=false;
          this.getPerformance();
        })
      },

      //创建绩效考核
      createPerformance(){
        opPerformance.add(this.cpForm).then(data=>{
          this.$message.success("添加成功")
          this.getPerformance();
        });
        this.cpFormRevise=false;
      },

      //获取绩效考核
      getPerformance(){
        request({
              url:getUrlWithPara('api/performance/byrole',{
                month:dateFormat(this.selectedMonth.valueOf()),
                page:this.currentPage-1,
                size:this.pageSize
              }),
              method: 'get'
            }).then(data=>{
              this.tableData =data.content;
              this.total=data.totalElements;
        })
      },



      //分页
      handleCurrentChange(val){
        this.currentPage=val;
        this.getPerformance()
      },
      //查询
      search:function () {
        this.getPerformance()
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
