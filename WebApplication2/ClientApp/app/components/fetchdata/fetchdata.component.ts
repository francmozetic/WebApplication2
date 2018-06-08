import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'fetchdata',
    templateUrl: './fetchdata.component.html',
    styleUrls: ['./fetchdata.component.css']
})
export class FetchDataComponent {
    public data: ApiData | undefined;
    //public data: UserResponse | undefined;
    //public forecasts: WeatherForecast[] | undefined;

    constructor(httpClient: HttpClient, @Inject('BASE_URL') baseUrl: string) {
        httpClient.get<ApiData>(baseUrl + 'api/Todo/21').subscribe(result => {
                this.data = result;
            }, error => console.error(error));

        /*httpClient.get<UserResponse>('https://api.github.com/users/seeschweiler').subscribe(result => {
            this.data = result;
        }, error => console.error(error));*/

        /*httpClient.get<WeatherForecast[]>(baseUrl + 'api/SampleData/WeatherForecasts').subscribe(result => {
            this.forecasts = result;
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

interface WeatherForecast {
    dateFormatted: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
}
