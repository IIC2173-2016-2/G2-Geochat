const execFile = require('child_process').execFile;


let number_of_users = process.argv[2] || 1;
const user_prefix = process.argv[3] || 'user';
let number_of_messages = process.argv[4] || 3;
number_of_messages = parseInt(number_of_messages, 10);
number_of_users = parseInt(number_of_users, 10);

for (let i = 0; i < number_of_users; i++) {
  const username = `${user_prefix} ${i + 1}`;
  const first_one = i === 0;
  const child = execFile('node', ['chat_attack.js', username, number_of_messages, first_one], (error, stdout) => {
    if (error) {
      throw error;
    }
  });
  child.stdout.on('data', (data) => { console.log(data); });
}
