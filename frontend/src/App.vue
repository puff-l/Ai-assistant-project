<template>
  <el-container style="min-height:100vh">
    <el-header class="header">
      <NavBar />
    </el-header>
    <el-main class="main">
      <router-view />
    </el-main>
    <el-footer class="footer">
      <Footer />
    </el-footer>
  </el-container>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'
</script>
