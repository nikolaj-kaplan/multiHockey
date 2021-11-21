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
    var StatComponent;
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
            StatComponent = (function () {
                function StatComponent(_firebaseService, _router, _routeParams) {
                    this._firebaseService = _firebaseService;
                    this._router = _router;
                    this._routeParams = _routeParams;
                    this.dataLoaded = false;
                    this.weeks = 10;
                }
                StatComponent.prototype.ngOnInit = function () {
                    if (!this._firebaseService.club) {
                        this._router.navigate(["Login"]);
                        return;
                    }
                    this.load();
                };
                StatComponent.prototype.back = function () {
                    this._router.navigate(['Day']);
                };
                StatComponent.prototype.getDayStats = function () {
                    return this.transform(this.dayStats);
                };
                StatComponent.prototype.transform = function (value) {
                    return Object.keys(value).map(function (key) { return value[key]; });
                };
                StatComponent.prototype.load = function () {
                    var _this = this;
                    this._firebaseService.getAllMatches().then(function (matches) {
                        _this._firebaseService.getAllPlayers().then(function (players) {
                            _this.totalStats = new objects_1.Stats(matches, players);
                            _this.dayStats = Enumerable.From(matches).GroupBy(function (match) { return match.date; }).Select(function (group) { return new objects_1.Stats(group.source, players); }).ToArray();
                            _this.dataLoaded = true;
                        });
                    });
                };
                StatComponent.prototype.updateWeeks = function () {
                    this._firebaseService.weeks = this.weeks;
                    this.load();
                };
                StatComponent = __decorate([
                    core_1.Component({
                        selector: 'stat',
                        templateUrl: 'app/stat/stat.component.html',
                        styleUrls: ['app/stat/stat.component.css'],
                    }), 
                    __metadata('design:paramtypes', [firebase_service_1.FirebaseService, router_1.Router, router_2.RouteParams])
                ], StatComponent);
                return StatComponent;
            }());
            exports_1("StatComponent", StatComponent);
        }
    }
});
//# sourceMappingURL=stat.component.js.map