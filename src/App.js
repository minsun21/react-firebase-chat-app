import React, { useEffect } from 'react'
import './App.css';
import {
  Switch,
  Route,
  useHistory,
} from "react-router-dom";
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import ChatPage from './components/ChatPage/ChatPage';
import firebase from './firebase';

import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './redux/actions/user_action';

function App() {
  let history = useHistory();
  let dispatch = useDispatch();
  const isLoading = useSelector(state => state.user.isLoading);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log(user.displayName)
        history.push('/');
        dispatch(setUser(user));
      } else {
        history.push('/login')
      }
    });
  }, []);

  if (isLoading) {
    return (
      <div>...loading</div>
    )
  } else {
    return (
      <Switch>
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/register" component={RegisterPage} />
        <Route exact path="/" component={ChatPage} />
      </Switch>
    );
  }
}

export default App;
