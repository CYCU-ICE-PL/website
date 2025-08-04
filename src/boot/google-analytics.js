// 簡單的 Google Analytics 追蹤實現
// 此文件用於追蹤網站的頁面瀏覽

export default ({ router }) => {
  // 當頁面路由變化時觸發
  router.afterEach((to) => {
    // 不再記錄頁面訪問到控制台

    // 如果有配置 Google Analytics，則可以在此處添加 GA 追蹤代碼
    if (window.gtag) {
      window.gtag('config', 'YOUR-GA-ID', {
        page_path: to.path
      })
    }
  })
}