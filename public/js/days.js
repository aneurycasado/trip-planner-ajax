'use strict';
/* global $ mapModule */

var daysModule = (function(){

  var exports = {},
      days = all_days;

      // days.forEach(function(day){
      //   renderDay(day);
      // })
      var currentDay = days[0];

  function addDay () {
    var current = {
      number: days.length,
      hotels: [],
      restaurants: [],
      activities: []
    };
    $.ajax({
      type: "POST",
      url:'/api/days',
      data: current,
      success: function(data){
        days = data;
        switchDay(days.length);
      }
    });
  }

  function switchDay (index) {
    var $title = $('#day-title');
    if (index >= days.length) index = days.length - 1;
    $title.children('span').remove();
    $title.prepend('<span>Day ' + (index + 1) + '</span>');
    currentDay = days[index];
    renderDay(currentDay);
    renderDayButtons();
  }

  function removeCurrentDay () {
    if (days.length === 1) return;
    var index = days.indexOf(currentDay);
    $.ajax({
      type:"delete",
      url:"/api/days/"+index,
      success: function(data){
        days = data;
        switchDay(index);
      }
    });
  }

  function renderDayButtons () {
    var $daySelect = $('#day-select');
    $daySelect.empty();
    days.forEach(function(day, i){
      $daySelect.append(daySelectHTML(day, i, day === currentDay));
    });
    $daySelect.append('<button class="btn btn-circle day-btn new-day-btn">+</button>');
  }

  function daySelectHTML (day, i, isCurrentDay) {
    return '<button class="btn btn-circle day-btn' + (isCurrentDay ? ' current-day' : '') + '">' + (i + 1) + '</button>';
  }

  exports.addAttraction = function(attraction) {
    if(attraction.type === "hotels") attraction.type = "hotel";
    $.ajax({
      type: "POST",
      url: "/api/days/" + currentDay.number + "/" + attraction.type,
      data: attraction._id,
      success: function(data){
        if (currentDay[attraction.type].indexOf(attraction) !== -1) return;
        currentDay[attraction.type].push(attraction);
        days = data;
        renderDay(currentDay);
      }
    })
  };

  exports.removeAttraction = function (attraction) {
    if(attraction.type === "hotels") attraction.type = "hotel";
    var index = currentDay[attraction.type].indexOf(attraction);
    console.log("We are here");
    console.log("Index", index);
    console.log("attraction", attraction);
    $.ajax({
      type: "put",
      url: "/api/days/" +currentDay.number + "/" + attraction.type,
      data: {att_id: attraction._id, index: index},
      success: function(data){
        //if (currentDay[attraction.type].indexOf(attraction) !== -1) return;
        console.log("Before ",currentDay);
        console.log("Index ", index);
        currentDay[attraction.type].splice(index, 1);
        console.log("After ",currentDay);
        days = data;
        renderDay(currentDay);
        console.log("We finished");
      }
    });
  };

  function renderDay(day) {
    mapModule.eraseMarkers();
    if(day === undefined){
      day = {
        number: days.length,
        hotel: [],
        restaurants: [],
        activities: []
      }
    }
    Object.keys(day).forEach(function(type){
      if(type !== "number" && type !== "_id" && type !== "__v"){
        var $list = $('#itinerary ul[data-type="' + type + '"]');
        $list.empty();
        day[type].forEach(function(attraction){
          console.log(type);
          attraction.type = type;
          console.log(attraction);
          $list.append(itineraryHTML(attraction));
          mapModule.drawAttraction(attraction);
        });
      }
    });
  }

  function itineraryHTML (attraction) {
    return '<div class="itinerary-item><span class="title>' + attraction.name + '</span><button data-id="' + attraction._id + '" data-type="' + attraction.type + '" class="btn btn-xs btn-danger remove btn-circle">x</button></div>';
  }

  $(document).ready(function(){
    switchDay(0);
    $('.day-buttons').on('click', '.new-day-btn', addDay);
    $('.day-buttons').on('click', 'button:not(.new-day-btn)', function() {
      switchDay($(this).index());
    });
    $('#day-title').on('click', '.remove', removeCurrentDay);
  });

  return exports;

}());
