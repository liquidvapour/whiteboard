import * as express from 'express';
const app = express()
const port = 3000

app.use('/ui', express.static('ui'));

app.get('/board/:boardId/*', (req, res) => {
  res.send(`Hello ${req.params.boardId}!`);
});

app.post('/board/:boardId', (req, res) => {
  res.send();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});