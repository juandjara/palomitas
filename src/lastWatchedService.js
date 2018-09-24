const KEY = 'palomitas_v4_lastwatched';

export function getWatchedEpisodes() {
  const data = JSON.parse(localStorage.getItem(KEY) || '[]');
  return data;
}

export function updateWatchedEpisodes(episode) {
  const data = getWatchedEpisodes().filter(s => s.id !== episode.id);
  data.push(episode);
  localStorage.setItem(KEY, JSON.stringify(data));
  return data;
}

export function removeWatchedEpisode(episode) {
  const data = getWatchedEpisodes().filter(s => s.id !== episode.id);
  localStorage.setItem(KEY, JSON.stringify(data));
  return data;
}
