import { Component } from 'angular2/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from 'angular2/router';
import { FirebaseService } from './data/firebase.service';
import { StatComponent } from './stat/stat.component';
import { DayComponent } from './day/day.component';
import { MatchComponent } from './match/match.component';
import { LoginComponent } from './login/login.component';
import {Stat2Component} from './stat2/stat2.component';


@Component({
  selector: 'my-app',
  template: `
    <router-outlet></router-outlet>
  `,
  styleUrls: ['app/app.component.css'],
  directives: [ROUTER_DIRECTIVES],
  providers: [
    ROUTER_PROVIDERS,
    FirebaseService
  ]
})

@RouteConfig([
  {
    path: '/stat',
    name: 'Stat',
    component: StatComponent
  },
  {
    path: '/stat2',
    name: 'Stat2',
    component: Stat2Component
  },
  {
    path: '/',
    name: 'Day',
    component: DayComponent,
    useAsDefault: true
  },
  {
    path: '/match',
    name: 'Match',
    component: MatchComponent,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginComponent,
  }
])

export class AppComponent {
  title = 'Score board';
}
