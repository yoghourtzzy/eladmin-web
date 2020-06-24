<template>
  <div style="margin: 25px">
    <el-card style="height: 800px">
      <el-form  :inline="true" size="small" :model="formline" label-width="90px">
        <el-form-item label="查询日期">
          <el-date-picker
            v-model="value1"
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
          <el-button type="warning" @click="revise = true">出差申请</el-button>
        </el-form-item>
      </el-form>

      <div style="height: 30px"></div>
      <el-table  :data="tableData" border highlight-current-row   style="width: 100%">
        <el-table-column  prop="startDate" label="开始时间" width="150"></el-table-column>
        <el-table-column  prop="endDate" label="结束时间" width="150" ></el-table-column>
        <el-table-column  prop="operatingTime" label="操作时间" width="150"></el-table-column>
        <el-table-column  prop="checkTime" label="审批时间" width="150"></el-table-column>
        <el-table-column  prop="checkType" label="审批人" width="150"></el-table-column>
        <el-table-column  prop="checkType" label="审批状态" width="150"></el-table-column>
        <el-table-column  prop="reason" label="备注" ></el-table-column>
        <el-table-column  label="操作" width="100">
          <el-button type="primary" round size="small"  @click="" >取消</el-button>
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
  function getHoursTime(date) {
    if(date==""){return null}
    var newDate = new Date(date);
    var year = newDate.getFullYear();
    var month = newDate.getMonth() + 1;
    var day = newDate.getDate();
    var  hours=newDate.getHours();
    var  minute=newDate.getMinutes();
    var  seconds=newDate.getSeconds();
    return year + "-" + month + "-" + day+":"+hours+":"+minute+":"+seconds;
  }
  function getDateTime(date) {
    if(date==""){return null}
    var newDate = new Date(date);
    var year = newDate.getFullYear();
    var month = newDate.getMonth() + 1;
    var day = newDate.getDate();
    return year + "-" + month + "-" + day;
  }
  export default {
    name:'LeaveApply',
    data() {
      return {
        dialogName:'aa',
        checkList: ['',],
        tableData: [{

        }],
        formline: {
          startDate: '',
          endDate:'',
          page:1,
          total:0,
          uid:''
        },
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
        currentPage:0,
        pageSize:20,
        total:null,




        add: false,
        addWidth: '120px',
        startDate: '',
        endDate: ''
      }
    },

    created:function(){
      //请求表格数据
      // request({
      //   url: 'api/attendanceApply/myapply'+'&'+'page'+this.,
      //   method: 'get'
      // }).then(data=>{
      //   this.completeData=data.content
      //   this.tableData = this.completeData
      // })

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

      //分页
      handleCurrentChange(val){
        this.page = val;
        this.search();
      },

      search:function () {
        var user = sessionStorage.getItem('user');
        if (user) {
          user= JSON.parse(user);
        }

        var formData={
          startDate:getDateTime(this.formline.startDate),
          endDate:getDateTime(this.formline.endDate),
          pageIndex:this.page,
          uid: user.uid

        }
        var qs = require('querystring')
        var _self = this;
        this.$ajax.post('/cms-attendance-web/selectMyAskforleave',
          qs.stringify(formData)).then(function(result){
          var list = result.data.list;
          _self.total=result.data.page.record*10;
          for(var i=0;i<list.length;i++){
            list[i].startDate = getHoursTime(list[i].startDate);
            list[i].operatingTime = getHoursTime(list[i].operatingTime);
            list[i].endDate = getHoursTime(list[i].endDate);
            list[i].checkTime = getHoursTime(list[i].checkTime);
            if(list[i].checkType==1){
              list[i].checkType="已处理";
            }else{
              list[i].checkType="未处理";
            }
          }
          _self.tableData=result.data.list;
        })
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
