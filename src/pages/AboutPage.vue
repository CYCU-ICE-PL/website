<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-md-8">
        <q-card class="about-card shadow-2">
          <q-card-section class="text-center">
            <h1 class="text-h3 text-weight-bold q-mb-md">關於我們</h1>
            <p class="text-h6 q-mb-md">如果您喜歡這個網站，請不要忘記按個讚支持我們</p>
            <p class="text-h6 q-mb-xl">此網站的source code已開源在 GitHub 上，歡迎大家參與貢獻!</p>
            
            <div class="row justify-center q-gutter-md">
              <q-btn
                class="github-button"
                color="dark"
                icon="fab fa-github"
                label="GitHub"
                @click="navigateToGitHub"
              />
              <q-btn
                class="github-button"
                color="warning"
                icon="fas fa-star"
                :label="isLoading.stars ? '加載中...' : `按讚 ${starCount}`"
                @click="navigateToStar"
                :disable="isLoading.stars"
              >
                <q-spinner v-if="isLoading.stars" color="white" size="1em" />
              </q-btn>
              <q-btn
                class="github-button"
                color="negative"
                icon="fas fa-exclamation-triangle"
                label="問題回報"
                @click="navigateToIssue"
              />
            </div>
          </q-card-section>
        </q-card>

        <q-card v-if="!hasError.contributors && contributors.length" class="contributors-card shadow-2 q-mt-md">
          <q-card-section>
            <div class="text-h5 text-weight-bold q-mb-md">貢獻者名單</div>
            <q-inner-loading :showing="isLoading.contributors">
              <q-spinner-dots size="40px" color="primary" />
            </q-inner-loading>
            <div v-if="!isLoading.contributors" class="row q-col-gutter-md">
              <div v-for="contributor in contributors" :key="contributor.id" class="col-12 col-sm-6 col-md-4">
                <q-card class="contributor-card" flat bordered>
                  <q-card-section class="row items-center">
                    <q-avatar size="48px">
                      <img :src="contributor.avatar_url" :alt="contributor.login">
                    </q-avatar>
                    <div class="q-ml-md">
                      <div class="text-weight-bold">
                        <a :href="contributor.html_url" target="_blank" class="text-primary">{{ contributor.login }}</a>
                      </div>
                      <div class="text-caption text-grey">{{ contributor.name }}</div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-card v-if="!hasError.commits && commits.length" class="commits-card shadow-2 q-mt-md">
          <q-card-section>
            <div class="text-h5 text-weight-bold q-mb-md">最近提交紀錄</div>
            <q-inner-loading :showing="isLoading.commits">
              <q-spinner-dots size="40px" color="primary" />
            </q-inner-loading>
            <q-list v-if="!isLoading.commits" separator>
              <q-item v-for="commit in commits" :key="commit.sha" class="commit-item">
                <q-item-section>
                  <q-item-label class="text-weight-medium">{{ commit.commit.message }}</q-item-label>
                  <q-item-label caption class="text-grey">
                    {{ commit.author?.login || 'Unknown' }} - {{ formatDate(commit.commit.author.date) }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>

        <div class="text-center q-mt-md">
          <p class="text-subtitle1 text-grey">Created by: Joe Liao</p>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const starCount = ref(0)
const contributors = ref([])
const commits = ref([])
const isLoading = ref({
  stars: false,
  contributors: false,
  commits: false
})
const hasError = ref({
  stars: false,
  contributors: false,
  commits: false
})

const fetchStarCount = async () => {
  isLoading.value.stars = true
  hasError.value.stars = false
  try {
    const response = await fetch('https://api.github.com/repos/CYCU-ICE-PL/website', {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`GitHub API 回應錯誤: ${response.status}`)
    }
    
    const data = await response.json()
    starCount.value = data.stargazers_count || 0
  } catch (error) {
    console.error('Error fetching star count:', error)
    hasError.value.stars = true
    $q.notify({
      type: 'negative',
      message: '無法載入 Star 數量',
      position: 'top',
      timeout: 3000
    })
  } finally {
    isLoading.value.stars = false
  }
}

const fetchContributors = async () => {
  isLoading.value.contributors = true
  hasError.value.contributors = false
  try {
    const response = await fetch('https://api.github.com/repos/CYCU-ICE-PL/website/contributors', {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`GitHub API 回應錯誤: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (!Array.isArray(data)) {
      throw new Error('回傳的資料不是陣列格式')
    }
    
    // 只處理前10個貢獻者以減少API請求
    const topContributors = data.slice(0, 10)
    
    contributors.value = await Promise.all(topContributors.map(async (contributor) => {
      try {
        const userResponse = await fetch(contributor.url, {
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          }
        })
        
        if (!userResponse.ok) {
          return {
            ...contributor,
            name: 'N/A'
          }
        }
        
        const userData = await userResponse.json()
        return {
          ...contributor,
          name: userData.name || 'N/A'
        }
      } catch {
        return {
          ...contributor,
          name: 'N/A'
        }
      }
    }))
  } catch (error) {
    console.error('Error fetching contributors:', error)
    hasError.value.contributors = true
    $q.notify({
      type: 'negative',
      message: '無法載入貢獻者資訊',
      position: 'top',
      timeout: 3000
    })
  } finally {
    isLoading.value.contributors = false
  }
}

const fetchCommits = async () => {
  isLoading.value.commits = true
  hasError.value.commits = false
  try {
    const response = await fetch('https://api.github.com/repos/CYCU-ICE-PL/website/commits', {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`GitHub API 回應錯誤: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (!Array.isArray(data)) {
      throw new Error('回傳的資料不是陣列格式')
    }
    
    commits.value = data.slice(0, 5) // 只顯示最新的5個提交紀錄
  } catch (error) {
    console.error('Error fetching commits:', error)
    hasError.value.commits = true
    $q.notify({
      type: 'negative',
      message: '無法載入提交紀錄',
      position: 'top',
      timeout: 3000
    })
  } finally {
    isLoading.value.commits = false
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
.about-card {
  border-radius: 16px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(20px);
}

.about-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.github-button {
  font-size: 1.1rem;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #8b9dc3 0%, #6b7b9c 100%);
  color: white;
  border: none;
}

.github-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.contributors-card,
.commits-card {
  border-radius: 16px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(20px);
}

.contributors-card:hover,
.commits-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.contributor-card {
  border-radius: 8px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
}

.contributor-card:hover {
  background-color: rgba(245, 245, 245, 0.9);
  transform: translateY(-2px);
}

.commit-item {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.commit-item:hover {
  background-color: rgba(245, 245, 245, 0.9);
}

a {
  text-decoration: none;
  transition: color 0.3s ease;
  color: #6b7b9c;
}

a:hover {
  color: #8b9dc3;
}

.text-h3 {
  color: #2c3e50;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.05);
}

.text-h6 {
  color: #4a5568;
}

.text-subtitle1 {
  color: #718096;
}
</style>