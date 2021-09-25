var express = require('express');
const fileUpload = require('express-fileupload');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/upload', function(req,res) {
  res.send('<html>file uploaded</html>');
  console.log(req.files.uploadedFile);
})

// router.post('/upload', function(req,res,next) {
//   res.send('Got POST request');
//   console.log(req.files);
// })
module.exports = router;
