var express = require('express');
var router = express.Router();
var models = require('../../models');
var Hotel = models.Hotel;
var Restaurant = models.Restaurant;
var Activity = models.Activity;
var Promise = require('bluebird');


router.get('/days',function(req,res,next){
  Promise.all([Days.find()])
});
router.get('/days/:id')
router.post('/days/:id', function(req,res){
  console.log("In days");
  console.log(req.body);
  res.send(req.body);
});
router.put('/days/:id')
router.delete('/days/:id')

module.exports = router;
