<template>
  <div class="container">
    <div style="display:flex; gap:16px; margin-bottom:16px; align-items:center">
      <el-input v-model="query" placeholder="搜索论文（标题/摘要/作者）" clearable @keyup.enter="doSearch" style="flex:1"/>
      <el-button type="primary" @click="doSearch">搜索</el-button>
      <el-button type="default" @click="reset">重置</el-button>
    </div>

    <div style="display:grid; gap:12px">
      <PaperCard v-for="p in pagedPapers" :key="p.id" :paper="p" @view="viewPaper" />
    </div>

    <div style="margin-top:18px; display:flex; align-items:center; justify-content:space-between; gap:12px">
      <div>
        <el-pagination
          background
          v-model:current-page="page"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next, jumper, ->, total"
          @current-change="onPageChange"
        />
      </div>
      <div class="sub">第 {{ page }} 页 / 共 {{ totalPages }} 页（共 {{ total }} 条）</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import PaperCard from '../components/PaperCard.vue'
import { fetchPapersBulk, searchPapers, getPaperById } from '../services/papersService'

const router = useRouter()

// 全量数据（现在改为从后端拉取全部论文，不是固定 100 条）
const allPapers = ref([])

// 当前分页参数
const page = ref(1)
const pageSize = ref(10)   // 每页 10 条
const total = ref(0)

// 搜索关键词
const query = ref('')

// 显示的当前页条目（computed）
const pagedPapers = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return (allPapers.value || []).slice(start, start + pageSize.value)
})

const totalPages = computed(() => Math.max(1, Math.ceil((total.value || 0) / pageSize.value)))

// 拉取后端“全部”论文（不再固定 100）
// fetchPapersBulk() 在 service 层会负责循环分页请求后端并返回完整 { total, papers }
async function fetchAll() {
  try {
    const resp = await fetchPapersBulk() // 默认拉取全部
    if (Array.isArray(resp)) {
      allPapers.value = resp
      total.value = resp.length
    } else if (resp && resp.papers) {
      allPapers.value = resp.papers
      total.value = resp.total ?? resp.papers.length
    } else {
      allPapers.value = []
      total.value = 0
    }
    // reset page to 1 in case previous page out of range
    if (page.value > totalPages.value) page.value = 1
  } catch (err) {
    console.error('获取论文失败', err)
    allPapers.value = []
    total.value = 0
  }
}

// 点击查看跳转
function viewPaper(id) {
  router.push('/papers/' + id)
}

// 搜索（逻辑不变：searchPapers 默认最多返回一定数量；不改动）
async function doSearch() {
  if (!query.value) {
    // 无查询则重新拉取全部
    page.value = 1
    await fetchAll()
    return
  }

  try {
    // 保持原来 search 限制行为（searchPapers 默认返回至多 max_results）
    const resp = await searchPapers(query.value, 100)
    if (Array.isArray(resp)) {
      allPapers.value = resp
      total.value = resp.length
    } else if (resp && resp.papers) {
      allPapers.value = resp.papers
      total.value = resp.total ?? resp.papers.length
    } else {
      allPapers.value = []
      total.value = 0
    }
    page.value = 1
  } catch (err) {
    console.error('搜索失败', err)
    allPapers.value = []
    total.value = 0
  }
}

// 分页变更时触发（点击页码或 jumper 跳转）
function onPageChange(p) {
  page.value = p
  // pagedPapers 是 computed，会自动更新
}

// 重置搜索并恢复默认（拉取全部）
function reset() {
  query.value = ''
  page.value = 1
  fetchAll()
}

onMounted(() => {
  // 默认从后端获取全部论文（service 层会分页循环直到拿完）
  fetchAll()
})

// 如果改变 pageSize（当前固定 10），可监听并调整
watch(pageSize, () => {
  page.value = 1
})
</script>

<style scoped>
.sub{color:var(--muted); font-size:13px}
</style>