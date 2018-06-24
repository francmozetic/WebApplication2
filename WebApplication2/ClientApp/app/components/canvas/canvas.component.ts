import { Component, Injectable, ViewChild, ElementRef, Input, AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { IntervalObservable } from "rxjs/observable/IntervalObservable";
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/never';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/timer';

import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/takeWhile';

class ApiData {
    constructor(public id: number, public name: string, public dataAll: string, public dataSpectrum: string, public isComplete: boolean) { }
}

@Injectable()
export class AudioDataService {

    constructor(private http: HttpClient) { }

    captureData(index: string): Observable<ApiData> {
        return this.http.get<ApiData>('/api/Todo/' + index);
    }
}

class StatusData {
    constructor(public id: number, public isLoading: boolean, public isComplete: boolean, public isPending: boolean) { }
}

@Injectable()
export class StatusService {

    constructor(private http: HttpClient) { }

    captureStatus(index: string): Observable<StatusData> {
        return this.http.get<StatusData>('/api/Status/' + index);
    }

    clearStatus(index: string): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
        return this.http.put('/api/Status/' + index, { "id": 1, "isLoading": false, "isComplete": false, "isPending": false }, httpOptions);
    }

    updateStatus(index: string): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
        return this.http.put('/api/Status/' + index, { "id": 1, "isLoading": false, "isComplete": false, "isPending": true }, httpOptions);
    }
}

@Component({
    selector: 'app-canvas',
    template: `
        <h1>Update and visualize audio data</h1>
        <blockquote><strong>ASP.NET Core 2.0 and Angular 5</strong>
            <br>{{loadingString}}{{" Click update to load new data. "}}<button (click)="updateAudio()">Update</button>{{" Click pause to stop - start the animation. "}}<button (click)="pauseAnimation()">Pause</button>
        </blockquote>
        <canvas #canvas1></canvas>
        <canvas #canvas2></canvas>
        `,
    styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements AfterViewInit {
    private capture: boolean = false;
    private buffer: Array<string> = [];
    private count: number = 0;
    private vrednost: number = 0;
    private index: number = 1;
    private isLoading: boolean = false;
    private isComplete: boolean = false;
    private isPaused: boolean = false;
    private loadingString: string = "Ready.";
    private pauser = new Subject();

    @ViewChild('canvas1') public canvas1: ElementRef;
    @ViewChild('canvas2') public canvas2: ElementRef;
    @Input() public width = 1500;
    @Input() public height = 500;

    private cx: CanvasRenderingContext2D;
    private ctx: CanvasRenderingContext2D;

    constructor(public iTunes: AudioDataService, public iStatus: StatusService) { }

    public updateAudio() {
        this.index = 1;
        let indexStr = String(this.index);
        this.iStatus.updateStatus(indexStr).subscribe(() => { });
    }

    public pauseAnimation() {
        if (this.isPaused) { this.pauser.next(false); this.isPaused = false; } else { this.pauser.next(true); this.isPaused = true; }
    }

    public ngAfterViewInit() {
        this.cx = this.canvas1.nativeElement.getContext('2d');
        this.canvas1.nativeElement.width = this.width;
        this.canvas1.nativeElement.height = this.height;
        this.canvas1.nativeElement.style.width = "750px";
        this.canvas1.nativeElement.style.height = "250px";
        this.cx.scale(2, 2);
        this.cx.lineWidth = 1;
        this.cx.lineCap = 'round';
        this.cx.strokeStyle = '#8B0000';

        this.ctx = this.canvas2.nativeElement.getContext('2d');
        this.canvas2.nativeElement.width = this.width;
        this.canvas2.nativeElement.height = this.height;
        this.canvas2.nativeElement.style.width = "750px";
        this.canvas2.nativeElement.style.height = "250px";
        this.ctx.scale(2, 2);
        this.ctx.lineWidth = 1;
        this.ctx.lineCap = 'round';
        this.ctx.strokeStyle = '#8B0000';

        let id = 1;
        let idStr = String(id);
        this.iStatus.clearStatus(idStr).subscribe(() => { });

        this.capture = true;
        this.index = 1;
        let indexStr = String(this.index);
        this.iTunes.captureData(indexStr)
            .subscribe(data => {
                let valuesStr = data.dataSpectrum;
                this.buffer = valuesStr.split(" ");
                this.buffer.shift();
                let countStr = this.buffer.shift();
                this.count = Number(countStr);
                this.buffer.shift();
                let vrednostStr = this.buffer.shift();
                this.vrednost = Number(vrednostStr);
                this.cx.beginPath();
                for (let i = 0; i < 100; i++) {
                    let x = i * 750 / 100;
                    let y = 250;
                    let width = 750 / 100 * 0.75;
                    let height = - this.vrednost * 250;
                    this.cx.fillRect(x, y, width, height);
                    let vrednostStr = this.buffer.shift();
                    this.vrednost = Number(vrednostStr);
                }
                this.cx.stroke();

                valuesStr = data.dataAll;
                this.buffer = valuesStr.split(" ");
                this.buffer.shift();
                countStr = this.buffer.shift();
                this.count = Number(countStr);
                this.buffer.shift();
                vrednostStr = this.buffer.shift();
                this.vrednost = Number(vrednostStr);
                this.ctx.beginPath();
                this.ctx.moveTo(0, 125 - this.vrednost * 125);
                for (let i = 1; i <= 2200; i++) {
                    let vrednostStr = this.buffer.shift();
                    this.vrednost = Number(vrednostStr);
                    this.ctx.lineTo(i * 750 / 2200, 125 - this.vrednost * 125);
                }
                this.ctx.stroke();
            });

        this.pauser.switchMap(paused => paused ? Observable.never() : IntervalObservable.create(1000))
            .subscribe(() => {
                this.index = this.index + 1;
                let indexStr = String(this.index);
                this.iTunes.captureData(indexStr)
                    .subscribe(data => {
                        let valuesStr = data.dataSpectrum;
                        this.buffer = valuesStr.split(" ");
                        this.buffer.shift();
                        let countStr = this.buffer.shift();
                        this.count = Number(countStr);
                        this.buffer.shift();
                        let vrednostStr = this.buffer.shift();
                        this.vrednost = Number(vrednostStr);
                        this.cx.clearRect(0, 0, 750, 250);
                        this.cx.beginPath();
                        for (let i = 0; i < 100; i++) {
                            let x = i * 750 / 100;
                            let y = 250;
                            let width = 750 / 100 * 0.75;
                            let height = - this.vrednost * 250;
                            this.cx.fillRect(x, y, width, height);
                            let vrednostStr = this.buffer.shift();
                            this.vrednost = Number(vrednostStr);
                        }
                        this.cx.stroke();

                        valuesStr = data.dataAll;
                        this.buffer = valuesStr.split(" ");
                        this.buffer.shift();
                        countStr = this.buffer.shift();
                        this.count = Number(countStr);
                        this.buffer.shift();
                        vrednostStr = this.buffer.shift();
                        this.vrednost = Number(vrednostStr);
                        this.ctx.clearRect(0, 0, 750, 250);
                        this.ctx.beginPath();
                        this.ctx.moveTo(0, 125 - this.vrednost * 125);
                        for (let i = 1; i <= 2200; i++) {
                            let vrednostStr = this.buffer.shift();
                            this.vrednost = Number(vrednostStr);
                            this.ctx.lineTo(i * 750 / 2200, 125 - this.vrednost * 125);
                        }
                        this.ctx.stroke();
                    });
                if (this.index == 40) this.index = 1;
            });

        this.pauser.next(false);

        TimerObservable.create(0, 100)
            .takeWhile(() => this.capture)
            .subscribe(() => {
                let id = 1;
                let idStr = String(id);
                this.iStatus.captureStatus(idStr)
                    .subscribe(data => {
                        this.isLoading = data.isLoading;
                        this.isComplete = data.isComplete;
                        if (this.isComplete == true) {
                            if (this.isLoading == true) this.loadingString = "Loading new data ..."; else this.loadingString = "New data loaded.";
                        }
                        else {
                            if (this.isLoading == true) this.loadingString = "Loading new data ..."; else this.loadingString = "Ready.";
                        }
                    });
            });

        /*
        IntervalObservable.create(1000)
            .takeWhile(() => this.capture)
            .takeUntil(Observable.fromEvent(this.canvas1.nativeElement, 'click'))
            .subscribe(() => {
                this.index = this.index + 1;
                let indexStr = String(this.index);
                this.iTunes.captureData(indexStr)
                    .subscribe(data => {
                        let valuesStr = data.dataSpectrum;
                        this.buffer = valuesStr.split(" ");
                        this.buffer.shift();
                        let countStr = this.buffer.shift();
                        this.count = Number(countStr);
                        this.buffer.shift();
                        let vrednostStr = this.buffer.shift();
                        this.vrednost = Number(vrednostStr);
                        this.cx.clearRect(0, 0, 750, 250);
                        this.cx.beginPath();
                        for (let i = 0; i < 100; i++) {
                            let x = i * 750 / 100;
                            let y = 250;
                            let width = 750 / 100 * 0.75;
                            let height = - this.vrednost * 250;
                            this.cx.fillRect(x, y, width, height);
                            let vrednostStr = this.buffer.shift();
                            this.vrednost = Number(vrednostStr);
                        }
                        this.cx.stroke();

                        valuesStr = data.dataAll;
                        this.buffer = valuesStr.split(" ");
                        this.buffer.shift();
                        countStr = this.buffer.shift();
                        this.count = Number(countStr);
                        this.buffer.shift();
                        vrednostStr = this.buffer.shift();
                        this.vrednost = Number(vrednostStr);
                        this.ctx.clearRect(0, 0, 750, 250);
                        this.ctx.beginPath();
                        this.ctx.moveTo(0, 125 - this.vrednost * 125);
                        for (let i = 1; i <= 2200; i++) {
                            let vrednostStr = this.buffer.shift();
                            this.vrednost = Number(vrednostStr);
                            this.ctx.lineTo(i * 750 / 2200, 125 - this.vrednost * 125);
                        }
                        this.ctx.stroke();
                    });
                if (this.index == 40) this.index = 1;
            });
            */
    }

    ngOnDestroy() {
        this.capture = false;
    }

    private captureMouseEvents(canvasElement: HTMLCanvasElement) {
        Observable
            .fromEvent(canvasElement, 'mousedown')
            .switchMap((e) => {
                return Observable
                    .fromEvent(canvasElement, 'mousemove')
                    .takeUntil(Observable.fromEvent(canvasElement, 'mouseup'))
                    .takeUntil(Observable.fromEvent(canvasElement, 'mouseleave'))
                    .pairwise()
            })
            .subscribe((res: [MouseEvent, MouseEvent]) => {
                const rect = canvasElement.getBoundingClientRect();

                const prevPos = {
                    x: res[0].clientX - rect.left,
                    y: res[0].clientY - rect.top
                };

                const currentPos = {
                    x: res[1].clientX - rect.left,
                    y: res[1].clientY - rect.top
                };

                this.cx.beginPath();

                if (prevPos) {
                    this.cx.moveTo(prevPos.x, prevPos.y);
                    this.cx.lineTo(currentPos.x, currentPos.y);
                    this.cx.stroke();
                }
            });
    }
}
