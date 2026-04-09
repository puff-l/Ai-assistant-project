<template>
  <div class="container">
    <el-card class="card">
      <div style="display:flex; justify-content:space-between; gap:12px; align-items:flex-start">
        <div style="flex:1">
          <div class="title">{{paper.title}}</div>
          <div class="sub">{{paper.authors ? paper.authors.join(', ') : ''}} · {{formatDate(paper.published)}}</div>
          <div style="margin-top:12px">{{paper.abstract}}</div>
        </div>
        <div style="width:220px; text-align:right">
          <el-button type="primary" v-if="paper.pdf_url" @click="openPdf">打开 PDF</el-button>
          <el-button type="default" @click="$router.push('/papers')">返回</el-button>
        </div>
      </div>
      <div style="margin-top:16px">
        <div class="sub">类别: {{paper.categories ? paper.categories.join(', ') : '-'}}</div>
        <div class="sub">Topic: {{paper.topic_name || '-'}}</div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getPaperById } from '../services/papersService'
import dayjs from 'dayjs'
const props = defineProps({ id: String })
const paper = ref({})

function formatDate(d){ return d ? dayjs(d).format('YYYY-MM-DD') : '-' }

onMounted(async ()=>{
  const resp = await getPaperById(props.id)
  if(resp) paper.value = resp
})

function openPdf(){ if(paper.value.pdf_url) window.open(paper.value.pdf_url, '_blank') }
</script>
