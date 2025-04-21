# Quasar 應用程式 (quasar-project)

> PL 可視化是一個基於 Quasar 的應用，用於程式語言的可視化和執行追蹤。

[![Build](https://github.com/CYCU-ICE-PL/website/actions/workflows/deploy.yml/badge.svg)](https://github.com/CYCU-ICE-PL/website/actions)
## 🛠️ 開發流程

1. 在 `main` branch 上創建新的分支
2. 在新分支上進行開發
3. 開發完成後，發起 Pull Request
4. 確認無問題後，合併到 `main` branch
5. GitHub Action 會自動構建並部署到 GitHub Pages
   
## 🚀 使用技術（Tech Stack）

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-CC3534?logo=npm&logoColor=white)
![Quasar](https://img.shields.io/badge/Quasar-1E90FF?logo=quasar&logoColor=white)
![Vue.js](https://img.shields.io/badge/Vue.js-42b883?logo=vue.js&logoColor=white)
![D3.js](https://img.shields.io/badge/D3.js-F9A03C?logo=d3.js&logoColor=black)
![WebSocket](https://img.shields.io/badge/WebSocket-35495E?logo=websocket&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-blue?logo=github)

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

## ✨主要功能
- 📊 PL 可視化: 用於程式語言的可視化和執行追蹤
- 🔁 WebSocket 支援: 使用 WebSocket 進行即時通訊
- 📈 D3.js: 使用 D3.js 進行數據可視化

