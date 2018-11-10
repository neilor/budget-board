import { combineEpics } from 'redux-observable';
import actionCreatorFactory from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers/dist';
import { filter, mergeMap, map } from 'rxjs/operators';
import firebase from '../../services/firebase';
import { authState } from 'rxfire/auth';

import { Epic, Selector } from '..';

import { init } from '../app/state';

export type AuthStatus =
  | 'pristine'
  | 'guest'
  | 'authenticated';

const actionCreator = actionCreatorFactory('APP::AUTH');
export const fetchAuthState = actionCreator<{ uid: string | null }>('FETCH_AUTH_STATE');

export interface IState {
  status: AuthStatus;
  uid?: string | null;
}

const INITIAL_STATE: IState = {
  status: 'pristine',
};

export default reducerWithInitialState(INITIAL_STATE)
  .case(fetchAuthState, (state: IState, { uid }) => ({
    ...state,
    status: uid ? 'authenticated' : 'guest',
    uid,
  }))
  .build();

export const selectIsAuthenticated: Selector<boolean> = ({ authUser }) => !!authUser.uid;
export const selectAuthStatus: Selector<AuthStatus> = ({ authUser }) => authUser.status;

const observeFirebaseAuthStateEpic: Epic = (action$) => action$.pipe(
  filter(init.match),
  mergeMap(() => authState(firebase.auth()).pipe(
    map((user) => fetchAuthState({ uid: user ? user.uid : null }))
  )),
);

export const epics = combineEpics(
  observeFirebaseAuthStateEpic,
);
