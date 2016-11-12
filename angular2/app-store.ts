import { OpaqueToken } from '@angular/core';

export const AppStore = new OpaqueToken('App.store');

import {
  createStore,
  Store
} from 'redux';


import {
  AppState,
  default as reducer
} from './reducers';

let store: Store<any> = createStore<any>(
  reducer
);

export default store;
