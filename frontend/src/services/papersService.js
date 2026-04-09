import apiClient from './api'

/**
 * 批量获取论文 —— 改为默认拉取“全部”后端数据（而不是固定 100 条）。
 *
 * 调用规则：
 * - fetchPapersBulk() 或 fetchPapersBulk('all') ：从后端循环分页请求直到拿完全部（后端 limit 上限为 100）。
 * - fetchPapersBulk(n) ：如果传入具体数字 n (>0)，尝试一次性请求 n 条（后端可能会限制最大 100），如果 n > 后端单次上限，函数仍会分页获取直到达到 n 或拿完全部。
 *
 * 返回：
 * - 如果后端返回 array，则最终返回 array（全部 papers）。
 * - 如果后端返回 { total, papers }，则返回 { total, papers }（papers 包含全部合并后的记录，total 为合并后的总数）。
 *
 * 兼容 fallback mock：当后端不可用时会使用 apiClient.mockPapers 做分页 fallback。
 */
export async function fetchPapersBulk(count = 'all') {
  const allMock = apiClient.mockPapers || []

  // 后端单次请求的 limit（按 API 说明，通常最大 100）
  const perRequestLimit = 100

  // Helper to perform a single request (returns resp which can be array or { total, papers })
  async function fetchPage(limit, page) {
    // prepare fallback for this page using local mock
    const start = (page - 1) * limit
    const fallbackArray = allMock.slice(start, start + limit)
    const fallbackObj = { total: allMock.length, papers: fallbackArray }
    // safeGet will return either array or object depending on backend; we pass fallbackObj
    return await apiClient.safeGet('/api/papers', fallbackObj, { limit, page })
  }

  // If user asked for a specific count number (positive integer), we fetch up to that many.
  if (typeof count === 'number' && count > 0) {
    const target = Number(count)
    const limit = Math.min(perRequestLimit, target)
    let page = 1
    let accumulated = []
    let seenTotal = null

    while (accumulated.length < target) {
      const resp = await fetchPage(limit, page)
      if (Array.isArray(resp)) {
        accumulated.push(...resp)
        // 如果后端返回数组且本页返回少于 limit，说明已经拿完
        if (resp.length < limit) break
      } else if (resp && resp.papers) {
        seenTotal = resp.total ?? seenTotal
        accumulated.push(...resp.papers)
        // 如果累计已达到后端告知的 total，或者本次返回少于 limit，结束
        if ((seenTotal !== null && accumulated.length >= seenTotal) || resp.papers.length < limit) break
      } else {
        // 不可解析响应，跳出
        break
      }
      page += 1
      // 如果下一次需要更大的 limit（最后一页可能不满），调整 limit
      const remaining = target - accumulated.length
      if (remaining > 0) {
        // keep perRequestLimit but don't request more than remaining in last iteration
        // we still use server-side limit up to perRequestLimit
      }
    }

    // 截断到 target
    const sliced = accumulated.slice(0, target)
    return sliced
  }

  // 如果 count === 'all' 或者非正数（默认）——我们尝试把后端全部数据拉下来
  // 分页循环请求并合并直至拿完（基于后端返回的 total 或本页条数 < perRequestLimit）
  let page = 1
  let accumulated = []
  let totalKnown = null

  while (true) {
    const resp = await fetchPage(perRequestLimit, page)

    if (Array.isArray(resp)) {
      accumulated.push(...resp)
      // 如果后端直接返回数组：当本页返回条数 < perRequestLimit 时表示已拿完
      if (resp.length < perRequestLimit) {
        break
      } else {
        // 否则继续请求下一页
        page += 1
        continue
      }
    } else if (resp && resp.papers) {
      // 后端返回 { total, papers }
      totalKnown = resp.total ?? totalKnown
      accumulated.push(...resp.papers)

      // 当已取得足够条数时停止
      if (totalKnown !== null && accumulated.length >= totalKnown) {
        break
      }
      // 如果本页条数小于 perRequestLimit，表示没有更多数据
      if (resp.papers.length < perRequestLimit) {
        break
      }
      page += 1
      continue
    } else {
      // 不可解析响应，停止并把已拿到的返回（避免死循环）
      break
    }
  }

  // 如果后端原本返回的是 object 格式，跟调用方保持一致，返回 { total, papers }
  // 否则返回数组也被允许（component 中已有处理逻辑）
  return { total: accumulated.length, papers: accumulated }
}

/**
 * 搜索论文（返回至多 max_results 条）
 * 当后端不可用时会在本地 mock 数据中进行简单匹配并返回 { total, papers }
 */
export async function searchPapers(query, max_results = 10, fields = 'title,abstract') {
  const all = apiClient.mockPapers || []
  const q = String(query || '').trim().toLowerCase()
  const filtered = q ? all.filter(p => {
    const hay = `${p.title || ''} ${p.abstract || ''} ${(p.authors || []).join(' ')}`.toLowerCase()
    return hay.indexOf(q) !== -1
  }) : all

  const fallback = { total: filtered.length, papers: filtered.slice(0, max_results) }
  // call backend if possible
  const resp = await apiClient.safeGet('/api/papers/search', fallback, { query, max_results, fields })
  if (Array.isArray(resp)) return resp
  return resp
}

/**
 * 保留的服务：按页请求（若后端支持分页）
 * getPapers(limit, page) 会请求后端 /api/papers?limit=&page=
 * 并在 fallback 情况下返回 { total, papers: slice }
 */
export async function getPapers(limit = 10, page = 1) {
  const all = apiClient.mockPapers || []
  const total = all.length
  const start = (Number(page) - 1) * Number(limit)
  const end = start + Number(limit)
  const fallback = { total, papers: all.slice(start, end) }
  return await apiClient.safeGet('/api/papers', fallback, { limit, page })
}

export async function getPaperById(id) {
  const fallback = apiClient.mockPapers.find(p => p.id === id) || null
  return await apiClient.safeGet('/api/papers/' + id, fallback)
}

export async function getStats() {
  const fallback = apiClient.mockStats
  return await apiClient.safeGet('/api/stats', fallback)
}

export async function getTopics() {
  const fallback = apiClient.mockTopics
  return await apiClient.safeGet('/api/topics', fallback)
}

export async function getTopicById(id) {
  const t = apiClient.mockTopics.topics.find(x => x.topic_id === Number(id))
  const fallback = t || null
  return await apiClient.safeGet('/api/topics/' + id, fallback)
}

export async function getTopicPapers(id, limit = 50) {
  const fallbackList = apiClient.mockPapers.filter(p => p.topic_id === Number(id))
  const fallback = { total: fallbackList.length, papers: fallbackList.slice(0, limit) }
  return await apiClient.safeGet(`/api/topics/${id}/papers`, fallback, { limit })
}

// Chat endpoints (mock fallback)
export async function chatInit(topic_id = null) {
  const fallback = { session_id: 'mock-session-1', topic_id, topic_name: 'mock', message: '对话已初始化，您可以开始提问了' }
  return await apiClient.safeGet('/api/chat/init', fallback)
}

export async function chatMessage(session_id, message) {
  const fallback = {
    answer: '（这是模拟回答）根据相关论文，示例回答：深度学习在医学影像分类中表现突出...',
    sources: [{ title: 'Deep Learning for Medical Imaging', id: '2301.00001', relevance: 0.92 }],
    question: message
  }
  return await apiClient.safeGet('/api/chat/message', fallback)
}

export async function chatHistory(session_id) {
  const fallback = { session_id, history: [] }
  return await apiClient.safeGet('/api/chat/history', fallback, { session_id })
}