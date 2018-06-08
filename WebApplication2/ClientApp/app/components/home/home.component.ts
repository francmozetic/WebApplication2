import { Component, Injectable, OnInit } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (localStorage.getItem('currentUser')) {
            // logged in so return true
            return true;
        }
        else {
            // not logged in so redirect to login page
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            return false;
        }
    }
}

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        /*const userJson = localStorage.getItem('currentUser');
        let currentUser = userJson !== null ? JSON.parse(userJson) : new User();*/
        if (currentUser && currentUser.token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.token}`
                }
            });
        }

        return next.handle(request);
    }
}

@Component({
    selector: 'home',
    template: `
        <h1>Home</h1>
        <blockquote>
            <strong>ASP.NET Core 2.0 and Angular 5</strong>
            <br>
                <label for="username">Username</label>
                <input type="text" name="username" [(ngModel)]="model.username" #username="ngModel" required />
                <label for="password">Password</label>
                <input type="password" name="password" [(ngModel)]="model.password" #password="ngModel" required />
                <button (click)="login()">Login</button>
            <br>
                {{loadingStr}}
        </blockquote>
        `,
    styleUrls: ['./home.component.css']
})
export class HomeComponent {
}
