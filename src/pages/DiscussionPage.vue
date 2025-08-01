<template>
  <q-page class="discussion-page q-pa-md">
    <div class="page-header q-mb-xl">
      <div class="text-h2 text-weight-bold text-primary q-mb-md">討論</div>
      <div class="quote q-mt-md">
        <div class="text-italic text-h5 text-grey-8">" 三人行，必有我師焉 "</div>
        <div class="text-subtitle1 text-grey-7 q-mt-sm">—— 《論語·述而》</div>
      </div>
      <div class="text-subtitle1 text-grey-7 q-mt-lg max-width-600">
        歡迎來到討論區！您可以在下方留言，或前往 GitHub 參與更多討論。
      </div>
    </div>

    <div class="row q-col-gutter-lg q-mb-xl">
      <div class="col-12">
        <a
          href="https://github.com/CYCU-ICE-PL/website/discussions"
          target="_blank"
          class="discussion-link"
        >
          <q-card class="discussion-card">
            <q-card-section class="card-content">
              <div class="card-icon">
                <q-icon name="forum" size="2rem" color="white" />
              </div>
              <div class="card-text">
                <div class="text-h5 text-weight-bold q-mb-sm">前往 GitHub 討論區</div>
                <div class="text-body1 text-grey-7">
                  <q-icon name="arrow_forward" size="1.2rem" class="q-mr-sm" />
                  參與更多主題討論
                </div>
              </div>
              <div class="card-action">
                <q-icon name="launch" size="1.5rem" color="primary" />
              </div>
            </q-card-section>
          </q-card>
        </a>
      </div>
    </div>

    <div class="discussion-container">
      <div class="category-title q-mb-lg">
        <div class="text-h4 text-weight-bold">快速留言</div>
        <q-separator class="q-mt-sm" />
      </div>
      <div id="giscus-container"></div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'

export default defineComponent({
  name: 'DiscussionPage',
  setup() {
    const loadGiscus = () => {
      const script = document.createElement('script')
      script.src = 'https://giscus.app/client.js'
      script.setAttribute('data-repo', 'CYCU-ICE-PL/website')
      script.setAttribute('data-repo-id', 'R_kgDONdDyTw')
      script.setAttribute('data-category', '留言板')
      script.setAttribute('data-category-id', 'DIC_kwDONdDyT84Co8hH')
      script.setAttribute('data-mapping', 'pathname')
      script.setAttribute('data-strict', '0')
      script.setAttribute('data-reactions-enabled', '1')
      script.setAttribute('data-emit-metadata', '0')
      script.setAttribute('data-input-position', 'top')
      script.setAttribute('data-theme', 'preferred_color_scheme')
      script.setAttribute('data-lang', 'zh-TW')
      script.crossOrigin = 'anonymous'
      script.async = true

      const container = document.getElementById('giscus-container')
      if (container) {
        container.appendChild(script)
      }
    }

    onMounted(() => {
      loadGiscus()
    })
  },
})
</script>

<style scoped>
.discussion-page {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
  min-height: 100vh;
  padding: 2rem 1rem;
}

.page-header {
  text-align: center;
  padding: 3rem 0;
  max-width: 1200px;
  margin: 0 auto;
}

.max-width-600 {
  max-width: 600px;
  margin: 0 auto;
}

.discussion-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.discussion-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.discussion-card {
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 20px;
  overflow: hidden;
  background: white;
  border: 1px solid rgba(var(--q-primary), 0.1);
  position: relative;
  max-width: 900px;
  margin: 0 auto;
}

.discussion-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
  border-color: var(--q-primary);
  background: linear-gradient(to right, rgba(var(--q-primary), 0.05), white);
}

.discussion-card:hover .card-icon {
  transform: scale(1.1) rotate(5deg);
}

.discussion-card:hover .card-action {
  transform: translateX(8px);
}

.card-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: left;
  gap: 1.5rem;
  position: relative;
}

.card-icon {
  background: linear-gradient(135deg, var(--q-primary), #2979ff);
  padding: 1.25rem;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.4s ease;
  box-shadow: 0 6px 16px rgba(var(--q-primary), 0.2);
}

.card-text {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-action {
  transition: transform 0.4s ease;
  opacity: 0.9;
}

.category-title {
  color: var(--q-primary);
}

.quote {
  position: relative;
  padding: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
}

.quote::before,
.quote::after {
  content: '';
  position: absolute;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--q-primary) 50%, transparent);
}

.quote::before {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.quote::after {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

@media (max-width: 599px) {
  .page-header {
    padding: 2rem 0;
  }

  .discussion-container {
    padding: 1.5rem;
    border-radius: 16px;
  }

  .card-content {
    padding: 1.25rem;
    gap: 1rem;
  }

  .card-icon {
    padding: 1rem;
  }

  .text-h2 {
    font-size: 2rem;
  }

  .text-h5 {
    font-size: 1.1rem;
  }
}

@media (min-width: 600px) and (max-width: 1023px) {
  .discussion-container {
    padding: 2rem;
  }
}
</style>
