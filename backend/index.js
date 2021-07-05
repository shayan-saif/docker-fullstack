const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const keys = require('./keys');


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
const port = 3000;


const pool = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
});
pool.connect().catch((err) => console.log(err));
pool.query('CREATE TABLE IF NOT EXISTS Posts(pid SERIAL NOT NULL, title varchar(255), content varchar(255))');


app.get('/', (req, res) => {
  res.send("Hello from the backend!")

});

app.get('/posts', async (req, res) => {
  const posts = await pool.query('SELECT * FROM Posts');

  res.json(posts.rows);
});

app.get('/posts/:pid', async (req, res) => {
  const pid = req.params.pid;
  const posts = await pool.query('SELECT * FROM Posts WHERE pid = $1', [pid]);

  res.json(posts.rows[0]);
});

app.post('/posts/create', async (req, res) => {
  const { title, content } = req.body;

  pool.query('INSERT INTO Posts (title, content) VALUES ($1, $2) RETURNING *', [title, content])
    .then((entry) => {
      res.status(201).json(entry.rows[0]);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Error creating post" })
    });
});

app.patch('/posts/update/:pid', async (req, res) => {
  const pid = req.params.pid;
  const { title, content } = req.body;
  if (title && content) {
    pool.query('UPDATE Posts SET title = $1, content = $2 WHERE pid = $3', [title, content, pid]);
  } else {
    if (title) {
      pool.query('UPDATE Posts SET title = $1 WHERE pid = $2', [title, content]);
    } else if (content) {
      pool.query('UPDATE Posts SET content = $1 WHERE pid = $2', [content, pid]);
    }
  }


  res.status(200).send("Post updated");
});

app.delete('/posts/delete', async (req, res) => {
  pool.query('DELETE from Posts')
    .then(() => { res.status(200).json({ message: "Post deleted" }); })
    .catch((err) => { console.log(err); });
});

app.delete('/posts/delete/:pid', async (req, res) => {
  const pid = req.params.pid;

  pool.query('DELETE from Posts WHERE pid = $1 RETURNING *', [pid])
    .then((deleted) => { res.status(200).json(deleted.rows[0]); })
    .catch((err) => { console.log(err); });
});


app.listen(port, () => console.log(`Listening on port ${port}`))