<template>
  <div>
    <div class="left">
      <el-form ref="form" :model="form" :rules="rules" style="margin-top: 6px;" size="small" label-width="100px">
        <el-form-item label="邮件标题" prop="subject">
          <el-input v-model="form.subject" style="width: 646px" />
        </el-form-item>
        <el-form-item
          v-for="(domain, index) in tos"
          :key="domain.key"
          :label="'收件邮箱' + (index === 0 ? '': index)"
        >
          <el-input v-model="domain.value" style="width: 550px" />
          <el-button icon="el-icon-plus" @click="addDomain" />
          <el-button style="margin-left:0;" icon="el-icon-minus" @click.prevent="removeDomain(domain)" />
        </el-form-item>
        <div ref="editor" class="editor" />
        <el-button :loading="loading" style="margin-left:1.6%;" size="medium" type="primary" @click="doSubmit">发送邮件</el-button>
      </el-form>
    </div>

    <div class="right">
      <el-form ref="letfForm" :model="rightForm" label-width="80px">
<!--        <el-form-item label="面试伦次">-->
<!--            <el-select v-model="rightForm.interviewState" placeholder="请选择面试伦次">-->
<!--              <el-option label="第一轮" value="1"></el-option>-->
<!--              <el-option label="第二轮" value="2"></el-option>-->
<!--              <el-option label="第三轮" value="3"></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->

        <el-form-item label="面试人">
          <el-select v-model="rightForm.interviewMan" placeholder="请选择">
            <el-option
              v-for="item in interviewManOptions"
              :key="item.id"
              :label="item.username"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="负责人">
          <el-select v-model="rightForm.responsiblePerson" placeholder="请选择">
            <el-option
              v-for="item in responsiblePersonOptions"
              :key="item.id"
              :label="item.username"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="面试时间">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择日期" v-model="rightForm.date1" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-time-select
              v-model="rightForm.date2"
              :picker-options="{start: '08:30',   step: '00:15',   end: '18:30'}"
              placeholder="选择时间">
            </el-time-select>
          </el-col>
        </el-form-item>
        <el-form-item label="面试地点">
          <el-input v-model="rightForm.address"></el-input>
        </el-form-item>

        <el-form-item label="联系电话">
          <el-input v-model="rightForm.phoneNumber"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="rightForm.desc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="pushProcessToInterview()">立即创建</el-button>
          <el-button type="primary" @click="createEmail()">生成邮件</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
      <div id="emailTemplate" v-show="false">
        <p>{{candidate.name}}先生/女士， 您好！此邮件来自XX公司，诚邀您参加本公司的面试。您若不能按时参加面试，请以邮件或电话的形式告知，我会再次协调您的面试时间。 祝您面试成功。</p>
        <p>职位名称:{{candidate.jobName}}</p>
        <p>面试日期:{{getDateDesc()}} </p>
        <p>面试时间:{{rightForm.date2}}（请提前5到10分钟到达)</p>
        <p>前台联系:{{rightForm.phoneNumber}}</p>
        <p>面试地址:{{rightForm.address}}</p>
        <p>附:{{rightForm.desc}}</p>
        <p>XX公司期待您的加入！<br></p>​
      </div>
    </div>
  </div>
</template>

<script>
import { send } from '@/api/tools/email'
import { upload } from '@/utils/upload'
import { validEmail } from '@/utils/validate'
import { mapGetters } from 'vuex'
import dateFormat from "../../../utils/dateFormat";
import E from 'wangeditor'
import opRruitmentPeople from '@/api/recruitment/recruitmentPeople'
export default {
  props:{
    candidate:{
      default:{
        id:'',
        name:'',
        email:'',
        jobName:''
      }
    }
  },
  data() {
    return {
      loading: false,
      form: { subject: '', tos: [], content: '' },
      tos: [],
      recruitmentPeople:{name:'李小甜',jobName:'app测试'},
      editor:null,//编辑器的引用
      rightForm:{
        interviewState:null,
        interviewMan:null,
        responsiblePerson:null,
        date1:null,
        date2:null,
        address:'',
        phoneNumber:null,
        desc:null
      },
      interviewManOptions:[{id:1,username:'zzy'},{id:2,username:'test'}],
      responsiblePersonOptions:[{id:1,username:'zzy'},{id:2,username:'test'}],
      rules: {
        subject: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'imagesUploadApi'
    ])
  },
  mounted() {
    const _this = this
    var editor = new E(this.$refs.editor)
    // 自定义菜单配置
    editor.customConfig.zIndex = 10
    // 文件上传
    editor.customConfig.customUploadImg = function(files, insert) {
      // files 是 input 中选中的文件列表
      // insert 是获取图片 url 后，插入到编辑器的方法
      files.forEach(image => {
        files.forEach(image => {
          upload(_this.imagesUploadApi, image).then(data => {
            insert(data.data.url)
          })
        })
      })
    }
    editor.customConfig.onchange = (html) => {
      this.form.content = html
    }
    editor.create()
    this.editor=editor;

    //设置domain和收件人
    this.form.subject=this.candidate.name;
    this.tos.push({value:this.candidate.email});
    // if(this.candidate!==undefined){
    //
    // }else{
    //   this.tos.push({value:''});
    // }

  },
  methods: {
    removeDomain(item) {
      var index = this.tos.indexOf(item)
      if (index !== -1 && this.tos.length !== 1) {
        this.tos.splice(index, 1)
      } else {
        this.$message({
          message: '请至少保留一位联系人',
          type: 'warning'
        })
      }
    },
    addDomain() {
      this.tos.push({
        value: '',
        key: Date.now()
      })
    },
    doSubmit() {
      const _this = this
      this.$refs['form'].validate((valid) => {
        this.form.tos = []
        if (valid) {
          let sub = false
          this.tos.forEach(function(data, index) {
            if (data.value === '') {
              _this.$message({
                message: '收件邮箱不能为空',
                type: 'warning'
              })
              sub = true
            } else if (validEmail(data.value)) {
              _this.form.tos.push(data.value)
            } else {
              _this.$message({
                message: '收件邮箱格式错误',
                type: 'warning'
              })
              sub = true
            }
          })
          if (sub) { return false }
          this.loading = true
          send(this.form).then(res => {
            this.$notify({
              title: '发送成功',
              type: 'success',
              duration: 2500
            })
            this.loading = false
          }).catch(err => {
            this.loading = false
            console.log(err.response.data.message)
          })
        } else {
          return false
        }
      })
    },

    //生成模板时获取面试伦次的描述
    // getInterViewStateDesc(){
    //   if(this.rightForm.interviewState===null){
    //     return '';
    //   }else  if(this.rightForm.interviewState==='1'){
    //     return '第一轮面试';
    //   }else if(this.rightForm.interviewState==='2'){
    //     return '第二轮面试'
    //   }else if(this.rightForm.interviewState==='3'){
    //     return '终面'
    //   }
    // },
    getDateDesc(){
      if(this.rightForm.date1===null){
        return '';
      }else{
        return dateFormat(this.rightForm.date1.valueOf(),'yyyy-MM-dd');
      }
    },

    //生成邮件
    createEmail(){
      console.log(this.candidate)
      this.editor.txt.html( document.querySelector('#emailTemplate').innerHTML);
    },

    //立即创建
    pushProcessToInterview(){
      var data={};
      data.id=this.candidate.id;
      data.process=1;
      data.interviewState=0;
      opRruitmentPeople.edit(data).then(data=>{
        this.$message.success("创建面试信息成功");
      });
    }
  }
}
</script>

<style scoped>
  .editor{
    text-align:left;
    margin: 20px;
    width: 730px;
  }
  /deep/ .w-e-text-container {
    height: 360px !important;
  }

  .left{
    float: left;
    width: 45%;
  }
  .right{
    padding-top: 25px;
    float: right;
    width: 40%;
  }
</style>
