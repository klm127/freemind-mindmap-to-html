var express = require('express');
var router = express.Router();
const path = require('path');

const filemanager = require('../controllers/fileManager')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/upload', function(req,res) {
  filemanager.handleFileUpload(req, res);
});

router.get('/public/mindmaps/:category/:file', function(req, res) {
  console.log(req.url);
  if(req.url.match(/.css/)) {
    res.writeHead(200, {'Content_type': 'text/css'});
  }
  res.sendFile(path.join(__dirname, `../public/mindmaps/${req.params.category}/${req.params.file}`))
});

module.exports = router;
