const fs = require('fs');
const parse = require('csv-parse');

const data = {};


function addData(row) {
  if (!(row[0] in data)) {
    data[row[0]] = {
      sum: 0,
      times: 0,
    };
  }
  row[1] = parseInt(row[1], 10);
  if (!isNaN(row[1])) {
    data[row[0]].sum += row[1];
    data[row[0]].times++;
  }
}

function printData() {
  console.log('username, promedio, total, mensajes');
  for (let i = 0; i < Object.keys(data).length; i++) {
    const username = Object.keys(data)[i];
    console.log(`${username},${data[username].sum / data[username].times}, ${data[username].times}, ${data[username].sum}`);
  }
}


fs.createReadStream('time.csv')
  .pipe(parse({
    delimiter: ',',
  }))
  .on('data', (row) => {
    addData(row);
  })
  .on('end', () => {
    printData();
  });
