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
      .json(db[boardId]);
  }
});

app.post('/board/:boardId', (req, res) => {
  console.log(JSON.stringify(req.body.strokes));
  if (!req.body ) {
    res.status(400).json({ error: "no body"});
    return;
  } else if (!req.body.strokes) {
    res.status(400).json({ error: "no strokes key"});
    return;
  }

  const boardId = req.params.boardId;
  if (!db[boardId]) {
    db[boardId] = { strokes: [] };
  }
  db[boardId].strokes.push(req.body.strokes);
  res.status(200).json({});
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});