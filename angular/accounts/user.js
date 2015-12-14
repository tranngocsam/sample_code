angular.module("wh.accounts").factory("User", ["Util", function(Util) {
  service = {};

  service.changePassword = function(params, successCallback, errorCallback) {
    url = Routes.change_password_api_v1_users_path();
    return Util.submitRequest(url, "put", {data: {user: params}}, successCallback, errorCallback);
  }

  service.loadUser = function(id, params, successCallback, errorCallback) {
    url = Routes.api_v1_user_path(id);
    return Util.submitRequest(url, "get", {params: params}, successCallback, errorCallback)
  }

  return service;
}]);
