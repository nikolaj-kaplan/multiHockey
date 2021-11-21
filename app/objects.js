System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Player, Match, Team, Stats;
    return {
        setters:[],
        execute: function() {
            Player = (function () {
                function Player(name) {
                    this.name = name;
                    this.matches = 0;
                    this.wins = 0;
                    this.goals = 0;
                }
                Object.defineProperty(Player.prototype, "goalsPrMatch", {
                    get: function () {
                        if (this.matches == 0)
                            return '0';
                        return (this.goals / this.matches).toFixed(2);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Player.prototype, "assistsPrMatch", {
                    get: function () {
                        if (this.matches == 0)
                            return '0';
                        return (this.assists / this.matches).toFixed(2);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Player.prototype, "winsPercentageString", {
                    get: function () {
                        return this.winsPercentage.toFixed(0);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Player.prototype, "winsPercentage", {
                    get: function () {
                        if (this.matches == 0)
                            return 0;
                        return (this.wins / this.matches * 100);
                    },
                    enumerable: true,
                    configurable: true
                });
                return Player;
            }());
            exports_1("Player", Player);
            Match = (function () {
                function Match() {
                    this.date = new Date().toDateString();
                    this.key = "";
                    this.ensureNoUndefined();
                }
                Match.prototype.eat = function (match) {
                    this.date = match.date;
                    this.team1 = match.team1;
                    this.team2 = match.team2;
                    this.goals = match.goals;
                    this.assists = match.assists;
                    this.key = match.key;
                    this.ensureNoUndefined();
                };
                Match.prototype.ensureNoUndefined = function () {
                    if (!this.team1) {
                        this.team1 = [];
                    }
                    if (!this.team2) {
                        this.team2 = [];
                    }
                    if (!this.goals) {
                        this.goals = [];
                    }
                    if (!this.assists) {
                        this.assists = [];
                    }
                };
                return Match;
            }());
            exports_1("Match", Match);
            Team = (function () {
                function Team(players) {
                    this.players = Enumerable.From(players).OrderBy(function (x) { return x; });
                    this.key = players.join("_");
                }
                return Team;
            }());
            exports_1("Team", Team);
            Stats = (function () {
                function Stats(matches, players) {
                    this.matches = matches;
                    this.players = players.map(function (p) { return new Player(p); });
                    var dates = Enumerable.From(this.matches).GroupBy(function (match) { return match.date; }).ToArray();
                    if (dates.length == 1) {
                        this.date = dates[0].Key();
                    }
                    this.init();
                }
                Stats.prototype.getPlayers = function () {
                    return this.transform(this.players);
                };
                Stats.prototype.init = function () {
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
                    var assistsCount = Enumerable.From(this.matches).SelectMany(function (x) { return x.assists; }).GroupBy(function (name) { return name; }).Select(function (group) { return ({ name: group.Key(), assists: group.source.length }); });
                    this.players.forEach(function (p) {
                        var goalsObject = goalCount.FirstOrDefault(undefined, function (x) { return x.name === p.name; });
                        p.goals = goalsObject ? goalsObject.goals : 0;
                        var assistsObject = assistsCount.FirstOrDefault(undefined, function (x) { return x.name === p.name; });
                        p.assists = assistsObject ? assistsObject.assists : 0;
                        p.winningGoals = Enumerable.From(_this.matches).Where(function (m) { return m.goals[m.goals.length - 1] == p.name; }).ToArray().length;
                    });
                    //calculate matches
                    this.matches.forEach(function (m) {
                        var team1AndTeam2 = m.team1.concat(m.team2);
                        _this.players.forEach(function (p) {
                            if (team1AndTeam2.indexOf(p.name) > -1)
                                p.matches++;
                        });
                    });
                    this.players = Enumerable
                        .From(this.players)
                        .Where(function (p) { return p.matches > 0; })
                        .Where(function (p) { return _this.include(p); })
                        .OrderBy(function (p) { return -(p.winsPercentage * 100); })
                        .ToArray();
                };
                Stats.prototype.include = function (p) {
                    return true;
                };
                Stats.prototype.getWinnerNames = function (match) {
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
                Stats.prototype.transform = function (value) {
                    return Object.keys(value).map(function (key) { return value[key]; });
                };
                Stats.prototype.getPlayerScore = function (playerName) {
                    var player = this.players.filter(function (p) { return p.name == playerName; })[0];
                    if (!player)
                        return 50;
                    return player.winsPercentage;
                };
                Stats.prototype.getTeamScoreFromStats = function (team) {
                    var _this = this;
                    var teamKey = Enumerable.From(team).OrderBy(function (x) { return x; }).ToArray().join("_");
                    var totalCount = 0;
                    var winCount = 0;
                    this.matches.forEach(function (match) {
                        var winnerNames = _this.getWinnerNames(match);
                    });
                    if (!team || team.length === 0)
                        return 0;
                    var sum = 0;
                    team.forEach(function (p) { return sum += _this.getPlayerScore(p); });
                    return sum / team.length;
                };
                return Stats;
            }());
            exports_1("Stats", Stats);
        }
    }
});
//# sourceMappingURL=objects.js.map