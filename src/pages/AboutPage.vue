<template>
  <q-page class="q-pa-md">
    <div class="text-center">
      <h1 class="title">關於我們</h1>
      <p class="description">此網站的source code以開源在 GitHub 上，歡迎大家參與貢獻。</p>
      <q-btn class="github-button" color="black" @click="navigateToGitHub">
        <i class="fab fa-github"></i> GitHub
      </q-btn>
    </div>
  </q-page>
</template>

<script setup>
const navigateToGitHub = () => {
  window.open('https://github.com/CYCU-ICE-PL/website', '_blank')
}
</script>

<style scoped>
.text-center {
  text-align: center;
  padding: 2rem;
}

.title {
  font-size: 2.5rem;
  font-weight: 600;
}

.description {
  font-size: 1.25rem;
  margin: 1rem 0;
}

.github-button {
  font-size: 1rem;
  padding: 0.75rem 1.5rem;
  color: white;
  border-radius: 0.5rem;
  transition: transform 0.3s ease-in-out;
  text-transform: none;
  margin: 0.5rem;
}

.github-button {
  background-color: #333;
}

.github-button i {
  margin-right: 0.5rem;
}
</style>