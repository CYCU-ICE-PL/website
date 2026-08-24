<template>
  <q-btn
    flat
    round
    dense
    class="status-btn"
    :aria-label="`後端服務狀態：${STATE_META[aggregate].label}`"
  >
    <q-spinner v-if="isRefreshing && aggregate === 'checking'" size="20px" />
    <q-icon v-else :name="STATE_META[aggregate].icon" :class="`status-icon status-${aggregate}`" />

    <q-tooltip
      class="backend-status-tooltip"
      anchor="bottom right"
      self="top right"
      :offset="[0, 8]"
      @show="refreshIfStale"
    >
      <div class="tooltip-title">後端服務狀態</div>

      <div v-for="item in statuses" :key="item.service.id" class="service-row">
        <div class="service-head">
          <span :class="`dot dot-${item.state}`" />
          <span class="service-label">{{ item.service.label }}</span>
          <span :class="`service-state state-${item.state}`">{{ STATE_META[item.state].label }}</span>
        </div>
        <div class="service-origin">{{ item.service.origin }}</div>
      </div>

      <div v-if="isRefreshing" class="tooltip-foot">檢查中…</div>
    </q-tooltip>
  </q-btn>
</template>

<script setup lang="ts">
import { useBackendHealth, type HealthState } from 'src/composables/useBackendHealth'

const { statuses, aggregate, refreshIfStale, isRefreshing } = useBackendHealth()

const STATE_META: Record<HealthState, { label: string; icon: string }> = {
  up: { label: '正常', icon: 'cloud_done' },
  degraded: { label: '部分異常', icon: 'cloud_queue' },
  down: { label: '離線', icon: 'cloud_off' },
  checking: { label: '檢查中', icon: 'cloud_queue' },
  unknown: { label: '未提供檢查', icon: 'cloud_queue' },
}
</script>

<style scoped>
.status-btn {
  color: white;
  cursor: default;
  transition: all 0.3s ease;
  border-radius: 50%;
  padding: 0.5rem;
}

.status-btn:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.status-icon {
  font-size: 1.5rem;
  transition: color 0.3s ease;
}

/* 圖示本身帶顏色，讓使用者不必 hover 就能看出狀態 */
.status-up {
  color: #7ee2a8;
}
.status-degraded {
  color: #ffd479;
}
.status-down {
  color: #ff8f8f;
}
.status-checking,
.status-unknown {
  color: rgba(255, 255, 255, 0.7);
}
</style>

<style>
/* QTooltip 會被 portal 到 body，因此不能寫在 scoped 區塊裡。 */
.backend-status-tooltip {
  background: rgba(28, 32, 42, 0.96);
  backdrop-filter: blur(6px);
  border-radius: 10px;
  padding: 0.75rem 0.9rem;
  font-size: 0.8rem;
  line-height: 1.5;
  max-width: 22rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

.backend-status-tooltip .tooltip-title {
  font-weight: 600;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
  opacity: 0.85;
}

.backend-status-tooltip .service-row + .service-row {
  margin-top: 0.6rem;
  padding-top: 0.6rem;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.backend-status-tooltip .service-head {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.backend-status-tooltip .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex: none;
}

.backend-status-tooltip .dot-up {
  background: #4ade80;
}
.backend-status-tooltip .dot-degraded {
  background: #fbbf24;
}
.backend-status-tooltip .dot-down {
  background: #f87171;
}
.backend-status-tooltip .dot-checking,
.backend-status-tooltip .dot-unknown {
  background: #94a3b8;
}

.backend-status-tooltip .service-label {
  font-weight: 600;
}

.backend-status-tooltip .service-state {
  margin-left: auto;
  font-size: 0.75rem;
  opacity: 0.9;
}

.backend-status-tooltip .state-up {
  color: #4ade80;
}
.backend-status-tooltip .state-degraded {
  color: #fbbf24;
}
.backend-status-tooltip .state-down {
  color: #f87171;
}
.backend-status-tooltip .state-checking,
.backend-status-tooltip .state-unknown {
  color: #cbd5e1;
}

/* 使用者實際連到的位置：等寬字體，方便直接讀出主機名 */
.backend-status-tooltip .service-origin {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.72rem;
  opacity: 0.9;
  padding-left: 1.05rem;
  word-break: break-all;
}

.backend-status-tooltip .tooltip-foot {
  margin-top: 0.7rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 0.7rem;
  opacity: 0.65;
}
</style>
