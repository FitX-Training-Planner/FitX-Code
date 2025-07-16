const { exec } = require('child_process');

const port = process.env.PORT || 3000;

exec(`npx serve -s build -l ${port}`, (err, stdout, stderr) => {
  if (err) {
    console.error(`Erro: ${err}`);
    return;
  }
  console.log(stdout);
  console.error(stderr);
});
