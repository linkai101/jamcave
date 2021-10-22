
module.exports = {
  brush: function(ctx, path) {
    if (!path.length > 0) return;
    ctx.beginPath();
    path.forEach((coord) => {
      ctx.lineTo(coord.x, coord.y);
    });
    ctx.stroke();
    ctx.closePath();
  },

  line: function(ctx, path) {
    if (!path.length > 0) return;
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    ctx.lineTo(path[path.length-1].x, path[path.length-1].y);
    ctx.stroke();
    ctx.closePath();
  },

  rect: function(ctx, path) {
    if (!path.length > 0) return;
    ctx.beginPath();
    ctx.rect(path[0].x, path[0].y, path[path.length-1].x - path[0].x, path[path.length-1].y - path[0].y);
    ctx.stroke();
    ctx.closePath();
  },

  circle: function(ctx, path) {
    function getDistance(p1, p2) {
      return Math.sqrt(Math.abs(p2.x-p1.x)**2 + Math.abs(p2.y-p1.y)**2);
    }

    /*// display dot while drawing (disappears on release)
    ctx.beginPath();
    ctx.lineTo(function[0].x, function[0].y);
    ctx.stroke();
    ctx.closePath();*/
  
    if (!path.length > 0) return;
    ctx.beginPath();
    ctx.arc(path[0].x, path[0].y, getDistance(path[0], path[path.length-1]), 0, 2*Math.PI);
    ctx.stroke();
    ctx.closePath();
  },
}