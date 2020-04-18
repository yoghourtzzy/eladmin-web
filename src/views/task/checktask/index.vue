<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <span>任务状态：</span>
      <el-divider direction="vertical"></el-divider>
      <el-select v-model="selectedValue" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>

    </div>
      <el-dialog
        title="任务详情"
        :visible.sync="taskDetailDialogVisible"
        width="30%">
        <span>{{currentTaskData.detailContent}}</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="taskDetailDialogVisible=false">确 定</el-button>
        </span>
      </el-dialog>

      <!--汇报任务对话框-->
      <el-dialog
        title="汇报任务"
        :visible.sync="reportDialogVisible">
        <el-form :model="reportDialogForm" >
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 20}"
            placeholder="请输入内容"
            v-model="reportDialogForm.reportContent">
          </el-input>
        </el-form>
        <span slot="footer" class="dialog-footer">
             <el-button type="primary" @click="handelReportDialogConfirm">确 定</el-button>
        </span>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                height="500">
        <el-table-column prop="taskName" label="任务名" />
        <el-table-column prop="fromUserName" label="指派人" />
        <el-table-column prop="startTime" label="任务开始时间">
          <template slot-scope="scope">
            <span>{{ scope.row.startTime|dateFormat()}}</span>
          </template>
        </el-table-column>
        <el-table-column  prop="finishTime" label="任务结束时间">
          <template slot-scope="scope">
            <span>{{ scope.row.finishTime|dateFormat()}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" :label="updateTimeColLable " />
        <el-table-column prop="score" width="50px" :label="scoreColLable" />

        <el-table-column  label="操作" width="200px" align="center">

          <template slot-scope="scope" >
            <el-button type="primary" round size="small"  @click="handleCheckDetailClick(scope.row)" >查看详情</el-button>
            <el-button type="success" round size="small" @click="handleReportClick(scope.row)" v-show="selectedValue===0">汇报任务</el-button>
            <el-button type="danger" icon="el-icon-delete" circle @click="handleCheckDetailClick(scope.row)" v-show="selectedValue===1"></el-button>
            <el-button type="warning" icon="el-icon-edit"  circle @click="handleReportClick(scope.row)" v-show="selectedValue===1"></el-button>
          </template>

        </el-table-column>
      </el-table>
<!--      <el-pagination-->
<!--
  @size-change="handleSizeChange"-->
<!--      @current-change="handleCurrentChange"-->
<!--      :current-page.sync="currentPage1"-->
<!--      :page-size="100"-->
<!--      layout="total, prev, pager, next"-->
<!--      :total="1000">-->
<!--    </el-pagination>-->
  </div>
</template>

<script>
  import crudTask from '@/api/task/task'
  import request from '@/utils/request'
export default {
  data() {
    return {
      tableData: [], // 表格中显示的数据
      taskDetailDialogVisible: false,//控制对任务详情话框的关闭与打开
      reportDialogVisible:false,//控制汇报任务对话框的关闭与打开
      currentTaskData:'',//按钮点击的列的详细数据
      updateTimeColLable:null,
      scoreColLable:null,
      reportDialogForm: {
              reportContent:''
      },

      //筛选选项
      options: [{
        value: 0,
        label: '待完成'
      }, {
        value: 1,
        label: '待审批'
      }, {
        value: 2,
        label: '已完成'
      }],
      //上拉框选中的项
      selectedValue: 0
    }
  },

  created:function(){
    this.querydata('api/task/tome?state='+this.selectedValue);
  },

  watch:{
    selectedValue:function (newObj,oldObj) {
      //改变表头
      this.changeTableHeader();
      //重新请求数据
      this.querydata('api/task/tome?state='+this.selectedValue());
      // if(this.selectedValue===0){
      //
      // }else if(this.selectedValue===1){
      //   this.querydata('api/taskreport/tome?state='+1);
      // }else{
      //   this.querydata('api/task/tome?state='+0);
      // }

    }
  },

  methods: {

    //请求任务数据数据
    querydata(api){
      //注意 要改成当前部门下的所有人员数据
      console.log('请求数据.....');
      request({
        url: api,
        method: 'get'
      }).then(data=>{
        console.log(data);
        this.tableData=data.content;
      })
    },


    //改变表头，渲染出评分列
    changeTableHeader(){
      if(this.selectedValue===0){
        this.updateTimeColLable=null;
        this.scoreColLable=null;
      }else{
        this.updateTimeColLable='提交时间';
        this.scoreColLable='评分';
      }
    },

    handleCheckDetailClick(row){
      this.currentTaskData=row;
      this.taskDetailDialogVisible=true;
    },

    handleReportClick(row){
      //设计汇报任务表
      this.currentTaskData=row;
      this.reportDialogVisible=true;
    },

    //定义对话框的关闭行为
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },

    // 汇报任务提交
    handelReportDialogConfirm(){
      //表单校验
      if(this.reportDialogForm.reportContent.length ==0){
        this.$message({
          message: '请输入汇报内容',
          type: 'error'
        });
        return;
      }
      //关闭对话框
      this.reportDialogVisible=false;
      var data={
        id:this.currentTaskData.id,
        reportContent:this.reportDialogForm.reportContent
      };
      //提交数据
      crudTask.report(data).then(data=>{
        this.$message({
          message: '汇报任务成功',
          type: 'success'
        });
        //删除表格数据
        this.tableData=this.tableData.filter(value => {
        if(this.currentTaskData.id===value.id){
          return false;
        }
        return true;
      })
    });
    }
  }
}
</script>

<style scoped>

</style>
