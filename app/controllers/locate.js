exports.main = function (req, res, coords) {
  const CLIENT_ID = 'DB3WCAB4IXWLMJYXLQNNAGS0BTLFQU4BV053WSERRIW20NKV';
  const CLIENT_SECRET = 'UQDYESVN1EFVYWWLV1V4JAN25C0NHAFX042X2OI1CF1SEW0C';
  const foursquare = require('node-foursquare-venues')(CLIENT_ID, CLIENT_SECRET);

  foursquare.venues.search({
    ll: `${coords.lat},${coords.lon}`,
  },
    (error, response) => {
      const places = [];
      for (const i in response.response.venues) {
        places.push(response.response.venues[i].name);
      }
      res.send({
        places,
      });
    });
};
