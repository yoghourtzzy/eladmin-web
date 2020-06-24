<template>
  <div style="margin: 25px">
    <el-card style="height: 800px">
      <el-radio-group v-model="offerState">
        <el-radio-button label="0">待确认</el-radio-button>
        <el-radio-button label="1">通过</el-radio-button>
        <el-radio-button label="2">放弃</el-radio-button>
      </el-radio-group>


      <div style="height: 30px"></div>
      <el-table  :data="tableData" border highlight-current-row   style="width: 100%">
        <el-table-column  prop="name" label="姓名" >
        </el-table-column>
        <el-table-column  prop="recruitmentJobName" label="申请岗位"  >
        </el-table-column>
        <el-table-column  prop="email" label="邮件"  >
        </el-table-column>
        <el-table-column  prop="phone" label="电话"  >
        </el-table-column>
        <el-table-column  prop="school" label="学校"  >
        </el-table-column>
<!--        <el-table-column  prop="approveTime" label="简历" >-->

<!--        </el-table-column>-->
        <el-table-column  label="操作" width="200px" >
          <template slot-scope="scope">
            <el-button type="text"  @click="changeOfferState(scope.row,2)">放弃</el-button>
            <el-button type="text" @click="changeOfferState(scope.row,1)">确认</el-button>
            <el-button type="text" @click="addUser(scope.row)">入职</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="handleCurrentChange" background layout="prev, pager, next":total="total" :current-page="currentPage" :page-size	="pageSize"	>
      </el-pagination>

      <div></div>

      <el-dialog title="新增用户" :visible.sync="revise" width="65%">
        <el-form :model="form">
          <el-row>
            <el-col :span="11">
              <el-form-item label="姓名">
                <el-input v-model="form.username" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" offset="2">
              <el-form-item label="昵称">
                <el-input v-model="form.nickName" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="性别">
                <el-input v-model="form.sex" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" offset="2">
              <el-form-item label="电话">
                <el-input v-model="form.phone" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="11">
              <el-form-item label="email">
                <el-input v-model="form.email" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" offset="2">
              <el-form-item label="部门">
                <el-input v-model="form.deptName" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="11">
                <el-form-item label="职位">
                <el-input v-model="form.jobName" placeholder="请输入内容"></el-input>
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
  import dateFormat from "../../../utils/dateFormat";
  import {getUrlWithPara} from  "../../../utils/urlUtil";
  import opRruitmentPeople from '@/api/recruitment/recruitmentPeople'

  export default {
    name:'Interview',
    data() {
      return {
        dialogName:'aa',
        checkList: ['',],
        tableData: [{
          id:1,
          name:'李小甜',
          jobName:'Java开发',
          age:24,
          sex:'女',
          school:'杭州邮电大学',
          email:'lixiaotian@qq.com',
          phone:'13212215336'
        }],

        offerState:'0',
        //--------------------el-dialog
        form: {
          username: '',
          nickName:'',
          sex:'',
          phone:'',
          email:'',
          deptName:'',
          jobName:'',
          dept:'',
          job:'',
          roles:[{id:1}],
          enabled:true
        },

        options: [],
        revise:false,//表单是否展现
        //--------------------el-dialog

        //------------------------分页
        currentPage:1,
        pageSize:10,
        total:null,
        //------------------------分页




        add: false,
        addWidth: '120px',
      }
    },




    watch:{
      offerState:function(){
        this.getTableData();
      }
    },

    created:function(){
      this.getTableData();
    },





    methods:{
      addUser(data){
        this.revise=true;
        this.form.username=data.name;
        this.form.sex=data.sex;
        this.form.email=data.email;
        this.form.phone=data.phone;
        request({
          url:getUrlWithPara('api/recruitment/job',{
            id:data.recruitmentJobId,
            page:0,
            size:100
          }),
          method: 'get'
        }).then(data=>{
          var rJob =data.content[0];
          this.form.deptName=rJob.deptName;
          this.form.dept={id:rJob.deptId};
          this.form.jobName=rJob.jobName;
          this.form.job={id:rJob.jobId};
        });
      },

      //加载表格数据
      // currentPage,pageSize,startDate,finishDatepara
      getTableData(){
        request({
          url:getUrlWithPara('api/recruitment/people',{process:2,
            offerState:this.offerState,
            page:this.currentPage-1,
            size:this.pageSize}),
          method: 'get'
        }).then(data=>{
          this.tableData =data.content;
          console.log(data.content)
        });
      },
      //分页
      handleCurrentChange(val){
        this.currentPage=val;
        var para={
          type:0,
          page:this.currentPage-1,
          size:this.pageSize
        };
        this.getApply(para);
      },

      changeOfferState(data,state){
        data.offerState=state;
        opRruitmentPeople.edit(data).then(data=>{
          this.getTableData();
        });
      },




      submitForm:function () {
        request({
          url:'api/users',
          method:'post',
          data:this.form
        }).then(data=>{
          this.$message.success("新增成功");
          this.revise=false;
        })
      },

    }

  }
</script>

<style>
  .el-checkbox+.el-checkbox {
    margin-right: 20px;
    margin-left: 0px;
  }
</style>
