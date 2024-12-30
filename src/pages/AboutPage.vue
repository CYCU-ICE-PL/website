<template>
  <q-page class="q-pa-md">
    <div class="text-center">
      <h1 class="title">關於</h1>
      <p class="description">如果您喜歡這個網站，請不要忘記按個讚支持我們</p>
      <p class="description">此網站的source code以開源在 GitHub 上，歡迎大家參與貢獻!</p>
      <q-btn class="github-button" color="black" @click="navigateToGitHub">
        <i class="fab fa-github"></i> GitHub
      </q-btn>
      <q-btn class="github-button" color="black" @click="navigateToStar">
        <i class="fas fa-star"></i> 按讚
        <q-badge color="grey" class="q-ml-sm">{{ starCount }}</q-badge>
      </q-btn>
      <q-btn class="github-button" color="black" @click="navigateToIssue">
        <i class="fas fa-exclamation-triangle"></i> 問題回報
      </q-btn>
      <div v-if="contributors.length" class="contributors-list">
        <q-toolbar class="contributors-title">
          <q-toolbar-title>貢獻者名單</q-toolbar-title>
        </q-toolbar>
        <q-row>
          <q-col v-for="contributor in contributors" :key="contributor.id" cols="12" sm="6" md="4">
            <q-card>
              <q-card-section class="row items-center">
                <q-avatar>
                  <img :src="contributor.avatar_url" :alt="contributor.login">
                </q-avatar>
                <q-item-section>
                  <q-item-label>
                    <a :href="contributor.html_url" target="_blank">{{ contributor.login }}</a>
                  </q-item-label>
                  <q-item-label caption>{{ contributor.name }}</q-item-label>
                </q-item-section>
              </q-card-section>
            </q-card>
          </q-col>
        </q-row>
      </div>
      <div v-if="commits.length" class="commits-list">
        <q-toolbar class="commits-title">
          <q-toolbar-title>最近提交紀錄</q-toolbar-title>
        </q-toolbar>
        <q-list>
          <q-item v-for="commit in commits" :key="commit.sha">
            <q-item-section>
              <q-item-label>{{ commit.commit.message }}</q-item-label>
              <q-item-label caption>{{ commit.author.login }} - {{ formatDate(commit.commit.author.date) }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
    <div class="text-center">
      <p class="createby">Created by: Joe Liao</p>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const starCount = ref(0)
const contributors = ref([])
const commits = ref([])

const fetchStarCount = async () => {
  try {
    const response = await fetch('https://api.github.com/repos/CYCU-ICE-PL/website')
    const data = await response.json()
    starCount.value = data.stargazers_count
  } catch (error) {
    console.error('Error fetching star count:', error)
  }
}

const fetchContributors = async () => {
  try {
    const response = await fetch('https://api.github.com/repos/CYCU-ICE-PL/website/contributors')
    const data = await response.json()
    contributors.value = await Promise.all(data.map(async (contributor) => {
      const userResponse = await fetch(contributor.url)
      const userData = await userResponse.json()
      return {
        ...contributor,
        name: userData.name || 'N/A'
      }
    }))
  } catch (error) {
    console.error('Error fetching contributors:', error)
  }
}

const fetchCommits = async () => {
  try {
    const response = await fetch('https://api.github.com/repos/CYCU-ICE-PL/website/commits')
    const data = await response.json()
    commits.value = data.slice(0, 5) // 只顯示最新的5個提交紀錄
  } catch (error) {
    console.error('Error fetching commits:', error)
  }
}

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }
  return new Date(dateString).toLocaleDateString('zh-TW', options)
}

onMounted(() => {
  fetchStarCount()
  fetchContributors()
  fetchCommits()
})

const navigateToGitHub = () => {
  window.open('https://github.com/CYCU-ICE-PL/website', '_blank')
}

const navigateToStar = () => {
  window.open('https://github.com/CYCU-ICE-PL/website/stargazers', '_blank')
}

const navigateToIssue = () => {
  window.open('https://github.com/CYCU-ICE-PL/website/issues', '_blank')
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

.createby {
  font-size: 1rem;
  margin: 1rem 0;
}

.github-button {
  font-size: 1.2rem;
  padding: 0.75rem 1.5rem;
  color: white;
  border-radius: 0.5rem;
  transition: transform 0.3s ease-in-out;
  text-transform: none;
  margin: 0.5rem;
  background-color: #333;
}

.github-button i {
  margin-right: 0.5rem;
}

.contributors-list {
  margin-top: 1rem;
  text-align: left;
}

.contributors-title {
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  font-size: 1.5rem;
  font-weight: 500;
  color: #333;
}

.q-card {
  display: flex;
  align-items: center;
}

.commits-list {
  margin-top: 1rem;
  text-align: left;
}

.commits-title {
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  font-size: 1.5rem;
  font-weight: 500;
  color: #333;
}
</style>