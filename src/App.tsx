import * as React from 'react';
import { Switch, Route, Redirect, withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';

// UI
import { Spin } from 'antd';

// Store
import { IRootState } from './store';
import { selectAuthStatus, AuthStatus } from './store/auth/user';

// Layouts
import { AppLayout } from './layouts';

// Pages
import {
  AuthenticationPage,
  HomePage,
} from './pages';

import './App.css';

interface IReduxStateProps {
  authStatus: AuthStatus;
}

type IProps = IReduxStateProps & RouteComponentProps;

const stateMap = (state: IRootState): IReduxStateProps => ({
  authStatus: selectAuthStatus(state),
});

class App extends React.Component<IProps> {
  public render() {
    switch (this.props.authStatus) {
      case 'pristine': return (
        <div className="App">
          <Spin />
        </div>
      );

      case 'authenticated': return (
        <AppLayout>
          <Switch >
            <Route exact path="/" component={HomePage} />
            <Redirect to="/" />
          </Switch>
        </AppLayout>
      );

      default: return (
        <div className="App">
          <Switch>
            <Route path="/auth" component={AuthenticationPage} />
            <Redirect to="/auth" />
          </Switch>
        </div>
      );
    }
  }
}

export default connect<IReduxStateProps>(stateMap)(withRouter(App));
