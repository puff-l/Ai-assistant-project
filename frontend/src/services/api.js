import axios from 'axios'
import mockPapers from '../mock/mock_papers.json'
import mockStats from '../mock/mock_stats.json'
import mockTopics from '../mock/mock_topics.json'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  timeout: 5000
})

// Generic request wrapper: on failure, return fallback mock data when available
async function safeGet(url, fallback=null, params=null){
  try{
    const resp = await api.get(url, { params })
    return resp.data
  }catch(err){
    // console.warn('API fetch failed for', url, err.message)
    if(fallback!==null) return fallback
    throw err
  }
}

export default {
  api,
  safeGet,
  mockPapers,
  mockStats,
  mockTopics
}
