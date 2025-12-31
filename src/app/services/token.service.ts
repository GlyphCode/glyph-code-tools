// core/services/token.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user_data';
  private readonly REMEMBER_ME_KEY = 'remember_me';

  constructor() { }

  // 保存Token
  saveToken(token: string): void {
    if (this.getRememberMe()) {
      localStorage.setItem(this.TOKEN_KEY, token);
    } else {
      sessionStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  // 获取Token
  getToken(): string | null {
    if (this.getRememberMe()) {
      return localStorage.getItem(this.TOKEN_KEY);
    } else {
      return sessionStorage.getItem(this.TOKEN_KEY) || 
             localStorage.getItem(this.TOKEN_KEY);
    }
  }

  // 删除Token
  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
  }

  // 保存刷新Token
  saveRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  // 获取刷新Token
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  // 删除刷新Token
  removeRefreshToken(): void {
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  // 保存用户信息
  saveUser(user: any): void {
    const userData = JSON.stringify(user);
    if (this.getRememberMe()) {
      localStorage.setItem(this.USER_KEY, userData);
    } else {
      sessionStorage.setItem(this.USER_KEY, userData);
    }
  }

  // 获取用户信息
  getUser(): any {
    const userData = sessionStorage.getItem(this.USER_KEY) || 
                     localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  // 删除用户信息
  removeUser(): void {
    localStorage.removeItem(this.USER_KEY);
    sessionStorage.removeItem(this.USER_KEY);
  }

  // 保存"记住我"状态
  saveRememberMe(remember: boolean): void {
    localStorage.setItem(this.REMEMBER_ME_KEY, remember.toString());
  }

  // 获取"记住我"状态
  getRememberMe(): boolean {
    const remember = localStorage.getItem(this.REMEMBER_ME_KEY);
    return remember === 'true';
  }

  // 清除所有认证数据
  clear(): void {
    this.removeToken();
    this.removeRefreshToken();
    this.removeUser();
    localStorage.removeItem(this.REMEMBER_ME_KEY);
  }

  // 检查是否已登录
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}