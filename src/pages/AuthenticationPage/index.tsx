import * as React from 'react';
import firebase from '../../services/firebase';
import FirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

export default class AuthenticationPage extends React.PureComponent {
  render() {
    return (
      <FirebaseAuth
        firebaseAuth={firebase.auth()}
        uiConfig={{
          // Popup signin flow rather than redirect flow.
          signInFlow: 'popup',
          // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
          signInSuccessUrl: '/',
          // We will display Google and Facebook as auth providers.
          signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.FacebookAuthProvider.PROVIDER_ID,
          ],
        }}
      />
    );
  }
}
