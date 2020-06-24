<template>
  <div style="margin: 25px">
    <el-card style="height: 800px">
      <el-radio-group v-model="resumeState">
        <el-radio-button label="0">未处理</el-radio-button>
        <el-radio-button label="1">淘汰</el-radio-button>
        <el-radio-button label="2">通过</el-radio-button>
      </el-radio-group>
      <el-button type="danger" @click="revise=true">新增求职人</el-button>

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
        <el-table-column  prop="approveTime" label="简历" >
          <template slot-scope="scope">
            <el-button type="text"  @click="openFileDilog(scope.row)">上传</el-button>
            <a
              slot="reference"
              :href="baseApi + '/file/' + scope.row.type + '/' + scope.row.realName"
              class="el-link--primary"
              style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color: #1890ff;font-size: 13px;"
              target="_blank"
            >
              下载
            </a>
          </template>
        </el-table-column>
        <el-table-column  label="操作" width="200px" >
          <template slot-scope="scope">
            <el-button type="text"  @click="deleteCandidate(scope.row)">删除</el-button>
            <el-button type="text"  @click="changeResumeState(scope.row,1)">淘汰</el-button>
            <el-button type="text" @click="changeResumeState(scope.row,2)">通过</el-button>
            <el-button type="text" @click="sendInterview(scope.row)">面试通知</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="handleCurrentChange" background layout="prev, pager, next":total="total" :current-page="currentPage" :page-size	="pageSize"	>
      </el-pagination>

      <div></div>

      <el-dialog title="新增求职人" :visible.sync="revise" width="65%">
        <el-form :model="form">
          <el-row :gutter="20">
            <el-col :span="11">
              <el-form-item label="姓名">
               <el-input v-model="form.name" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="年龄">
                <el-input v-model="form.age" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="11">
              <el-form-item label="性别">
                <el-input v-model="form.sex" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="申请岗位">
               <br/>
                <el-select v-model="form.recruitmentJobId" placeholder="请选择">
                  <el-option
                    v-for="item in recruitmentJobs"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="11">
              <el-form-item label="毕业学校">
                <el-input v-model="form.school" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="电话号码">
                <el-input v-model="form.phone" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="11">
              <el-form-item label="email">
                <el-input v-model="form.email" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click.native="revise = false">取 消</el-button>
          <el-button type="primary"@click="submitForm()" >确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="简历上传" :visible.sync="fileRevise" width="65%">
        <el-upload
          ref="upload"
          :limit="1"
          :before-upload="beforeUpload"
          :auto-upload="false"
          :headers="headers"
          :on-success="handleSuccess"
          :on-error="handleError"
          :action="fileUploadApi + '?name=' + '应聘人'+fileName+'简历'"
        >
          <div class="eladmin-upload"><i class="el-icon-upload" /> 添加文件</div>
          <div slot="tip" class="el-upload__tip">可上传任意格式文件，且不超过100M</div>
        </el-upload>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="revise = false">取 消</el-button>
          <el-button :disabled="loading" type="primary" @click="upload">确认</el-button>
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
  import { getToken } from '@/utils/auth'
  import { mapGetters } from 'vuex'
  import opRruitmentJob from '@/api/recruitment/recruitmentJob'
  import opRruitmentPeople from '@/api/recruitment/recruitmentPeople'
  export default {
    name:'Resume',
    computed: {
      ...mapGetters([
        'baseApi',
        'fileUploadApi'
      ])
    },
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
        resumeState:'0',

       //上传简历
        headers: { 'Authorization': getToken() },
        loading:false,//确定按钮是否可用
        fileRevise:false,//上传简历是否可见
        fileName:null,
        currentCandidate:null,
//-------------------------------------

      //新增表单
        form: {
          name:null,
          age:null,
          sex:null,
          school:null,
          email:null,
          phone:null,
          recruitmentJobId:null
        },
        recruitmentJobs:[],
        options: [],
        revise:false,//表单是否展现
        //--------------------新增表单


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
     //加载表格数据
      this.getTableData()

      //加载对话框，招聘岗位
      request({
        url:getUrlWithPara('api/recruitment/job',{
          state:0,
          page:0,
          size:100
        }),
        method: 'get'
      }).then(data=>{
        this.recruitmentJobs =data.content;
      });
    },

  watch:{
    resumeState:function(){
      this.getTableData();
    }
  },


    methods:{
     openFileDilog(data){
       this.fileRevise=true;
       this.fileName=data.name;
       this.currentCandidate=data;
     },
      sendInterview(data){
            this.$router.push({name:'sendInterview',params:{candidate:data}})
      },
      //删除候选人
      deleteCandidate(data){
        opRruitmentPeople.del([data.id]).then(data=>{
          this.getTableData();
        });
      },
    //改变简历状态
      changeResumeState(data,state){
        data.resumeState=state;
        opRruitmentPeople.edit(data).then(data=>{
          this.getTableData();
        });
      },
      //加载表格数据
      // currentPage,pageSize,startDate,finishDatepara
      getTableData(){
        request({
          url:getUrlWithPara('api/recruitment/people',{
            resumeState:this.resumeState,
            page:this.currentPage-1,
            size:this.pageSize}),
          method: 'get'
        }).then(data=>{
          this.tableData =data.content;
          console.log(this.tableData)
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


     // -----------------dialog上传
      beforeUpload(file) {
        let isLt2M = true
        isLt2M = file.size / 1024 / 1024 < 100
        if (!isLt2M) {
          this.loading = false
          this.$message.error('上传文件大小不能超过 100MB!')
        }
        this.form.name = file.name
        return isLt2M
      },
      upload() {
        this.$refs.upload.submit()
      },
      handleSuccess(response, file, fileList) {
        this.$refs.upload.clearFiles()
        this.currentCandidate.resumeFileId=response.id;
        this.currentCandidate.type=response.type;
        this.currentCandidate.realName=response.realName;
        opRruitmentPeople.edit(this.currentCandidate);
      },
      // 监听上传失败
      handleError(e, file, fileList) {
        const msg = JSON.parse(e.message)
        this.$notify({
          title: msg.message,
          type: 'error',
          duration: 2500
        })
        this.loading = false
      },

      submitForm:function () {
        opRruitmentPeople.add(this.form).then(data=>{
          this.$message.success('添加成功！');
          this.revise=false;
          this.getTableData();
        });
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
