function PeriodSlider(options) {
  const {
    slider, width,
    // outLeft, outLeftWidth,
    outLeft,
    outRight,
    thumb,
    // thumb, thumbWidth, thumbMinWidth,
    period, onPeriodChange
  } = options;

  const thumbMinWidth = period.minWidth;
  // console.log(period);

  let shiftZeroingTimerId;
  function shiftZeroingTimer() {
    clearTimeout(shiftZeroingTimerId);
    shiftZeroingTimerId = setTimeout(() => {
      period.shift = 0;
      onPeriodChange(period);
    } , 100);
  }

  // let speedometer;
  // function startSpeedometer() {
  //   let lastShift = shiftX;
  //   speedometer = setInterval(() => {
  //     period.speed = Math.abs(shiftX - lastShift) / 50;
  //     lastShift = shiftX;
  //     console.log(period.speed);
  //   }, 50);
  // }
  //
  // function stopSpeedometer() {
  //   clearTimeout(speedometer);
  // }

  const center = thumb.querySelector('.center');
  const right = thumb.querySelector('.right');
  const left = thumb.querySelector('.left');

  let startX, shiftX, lastShiftX, startLeft, startRight, maxOut;

  slider.addEventListener('mousedown', (e) => {
    e.preventDefault();
    handleMouseDown(e.target, e.clientX);
  });

  slider.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleTouchStart(e.target, e.targetTouches[0].clientX);
  }, {passive: true});

  function handleMouseDown(target, x) {
    switch (target) {
      case center:
        startDrag(x);
        document.addEventListener('mousemove', onMouseDragMove);
        document.addEventListener('mouseup', onMouseDragEnd);
        break;
      case right:
        startExpandRight(x);
        document.addEventListener('mousemove', onMouseExpandRightMove);
        document.addEventListener('mouseup', onMouseExpandRightEnd);
        break;
      case left:
        startExpandLeft(x);
        document.addEventListener('mousemove', onMouseExpandLeftMove);
        document.addEventListener('mouseup', onMouseExpandLeftEnd);
        break;
    }
  };

  function handleTouchStart(target, x) {
    switch (target) {
      case center:
        startDrag(x);
        document.addEventListener('touchmove', onTouchDragMove);
        document.addEventListener('touchend', onTouchDragEnd);
        break;
      case right:
        startExpandRight(x);
        document.addEventListener('touchmove', onTouchExpandRightMove);
        document.addEventListener('touchend', onTouchExpandRightEnd);
        break;
      case left:
        startExpandLeft(x);
        document.addEventListener('touchmove', onTouchExpandLeftMove);
        document.addEventListener('touchend', onTouchExpandLeftEnd);
        break;
    }
  };

  function startDrag(x) {
    // startSpeedometer();
    startX = x;
    lastShiftX = 0;
    startLeft = period.left;
    startRight = period.right;
    maxOut = width - period.width;
  }

  function startExpandRight(x) {
    // startSpeedometer();
    startX = x;
    lastShiftX = 0;
    startRight = period.right;
    maxOut = width - period.left - thumbMinWidth;
  }

  function startExpandLeft(x) {
    // startSpeedometer();
    startX = x;
    lastShiftX = 0;
    startLeft = period.left;
    maxOut = width - period.right - thumbMinWidth;
  }

  function moveTo(clientX) {
    shiftX = clientX - startX;

    let newLeft = startLeft + shiftX;
    let newRight = startRight - shiftX;

    if (newLeft < 0) {
      newLeft = 0;
      newRight = maxOut;
    } else if (newRight < 0) {
      newRight = 0;
      newLeft = maxOut;
    }

    outLeft.style.width = newLeft + 'px';
    outRight.style.width = newRight + 'px';

    if (period.left !== newLeft) {
      period.left = newLeft;
      period.right = width - newLeft - period.width;
      period.movementType = shiftX > lastShiftX ? 'r-move' : 'l-move';
      period.shift = Math.abs(shiftX - lastShiftX);

      shiftZeroingTimer();
      onPeriodChange(period);

      lastShiftX = shiftX;
    }
  }

  function expandRightTo(clientX) {
    shiftX = clientX - startX;

    let newRight = startRight - shiftX;
    if (newRight < 0) newRight = 0;
    if (newRight > maxOut) newRight = maxOut;

    outRight.style.width = newRight + 'px';

    if (period.right !== newRight) {
      period.right = newRight;
      period.width = width - period.left - newRight;
      period.movementType = shiftX > lastShiftX ? 'r-expand' : 'l-shrink';
      period.shift = Math.abs(shiftX - lastShiftX);

      shiftZeroingTimer();
      onPeriodChange(period);

      lastShiftX = shiftX;
    }
  }

  function expandLeftTo(clientX) {
    shiftX = clientX - startX;

    let newLeft = startLeft + shiftX;
    if (newLeft < 0) newLeft = 0;
    if (newLeft > maxOut) newLeft = maxOut;

    outLeft.style.width = newLeft + 'px';

    if (period.left !== newLeft) {
      period.left = newLeft;
      period.width = width - newLeft - period.right;
      period.movementType = shiftX > lastShiftX ? 'r-shrink' : 'l-expand';
      period.shift = Math.abs(shiftX - lastShiftX);

      shiftZeroingTimer();
      onPeriodChange(period);

      lastShiftX = shiftX;
    }
  }

  function onMouseDragMove(e) {
    moveTo(e.clientX);
  }
  function onTouchDragMove(e) {
    moveTo(e.targetTouches[0].clientX);
  }

  function onMouseExpandLeftMove(e) {
    expandLeftTo(e.clientX);
  }
  function onTouchExpandLeftMove(e) {
    expandLeftTo(e.targetTouches[0].clientX);
  }

  function onMouseExpandRightMove(e) {
    expandRightTo(e.clientX);
  }
  function onTouchExpandRightMove(e) {
    expandRightTo(e.targetTouches[0].clientX);
  }

  function onMouseDragEnd() {
    // stopSpeedometer();
    document.removeEventListener('mousemove', onMouseDragMove);
    document.removeEventListener('mouseup', onMouseDragEnd);
  }
  function onTouchDragEnd() {
    // stopSpeedometer();
    document.removeEventListener('touchmove', onTouchDragMove);
    document.removeEventListener('touchend', onTouchDragEnd);
  }

  function onMouseExpandRightEnd() {
    // stopSpeedometer();
    document.removeEventListener('mousemove', onMouseExpandRightMove);
    document.removeEventListener('mouseup', onMouseExpandRightEnd);
  }
  function onTouchExpandRightEnd() {
    // stopSpeedometer();
    document.removeEventListener('touchmove', onTouchExpandRightMove);
    document.removeEventListener('touchend', onTouchExpandRightEnd);
  }

  function onMouseExpandLeftEnd() {
    // stopSpeedometer();
    document.removeEventListener('mousemove', onMouseExpandLeftMove);
    document.removeEventListener('mouseup', onMouseExpandLeftEnd);
  }
  function onTouchExpandLeftEnd() {
    // stopSpeedometer();
    document.removeEventListener('touchmove', onTouchExpandLeftMove);
    document.removeEventListener('touchend', onTouchExpandLeftEnd);
  }

}
