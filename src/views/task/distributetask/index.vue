<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="任务名称" prop="taskName">
        <el-input v-model="form.taskName" />
      </el-form-item>
      <el-form-item label="任务详情" prop="taskDetail">
        <el-input v-model="form.taskDetail" type="textarea" />
      </el-form-item>
      <el-form-item label="开始时间">
        <el-col :span="11">
          <el-form-item prop="startDate1">
            <el-date-picker
              v-model="form.startDate1"
              type="date"
              placeholder="选择日期"
              style="width: 100%;"
            />
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="startDate2">
            <el-time-picker v-model="form.startDate2" placeholder="选择时间" style="width: 100%;" />
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item label="结束时间">
        <el-col :span="11">
          <el-form-item prop="finishDate1">
            <el-date-picker
              v-model="form.finishDate1"
              type="date"
              placeholder="选择日期"
              style="width: 100%;"
            />
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="finishDate2">
            <el-time-picker v-model="form.finishDate2" placeholder="选择时间" style="width: 100%;" />
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-button @click="querydata">请求数据</el-button>
      <br>
      <br>
      <br>

      <span>指定人员</span>
      <el-input v-model="searchKeyword" placeholder="请输入内容">
        <template slot="prepend">搜索</template>
      </el-input>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        height="250"
        @selection-change="handleSelectionChange"
      >

        <el-table-column
          type="selection"
          width="55"
        />

        <el-table-column
          label="工号"
          prop="num"
          width="120"
        />

        <el-table-column
          prop="username"
          label="姓名"
          show-overflow-tooltip
        />
      </el-table>
      <br>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import crudTask from '@/api/task/task'
import request from '@/utils/request'
export default {
  data() {
    return {
      form: {
        taskName: '',
        taskDetail: '',
        startDate1: '',
        startDate2: '',
        finishDate1: '',
        finishDate2: '',
        multipleSelection: []// 指定人员选中项存储在其中
      },

      searchKeyword: '', // 搜索关键字
      tableData: [], // 表格中显示的数据
      completeData: [], // 请求来的全部数据
      // 表单验证
      rules: {
        taskName: [
          { required: true, message: '请输入任务名称', trigger: 'change' }
        ],
        taskDetail: [
          { required: true, message: '输入任务详情', trigger: 'change' }
        ],
        startDate1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        startDate2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        finishDate1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        finishDate2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ]
      }

    }
  },

  watch: {
    searchKeyword: function(newObj, oldObj) {
      this.tableData = this.completeData.filter(item => {
        if (item.username.includes(this.searchKeyword)) {
          return true
        }
      })
    }
  },

  created:function(){
      this.querydata();
  },
  methods: {
    onSubmit(formName) {
      // 检验
     // crudTask.add(this.form)
      this.$refs[formName].validate((valid) => {
        // 校验表格是否又指定人员
        if (this.form.multipleSelection == null) {
          valid = false;
          this.$message({
            message: '请指定人员完成任务',
            type: 'warning'
          })
        }
        if (valid) {
          this.form.multipleSelection.forEach(item=>{
            var submitData={
              taskName:this.form.taskName,
              detailContent: this.form.taskDetail,
              startTime:this.mergeDate(this.form.startDate1,this.form.startDate2),
              finishTime:this.mergeDate(this.form.finishDate1,this.form.finishDate2),
              toUserId: item.id,
              toUserName:item.username
            };
            crudTask.add(submitData).then(data=>{
              this.$message({
                message: '创建任务成功',
                type: 'success'
              })
            })
          })
        }
      })
    },

    //请求人员数据
    querydata(){
      //注意 要改成当前部门下的所有人员数据
      request({
        url: 'api/users',
        method: 'get'
      }).then(data=>{
        this.completeData=data.content
        this.tableData = this.completeData
      })
    },

      handleSelectionChange(val) {
        this.form.multipleSelection = val;
      },
    //合并两个时间
    mergeDate(date1,date2){
      var completeDate=new Date();
      completeDate.setFullYear(date1.getFullYear());
      completeDate.setMonth(date1.getMonth());
      completeDate.setDate(date1.getDate());
      completeDate.setHours(date2.getHours());
      completeDate.setMinutes(date2.getMinutes());
      completeDate.setSeconds(date2.getSeconds());
      return completeDate;
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h3 {
    margin: 40px 0 0;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

  span {
    display: inline-block;
    font-size: 15px;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    padding: 12px;
    font-weight: bold;
    color: gray;
  }
</style>
