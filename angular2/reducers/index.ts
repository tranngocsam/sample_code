/**
 * Copyright 2016, Fullstack.io, LLC.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

 /* tslint:disable:typedef */

import {
  Reducer,
  combineReducers
} from 'redux';

import {
  UsersState,
  UsersReducer
} from './users-reducer';

import { CareersState, CareersReducer } from "./careers-reducer";
export * from './users-reducer';

export interface AppState {
  users: UsersState;
  careers: CareersState;
}

const rootReducer: Reducer<AppState> = combineReducers<AppState>({
  users: UsersReducer,
  careers: CareersReducer
});

export default rootReducer;
