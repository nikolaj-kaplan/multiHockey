System.register(['angular2/core', 'angular2/router', '../objects', '../data/firebase.service'], function(exports_1, context_1) {
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
    var core_1, router_1, router_2, objects_1, firebase_service_1;
    var Stat2Component;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
                router_2 = router_1_1;
            },
            function (objects_1_1) {
                objects_1 = objects_1_1;
            },
            function (firebase_service_1_1) {
                firebase_service_1 = firebase_service_1_1;
            }],
        execute: function() {
            Stat2Component = (function () {
                function Stat2Component(_firebaseService, _router, _routeParams) {
                    this._firebaseService = _firebaseService;
                    this._router = _router;
                    this._routeParams = _routeParams;
                    this.dataLoaded = false;
                    this.games = 30;
                }
                Stat2Component.prototype.ngOnInit = function () {
                    if (!this._firebaseService.club) {
                        this._router.navigate(["Login"]);
                        return;
                    }
                    this.loadStats();
                };
                Stat2Component.prototype.back = function () {
                    this._router.navigate(['Day']);
                };
                Stat2Component.prototype.getDayStats = function () {
                    return this.transform(this.dayStats);
                };
                Stat2Component.prototype.transform = function (value) {
                    return Object.keys(value).map(function (key) { return value[key]; });
                };
                Stat2Component.prototype.loadStats = function () {
                    var _this = this;
                    this._firebaseService.getAllMatches().then(function (matches) {
                        _this._firebaseService.getAllPlayers().then(function (players) {
                            _this.totalStats = new objects_1.Stats(matches, players);
                            _this.dataLoaded = true;
                        });
                    });
                };
                Stat2Component = __decorate([
                    core_1.Component({
                        selector: 'stat2',
                        templateUrl: 'app/stat2/stat2.component.html',
                        styleUrls: ['app/stat2/stat2.component.css'],
                    }), 
                    __metadata('design:paramtypes', [firebase_service_1.FirebaseService, router_1.Router, router_2.RouteParams])
                ], Stat2Component);
                return Stat2Component;
            }());
            exports_1("Stat2Component", Stat2Component);
        }
    }
});
//# sourceMappingURL=stat2.component.js.map