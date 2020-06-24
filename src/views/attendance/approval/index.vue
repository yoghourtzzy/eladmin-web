<template>
  <div style="margin: 25px">
    <el-card style="height: 800px">
      <el-form  :inline="true" size="small"  label-width="90px">
        <el-form-item label="查询日期">
          <el-date-picker
            v-model="dateScale"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>

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

      </el-form>

      <div style="height: 30px"></div>
      <el-table  :data="tableData" border highlight-current-row   style="width: 100%">
        <el-table-column  prop="startDate" label="开始时间" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.startDate|dateFormat("yyyy-MM-dd")}}</span>
          </template>
        </el-table-column>
        <el-table-column  prop="finishDate" label="结束时间" width="100" >
          <template slot-scope="scope">
            <span>{{ scope.row.finishDate|dateFormat("yyyy-MM-dd")}}</span>
          </template>
        </el-table-column>
        <el-table-column  prop="createTime" label="申请时间" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime|dateFormat()}}</span>
          </template>
        </el-table-column>
        <el-table-column  prop="approveTime" label="申请类型" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.type===0">请假</span>
            <span v-else>出差</span>
          </template>
        </el-table-column>
        <el-table-column  prop="fromUserName" label="发起人" width="100"></el-table-column>
        <el-table-column  prop="state" label="审批状态" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.state===0">未审批</span>
            <span v-else-if="scope.row.state===1">同意</span>
            <span v-else>不同意</span>
          </template>
        </el-table-column>
        <el-table-column  prop="reason" label="备注" show-overflow-tooltip></el-table-column>
        <el-table-column  label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="success" icon="el-icon-check" @click="agree(scope.row.id)" circle></el-button>
            <el-button type="danger" icon="el-icon-close" @click="disagree(scope.row.id)" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="handleCurrentChange" background layout="prev, pager, next":total="total" :current-page="currentPage" :page-size	="pageSize"	>
      </el-pagination>

    </el-card>

  </div>
</template>

<script>
  import request from '@/utils/request'
  import opAttendanceApply from '@/api/attendance/attendanceApply'
  import dateFormat from "../../../utils/dateFormat";
  import {getUrlWithPara} from  "../../../utils/urlUtil";
  export default {
    name:'LeaveApply',
    data() {
      return {
        dialogName:'aa',
        checkList: ['',],
        tableData: [{

        }],

        //------------------筛选器
        dateScale:null,
        stateOptions: [{
          state: 0,
          label:'未审批'
        }, {
          state:1,
          label: '审批通过'
        }, {
          state: 2,
          label: '审批未通过'
        }],
        selectedState:0,
        //------------------筛选器





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
      //请求表格数据
      var para={
        state:this.selectedState,
        page:this.currentPage-1,
        size:this.pageSize
      };
      this.getApply(para);
    },




    methods:{
      // currentPage,pageSize,startDate,finishDate
      getApply(para){
        request({
          url:getUrlWithPara('api/attendanceApply/myapproval',para),
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
          state:this.selectedState,
          page:this.currentPage-1,
          size:this.pageSize
        };
        this.getApply(para);
      },

      search:function () {
        if(this.dateScale===null){
          this.getApply({
            state:this.selectedState,
            page:this.currentPage-1,
            size:this.pageSize
          });
        }else{
          this.getApply({
            state:0,
            createTime:[dateFormat(this.dateScale[0].valueOf()),dateFormat(this.dateScale[1].valueOf())],
            page:this.currentPage-1,
            size:this.pageSize
          })
        }
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
      },

      agree(id){
        var data={
          id:id,
          state:1
        };
        opAttendanceApply.approve(data).then(data=>{
          this.$message.success('审批成功！');
          //重新请求数据
          if(this.dateScale===null){
            this.getApply({
              state:this.selectedState,
              page:this.currentPage-1,
              size:this.pageSize
            });
          }else{
            this.getApply({
              state:this.selectedSate,
              createTime:[dateFormat(this.dateScale[0].valueOf()),dateFormat(this.dateScale[1].valueOf())],
              page:this.currentPage-1,
              size:this.pageSize
            })
          }
        })
      },

      disagree(id){

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
