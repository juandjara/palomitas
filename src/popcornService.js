import io from 'socket.io-client';
import parseMagnet from 'magnet-uri';

/* This module can get files for a torrent in just a few steps
```
popcornService.init('https://palomitas-dl.fuken.xyz')
popcornService.loadMagnet('magnet://...').then(files => {
  // here are the torrent files
})
```
*/ 

export default {
  torrents: [],
  socket: null,
  targetHash: null,
  apiurl: null,

  init(api) {
    this.socket = io(api + '/');
    this.apiurl = api;
    this.socket.on('connect', () => {
      console.log("Connected to Palomitas Downloader websocket")
    })
    this.socket.on('destroyed', (hash) => this.removeTorrent(hash))
    this.fetchAllTorrents()
  },

  isTorrentInServer(hash) {
    return this.torrents.some(storedHash => storedHash === hash);
  },

  fetchAllTorrents() {
    return fetch(`${this.apiurl}/torrents`)
    .then(res => res.json())
    .then(data => {
      this.torrents = data.map(torrent => torrent.infoHash);
    });
  },

  fetchTorrentFiles(hash) {
    if(this.targetHash !== hash) {
      return;
    }
    this.socket.off('interested');
    return fetch(`${this.apiurl}/torrents/${hash}`)
    .then(res => res.json())
    .then(data => data.files)
  },

  postTorrent(magnet) {
    return fetch(`${this.apiurl}/torrents`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ link: magnet })
    })
  },

  removeTorrent(hash) {
    this.torrents = this.torrents.filter(storedHash => storedHash !== hash);
  },

  loadMagnet(magnet) {
    if (!this.socket) {
      throw new Error('Socket is not connected. You must call the "init" method with an url first');
    }
    this.targetHash = parseMagnet(magnet).infoHash;
    return new Promise((resolve, reject) => {
      if (this.isTorrentInServer(this.targetHash)) {
        this.fetchTorrentFiles(this.targetHash)
        .then(resolve)
        .catch(reject)
      } else {
        this.postTorrent(magnet).catch(reject);
        this.socket.on(
          'interested',
          (hash) => {
            this.fetchTorrentFiles(hash)
            .then(resolve)
            .catch(reject);
          }
        )
      }
    })
  },

  disconnect() {
    this.socket.removeAllListeners();
    this.socket.disconnect();
    delete this.socket;
  }
}
