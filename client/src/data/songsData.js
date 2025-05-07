// Song metadata array with references to structured lyrics/chords data from JSON files
import heyJude from './hey_jude.json';
import hallelujah from './hallelujah.json';
import imagine from './imagine.json';
import hotelCalifornia from './hotel_california.json';
import bohemianRhapsody from './bohemian_rhapsody.json';
import letItBe from './let_it_be.json';
import veechShelo from './veech_shelo.json'; 

const songs = [
  {
    id: 'hey_jude',
    title: 'Hey Jude',
    artist: 'The Beatles',
    image: '',
    data: heyJude,
  },
  {
    id: 'hallelujah',
    title: 'Hallelujah',
    artist: 'Leonard Cohen',
    image: '',
    data: hallelujah,
  },
  {
    id: 'imagine',
    title: 'Imagine',
    artist: 'John Lennon',
    image: '',
    data: imagine,
  },
  {
    id: 'hotel_california',
    title: 'Hotel California',
    artist: 'Eagles',
    image: '',
    data: hotelCalifornia,
  },
  {
    id: 'bohemian_rhapsody',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    image: '',
    data: bohemianRhapsody,
  },
  {
    id: 'let_it_be',
    title: 'Let It Be',
    artist: 'The Beatles',
    image: '',
    data: letItBe,
  },
  {
    id: 'veech_shelo',
    title: 'Ve’ech Shelo',
    artist: 'Eviatar Banai',
    image: '',
    data: veechShelo,
  },
];

export default songs;
