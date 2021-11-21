System.register(['angular2/core', '../objects'], function(exports_1, context_1) {
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
    var core_1, objects_1;
    var FirebaseService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (objects_1_1) {
                objects_1 = objects_1_1;
            }],
        execute: function() {
            FirebaseService = (function () {
                function FirebaseService() {
                    this.baserUrl = "https://multihockey.firebaseio.com/";
                    this.weeks = 10;
                    this.club = "FBSMulti";
                }
                FirebaseService.prototype.selectClub = function (mail) {
                    var _this = this;
                    return new Promise(function (resolve) {
                        var clubsRef = new Firebase(_this.baserUrl);
                        clubsRef.once("value", function (clubs) {
                            clubs.forEach(function (club) {
                                club.child("players").forEach(function (player) {
                                    if (player.val().mail == mail) {
                                        _this.club = club.key();
                                        return resolve(true);
                                    }
                                });
                            });
                            return resolve(false);
                        });
                    });
                };
                FirebaseService.prototype.getPlayersRef = function () {
                    return new Firebase(this.baserUrl + this.club + "/players");
                };
                FirebaseService.prototype.getMatchRootRef = function () {
                    return new Firebase(this.baserUrl + this.club + "/matches");
                };
                FirebaseService.prototype.getAllPlayers = function () {
                    var _this = this;
                    return new Promise(function (resolve) {
                        return _this.getPlayersRef().once("value", function (players) {
                            var players2 = [];
                            players.forEach(function (p) {
                                players2.push(p.val().name);
                            });
                            return resolve(players2);
                        });
                    });
                };
                FirebaseService.prototype.getAllMatches = function () {
                    var _this = this;
                    return new Promise(function (resolve) {
                        _this.getMatchRootRef().once("value", function (result) {
                            var matches = [];
                            result.forEach(function (x) {
                                var match = new objects_1.Match();
                                match.eat(x.val());
                                matches.push(match);
                            });
                            var date = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7 * _this.weeks);
                            matches = matches.filter(function (m) { return new Date(m.date) > date; });
                            resolve(matches);
                        });
                    });
                };
                FirebaseService.prototype.addMatch = function (match) {
                    var this1 = this;
                    var promise = new Promise(function (resolve) {
                        var x = this1.getMatchRootRef().push(match, function () {
                            // save key to add goals later
                            match.key = x.key();
                            x.child("key").set(x.key(), function () {
                                resolve();
                            });
                        });
                    });
                    return promise;
                };
                FirebaseService.prototype.addPlayer = function (name, mail) {
                    if (mail === undefined) {
                        mail = "";
                    }
                    this.getPlayersRef().push({ mail: mail, name: name });
                };
                FirebaseService.prototype.updateMatchGoals = function (match) {
                    var matchRef = this.getMatchRootRef().child(match.key);
                    matchRef.child("goals").set(match.goals);
                };
                FirebaseService.prototype.updateMatchAssists = function (match) {
                    var matchRef = this.getMatchRootRef().child(match.key);
                    matchRef.child("assists").set(match.assists);
                };
                FirebaseService.prototype.addCallback = function (match, callback) {
                    var matchRef = this.getMatchRootRef().child(match.key);
                    matchRef.on("value", callback);
                };
                FirebaseService.prototype.getCurrentMatch = function () {
                    var this1 = this;
                    return new Promise(function (resolve) {
                        return this1.getMatchRootRef().limitToLast(1).once("value", function (response) {
                            var match = new objects_1.Match();
                            var firebaseHadAMatch = false;
                            response.forEach(function (x) {
                                match.eat(x.val());
                                firebaseHadAMatch = true;
                            });
                            if (firebaseHadAMatch) {
                                resolve(match);
                            }
                            else {
                                this1.addMatch(match).then(function () { return resolve(match); });
                            }
                        });
                    });
                };
                FirebaseService.prototype.deleteCurrentMatch = function () {
                    var this1 = this;
                    return new Promise(function (resolve) {
                        this1.getCurrentMatch().then(function (match) {
                            this1.getMatchRootRef().child(match.key).remove(function () {
                                resolve();
                            });
                        });
                    });
                };
                FirebaseService.prototype.updateCurrentMatch = function (updatedMatch) {
                    var this1 = this;
                    return new Promise(function (resolve) {
                        this1.getMatchRootRef().child(updatedMatch.key).update(updatedMatch, function () {
                            resolve();
                        });
                    });
                };
                FirebaseService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], FirebaseService);
                return FirebaseService;
            }());
            exports_1("FirebaseService", FirebaseService);
        }
    }
});
//# sourceMappingURL=firebase.service.js.map