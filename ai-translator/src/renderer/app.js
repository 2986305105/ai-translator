const sourceText = document.getElementById('sourceText');
const targetText = document.getElementById('targetText');
const fromLang = document.getElementById('fromLang');
const toLang = document.getElementById('toLang');
const translateBtn = document.getElementById('translateBtn');
const clearBtn = document.getElementById('clearBtn');
const swapBtn = document.getElementById('swapBtn');
const batchSource = document.getElementById('batchSource');
const batchTarget = document.getElementById('batchTarget');
const batchTranslateBtn = document.getElementById('batchTranslateBtn');
const status = document.getElementById('status');

// 检查连接状态
async function checkConnection() {
  const connected = await window.electronAPI.checkConnection();
  if (connected) {
    status.textContent = '✓ 已连接到 Parallax';
    status.className = 'status connected';
  } else {
    status.textContent = '✗ 未连接到 Parallax';
    status.className = 'status disconnected';
  }
}

// 单句翻译
translateBtn.addEventListener('click', async () => {
  const text = sourceText.value.trim();
  if (!text) {
    alert('请输入要翻译的文本');
    return;
  }

  translateBtn.disabled = true;
  translateBtn.textContent = '翻译中...';
  targetText.value = '';

  try {
    const result = await window.electronAPI.translate({
      text: text,
      fromLang: fromLang.value,
      toLang: toLang.value
    });

    if (result.success) {
      targetText.value = result.translatedText;
    } else {
      alert('翻译失败: ' + result.error);
    }
  } catch (error) {
    alert('翻译出错: ' + error.message);
  } finally {
    translateBtn.disabled = false;
    translateBtn.textContent = '翻译';
  }
});

// 清空
clearBtn.addEventListener('click', () => {
  sourceText.value = '';
  targetText.value = '';
});

// 交换语言
swapBtn.addEventListener('click', () => {
  const temp = fromLang.value;
  fromLang.value = toLang.value;
  toLang.value = temp;
  
  const tempText = sourceText.value;
  sourceText.value = targetText.value;
  targetText.value = tempText;
});

// 批量翻译
batchTranslateBtn.addEventListener('click', async () => {
  const texts = batchSource.value.split('\n').filter(t => t.trim());
  if (texts.length === 0) {
    alert('请输入要翻译的文本');
    return;
  }

  batchTranslateBtn.disabled = true;
  batchTranslateBtn.textContent = '翻译中...';
  batchTarget.value = '';

  try {
    const results = await window.electronAPI.translateBatch({
      texts: texts,
      fromLang: fromLang.value,
      toLang: toLang.value
    });

    const translated = results.map(r => r.translated).join('\n');
    batchTarget.value = translated;
  } catch (error) {
    alert('批量翻译失败: ' + error.message);
  } finally {
    batchTranslateBtn.disabled = false;
    batchTranslateBtn.textContent = '批量翻译';
  }
});

// 初始化
checkConnection();
setInterval(checkConnection, 30000); // 每30秒检查一次

