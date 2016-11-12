/**
 * Copyright 2016, Fullstack.io, LLC.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  Action,
  ActionCreator
} from 'redux';

import {
  User
} from '../models/user';

import store from '../app-store';
import UserSession from "../models/user-session";

/**
 * UserActions specifies action creators concerning Users
 */
export const SET_CURRENT_USER = '[User] Set Current';
export interface SetCurrentUserAction extends Action {
  payload: User;
}

export const setCurrentUser: ActionCreator<SetCurrentUserAction> =
  (user) => ({
    type: SET_CURRENT_USER,
    payload: user
  });

export function loadCurrentUser() {
  UserSession.currentUser(false, function(user) {
    store.dispatch({
      type: SET_CURRENT_USER,
      payload: user
    })
  });
};

export function login(user) {
  UserSession.login(user, function(loadedUser) {
    store.dispatch({
      type: SET_CURRENT_USER,
      payload: loadedUser
    })
  });
};
