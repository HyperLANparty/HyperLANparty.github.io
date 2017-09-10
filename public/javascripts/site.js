$.noConflict();

jQuery( document ).ready(function($) {

  // timeline

  $.each($(".timeline"), function(index, timeline){
    timeline = $(timeline);
    var timelineItems = timeline.find(".timeline__item");

    // functions

    var getDate = function(date){
      var date = new Date(date)
      date.setHours(date.getHours() -2); // timezone thing?
      return date;
    };

    var getDiff = function(from, to){
      if (to < from) {
          to.setDate(to.getDate() + 1);
      }
      var diff = to - from;

      var msec = diff;
      var hh = Math.floor(msec / 1000 / 60 / 60);
      msec -= hh * 1000 * 60 * 60;
      var mm = Math.floor(msec / 1000 / 60);

      return hh + (mm/60);
    };

    // timeline data

    timelineItems.sort(function(a, b){
      var aDate = $(a).data("date");
      var aDateFrom = getDate(aDate.from_date);
      var bDate = $(b).data("date");
      var bDateFrom = getDate(bDate.from_date);

      return aDateFrom - bDateFrom;
    });

    var totalDate = timeline.data("totalDate");
    var totalDateFrom = getDate(totalDate.from_date);
    var totalDateTo = getDate(totalDate.to_date);
    var totalTime = getDiff(totalDateFrom, totalDateTo);
    var timeLabelHeight = 20; // todo
    timeline.css({"min-height": (totalTime * timeLabelHeight) + "px"});

    var deltaX = timeline.height() / totalTime;

    // lines with time

    var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

    var timeDateItem = $( "<div class='timeline__date_label'/>" );
    timeDateItem.append(
      "<p class='timeline__time_date__text'><span>" + totalDateFrom.getDate() + "</span> "
      + monthNames[totalDateFrom.getMonth()] + "</p>"
    );
    timeline.append( timeDateItem );
    var leftSpaceTime = timeDateItem.outerWidth(true);

    var timeTimeLineItem = $( "<div class='timeline__time_label'/>" );
    timeTimeLineItem.append(
      "<p class='timeline__time_label__text'>" + totalDateFrom.getHours() + ":"
      + (totalDateFrom.getMinutes()<10?'0':'') + totalDateFrom.getMinutes() + "</p>"
    );
    timeline.append( timeTimeLineItem );
    var leftSpaceTimeLine = leftSpaceTime + timeTimeLineItem.find(".timeline__time_label__text").outerWidth(true);

    // other lines

    var timeTimeLine = new Date(
      totalDateFrom.getFullYear(),
      totalDateFrom.getMonth(),
      totalDateFrom.getDate(),
      totalDateFrom.getHours(),
      totalDateFrom.getMinutes()
    );

    if(timeTimeLine.getMinutes() != 0){
      timeTimeLine.setMinutes(0);
    }
    timeTimeLine.setHours(timeTimeLine.getHours() + 1);

    while( timeTimeLine < totalDateTo ){
      var timeTimeLineItem = $( "<div class='timeline__time_label'/>" );
      timeTimeLineItem.append( "<p class='timeline__time_label__text'>" + timeTimeLine.getHours() + ":00</p>" );
      timeline.append( timeTimeLineItem );

      var itemStartTime = getDiff(totalDateFrom, timeTimeLine);
      var topPosition = (deltaX * itemStartTime);
      timeTimeLineItem.css({ top: topPosition + "px" });

      if(timeTimeLine.getHours() == 0){
        var timeDateItem = $( "<div class='timeline__date_label'/>" );
        timeDateItem.append(
          "<p class='timeline__time_date__text'><span>" + timeTimeLine.getDate() + "</span> "
          + monthNames[timeTimeLine.getMonth()] + "</p>"
        );
        timeline.append( timeDateItem );
        timeDateItem.css({ top: topPosition + "px" });
      }

      timeTimeLine.setHours(timeTimeLine.getHours() + 1);
    }

    var timelineTimeLabels = $(".timeline__time_label");

    timelineTimeLabels.css({"margin-left": leftSpaceTime + "px"});
    timelineTimeLabels.width( timelineTimeLabels.width() - leftSpaceTime);

    // column data

    if (timelineItems.length < 1){
      return;
    }

    var columnWidth = $(timelineItems[0]).outerWidth(true);
    var numberColumns = (timeline.width() - leftSpaceTimeLine) / columnWidth;
    numberColumns = Math.floor(numberColumns);
    var columns = Array.apply(null, new Array(numberColumns)).map(Number.prototype.valueOf,0);

    // timeline items

    $.each(timelineItems, function(index, item){
      item = $(item);
      var itemDate = item.data("date");
      var itemDateFrom = getDate(itemDate.from_date);
      var itemDateTo = getDate(itemDate.to_date);
      var itemTime = getDiff(itemDateFrom, itemDateTo);
      var itemStartTime = getDiff(totalDateFrom, itemDateFrom);

      var itemHeight = deltaX * itemTime;
      item.height(itemHeight + "px");
      var topPosition = (deltaX * itemStartTime);
      item.css({ top: topPosition + "px" });

      var i = 0;
      var placed = false;
      while(!placed){

        if (topPosition > columns[i]){
          item.css({ left: (leftSpaceTimeLine + (columnWidth * i)) + "px" });
          columns[i] = topPosition + itemHeight + 5;
          placed = true;
        }

        i++;
        if (i >= numberColumns){
          placed = true;
        }
      }
    });
  });
});
