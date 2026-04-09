<template>
  <div class="container">
    <div class="card">
      <div class="title">主题列表</div>
      <div class="sub">（后端若未实现，展示本地模拟数据）</div>
      <el-row :gutter="20" style="margin-top:12px">
        <el-col :span="8" v-for="t in topics" :key="t.topic_id">
          <el-card class="card" style="cursor:pointer" @click="$router.push('/topics/'+t.topic_id)">
            <div style="display:flex; justify-content:space-between">
              <div>
                <div style="font-weight:700">{{t.topic_name}}</div>
                <div class="sub">{{t.paper_count}} 篇论文</div>
              </div>
              <div class="sub">关键词: {{topKeywords(t).join(', ')}}</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getTopics } from '../services/papersService'
const topics = ref([])
onMounted(async ()=>{
  const resp = await getTopics()
  topics.value = resp.topics || resp
})

function topKeywords(t){
  return (t.keywords || []).slice(0,3).map(k=>k.word)
}
</script>
