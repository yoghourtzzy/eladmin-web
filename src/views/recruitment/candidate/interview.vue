<template>
  <div style="margin: 25px">
    <el-card style="height: 800px">
      <el-radio-group v-model="interviewState">
        <el-radio-button label="0">待确认</el-radio-button>
        <el-radio-button label="1">进行中</el-radio-button>
        <el-radio-button label="2">淘汰</el-radio-button>
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
        <el-table-column  prop="approveTime" label="简历" >
          <template slot-scope="scope">
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
            <el-button type="text"  @click="changeInteviewState(scope.row,2)">淘汰</el-button>
            <el-button type="text" @click="changeInteviewState(scope.row,1)">确认</el-button>
            <el-button type="text" @click="sendOffer(scope.row)">发送offer</el-button>
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
  import opRruitmentPeople from '@/api/recruitment/recruitmentPeople'
  import {mapGetters} from "vuex";
  export default {
    name:'Interview',
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
          state:2,
          jobName:'Java开发',
          age:24,
          sex:'女',
          school:'杭州邮电大学',
          email:'lixiaotian@qq.com',
          phone:'13212215336'
        }],

        interviewState:'0',
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



    watch:{
      interviewState:function(){
        this.getTableData();
      }
    },

    created:function(){
      this.getTableData();
    },




    methods:{
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

      //加载表格数据
      // currentPage,pageSize,startDate,finishDatepara
      getTableData(){
        request({
          url:getUrlWithPara('api/recruitment/people',{process:1,
            interviewState:this.interviewState,
            page:this.currentPage-1,
            size:this.pageSize}),
          method: 'get'
        }).then(data=>{
          this.tableData =data.content;
          console.log(data.content)
        });
      },
      changeInteviewState(data,state){
        data.interviewState=state;
        opRruitmentPeople.edit(data).then(data=>{
          this.getTableData();
        });
      },


      sendOffer(data){
        this.$router.push({name:'sendOffer',params:{candidate:data}})
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
