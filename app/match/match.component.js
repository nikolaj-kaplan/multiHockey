System.register(['angular2/core', 'angular2/router', '../data/firebase.service'], function(exports_1, context_1) {
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
    var core_1, router_1, router_2, firebase_service_1;
    var MatchComponent, StateObject;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
                router_2 = router_1_1;
            },
            function (firebase_service_1_1) {
                firebase_service_1 = firebase_service_1_1;
            }],
        execute: function() {
            MatchComponent = (function () {
                function MatchComponent(_firebaseService, _router, _routeParams) {
                    this._firebaseService = _firebaseService;
                    this._router = _router;
                    this._routeParams = _routeParams;
                    this.stateObject = new StateObject();
                    this.swapped = false;
                }
                Object.defineProperty(MatchComponent.prototype, "teamL", {
                    get: function () {
                        if (!this.match)
                            return [];
                        if (this.swapped)
                            return this.match.team2;
                        else
                            return this.match.team1;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MatchComponent.prototype, "teamR", {
                    get: function () {
                        if (!this.match)
                            return [];
                        if (this.swapped)
                            return this.match.team1;
                        else
                            return this.match.team2;
                    },
                    enumerable: true,
                    configurable: true
                });
                MatchComponent.prototype.ngOnInit = function () {
                    if (!this._firebaseService.club) {
                        this._router.navigate(["Login"]);
                        return;
                    }
                    var promise = this._firebaseService.getCurrentMatch();
                    var this1 = this;
                    promise.then(function (match) {
                        this1.match = match;
                        this1.countGoals();
                        this1._firebaseService.addCallback(this1.match, function (matchRef) {
                            var callbackMatch = matchRef.val();
                            if (callbackMatch) {
                                match.eat(callbackMatch);
                                this1.countGoals();
                            }
                        });
                    });
                    return promise;
                };
                MatchComponent.prototype.countGoals = function () {
                    var _this = this;
                    this.teamLScore = 0;
                    this.teamRScore = 0;
                    if (this.match) {
                        this.match.goals.forEach(function (player) { return _this.updateScore(player); });
                    }
                };
                MatchComponent.prototype.getScore = function (player) {
                    if (!this.match)
                        return 0;
                    return this.match.goals.filter(function (p) { return p === player; }).length;
                };
                MatchComponent.prototype.toggleGoalOrAssist = function (player) {
                    if (!this.stateObject.goalScorer || player == this.stateObject.goalScorer) {
                        this.toggleGoal(player);
                    }
                    else {
                        this.toggleAssist(player);
                    }
                };
                MatchComponent.prototype.toggleGoal = function (player) {
                    if (this.stateObject.goalScorer == player) {
                        player = null;
                    }
                    this.stateObject.goalScorer = player;
                    if (player == null) {
                        this.match.goals.pop();
                        this.stateObject.state = this.stateObject.addingScorer;
                    }
                    else {
                        this.match.goals.push(player);
                        this.stateObject.state = this.stateObject.addingAssist;
                    }
                    this._firebaseService.updateMatchGoals(this.match);
                };
                MatchComponent.prototype.removeLastGoal = function () {
                    this.match.goals.splice(this.match.goals.length - 1, 1);
                    this._firebaseService.updateMatchGoals(this.match);
                };
                MatchComponent.prototype.updateScore = function (player) {
                    if (this.match.team1.indexOf(player) > -1) {
                        if (!this.swapped)
                            this.teamLScore++;
                        else
                            this.teamRScore++;
                    }
                    else {
                        if (this.swapped)
                            this.teamLScore++;
                        else
                            this.teamRScore++;
                    }
                };
                MatchComponent.prototype.newMatch = function () {
                    this._router.navigate(['Day']);
                };
                MatchComponent.prototype.swap = function () {
                    this.swapped = !this.swapped;
                    this.countGoals();
                };
                MatchComponent.prototype.deleteGame = function () {
                    var _this = this;
                    if (confirm("Vil du slette denne kamp?")) {
                        if (confirm("Er du helt sikker??")) {
                            this._firebaseService.deleteCurrentMatch().then(function () { return _this._router.navigate(['Day']); });
                        }
                    }
                };
                MatchComponent.prototype.startAddGoal = function (team) {
                    this.stateObject.start(team);
                };
                MatchComponent.prototype.cancel = function () {
                    this.stateObject.stop();
                };
                MatchComponent.prototype.toggleAssist = function (player) {
                    if (player == "noAssist") {
                        if (this.stateObject.assist == "noAssist") {
                            this.stateObject.assist = null;
                        }
                        else {
                            this.stateObject.assist = "noAssist";
                        }
                        return;
                    }
                    if (this.stateObject.assist == player) {
                        this.match.assists.pop();
                        this.stateObject.assist = null;
                    }
                    else {
                        this.match.assists.push(player);
                        this.stateObject.assist = player;
                    }
                    this._firebaseService.updateMatchAssists(this.match);
                };
                MatchComponent.prototype.stopCounting = function () {
                    this.stateObject.countdown = -1;
                };
                MatchComponent = __decorate([
                    core_1.Component({
                        selector: 'match',
                        templateUrl: 'app/match/match.component.html',
                        styleUrls: ['app/match/match.component.css']
                    }), 
                    __metadata('design:paramtypes', [firebase_service_1.FirebaseService, router_1.Router, router_2.RouteParams])
                ], MatchComponent);
                return MatchComponent;
            }());
            exports_1("MatchComponent", MatchComponent);
            StateObject = (function () {
                function StateObject() {
                    this.readonly = addingScorer = "addingScorer";
                    this.readonly = addingAssist = "addingAssist";
                }
                Object.defineProperty(StateObject.prototype, "firstHalf", {
                    get: function () {
                        var arr = this.team;
                        var halfwayThrough = Math.ceil((arr.length + 1) / 2);
                        return arr.slice(0, halfwayThrough);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(StateObject.prototype, "secondHalf", {
                    get: function () {
                        var arr = this.team;
                        var halfwayThrough = Math.ceil((arr.length + 1) / 2);
                        return arr.slice(halfwayThrough, arr.length);
                    },
                    enumerable: true,
                    configurable: true
                });
                StateObject.prototype.start = function (team) {
                    this.team = team;
                    this.state = this.addingScorer;
                    this.countdown = 60;
                    this.checkAutoClose();
                };
                StateObject.prototype.stop = function () {
                    this.team = null;
                    this.state = null;
                    this.goalScorer = null;
                    this.assist = null;
                    this.countdown = null;
                };
                StateObject.prototype.checkAutoClose = function () {
                    console.log("checking", this.countdown);
                    if (this.countdown == null)
                        return;
                    if (this.goalScorer && this.assist && this.countdown > 1) {
                        this.countdown = 1;
                    }
                    else if (this.goalScorer && !this.assist && this.countdown > 10) {
                        this.countdown = 10;
                    }
                    else if (this.countdown == 0) {
                        this.stop();
                        return;
                    }
                    this.countdown--;
                    var this1 = this;
                    setTimeout(function () { return this1.checkAutoClose(); }, 1000);
                };
                return StateObject;
            }());
        }
    }
});
//# sourceMappingURL=match.component.js.map