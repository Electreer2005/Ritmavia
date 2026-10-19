// src/data/mockData.js

export const artists = [
  { id: 'a1', name: 'Tame Impala', image: 'https://picsum.photos/seed/tame/300', followers: 8500000 },
  { id: 'a2', name: 'Daft Punk', image: 'https://picsum.photos/seed/daft/300', followers: 12000000 },
  { id: 'a3', name: 'Gorillaz', image: 'https://picsum.photos/seed/gorillaz/300', followers: 9800000 },
  { id: 'a4', name: 'Radiohead', image: 'https://picsum.photos/seed/radiohead/300', followers: 15000000 },
  { id: 'a5', name: 'The Weeknd', image: 'https://picsum.photos/seed/weeknd/300', followers: 45000000 },
  { id: 'a6', name: 'Rosalía', image: 'https://picsum.photos/seed/rosalia/300', followers: 22000000 },
]

export const albums = [
  {
    id: 'al1',
    title: 'Currents',
    artistId: 'a1',
    cover: 'https://picsum.photos/seed/currents/400',
    year: 2015,
    tracks: ['t1', 't2', 't3'],
  },
  {
    id: 'al2',
    title: 'Random Access Memories',
    artistId: 'a2',
    cover: 'https://picsum.photos/seed/ram/400',
    year: 2013,
    tracks: ['t4', 't5'],
  },
  {
    id: 'al3',
    title: 'Demon Days',
    artistId: 'a3',
    cover: 'https://picsum.photos/seed/demondays/400',
    year: 2005,
    tracks: ['t6', 't7'],
  },
  {
    id: 'al4',
    title: 'In Rainbows',
    artistId: 'a4',
    cover: 'https://picsum.photos/seed/inrainbows/400',
    year: 2007,
    tracks: ['t8'],
  },
  {
    id: 'al5',
    title: 'After Hours',
    artistId: 'a5',
    cover: 'https://picsum.photos/seed/afterhours/400',
    year: 2020,
    tracks: ['t9'],
  },
  {
    id: 'al6',
    title: 'Motomami',
    artistId: 'a6',
    cover: 'https://picsum.photos/seed/motomami/400',
    year: 2022,
    tracks: ['t10'],
  },
]

// Audio de prueba libre (SoundHelix, samples públicos)
export const tracks = [
  { id: 't1', title: 'Let It Happen', artistId: 'a1', albumId: 'al1', duration: 467, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 't2', title: 'The Less I Know the Better', artistId: 'a1', albumId: 'al1', duration: 216, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 't3', title: 'Eventually', artistId: 'a1', albumId: 'al1', duration: 318, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { id: 't4', title: 'Get Lucky', artistId: 'a2', albumId: 'al2', duration: 369, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
  { id: 't5', title: 'Instant Crush', artistId: 'a2', albumId: 'al2', duration: 337, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
  { id: 't6', title: 'Feel Good Inc.', artistId: 'a3', albumId: 'al3', duration: 221, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
  { id: 't7', title: 'DARE', artistId: 'a3', albumId: 'al3', duration: 244, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
  { id: 't8', title: 'Weird Fishes', artistId: 'a4', albumId: 'al4', duration: 320, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
  { id: 't9', title: 'Blinding Lights', artistId: 'a5', albumId: 'al5', duration: 200, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' },
  { id: 't10', title: 'SAOKO', artistId: 'a6', albumId: 'al6', duration: 137, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3' },
]

// Helpers
export const getArtistById = (id) => artists.find((a) => a.id === id)
export const getAlbumById = (id) => albums.find((a) => a.id === id)
export const getTrackById = (id) => tracks.find((t) => t.id === id)
export const getTracksByAlbum = (albumId) => tracks.filter((t) => t.albumId === albumId)
export const getTracksByArtist = (artistId) => tracks.filter((t) => t.artistId === artistId)
