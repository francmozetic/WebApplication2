import { Component, Injectable, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

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

@Component({
    selector: 'fetchdata',
    template: `
        <h1>Fetch audio data</h1>
        <blockquote><strong>ASP.NET Core 2.0 and Angular 5</strong>
            <br>{{" Click update to fetch new data. "}}<button (click)="updateAudio()">Update</button>
        </blockquote>
        <p *ngIf="!data"><em>Loading...</em></p>
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
export class FetchDataComponent {
    public data: ApiData | undefined;
    //public data: UserResponse | undefined;

    constructor(httpClient: HttpClient, @Inject('BASE_URL') baseUrl: string) {
        httpClient.get<ApiData>(baseUrl + 'api/Todo/21').subscribe(result => {
            this.data = result;
        }, error => console.error(error));

        /*httpClient.get<UserResponse>('https://api.github.com/users/seeschweiler').subscribe(result => {
            this.data = result;
        }, error => console.error(error));*/
    }
}

interface ApiData {
    id: number;
    name: string;
    dataAll: string;
    dataSpectrum: string;
    isComplete: boolean;
}

interface UserResponse {
    login: string;
    bio: string;
    company: string;
}
