import React from 'react';
import styled from 'styled-components';
import Headroom from 'react-headroom';
import theme from '../theme';
import { Link } from 'react-router-dom';
import SearchBox from './SearchBox'
import Icon from './Icon';

const HeaderStyle = styled.header`
  padding: 8px 12px;
  color: white;
  background-color: ${theme.colors.black2};
  position: relative;
  > a {
    display: flex;
    color: inherit;
    align-items: center;
  }
  .logo {
    height: 40px;
  }
  h2 {
    font-size: 28px;
    line-height: 40px;
    font-weight: 300;
    margin-left: 12px;
  }
  .search-box {
    position: absolute;
    top: 50%;
    right: 12px;
    transform: translateY(-50%);
  }
`;

function Header () {
  const isHome = window.location.pathname === '/home'
  return (
    <Headroom>
      <HeaderStyle>
        <Link to="/">
          <img alt="logo" className="logo" src="/palomitas-outline.png"></img>
          <h2 title="Volver al catálogo de series">
            {!isHome && (
              <Icon style={{marginRight: 4, marginBottom: 2}} icon="arrow_back" size="1em" />
            )}
            <small>Palomitas</small>
          </h2>
        </Link>
        <div style={{flexGrow: 1}}></div>
        <SearchBox />
      </HeaderStyle>
    </Headroom>
  )
}

export default Header;
