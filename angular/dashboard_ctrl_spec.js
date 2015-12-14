describe("dashboardCtrl", function() {
  beforeEach(angular.mock.module('admin'));

  describe("User is not logged in", function() {
    var scope = null;
    var ctrl = null;
    var httpBackend = null;
    var location;

    beforeEach(inject(function($controller, $rootScope, $httpBackend, $location) {
      httpBackend = $httpBackend;
      httpBackend.when('GET', App.settings.apiBaseUrl + '/admin/sessions/me').respond({});

      scope = $rootScope.$new();
      location = $location;
      ctrl = $controller("dashboardCtrl", {$scope: scope, $location: $location});
      httpBackend.flush();
    }));

    afterEach(function() {
      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
    });

    it("should redirect user to login page", function() {
      expect(scope.currentAdmin.id).toBeUndefined();
      expect(location.path()).toBe("/login");
    });
  });

  describe("User is logged in", function() {
    var scope = null;
    var ctrl = null;
    var httpBackend = null;
    var location;

    beforeEach(inject(function($controller, $rootScope, $httpBackend, $location, Customer) {
      httpBackend = $httpBackend;
      httpBackend.when('GET', App.settings.apiBaseUrl + '/admin/sessions/me').respond({id: 1});

      scope = $rootScope.$new();
      location = $location;
      ctrl = $controller("dashboardCtrl", {$scope: scope, $location: $location});
      httpBackend.flush();
    }));

    afterEach(function() {
      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
    });

    it("should be ok", function() {
      expect(scope.currentAdmin.id).toBe(1);
    });
  });
});