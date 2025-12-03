/**
 * Craneshell Init Module
 * Инициализация приложения на каждой странице
 */

import { initHeader } from './header.js';
import { checkHealth } from './api.js';
import { showError } from './utils.js';

/**
 * Инициализация всего приложения
 * Вызывай эту функцию в <script> тегах каждой страницы
 */
export async function initApp() {
    // 1. Инициализируй хедер
    try {
        initHeader();
    } catch (err) {
        console.error('Failed to init header:', err);
    }

    // 2. Проверь backend здоровье
    try {
        const health = await checkHealth();
        console.log('✅ Backend is healthy:', health);
    } catch (err) {
        console.warn('⚠️ Backend is not available:', err.message);
        // showError('Backend is not available. Some features may not work.');
    }

    // 3. Инициализируй темы (light/dark mode)
    initTheme();

    // 4. Инициализируй обработчики
    initEventHandlers();

    console.log('✅ App initialized successfully!');
}

/**
 * Инициализация темы (light/dark mode)
 */
export function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Проверь preference пользователя
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        if (!localStorage.getItem('theme')) {
            setTheme('dark');
        }
    }

    setTheme(savedTheme);
}

/**
 * Установи тему
 */
export function setTheme(theme) {
    const html = document.documentElement;
    
    if (theme === 'dark') {
        html.style.colorScheme = 'dark';
        document.body.style.background = '#1a1a1a';
    } else {
        html.style.colorScheme = 'light';
        document.body.style.background = '#fcfcf9';
    }

    localStorage.setItem('theme', theme);
}

/**
 * Глобальные обработчики событий
 */
export function initEventHandlers() {
    // Обработка Escape ключа для закрытия модалей
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal.active');
            modals.forEach(modal => {
                if (modal.id) {
                    window[`close${modal.id.charAt(0).toUpperCase() + modal.id.slice(1)}`]?.();
                }
            });
        }
    });

    // Обработка сетевых ошибок
    window.addEventListener('offline', () => {
        showError('You are offline. Please check your connection.');
    });

    window.addEventListener('online', () => {
        console.log('✅ You are back online!');
    });

    // Предотвращение двойного клика
    document.addEventListener('click', (e) => {
        const button = e.target.closest('button[data-prevent-double-click]');
        if (button) {
            button.disabled = true;
            setTimeout(() => {
                button.disabled = false;
            }, 1000);
        }
    });

    // Scroll to top smooth
    document.addEventListener('click', (e) => {
        if (e.target.closest('a[href="#top"]')) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

/**
 * Проверка авторизации
 */
export function checkAuthStatus() {
    const token = localStorage.getItem('token');
    return !!token;
}

/**
 * Получи информацию о странице
 */
export function getPageInfo() {
    const path = window.location.pathname;
    const pageName = path.split('/').pop() || 'index.html';
    
    return {
        path,
        pageName,
        isHomePage: path === '/' || pageName === 'index.html',
        isLoginPage: pageName === 'login.html',
        isDashboardPage: pageName === 'dashboard.html',
        isConfiguratorPage: pageName === 'configurator.html',
        isProfilePage: pageName === 'profile.html',
        isPublicPage: pageName === 'public.html'
    };
}

/**
 * Инициализация страницы конфигуратора (специальная)
 */
export function initConfiguratorPage() {
    // Создай контейнеры для цветов если их нет
    const colorsGrid = document.querySelector('.colors-grid');
    if (colorsGrid && colorsGrid.children.length === 0) {
        console.warn('Colors grid is empty, rendering colors...');
    }

    // Инициализируй превью
    updateColorPreviews();
}

/**
 * Обнови превью цветов
 */
export function updateColorPreviews() {
    const colors = [];
    for (let i = 0; i < 16; i++) {
        const input = document.getElementById('color' + i);
        if (input) {
            colors.push(input.value);
        }
    }

    // Обнови preview коробки
    for (let i = 0; i < 4; i++) {
        const preview = document.getElementById('prev' + i);
        if (preview && colors[i]) {
            preview.style.background = colors[i];
        }
    }

    // Обнови терминал
    const terminal = document.getElementById('terminalContent');
    if (terminal) {
        const bgInput = document.getElementById('background');
        const fgInput = document.getElementById('foreground');
        
        if (bgInput && fgInput) {
            terminal.style.backgroundColor = bgInput.value;
            terminal.style.color = fgInput.value;
        }
    }
}

/**
 * Инициализация dashboard page (специальная)
 */
export function initDashboardPage() {
    // Инициализируй search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            // Вызови renderConfigs
            if (window.renderConfigs) {
                window.renderConfigs();
            }
        }, 300));
    }
}

/**
 * Debounce функция
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle функция
 */
export function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Проверка поддержки браузера
 */
export function checkBrowserSupport() {
    const features = {
        localStorage: typeof Storage !== 'undefined',
        fetch: typeof fetch !== 'undefined',
        promise: typeof Promise !== 'undefined',
        async: true, // ES6+ async/await
        modules: true, // ES6 modules
    };

    if (!features.localStorage) {
        console.error('LocalStorage is not supported!');
    }

    if (!features.fetch) {
        console.error('Fetch API is not supported!');
    }

    return features;
}

/**
 * Инициализируй analytics (если нужно)
 */
export function initAnalytics() {
    // Отправь page view
    const pageInfo = getPageInfo();
    console.log('📊 Page view:', pageInfo.pageName);
    
    // Здесь можешь добавить Google Analytics, Sentry и т.д.
}

/**
 * Инициализируй error boundary
 */
export function initErrorBoundary() {
    window.addEventListener('error', (event) => {
        console.error('❌ Global error:', event.error);
        // showError('An error occurred. Please refresh the page.');
    });

    window.addEventListener('unhandledrejection', (event) => {
        console.error('❌ Unhandled promise rejection:', event.reason);
        // showError('An error occurred. Please refresh the page.');
    });
}

/**
 * Логирование в консоль (только в dev режиме)
 */
export function setupLogging() {
    const isDev = localStorage.getItem('debug') === 'true';

    if (isDev) {
        window.log = {
            info: (msg, data) => console.log('ℹ️', msg, data),
            warn: (msg, data) => console.warn('⚠️', msg, data),
            error: (msg, data) => console.error('❌', msg, data),
            success: (msg, data) => console.log('✅', msg, data),
        };
    } else {
        window.log = {
            info: () => {},
            warn: () => {},
            error: () => {},
            success: () => {},
        };
    }
}

/**
 * Инициализируй service worker (для offline support)
 */
export async function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            // await navigator.serviceWorker.register('/sw.js');
            console.log('✅ Service Worker registered');
        } catch (err) {
            console.warn('⚠️ Service Worker registration failed:', err);
        }
    }
}

/**
 * Основная инициализация
 * Вызывай эту функцию в конце каждой страницы
 */
export async function initPage() {
    try {
        // Проверка поддержки браузера
        checkBrowserSupport();

        // Инициализация основного приложения
        await initApp();

        // Инициализация error boundary
        initErrorBoundary();

        // Setup logging
        setupLogging();

        // Инициализация analytics
        initAnalytics();

        // Service Worker (опционально)
        // await initServiceWorker();

        // Специальная инициализация для разных страниц
        const pageInfo = getPageInfo();
        if (pageInfo.isConfiguratorPage) {
            initConfiguratorPage();
        } else if (pageInfo.isDashboardPage) {
            initDashboardPage();
        }

        console.log('✅ Page fully initialized!');
    } catch (err) {
        console.error('❌ Failed to initialize page:', err);
    }
}

/**
 * Экспортируй для использования в глобальной области
 */
if (typeof window !== 'undefined') {
    window.CraneshellInit = {
        initApp,
        initPage,
        initTheme,
        setTheme,
        getPageInfo,
        checkAuthStatus,
        debounce,
        throttle,
        checkBrowserSupport,
        setupLogging,
    };
}

console.log('✅ Init module loaded!');
