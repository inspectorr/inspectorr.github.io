class TimeRow {
  constructor(options) {
    this.options = options;
    this.times = options.times;

    let [indexStart, indexEnd] = this._calculateIndexes(options.indexStart, options.indexEnd);
    this.indexStart = indexStart;
    this.indexEnd = indexEnd;

    this.scrollAnimation = {
      id: null
    }

    this._createElement();
  }

  _calculateIndexes(indexStart, indexEnd) {
    return [
      Math.ceil(indexStart*(this.options.times.length-1)/this.options.lastIndex),
      Math.round(indexEnd*(this.options.times.length-1)/this.options.lastIndex)
    ];
  }

  _createTimeElement(index, width, pos) {
    const time = document.createElement('div');
    time.classList.add('time');

    time.style.width = width + 'px';
    time.style.height = this.options.view.height + 'px';

    if (!pos) time.style.left = 0 + 'px';
    else if (pos.left) time.style.left = pos.left + 'px';
    else if (pos.right) time.style.right = pos.right + 'px';

    time.textContent = `${this.times[index].month} ${this.times[index].date}`;
    return time;
  }

  _setSeqData(indexStart, indexEnd) {
    let distIndex = indexEnd - indexStart;
    let step, n;
    while (!step) {
      if (distIndex % 5 === 0) {
        step = distIndex/5; n = 6;
      } else if (distIndex % 4 === 0) {
        step = distIndex/4; n = 5;
      } else if (distIndex % 3 === 0) {
        step = distIndex/3; n = 4;
      } else distIndex++;
    }

    indexStart = indexEnd - distIndex;
    let timeWidth = this.options.view.width / n;

    return {
      indexStart, step, timeWidth, n
    };
  }

  _createElement() {
    const element = document.createElement('div');
    const {width, height} = this.options.view;
    element.style.height = height + 'px';
    element.style.width = width + 'px';

    const { indexStart, step, timeWidth } = this._setSeqData(this.indexStart, this.indexEnd);
    this.indexStart = indexStart;
    this.step = step;
    this.timeWidth = timeWidth;

    for (let i = this.indexStart; i <= this.indexEnd; i+=this.step) {
      element.append(this._createTimeElement(i, this.timeWidth));
    }

    this.element = element;
  }

  changeIndexes(movementType, newIndexStart, newIndexEnd) {
    [newIndexStart, newIndexEnd] = this._calculateIndexes(newIndexStart, newIndexEnd); // осторожно приведенные индексы
    let indexDiff, N, shift, i;

    switch (movementType) {
      case 'l-move':
        indexDiff = this.indexStart-newIndexStart;
        if (indexDiff < this.step) return;

        N = Math.floor(indexDiff / this.step);

        for (i = 1; i <= N; i++) {
          const time = this._createTimeElement(
            this.indexStart-this.step*i,
            this.timeWidth,
            {left: -this.timeWidth*i}
          );
          time.classList.add('time-moving');
          this.element.prepend(time);
        }
        shift = this.timeWidth*N;

        cancelAnimationFrame(this.scrollAnimation.id);
        animate({
          context: this.scrollAnimation,
          duration: 150,
          timing: time => time,
          draw: (progress) => {
            this.element.style.left = shift*progress + 'px';
            if (progress === 1) {
              this.element.style.left = 0 + 'px';
              for (let i = 0; i < N; i++) {
                this.element.lastChild.remove();
              }
              for (let i = 0; i < this.element.children.length; i++) {
                this.element.children[i].classList.remove('time-moving');
                this.element.children[i].style.left = 0 + 'px';
              }
            }
          }
        });

        this.indexStart -= N*this.step;
        this.indexEnd -= N*this.step;
        break;

      case 'r-move':
        indexDiff = newIndexEnd - this.indexEnd;
        if (indexDiff < this.step) return;

        N = Math.floor(indexDiff / this.step);

        for (i = 1; i <= N; i++) {
          const time = this._createTimeElement(
            this.indexEnd+this.step*i,
            this.timeWidth,
            {right: -this.timeWidth*i}
          );
          time.classList.add('time-moving');
          this.element.append(time);
        }
        shift = this.timeWidth*N;

        cancelAnimationFrame(this.scrollAnimation.id);
        animate({
          context: this.scrollAnimation,
          duration: 100,
          timing: time => time,
          draw: (progress) => {
            this.element.style.left = -shift*progress + 'px';
            if (progress === 1) {
              this.element.style.left = 0 + 'px';
              for (let i = 0; i < N; i++) {
                this.element.firstChild.remove();
              }
              for (let i = 0; i < this.element.children.length; i++) {
                this.element.children[i].classList.remove('time-moving');
                this.element.children[i].style.right = 0 + 'px';
              }
            }
          }
        });

        this.indexStart += N*this.step;
        this.indexEnd += N*this.step;
        break;

      case 'l-expand': {
        // const { indexStart, step:newStep, timeWidth:newTimeWidth } = this._setSeqData(newIndexStart, newIndexEnd);
        // newIndexStart = indexStart;
        //
        // indexDiff = this.indexStart - newIndexStart;
        // if (indexDiff < this.step) return;
        //
        // console.log(newIndexStart, this.indexStart);
        //
        // const timeWidth = this.timeWidth;
        //
        // let n = 1;
        // for (i = this.indexStart-this.step; i >= newIndexStart; i-=this.step) {
        //   const time = this._createTimeElement(
        //     i,
        //     timeWidth,
        //     {left: -timeWidth*n++}
        //   );
        //   time.classList.add('time-moving');
        //   this.element.prepend(time);
        // }
        //
        // this.element.classList.add('exp-left');
        //
        // const len = this.element.children.length;
        // cancelAnimationFrame(this.scrollAnimation.id);
        // animate({
        //   context: this.scrollAnimation,
        //   duration: 150,
        //   timing: time => time,
        //   draw: (progress) => {
        //     for (let i = 0; i < len; i++) {
        //       const item = this.element.children[len-1-i];
        //       if (i % 2 === 0) {
        //         item.style.width = timeWidth + (newTimeWidth - timeWidth)*progress + 'px';
        //       } else {
        //         item.style.width = timeWidth - timeWidth*progress + 'px';
        //         item.style.opacity = 1 - progress;
        //       }
        //     }
        //
        //     if (progress === 1) {
        //       for (let i = 0; i < len; i++) {
        //         const item = this.element.children[len-1-i];
        //         if (i % 2 === 0) {
        //         } else {
        //           // item.remove();
        //         }
        //       }
        //       this.indexStart = newIndexStart;
        //       this.timeWidth = newTimeWidth;
        //       this.step = newStep; ////// ничего не успел(((((((((
        //     }
        //   }
        // });

      }
    }


  }

  getElement() {
    return this.element;
  }
}
