import React, {Component, Fragment} from 'react';
import theme from '../theme';
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
  state = { popupOpen: false }

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

  render() {
    const {subtitles, selectedTrack} = this.props;
    return (
      <SubtitleStyle 
        title="Subtitulos"
        className="video-react-control video-react-button">
        {subtitles.length === 0 
          ? <Icon icon="subtitles" style={{opacity: 0.5}} />
          : (
            <Icon
              onClick={() => this.openPopup()}
              role="button"
              tabIndex="0"
              icon="subtitles"
            />
          )
        }
        {this.state.popupOpen && (
          <ul className="popup">
            {subtitles.map(subs => (
              <li
                className={selectedTrack === subs.id ? 'selected' : ''}
                onClick={() => this.emitSelection(subs.id)}
                key={subs.id}>
                {subs.label}
              </li>
            ))}
            <li onClick={() => this.emitSelection(null)}>Disabled</li>
          </ul>
        )}
      </SubtitleStyle>
    )
  }
}

export default SubtitleSelector;
