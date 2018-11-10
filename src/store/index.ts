import { Action, applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { ActionsObservable, combineEpics, createEpicMiddleware, StateObservable } from 'redux-observable';
import { Observable } from 'rxjs';

// REDUCERS AND EPICS EXPORTS
import appStateReducer, {
	epics as appStateEpics,
	init,
	IState as IAppStateState,
} from './app/state';
import authUserReducer, {
	epics as authUserEpics,
	IState as IAuthUserState,
} from './auth/user';

// STORE INTERFACE
export interface IRootState {
	appState: IAppStateState,
	authUser: IAuthUserState,
}

// COMBINED REDUCERS
const rootReducer = combineReducers<IRootState>({
	appState: appStateReducer,
	authUser: authUserReducer,
});

// COMBINED EPICS
const rootEpic = combineEpics(
	appStateEpics,
	authUserEpics,
);

export type Epic = (action$: ActionsObservable<Action<any>>, state$: StateObservable<IRootState>) => Observable<Action<any>>;
export type Selector<Value, Props = any> = (state: IRootState, props?: Props) => Value;

const epicMiddleware = createEpicMiddleware<any>();
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
	rootReducer,
	composeEnhancers(applyMiddleware(epicMiddleware)),
)

export default store;

epicMiddleware.run(rootEpic);

store.dispatch(init());
