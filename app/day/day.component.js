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
    var core_1, router_1, objects_1, firebase_service_1;
    var DayComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (objects_1_1) {
                objects_1 = objects_1_1;
            },
            function (firebase_service_1_1) {
                firebase_service_1 = firebase_service_1_1;
            }],
        execute: function() {
            DayComponent = (function () {
                function DayComponent(_firebaseService, _router, _routeParams) {
                    this._firebaseService = _firebaseService;
                    this._router = _router;
                    this._routeParams = _routeParams;
                    this.inactivePlayers = [];
                    this.mixing = false;
                }
                DayComponent.prototype.ngOnInit = function () {
                    if (!this._firebaseService.club) {
                        this._router.navigate(["Login"]);
                        return;
                    }
                    this.internalInit();
                };
                DayComponent.prototype.internalInit = function () {
                    var this1 = this;
                    // setup the teams. Either based on last match (if it is today) or random
                    this._firebaseService.getAllPlayers().then(function (players) {
                        this1.allPlayers = players;
                        this1._firebaseService.getCurrentMatch().then(function (currentMatch) {
                            //if (currentMatch.date === new Date().toDateString()) {
                            //we already have a match today. lets filter the players based on this match
                            var validPlayers = currentMatch.team1.concat(currentMatch.team2);
                            // fill up inactive players with the players that are NOT in the current match
                            this1.inactivePlayers = this1.allPlayers.filter(function (player) { return validPlayers.indexOf(player) === -1; });
                            // set team 1 and 2 to be the same as the last match
                            this1.team1 = currentMatch.team1.slice();
                            this1.team2 = currentMatch.team2.slice();
                            //                } else {
                            //                    this.team1 = this.allPlayers.slice();
                            //                    this.team2 = []
                            //                    this.shuffelTeams();
                            //                }
                        });
                    });
                    this.updateStats();
                };
                DayComponent.prototype.switchClub = function ($event) {
                    this._firebaseService.club = $event.target.value;
                    this.internalInit();
                };
                DayComponent.prototype.shuffelTeams = function () {
                    this.mixing = true;
                    var this1 = this;
                    setTimeout(function () {
                        var players = this1.team1.concat(this1.team2);
                        // put all player names in team 1
                        this1.team1 = this1.shuffle(players);
                        // pull half of them to team 2
                        this1.team2 = this1.team1.splice(0, this1.team1.length / 2);
                        this1.mixing = false;
                    }, 2000);
                };
                DayComponent.prototype.shuffelTeamsFair = function () {
                    this.mixing = true;
                    var this1 = this;
                    setTimeout(function () {
                        var dif;
                        var bestTeams;
                        for (var i = 0; i < 50; i++) {
                            var players = this1.team1.concat(this1.team2);
                            // put all player names in team 1
                            var team1 = this1.shuffle(players);
                            // pull half of them to team 2
                            var team2 = team1.splice(0, team1.length / 2);
                            dif = this1.getTeamScore(team1) - this1.getTeamScore(team2);
                            dif = Math.abs(dif);
                            if (!bestTeams || dif < bestTeams.dif) {
                                bestTeams = { team1: team1, team2: team2, dif: dif };
                            }
                        }
                        this1.team1 = bestTeams.team1;
                        this1.team2 = bestTeams.team2;
                        this1.mixing = false;
                    }, 2000);
                };
                DayComponent.prototype.startMatch = function () {
                    var this1 = this;
                    this._firebaseService.getCurrentMatch().then(function (currentMatch) {
                        // only create a new match if we do not have a match with no goals at the end of the list already.
                        if (currentMatch.goals.length === 0) {
                            currentMatch.date = new Date().toDateString();
                            currentMatch.team1 = this1.team1;
                            currentMatch.team2 = this1.team2;
                            this1._firebaseService.updateCurrentMatch(currentMatch).then(function () { return this1._router.navigate(['Match']); });
                        }
                        else {
                            var match = new objects_1.Match();
                            match.team1 = this1.team1;
                            match.team2 = this1.team2;
                            this1._firebaseService.addMatch(match).then(function () { return this1._router.navigate(['Match']); });
                        }
                    });
                };
                DayComponent.prototype.continueMatch = function () {
                    var this1 = this;
                    //lets check if we have same teams or if we should update them
                    this._firebaseService.getCurrentMatch().then(function (currentMatch) {
                        currentMatch.team1 = this1.team1;
                        currentMatch.team2 = this1.team2;
                        this1._firebaseService.updateCurrentMatch(currentMatch).then(function () { return this1._router.navigate(['Match']); });
                    });
                };
                DayComponent.prototype.goToStats = function () {
                    this._router.navigate(['Stat']);
                };
                DayComponent.prototype.switchTeam = function (player) {
                    var i = this.team1.indexOf(player);
                    if (i > -1) {
                        this.team1.splice(i, 1);
                        this.team2.push(player);
                    }
                    else {
                        i = this.team2.indexOf(player);
                        this.team2.splice(i, 1);
                        this.team1.push(player);
                    }
                };
                DayComponent.prototype.removePlayer = function (player) {
                    this.removeElementFromArray(player, this.team1);
                    this.removeElementFromArray(player, this.team2);
                    this.inactivePlayers.push(player);
                };
                DayComponent.prototype.addPlayer = function (player) {
                    this.team1.push(player);
                    this.removeElementFromArray(player, this.inactivePlayers);
                };
                DayComponent.prototype.createPlayer = function (name, mail) {
                    this._firebaseService.addPlayer(name, mail);
                    this.allPlayers.push(name);
                    this.team2.push(name);
                    this.creatingNewPlayer = false;
                };
                DayComponent.prototype.removeElementFromArray = function (element, array) {
                    var i = array.indexOf(element);
                    if (i > -1) {
                        array.splice(i, 1);
                    }
                };
                DayComponent.prototype.shuffle = function (o) {
                    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x)
                        ;
                    return o;
                };
                DayComponent.prototype.getPlayerScore = function (playerName) {
                    if (!this.stats)
                        return 0;
                    var player = this.stats.players.filter(function (p) { return p.name == playerName; })[0];
                    if (!player)
                        return 50;
                    return player.winsPercentage;
                };
                DayComponent.prototype.getTeamScore = function (team) {
                    var _this = this;
                    if (!team || team.length === 0)
                        return 0;
                    var sum = 0;
                    team.forEach(function (p) { return sum += _this.getPlayerScore(p); });
                    return sum / team.length;
                };
                DayComponent.prototype.updateStats = function () {
                    var _this = this;
                    this._firebaseService.getAllMatches().then(function (matches) {
                        _this._firebaseService.getAllPlayers().then(function (players) {
                            _this.stats = new objects_1.Stats(matches, players);
                        });
                    });
                };
                DayComponent = __decorate([
                    core_1.Component({
                        selector: 'day',
                        templateUrl: 'app/day/day.component.html',
                        styleUrls: ['app/day/day.component.css'],
                    }), 
                    __metadata('design:paramtypes', [firebase_service_1.FirebaseService, router_1.Router, router_1.RouteParams])
                ], DayComponent);
                return DayComponent;
            }());
            exports_1("DayComponent", DayComponent);
        }
    }
});
//# sourceMappingURL=day.component.js.map