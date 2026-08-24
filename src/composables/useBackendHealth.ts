import { ref, computed, onMounted, onUnmounted } from 'vue'
import { BACKEND_SERVICES, type BackendService } from 'src/config/services'

export type HealthState = 'checking' | 'up' | 'degraded' | 'down' | 'unknown'

export interface ServiceHealth {
  service: BackendService
  state: HealthState
}

const PROBE_TIMEOUT_MS = 5000
const POLL_INTERVAL_MS = 60_000
// hover 會觸發重新檢查，這道下限避免滑鼠來回掃過就打出一串請求。
const MIN_REFRESH_INTERVAL_MS = 5_000

const initialHealth = (service: BackendService): ServiceHealth => ({
  service,
  state: service.healthPath ? 'checking' : 'unknown',
})

/**
 * 探測單一服務。
 *
 * 只看 HTTP 狀態碼，不讀回應內容——後端刻意只回報「活著 / 沒活著」，
 * 這裡也就沒有別的東西好解析。連不上、被 CORS 擋、逾時，對使用者而言
 * 都是同一件事：這個服務現在用不了。
 */
const probe = async (service: BackendService): Promise<ServiceHealth> => {
  if (!service.healthPath) return initialHealth(service)

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS)

  try {
    const res = await fetch(`${service.origin}${service.healthPath}`, {
      signal: controller.signal,
      cache: 'no-store',
    })
    return { service, state: res.ok ? 'up' : 'down' }
  } catch {
    return { service, state: 'down' }
  } finally {
    clearTimeout(timer)
  }
}

export const useBackendHealth = () => {
  const statuses = ref<ServiceHealth[]>(BACKEND_SERVICES.map(initialHealth))
  const isRefreshing = ref(false)
  let pollTimer: ReturnType<typeof setInterval> | null = null
  let lastRefreshAt = 0

  const refresh = async () => {
    if (isRefreshing.value) return
    isRefreshing.value = true
    try {
      statuses.value = await Promise.all(BACKEND_SERVICES.map(probe))
      lastRefreshAt = Date.now()
    } finally {
      isRefreshing.value = false
    }
  }

  /**
   * 展開狀態列表時呼叫。
   *
   * 使用者去看這個列表的時機，就是他想知道「現在」如何的時機，所以打開即重新
   * 檢查，不必再給一個按鈕。
   */
  const refreshIfStale = () => {
    if (Date.now() - lastRefreshAt >= MIN_REFRESH_INTERVAL_MS) void refresh()
  }

  /** 整體狀態：有探針的服務裡，全綠才綠，全紅才紅，其餘為部分異常。 */
  const aggregate = computed<HealthState>(() => {
    const probed = statuses.value.filter((s) => s.service.healthPath)
    if (!probed.length) return 'unknown'
    if (probed.some((s) => s.state === 'checking')) return 'checking'
    if (probed.every((s) => s.state === 'up')) return 'up'
    if (probed.every((s) => s.state === 'down')) return 'down'
    return 'degraded'
  })

  const onVisibilityChange = () => {
    // 分頁在背景時不必浪費請求；切回來時立刻補一次，避免看到過期狀態。
    if (document.visibilityState === 'visible') void refresh()
  }

  onMounted(() => {
    void refresh()
    pollTimer = setInterval(() => {
      if (document.visibilityState === 'visible') void refresh()
    }, POLL_INTERVAL_MS)
    document.addEventListener('visibilitychange', onVisibilityChange)
  })

  onUnmounted(() => {
    if (pollTimer) clearInterval(pollTimer)
    document.removeEventListener('visibilitychange', onVisibilityChange)
  })

  return { statuses, aggregate, refreshIfStale, isRefreshing }
}
