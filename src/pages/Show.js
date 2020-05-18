import React, {Component, Fragment} from 'react';
import Icon from '../components/Icon';
import Button from '../components/Button';
import styled from 'styled-components';
import config from '../config';
import Spinner from '../components/Spinner';
import theme from '../theme';
import Select from 'react-select';
import { Link } from 'react-router-dom';
import MagnetPlayer from '../components/MagnetPlayer';
import Footer from '../components/Footer';

const ShowStyle = styled.main`
  .back-btn {
    margin: 12px 0;
  }
  .layout {
    max-width: 1100px;
    margin: 0 auto;
    flex: 1 0 auto;
    display: flex;
    align-items: flex-start;
    padding: 0 ${theme.spaces[2]}px;
    @media (max-width: 768px) {
      flex-direction: column-reverse;
    }
  }
  @media (min-width: 768px) {
    .content {
      margin: 0 24px;
      margin-top: ${theme.spaces[6]}px;
    }
  }
  .poster, .fanart {
    max-width: 100%;
    border-radius: 4px;
  }
  .poster {
    box-shadow: 0 0 8px 2px rgba(0,0,0, 0.25);
  }
  .fanart {
    display: none;
  }
  @media (max-width: 768px) {
    .fanart {
      margin-top: 8px;
      display: block;
    }
  }
  .info {
    h1 {
      font-size: ${theme.fontSizes[4]}px;
      margin: ${theme.spaces[4]}px 0;
      text-shadow: ${theme.textShadow};
    }
    .status {
      font-size: ${theme.fontSizes[2]}px;
      margin: 12px 0;
      font-weight: bold;
    }
    .rating {
      opacity: 0.8;
    }
    .synopsis {
      margin: ${theme.spaces[4]}px 0;
      line-height: 1.6;
      font-size: 18px;
      max-width: 768px;
      text-align: justify;
    }
  }
  .background-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    max-width: 100vw;
    max-height: 72%;
    filter: brightness(0.2) blur(12px);
    z-index: -1;
    overflow: hidden;
    transform: translateX(-8px);
    background-size: cover;
  }

  @media (max-width: 768px) {
    .background-image {
      max-height: none;
    }
  }
`;

const Genres = styled.p`
  margin: 12px 0;
  max-width: 100vw;
  display: flex;
  flex-wrap: wrap;
  span {
    display: block;
    font-size: 12px;
    font-weight: bold;
    line-height: 14px;
    margin-top: 2px;
    padding: 2px 6px;
    border-radius: 2px;
    background-color: ${theme.colors.primary};
    white-space: nowrap;
    & + span {
      margin-left: ${theme.spaces[2]}px;
    }
  }
`;

const EpisodeList = styled.section`
  max-width: 300px;
  flex: 0 0 auto;
  margin-top: 24px;
  .select {
    color: ${theme.colors.black4};
    width: 180px;
    margin: ${theme.spaces[3]}px 0;
  }
  ul {
    border-radius: 4px;
    max-height: 360px;
    overflow-y: auto;
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
  @media (max-width: 768px) {
    > img, .back-btn {
      display: none;
    }
  }
`;

const SelectedEpSection = styled.section`
  width: 768px;
  max-width: calc(100vw - 16px);

  .actions {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    @media (max-width: 600px) {
      flex-direction: column;
    }
  }

  .ep-data {
    margin: ${theme.spaces[5]}px 0;
    h2 {
      margin-bottom: ${theme.spaces[2]}px;
    }
    .air-date {
      opacity: 0.8;
    }
    .overview {
      line-height: 1.5;
      font-size: 18px;
      margin: 20px 0;
      max-width: 768px;
      text-align: justify;
    }
  }

`;

const BackButton = () => (
  <Link to="/">
    <Button main className="back-btn">
      <Icon style={{marginRight: 4, marginBottom: 2}} icon="arrow_back" size="1em" />
      Volver
    </Button>
  </Link>
)

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
      Object.keys(data.images).forEach(key => {
        data.images[key] = data.images[key].replace("http", "https");
      });
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
    const torrent = episode.torrents[0];
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
        <div className="background-image" style={{ backgroundImage: `url("${show.images.fanart}")` }}></div>
        <div className="layout">
          <EpisodeList>
            {/* <BackButton /> */}
            <img className="poster" alt="poster" src={show.images.poster} />
            <Select className="select"
              isSearchable={false}
              value={selectedSeason}
              options={seasons}
              onChange={this.selectSeason} />
            <ul>
              {selectedSeason.episodes.map(ep => (
                <li key={ep.tvdb_id}
                  className={selectedEpisode && 
                    ep.episode === selectedEpisode.episode &&
                    ep.season === selectedEpisode.season ? 'selected' : ''}>
                  <Link to={this.makeEpisodeLink(ep)}>
                    <span className="number">{this.formatEpisodeNumber(ep)}</span>
                    <span>{ep.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </EpisodeList>
          <div className="content">
            <img className="fanart" alt="fanart" src={show.images.fanart} />
            <section className="info">
              <h1>{show.title}</h1>
              <p className="rating">{show.rating.percentage / 10} / 10</p>
              <p className="status">{show.year} - {show.status}</p>
              <Genres>
                {show.genres.map(genre => <span key={genre}>{genre}</span>)}
              </Genres>
              <p className="synopsis">{show.synopsis}</p>
            </section>
            {selectedEpisode && this.renderSelectedEpisode()}
          </div>
        </div>
        <Footer>Palomitas v4. 2018</Footer>
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
        <MagnetPlayer
          magnet={this.state.selectedTorrent.url}
          episodeData={{
            id: this.state.show._id,
            image: this.state.show.images.fanart,
            show_title: this.state.show.title,
            ep_title: ep.title,
            episode: ep.episode,
            season: ep.season,
          }}
        />
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
        <section className="ep-data">
          <h2>{this.formatEpisodeNumber(ep)} {ep.title}</h2>
          <p className="air-date">Emitido el {new Date(ep.first_aired * 1000).toLocaleDateString()}</p>
          <p className="overview">{ep.overview}</p>
        </section>
      </SelectedEpSection>
    );
  }

  render() {
    const loadingContent = (
      <Fragment>
        {/* <BackButton /> */}
        <Spinner />
      </Fragment>
    )
    return (
      <ShowStyle>
        {this.state.loading ? loadingContent : this.renderShow()}
      </ShowStyle>
    )
  }
}

export default Show;
