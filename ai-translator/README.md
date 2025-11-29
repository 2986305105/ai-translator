# 本地AI翻译工具

基于 Electron + Parallax 的本地AI翻译工具，支持 50+ 语言互译，数据完全本地化。

## ✨ 核心功能

- 🌐 支持 50+ 语言互译
- 📝 单句翻译
- 📄 批量翻译文档
- 🔄 快速切换语言
- 🔒 数据完全本地，保护隐私

## 🚀 快速开始

### 环境要求

- Node.js 18+
- Parallax 已安装并运行 DeepSeek R1 模型

### 安装步骤

```bash
# 克隆仓库
git clone https://github.com/yourusername/ai-translator.git
cd ai-translator

# 安装依赖
npm install

# 启动应用
npm start

# 打包应用
npm run build
```

## 📖 使用指南

1. **单句翻译**
   - 选择源语言和目标语言
   - 输入要翻译的文本
   - 点击"翻译"按钮

2. **批量翻译**
   - 在批量翻译区域输入文本（每行一句）
   - 点击"批量翻译"
   - 查看翻译结果

3. **语言切换**
   - 点击 ⇄ 按钮快速交换语言
   - 或手动选择语言

## 🛠 技术栈

- **框架**: Electron
- **AI 引擎**: Parallax + DeepSeek R1
- **前端**: 原生 HTML/CSS/JavaScript

## 📁 项目结构

```
ai-translator/
├── main.js              # Electron 主进程
├── preload.js           # 预加载脚本
├── src/
│   └── renderer/        # 渲染进程
│       ├── index.html
│       ├── app.js
│       └── styles.css
├── package.json
└── README.md
```

## 🎯 隐私保护

- ✅ 所有翻译数据存储在本地
- ✅ AI 推理完全离线
- ✅ 不上传任何数据到云端

## 📝 License

MIT License

