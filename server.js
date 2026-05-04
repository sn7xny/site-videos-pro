const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// 🔥 IMPORTANTE (corrige legenda)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
app.use('/videos', express.static('uploads'));

// garantir pastas
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
if (!fs.existsSync('database')) fs.mkdirSync('database');

const dbPath = 'database/videos.json';
if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, '[]');

function readDB(){
  return JSON.parse(fs.readFileSync(dbPath));
}

function saveDB(data){
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ✅ UPLOAD COM LEGENDA (CORRIGIDO)
app.post('/upload', upload.single('video'), (req, res) => {
  const db = readDB();

  const title = req.body.title;

  const video = {
    id: Date.now().toString(),
    file: req.file.filename,
    title: title && title !== "undefined" ? title : "Sem título",
    views: 0
  };

  db.push(video);
  saveDB(db);

  res.json({ ok: true });
});

// FEED
app.get('/videos-feed', (req, res) => {
  const db = readDB();
  res.json(db.slice().reverse());
});

// VIEW
app.post('/view/:id', (req, res) => {
  const db = readDB();
  const vid = db.find(v => v.id === req.params.id);

  if(vid){
    vid.views++;
    saveDB(db);
  }

  res.json({ ok:true });
});

// DELETE
app.delete('/delete/:id', (req, res) => {
  let db = readDB();

  const video = db.find(v => v.id === req.params.id);

  if (video) {
    try {
      fs.unlinkSync('uploads/' + video.file);
    } catch {}
  }

  db = db.filter(v => v.id !== req.params.id);
  saveDB(db);

  res.json({ ok:true });
});

app.listen(PORT, () => console.log('http://localhost:' + PORT));