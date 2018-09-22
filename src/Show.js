import React, {Component, Fragment} from 'react';
import Icon from './Icon';
import Button from './Button';
import styled from 'styled-components';
import config from './config';
import Spinner from './Spinner';
import theme from './theme';
import Select from 'react-select';
import { Link } from 'react-router-dom';
import SubtitleSelector from './SubtitleSelector';
import MagnetPlayer from './MagnetPlayer';

const ShowStyle = styled.main`
  > button {
    margin: 8px;
    margin-bottom: ${theme.spaces[2]}px;
  }
  .layout {
    display: flex;
    align-items: flex-start;
    padding: 0 ${theme.spaces[2]}px;
  }
  .poster {
    max-width: 100%;
  }
  .info {
    h1 {
      font-size: ${theme.fontSizes[4]}px;
      margin: ${theme.spaces[4]}px 0;
      text-shadow: ${theme.textShadow};
    }
    .status {
      font-size: ${theme.fontSizes[2]}px;
      margin-top: ${theme.spaces[2]}px;
      font-weight: bold;
    }
    .synopsis {
      margin: ${theme.spaces[4]}px 0;
      line-height: 1.5;
      max-width: 768px;
      text-align: justify;
    }
  }
  footer {
    text-align: right;
    margin-top: 1em;
    padding: 1em;
    color: white;
    background-color: ${theme.colors.black3};
  }
`;

const Genres = styled.p`
  margin: ${theme.spaces[2]}px 0;
  span {
    font-size: 12px;
    font-weight: 600;
    line-height: 4px;
    padding: 2px 6px;
    border-radius: 2px;
    background-color: ${theme.colors.primary};
    & + span {
      margin-left: ${theme.spaces[2]}px;
    }
  }
`;

const EpisodeList = styled.section`
  max-width: 300px;
  flex: 0 0 auto;
  margin-right: ${theme.spaces[3]}px;
  .select {
    color: ${theme.colors.black4};
    width: 180px;
    margin: ${theme.spaces[3]}px 0;
  }
  li {
    color: ${theme.colors.black4};
    background-color: white;
    .number {
      display: inline-block;
      min-width: 40px;
      margin-right: ${theme.spaces[2]}px;
    }
    &:first-child {
      border-radius: 4px 4px 0 0;
    }
    &:last-child {
      border-radius: 0 0 4px 4px;
    }
    &:hover {
      background-color: ${theme.colors.grey1};
    }
    &.selected {
      background-color: ${theme.colors.grey1};
      pointer-events: none;
    }
    a {
      display: block;
      padding: ${theme.spaces[3]}px ${theme.spaces[2]}px;
    }
  }
`;

const SelectedEpSection = styled.section`
  margin-top: ${theme.spaces[6]}px;
  .subtitles {
    flex: 0 0 300px;
    margin-left: ${theme.spaces[3]}px;
  }
  h2 {
    margin-bottom: ${theme.spaces[2]}px;
  }
  small {
    font-size: 14px;
  }
  .overview {
    line-height: 1.5;
    margin: ${theme.spaces[4]}px 0;
    max-width: 768px;
    text-align: justify;
  }
  .actions {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-top: ${theme.spaces[5]}px;
    margin-bottom: ${theme.spaces[2]}px;
  }
`;

class Show extends Component {
  state = {
    loading: true,
    show: null,
    seasons: [],
    selectedSeason: {
      episodes: []
    },
    selectedEpisode: null,
    selectedTorrent: null
  }

  componentDidMount() {
    this.fetchShow();
  }

  componentDidUpdate(prevProps, prevState) {
    const oldSearch = prevProps.location.search;
    const search = this.props.location.search;
    const epNumber = this.getEpNumber(this.props);
    if (epNumber && oldSearch !== search && this.state.seasons.length > 0) {
      this.selectEpisode(epNumber);
    }
  }

  fetchShow() {
    const id = this.props.match.params.id;
    const url = `${config.catalogApi}/show/${id}`;
    fetch(url).then(res => res.json())
    .then(data => {
      const seasonMap = data.episodes.reduce((acum, elem) => {
        acum[elem.season] = acum[elem.season] || {
          label: `Temporada ${elem.season}`,
          value: elem.season,
          episodes: []
        };
        acum[elem.season].episodes.push(elem);
        return acum;
      }, {});
      const seasons = Object.keys(seasonMap).map(key => seasonMap[key]);
      seasons.forEach(season => {
        season.episodes.sort((a,b) => {
          return a.episode - b.episode;
        })
      })
      this.setState({
        show: data,
        seasons,
        loading: false
      }, () => {
        const epNumber = this.getEpNumber(this.props) || seasons[0].episodes[0];
        this.selectEpisode(epNumber);
      });
    });
  }

  selectSeason = (season) => {
    this.setState({selectedSeason: season});
  }

  selectEpisode(epNumber) {
    const season = this.state.seasons.find(s => s.value === epNumber.season);
    const episode = season && season.episodes.find(e => e.episode === epNumber.episode);
    const torrent = episode.torrents['720p'] || episode.torrents[0];
    this.setState({
      selectedSeason: season,
      selectedEpisode: episode,
      selectedTorrent: torrent
    })
  }

  getEpNumber({location}) {
    const params = new URLSearchParams(location.search.replace('?', ''));
    const epString = params.get('ep');
    const regex = /s(\d+)e(\d+)/;
    const match = regex.exec(epString);
    return match && {
      season: Number(match[1]),
      episode: Number(match[2])
    }
  }

  getNextEpisodeLink() {
    const {seasons, selectedSeason, selectedEpisode} = this.state
    const nextEpIndex = selectedSeason.episodes.indexOf(selectedEpisode) + 1;
    let nextEp = selectedSeason.episodes[nextEpIndex];
    if (!nextEp) {
      const nextSeasonIndex = seasons.indexOf(selectedSeason) + 1;
      const nextSeason = seasons[nextSeasonIndex];
      if (nextSeason) {
        nextEp = nextSeason.episodes[0];
      }
    }
    return nextEp && this.makeEpisodeLink(nextEp);
  }

  makeEpisodeLink(ep) {
    const id = this.state.show._id;
    return `/show/${id}?ep=s${ep.season}e${ep.episode}`;
  }

  formatEpisodeNumber(ep) {
    return `${ep.season}x${ep.episode < 10 ? `0${ep.episode}` : ep.episode}`;
  }

  goBack() {
    this.props.history.goBack();
  }

  renderShow() {
    const {show, seasons, selectedSeason, selectedEpisode} = this.state;
    return (
      <Fragment>
        <div className="layout">
          <EpisodeList>
            <img className="poster" alt="poster" src={show.images.poster} />
            <Select className="select" 
              value={selectedSeason} 
              options={seasons}
              onChange={this.selectSeason} />
            <ul>
              {selectedSeason.episodes.map(ep => (
                <li key={ep.tvdb_id} 
                  className={selectedEpisode && ep.episode === selectedEpisode.episode ? 'selected' : ''}>
                  <Link to={this.makeEpisodeLink(ep)}>                
                    <span className="number">{this.formatEpisodeNumber(ep)}</span>
                    <span>{ep.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </EpisodeList>
          <div>
            <section className="info">
              <h1>{show.title}</h1>
              <p>{show.rating.percentage / 10} / 10</p>
              <p className="status">{show.year} - {show.status}</p>
              <Genres>
                {show.genres.map(genre => <span key={genre}>{genre}</span>)}
              </Genres>
              <p className="synopsis">{show.synopsis}</p>
            </section>
            {selectedEpisode && this.renderSelectedEpisode()}
          </div>
        </div>
        <footer>Palomitas v4. 2018</footer>
      </Fragment>
    )
  }

  renderSelectedEpisode() {
    const ep = this.state.selectedEpisode;
    const nextEpLink = this.getNextEpisodeLink();
    const selectedTorrent = this.state.selectedTorrent;
    const torrents = Object.keys(ep.torrents)
    .filter(key => key !== '0')
    .map(key => ({label: key, ...ep.torrents[key]}));
    return (
      <SelectedEpSection>
        <h2>{this.formatEpisodeNumber(ep)} {ep.title}</h2>
        <p>Emitido el {new Date(ep.first_aired * 1000).toLocaleDateString()}</p>
        <p className="overview">{ep.overview}</p>
        <div className="actions">
            <div className="quality-selector">
              <label>Calidad: </label>
              {torrents.map(torrent => (
                <Button 
                  style={{opacity: 1}}
                  disabled={torrent.url === selectedTorrent.url}
                  main={torrent.url === selectedTorrent.url} 
                  onClick={() => this.setState({selectedTorrent: torrent})}
                  key={torrent.label}>{torrent.label}</Button>
              ))}
            </div>
            {nextEpLink && (
              <Link to={nextEpLink}>
                <Button main>
                  <Icon style={{marginRight: 4}} icon="arrow_forward" size="1em" />
                  Siguiente episodio
                </Button>
              </Link>
            )}
          </div>
        <MagnetPlayer magnet={this.state.selectedTorrent.url} />
      </SelectedEpSection>
    );
  }

  render() {
    return (
      <ShowStyle>
        <Button main onClick={() => this.goBack()}>
          <Icon style={{marginRight: 4, marginBottom: 2}} icon="arrow_back" size="1em" />
          Volver
        </Button>
        {this.state.loading ? <Spinner /> : this.renderShow()}
      </ShowStyle>
    );
  }
}

export default Show;
