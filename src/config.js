import sublangs from './weblangs.json';

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
  catalogApi: 'https://tv-v2.api-fetch.website'
}
