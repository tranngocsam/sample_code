/**
 * Copyright 2016, Fullstack.io, LLC.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Action, ActionCreator } from 'redux';
import store from '../app-store';
import Career from '../models/career';

export interface Question {
  id?: string;
  question?: string;
  created_at?: Date;
  updated_at?: Date;
  cover?: any
}

export const SET_QUESTIONS = '[Job] Set Questions';
export const SET_QUESTIONS_LOADING = '[Job] Set Questions Loading';
export const SET_QUESTIONS_LOADING_ERROR = '[Job] Set Questions Loading Error';
export interface SetQuestionsAction extends Action {
  payload: {
    results: Question[];
    pagination?: {
      count: number;
      per_page: number;
      current_page: number;
      total_pages: number;
    };
  };
}
export const setQuestions: ActionCreator<SetQuestionsAction> =
  (responseData) => ({
    type: SET_QUESTIONS,
    payload: responseData
  });


/* Set job */
export interface Job {
  id?: string;
  title?: string;
  created_at?: Date;
  updated_at?: Date;
  cover?: any;
  steps?: any;
  interest: any;
}

export const SET_JOB = '[Job] Set Job';
export const SET_JOB_LOADING = '[Job] Set Job Loading';
export const SET_JOB_LOADING_ERROR = '[Job] Set Job Loading Error';
export interface SetJobAction extends Action {
  payload: {
    results?: Job;
  };
}
export const setJob: ActionCreator<SetJobAction> =
  (responseData) => ({
    type: SET_JOB,
    payload: responseData
  });


export interface Guide {
  id?: string;
  first_name?: string;
  last_name?: string;
  created_at?: Date;
  updated_at?: Date;
  cover?: any
}

export const SET_GUIDES = '[Job] Set Guides';
export const SET_GUIDES_LOADING = '[Job] Set Guides Loading';
export const SET_GUIDES_LOADING_ERROR = '[Job] Set Guides Loading Error';
export interface SetGuidesAction extends Action {
  payload: {
    results?: Guide[];
    pagination?: {
      count: number;
      per_page: number;
      current_page: number;
      total_pages: number;
    };
  };
}
export function searchJobQuestions(jobId, params = {}) {
  store.dispatch({
    type: SET_QUESTIONS_LOADING
  });

  Career.careerFaqs(jobId, params, function(responseData) {
    store.dispatch({
      type: SET_QUESTIONS,
      payload: responseData
    });
  }, function(xhr) {
    store.dispatch({
      type: SET_QUESTIONS_LOADING_ERROR,
      payload: xhr
    });
  });
};

export function loadJob(jobId, params = {}) {
  store.dispatch({
    type: SET_JOB_LOADING
  });

  Career.loadCareer(jobId, params, function(responseData) {
    store.dispatch({
      type: SET_JOB,
      payload: responseData
    });
  }, function(xhr) {
    store.dispatch({
      type: SET_JOB_LOADING_ERROR,
      payload: xhr
    });
  });
}

export function loadJobGuides(jobId, params = {}) {
  store.dispatch({
    type: SET_GUIDES_LOADING
  });

  Career.careerGuides(jobId, params, function(responseData) {
    store.dispatch({
      type: SET_GUIDES,
      payload: responseData
    })
  }, function(xhr) {
    store.dispatch({
      type: SET_GUIDES_LOADING_ERROR,
      payload: xhr
    });
  });
}

export const SET_SUGGESTIONS_LOADING = '[Job] Set Suggestions Loading';
export const SET_SUGGESTIONS = '[Job] Set Suggestions';
export const SET_SUGGESTIONS_LOADING_ERROR = '[Job] Set Suggestions Loading Error';
export interface SetSuggestionsAction extends Action {
  payload: {
    results?: any;
  };
}

export function loadSuggestions(params) {
  store.dispatch({
    type: SET_SUGGESTIONS_LOADING
  });

  Career.suggest(params, function(responseData) {
    store.dispatch({
      type: SET_SUGGESTIONS,
      payload: responseData
    });
  }, function(xhr) {
    store.dispatch({
      type: SET_SUGGESTIONS_LOADING_ERROR,
      payload: xhr
    });
  });
}
