const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const pdfParse = require("pdf-parse");
const path = require("path")

const app = express();
const PORT = process.env.PORT || 8000

app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.post("/extract-text", (req, res) => {
  if (!req.files && !req.files.pdfFile) {
    res.status(400);
    res.end();
  }

  pdfParse(req.files.pdfFile).then(result => {
    res.send(result.text);
  })
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
