import { Component, OnInit} from 'angular2/core';
import { Router } from 'angular2/router';
import {RouteParams} from 'angular2/router';
import { Day, Match } from '../objects';
import {FirebaseService} from '../data/firebase.service';
import { StaticKeys } from 'angular2/src/core/linker/element';

declare var Enumerable: any;


@Component({
    selector: 'match',
    templateUrl: 'app/match/match.component.html',
    styleUrls: ['app/match/match.component.css']
})


export class MatchComponent implements OnInit {
    match: Match;
    teamLScore: number;
    teamRScore: number;
    currentTeam: string[];
    swapped: boolean;
    stateObject: StateObject = new StateObject();

    get teamL() {
        if (!this.match) return [];
        if (this.swapped) return this.match.team2;
        else return this.match.team1
    }

    get teamR() {
        if (!this.match) return [];
        if (this.swapped) return this.match.team1;
        else return this.match.team2
    }

    constructor(
        private _firebaseService: FirebaseService,
        private _router: Router,
        private _routeParams: RouteParams
    ) {
        this.swapped = false;
    }

    ngOnInit() {
        if (!this._firebaseService.club) {
            this._router.navigate(["Login"]);
            return;
        }

        var promise = this._firebaseService.getCurrentMatch();
        var this1 = this;
        promise.then(match => {
            this1.match = match;
            this1.countGoals();
            this1._firebaseService.addCallback(this1.match, matchRef => {
                var callbackMatch = matchRef.val();
                if (callbackMatch) {
                    match.eat(callbackMatch);
                    this1.countGoals();
                }
            })
        });

        return promise;
    }

    countGoals() {
        this.teamLScore = 0;
        this.teamRScore = 0;
        if (this.match) {
            this.match.goals.forEach(player => this.updateScore(player));
        }
    }

    getScore(player: string): number {
        if (!this.match) return 0;
        return this.match.goals.filter(p => p === player).length;
    }

    toggleGoalOrAssist(player : string) {
        if(!this.stateObject.goalScorer || player == this.stateObject.goalScorer) {
            this.toggleGoal(player);
        } else {
            this.toggleAssist(player);
        }
    }

    toggleGoal(player : string){
        if(this.stateObject.goalScorer == player) {
            player = null;
        }

        this.stateObject.goalScorer = player;

        if(player == null) {
            this.match.goals.pop();
            this.stateObject.state = this.stateObject.addingScorer;
        } else {
            this.match.goals.push(player);
            this.stateObject.state = this.stateObject.addingAssist;
        }

        this._firebaseService.updateMatchGoals(this.match);
    }

    removeLastGoal() {
        this.match.goals.splice(this.match.goals.length - 1, 1);
        this._firebaseService.updateMatchGoals(this.match);
    }

    updateScore(player: string) {
        if (this.match.team1.indexOf(player) > -1) {
            if (!this.swapped) this.teamLScore++;
            else this.teamRScore++;
        } else {
            if (this.swapped) this.teamLScore++;
            else this.teamRScore++;
        }
    }

    newMatch() {
        this._router.navigate(['Day']);
    }

    swap() {
        this.swapped = !this.swapped;
        this.countGoals();
    }

    deleteGame() {
        if (confirm("Vil du slette denne kamp?")) {
            if (confirm("Er du helt sikker??")) {
                this._firebaseService.deleteCurrentMatch().then(() => this._router.navigate(['Day']));
            }
        }
    }

    startAddGoal(team) {
        this.stateObject.start(team)
    }

    cancel() {
        this.stateObject.stop();
    }

    toggleAssist(player){
        if(player == "noAssist"){
            if(this.stateObject.assist == "noAssist") {
                this.stateObject.assist = null;
            }
            else {
                this.stateObject.assist = "noAssist"
            }
            return;
        }

        if(this.stateObject.assist == player) {
            this.match.assists.pop();
            this.stateObject.assist = null;
        }
        else {
            this.match.assists.push(player);
            this.stateObject.assist = player;
        }
        this._firebaseService.updateMatchAssists(this.match);
    }

    stopCounting(){
        this.stateObject.countdown = -1;
    }
}

class StateObject {
    state: string;
    team: string[];
    goalScorer: string;
    assist: string;
    countdown: number;

    readonly addingScorer = "addingScorer";
    readonly addingAssist = "addingAssist";

    get firstHalf(){
        let arr = this.team;
        let halfwayThrough = Math.ceil((arr.length + 1) / 2)
        return arr.slice(0, halfwayThrough);
    }

    get secondHalf(){
        let arr = this.team;
        let halfwayThrough = Math.ceil((arr.length + 1) / 2)
        return arr.slice(halfwayThrough, arr.length);
    }

    start(team: string[]){
        this.team = team;
        this.state = this.addingScorer;
        this.countdown = 60;
        this.checkAutoClose();
    }

    stop() {
        this.team = null;
        this.state = null;
        this.goalScorer = null;
        this.assist = null;
        this.countdown = null;
    }

    
    checkAutoClose() {
        console.log("checking", this.countdown);
        if(this.countdown == null) return;

        if(this.goalScorer && this.assist && this.countdown > 1) {
            this.countdown = 1;
        } else if(this.goalScorer && !this.assist && this.countdown > 10) {
            this.countdown = 10
        } else if(this.countdown == 0) {
            this.stop();
            return;
        }
        this.countdown--;
        var this1 = this;
        setTimeout(() => this1.checkAutoClose(), 1000);
    }
}