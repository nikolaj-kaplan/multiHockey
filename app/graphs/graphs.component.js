System.register(['angular2/core', 'angular2/router', '../data/firebase.service', "linqts"], function(exports_1, context_1) {
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
    var core_1, router_1, router_2, firebase_service_1, linqts_1;
    var GraphsComponent;
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
            },
            function (linqts_1_1) {
                linqts_1 = linqts_1_1;
            }],
        execute: function() {
            GraphsComponent = (function () {
                function GraphsComponent(_firebaseService, _router, _routeParams) {
                    this._firebaseService = _firebaseService;
                    this._router = _router;
                    this._routeParams = _routeParams;
                    this.colors = [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ];
                }
                GraphsComponent.prototype.initChart = function () {
                    var ctx = document.getElementById("chart");
                    var chart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: ["January", "February", "March", "April", "May", "June", "July"],
                            datasets: [{
                                    label: "My First dataset",
                                    backgroundColor: this.colors[0],
                                    borderColor: this.colors[0],
                                    data: [
                                        1, 2, 3, 2, 1
                                    ],
                                    fill: false,
                                }, {
                                    label: "My Second dataset",
                                    fill: false,
                                    backgroundColor: this.colors[1],
                                    borderColor: this.colors[1],
                                    data: [
                                        5, 2, 1, 2, 1
                                    ],
                                }]
                        },
                        options: {
                            responsive: true,
                            title: {
                                display: true,
                                text: 'Chart.js Line Chart'
                            },
                            tooltips: {
                                mode: 'index',
                                intersect: false,
                            },
                            hover: {
                                mode: 'nearest',
                                intersect: true
                            },
                            scales: {
                                xAxes: [{
                                        display: true,
                                        scaleLabel: {
                                            display: true,
                                            labelString: 'Month'
                                        }
                                    }],
                                yAxes: [{
                                        display: true,
                                        scaleLabel: {
                                            display: true,
                                            labelString: 'Value'
                                        }
                                    }]
                            }
                        }
                    });
                };
                GraphsComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    var p1 = this._firebaseService.getAllMatches();
                    p1.then(function (x) {
                        var _this = this;
                        (function (x) { return _this.allMatches = x; });
                    });
                    var p2 = this._firebaseService.getAllPlayers();
                    p2.then(function (x) {
                        var names = x;
                        this.players = names
                            .map(function (x) { return ({ name: x, selected: false }); });
                    });
                    p1.then(function () {
                        p2.then(function () {
                            _this.datasets = [{ data: [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1], label: "1" }];
                            _this.initChart();
                            var x = new linqts_1.List();
                        });
                    });
                };
                GraphsComponent.prototype.createDataSet = function (player) {
                };
                GraphsComponent = __decorate([
                    core_1.Component({
                        selector: 'stat',
                        templateUrl: 'app/graphs/graphs.component.html',
                        styleUrls: ['app/graphs/graphs.component.css'],
                    }), 
                    __metadata('design:paramtypes', [firebase_service_1.FirebaseService, router_1.Router, router_2.RouteParams])
                ], GraphsComponent);
                return GraphsComponent;
            }());
            exports_1("GraphsComponent", GraphsComponent);
        }
    }
});
//# sourceMappingURL=graphs.component.js.map