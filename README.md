# Quasar 應用程式 (quasar-project)

PL 可視化是一個基於 Quasar 和 Vue 的應用，用於程式語言的可視化和執行追蹤。

## 先決條件
* node: v20.18.1
* npm: 7.6.3

## 安裝依賴項
```bash
npm install
```

在開發模式下啟動應用程式 (熱代碼重載、錯誤報告等)
```bash
quasar dev
```

在生產模式下構建應用程式 (原則不需要，會交由github action自動構建)
```bash
quasar build
```

## 主要功能
- PL 可視化: 用於程式語言的可視化和執行追蹤
- WebSocket 支援: 使用 WebSocket 進行即時通訊
- D3.js: 使用 D3.js 進行數據可視化
