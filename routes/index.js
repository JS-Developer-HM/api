var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);

var router = express.Router();
app.use("/ws-stuff", router);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/x', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.ws('/echo', function(ws, req) {
  ws.on('message', function(msg) {
    ws.send(msg);
  });
});

module.exports = router;
