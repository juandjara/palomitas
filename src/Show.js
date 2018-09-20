import React, {Component} from 'react';
import Icon from './Icon';
import Button from './Button';
import styled from 'styled-components';
import config from './config';
import Spinner from './Spinner';
import theme from './theme';
import Select from 'react-select';
import { Link } from 'react-router-dom';

const ShowStyle = styled.main`
  padding: 8px;
  > button {
    margin: 0;
    margin-bottom: ${theme.spaces[2]}px;
  }
  .layout {
    display: flex;
    align-items: flex-start;
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
      margin: ${theme.spaces[5]}px 0;
      line-height: 1.5;
      max-width: 768px;
      text-align: justify;
    }
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
    padding: ${theme.spaces[3]}px ${theme.spaces[2]}px;
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
  }
`;

const SelectedEpSection = styled.section`
  margin-top: ${theme.spaces[4]}px;
  display: flex;
  align-items: flex-start;
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
`;

function parseEpisodeNumber(epString) {
  const regex = /s(\d+)e(\d+)/;
  const match = regex.exec(epString);
  return match && {
    season: Number(match[1]),
    episode: Number(match[2])
  }
}

class Show extends Component {
  state = {
    loading: true,
    show: null,
    seasons: [],
    selectedSeason: {
      episodes: []
    },
    selectedEpisode: null
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const search = nextProps.location.search;
    const params = new URLSearchParams(search.replace('?', ''));
    if (!params.get('ep') || !prevState.seasons.length) {
      return null;
    }
    const epNumber = parseEpisodeNumber(params.get('ep'));
    const season = prevState.seasons.find(s => s.value === epNumber.season);
    const episode = season && season.episodes.find(e => e.episode === epNumber.episode);
    return {
      ...prevState,
      selectedEpisode: episode
    }
  }

  componentDidMount() {
    this.fetchShow();
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
      this.setState({
        show: data,
        seasons,
        loading: false
      });
      this.onSelectSeason(seasons[0]);
    });
  }

  goBack() {
    this.props.history.goBack();
  }

  onSelectSeason = (season) => {
    season.episodes.sort((a,b) => {
      return a.episode - b.episode;
    })
    const selectedEpisode = season.episodes[0];
    this.setState({selectedSeason: season, selectedEpisode});
  }

  getEpisodeLink(ep) {
    const id = this.state.show._id;
    return `/show/${id}?ep=s${ep.season}e${ep.episode}`;
  }

  getEpisodeNumber(ep) {
    return `${ep.season}x${ep.episode < 10 ? `0${ep.episode}` : ep.episode}`;
  }

  renderShow() {
    const {show, seasons, selectedSeason, selectedEpisode} = this.state;
    return (
      <div className="layout">
        <EpisodeList>
          <img className="poster" alt="poster" src={show.images.poster} />
          <Select className="select" 
            value={selectedSeason} 
            options={seasons}
            onChange={this.onSelectSeason} />
          <ul>
            {selectedSeason.episodes.map(ep => (
              <li key={ep.tvdb_id}>
                <Link to={this.getEpisodeLink(ep)}>                
                  <span className="number">{this.getEpisodeNumber(ep)}</span>
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
    )
  }

  renderSelectedEpisode() {
    const ep = this.state.selectedEpisode;
    return (
      <SelectedEpSection>
        <div className="info">
          <h2>{this.getEpisodeNumber(ep)} {ep.title}</h2>
          <p>Emitido el {new Date(ep.first_aired * 1000).toLocaleDateString()}</p>
          <p className="overview">{ep.overview}</p>
        </div>
        <div className="subtitles">
          <h2>Subtitulos</h2>
        </div>
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
