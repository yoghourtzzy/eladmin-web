<template>
  <div>
    <div>
      <el-table :data="emps" border stripe size="mini">
        <el-table-column type="selection" align="left" width="55"></el-table-column>
        <el-table-column prop="name" label="姓名" fixed width="120" align="left"></el-table-column>
        <el-table-column prop="email" label="电子邮件" width="200" align="left"></el-table-column>
        <el-table-column prop="phone" label="电话号码" width="120" align="left"></el-table-column>
        <el-table-column prop="departmentName" label="所属部门" width="120" align="left"></el-table-column>
        <el-table-column prop="jobName" label="岗位" width="120" align="left"></el-table-column>
        <el-table-column label="套账" align="center">
          <template slot-scope="scope">
            <el-tooltip placement="right" v-if="scope.row.salary">
              <div slot="content">
                <table>
                  <tr>
                    <td>基本工资</td>
                    <td>{{scope.row.salary.basicSalary}}</td>
                  </tr>
                  <tr>
                    <td>交通补助</td>
                    <td>{{scope.row.salary.trafficSalary}}</td>
                  </tr>
                  <tr>
                    <td>午餐补助</td>
                    <td>{{scope.row.salary.lunchSalary}}</td>
                  </tr>
                  <tr>
                    <td>奖金</td>
                    <td>{{scope.row.salary.bonus}}</td>
                  </tr>
                  <tr>
                    <td>养老金比率</td>
                    <td>{{scope.row.salary.pensionPer}}</td>
                  </tr>
                  <tr>
                    <td>养老金基数</td>
                    <td>{{scope.row.salary.pensionBase}}</td>
                  </tr>
                  <tr>
                    <td>医疗保险比率</td>
                    <td>{{scope.row.salary.medicalPer}}</td>
                  </tr>
                  <tr>
                    <td>医疗保险基数</td>
                    <td>{{scope.row.salary.medicalBase}}</td>
                  </tr>
                  <tr>
                    <td>公积金比率</td>
                    <td>{{scope.row.salary.accumulationFundPer}}</td>
                  </tr>
                  <tr>
                    <td>公积金基数</td>
                    <td>{{scope.row.salary.accumulationFundBase}}</td>
                  </tr>
                  <tr>
                    <td>启用时间</td>
                    <td>{{scope.row.salary.createDate}}</td>
                  </tr>
                </table>
              </div>
              <el-tag>{{scope.row.salary.name}}</el-tag>
            </el-tooltip>
            <el-tag v-else>暂未设置</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-popover
              placement="left"
              title="修改工资账套"
              @show="showPop(scope.row.salary)"
              @hide="hidePop(scope.row)"
              width="200"
              trigger="click">
              <div>
                <el-select v-model="currentSalary" placeholder="请选择" size="mini">
                  <el-option
                    v-for="item in salaries"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
              <el-button slot="reference" type="danger">修改工资账套</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex;justify-content: flex-end">
        <el-pagination
          background
          @size-change="sizeChange"
          @current-change="currentChange"
          layout="sizes, prev, pager, next, jumper, ->, total, slot"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "SalSobCfg",
    data() {
      return {
        emps: [{
          name:'zzy',
          email:'zzy@163.com',
          phone:'15868162182',
          departmentName:'研发部',
          jobName:'部门经理',
          salary:{
            id:0,
            basicSalary: 5000,
            trafficSalary: 100,
            lunchSalary: 100,
            bonus: 1000,
            baseMoney:5000,
            // pensionPer: 0.8,
            // pensionBase: 2000,
            // medicalPer: 0.8,
            // medicalBase: 2000,
            // accumulationFundPer: 0.8,
            // accumulationFundBase: 2000,
            name: '研发部工资套账',
            createDate:'2020-5-6'}
        },
          {
            name:'test',
            email:'test@163.com',
            phone:'17777777777',
            departmentName:'研发部',
            jobName:'测试',
            salary:{
              id:0,
              basicSalary: 5000,
              trafficSalary: 100,
              lunchSalary: 100,
              bonus: 1000,
              baseMoney:5000,
              // pensionPer: 0.8,
              // pensionBase: 2000,
              // medicalPer: 0.8,
              // medicalBase: 2000,
              // accumulationFundPer: 0.8,
              // accumulationFundBase: 2000,
              name: '研发部工资套账',
              createDate:'2020-5-6'}
          },

          {
            name:'SDE',
            email:'SDE@163.com',
            phone:'13221215336',
            departmentName:'研发部',
            jobName:'全栈开发',
            salary:{
              id:0,
              basicSalary: 5000,
              trafficSalary: 100,
              lunchSalary: 100,
              bonus: 1000,
              baseMoney:5000,
              // pensionPer: 0.8,
              // pensionBase: 2000,
              // medicalPer: 0.8,
              // medicalBase: 2000,
              // accumulationFundPer: 0.8,
              // accumulationFundBase: 2000,
              name: '研发部工资套账',
              createDate:'2020-5-6'}
          }
        ],
        total: 0,
        currentPage: 1,
        currentSize: 10,
        currentSalary: null,
        salaries: [{
          id:0,
          basicSalary: 5000,
          trafficSalary: 100,
          lunchSalary: 100,
          bonus: 1000,
          baseMoney:5000,
          // pensionPer: 0.8,
          // pensionBase: 2000,
          // medicalPer: 0.8,
          // medicalBase: 2000,
          // accumulationFundPer: 0.8,
          // accumulationFundBase: 2000,
          name: '研发部工资套账',
          createDate:'2020-5-6'},
          {
            id:1,
            basicSalary: 5000,
            trafficSalary: 100,
            lunchSalary: 100,
            bonus: 1000,
            baseMoney:5000,
            // pensionPer: 0.8,
            // pensionBase: 2000,
            // medicalPer: 0.8,
            // medicalBase: 2000,
            // accumulationFundPer: 0.8,
            // accumulationFundBase: 2000,
            name: '运维部工资套账',
            createDate:'2020-5-6'},
          {
            id:2,
            basicSalary: 5000,
            trafficSalary: 100,
            lunchSalary: 100,
            bonus: 1000,
            baseMoney:5000,
            // pensionPer: 0.8,
            // pensionBase: 2000,
            // medicalPer: 0.8,
            // medicalBase: 2000,
            // accumulationFundPer: 0.8,
            // accumulationFundBase: 2000,
            name: '人事部工资套账',
            createDate:'2020-5-6'},
        ],
      }
    },
    mounted() {
      this.initEmps();
      this.initSalaries();
    },
    methods: {
      sizeChange(size) {
        this.currentSize = size;
        this.initEmps();
      },
      currentChange(page) {
        this.currentPage = page;
        this.initEmps();
      },
      hidePop(data) {
        data.salary=this.salaries[this.currentSalary];
        // if (this.currentSalary) {
        //   this.putRequest('/salary/sobcfg/?eid=' + data.id + '&sid=' + this.currentSalary).then(resp => {
        //     if (resp) {
        //       this.initEmps()
        //     }
        //   });
       // }
      },
      showPop(data) {
        if (data) {
          this.currentSalary = data.id;
        } else {
          this.currentSalary = null;
        }
      },
      // initSalaries() {
      //   this.getRequest("/salary/sobcfg/salaries").then(resp => {
      //     if (resp) {
      //       this.salaries = resp;
      //     }
      //   })
      // },
      // initEmps() {
      //   this.getRequest("/salary/sobcfg/?page=" + this.currentPage + '&size=' + this.currentSize).then(resp => {
      //     if (resp) {
      //       this.emps = resp.data;
      //       this.total = resp.total;
      //     }
      //   })
      // }
    }
  }
</script>

<style scoped>

</style>
