import React, {Component, Fragment} from 'react';
import config from './config';
import theme from './theme';
import styled from 'styled-components';
import Spinner from './Spinner';
import Icon from './Icon';

const SubtitleStyle = styled.div`
  position: relative;
  .material-icons {
    cursor: pointer;
    font-size: 18px;
    line-height: 30px;
  }
  .popup {
    position: absolute;
    bottom: 100%;
    right: 0;
    margin-bottom: 2px;
    border-radius: 4px;
    border: 1px solid ${theme.colors.black4};
    background: ${theme.colors.black3};
    color: white;
    max-height: 200px;
    min-width: 140px;
    overflow-y: auto;
    text-align: left;
    padding: 4px 0;
    li {
      font-size: 12px;
      font-weight: 600;
      font-family: sans-serif;
      padding: 6px 4px;
      &.selected, &:hover {
        color: ${theme.colors.black2};
        background: ${theme.colors.grey1};
      }
    }
  }
`;

class SubtitleSelector extends Component {
  state = { loading: false }

  componentDidMount() {
    this.fetchSubtitles();
  }

  componentDidUpdate(prevProps) {
    const sameProps = prevProps.episode === this.props.episode &&
      prevProps.season === this.props.season &&
      prevProps.id === this.props.id;
    if (!sameProps) {
      this.fetchSubtitles();
    }
  }

  fetchSubtitles() {
    this.emitSubtitles([]);
    this.setState({loading: true})
    const {id, episode, season} = this.props;
    const url = `${config.subtitleApi}/search?imdbid=${id}&season=${season}&episode=${episode}`;
    fetch(url).then(res => res.json())
    .then(data => {
      const subtitles = this.processSubtitles(data);
      this.setState({loading: false});
      this.emitSubtitles(subtitles);
      const subs_es = subtitles.find(s => s.langcode === 'es');
      const subs_en = subtitles.find(s => s.langcode === 'en');
      const defaultSelection = subs_es ? subs_es.id : subs_en && subs_en.id;
      this.emitSelection(defaultSelection);
    })
  }
  
  processSubtitles(data) {
    return Object.keys(data)
    .reduce((acum, key) => {
      const elem = data[key];
      const newSubs = elem.map((subs, index) => ({
        id: subs.id,
        label: `${subs.lang} ${index > 0 ? index + 1 : ''}`,
        langcode: subs.langcode,
        url: subs.links.vtt
      }));
      return acum.concat(newSubs);
    }, []).sort((a,b) => {
      if (a.label > b.label) {
        return 1;
      }
      if (a.label < b.label) {
        return -1;
      }
      return 0;
    });
  }

  openPopup = () => {
    this.setState({popupOpen: true});
    setTimeout(() => {
      window.addEventListener('click', this.closePopup);    
    }, 100);
  }

  closePopup = () => {
    this.setState({popupOpen: false});
    window.removeEventListener('click', this.closePopup);
  }

  emitSelection(id) {
    if (typeof this.props.subtitlesSelected === 'function') {
      this.props.subtitlesSelected(id);
    }
  }

  emitSubtitles(subtitles) {
    if (typeof this.props.subtitlesLoaded === 'function') {
      this.props.subtitlesLoaded(subtitles);
    }
  }

  render() {
    const {subtitles, selectedTrack} = this.props;
    return (
      <SubtitleStyle 
        className="video-react-control video-react-button">
        {this.state.loading ? (
          <Icon icon="subtitles" style={{opacity: 0.5}} />
        ) : (
          <Icon
            onClick={() => this.openPopup()}
            role="button"
            tabIndex="0"
            icon="subtitles"
          />
        )}
        {this.state.popupOpen && (
          <ul className="popup">
            {this.state.loading ? 
              <Spinner /> : 
              <Fragment>
                {subtitles.map(subs => (
                  <li
                    className={selectedTrack === subs.id ? 'selected' : ''}
                    onClick={() => this.emitSelection(subs.id)}
                    key={subs.id}>
                    {subs.label}
                  </li>
                ))}
                <li onClick={() => this.emitSelection(null)}>Disabled</li>
              </Fragment>
            }
          </ul>
        )}
      </SubtitleStyle>
    )
  }
}

export default SubtitleSelector;
