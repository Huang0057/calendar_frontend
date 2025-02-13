<template>
    <div class="common-layout">
      <el-container>
        <el-header>
          <div class="header-content">
            <h2>待辦事項管理</h2>
            <el-button type="primary" @click="dialogVisible = true">
              新增待辦事項
            </el-button>
          </div>
        </el-header>
  
        <el-main>
          <el-table :data="todoList" style="width: 100%">
            <el-table-column prop="title" label="標題" />
            <el-table-column prop="description" label="描述" />
            <el-table-column prop="isCompleted" label="狀態">
              <template #default="{ row }">
                <el-tag :type="row.isCompleted ? 'success' : 'warning'">
                  {{ row.isCompleted ? '已完成' : '未完成' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="{ row }">
                <el-button-group>
                  <el-button size="small" @click="handleEdit(row)">編輯</el-button>
                  <el-button 
                    size="small" 
                    type="danger" 
                    @click="handleDelete(row)">刪除</el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
      </el-container>
  
      <!-- 新增/編輯對話框 -->
      <el-dialog
        v-model="dialogVisible"
        :title="editingTodo ? '編輯待辦事項' : '新增待辦事項'"
        width="500px"
      >
        <el-form ref="formRef" :model="form" label-width="80px">
          <el-form-item label="標題" prop="title">
            <el-input v-model="form.title" />
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="form.description" type="textarea" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">確定</el-button>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue'
  import axios from 'axios'
  import { ElMessage } from 'element-plus'
  
  // 數據
  const todoList = ref([])
  const dialogVisible = ref(false)
  const editingTodo = ref(null)
  const form = reactive({
    title: '',
    description: ''
  })
  
  // 獲取待辦事項列表
  const fetchTodos = async () => {
    try {
      const response = await axios.get('/api/Todo')
      todoList.value = response.data
    } catch (error) {
      ElMessage.error('獲取待辦事項失敗')
    }
  }
  
  // 提交表單
  const handleSubmit = async () => {
    try {
      if (editingTodo.value) {
        await axios.put(`/api/Todo/${editingTodo.value.id}`, form)
        ElMessage.success('更新成功')
      } else {
        await axios.post('/api/Todo', form)
        ElMessage.success('新增成功')
      }
      dialogVisible.value = false
      fetchTodos()
    } catch (error) {
      ElMessage.error('操作失敗')
    }
  }
  
  // 編輯待辦事項
  const handleEdit = (todo) => {
    editingTodo.value = todo
    form.title = todo.title
    form.description = todo.description
    dialogVisible.value = true
  }
  
  // 刪除待辦事項
  const handleDelete = async (todo) => {
    try {
      await axios.delete(`/api/Todo/${todo.id}`)
      ElMessage.success('刪除成功')
      fetchTodos()
    } catch (error) {
      ElMessage.error('刪除失敗')
    }
  }
  
  // 初始化
  fetchTodos()
  </script>
  
  <style scoped>
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
  }
  
  .el-header {
    background-color: white;
    border-bottom: 1px solid #eee;
    margin-bottom: 20px;
  }
  </style>