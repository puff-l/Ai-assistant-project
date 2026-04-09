<template>
  <div class="container" style="display:flex; align-items:center; justify-content:space-between">
    <div style="display:flex; align-items:center; gap:14px">
      <img src="/src/assets/logo.svg" alt="logo" style="height:36px"/>
      <div style="color:#fff; font-weight:700; font-size:18px">论文助手</div>
    </div>
    <div style="display:flex; gap:12px">
      <el-button type="text" @click="go('/')">首页</el-button>
      <el-button type="text" @click="go('/papers')">论文</el-button>
      <el-button type="text" @click="go('/topics')">主题</el-button>
      <el-button type="text" @click="go('/chat')">RAG 对话</el-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
function go(path){ router.push(path) }
</script>
