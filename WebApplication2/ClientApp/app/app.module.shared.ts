import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './components/app/app.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent, AuthGuardService } from './components/home/home.component';
import { FetchDataComponent } from './components/fetchdata/fetchdata.component';
import { CanvasComponent, AudioDataService, StatusService } from './components/canvas/canvas.component';
import { LoginComponent, AuthenticationService } from './components/login/login.component';

import { FakeBackendInterceptor } from './components/helpers/backend.interceptor';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        NavMenuComponent,
        FetchDataComponent,
        CanvasComponent,
        LoginComponent
    ],
    imports: [
        CommonModule,
        HttpModule,
        HttpClientModule,
        FormsModule,
        RouterModule.forRoot([
            { path: '', component: HomeComponent, canActivate: [AuthGuardService] },
            { path: 'home', component: HomeComponent, canActivate: [AuthGuardService] },
            { path: 'fetch-data', component: FetchDataComponent, canActivate: [AuthGuardService] },
            { path: 'update', component: CanvasComponent, canActivate: [AuthGuardService] },
            { path: 'login', component: LoginComponent },
            { path: '**', redirectTo: '' }
        ])
    ],
    providers: [
        AudioDataService,
        StatusService,
        AuthGuardService,
        AuthenticationService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: FakeBackendInterceptor,
            multi: true
        }
    ]
})
export class AppModuleShared {
}
