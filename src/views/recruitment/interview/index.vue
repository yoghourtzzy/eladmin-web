<template>
  <div style="margin: 25px">
    <el-card style="height: 800px">



      <div style="height: 30px"></div>
      <el-table  :data="tableData" border highlight-current-row   style="width: 100%">
        <el-table-column  prop="interviewDate" label="面试时间" ></el-table-column>
        <el-table-column  prop="name" label="姓名" >
        </el-table-column>
        <el-table-column  prop="jobName" label="申请岗位"  >
        </el-table-column>
        <el-table-column  prop="email" label="邮件"  >
        </el-table-column>
        <el-table-column  prop="phone" label="电话"  >
        </el-table-column>
        <el-table-column  prop="school" label="学校"  >
        </el-table-column>
        <el-table-column  prop="approveTime" label="简历" >

        </el-table-column>
        <el-table-column  label="操作" width="200px" >
          <template slot-scope="scope">
            <el-button type="text"  @click="test(scope.row)">评价</el-button>
            <el-button  type="text" @click="confirm(scope.row)">查看评价</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="handleCurrentChange" background layout="prev, pager, next":total="total" :current-page="currentPage" :page-size	="pageSize"	>
      </el-pagination>

      <div></div>

      <el-dialog title="新增求职人" :visible.sync="revise" width="65%">
        <el-form :model="form">
          <el-row>
            <el-col :span="11">
              <el-form-item label="姓名">
                <el-input v-model="form.name" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" offset="2">
              <el-form-item label="年龄">
                <el-input v-model="form.age" placeholder="请输入内容"></el-input>
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
              <el-form-item label="毕业学校">
                <el-input v-model="form.school" placeholder="请输入内容"></el-input>
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
              <el-form-item label="电话号码">
                <el-input v-model="form.phone" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-upload
            class="upload-demo"
            drag
            action="https://jsonplaceholder.typicode.com/posts/"
            multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将简历拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">文件大小不超过10M</div>
          </el-upload>
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
  export default {
    data() {
      return {
        dialogName:'aa',
        checkList: ['',],
        tableData: [{
          id:1,
          name:'李小甜',
          state:2,
          jobName:'Java开发',
          age:24,
          sex:'女',
          school:'杭州邮电大学',
          email:'lixiaotian@qq.com',
          phone:'13212215336',
          interviewDate:'2020-5-9 12:23'
        }],

        resumeState:'0',
        dateScale:null,
        //--------------------el-dialog
        form: {
          selectedValue: '',//就是toUserId
          startDate:'',
          finishDate:'',
          reason:'',
          operationUserId:'',
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




    created:function(){
      // //请求表格数据
      // var para={
      //   type:0,
      //   page:this.currentPage-1,
      //   size:this.pageSize
      // };
      // this.getApply(para);
      //
      // //请求主管数据
      // request({
      //   url: 'api/users/director',
      //   method: 'get'
      // }).then(data=>{
      //   //初始化选择框
      //   this.options=data;
      //   //默认选中
      //   if(this.options!=null){
      //     this.form.selectedValue=this.options[0].id;
      //   }
      // })
    },




    methods:{
      addResume(){
        this.revise=true;
      },
      test(data){
        console.log(data);
      },
      sendInterview(data){
        this.$router.push({name:'sendInterview',params:{candidate:data}})
      },
      sendOffer(data){

      },
      // currentPage,pageSize,startDate,finishDate
      getApply(para){
        request({
          url:getUrlWithPara('api/attendanceApply/myapply',para),
          method: 'get'
        }).then(data=>{
          this.tableData =data.content;
          this.total=data.totalElements;
          console.log(data);
        })
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

      search:function () {
        if(this.dateScale===null){
          this.getApply({
            type:0,
            page:this.currentPage-1,
            size:this.pageSize
          });
        }else{
          this.getApply({
            type:0,
            createTime:[dateFormat(this.dateScale[0].valueOf()),dateFormat(this.dateScale[1].valueOf())],
            page:this.currentPage-1,
            size:this.pageSize
          })
        }
      },

      submitForm:function () {
        var  formData={
          toUserId:this.form.selectedValue,
          startDate:this.form.startDate,
          finishDate:this.form.finishDate,
          reason:this.form.reason,
          type:0//类型为请假
        };
        opAttendanceApply.add(formData).then(data=>{
          this.$message.success('申请成功！');
          this.revise=false;
        });
      },

      /**
       * 取消申请
       * @param id
       */
      cancelApply(id){
        opAttendanceApply.del([id]).then(data=>{
          this.$message.success('取消成功！');
          //重新请求数据
          if(this.dateScale===null){
            this.getApply({
              type:0,
              page:this.currentPage-1,
              size:this.pageSize
            });
          }else{
            this.getApply({
              type:0,
              createTime:[dateFormat(this.dateScale[0].valueOf()),dateFormat(this.dateScale[1].valueOf())],
              page:this.currentPage-1,
              size:this.pageSize
            })
          }
        })
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
