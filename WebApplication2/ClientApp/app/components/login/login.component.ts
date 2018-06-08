import { Component, OnInit, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/first';

@Injectable()
export class AuthenticationService {

    constructor(private http: HttpClient) { }

    login(username: string, password: string) {
        return this.http.post<any>('/api/authenticate', { username: username, password: password })
            .map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }

                return user;
            });
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}

@Component({
    selector: 'login',
    template: `
        <h1>Login</h1>
        <blockquote>
            <strong>ASP.NET Core 2.0 and Angular 5</strong>
            <br>
                <label for="username">Username</label>
                <input type="text" name="username" [(ngModel)]="model.username" #username="ngModel" required />
                <label for="password">Password</label>
                <input type="password" name="password" [(ngModel)]="model.password" #password="ngModel" required />
                <button (click)="login()">Login</button>
        </blockquote>
        `,
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    returnUrl: string = '';
    error = '';

    constructor(private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService) { }

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    login() {
        this.loading = true;
        this.authenticationService.login(this.model.username, this.model.password)
            .first()
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.error = error;
                    this.loading = false;
                });
    }
}
