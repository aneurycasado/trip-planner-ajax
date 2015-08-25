var express = require('express');
var router = express.Router();
var models = require('../../models');
var Hotel = models.Hotel;
var Restaurant = models.Restaurant;
var Activity = models.Activity;
var Day = models.Day;
var Promise = require('bluebird');


router.get('/days',function(req,res,next){
  Day.find().populate("hotel restaurants activities").exec().then(function(days){
    console.log(days);
    res.json(days);
  });
});
router.get('/days/:id');

router.post('/days', function(req,res){
  Day.create(req.body).then(function(day){
    Day.find().populate("hotel restaurants activities").then(function(days){
        res.json(days);
    });
  });
});

router.post('/days/:number/:type', function(req,res,next){
  var number = req.params.number;
  var type = req.params.type;
  if (type === "hotels") type = "hotel";

  Day.findOne({number: number}).exec().then(function(day){
    day[type.toString()].push(Object.keys(req.body)[0]);
    return day.save();
  }).then(function(){
    console.log("2");
    return Day.find().populate("hotel restaurants activities").exec();
  }).then(function(days){
    res.json(days);
  });
});

router.put('/days/:number/:type', function(req,res,next){
  var number = req.params.number;
  var type = req.params.type;
  if (type === "hotels") type = "hotel";
  Day.findOne({number: number}).exec().then(function(day){
    day[type.toString()].splice(req.body.index,1);
    console.log("1");
    return day.save();
  }).then(function(){
    console.log("2");
    return Day.find().populate("hotel restaurants activities").exec();
  }).then(function(days){
    console.log("3");
    console.log(days);
    res.json(days);
  });
});


router.delete('/days/:id', function(req,res){
  console.log(req.params.id);
  Day.find({number:req.params.id}).remove().then(function(day){
    return Day.find().populate("hotel restaurants activities").exec();
  }).then(function(days){
    for(var i = 0; i < days.length; i++){
      var day = days[i];
      day.number = i;
      day.save();
    }
  }).then(function(){
    return Day.find().populate("hotel restaurants activities").exec();
  }).then(function(days){
    res.json(days);
  });
});

module.exports = router;
