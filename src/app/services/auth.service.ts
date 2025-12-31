// core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { 
  User, 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest 
} from '../models/user.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) {
    // 初始化时检查本地存储的用户信息
    this.loadCurrentUser();
  }

  // 加载当前用户
  private loadCurrentUser(): void {
    const user = this.tokenService.getUser();
    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  // 登录
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          // 保存Token
          this.tokenService.saveToken(response.token);
          if (response.refreshToken) {
            this.tokenService.saveRefreshToken(response.refreshToken);
          }
          
          // 保存用户信息
          this.tokenService.saveUser(response.user);
          this.currentUserSubject.next(response.user);
          
          // 保存"记住我"状态
          if (credentials.rememberMe) {
            this.tokenService.saveRememberMe(true);
          }
        }),
        catchError(this.handleError)
      );
  }

  // 注册
  register(userData: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData)
      .pipe(
        catchError(this.handleError)
      );
  }

  // 注销
  logout(): void {
    // 调用后端注销接口（如果有的话）
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
      next: () => this.clearAuthData(),
      error: () => this.clearAuthData()
    });
  }

  // 清除认证数据
  private clearAuthData(): void {
    this.tokenService.clear();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // 刷新Token
  refreshToken(): Observable<LoginResponse> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<LoginResponse>(`${this.apiUrl}/refresh`, { refreshToken })
      .pipe(
        tap(response => {
          this.tokenService.saveToken(response.token);
          if (response.refreshToken) {
            this.tokenService.saveRefreshToken(response.refreshToken);
          }
        }),
        catchError(error => {
          this.clearAuthData();
          return throwError(() => error);
        })
      );
  }

  // 获取当前用户
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // 检查用户角色
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.roles.includes(role) : false;
  }

  // 检查是否有任一角色
  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    return roles.some(role => user.roles.includes(role));
  }

  // 更新用户信息
  updateUser(user: User): void {
    this.tokenService.saveUser(user);
    this.currentUserSubject.next(user);
  }

  // 错误处理
  private handleError(error: any): Observable<never> {
    let errorMessage = '发生未知错误';
    
    if (error.error instanceof ErrorEvent) {
      // 客户端错误
      errorMessage = error.error.message;
    } else {
      // 服务器错误
      switch (error.status) {
        case 400:
          errorMessage = '请求参数错误';
          break;
        case 401:
          errorMessage = '用户名或密码错误';
          break;
        case 403:
          errorMessage = '没有权限访问';
          break;
        case 404:
          errorMessage = '请求的资源不存在';
          break;
        case 500:
          errorMessage = '服务器内部错误';
          break;
        default:
          errorMessage = `错误代码: ${error.status}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }

}

// 辅助函数
function delay(ms: number): Observable<any> {
  return new Observable(subscriber => {
    const timer = setTimeout(() => {
      subscriber.next();
      subscriber.complete();
    }, ms);
    return () => clearTimeout(timer);
  });
}