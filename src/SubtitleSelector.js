import React, {Component} from 'react';
import Select from 'react-select';
import config from './config';
import theme from './theme';
import styled from 'styled-components';

const SubtitleStyle = styled.div`
  margin-top: ${theme.spaces[3]}px;
  label {
    display: block;
    margin-bottom: ${theme.spaces[2]}px;
  }
  .select {
    color: ${theme.colors.black4};
  }
`;

class SubtitleSelector extends Component {
  state = {
    selected: null
  }
  render() {
    return (
      <SubtitleStyle>
        <label>Idioma: </label>
        <Select 
          className="select"
          value={this.state.selected}
          options={config.sublangs}
        />
      </SubtitleStyle>
    )
  }
}

export default SubtitleSelector;
