import { Injectable, Inject } from '@angular/core';
import { catchError} from 'rxjs/operators';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {  Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class AddTtokenInterceptor implements HttpInterceptor {

  constructor(@Inject(Router) private router: Router) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token')
    if (token) {
      request = request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    }
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.router.navigate(['/usuarios'])
        }
        return throwError(() => new Error('Error'))
      })
    );
  }
}