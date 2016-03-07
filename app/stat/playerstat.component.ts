import { Component, OnInit, Pipe, PipeTransform} from 'angular2/core';
import { Router } from 'angular2/router';
import {RouteParams} from 'angular2/router';
import { Match, Player, Stats} from '../objects';
import {FirebaseService} from '../data/firebase.service';

declare var Firebase: any;
declare var Enumerable: any;


@Component({
  selector: 'playerstat',
  templateUrl: 'app/stat/playerstat.component.html',
  styleUrls: ['app/stat/playerstat.component.css'],
})



export class PlayerStatComponent implements OnInit {
  dayStats: Stats[];
  totalStats: Stats;
  dataLoaded: boolean = false;

  constructor(
    private _firebaseService: FirebaseService,
    private _router: Router,
    private _routeParams: RouteParams
    ) {
  }

  ngOnInit() {
    this._firebaseService.getAllMatches().then(matches => {
      this._firebaseService.getAllPlayers().then(players => {
        this.totalStats = new Stats(matches,players);
        this.dayStats = Enumerable.From(matches).GroupBy(match => match.date).Select(group => new Stats(group.source, players)).ToArray();
        this.dataLoaded = true;
      })
    });
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

}
