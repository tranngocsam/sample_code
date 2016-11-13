/**
 * Copyright 2016, Fullstack.io, LLC.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Action } from 'redux';
import * as CareerActions from '../actions/career-actions';
import { Util } from "../utils/util";
import { createSelector } from 'reselect';

export interface CareersState {
  career: any;
  careerPaths: any;
  guides: any;
  guidesPaginationInfo: any;
  questions: any;
  questionsPaginationInfo: any;
  suggestions: any;
};

const initialState: CareersState = {
  career: undefined,
  careerPaths: undefined,
  guides: undefined,
  guidesPaginationInfo: undefined,
  questions: undefined,
  questionsPaginationInfo: undefined,
  suggestions: undefined
};

export const CareersReducer =
  function(state: CareersState = initialState, action: Action) {
  switch (action.type) {
    case CareerActions.SET_QUESTIONS:
      return Object.assign({}, state, {
        questions: (<CareerActions.SetQuestionsAction>action).payload.results,
        questionsPaginationInfo: Util.getPaginationInfo((<CareerActions.SetQuestionsAction>action).payload)
      });
    case "JOB_QUESTIONS_LOADING_ERROR":
      return Object.assign({}, state, {
        questions: [],
        questionsPaginationInfo: {}
      });
    case CareerActions.SET_JOB:
      let career = (<CareerActions.SetJobAction>action).payload.results;
      let paths = career.steps || [];
      let careerPaths = {};
      for (let i = 0; i < paths.length; i++) {
        let path = paths[i];
        careerPaths[path.group_name] = careerPaths[path.group_name] || [];
        careerPaths[path.group_name].push(path);
      }

      paths = career.interest.steps || [];
      for (let i = 0; i < paths.length; i++) {
        let path = paths[i];
        careerPaths[path.group_name] = careerPaths[path.group_name] || [];

        let added = false;
        for (let j = 0; j < careerPaths[path.group_name].length; j++) {
          added = added || careerPaths[path.group_name][j].id == path.id;
        }

        if (!added) {
          careerPaths[path.group_name].push(path);
        }
      }

      return Object.assign({}, state, {
        career: career,
        careerPaths: careerPaths
      });
    case "JOB_LOADING_ERROR":
      return Object.assign({}, state, {
        career: undefined,
        careerPaths: []
      });
    case CareerActions.SET_GUIDES:
      return Object.assign({}, state, {
        guides: (<CareerActions.SetGuidesAction>action).payload.results,
        guidesPaginationInfo: Util.getPaginationInfo((<CareerActions.SetGuidesAction>action).payload)
      });
    case "JOB_GUIDES_LOADING_ERROR":
      return Object.assign({}, state, {
        guides: undefined,
        guidesPaginationInfo: undefined
      });
    case CareerActions.SET_SUGGESTIONS:
      let results = (<CareerActions.SetSuggestionsAction>action).payload.results;
      let searchResults = [];
      let numberOfVisibleInterests = 3;
      let numberOfVisibleCareers = 3;

      if (results.searched_interests) {
        for (let i = 0; i < results.searched_interests.length; i++) {
          let interest = results.searched_interests[i];
          let r: CareerActions.Suggestion = {type: "Interest", index: i, value: interest.title, id: interest.id, slug: interest.slug};

          if (i < numberOfVisibleInterests - 1) {
            searchResults.push(r);
          } else if (i == numberOfVisibleInterests - 1) {
            var remaining = results.searched_interests.length - numberOfVisibleInterests;
            if (remaining > 0) {
              r.numberOfRemaining = remaining;
            }

            searchResults.push(r);
          }
        }
      }

      if (results.searched_careers) {
        for(let i = 0; i < results.searched_careers.length; i++) {
          let career = results.searched_careers[i];
          let r: CareerActions.Suggestion = {type: "Career", index: i, value: career.title, id: career.id, slug: career.slug};

          if (i < numberOfVisibleCareers - 1) {
            searchResults.push(r);
          } else if (i == numberOfVisibleCareers - 1) {
            let remaining = results.searched_careers.length - numberOfVisibleCareers;
            if (remaining > 0) {
              r.numberOfRemaining = remaining;
            }

            searchResults.push(r);
          }
        }
      }

      return Object.assign({}, state, {
        suggestions: searchResults
      });
    case CareerActions.SET_SUGGESTIONS_LOADING_ERROR:
      return Object.assign({}, state, {
        suggestions: []
      });
    default:
      return state;
  }
};
