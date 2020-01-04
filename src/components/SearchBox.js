import React, { Component } from 'react';
import styled from 'styled-components';
import Icon from './Icon';
import theme from '../theme';
import { withRouter } from 'react-router-dom'

const SearchBoxStyles = styled.div`
  background-color: ${theme.colors.black4};
  border-radius: 8px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  cursor: pointer;
  input {
    font-size: 14px;
    line-height: 26px;
    padding: 2px 8px;
    outline: none;
    border: 2px solid transparent;
    background: transparent;
    color: white;
    flex: 1 1 auto;
    overflow: hidden;
    width: 175px;
    transition: max-width 0.25s ease, padding 0.25s ease;
    ${props => props.closed ? `
      padding: 0;
      max-width: 0;
    ` : ''}
  }
  .material-icons {
    opacity: 0.5;
    padding-right: 4px;
  }
`

class SearchBox extends Component {
  inputNode = null
  containerNode = null
  state = {
    search: '',
    inputClosed: true
  }
  handleSearch = (ev) => {
    this.setState({search: ev.target.value})
  }
  handleKeyUp = (ev) => {
    if (ev.which === 13) {
      this.props.history.push(`/home?search=${this.state.search}`);
      if (this.inputNode) {
        this.inputNode.blur();
      }
    }
  }
  open () {
    if (!this.state.inputClosed) {
      return
    }
    this.setState(
      { inputClosed: false },
      () => {
        if (this.inputNode) {
          this.inputNode.focus()
        }
        setTimeout(() => {
          this.registerPopupClose()
        })
      }
    )
  }
  registerPopupClose () {
    const closeHandler = (ev) => {
      if (this.containerNode && this.containerNode.contains(ev.target)) {
        return
      }
      this.setState({ inputClosed: true })
      window.removeEventListener('click', closeHandler)
    }
    window.addEventListener('click', closeHandler)
  }
  render () {
    return (
      <SearchBoxStyles
        innerRef={node => { this.containerNode = node }}
        onClick={() => this.open()}
        closed={this.state.inputClosed}
        className="search-box">
        <input
          ref={node => this.inputNode = node}
          value={this.state.search}
          onChange={this.handleSearch}
          onKeyUp={this.handleKeyUp}
          placeholder="¿Que quieres ver?" />
        <Icon icon="search" />
      </SearchBoxStyles>
    )
  }
}

export default withRouter(SearchBox)
