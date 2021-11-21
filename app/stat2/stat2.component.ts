import { Component, OnInit, Pipe, PipeTransform} from 'angular2/core';
import { Router } from 'angular2/router';
import {RouteParams} from 'angular2/router';
import { Match, Player, Stats} from '../objects';
import {FirebaseService} from '../data/firebase.service';

declare var Firebase: any;
declare var Enumerable: any;


@Component({
    selector: 'stat2',
    templateUrl: 'app/stat2/stat2.component.html',
    styleUrls: ['app/stat2/stat2.component.css'],
})



export class Stat2Component implements OnInit {
    dayStats: Stats[];
    totalStats: Stats;
    dataLoaded: boolean = false;
    games: number = 30;

    constructor(
        private _firebaseService: FirebaseService,
        private _router: Router,
        private _routeParams: RouteParams
    ) {
    }

    ngOnInit() {
        if (!this._firebaseService.club) {
            this._router.navigate(["Login"]);
            return;
        }
        this.loadStats();
    }

    back() {
        this._router.navigate(['Day']);
    }

    getDayStats() {
        return this.transform(this.dayStats);
    }

    transform(value: any): any {
        return Object.keys(value).map(key => value[key]);
    }

    loadStats(){
        this._firebaseService.getAllMatches().then(matches => {
            this._firebaseService.getAllPlayers().then(players => {
                matches = this.getLastElements(matches, this.games);
                this.totalStats = new Stats(matches, players);
                this.dayStats = Enumerable.From(matches).GroupBy(match => match.date).Select(group => new Stats(group.source, players)).ToArray();
                this.dataLoaded = true;
            })
        });
    }

    getLastElements(list: any[], games: number ) : Match[] {
        for (var i = list.length; i < cars.length; i++) { 
            text += cars[i] + "<br>";
        }
    }
}
