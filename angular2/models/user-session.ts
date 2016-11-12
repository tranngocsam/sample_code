import * as Q from "q";
import { Util } from "../utils/util";

let apiPrefix = "http://lvh.me:3000";

export default class UserSession {
  private static __currentUser__ = null;
  static currentUser(force = false, successCallback = undefined, errorCallback = undefined) {
    if (typeof(force) == "function") {
      errorCallback = successCallback
      successCallback = force
      force = false
    }

    if (UserSession.__currentUser__ && !force) {
      if (successCallback) {
        successCallback(UserSession.__currentUser__)
      }
      return UserSession.__currentUser__;
    }

    var ret = Q.defer();
    Util.submitRequest(apiPrefix + (<any>window).Routes.me_api_v1_sessions_path(), "get", {}, function(respondData) {
      UserSession.__currentUser__ = respondData.results;
      if (successCallback) {
        successCallback(UserSession.__currentUser__);
      }
      ret.resolve(UserSession.__currentUser__);
    }, function(xhr, error, status) {
      if (errorCallback) {
        errorCallback(xhr, error, status);
      }
      ret.reject(undefined);
    });

    return ret.promise;
  }

  static isLoggedIn() {
    return !!(UserSession.__currentUser__ && UserSession.__currentUser__.id)
  }

  static login(params, successCallback = undefined, errorCallback = undefined) {
    return Util.submitRequest(apiPrefix + (<any>window).Routes.api_v1_sessions_path(), "post", {user: params}, function(respondData) {
      UserSession.__currentUser__ = respondData.results;
      let token = UserSession.__currentUser__.token;
      (<any>window).Cookies.set("token", token);

      if (successCallback) {
        successCallback(UserSession.__currentUser__);
      }
    }, function(error, status, headers, config) {
      if (errorCallback) {
        errorCallback(error, status);
      }
    });
  }

  static logout(params, successCallback, errorCallback) {
    return Util.submitRequest(apiPrefix + (<any>window).Routes.destroy_user_session_path(), "get", params, function(respondData){
      UserSession.__currentUser__ = respondData.results;
      (<any>window).Cookies.set("token", null);

      if (successCallback) {
        successCallback(UserSession.__currentUser__);
      }
    }, function(error, status, headers, config) {
      if (errorCallback) {
        errorCallback(error, status);
      }
    });
  }

  static setCurrentUser(user) {
    UserSession.__currentUser__ = UserSession.__currentUser__ || {}
    if (typeof(user) == "object" && user.hasOwnProperty()) {
      Object.assign(UserSession.__currentUser__, user);
    } else {
      UserSession.__currentUser__ = user;
    }
  }
}
