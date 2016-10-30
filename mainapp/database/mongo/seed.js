const mongoose = require('mongoose');
const connectionString = require('./url');
const Place = require('../../app/mongoModels/place');

mongoose.connect(connectionString);


const rooms = ['Concepcion', 'Santiago', 'Temuco', 'Chillan', 'Antofagasta', 'Valparaiso', 'La Serena', 'Puerto Montt',
    'Talca', 'Iquique', 'Arica', 'Rancagua',
];

const db = mongoose.connection;

db.on('error', (err) => {
  console.log('connection error', err);
});
db.once('open', () => {
  console.log('connected.');
});
for (let i = 0; i < rooms.length; i++) {
  const p = new Place({
    name: rooms[i],
  });


  p.save((err, place) => {
    if (err) {
      return console.error(err);
    }
    console.log(`Place: ${place.name} saved.`);
  });
}
