import React, {Component} from 'react';
import { getWatchedEpisodes, removeWatchedEpisode } from './lastWatchedService';
import styled from 'styled-components';
import Button from './Button';
import Icon from './Icon';
import { Link } from 'react-router-dom';

const LastWatchedStyles = styled.ul`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  overflow-x: auto;
  padding: 8px;
  li {
    margin-right: 16px;
    position: relative;
    a {
      display: block;
    }
    img {
      width: 280px;
    }
    .info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      background: rgba(0,0,0, 0.7);
      border-radius: 0 0 4px 4px;
      color: white;
      padding: 8px;
      padding-right: 0;
      p {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: 300;
        strong {
          font-weight: bold;
        }
      }
      button {
        margin: 0;
      }
    }
  }
`;

class LastWatched extends Component {
  state = {
    episodes: getWatchedEpisodes()
  }
  removeEpisode(ep) {
    removeWatchedEpisode(ep);
    this.setState({episodes: getWatchedEpisodes()})
  }
  makeEpisodeLink(ep) {
    return `/show/${ep.id}?ep=s${ep.season}e${ep.episode}`;
  }
  formatEpisodeNumber(ep) {
    return `${ep.season}x${ep.episode < 10 ? `0${ep.episode}` : ep.episode}`;
  }
  render() {
    const episodes = getWatchedEpisodes()
    return episodes.length > 0 && (
      <LastWatchedStyles>
        <h2 style={{paddingLeft: 8}}>&Uacute;ltimamente has visto:</h2>
        {episodes.map(ep => (
          <li key={ep.id}>
            <Link to={this.makeEpisodeLink(ep)}>
              <img alt="fanart" src={ep.image} />
            </Link>
            <div className="info">
              <p>
                <strong>{ep.show_title}</strong>
                <br />
                <span>
                  {this.formatEpisodeNumber(ep)}
                  {' - '}
                  {ep.ep_title}
                </span>
              </p>
              <Button clear onClick={() => this.removeEpisode(ep)}>
                <Icon icon="clear" size={20} />
              </Button>
            </div>
          </li>
        ))}
      </LastWatchedStyles>
    );
  }
}


export default LastWatched;
