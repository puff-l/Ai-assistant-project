<template>
  <el-card class="card">
    <div style="display:flex; justify-content:space-between; align-items:center">
      <div>
        <div class="title">{{paper.title}}</div>
        <div class="sub">{{paper.authors.join(', ')}} · {{formatDate(paper.published)}}</div>
      </div>
      <div style="text-align:right">
        <el-button type="primary" plain size="small" @click="$emit('view', paper.id)">查看</el-button>
      </div>
    </div>
    <div style="margin-top:12px" class="sub">{{paper.abstract}}</div>
  </el-card>
</template>

<script setup>
import { toRefs } from 'vue'
import dayjs from 'dayjs'
const props = defineProps({ paper: Object })
function formatDate(d){ return d ? dayjs(d).format('YYYY-MM-DD') : '-' }
</script>
