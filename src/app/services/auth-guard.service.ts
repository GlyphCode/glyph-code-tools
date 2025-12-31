// core/services/auth-guard.service.ts
import { Injectable } from '@angular/core';
import { 
  Router, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  CanActivate, 
  CanActivateChild,
  CanLoad,
  UrlTree,
  Route,
  UrlSegment 
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  // 路由激活守卫
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkAuth(route, state.url);
  }

  // 子路由守卫
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(childRoute, state);
  }

  // 懒加载守卫
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const url = segments.map(s => s.path).join('/');
    return this.checkAuth(undefined, url);
  }

  // 检查认证
  private checkAuth(
    route?: ActivatedRouteSnapshot,
    url?: string
  ): Observable<boolean | UrlTree> | boolean | UrlTree {
    
    // 检查是否已登录
    if (!this.tokenService.isLoggedIn()) {
      return this.redirectToLogin(url);
    }

    // 检查路由数据中的角色要求
    if (route?.data?.['roles']) {
      const requiredRoles = route.data['roles'] as string[];
      const user = this.authService.getCurrentUser();
      
      if (!user || !this.authService.hasAnyRole(requiredRoles)) {
        // 角色不足，重定向到无权限页面
        return this.router.createUrlTree(['/unauthorized']);
      }
    }

    return true;
  }

  // 重定向到登录页
  private redirectToLogin(url?: string): UrlTree {
    // 保存目标URL，登录后可以跳转回来
    if (url && url !== '/login') {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: url } 
      });
    } else {
      this.router.navigate(['/login']);
    }
    return this.router.createUrlTree(['/login']);
  }
}

// 登录页守卫（已登录用户不能访问登录页）
@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  
  constructor(
    private tokenService: TokenService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    if (this.tokenService.isLoggedIn()) {
      // 已登录用户访问登录页，重定向到首页
      return this.router.createUrlTree(['/main']);
    }
    return true;
  }
}