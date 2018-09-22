import React, {Component} from 'react';
import Select from 'react-select';
import config from './config';
import theme from './theme';
import styled from 'styled-components';
import Spinner from './Spinner';
import Icon from './Icon';

const SubtitleStyle = styled.div`
  margin-top: ${theme.spaces[3]}px;
  label {
    display: block;
    margin-bottom: ${theme.spaces[2]}px;
  }
  .select {
    color: ${theme.colors.black4};
    width: 200px;
  }
  ul {
    margin-top: ${theme.spaces[3]}px;
    .material-icons {
      margin-right: ${theme.spaces[3]}px;
      margin-bottom: ${theme.spaces[3]}px;
    }
    p {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
`;

class SubtitleSelector extends Component {
  state = {
    loading: false,
    selectedLang: config.sublangs.find(s => s.value === 'es'),
    subtitles: {}
  }

  componentDidMount() {
    this.fetchSubtitles();
  }

  componentDidUpdate(prevProps, prevState) {
    const sameProps = prevProps.episode === this.props.episode &&
      prevProps.season === this.props.season &&
      prevProps.id === this.props.id;
    if (!sameProps) {
      this.fetchSubtitles();
    }
  }

  fetchSubtitles() {
    this.setState({loading: true, subtitles: {}})
    const {id, episode, season} = this.props;
    const url = `${config.subtitleApi}/search?imdbid=${id}&season=${season}&episode=${episode}`;
    fetch(url).then(res => res.json())
    .then(data => {
      this.setState({loading: false, subtitles: data});
    })
  }

  render() {
    const {subtitles, selectedLang} = this.state;
    const subs = subtitles[selectedLang.value] || [];
    return (
      <SubtitleStyle>
        <label>Idioma: </label>
        <Select 
          className="select"
          value={this.state.selectedLang}
          options={config.sublangs}
          onChange={val => this.setState({selectedLang: val})}
        />
        {this.state.loading && <Spinner />}
        <ul>
          {subs.map(sub => (
            <li key={sub.id}>
              <Icon icon="play_arrow" size={24} />
              <Icon icon="save_alt" size={24} />
              <p>{sub.filename}</p>
            </li>
          ))}
        </ul>
      </SubtitleStyle>
    )
  }
}

export default SubtitleSelector;
