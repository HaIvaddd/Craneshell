/**
 * Craneshell Header Module
 * Управление хедером и навигацией на всех страницах
 */

import { isAuthenticated, getCurrentUser, logout } from './api.js';

export function initHeader() {
  const header = document.getElementById('header');
  const isAuth = isAuthenticated();
  const user = getCurrentUser();

  const navHTML = isAuth ? `
    <a href="/dashboard.html" style="color: var(--color-text-primary); text-decoration: none; padding: 8px 12px; border-radius: 6px; transition: all 0.3s;">Dashboard</a>
    <a href="/profile.html" style="color: var(--color-text-primary); text-decoration: none; padding: 8px 12px; border-radius: 6px; transition: all 0.3s;">${user?.username || 'Profile'}</a>
    <button onclick="location.href='/logout'" style="background: #c0152f; color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.3s;">Logout</button>
  ` : `
    <a href="/login.html" style="background: #2180a6; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-weight: 600; transition: all 0.3s;">Login</a>
  `;

  header.innerHTML = `
    <header style="background: var(--color-surface); border-bottom: 1px solid var(--color-border); padding: 16px 40px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; position: sticky; top: 0; z-index: 100;">
      <a href="/" style="font-size: 20px; font-weight: 600; text-decoration: none; color: var(--color-primary); display: flex; align-items: center; gap: 8px; white-space: nowrap;">
        🦌 Craneshell
      </a>
      <nav style="display: flex; gap: 20px; align-items: center; flex-wrap: wrap; justify-content: flex-end;">
        <a href="/public.html" style="color: var(--color-text-primary); text-decoration: none; transition: all 0.3s; hover: color: var(--color-primary);">🌍 Themes</a>
        <a href="/configurator.html" style="color: var(--color-text-primary); text-decoration: none; transition: all 0.3s; hover: color: var(--color-primary);">🎨 Create</a>
        ${navHTML}
      </nav>
    </header>
  `;
}

export function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = '/login.html';
  }
}

export function checkAuthAndRedirect() {
  if (isAuthenticated()) {
    window.location.href = '/dashboard.html';
  }
}
