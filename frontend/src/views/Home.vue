<template>
  <div class="container">
    <div class="card" style="display:grid; gap:16px">
      <div style="display:flex; align-items:center; justify-content:space-between">
        <div>
          <div style="font-size:22px; font-weight:700">欢迎使用 论文助手</div>
          <div class="sub">连接到后端: http://127.0.0.1:8000 （如果部分接口未实现，前端会使用本地模拟数据）</div>
        </div>
        <el-button type="primary" @click="$router.push('/papers')">浏览论文</el-button>
      </div>

      <div style="display:flex; gap:16px; flex-wrap:wrap">
        <el-card class="card" style="flex:1 1 300px">
          <div class="title">库统计</div>
          <div v-if="stats">
            <div style="font-size:28px; font-weight:700">{{stats.total_papers}}</div>
            <div class="sub">论文总量</div>
            <div style="margin-top:12px">
              <div class="sub">时间范围</div>
              <div>{{stats.date_range.earliest}} — {{stats.date_range.latest}}</div>
            </div>
          </div>
          <div v-else class="sub">加载中...</div>
        </el-card>

        <el-card class="card" style="flex:1 1 300px">
          <div class="title">热门分类</div>
          <div v-if="stats">
            <div v-for="(v,k) in stats.categories" :key="k" style="display:flex; justify-content:space-between; padding:8px 0">
              <div class="sub">{{k}}</div>
              <div style="font-weight:700">{{v}}</div>
            </div>
          </div>
        </el-card>

        <el-card class="card" style="flex:1 1 300px">
          <div class="title">快速操作</div>
          <el-button type="primary" plain @click="$router.push('/chat')">启动 RAG 对话</el-button>
          <el-button type="default" plain @click="$router.push('/topics')">查看主题</el-button>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getStats } from '../services/papersService'

const stats = ref(null)

onMounted(async ()=>{
  stats.value = await getStats()
})
</script>
