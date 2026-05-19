# 🌏 地震學 Chapter 4 — 地震與震源機制

互動式教學網頁，涵蓋地震學課本第四章核心內容。

## 📖 內容

| 區塊 | 內容 |
|------|------|
| **4.1 導論** | 彈性回跳理論（含互動動畫）、地震週期四階段、研究動機 |
| **4.2 震源機制** | 斷層幾何、P波初動、輻射花樣、互動式沙灘球 |
| **案例分析** | 2026/04/20 M7.4 日本宮古市近海地震 |
| **互動工具** | 嵌入 Hugging Face Moment Tensor 視覺化工具 |

## 🎮 互動功能

- 彈性回跳理論 Canvas 動畫
- 地震週期可點選時間軸
- 四種斷層類型切換展示
- P 波輻射花樣探索器
- **互動式沙灘球**：調整 Strike / Dip / Rake 即時更新
- 嵌入 Hugging Face Space

## 🛠️ 技術

純 HTML + CSS + JavaScript，無框架依賴。使用 KaTeX 渲染數學公式。

## 📁 結構

```
├── index.html      # 主頁面
├── style.css       # 樣式
├── script.js       # 互動邏輯
├── images/         # 課本圖片與案例圖
└── README.md
```

## 🚀 部署

靜態網頁，直接以 GitHub Pages 部署即可。

## 📚 參考

- Shearer, P. M. *Introduction to Seismology*
- [USGS Event us6000sri7](https://earthquake.usgs.gov/earthquakes/eventpage/us6000sri7/executive)
- [Moment Tensor Tool (HF)](https://huggingface.co/spaces/rrnn0518/moment_tensor)
