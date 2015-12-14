angular.module('wh.accounts').factory 'UserSession', ["$q", "Util",
  ($q, Util)->
    service = {}
    service.currentUser = (force, successCallback, errorCallback)->
      if typeof(force) is "function"
        errorCallback = successCallback
        successCallback = force
        force = false

      if service.__currentUser__ && !force
        successCallback(service.__currentUser__) if successCallback
        return service.__currentUser__;

      ret = $q.defer()
      Util.submitRequest Routes.me_api_v1_sessions_path(), "get", {}, (respondData)->
        service.__currentUser__ = respondData.results
        successCallback(service.__currentUser__) if successCallback
        ret.resolve(service.__currentUser__)
      , (error, status, headers, config)->
        errorCallback(error, status) if errorCallback
        ret.reject(undefined)

      return ret.promise

    service.isLoggedIn = ()->
      return !!(service.__currentUser__ && service.__currentUser__.id)

    service.login = (params, successCallback, errorCallback)->
      return Util.submitRequest Routes.api_v1_sessions_path(), "post", {data: {user: params}}, (respondData)->
        service.__currentUser__ = respondData.results
        successCallback(service.__currentUser__) if successCallback
      , (error, status, headers, config)->
        errorCallback(error, status) if errorCallback

    service.logout = (params, successCallback, errorCallback)->
      return Util.submitRequest Routes.destroy_user_session_path(), "get", {params: params}, (respondData)->
        service.__currentUser__ = respondData.results
        successCallback(service.__currentUser__) if successCallback
      , (error, status, headers, config)->
        errorCallback(error, status) if errorCallback

    service.setCurrentUser = (user)->
      service.__currentUser__ = service.__currentUser__ || {}
      if angular.isObject(user) && !angular.equals(user, {})
        angular.extend(service.__currentUser__, user)
      else
        # angular.forEach service.__currentUser__, (value, key)->
        #   delete service.__currentUser__[key]
        service.__currentUser__ = user

    service
]
