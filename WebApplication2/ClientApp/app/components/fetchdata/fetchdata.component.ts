import { Component, Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

class ApiData {
    constructor(public id: number, public name: string, public dataAll: string, public dataSpectrum: string, public isComplete: boolean) { }
}

@Injectable()
export class FetchDataService {

    constructor(private http: HttpClient) { }

    fetchData(index: string): Observable<ApiData> {
        return this.http.get<ApiData>('/api/Todo/' + index);
    }
}

@Component({
    selector: 'fetchdata',
    template: `
        <h1>Fetch audio data</h1>
        <blockquote><strong>ASP.NET Core 2.0 and Angular 5</strong>
            <br>{{" Click next to fetch audio data. "}}<button (click)="fetchPrevious()">Previous</button>{{" "}}<button (click)="fetchNext()">Next</button>
        </blockquote>
        <table class='table' *ngIf="data">
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>DataAll</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{ data.id }}</td>
                    <td>{{ data.name }}</td>
                    <td>{{ data.dataAll }}</td>
                </tr>
            </tbody>
        </table>
        <table class='table' *ngIf="data">
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>DataSpectrum</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{ data.id }}</td>
                    <td>{{ data.name }}</td>
                    <td>{{ data.dataSpectrum }}</td>
                </tr>
            </tbody>
        </table>
        `,
    styleUrls: ['./fetchdata.component.css']
})
export class FetchDataComponent implements OnInit {
    private index: number = 1;
    public data: ApiData | undefined;

    constructor(private iTunes: FetchDataService) { }

    /* previous constructor
    public data: UserResponse | undefined;
    
    constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
        http.get<ApiData>(baseUrl + 'api/Todo/1').subscribe(result => {
            this.data = result;
        }, error => console.error(error));

        http.get<UserResponse>('https://api.github.com/users/seeschweiler').subscribe(result => {
            this.data = result;
        }, error => console.error(error));
    }
    */

    public fetchNext() {
        if (this.index < 40) {
            this.index = this.index + 1;
            let indexStr = String(this.index);
            this.iTunes.fetchData(indexStr)
                .subscribe(result => {
                    this.data = result;
                });
        }
    }

    public fetchPrevious() {
        if (this.index > 1) {
            this.index = this.index - 1;
            let indexStr = String(this.index);
            this.iTunes.fetchData(indexStr)
                .subscribe(result => {
                    this.data = result;
                });
        }
    }

    public ngOnInit() {
        this.index = 1;
        let indexStr = String(this.index);
        this.iTunes.fetchData(indexStr)
            .subscribe(result => {
                this.data = result;
        });
    }
}

/* interfaces
interface ApiData { id: number; name: string; dataAll: string; dataSpectrum: string; isComplete: boolean; }
interface UserResponse { login: string; bio: string; company: string; }
*/