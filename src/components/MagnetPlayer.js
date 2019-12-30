import React, {Component} from 'react';
import { BigPlayButton, Player, ControlBar } from 'video-react';
import 'video-react/dist/video-react.css';
import config from '../config';
import popcornService from '../services/popcornService';
import Button from './Button';
import Icon from './Icon';
import styled from 'styled-components';
import SubtitleSelector from './SubtitleSelector';
import { updateWatchedEpisodes } from '../services/lastWatchedService';
import Spinner from './Spinner';

const VideoStyles = styled.div`
  .video-react {
    margin: 1em 0;
    .play-btn {
      border: none !important;
      background: none !important;
    }
    .play-btn:before {
      font-size: 4rem;
      text-shadow: 0 0 5px #333;
    }
  }
`;

const Links = styled.div`
  margin: 12px 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  p {
    margin-right: 12px;
  }
  .material-icons {
    margin-right: 4px;
    opacity: 0.75;
  }
`

const LoadingStyles = styled.div`
  margin: 1em 0;
  background: #111;
  position: relative;
  height: 0;
  padding-top: 56.25%;
  .play-btn {
    border: none;
    background: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .material-icons {
    color: white;
    font-size: 4rem;
    text-shadow: 0 0 5px #333;
  }
`;

class MagnetPlayer extends Component {
  state = {
    loading: false,
    videoUrl: null,
    videoMime: null,
    subtitles: [],
    selectedTrack: null
  }

  componentDidMount() {
    popcornService.init(config.downloaderApi)    
  }

  componentWillUnmount() {
    popcornService.disconnect();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.magnet !== this.props.magnet) {
      this.setState({videoUrl: null})
    }
  }

  selectBiggestFile(files) {
    return files.reduce((prev, next) => {
      return next.length > prev.length ? next : prev;
    });
  }

  loadVideo() {
    const magnet = this.props.magnet;
    this.setState({ loading: true, subtitles: [] })
    Promise.all([
      popcornService.loadMagnet(magnet),
      this.fetchSubtitles()
    ]).then(data => {
      const [ files, subtitlesData ] = data
      const { subtitles, selectedTrack } = subtitlesData
      const biggestFile = this.selectBiggestFile(files);
      this.setState({
        loading: false,
        subtitles,
        selectedTrack,
        videoMime: biggestFile.mime,
        videoUrl: `${config.downloaderApi}${biggestFile.link}`
      })
      updateWatchedEpisodes(this.props.episodeData);
    }).catch(err => {
      console.error(err);
      window.alert('Algo ha fallado :c');
    })
  }

  fetchSubtitles() {
    const {id, episode, season} = this.props.episodeData;
    const url = `${config.subtitleApi}/search?imdbid=${id}&season=${season}&episode=${episode}`;
    return fetch(url).then(res => res.json())
    .then(data => {
      const subtitles = this.processSubtitles(data);
      const subs_es = subtitles.find(s => s.langcode === 'es');
      const subs_en = subtitles.find(s => s.langcode === 'en');
      const defaultSelection = subs_es ? subs_es.id : subs_en && subs_en.id;
      return { subtitles, selectedTrack: defaultSelection }
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
        url: subs.links.vtt,
        url_srt: subs.links.srt
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

  getSelectedSubs() {
    const {subtitles, selectedTrack} = this.state;
    const subs = subtitles.find(s => s.id === selectedTrack);
    return subs;
  }

  renderSubtitles() {
    const subs = this.getSelectedSubs();
    return subs && (
      <track
        default={true}
        kind="subtitles"
        label={subs.label}
        srcLang={subs.langcode}
        src={`https:${subs.url}`}
      />
    );
  }

  render() {
    const {loading, videoUrl, videoMime, subtitles, selectedTrack} = this.state;
    const selectedSubs = this.getSelectedSubs();
    if (!videoUrl) {
      return (
        <LoadingStyles>
          <Button className="play-btn" onClick={() => this.loadVideo()}>
            {loading ? <Spinner /> : <Icon icon="play_arrow" />}
          </Button>
        </LoadingStyles>
      );
    }
    return (
      <VideoStyles>
        <Player autoPlay controls fluid 
          aspectRatio="16:9"
          crossOrigin="anonymous">
          <BigPlayButton className="play-btn" position="center" />
          <ControlBar>
            <SubtitleSelector 
              subtitles={subtitles}
              selectedTrack={selectedTrack}
              subtitlesSelected={subtitles => this.setState({selectedTrack: subtitles})}
              order={7}
            />
          </ControlBar>
          <source src={this.state.videoUrl} type={videoMime} />
          <source src={`${this.state.videoUrl}?transform=remux`} type="video/webm" />
          {this.renderSubtitles()}
        </Player>
        <Links>
          {this.state.videoUrl && (
            <p>
              <Icon icon="file_download" />
              <a href={this.state.videoUrl} download>Descargar video</a>
            </p>
          )}
          {selectedSubs && (
            <p>
              <Icon icon="file_download" />
              <a href={selectedSubs.url_srt} download>Descargar subtitulos</a>
            </p>
          )}
          <p>
            <Icon icon="link" />
            <a href={this.props.magnet}>Enlace Magnet</a>
          </p>
        </Links>
      </VideoStyles>
    )
  }
}

export default MagnetPlayer;
