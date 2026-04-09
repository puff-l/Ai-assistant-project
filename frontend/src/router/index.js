import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Papers from '../views/Papers.vue'
import PaperDetail from '../views/PaperDetail.vue'
import Topics from '../views/Topics.vue'
import TopicDetail from '../views/TopicDetail.vue'
import Chat from '../views/Chat.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/papers', component: Papers },
  { path: '/papers/:id', component: PaperDetail, props:true },
  { path: '/topics', component: Topics },
  { path: '/topics/:id', component: TopicDetail, props:true },
  { path: '/chat', component: Chat },
  { path: '/:pathMatch(.*)*', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
