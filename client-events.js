$(function () {

  var touchInterface = false;

	var tapTimeThreshold = 500; // max milliseconds for tap to go from touchstart to touchend
	var tapDistanceThreshold = 8; //  max pixels for tap to move between touchstart and touch end

	function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));
	}

  $(document).on('touchstart', function (startEvent) {
    touchInterface = true;
    var startTime = (new Date()).getTime();
    var x1 = startEvent.originalEvent.touches[0].pageX;
    var y1 = startEvent.originalEvent.touches[0].pageY;

    var touchEvent = $.Event('touch', {
      x : x1,
      y : y1
    });
    $(startEvent.target).trigger(touchEvent);

    var holdEvent = $.Event('longpress', {
      x : x1,
      y : y1      
    })
    var longTap = setTimeout(function() {
      $(startEvent.target).trigger(holdEvent);   
    }, 1000);
    
    $(document).one('touchend touchcancel', function (endEvent) {
      var x2 = endEvent.originalEvent.changedTouches[0].pageX;
      var y2 = endEvent.originalEvent.changedTouches[0].pageY;
      var withinTimeThreshold = (new Date()).getTime() - startTime < tapTimeThreshold;
      var withinDistanceThreshold = Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2)) < tapDistanceThreshold;
      var sameTarget = startEvent.target === endEvent.target;
      clearTimeout(longTap);

      if (sameTarget
      &&  withinTimeThreshold
      &&  withinDistanceThreshold) {
        var tapEvent = $.Event('tap', {
          x : x1,
          y : y1
        });
        $(endEvent.target).trigger(tapEvent);
      }
    });
    $(document).one('touchmove', function(endEvent) {
      clearTimeout(longTap);
    
    })
  });

  $(window).on('mousedown', function (startEvent) {
    if (touchInterface) return;
    var startTime = (new Date()).getTime();
    var x1 = startEvent.originalEvent.pageX;
    var y1 = startEvent.originalEvent.pageY;

    var touchEvent = $.Event('touch', {
      x : x1,
      y : y1
    });
    $(startEvent.target).trigger(touchEvent);

    $(window).one('mouseup', function (endEvent) {
      var x2 = endEvent.originalEvent.pageX;
      var y2 = endEvent.originalEvent.pageY;
      var withinTimeThreshold = (new Date()).getTime() - startTime < tapTimeThreshold;
      var withinDistanceThreshold = Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2)) < tapDistanceThreshold;
      var sameTarget = startEvent.target === endEvent.target;

      if (sameTarget
      &&  withinTimeThreshold
      &&  withinDistanceThreshold) {
        var tapEvent = $.Event('tap', {
          x : x1,
          y : y1
        });
        $(endEvent.target).trigger(tapEvent);
      }
    });
  });

 
  $(document).on('touchstart', function (startEvent) {
    var startX = startEvent.originalEvent.touches[0].screenX;
    var startY = startEvent.originalEvent.touches[0].screenY;
    //  last 5 velocities recorded in x direction
    var vx = [0,0,0,0,0];
    var lastT = new Date();
    var lastD = 0;
    var firstD = 0;

    if (startEvent.originalEvent.touches.length == 1) {
      // okay
    }
    else if (startEvent.originalEvent.touches.length == 2) {
      var x1 = startX;
      var y1 = startY;
      var x2 = startEvent.originalEvent.touches[1].screenX;
      var y2 = startEvent.originalEvent.touches[1].screenY;

      firstD = distance(x1, y1, x2, y2);
      lastD = firstD;

      startX = (x1 + x2)/2;
      startY = (y1 + y2)/2;
    }
    else {
      //  unsupported number of touches
      return;
    }

    var lastX = startX;
    var lastY = startY;

    function drag(moveEvent) {
      var x = moveEvent.originalEvent.touches[0].screenX;
      var y = moveEvent.originalEvent.touches[0].screenY;
      var scale = 1;
      var t = new Date();
      var pinchEvent;

      if (startEvent.originalEvent.touches.length == 2) {
        var x1 = x;
        var y1 = y;
        var x2 = moveEvent.originalEvent.touches[1].screenX;
        var y2 = moveEvent.originalEvent.touches[1].screenY;

        x = (x1 + x2)/2;
        y = (y1 + y2)/2;

        var d = distance(x1, y1, x2, y2);

        pinchEvent = $.Event('pinch', {
          scale : d/lastD,
          x : x,
          y : y
        });

        lastD = d;
      }

      var dx = x - lastX;
      var dy = y - lastY;
      var dragEvent = $.Event('drag', {
        dx : dx,
        dy : dy
      });

      $(moveEvent.target).trigger(dragEvent);
      if (pinchEvent) $(moveEvent.target).trigger(pinchEvent);

      vx.shift();
      vx.push(dx / (t - lastT));

      lastX = x;
      lastY = y;
      lastT = t;
    }

    $(document).on('touchmove', drag);

    $(document).one('touchstart touchend touchcancel', function (endEvent) {
      $(document).off('touchmove', drag);
    });

    $(document).one('touchend', function (endEvent) {
      vx.sort();
      var medianVx = vx[2];
      if (medianVx > 0.5) {
        var swiperightEvent = $.Event('swiperight', {
          vx : medianVx
        });
        $(endEvent.target).trigger(swiperightEvent);
      }
      else if (medianVx < -0.5) {
        var swipeleftEvent = $.Event('swipeleft', {
          vx : medianVx
        });
        $(endEvent.target).trigger(swipeleftEvent);
      }
      else {
        var dropEvent = $.Event('drop', {
          dx : lastX,
          dy : lastY
        });
        $(endEvent.target).trigger(dropEvent);
      }
    });
  });


  $(window).on('mousedown', function (startEvent) {
    var startX = startEvent.originalEvent.screenX;
    var startY = startEvent.originalEvent.screenY;
    //  last 5 velocities recorded in x direction
    var vx = [0,0,0,0,0];
    var lastT = new Date();
    var lastD = 0;
    var firstD = 0;

    var lastX = startX;
    var lastY = startY;

    function drag(moveEvent) {
      moveEvent.preventDefault();

      var x = moveEvent.originalEvent.screenX;
      var y = moveEvent.originalEvent.screenY;
      var scale = 1;
      var t = new Date();

      var dx = x - lastX;
      var dy = y - lastY;
      var dragEvent = $.Event('drag', {
        dx : dx,
        dy : dy
      });

      $(startEvent.target).trigger(dragEvent);

      vx.shift();
      vx.push(dx / (t - lastT));

      lastX = x;
      lastY = y;
      lastT = t;
    }

    $(window).on('mousemove', drag);

    $(window).one('mouseup', function (endEvent) {
      $(window).off('mousemove', drag);
    });

    $(window).one('mouseup', function (endEvent) {
      vx.sort();
      var medianVx = vx[2];
      if (medianVx > 0.5) {
        var swiperightEvent = $.Event('swiperight', {
          vx : medianVx
        });
        $(startEvent.target).trigger(swiperightEvent);
      }
      else if (medianVx < -0.5) {
        var swipeleftEvent = $.Event('swipeleft', {
          vx : medianVx
        });
        $(startEvent.target).trigger(swipeleftEvent);
      }
      else {
        var dropEvent = $.Event('drop', {
          dx : lastX,
          dy : lastY
        });
        $(startEvent.target).trigger(dropEvent);
      }
    });
  });
});