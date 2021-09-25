var express = require('express');
var router = express.Router();

const filemanager = require('../controllers/fileManager')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/upload', function(req,res) {
  filemanager.handleFileUpload(req, res);
})

module.exports = router;
