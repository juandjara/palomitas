import sublangs from './weblangs.json';

const genres = [
  'All',
  'Action',
  'Adventure',
  'Animation',
  'Biography',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Family',
  'Fantasy',
  'Film-Noir',
  'History',
  'Horror',
  'Music',
  'Musical',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Short',
  'Sport',
  'Thriller',
  'War',
  'Western'
]

export default {
  sublangs: sublangs.map(s => ({
    value: s.isoId,
    label: s.name
  })),
  sortOptions: [
    {label: 'Tendencias', value: 'trending'},
    {label: 'Nombre', value: 'name'},
    {label: 'Valoración', value: 'rating'},
    {label: 'Última actualización', value: 'updated'},
    {label: 'Año de emision', value: 'year'}
  ],
  genreOptions: genres.map(g => ({ label: g, value: g })),
  catalogApi: 'https://cors-anywhere.herokuapp.com/https://tv-v2.api-fetch.sh',
  subtitleApi: 'https://subdown.fuken.xyz',
  downloaderApi: 'https://palomitas-dl.fuken.xyz'
}
