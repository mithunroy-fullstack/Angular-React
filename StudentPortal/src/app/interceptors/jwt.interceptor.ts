import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    console.log('🔥 JwtInterceptor executed');
    console.log('Request URL:', req.url);
    const token = localStorage.getItem('token');
    console.log('JWT Token:', token);
    if (token) {

      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('✅ Authorization header added');

    }

    return next.handle(req);
  }
}