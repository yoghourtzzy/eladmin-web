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
      <el-form  :model="rightForm" label-width="80px">


        <el-form-item label="聘用开始时间">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择日期" v-model="rightForm.startDate" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="聘用结束时间">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择日期" v-model="rightForm.endDate" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="工作地点">
          <el-input v-model="rightForm.address"></el-input>
        </el-form-item>
        <el-form-item label="岗位薪酬">
          <el-input v-model="rightForm.salary"></el-input>
        </el-form-item>
        <el-form-item label="绩效工资">
          <el-input v-model="rightForm.bonus"></el-input>
        </el-form-item>
        <el-form-item label="确认时间">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择日期" v-model="rightForm.deadline" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>

        <el-form-item label="联系电话">
          <el-input v-model="rightForm.phoneNumber"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="pushProcessToOffer()">立即创建</el-button>
          <el-button type="primary" @click="createEmail()">生成邮件</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
      <div id="emailTemplate" v-show="false">
        <p>尊敬的{{candidate.name}}先生/女士</p>
        <p>我们很荣幸的通知您,由于您出色的表现xx公司将(以下简称公司)正式录用您,聘用时间从{{getDateDesc(rightForm.startDate)}}起,到{{getDateDesc(rightForm.endDate)}}结束</p>
        <p>相关录用事宜</p>
        <p>职位名称:{{candidate.jobName}}</p>
        <p>工作地点:{{rightForm.address}}</p>
        <p>您的岗位薪酬是{{rightForm.salary}}元/月,其中绩效工资{{rightForm.bonus}}元/月,工资属于商业机密,请勿泄露</p>
        <p>与您签订的合同期限为3年,试用期为6个月,如有一方提前终止合同,必须提前30天书面通知对方</p>
        <p>收到offer之后,请在{{getDateDesc(rightForm.deadline)}}之前回复确认,如果未能及时确认,代表放弃入职</p>
        <p>联系电话:{{rightForm.phoneNumber}}</p>
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
          startDate:null,
          endDate:null,
          address:null,
          salary:null,
          bonus:null,
          deadline:null,
          phoneNumber:null
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
      getDateDesc(date){
        if(date===null){
          return '';
        }else{
          return dateFormat(date.valueOf(),'yyyy-MM-dd');
        }
      },

      //生成邮件
      createEmail(){
        console.log(this.candidate)
        this.editor.txt.html( document.querySelector('#emailTemplate').innerHTML);
      },

      //立即创建
      pushProcessToOffer(){
        var data={};
        data.id=this.candidate.id;
        data.process=2;
        data.offerState=0;
        opRruitmentPeople.edit(data).then(data=>{
          this.$message.success("创建入职信息成功");
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
