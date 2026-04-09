<template>
  <div class="container">
    <el-card class="card">
      <div style="display:flex; justify-content:space-between; align-items:flex-start">
        <div>
          <div class="title">{{topic.topic_name}}</div>
          <div class="sub">{{topic.paper_count}} 篇论文 · {{topic.description}}</div>
          <div style="margin-top:12px">
            <div class="sub">关键词</div>
            <div style="display:flex; gap:8px; margin-top:8px">
              <el-tag v-for="k in topic.keywords" :key="k.word">{{k.word}} ({{(k.score*100)|toFixed(0)}}%)</el-tag>
            </div>
          </div>
        </div>
        <div style="text-align:right">
          <el-button @click="$router.push('/topics')">返回</el-button>
        </div>
      </div>

      <div style="margin-top:18px">
        <div class="title" style="font-size:16px">主题下的论文</div>
        <div v-if="papers.length===0" class="sub">暂无论文（或后端未实现此端点，使用模拟数据为空）</div>
        <div style="display:grid; gap:12px; margin-top:8px">
          <PaperCard v-for="p in papers" :key="p.id" :paper="p" @view="view" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getTopicById, getTopicPapers } from '../services/papersService'
import PaperCard from '../components/PaperCard.vue'
const props = defineProps({ id: String })
const topic = ref({})
const papers = ref([])

onMounted(async ()=>{
  const resp = await getTopicById(props.id)
  topic.value = resp || {}
  const r2 = await getTopicPapers(props.id)
  papers.value = r2.papers || r2 || []
})

function view(id){ $router.push('/papers/'+id) }
</script>
