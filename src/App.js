import React, { Fragment, Component } from 'react';
import Header from './Header';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { ContextProvider } from './Context';
import Home from './Home';
import { ThemeProvider } from 'styled-components';
import theme from './theme';
import Show from './Show';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <ContextProvider>
        <ThemeProvider theme={theme}>
          <Fragment>
          <Header></Header>
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/home" />} />
            <Route path="/home" component={Home} />
            <Route path="/show/:id" component={Show} />
          </Switch>
          </Fragment>
        </ThemeProvider>
        </ContextProvider>
      </BrowserRouter>
    );
  }
}

export default App;
