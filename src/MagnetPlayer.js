import React, {Component} from 'react';
import { BigPlayButton, Player } from 'video-react';
import 'video-react/dist/video-react.css';
import config from './config';
import popcornService from './popcornService';
import Button from './Button';
import Icon from './Icon';
import styled from 'styled-components';

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
    videoUrl: null
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
        videoUrl: `${config.downloaderApi}${biggestFile.link}`
      })
    }).catch(err => {
      console.error(err);
      window.alert('Algo ha fallado :c');
    })
  }

  render() {
    if (!this.state.videoUrl ) {
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
          <source src={this.state.videoUrl} />
          <source src={`${this.state.videoUrl}?ffmpeg=remux`} type="video/webm" />
        </Player>
        <p>
          <a download href={this.state.videoUrl}>
            Descargar video
          </a>
        </p>
      </VideoStyles>
    )
  }
}

export default MagnetPlayer;
