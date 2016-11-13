import { Action, ActionCreator } from 'redux';
import store from '../app-store';
import UserSession from "../models/user-session";


export interface User {
  id: string;
  name: string;
  avatarSrc: string;
  isClient?: boolean;
}
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
