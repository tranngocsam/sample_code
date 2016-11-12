import { Util } from "../utils/util";

let apiPrefix = "http://lvh.me:3000";

export default class Career {
  static suggest(params, successCallback = undefined, errorCallback = undefined) {
    var url = apiPrefix + (<any>window).Routes.suggest_api_v1_careers_path();
    return Util.submitRequest(url, "get", params, successCallback, errorCallback);
  }

  static searchCareers(params, successCallback, errorCallback) {
    var url = apiPrefix + (<any>window).Routes.search_api_v1_careers_path();
    return Util.submitRequest(url, "get", params, successCallback, errorCallback);
  }

  static loadCareer(id, params, successCallback, errorCallback) {
    var url = apiPrefix + (<any>window).Routes.api_v1_career_path(id);
    return Util.submitRequest(url, "get", params, successCallback, errorCallback);
  }

  static allCareers(params, successCallback, errorCallback) {
    var url = apiPrefix + (<any>window).Routes.api_v1_careers_path();
    return Util.submitRequest(url, "get", params, successCallback, errorCallback);
  }

  static allInterests(params, successCallback, errorCallback) {
    var url = apiPrefix + (<any>window).Routes.api_v1_interests_path();
    return Util.submitRequest(url, "get", params, successCallback, errorCallback);
  }

  static loadInterest(slug, params, successCallback, errorCallback) {
    var url = apiPrefix + (<any>window).Routes.api_v1_interest_path(slug);
    return Util.submitRequest(url, "get", params, successCallback, errorCallback);
  }

  static getCareerProfileSectionValue(career, key, partialKeyMatch) {
    if (!career || !career.sections || career.sections.length == 0) {
      return undefined;
    }

    var result = undefined;
    for (let i = 0; i < career.sections.length; i++) {
      let profileSection = career.sections[i];
      if (!partialKeyMatch && profileSection.section_key == key || partialKeyMatch && profileSection.section_key.indexOf(key) == 0) {
        if (!result || !result.value || profileSection.value && result.value.length < profileSection.value.length) {
          result = profileSection;
        }
      }
    };

    if (result) {
      return result.value;
    }

    return result;
  }

  static toggleUserStep(userSlug, params, successCallback, errorCallback) {
    var url = apiPrefix + (<any>window).Routes.toggle_step_api_v1_user_path(userSlug);
    return Util.submitRequest(url, "post", {completed_step: params}, successCallback, errorCallback);
  }

  static userFavoriteIndustries(userSlug, params, successCallback, errorCallback) {
    var url = apiPrefix + (<any>window).Routes.favorite_interests_api_v1_user_path(userSlug);
    return Util.submitRequest(url, "get", params, successCallback, errorCallback);
  }

  static careerGuides(slug, params, successCallback, errorCallback) {
    var url = apiPrefix + (<any>window).Routes.guides_api_v1_career_path(slug);
    return Util.submitRequest(url, "get", params, successCallback, errorCallback);
  }

  static careerFaqs(slug, params, successCallback, errorCallback) {
    var url = apiPrefix + (<any>window).Routes.questions_api_v1_career_path(slug);
    return Util.submitRequest(url, "get", params, successCallback, errorCallback);
  }
}
