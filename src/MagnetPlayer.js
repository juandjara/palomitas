import React, {Component} from 'react';
import { BigPlayButton, Player } from 'video-react';
import 'video-react/dist/video-react.css';
import config from './config';
import popcornService from './popcornService';

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

  selectBiggestFile(files) {
    return files.reduce((prev, next) => {
      return next.length > prev.length ? next : prev;
    });
  }

  loadVideo() {
    this.setState({loading: true});
    popcornService.loadMagnet(this.props.magnet)
    .then(files => {
      const biggestFile = this.selectBiggestFile(files);
      this.setState({
        loading: false,
        videoUrl: `${config.downloaderApi}${biggestFile.link}`
      })
    })
  }

  render() {
    if (!this.state.videoUrl ) {
      return (
        <p style={{fontSize: 20, textAlign: 'center', margin: '1em'}}>
          Cargando video...
        </p>
      );
    }
    return (
      <div style={{margin: '1em 0'}}>
        <Player
          controls
          style={{width: '100%', height: 'auto'}}
          crossOrigin="anonymous">
          <BigPlayButton className="player-btn" position="center" />
          <source src={this.state.videoUrl} />
          <source src={`${this.state.videoUrl}?ffmpeg=remux`} type="video/webm" />
        </Player>
        <p>
          <a download href={this.state.videoUrl}>
            Descargar video
          </a>
        </p>
      </div>
    )
  }
}

export default MagnetPlayer;
