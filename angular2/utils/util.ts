import * as Rx from 'rxjs/Rx';

export class Util {
  static submitRequest(url, method, data, successCallback, errorCallback) {
    let requestUrl = url;
    if ((!method || method.toLowerCase() == "get") && data) {
      let params = (<any>window).jQuery.param(data);

      if (requestUrl.indexOf("?") >= 0) {
        requestUrl = requestUrl + "&" + params;
      } else {
        requestUrl = requestUrl + "?" + params;
      }
    }

    var ajax = Rx.Observable.ajax({ url: requestUrl, method: method, body: data, responseType: 'json'});
    ajax.subscribe(
      function (responseData) {
        if (successCallback) {
          successCallback(responseData.response);
        }
      },
      function (error) {
        if (errorCallback) {
          errorCallback(error);
        }
      }
    );

    return ajax;
  }

  static getPaginationInfo(respondData) {
    if (respondData.pagination) {
      return {
        total: respondData.pagination.count,
        perPage: respondData.pagination.per_page,
        currentPage: respondData.pagination.current_page,
        totalPages: respondData.pagination.total_pages,
        minPage: 1,
        maxPage: respondData.pagination.total_pages
      };
    }
  }

  static isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
  }
}
