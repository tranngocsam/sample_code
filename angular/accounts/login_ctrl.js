angular.module("wh.accounts").controller("LoginCtrl", ["$rootScope", "$scope", "$location", "$timeout", "UserSession", function($rootScope, $scope, $location, $timeout, UserSession) {
  $scope.currentUser = UserSession.currentUser();

  if ($scope.currentUser && $scope.currentUser.id) {
    if ($scope.currentUser.is_admin) {
      $location.path("/admin/clients");
    } else {
      $location.path("/");
    }

    return;
  }

  $rootScope.currentUser = $scope.currentUser;

  $scope.login = function() {
    $scope.loginError = false;
    if ($scope.userForm.$valid) {
      $scope.isSubmitting = true;
      UserSession.login($scope.user, function(user) {
        UserSession.setCurrentUser(user);
        var searchParams = $location.search();
        var next = searchParams.next;
        delete searchParams.next;

        if (next) {
          $location.path(next).search(searchParams);
        } else {
          if (user.is_admin) {
            $location.path("/admin");
          } else {
            $location.path("/");
          }
        }
      }, function(xhr) {
        $scope.isSubmitted = false;
        $scope.isSubmitting = false;
        $scope.loginError = true;
      });
    } else {
      $scope.isSubmitted = true;
    }
  }
}])
