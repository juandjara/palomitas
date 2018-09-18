import React from 'react';
import styled from 'styled-components';
import Headroom from 'react-headroom';
import Icon from './Icon';
import theme from './theme';
import { withRouter } from 'react-router-dom';

const HeaderStyle = styled.header`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 8px;
  color: white;
  background-color: ${theme.colors.black2};
  .logo {
    height: 44px;
    margin-right: 8px;
  }
  h2 {
    font-weight: normal;
    margin-left: 4px;
  }
  .search-box {
    background-color: ${theme.colors.black4};
    border-radius: 8px;
    margin: 0 auto;
    input {
      font-size: 14px;
      line-height: 26px;
      padding: 2px 8px;
      outline: none;
      border: 2px solid transparent;
      background: transparent;
      color: white;
      min-width: 200px;
    }
    .material-icons {
      opacity: 0.5;
      padding-right: 4px;
    }
  }
`;

class Header extends React.Component {
  state = {
    search: ''
  }
  handleSearch = (ev) => {
    this.setState({search: ev.target.value})
  }
  handleKeyUp = (ev) => {
    if (ev.which === 13) {
      this.props.history.push(`/home?search=${this.state.search}`);
    }
  }
  render() {
    return (
      <Headroom>
        <HeaderStyle>
          <img alt="logo" className="logo" src="palomitas-outline.png"></img>
          <h2>Palomitas</h2>
          <div style={{flexGrow: 1}}></div>
          <div className="search-box">
            <input 
              value={this.state.search}
              onChange={this.handleSearch}
              onKeyUp={this.handleKeyUp}
              placeholder="¿Que quieres ver?" />
            <Icon icon="search" />
          </div>
        </HeaderStyle>
      </Headroom>
    );
  }
}

export default withRouter(Header);
