angular.module('wh.accounts', [])
        .config(["$routeProvider", function($routeProvider) {
          $routeProvider.when("/login", {
            templateUrl: "accounts/templates/login.html",
            controller: "LoginCtrl",
            resolve: {
              currentUser: function(UserSession) {
                return UserSession.currentUser(true);
              }
            }
          });
        }]);
