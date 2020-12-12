import * as express from 'express';
//import * as bodyParser from 'body-parser';
const app = express()
const port = 3000

const db = {};

app.use(express.json());
app.use('/ui', express.static('ui'));

app.get('/board/:boardId', (req, res) => {
  const boardId = req.params.boardId;
  res.type('application/json');
  if (!db[boardId]) {
    res.status(404).json({ boardId });
  } else {
    res
      .status(200)
      .body = db[boardId]
  }
});

app.post('/board/:boardId', (req, res) => {
  const boardId = req.params.boardId;
  if (!db[boardId]) {
    db[boardId] = { strokes: [] };
  }
  db[boardId].strokes.push(req.body);
  res.status(200);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});