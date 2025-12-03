/**
 * Craneshell Utils Module
 * Вспомогательные функции
 */

// Форматирование цвета RGB в HEX
export function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Парсинг HEX в RGB
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Генерирование Random color
export function generateRandomColor() {
  return "#" + Math.floor(Math.random()*16777215).toString(16);
}

// Форматирование даты
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Показ error notification
export function showError(message) {
  const notification = document.createElement('div');
  notification.className = 'notification notification-error';
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 5000);
}

// Показ success notification
export function showSuccess(message) {
  const notification = document.createElement('div');
  notification.className = 'notification notification-success';
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 5000);
}

// Проверка авторизации и редирект
export function requireAuth() {
  const isAuth = !!localStorage.getItem('token');
  if (!isAuth) {
    window.location.href = '/login.html';
  }
}

// Скачивание файла
export function downloadFile(content, filename) {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

// Копирование в буфер обмена
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showSuccess('Скопировано в буфер обмена!');
  } catch (err) {
    showError('Ошибка при копировании');
  }
}

// Генерирование конфига Kitty
export function generateKittyConfig(configData) {
  return `# Craneshell - Kitty Terminal Configuration
# Theme: ${configData.name || 'My Theme'}
# Generated on ${new Date().toLocaleString('ru-RU')}

# ===== COLORS =====
color0  ${configData.color0}
color1  ${configData.color1}
color2  ${configData.color2}
color3  ${configData.color3}
color4  ${configData.color4}
color5  ${configData.color5}
color6  ${configData.color6}
color7  ${configData.color7}
color8  ${configData.color8}
color9  ${configData.color9}
color10 ${configData.color10}
color11 ${configData.color11}
color12 ${configData.color12}
color13 ${configData.color13}
color14 ${configData.color14}
color15 ${configData.color15}

# ===== FOREGROUND & BACKGROUND =====
foreground          ${configData.foreground || '#d3d7cf'}
background          ${configData.background || '#000000'}
selection_background ${configData.selection_background || '#3465a4'}

# ===== OPACITY =====
background_opacity ${configData.opacity || 0.9}

# ===== CURSOR =====
cursor_shape block
cursor_blink_interval 0

# ===== FONT =====
font_family      monospace
font_size        12
bold_font_style  bold

# ===== MISC =====
scrollback_lines 2000
enable_layouts   tall,stack,grid
`;
}
