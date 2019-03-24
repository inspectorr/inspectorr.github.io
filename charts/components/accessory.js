function animate(options) {
  const start = performance.now();

  options.context.id = requestAnimationFrame(function animate(time) {
    let timeFraction = (time - start) / options.duration;
    if (timeFraction < 0) timeFraction = 0;
    if (timeFraction > 1) timeFraction = 1;

    let progress = options.timing(timeFraction);
    options.draw(progress);

    if (timeFraction < 1) {
      options.context.id = requestAnimationFrame(animate);
    }
  });
}

function bench(func) {
  const start = performance.now();
  for (let i = 0; i < 100000; i++) {
    func();
  }
  const end = performance.now();
  console.log(end - start);
}
