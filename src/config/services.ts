/**
 * 這個前端所依賴的後端服務。
 *
 * 前端本身是 GitHub Pages 上的靜態站台，沒有自己的後端；使用者實際會踩到的
 * 失效都發生在這幾個服務上，所以「連到哪一台」以這裡為單一事實來源，
 * 避免 URL 散落在各個元件裡。
 */
export interface BackendService {
  id: string
  /** 顯示給使用者看的名稱。 */
  label: string
  /** 瀏覽器實際連線的位置，hover 時顯示。 */
  origin: string
  /**
   * 健康檢查路徑；尚未提供該端點的服務為 null。
   *
   * 為 null 時會顯示為「未知」而非「離線」——沒有探針不等於服務掛了，
   * 用紅燈去標一個其實活著的服務，比不標還糟。
   */
  healthPath: string | null
}

export const BACKEND_SERVICES: BackendService[] = [
  {
    id: 'interpreter-api',
    label: '直譯器後端',
    origin: 'https://pl-tmp.ja-errorpro.codes',
    healthPath: '/healthz',
  },
  {
    id: 'ourc-visualizer',
    label: 'OurC AST 可視化',
    origin: 'https://pl-ourc-visualize.ja-errorpro.codes',
    healthPath: '/healthz',
  },
  {
    id: 'ourscheme-visualizer',
    label: 'OurScheme AST 可視化',
    origin: 'https://pl-visualize-tmp.ja-errorpro.codes',
    healthPath: null,
  },
]

const interpreterApi = BACKEND_SERVICES[0]!

/** 直譯器後端的 WebSocket 位置，與狀態指示器顯示的 origin 保證一致。 */
export const INTERPRETER_WS_URL = `${interpreterApi.origin.replace(/^http/, 'ws')}/`
