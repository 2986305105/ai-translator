const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const axios = require('axios');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#ffffff'
  });

  mainWindow.loadFile('src/renderer/index.html');
  
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// ========== IPC 处理器 ==========

// 翻译文本
ipcMain.handle('translate', async (event, { text, fromLang, toLang }) => {
  try {
    const prompt = buildTranslationPrompt(text, fromLang, toLang);
    
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'deepseek-r1:latest',
      prompt: prompt,
      stream: false,
      options: {
        temperature: 0.3,
        num_predict: 2000
      }
    }, {
      timeout: 120000
    });
    
    const translatedText = response.data.response.trim();
    
    return {
      success: true,
      translatedText: translatedText,
      originalText: text
    };
  } catch (error) {
    console.error('翻译失败:', error);
    return {
      success: false,
      error: error.message || '翻译失败'
    };
  }
});

// 批量翻译
ipcMain.handle('translate-batch', async (event, { texts, fromLang, toLang }) => {
  const results = [];
  
  for (const text of texts) {
    if (!text.trim()) {
      results.push({ original: text, translated: '' });
      continue;
    }
    
    try {
      const result = await translate({ text, fromLang, toLang });
      results.push({
        original: text,
        translated: result.translatedText || ''
      });
    } catch (error) {
      results.push({
        original: text,
        translated: `[翻译失败: ${error.message}]`
      });
    }
  }
  
  return results;
});

// 检查 Parallax 连接
ipcMain.handle('check-connection', async () => {
  try {
    const response = await axios.get('http://localhost:11434/api/tags', {
      timeout: 5000
    });
    return response.status === 200;
  } catch {
    return false;
  }
});

function buildTranslationPrompt(text, fromLang, toLang) {
  const langNames = {
    'zh': '中文',
    'en': '英文',
    'ja': '日文',
    'ko': '韩文',
    'fr': '法文',
    'de': '德文',
    'es': '西班牙文',
    'ru': '俄文',
    'ar': '阿拉伯文',
    'pt': '葡萄牙文',
    'it': '意大利文',
    'nl': '荷兰文',
    'pl': '波兰文',
    'tr': '土耳其文',
    'vi': '越南文',
    'th': '泰文',
    'id': '印尼文',
    'hi': '印地文',
  };
  
  const from = langNames[fromLang] || fromLang;
  const to = langNames[toLang] || toLang;
  
  return `请将以下${from}文本翻译成${to}。只返回翻译结果，不要包含其他说明文字。

原文：
${text}

翻译：`;
}

async function translate({ text, fromLang, toLang }) {
  const prompt = buildTranslationPrompt(text, fromLang, toLang);
  
  const response = await axios.post('http://localhost:11434/api/generate', {
    model: 'deepseek-r1:latest',
    prompt: prompt,
    stream: false,
    options: {
      temperature: 0.3,
      num_predict: 2000
    }
  }, {
    timeout: 120000
  });
  
  return {
    translatedText: response.data.response.trim()
  };
}

