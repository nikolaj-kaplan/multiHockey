import { Component, OnInit, } from 'angular2/core';
import { Router, RouteParams } from 'angular2/router';
import { Match, Stats} from '../objects';
import {FirebaseService} from '../data/firebase.service';

@Component({
    selector: 'day',
    templateUrl: 'app/day/day.component.html',
    styleUrls: ['app/day/day.component.css'],
})


export class DayComponent implements OnInit {
    team1: string[];
    team2: string[];
    inactivePlayers: string[] = [];
    allPlayers: string[];
    mixing: boolean;
    creatingNewPlayer: boolean;
    stats: Stats;

    constructor(
        private _firebaseService: FirebaseService,
        private _router: Router,
        private _routeParams: RouteParams
    ) {
        this.mixing = false;
    }

    ngOnInit() {
        if (!this._firebaseService.club) {
            this._router.navigate(["Login"]);
            return;
        }
        this.internalInit();
    }

    getInactivePlayers(){
        return this.inactivePlayers.sort();        
    }

    internalInit() {
        var this1 = this;
        // setup the teams. Either based on last match (if it is today) or random
        this._firebaseService.getAllPlayers().then(players => {
            this1.allPlayers = players;
            this1._firebaseService.getCurrentMatch().then(currentMatch => {
                //if (currentMatch.date === new Date().toDateString()) {
                //we already have a match today. lets filter the players based on this match
                var validPlayers = currentMatch.team1.concat(currentMatch.team2);
                // fill up inactive players with the players that are NOT in the current match
                this1.inactivePlayers = this1.allPlayers.filter(player => validPlayers.indexOf(player) === -1);

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
    }

    switchClub($event) {
        this._firebaseService.club = $event.target.value;
        this.internalInit();
    }

    shuffelTeams() {
        this.mixing = true;
        var this1 = this;
        setTimeout(function() {
            var players = this1.team1.concat(this1.team2);
            // put all player names in team 1
            this1.team1 = this1.shuffle(players);
            // pull half of them to team 2
            this1.team2 = this1.team1.splice(0, this1.team1.length / 2);
            this1.mixing = false;
        }, 2000);
    }

    shuffelTeamsFair() {
        this.mixing = true;
        var this1 = this;
        setTimeout(function() {
            var dif;
            var bestTeams;

            for(var i = 0; i < 50; i++){
                var players = this1.team1.concat(this1.team2);
                // put all player names in team 1
                var team1 = this1.shuffle(players);
                // pull half of them to team 2
                var team2 = team1.splice(0, team1.length / 2);
                dif = this1.getTeamScore(team1) - this1.getTeamScore(team2);
                dif = Math.abs(dif);
                if(!bestTeams || dif < bestTeams.dif) {
                    bestTeams = {team1,team2,dif};
                }
            }

            this1.team1 = bestTeams.team1;
            this1.team2 = bestTeams.team2;
            this1.mixing = false;
        }, 2000);
    }


    startMatch() {
        var this1 = this;
        this._firebaseService.getCurrentMatch().then(currentMatch => {
            // only create a new match if we do not have a match with no goals at the end of the list already.
            if (currentMatch.goals.length === 0) {
                currentMatch.date = new Date().toDateString();
                currentMatch.team1 = this1.team1;
                currentMatch.team2 = this1.team2;
                this1._firebaseService.updateCurrentMatch(currentMatch).then(() => this1._router.navigate(['Match']));
            } else {
                var match = new Match();
                match.team1 =  this1.team1;
                match.team2 =  this1.team2;
                this1._firebaseService.addMatch(match).then(() => this1._router.navigate(['Match']));
            }
        });
    }

    continueMatch() {
        var this1 = this;
        //lets check if we have same teams or if we should update them
        this._firebaseService.getCurrentMatch().then(currentMatch => {
            currentMatch.team1 = this1.team1;
            currentMatch.team2 = this1.team2;
            this1._firebaseService.updateCurrentMatch(currentMatch).then(() => this1._router.navigate(['Match']));
        });
    }

    goToStats() {
        this._router.navigate(['Stat']);
    }


    switchTeam(player: string) {
        var i = this.team1.indexOf(player);
        if (i > -1) {
            this.team1.splice(i, 1);
            this.team2.push(player);
        } else {
            i = this.team2.indexOf(player);
            this.team2.splice(i, 1);
            this.team1.push(player);
        }
    }

    removePlayer(player: string) {
        this.removeElementFromArray(player, this.team1);
        this.removeElementFromArray(player, this.team2);
        this.inactivePlayers.push(player)
    }

    addPlayer(player: string) {
        this.team1.push(player);
        this.removeElementFromArray(player, this.inactivePlayers);
    }

    createPlayer(name: string, mail: string) {
        this._firebaseService.addPlayer(name, mail);
        this.allPlayers.push(name);
        this.team2.push(name);
        this.creatingNewPlayer = false;
    }

    removeElementFromArray<T>(element: T, array: T[]) {
        var i = array.indexOf(element);
        if (i > -1) {
            array.splice(i, 1);
        }
    }

    shuffle(o) {
        for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }

    getPlayerScore( playerName: string): number{
        if(!this.stats) return 0;
        var player = this.stats.players.filter(p => p.name == playerName)[0];
        if(!player) return 50;
        return player.winsPercentage;
    }

    getTeamScore(team: string[]): number {

        if(!team || team.length === 0) return 0;
        var sum = 0;
        team.forEach(p => sum += this.getPlayerScore(p));
        return sum / team.length;
    }

    updateStats(){
        this._firebaseService.getAllMatches().then(matches => {
            this._firebaseService.getAllPlayers().then(players => {
                this.stats = new Stats(matches, players);
            });
        });
    }

}
