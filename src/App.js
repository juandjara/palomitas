import React, { Fragment, Component } from 'react';
import Header from './components/Header';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Home from './pages/Home';
import Show from './pages/Show';
import { ThemeProvider } from 'styled-components';
import theme from './theme';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
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
      </BrowserRouter>
    );
  }
}

export default App;
