// app/routes.js

const Place = require('./mongoModels/place');


module.exports = function router(app) {
  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================
  app.get('/', (req, res) => {
    Place.find({}, (err, places) => {
      if (err) {
        return res.send(err);
      }
      res.send(places);
    });
  });
};
