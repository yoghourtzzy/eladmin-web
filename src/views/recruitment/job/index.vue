<template>
  <div style="margin: 25px">
    <el-card style="height: 800px">
      <el-form  :inline="true" size="small"  label-width="90px">
        <el-form-item>
          <el-select v-model="selectedState" placeholder="请选择">
            <el-option
              v-for="item in stateOptions"
              :key="item.state"
              :label="item.label"
              :value="item.state">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="search()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="revise=true">新增</el-button>
        </el-form-item>

      </el-form>

      <div style="height: 30px"></div>
      <el-table  :data="tableData" border highlight-current-row   style="width: 100%">
        <el-table-column  prop="name" label="招聘职位名称" >
        </el-table-column>
        <el-table-column  prop="jobType" label="职位类型">
          <template slot-scope="scope">
            <span v-if="scope.row.jobType===0">全职</span>
            <span v-else-if="scope.row.jobType===1">劳务派遣</span>
            <span v-else>实习</span>
          </template>
        </el-table-column>
        <el-table-column  prop="deptName" label="所属部门" ></el-table-column>
        <el-table-column  prop="jobName" label="所属岗位" ></el-table-column>
        <el-table-column  prop="needNum" label="需求人数"  >
        </el-table-column>
        <el-table-column  prop="acceptResume" label="接收简历">
        </el-table-column>
        <el-table-column  prop="acceptOffer" label="入职人数" show-overflow-tooltip></el-table-column>

        <el-table-column  label="操作">
          <template slot-scope="scope">
            <el-button  v-show="selectedState===0" @click="handleCloseClick(scope.row)" type="text" size="small">关闭</el-button>
            <el-button v-show="selectedState===1" @click="handleOpenClick(scope.row)" type="text" size="small">打开</el-button>
            <el-button @click="handleDelClick(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
      <el-pagination @current-change="handleCurrentChange" background layout="prev, pager, next":total="total" :current-page="currentPage" :page-size	="pageSize"	>
      </el-pagination>

      <el-dialog title="新增求职人" :visible.sync="revise" width="50%">
        <el-form :model="form"  :inline="true" size="small">
          <el-row>
            <el-col :span="11"  >
              <el-form-item label="招聘岗位名称" >
                <el-input v-model="form.name" placeholder="请输入内容" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="关联部门">
                <el-select v-model="form.deptId" @change="deptOptionChange" placeholder="请选择">
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
              <el-form-item label="关联岗位">
                <el-select v-model="form.jobId" :disabled="jobOptionDisabled" placeholder="请选择">
                <el-option
                  v-for="item in jobs"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="岗位类型">
                <el-select v-model="form.jobType" placeholder="请选择">
                  <el-option
                    v-for="item in jobTypes"
                    :key="item.type"
                    :label="item.name"
                    :value="item.type">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="11">
              <el-form-item label="需求人数">
                <el-input v-model="form.needNum" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="revise = false">取 消</el-button>
          <el-button type="primary" @click="submitForm()" >确 定</el-button>
        </div>
      </el-dialog>

    </el-card>

  </div>
</template>

<script>
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
          name:'开发部/开发',
          jobName:'开发',
          jobId:1,
          jobType:0,
          deptName:'开发部',
          deptId:1,
          state:0,
          needNum:3,
          acceptResume:1,
          interviewInvitation:1,
          takeInterview:1,
          sendOffer:1,
          acceptOffer:1,
        }],

        //------------------筛选器
        stateOptions: [{
          state: 0,
          label:'未结束'
        }, {
          state:1,
          label: '已结束'
        }],
        selectedState:0,
        //------------------筛选器

        //----------------------------dialog
        revise:false,
        jobOptionDisabled:true,
        depts:[],//部门数据
        jobs:[],//岗位数据
        completeJobs:[],
        form:{
          name:'',
          deptId:null,
          jobId:null,
          jobType:null,
          needNum:null
        } ,

        jobTypes:[{
          type:0,
          name:'全职'
        },{
          type:1,
          name:'劳务派遣'
        },{
          type:2,
          name:'实习'
        }],
        //--------------------------dialog



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
      //请求岗位数据
      request({
        url:getUrlWithPara('api/job',{
          page:0,
          size:100
        }),
        method: 'get'
      }).then(data=>{
        this.completeJobs =data.content;
      });
      //请求表格数据
      var para={
        state:this.selectedState,
        page:this.currentPage-1,
        size:this.pageSize
      };
      this.getRecruitmentJob(para);
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
      //岗位选项中的岗位需是选中部门中的岗位
      deptOptionChange(data){
        this.jobOptionDisabled=false;
        this.jobs=this.completeJobs.filter(item=>{
          if(item.dept.id===data){
            return true;
          }else{
            return false;
          }
        })
      },

      //提交表单
      submitForm(){
        opRruitmentJob.add(this.form).then(data=>{
          this.$message.success("添加成功")
          //更新表格
          var para={
            state:this.selectedState,
            page:this.currentPage-1,
            size:this.pageSize
          };
          this.getRecruitmentJob(para);
        });
        this.revise=false;
      },

      getRecruitmentJob(para){
        request({
          url:getUrlWithPara('api/recruitment/job',para),
          method: 'get'
        }).then(data=>{
          this.tableData =data.content;
          this.total=data.totalElements;
        })
      },



      // currentPage,pageSize,startDate,finishDate
      getApply(para){
        request({
          url:getUrlWithPara('api/recuitment/job',para),
          method: 'get'
        }).then(data=>{
          this.tableData =data.content;
          this.total=data.totalElements;
        })
      },

      //分页
      handleCurrentChange(val){
        // this.currentPage=val;
        // var para={
        //   state:this.selectedState,
        //   page:this.currentPage-1,
        //   size:this.pageSize
        // };
        // this.getApply(para);
      },

      search:function () {
        var para={
          state:this.selectedState,
          page:this.currentPage-1,
          size:this.pageSize
        };
        this.getRecruitmentJob(para);
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
