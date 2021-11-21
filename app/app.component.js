System.register(['angular2/core', 'angular2/router', './data/firebase.service', './stat/stat.component', './day/day.component', './match/match.component', './login/login.component', './stat2/stat2.component'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, router_1, firebase_service_1, stat_component_1, day_component_1, match_component_1, login_component_1, stat2_component_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (firebase_service_1_1) {
                firebase_service_1 = firebase_service_1_1;
            },
            function (stat_component_1_1) {
                stat_component_1 = stat_component_1_1;
            },
            function (day_component_1_1) {
                day_component_1 = day_component_1_1;
            },
            function (match_component_1_1) {
                match_component_1 = match_component_1_1;
            },
            function (login_component_1_1) {
                login_component_1 = login_component_1_1;
            },
            function (stat2_component_1_1) {
                stat2_component_1 = stat2_component_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent() {
                    this.title = 'Score board';
                }
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'my-app',
                        template: "\n    <router-outlet></router-outlet>\n  ",
                        styleUrls: ['app/app.component.css'],
                        directives: [router_1.ROUTER_DIRECTIVES],
                        providers: [
                            router_1.ROUTER_PROVIDERS,
                            firebase_service_1.FirebaseService
                        ]
                    }),
                    router_1.RouteConfig([
                        {
                            path: '/stat',
                            name: 'Stat',
                            component: stat_component_1.StatComponent
                        },
                        {
                            path: '/stat2',
                            name: 'Stat2',
                            component: stat2_component_1.Stat2Component
                        },
                        {
                            path: '/',
                            name: 'Day',
                            component: day_component_1.DayComponent,
                            useAsDefault: true
                        },
                        {
                            path: '/match',
                            name: 'Match',
                            component: match_component_1.MatchComponent,
                        },
                        {
                            path: '/login',
                            name: 'Login',
                            component: login_component_1.LoginComponent,
                        }
                    ]), 
                    __metadata('design:paramtypes', [])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map