import { Component, Injectable, ViewChild, ElementRef, Input, AfterViewInit } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { IntervalObservable } from "rxjs/observable/IntervalObservable";
import { Subject } from 'rxjs/Subject';

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

class ApiData {
    constructor(public id: number, public name: string, public dataAll: string, public dataSpectrum: string, public isComplete: boolean) { }
}

@Injectable()
export class DataService {

    constructor(private http: HttpClient) { }

    captureData(index: string): Observable<ApiData> {
        return this.http.get<ApiData>('/api/Todo/' + index);
    }
}

@Component({
    selector: 'home',
    template: `
        <h1>Home</h1>
        <blockquote>
            <strong>ASP.NET Core 2.0 and Angular 5</strong>
            <br>{{" Click pause to stop - start the animation. "}}<button (click)="pauseAnimation()">Pause</button>
        </blockquote>
        <canvas #canvas10></canvas>
        `,
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {
    private capture: boolean = false;
    private index: number = 1;
    private buffer: Array<string> = [];
    private bufferSaved: Array<string> = [];
    private isPaused: boolean = false;
    private pauser = new Subject();
    private offset: number = 0;
    private vrednost: number = 0;

    @ViewChild('canvas10') public canvas10: ElementRef;
    @Input() public width = 1500;
    @Input() public height = 500;

    private ctx: CanvasRenderingContext2D;

    constructor(public iTunes: DataService) { }

    public pauseAnimation() {
        if (this.isPaused) { this.pauser.next(false); this.isPaused = false; } else { this.pauser.next(true); this.isPaused = true; }
    }

    public ngAfterViewInit() {
        // after creating a component, Angular calls the ngAfterViewInit() lifecycle hook method
        this.ctx = this.canvas10.nativeElement.getContext('2d');
        this.canvas10.nativeElement.width = this.width;
        this.canvas10.nativeElement.height = this.height;
        this.canvas10.nativeElement.style.width = "750px";
        this.canvas10.nativeElement.style.height = "250px";
        this.ctx.scale(2, 2);
        this.ctx.lineWidth = 1;
        this.ctx.lineCap = 'round';
        this.ctx.strokeStyle = '#8B0000';

        this.capture = true;
        this.index = 1;
        while (this.index <= 40) {
            let indexStr = String(this.index);
            this.iTunes.captureData(indexStr)
                .subscribe(data => {
                    let valuesStr = data.dataAll;
                    this.buffer = valuesStr.split(" ");
                    this.buffer.shift();  
                    this.buffer.shift();
                    // pop the last samples from the bufferSaved array
                    this.buffer.pop();
                    this.bufferSaved = this.bufferSaved.concat(this.buffer);
                });
            this.index = this.index + 1;
        }

        this.pauser.switchMap(paused => paused ? Observable.never() : IntervalObservable.create(150))
            .subscribe(() => {
                this.offset = this.offset + 100;
                let vrednostStr = this.bufferSaved[this.offset];
                this.vrednost = Number(vrednostStr);
                this.ctx.clearRect(0, 0, 750, 250);
                this.ctx.beginPath();
                this.ctx.moveTo(0, 125 - this.vrednost * 125);
                for (let i = 1; i <= 8800; i++) {
                    let vrednostStr = this.bufferSaved[this.offset + i];
                    this.vrednost = Number(vrednostStr);
                    this.ctx.lineTo(i * 750 / 8800, 125 - this.vrednost * 125);
                }
                this.ctx.stroke();
                if (this.offset == 89000) this.offset = 0;
            });

        this.pauser.next(false);
    }

    ngOnDestroy() {
        this.capture = false;
    }
}
