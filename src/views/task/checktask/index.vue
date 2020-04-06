<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="id">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="fromUserId">
            <el-input v-model="form.fromUserId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="toUserId">
            <el-input v-model="form.toUserId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="任务开始时间">
            <el-input v-model="form.startTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="任务结束时间">
            <el-input v-model="form.finishTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="0 未完成；1已提交待打分；2完成 已打分；3 超时">
            <el-input v-model="form.state" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="createTime">
            <el-input v-model="form.createTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="发布者姓名">
            <el-input v-model="form.fromUserName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="指定人的姓名">
            <el-input v-model="form.toUserName" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column v-if="columns.visible('id')" prop="id" label="id" />
        <el-table-column v-if="columns.visible('fromUserId')" prop="fromUserId" label="fromUserId" />
        <el-table-column v-if="columns.visible('toUserId')" prop="toUserId" label="toUserId" />
        <el-table-column v-if="columns.visible('startTime')" prop="startTime" label="任务开始时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.startTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('finishTime')" prop="finishTime" label="任务结束时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.finishTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('state')" prop="state" label="0 未完成；1已提交待打分；2完成 已打分；3 超时" />
        <el-table-column v-if="columns.visible('createTime')" prop="createTime" label="createTime">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('fromUserName')" prop="fromUserName" label="发布者姓名" />
        <el-table-column v-if="columns.visible('toUserName')" prop="toUserName" label="指定人的姓名" />
        <el-table-column v-permission="['admin','task:edit','task:del']" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudTask from '@/api/task/task'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
const defaultCrud = CRUD({ title: 'api/task', url: 'api/task', sort: 'id,desc', crudMethod: { ...crudTask }})
const defaultForm = { id: null, fromUserId: null, toUserId: null, startTime: null, finishTime: null, state: null, createTime: null, fromUserName: null, toUserName: null }
export default {
  name: 'Task',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      permission: {
        add: ['admin', 'task:add'],
        edit: ['admin', 'task:edit'],
        del: ['admin', 'task:del']
      },
      rules: {
      }}
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }
  }
}
</script>

<style scoped>

</style>
