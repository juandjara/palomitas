import React, {Component} from 'react';
import { getWatchedEpisodes, removeWatchedEpisode } from './services/lastWatchedService';
import styled from 'styled-components';
import Button from './components/Button';
import Icon from './components/Icon';
import { Link } from 'react-router-dom';

const LastWatchedStyles = styled.div`
  max-width: 100vw;
  margin-bottom: 1rem;
  h2 {
    margin-top: 2.5rem;
    padding: 0 12px;
  }
  ul {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    overflow-x: auto;
    padding: 8px 0;
    margin: 0 12px;
  }
  li {
    margin-right: 12px;
    position: relative;
    transition: transform 0.3s ease;
    &:hover {
      transform: scale(1.05);
    }
    a {
      display: block;
    }
    img {
      width: 280px;
      border-radius: 4px;
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
        <h2>&Uacute;ltimamente has visto:</h2>
        <ul>
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
        </ul>
      </LastWatchedStyles>
    );
  }
}


export default LastWatched;
