class Chart {
  constructor(options) {
    this.store = new ChartStore(options.data);
    this.num = options.index;

    const width = this._indexToPx(options.view.chartMap.thumb.days, options.view.chartMap.width);
    const minWidth = this._indexToPx(options.view.chartMap.thumb.minDays, options.view.chartMap.width);
    options.view.chartMap.thumb = Object.assign(options.view.chartMap.thumb, { width, minWidth });
    this.chartMap = new ChartMap({
      lines: this.store.outputLines,
      view: options.view.chartMap,
    });

    this.indexEnd = this.store.lastIndex;
    this.indexStart = this.indexEnd - options.view.chartMap.thumb.days;
    this.currentLocalPeak = this.store.getLocalPeak(this.indexStart, this.indexEnd);
    const scaleY = this.store.globalPeak / this.currentLocalPeak.peak;
    const scaleX = (this.chartMap.view.width / this.chartMap.period.width);
    const shiftX = this.chartMap.period.left * scaleX;
    const initialView = { scaleY, scaleX, shiftX };
    this.mainChart = new MainChart({
      times: this.store.times,
      lines: this.store.outputLines,
      view: Object.assign(options.view.mainChart, initialView),
    });

    this.timeRow = new TimeRow({
      times: this.store.times,
      indexStart: this.indexStart,
      indexEnd: this.indexEnd,
      lastIndex: this.store.lastIndex,
      view: {
        height: options.view.timeScale.height,
        width: options.view.timeScale.width,
      }
    });

    this.scrollAnimation = {
      id: null,
    };
    this.alignAnimation = {
      id: null,
    };

    this.lastShiftX = null;
    this.lastScaleX = null;
    this.lastScaleY = null;

    this.lastIndexStart = this.indexStart;
    this.lastIndexEnd = this.indexEnd;

    this._createElement();
    this._listen();
  }

  _createElement() {
    const container = document.createElement('div');
    container.classList.add('Chart');
    container.style.maxWidth = this.mainChart.view.width;

    const header = document.createElement('h2');
    header.classList.add('header');
    header.textContent = `Chart ${this.num}`;

    const mainChartElement = this.mainChart.getElement();
    mainChartElement.classList.add('main');

    const timeRowElement = this.timeRow.getElement();
    timeRowElement.classList.add('time-row');

    const chartMapElement = this.chartMap.getElement();
    chartMapElement.classList.add('map');

    container.append(header);
    container.append(mainChartElement);
    container.append(timeRowElement);
    container.append(chartMapElement);

    this.element = container;
  }

  _calculateIndexes(period) {
    this.indexStart = Math.ceil(period.left*this.store.lastIndex / this.chartMap.view.width);
    this.indexEnd = Math.floor((period.left+period.width)*this.store.lastIndex / this.chartMap.view.width);
  }

  _getClosestPeakData(shiftIndex, widthIndex, movementType) {
    let closestPeak, currentPeak = this.currentLocalPeak;
    let indexStart = this.indexStart, indexEnd = this.indexEnd, lastIndex = this.store.lastIndex;

    switch (movementType[0]) {
      case 'r':
        indexEnd += shiftIndex;
        if (indexEnd > lastIndex) indexEnd = lastIndex;
        closestPeak = this.store.getLocalPeak(indexStart, indexEnd);
        break;
      case 'l':
        indexEnd -= shiftIndex;
        if (indexStart < 0) indexStart = 0;
        closestPeak = this.store.getLocalPeak(indexStart, indexEnd);
        break;
    }

    return closestPeak;
  }

  _scrollMainChart(period) {
    cancelAnimationFrame(this.scrollAnimation.id);

    if (this.lastShiftX !== null) {
      this.mainChart.setView({
        scaleX: this.lastScaleX,
        shiftX: this.lastShiftX,
      });
    }

    const {scaleX, shiftX, scaleY} = this.mainChart.view;
    const newScaleX = (this.chartMap.view.width / period.width);
    const newShiftX = period.left * newScaleX;

    animate({
      context: this.scrollAnimation,
      duration: 100,
      timing: time => time,
      draw: (progress) => {
        this.mainChart.setView({
          shiftX: shiftX + (newShiftX - shiftX)*progress,
          scaleX: scaleX + (newScaleX - scaleX)*progress,
        });
      }
    });

    this.lastShiftX = newShiftX;
    this.lastScaleX = newScaleX;
  }

  _mapPxToIndex(px) {
    return Math.round(px*this.store.lastIndex/this.chartMap.view.width);
  }

  _indexToPx(index, width) {
    return Math.round(index*width/this.store.lastIndex);
  }

  _alignMainChart(shift, nextLocalPeak, done) {
    cancelAnimationFrame(this.alignAnimation.id);
    const scaleY = this.mainChart.view.scaleY;
    const newScaleY = this.store.globalPeak / nextLocalPeak;

    const scaleDiff = Math.abs(newScaleY - scaleY);

    // let duration = scaleDiff * 200 + (shift ? 350 / shift : 0); ////////
    let duration = shift ? 500 / shift : 0; ////////
    duration = Math.round(duration);

    // console.log(duration);

    animate({
      context: this.alignAnimation,
      duration,
      timing: time => time,
      draw: (progress) => {
        this.mainChart.setView({
          scaleY: scaleY + (newScaleY - scaleY)*progress,
        });
        if (progress === 1 && done) done();
      }
    });

    this.lastScaleY = newScaleY;
  }

  _listen() {
    this.chartMap.setPeriodEventTarget(this.mainChart.element);
    this.mainChart.element.addEventListener('period', (e) => {
      const period = e.detail.period;

      this._scrollMainChart(period);

      this._calculateIndexes(period);
      if (this.lastIndexStart === this.indexStart && this.lastIndexEnd === this.indexEnd) return;
      this.lastIndexStart = this.indexStart; this.lastIndexEnd = this.indexEnd;
      // console.log(this.indexStart, this.indexEnd);
      this.timeRow.changeIndexes(period.movementType, this.indexStart, this.indexEnd);

      this.currentLocalPeak = this.store.getLocalPeak(this.indexStart, this.indexEnd);

      const shiftIndex = this._mapPxToIndex(period.shift);
      const widthIndex = this._mapPxToIndex(period.width);
      const closestPeakData = this._getClosestPeakData(shiftIndex, widthIndex, period.movementType);

      let predictionChanged = !this.animationInProgress && this.predictedPeakIndex !== closestPeakData.index;
      let newRequired = this.animationInProgress && this.predictedPeakIndex !== this.currentLocalPeak.index;
      let targetPeak = closestPeakData;

      // console.log(period.movementType, this.currentLocalPeak.index, period.shift, this.predictedPeakIndex, closestPeakData.index, this.animationInProgress);

      // const treshold = this.chartMap.view.width * 0.1;
      // console.log(period.shift, treshold);
      // if (period.shift > treshold) return;

      if (predictionChanged || newRequired) {
        this.animationInProgress = true;
        new Promise((done) => {
          // console.log(`animation to ${targetPeak.index}`);
          this._alignMainChart(period.shift, targetPeak.peak, done);
        }).then(() => {
          this.animationInProgress = false;
        });

        this.predictedPeakIndex = closestPeakData.index;
      }

    });
  }

  onMount() {
    this.chartMap.onMount();
  }

  getElement() {
    return this.element;
  }
}
