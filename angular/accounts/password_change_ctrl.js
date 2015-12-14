angular.module("wh.accounts").controller("PasswordChangeCtrl", ["$rootScope", "$scope", "$location", "$timeout", "UserSession", "User", function($rootScope, $scope, $location, $timeout, UserSession, User) {
  $scope.currentUser = UserSession.currentUser();

  if (!$scope.currentUser || !$scope.currentUser.id) {
    $location.path(Routes.root_path());
    return;
  }

  $rootScope.currentUser = $scope.currentUser;

  var setPasswordConfirmationValidity = function() {
    if ($scope.user && ($scope.enteringField == 'password' || $scope.enteringField == 'password_confirmation')) {
      if ($scope.user.password != $scope.user.password_confirmation) {
        $scope.userForm.password_confirmation.$setValidity("match", false)
      } else {
        $scope.userForm.password_confirmation.$setValidity("match", true)
      }
    }
  }

  $scope.enterField = function(field, $event) {
    setPasswordConfirmationValidity()
  }

  $scope.startEnteringField = function(fieldName) {
    $scope.enteringField = fieldName;
  }

  $scope.stopEnteringField = function(fieldName) {
    $scope.enteringField = undefined;
  }

  $scope.changePassword = function() {
    if ($scope.userForm.$valid) {
      if ($scope.isSubmitting) {
        return;
      }

      $scope.isSubmitting = true;
      $scope.changePasswordError = undefined;
      User.changePassword($scope.user, function(respondData) {
        $location.path("/accounts/profile/edit");
      }, function(xhr) {
        var errors = $scope.errorsOf(xhr);
        if (errors.password) {
          $scope.userForm.password.$setValidity("format", false);
          $scope.passwordErrors = errors.password;
        }

        if (errors.password_confirmation) {
          $scope.userForm.password_confirmation.$setValidity("format", false);
          $scope.passwordConfirmationErrors = errors.password_confirmation;
        }

        if (typeof(errors) == "string") {
          $scope.changePasswordError = errors;
        }

        $scope.isSubmitting = false;
        $scope.isSubmitted = false;
      });
    } else {
      $scope.isSubmitted = true;
    }
  }

  $scope.clearErrorsOf = function(field, event) {
    if ($scope.isKeyVisible(event.keyCode)) {
      if (field == "password") {
        $scope.passwordErrors = [];
        $scope.userForm.password.$setValidity("format", true);
      } else if (field == "password_confirmation") {
        $scope.passwordConfirmationErrors = [];
        $scope.userForm.password_confirmation.$setValidity("format", true);
      }
    }
  }

  $scope.$watch("enteringField", function(newValue) {
    setPasswordConfirmationValidity();
  });
}])
