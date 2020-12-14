import * as express from 'express';
import { AsyncNedb } from 'nedb-async';
//import * as path from 'path';

//import * as bodyParser from 'body-parser';
const app = express()
const port = 3000

const db = new AsyncNedb();

app.use(express.json());
app.use('/ui', express.static('dist/server/ui/'));

app.get('/board/:boardId', async (req, res) => {
  const boardId = req.params.boardId;
  res.type('application/json');
  const board = await db.asyncFindOne({ boardId })
  if (!board) {
    res.status(404).json({ boardId });
  } else {
    res
      .status(200)
      .json(board);
  }
});

app.post('/board/:boardId', async (req, res) => {
  console.log(JSON.stringify(req.body));
  if (!req.body ) {
    res.status(400).json({ error: "no body"});
    return;
  } else if (!req.body.strokes) {
    res.status(400).json({ error: "no strokes key"});
    return;
  }

  const boardId = req.params.boardId;
  let board = await db.asyncFindOne({boardId});
  let dbResult;
  if (!board) {
    board = { boardId, strokes: req.body.strokes };
    dbResult = await db.asyncInsert(board);
  } else {
    req.body.strokes.forEach(x => board.strokes.push(x));
    dbResult = await db.asyncUpdate({ boardId }, board);
  
  }
  console.log(`updateResult: ${dbResult}`);
  res.status(200).json({});
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});