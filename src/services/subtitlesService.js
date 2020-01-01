import config from '../config';

export function fetchSubtitles({id, episode, season}) {
  const url = `${config.subtitleApi}/search?imdbid=${id}&season=${season}&episode=${episode}`;
  return fetch(url).then(res => res.json())
  .then(data => {
    const subtitles = processSubtitles(data);
    const subs_es = subtitles.find(s => s.langcode === 'es');
    const subs_en = subtitles.find(s => s.langcode === 'en');
    const defaultSelection = subs_es ? subs_es.id : subs_en && subs_en.id;
    return { subtitles, selectedTrack: defaultSelection }
  })
}

export function processSubtitles(data) {
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
