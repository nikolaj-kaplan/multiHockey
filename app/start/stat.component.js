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
                }
                StatComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    if (!this._firebaseService.club) {
                        this._router.navigate(["Login"]);
                        return;
                    }
                    this._firebaseService.getAllMatches()
                        .then(function (matches) {
                        _this.matches = matches;
                        _this._firebaseService.getAllPlayers()
                            .then(function (players) {
                            _this.players = players.map(function (p) {
                                return new objects_1.Player(p);
                            });
                            _this.calculateStats();
                            _this.players = Enumerable.From(_this.players).OrderBy(function (p) { return -p.winsPercentage; }).ToArray();
                        });
                    });
                };
                StatComponent.prototype.calculateStats = function () {
                    var _this = this;
                    // calculate wins
                    var winnerNames = [];
                    this.matches.forEach(function (m) {
                        winnerNames = winnerNames.concat(_this.getWinnerNames(m));
                    });
                    var winnerCount = Enumerable.From(winnerNames).GroupBy(function (winnerNames) { return winnerNames; }).Select(function (group) { return ({ name: group.Key(), wins: group.source.length }); });
                    this.players.forEach(function (p) {
                        var winsObject = winnerCount.FirstOrDefault(undefined, function (x) { return x.name === p.name; });
                        if (winsObject) {
                            p.wins = winsObject.wins;
                        }
                    });
                    //calculate goals
                    var goalCount = Enumerable.From(this.matches).SelectMany(function (x) { return x.goals; }).GroupBy(function (name) { return name; }).Select(function (group) { return ({ name: group.Key(), goals: group.source.length }); });
                    this.players.forEach(function (p) {
                        var goalsObject = goalCount.FirstOrDefault(undefined, function (x) { return x.name === p.name; });
                        if (goalsObject) {
                            p.goals = goalsObject.goals;
                        }
                    });
                    //calculate matches
                    this.matches.forEach(function (m) {
                        var team1AndTeam2 = m.team1.concat(m.team2);
                        _this.players.forEach(function (p) {
                            if (team1AndTeam2.indexOf(p.name) > -1)
                                p.matches++;
                        });
                    });
                };
                StatComponent.prototype.getWinnerNames = function (match) {
                    if (!match.goals)
                        return [];
                    var team1Score = 0;
                    var team2Score = 0;
                    match.goals.forEach(function (name) {
                        if (match.team1.indexOf(name) > -1)
                            team1Score++;
                        else
                            team2Score++;
                    });
                    if (team1Score == team2Score)
                        return [];
                    if (team1Score > team2Score)
                        return match.team1;
                    else
                        return match.team2;
                };
                StatComponent.prototype.back = function () {
                    this._router.navigate(['Day']);
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