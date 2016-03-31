(function(){

  'use strict';

  var image = d3.select('#js-image'),
      frame = d3.select('#js-frame');

  var imageWidth = parseInt(image.property('width'), 10),
      imageHeight = parseInt(image.property('height'), 10);

  var frameWidth = parseInt(frame.property('clientWidth'), 10),
      frameHeight = parseInt(frame.property('clientHeight'), 10);

  var width = parseInt(image.attr('width'), 10),
      height = parseInt(image.attr('height'), 10);

  var lastX = 0,
      lastY = 0,
      lastScale = 1;

  var zoom = d3.behavior.zoom();

  zoom.scale(1);
  zoom.scaleExtent([0.1, 10]);
  zoom.size([frameWidth, frameHeight]);

  zoom.on('zoom.move', function() {
    var x, y, scale, transform;

    x = d3.event.translate[0];
    y = d3.event.translate[1];
    scale = d3.event.scale;

    console.group('data');
    console.log('x: %s', x);
    console.log('y: %s', y);
    console.log('scale: %s', scale);
    console.log('lastX: %s', lastX);
    console.log('lastY: %s', lastY);
    console.log('lastScale: %s', lastScale);
    console.groupEnd();

    // reset d3.event.scale
    zoom.scale(scale);
    // reset d3.event.translate
    zoom.translate([x, y]);

    transform = 'translate(%dpx,%dpx) scale(%d,%d)'
      .replace('%d', x)
      .replace('%d', y)
      .replace('%d', scale)
      .replace('%d', scale);

    lastX = x;
    lastY = y;
    lastScale = scale;

    image
      .style('transform-origin', '0 0')
      .style('-moz-transform-origin', '0 0')
      .style('-webkit-transform-origin', '0 0')
      .style('transform', transform)
      .style('-moz-transform', transform)
      .style('-webkit-transform', transform);
  });

  frame.call(zoom);

  //----------------------------------------------------------------------------

  var draw = d3.select('#js-draw'),
      canvas = d3.select('#js-canvas');

  draw.on('click', function() {
    var event, offscreen, context, ctx,
        srcX, srcY, srcW, srcH,
        destX, destY, destW, destH;

    event = d3.event;

    offscreen = document.createElement('canvas');
    offscreen.width = width;
    offscreen.height = height;

    context = offscreen.getContext('2d');
    context.scale(lastScale, lastScale);
    context.drawImage(image.node(), 0, 0);

    ctx = canvas.node().getContext('2d');
    ctx.clearRect(0, 0, frameWidth, frameHeight);

    srcX = (lastX >= 0) ? 0 : -lastX;
    destX = (lastX >= 0) ? lastX : 0;

    srcY = (lastY >= 0) ? 0 : -lastY;
    destY = (lastY >= 0) ? lastY : 0;

    srcW = (srcX > 0) ? imageWidth - srcX : imageWidth;
    destW = (srcX > 0) ? width - srcX : width;

    srcH = (srcY > 0) ? imageHeight - srcY : imageHeight;
    destH = (srcY > 0) ? height - srcY : height;

    console.group('drawImage');
    console.log('srcX: %s', srcX);
    console.log('srcY: %s', srcY);
    console.log('srcW: %s', srcW);
    console.log('srcH: %s', srcH);
    console.log('destX: %s', destX);
    console.log('destY: %s', destY);
    console.log('destW: %s', destW);
    console.log('destH: %s', destH);
    console.groupEnd();

    ctx.drawImage(
      offscreen,
      srcX, srcY, srcW, srcH,
      destX, destY, destW, destH
    );
  });

}());
