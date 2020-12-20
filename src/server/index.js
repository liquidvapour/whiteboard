import * as express from 'express';
import { AsyncNedb } from 'nedb-async';
import { join } from 'path';
//import * as path from 'path';

//import * as bodyParser from 'body-parser';
const app = express();
const port = 3000;

const db = new AsyncNedb({
  filename: 'localdata/testDataFile',
  autoload: true
});

app.use(express.json());
app.use('/front', express.static('dist/server/front/'));
app.use('/ui*', (req, res) => {
  const a = __dirname;
  console.log(`meta: ${a}`);
  res.sendFile(join(__dirname, '/ui/index.html'));
});

app.get('/back/board/:boardId', async (req, res) => {
  const boardId = req.params.boardId;
  res.type('application/json');
  const board = await db.asyncFindOne({ boardId })
  if (!board) {
    res.status(404).json({ boardId });
  } else {
    const _id = undefined;
    res
      .status(200)
      .json({ ...board, _id });
  }
});

app.post('/back/board/:boardId', async (req, res) => {
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
  res.status(200).json({ result: dbResult });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});