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
      <el-button type="success"  round size="small"  @click="handleReflashClick() ">刷新</el-button>

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

    <el-dialog
      title="汇报详情"
      :visible.sync="reportContentDialogVisible"
      width="30%">
      <span>{{currentTaskData.reportContent}}</span>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="reportContentDialogVisible=false">确 定</el-button>
        </span>
    </el-dialog>
    <!--汇报任务对话框-->
    <el-dialog
      title="评分"
      :visible.sync="gradeDialogVisible">
      <el-rate
        v-model="score"
        :colors="colors">
      </el-rate>
      <span slot="footer" class="dialog-footer">
             <el-button type="primary" @click="handelGradeDialogConfirm">确 定</el-button>
        </span>
    </el-dialog>
    <!--表格渲染-->
    <el-table ref="multipleTable"
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%"
              height="500">
      <el-table-column prop="taskName" label="任务名" />
      <el-table-column prop="toUserName" label="执行人" />
      <el-table-column prop="startTime"  label="任务开始时间">
        <template slot-scope="scope">
          <span>{{ scope.row.startTime|dateFormat()}}</span>
        </template>
      </el-table-column>
      <el-table-column  prop="finishTime"  label="任务结束时间">
        <template slot-scope="scope">
          <span>{{ scope.row.finishTime|dateFormat()}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="reportTime"  :label="reportTimeColLable " >
        <template slot-scope="scope">
          <span v-show="selectedValue===1||selectedValue===2">{{ scope.row.reportTime|dateFormat()}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="score" :label="scoreColLable" />

      <el-table-column  label="操作" width="290px" align="center">

        <template slot-scope="scope" >
          <el-button type="primary" round size="small"  @click="handleCheckDetailClick(scope.row)" >任务详情</el-button>
          <el-button type="primary" round size="small"  @click="handleReportContentClick(scope.row)" v-show="selectedValue===1">汇报详情</el-button>
          <el-button type="success" round size="small" @click="handleGradeClick(scope.row)" v-show="selectedValue===1">评分</el-button>
          <el-button type="warning" icon="el-icon-edit"  circle @click="handleGradeClick(scope.row)" v-show="selectedValue===2"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle @click="handlDelTaskClick(scope.row)" v-show="selectedValue===0"></el-button>
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
  import {delreport} from "../../../api/task/task";
  export default {
    data() {
      return {
        tableData: [], // 表格中显示的数据
        taskDetailDialogVisible: false,//控制对任务详情话框的关闭与打开
        gradeDialogVisible:false,//控制汇报任务对话框的关闭与打开
        reportContentDialogVisible:false,
        currentTaskData:'',//按钮点击的列的详细数据
        reportTimeColLable:true,
        scoreColLable:null,
        //评分
        score:0,
        colors: ['#99A9BF', '#F7BA2A', '#FF9900'],

        //筛选选项
        options: [{
          value: 1,
          label: '待评审'
        },{
          value: 0,
          label: '待提交'
        }, {
          value: 2,
          label: '已评审'
        }],
        //上拉框选中的项
        selectedValue: 1
      }
    },

    created:function(){
      this.querydata('api/task/fromme?state='+this.selectedValue);
    },

    watch:{
      selectedValue:function (newObj,oldObj) {
        //改变表头
        this.changeTableHeader();
        //重新请求数据
        //防止切换选项时加载延迟 直接清空
        this.tableData=null;
        this.querydata('api/task/fromme?state='+this.selectedValue);
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

      handleReflashClick(){
        this.querydata('api/task/fromme?state='+this.selectedValue);
      },

      //改变表头，渲染出评分列
      changeTableHeader(){
        if(this.selectedValue===0){
          this.reportTimeColLable=null;
          this.scoreColLable=null;
        }else if(this.selectedValue===1){
          this.reportTimeColLable='提交时间';
          this.scoreColLable=null;
        }else{
          this.reportTimeColLable='提交时间';
          this.scoreColLable='评分';
        }
      },

      handleCheckDetailClick(row){
        this.currentTaskData=row;
        this.taskDetailDialogVisible=true;
      },
      handleReportContentClick(row){
        this.currentTaskData=row;
        this.reportContentDialogVisible=true;
      },


      handleGradeClick(row){
        //设计汇报任务表
        this.currentTaskData=row;
        this.gradeDialogVisible=true;
      },

      handlDelTaskClick(row){
        //发送请求
        crudTask.deltask(row.id).then(data=>{
          this.$message({
            message: '删除任务成功',
            type: 'success'
          });
          //删除行
          this.tableData=this.tableData.filter(value => {
            if(row.id===value.id){
              return false;
            }
            return true;
          })
        })
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
      handelGradeDialogConfirm(){
        //关闭对话框
        this.gradeDialogVisible=false;
        var data={
          id:this.currentTaskData.id,
          score:this.score
        };
        //提交数据
        crudTask.grade(data).then(data=>{
          this.$message({
            message: '评分成功',
            type: 'success'
          });
          //更新表格数据
          if(this.selectedValue===1){ //在待评审界面
            this.tableData=this.tableData.filter(value => {
              if(this.currentTaskData.id===value.id){
                return false;
              }
              return true;
            })
          }else if(this.selectedValue===2){//在已评审界面
            this.currentTaskData.score=this.score;
          }
          this.score=0;
        });
      }
    }
  }
</script>

<style scoped>

</style>
