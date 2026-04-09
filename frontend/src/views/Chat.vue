<template>
  <div class="container">
    <el-card class="card">
      <div style="display:flex; justify-content:space-between; align-items:center">
        <div class="title">RAG 对话（演示）</div>
        <div class="sub">后端若未实现，使用本地模拟回答</div>
      </div>

      <div style="margin-top:12px">
        <el-input v-model="userMsg" placeholder="输入问题，回车发送" @keyup.enter="send" clearable/>
      </div>

      <div style="margin-top:16px; display:flex; flex-direction:column; gap:12px">
        <div v-for="(m,i) in history" :key="i" :class="['card']" style="background:#fbfcff">
          <div style="font-weight:700">{{m.role==='user' ? '你' : '助手'}}</div>
          <div style="margin-top:6px">{{m.content}}</div>
          <div v-if="m.sources" style="margin-top:8px; font-size:13px" class="sub">
            引用来源:
            <el-tag v-for="s in m.sources" :key="s.id" style="margin-left:8px">{{s.title}}</el-tag>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { chatInit, chatMessage, chatHistory } from '../services/papersService'

const userMsg = ref('')
const history = ref([])
let session = null

async function ensureSession(){
  if(session) return
  const r = await chatInit(null)
  session = r.session_id || 'mock-session-1'
}

async function send(){
  if(!userMsg.value) return
  await ensureSession()
  history.value.push({ role:'user', content: userMsg.value })
  const r = await chatMessage(session, userMsg.value)
  history.value.push({ role:'assistant', content: (r.answer||r), sources: r.sources||[] })
  userMsg.value = ''
}
</script>
