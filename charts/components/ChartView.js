class ChartView {
  constructor(options) {
    this.lines = options.lines;

    const defaultView = {
      width: 300,
      height: 150,
      scaleX: 1,
      scaleY: 1,
      shiftX: 0,
      strokeWidth: 1,
    };

    this.view = Object.assign(defaultView, options.view);

    this._createElement();
  }

  _createElement() {
    const container = document.createElement('div');
    container.style.width = this.view.width + 'px';
    container.style.height = this.view.height + 'px';

    const svg = this._createSVG();
    container.innerHTML = svg;

    this.element = container;
    this.svgElement = this.element.querySelector('svg');
    this.lineElements = this.lines.map((line, i) => {
      return this.element.querySelector(`.line-${i}`);
    });
  }

  _createSVG() {
    const {width, height, scaleX, scaleY, shiftX, strokeWidth} = this.view;

    let svg = `<svg
      version="1.2"
      baseProfile="full"
      xmlns="http://www.w3.org/2000/svg"
      width="${width}"
      height="${height}"
    >`;

    this.lines.forEach((line, i) => {
      svg += `<polyline
        class="line-${i}"
        points="${line.points}"
        stroke="${line.color}"
        fill="transparent"
        transform="translate(${-shiftX}, ${height}) scale(${width*scaleX}, ${-height*scaleY})"
        vector-effect="non-scaling-stroke"
        stroke-width="${strokeWidth}"
        stroke-linejoin="round"
      />`
    });

    svg += '</svg>';

    return svg;
  }

  _render() {
    const {width, height, scaleX, scaleY, shiftX} = this.view;

    this.svgElement.setAttribute('width', `${width}`);
    this.svgElement.setAttribute('height', `${height}`);

    this.lineElements.forEach((elem) => {
      elem.setAttribute(
        'transform',
        `translate(${-shiftX}, ${height}) scale(${width*scaleX}, ${-height*scaleY})`
      );
    });
  }

  setView(view) {
    this.view = Object.assign(this.view, view);
    this._render();
  }

  getElement() {
    return this.element;
  }

}
