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
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="search()">查询</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="warning" @click="revise = true">请假申请</el-button>
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
        <el-table-column  prop="approveTime" label="审批时间" width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.approveTime===null">无</span>
            <span v-else>{{ scope.row.approveTime|dateFormat()}}</span>
          </template>
        </el-table-column>
        <el-table-column  prop="toUserName" label="审批人" width="100 "></el-table-column>
        <el-table-column  prop="state" label="审批状态" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.state===0">未审批</span>
            <span v-else-if="scope.row.state===1">同意</span>
            <span v-else>不同意</span>
          </template>
        </el-table-column>
        <el-table-column  prop="reason" label="备注" show-overflow-tooltip="true"></el-table-column>
        <el-table-column  label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="primary" round size="small"  @click="cancelApply(scope.row.id)" >取消</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="handleCurrentChange" background layout="prev, pager, next":total="total" :current-page="currentPage" :page-size	="pageSize"	>
      </el-pagination>

      <div></div>

      <el-dialog title="请假申请" :visible.sync="revise" width="65%">
        <el-form :model="form">

          <el-form-item label="审批人：" :label-width="addWidth">
            <el-select v-model="form.selectedValue" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.username"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="开始时间："  :label-width="addWidth">
            <el-date-picker
              v-model="form.startDate"
              type="date"
              placeholder="">
            </el-date-picker>
          </el-form-item>


          <el-form-item label="结束时间："  :label-width="addWidth">
            <el-date-picker
              v-model="form.finishDate"
              type="date"
              placeholder="">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="理由：" :label-width="addWidth">
            <el-input type="textarea"   :autosize="{ minRows: 2, maxRows: 4}" v-model="form.reason"></el-input>
          </el-form-item>

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
    name:'LeaveApply',
    data() {
      return {
        dialogName:'aa',
        checkList: ['',],
        tableData: [{

        }],
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
     //请求表格数据
      var para={
        type:0,
        page:this.currentPage-1,
        size:this.pageSize
      };
      this.getApply(para);

      //请求主管数据
      request({
        url: 'api/users/director',
        method: 'get'
      }).then(data=>{
        //初始化选择框
        this.options=data;
        //默认选中
        if(this.options!=null){
          this.form.selectedValue=this.options[0].id;
        }
      })
    },




    methods:{

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
