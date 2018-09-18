import React, { createContext, Component } from 'react';

const Context = createContext({
  get: key => {
    return this.state[key];
  },
  set: (key, value) => {
    this.setState({ [key]: value });
  }
})

export const ContextConsumer = Context.Consumer;
export class ContextProvider extends Component {
  state = {}
  render() { 
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    )
  }
}

export function withContext(WrappedComponent) {
  const ContextWrapper = (props) => (
    <ContextConsumer>
      {context => <WrappedComponent {...props} context={context} />}
    </ContextConsumer>
  );
  return ContextWrapper;
}

export default { withContext, ContextConsumer, ContextProvider };
