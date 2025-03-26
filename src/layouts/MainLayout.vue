<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated class="header" :style="{ background: moods[currentMood].headerGradient }">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="drawer = !drawer" class="menu-btn">
          <q-tooltip anchor="bottom right" self="top middle">
            選單
          </q-tooltip>
        </q-btn>
        <q-btn flat round icon="home" @click="goHome" class="home-btn">
          <q-tooltip anchor="bottom right" self="top middle">
            回首頁
          </q-tooltip>
        </q-btn>
        <q-toolbar-title class="title">
          <transition name="fade" mode="out-in">
            <span :key="currentPageTitle">{{ currentPageTitle }}</span>
          </transition>
        </q-toolbar-title>
        <q-btn flat round :icon="moods[currentMood].icon" @click="toggleMood" class="mood-btn">
          <q-tooltip anchor="bottom right" self="top middle">
            切換心情：{{ moods[currentMood].name }}
          </q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" class="drawer" :width="280" :breakpoint="500">
      <q-scroll-area class="fit">
        <q-list class="drawer-list">
          <q-item to="/" exact clickable class="drawer-item">
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>首頁</q-item-section>
          </q-item>
          <q-separator />
          <q-item to="/OurScheme" clickable class="drawer-item">
            <q-item-section avatar>
              <q-icon name="code" />
            </q-item-section>
            <q-item-section>OurScheme</q-item-section>
          </q-item>
          <q-item to="/OurC" clickable class="drawer-item">
            <q-item-section avatar>
              <q-icon name="code" />
            </q-item-section>
            <q-item-section>OurC</q-item-section>
          </q-item>
          <q-item to="/Visualize" clickable class="drawer-item">
            <q-item-section avatar>
              <q-icon name="visibility" />
            </q-item-section>
            <q-item-section>可視化</q-item-section>
          </q-item>
          <q-separator />
          <q-item to="/Tutorial" clickable class="drawer-item">
            <q-item-section avatar>
              <q-icon name="school" />
            </q-item-section>
            <q-item-section>教學</q-item-section>
          </q-item>
          <q-item to="/About" clickable class="drawer-item">
            <q-item-section avatar>
              <q-icon name="info" />
            </q-item-section>
            <q-item-section>關於</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container :style="{ background: moods[currentMood].backgroundGradient }">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :class="{ 'page-transitioning': isPageTransitioning }" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const drawer = ref(false)
const currentPageTitle = ref('')
const isPageTransitioning = ref(false)
const currentMood = ref('default')

const moods = {
  default: {
    name: '預設',
    icon: 'sentiment_satisfied',
    headerGradient: 'linear-gradient(135deg, #8b9dc3 0%, #6b7b9c 100%)',
    backgroundGradient: 'linear-gradient(135deg, #e6e9f0 0%, #eef1f5 100%)',
    primaryColor: '#8b9dc3',
    secondaryColor: '#6b7b9c'
  },
  happy: {
    name: '開心',
    icon: 'sentiment_very_satisfied',
    headerGradient: 'linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 100%)',
    backgroundGradient: 'linear-gradient(135deg, #FFF0F5 0%, #FFE4E1 100%)',
    primaryColor: '#FFB6C1',
    secondaryColor: '#FFC0CB'
  },
  calm: {
    name: '平靜',
    icon: 'spa',
    headerGradient: 'linear-gradient(135deg, #98FB98 0%, #90EE90 100%)',
    backgroundGradient: 'linear-gradient(135deg, #F0FFF0 0%, #E8F5E9 100%)',
    primaryColor: '#98FB98',
    secondaryColor: '#90EE90'
  },
  energetic: {
    name: '活力',
    icon: 'wb_sunny',
    headerGradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    backgroundGradient: 'linear-gradient(135deg, #FFF8DC 0%, #FFE4B5 100%)',
    primaryColor: '#FFD700',
    secondaryColor: '#FFA500'
  }
}

const toggleMood = () => {
  isPageTransitioning.value = true
  const moodKeys = Object.keys(moods)
  const currentIndex = moodKeys.indexOf(currentMood.value)
  const nextIndex = (currentIndex + 1) % moodKeys.length
  currentMood.value = moodKeys[nextIndex]
  
  setTimeout(() => {
    isPageTransitioning.value = false
    gtag('event', 'change_mood', {
      event_category: 'Mood',
      event_label: moods[currentMood.value].name
    })
  }, 300)
}

const goHome = () => {
  isPageTransitioning.value = true
  router.push('/')
  setTimeout(() => {
    isPageTransitioning.value = false
  }, 300)
}

// 在組件掛載時發送 gtag 事件
onMounted(() => {
  currentPageTitle.value = router.currentRoute.value.name
  gtag('event', 'page_view', {
    page_path: router.currentRoute.value.fullPath,
    page_title: router.currentRoute.value.name,
  })
})

// 使用 router.beforeEach 來監聽路由變更
router.beforeEach((to, _, next) => {
  currentPageTitle.value = to.name
  gtag('event', 'page_view', {
    page_path: to.fullPath,
    page_title: to.name,
  })
  next()
})
</script>

<style scoped>
.header {
  color: white;
  transition: all 0.3s ease;
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
  text-transform: capitalize;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.5px;
}

.menu-btn, .home-btn {
  color: white;
  transition: all 0.3s ease;
  border-radius: 50%;
  padding: 0.5rem;
}

.menu-btn:hover, .home-btn:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.drawer {
  background: rgba(255, 255, 255, 0.95);
  border-right: 1px solid rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(20px);
  box-shadow: 4px 0 16px rgba(0, 0, 0, 0.05);
}

.drawer-list {
  padding: 1rem 0;
}

.drawer-item {
  margin: 0.5rem 1rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  color: #4a5568;
}

.drawer-item:hover {
  background: rgba(139, 157, 195, 0.1);
  transform: translateX(5px);
  color: #2c3e50;
}

.drawer-item.q-item--active {
  background: v-bind('moods[currentMood].headerGradient');
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.drawer-item.q-item--active .q-icon {
  color: white;
}

.q-item-section {
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 500;
}

.q-icon {
  font-size: 1.5rem;
  margin-right: 0.5rem;
  color: #6b7b9c;
  transition: all 0.3s ease;
}

.drawer-item:hover .q-icon {
  color: #2c3e50;
}

:deep(.q-separator) {
  background: rgba(139, 157, 195, 0.2);
  margin: 0.5rem 1rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.page-transitioning {
  pointer-events: none;
  opacity: 0.7;
}

:deep(.q-scrollarea) {
  height: 100%;
}

:deep(.q-scrollarea__thumb) {
  background: v-bind('moods[currentMood].primaryColor + "4D"');
}

:deep(.q-scrollarea__thumb:hover) {
  background: v-bind('moods[currentMood].primaryColor + "80"');
}

:deep(.q-tooltip) {
  background: rgba(44, 62, 80, 0.9);
  backdrop-filter: blur(4px);
  border-radius: 6px;
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
}

:deep(.q-tooltip--style) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.mood-btn {
  color: white;
  transition: all 0.3s ease;
  border-radius: 50%;
  padding: 0.5rem;
  animation: bounce 2s infinite;
}

.mood-btn:hover {
  transform: scale(1.1) rotate(15deg);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}
</style>