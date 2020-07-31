import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import 'antd/dist/antd.css';
import { applyMiddleware, createStore } from 'redux';
import promiseMiddleware from 'redux-promise';
import ReduxThunk from 'redux-thunk';
import Reducer from './_reducer';

// 보여주고 싶은 컴포넌트 넣기

// promise와 thunk 미들웨어로 객체 외의 function과 promise도 같이 받을 수 있게 함
const createStoreWithMiddleware = applyMiddleware(
  promiseMiddleware,
  ReduxThunk,
)(createStore);
// redux store 생성

ReactDOM.render(
  <Provider
    store={createStoreWithMiddleware(
      Reducer,
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__(),
      //크롬 웹스토어에서 redux devtools 추가
    )}
  >
    <App />
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
