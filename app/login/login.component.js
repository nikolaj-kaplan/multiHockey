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
    var LoginComponent;
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
            LoginComponent = (function () {
                function LoginComponent(_firebaseService, _router, _routeParams) {
                    this._firebaseService = _firebaseService;
                    this._router = _router;
                    this._routeParams = _routeParams;
                }
                LoginComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this.ref = new Firebase("https://multihockey.firebaseio.com");
                    this.ref.onAuth(function (authData) { return _this.authDataCallback(authData, _this._firebaseService); });
                };
                // Create a callback which logs the current auth state
                LoginComponent.prototype.authDataCallback = function (authData, firebaseService) {
                    var this1 = this;
                    if (authData) {
                        console.log("User " + authData.uid + " is logged in with " + authData.provider);
                        localStorage.setItem("user", authData.facebook.email);
                        var mail = authData.facebook.email;
                        var imageUrl = authData.facebook.cachedUserProfile.picture.data.url;
                        firebaseService.selectClub(mail).then(function (success) {
                            if (!success) {
                                alert("Vi kender dig ikke");
                            }
                            else {
                                this1._router.navigate(["Day"]);
                            }
                        });
                    }
                };
                LoginComponent.prototype.login = function () {
                    debugger;
                    //skip login:
                    localStorage.setItem("user", "nikolaj.kaplan@gmail.com");
                    this._router.navigate(["Day"]);
                    /*
                    
                            this.ref.authWithOAuthPopup("facebook", this.authDataCallback, {
                                scope: "email"
                            });*/
                };
                LoginComponent = __decorate([
                    core_1.Component({
                        selector: 'login',
                        templateUrl: 'app/login/login.component.html',
                        styleUrls: ['app/login/login.component.css'],
                    }), 
                    __metadata('design:paramtypes', [firebase_service_1.FirebaseService, router_1.Router, router_2.RouteParams])
                ], LoginComponent);
                return LoginComponent;
            }());
            exports_1("LoginComponent", LoginComponent);
        }
    }
});
//# sourceMappingURL=login.component.js.map