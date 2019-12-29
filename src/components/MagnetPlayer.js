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
  .dl-link {
    margin-top: 12px;
  }
`;

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
    popcornService.loadMagnet(magnet).then(files => {
      const biggestFile = this.selectBiggestFile(files);
      this.setState({
        videoMime: biggestFile.mime,
        videoUrl: `${config.downloaderApi}${biggestFile.link}`
      })
      updateWatchedEpisodes(this.props.episodeData);
    }).catch(err => {
      console.error(err);
      window.alert('Algo ha fallado :c');
    })
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
    const {videoUrl, videoMime, subtitles, selectedTrack} = this.state;
    const selectedSubs = this.getSelectedSubs();
    if (!videoUrl ) {
      return (
        <LoadingStyles>
          <Button className="play-btn" onClick={() => this.loadVideo()}>
            <Icon icon="play_arrow" />
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
              {...this.props.episodeData}
              subtitles={subtitles}
              selectedTrack={selectedTrack}
              subtitlesLoaded={subtitles => this.setState({subtitles})}
              subtitlesSelected={subtitles => this.setState({selectedTrack: subtitles})}
              order={7}
            />
          </ControlBar>
          <source src={this.state.videoUrl} type={videoMime} />
          <source src={`${this.state.videoUrl}?transform=remux`} type="video/webm" />
          {this.renderSubtitles()}
        </Player>
        {this.state.videoUrl && (
          <p className="dl-link">
            <a href={this.state.videoUrl} download>Descargar video</a>
          </p>
        )}
        {selectedSubs && (
          <p className="dl-link">
            <a href={selectedSubs.url_srt} download>Descargar subtitulos</a>
          </p>
        )}
      </VideoStyles>
    )
  }
}

export default MagnetPlayer;
