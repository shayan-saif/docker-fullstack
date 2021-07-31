const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const keys = require('./keys');


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: 'http://localhost'
}));
const port = 3000;


const pool = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
});
pool.connect().catch((err) => console.log(err));
pool.query('CREATE TABLE IF NOT EXISTS users (user_id INT GENERATED ALWAYS AS IDENTITY, username varchar(32) UNIQUE NOT NULL , password varchar(255) NOT NULL, PRIMARY KEY(user_id))');
pool.query('CREATE TABLE IF NOT EXISTS posts (post_id INT GENERATED ALWAYS AS IDENTITY, user_id INT, created_at TIMESTAMP DEFAULT NOW(), title text NOT NULL, content text NOT NULL, FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE)');

app.get('/', (req, res) => {
  res.send("Hello from the backend! Navigate to \"localhost:80\" to see the front-end application.")

});

app.get('/posts', async (req, res) => {
  const posts = await pool.query('SELECT * FROM Posts');

  res.json(posts.rows);
});

app.get('/posts/:post_id', async (req, res) => {
  const post_id = req.params.post_id;
  const posts = await pool.query('SELECT * FROM Posts WHERE post_id = $1', [post_id]);

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

app.patch('/posts/update/:post_id', async (req, res) => {
  const post_id = req.params.post_id;
  const { title, content } = req.body;
  if (title && content) {
    pool.query('UPDATE Posts SET title = $1, content = $2 WHERE post_id = $3 RETURNING *', [title, content, post_id]).then((entry) => {
      return res.status(200).json(entry.rows[0]);
    });
  } else {
    if (title) {
      pool.query('UPDATE Posts SET title = $1 WHERE post_id = $2 RETURNING *', [title, post_id]).then((entry) => {
        return res.status(200).json(entry.rows[0]);
      });
    } else if (content) {
      pool.query('UPDATE Posts SET content = $1 WHERE post_id = $2 RETURNING *', [content, post_id]).then((entry) => {
        return res.status(200).json(entry.rows[0]);
      });
    }
  }

  return res.status(500);

});

app.delete('/posts/delete', async (req, res) => {
  pool.query('DELETE from Posts')
    .then(() => { res.status(200).json({ message: "Post deleted" }); })
    .catch((err) => { console.log(err); });
});

app.delete('/posts/delete/:post_id', async (req, res) => {
  const post_id = req.params.post_id;

  pool.query('DELETE from Posts WHERE post_id = $1 RETURNING *', [post_id])
    .then((deleted) => { res.status(200).json(deleted.rows[0]); })
    .catch((err) => { console.log(err); });
});


app.listen(port, () => console.log(`Listening on port ${port}`))