/*
 * Draw Tools v1.2.1
 * Creator: Hamilton Cline
 * Email: hamdiggy@gmail.com
 * Website: hamiltondraws.com
*/


/*
Context options to remember

fillStyle:"#fff"

strokeStyle:"#000"
lineWidth:number
lineJoin:"round|bevel|miter"
lineCap:"round|butt|square"

font:"16px verdana"
textAlign:"center|left|right"
textBaseline:"top|middle|bottom|alphabetic|hanging"

globalAlpha:0-1
globalCompositeOperation:"source-over|destination-out"
*/










/*----------------------------------------------------------------------*/
/*                         Path functions                               */

var pathmaker = {
   start:function(ctx){
      ctx.beginPath();
   },
   end:function(ctx){
      ctx.closePath();
   },
   points:function(ctx,pts){
      if(pts.length<2) return false;
      ctx.moveTo(pts[0].x,pts[0].y);
      for(var i in pts) {
         ctx.lineTo(pts[i].x,pts[i].y);
      }
   },
   circle:function(ctx,x,y,r,a1,a2,a3){
      pathmaker.arc(ctx,x,y,r,
        a1!==undefined?a1:0,
        a2!==undefined?a2:2*Math.PI,
        a3!==undefined?a3:undefined);
   },
   arc:function(ctx,x,y,r,a1,a2,a3){
      ctx.arc(x,y,r,a1,a2,a3);
   },
   rect:function(ctx,x,y,w,h){
      pathPoints([
         {x:x,y:y},
         {x:x+w,y:y},
         {x:x+w,y:y+h},
         {x:x,y:y+h},
         {x:x,y:y}
      ]);
   },
   pie:function(ctx,x,y,or,ir,sa,ea,ad){
      sa = degreesToRadians(sa);
      ea = sa + degreesToRadians(ea);
      pathmaker.arc(ctx,x,y,or, sa, ea, !ad);
      pathmaker.arc(ctx,x,y,ir, ea, sa, ad);
   },
   roundRect:function(ctx,x,y,w,h,r){
      if (typeof r === 'undefined') r = 0;
      if (typeof r === 'number') {
         r = {tl: r, tr: r, br: r, bl: r};
      } else {
         r = overRide({tl: 0, tr: 0, br: 0, bl: 0},r);
      }
      ctx.moveTo(x + r.tl, y);
      ctx.lineTo(x + w - r.tr, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r.tr);
      ctx.lineTo(x + w, y + h - r.br);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
      ctx.lineTo(x + r.bl, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r.bl);
      ctx.lineTo(x, y + r.tl);
      ctx.quadraticCurveTo(x, y, x + r.tl, y);
   }
}
function makePath(ctx,paths) {
   pathmaker.start(ctx);
   var type;
   for(var i in paths) {
      type = paths[i].splice(0,1,ctx)[0];
      pathmaker[type].apply(null,paths[i]);
   }
   pathmaker.end(ctx);
}


/*----------------------------------------------------------------------*/
/*                         Draw functions                               */

/* Stroke path */
function strokeIt(ctx,options) {
   if(!options) return;
   if(options.lineWidth) {
      ctx = overRide(ctx,options);
      ctx.stroke();
   }
}
/* Fill a path */
function fillIt(ctx,options){
   if(!options) return;
   if(options.fillStyle) {
      ctx = overRide(ctx,options);
      ctx.fill();
   }
}


/* Draw a circle */
function drawCircle(ctx,x,y,r,options){
   makePath(ctx,[["circle",x,y,r]]);
   fillIt(ctx,options);
   strokeIt(ctx,options);
}
/* Draw a rectangle */
function drawRect(ctx,x,y,w,h,options){
   ctx = overRide(ctx,options);
   ctx.fillRect(x,y,w,h);
}
/* Draw a rectangle with a random color, using the rand helper function */
function drawRandomRect(ctx,x,y,w,h,options){
   o.fillStyle = "rgba("+
      rand(120,250)+","+
      rand(120,250)+","+
      rand(120,250)+","+
      (options&&options.opacity!==undefined?options.opacity:0.7)+
      ")";
   drawRect(ctx,x,y,w,h,o);
}
/* Draw one line segment */
function drawSegment(ctx,x1,y1,x2,y2,options){
   makePath(ctx,[["points",[
      {x:x1,y:y1},
      {x:x2,y:y2}
      ]]]);
   strokeIt(ctx,options);
}
/* Draw an array of line segments, allowing smooth connections */
function drawLine(ctx,line,options){
   makePath(ctx,[["points",line]]);
   strokeIt(ctx,options);
   fillIt(ctx,options);
}

/* Draw text */
function drawText(ctx,text,x,y,options){
   ctx = overRide(ctx,options);
   if(options.lineWidth) ctx.strokeText(text,x,y);
   if(options.fillStyle) ctx.fillText(text,x,y);
}
/* Draw text, replacing new lines characters with visible line breaks */
function drawParagraph(ctx,text,x,y,lineHeight,options) {
  var ps = text.split(/\n/);
  for(var i in ps) {
    drawText(ctx,ps[i],x,y+(lineHeight*i),options);
  }
}
/* Draw text with a cut out stroke */
function drawLabel(ctx,text,x,y,options){
   ctx = overRide(ctx,options);
   ctx.globalCompositeOperation = "destination-out";
   ctx.strokeText(text,x,y);
   ctx.globalCompositeOperation = "source-over";
   ctx.fillText(text,x,y);
}

/* Draw a circle with a cutout circle */
function drawPulse2(ctx,x,y,outerRadius,innerRadius,options){
   drawCircle(ctx,x,y,outerRadius,options);
   ctx.globalCompositeOperation = "destination-out";
   drawCircle(ctx,x,y,innerRadius,options);
   ctx.globalCompositeOperation = "source-over";
}

/* Draw a pie shape or donut pie shape */
function drawPie(ctx,x,y,outerRadius,innerRadius,startangle,endangle,additive,options){
   makePath(ctx,[["pie",x,y,outerRadius,innerRadius,startangle,endangle,additive]]);
   fillIt(ctx,options);
   strokeIt(ctx,options);
}

// http://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-on-html-canvas
function drawRoundRect(ctx, x, y, w, h, r, options) {
   makePath(ctx,[["roundRect",x, y, w, h, r]])
   strokeIt(ctx,options);
   fillIt(ctx,options);
}

/* draw a series of circle at x y coordinates */
function drawPoints(ctx,line,radius,options) {
   pathmaker.start(ctx);
   for(var i in line) {
      pathmaker.circle(ctx,line[i].x,line[i].y,radius);
   }
   pathmaker.end(ctx);
   strokeIt(ctx,options);
   fillIt(ctx,options);
}
/* draw a series of lines vertically and horizontally */
function drawGrid(ctx,rows,cols,x,y,w,h,options) {
   pathmaker.start(ctx);
   for(var i=0;i<=rows;i++) {
      pathmaker.points(ctx,[
         {x:x,y:(h*(i/rows))+y},
         {x:x+w,y:(h*(i/rows))+y}
         ]);
   }
   // Draw the columns
   for(var i=0;i<=cols;i++) {
      pathmaker.points(ctx,[
         {x:(w*(i/cols))+x,y:y},
         {x:(w*(i/cols))+x,y:y+h}
         ]);
   }
   pathmaker.end(ctx);
   strokeIt(ctx,options);
   fillIt(ctx,options);
}
/* Draw a grid, a line, and a series of points */
function drawLineGraph(ctx,line,x,y,w,h){
   drawGrid(ctx,3,5,x,y,w,h,{
      strokeStyle:"#ddd",
      lineWidth:2,
      lineJoin:"round",
      lineCap:"round"
   })
   drawLine(ctx,line,{
      strokeStyle:"black",
      lineWidth:6,
      lineJoin:"round",
      lineCap:"round"
   });
   drawPoints(ctx,line,6,{
      fillStyle:"white",
      strokeStyle:"black",
      lineWidth:4
   })
}


// http://stackoverflow.com/questions/3793397/html5-canvas-drawimage-with-at-an-angle
function rotateAndDo ( ctx, angleInRad , positionX, positionY, callback) {
   ctx.translate( positionX, positionY );
   ctx.rotate( angleInRad );
   callback();
   ctx.rotate( -angleInRad );
   ctx.translate( -positionX, -positionY );
}
/* This function does three operations, and saves first */
function translateScaleRotate(ctx,x,y,sx,sy,r,fn) {
  ctx.save();
   ctx.translate(x,y);
   ctx.scale(sx,sy);
   ctx.rotate(r);
   fn();
  ctx.restore();
}
/* This function will Translate and then Scale, and saves first */
function translateScale(ctx,x,y,sx,sy,fn) {
  ctx.save();
   ctx.translate(x,y);
   ctx.scale(sx,sy);
   fn();
  ctx.restore();
}
/* Translate, Scale, Rotate, then draw an image */
function drawImageTSR(ctx,img,x,y,w,h,sx,sy,r) {
  translateScaleRotate(ctx,x,y,sx,sy,r,function(){
    ctx.drawImage(img,-w*0.5,-h*0.5,w,h);
  });
}



/*---------------------- Math Helper Functions -----------------------------*/

/* Turn degrees into Radians, necessary for circle math */
function degreesToRadians(num) {
   return (num * Math.PI)/180;
}
/* Turn Radians into Degrees, necessary for circle math */
function radiansToDegrees(num) {
   return (num * 180)/Math.PI;
}
/* Get a positional offset for x or y useful for placing something on an arc around point */
function getSatellite(start,angle,distance,isX) {
   return start+Math[isX?"cos":"sin"](degreesToRadians(angle))*distance;
}
/* Returns the angle from two points */
function angleFromPoints(x1,y1,x2,y2,inRadians){
   var angleRadians = Math.atan2(y2 - y1, x2 - x1);
   return inRadians?angleRadians:radiansToDegrees(angleRadians);
}
// Will return the angle opposite of the B side
function angleFromSides(a,b,c) {
  return Math.acos((c*c+a*a-b*b)/(2*c*a));
}
/* Returns a 0,360 degree angle from a -180,180 degree angle */
function trueAngle(a) {
  return a<0?360+a:a;
}
/* A random number between n and x */
function rand(n,x){
   return Math.round(Math.random()*(x-n))+n;
}
/* Make sure a number does not passbelow a min or above a max */
function clamp(a,min,max){
    return Math.min(Math.max(a,min),max);
}
/* Returns an x y object */
function xy(x,y){
    this.x = x;
    this.y = y;
}
/* Absolute number */
function abs(a) { 
   return a < 0 ? -a : a;
}
/* Vector cross product. This shit is magic */
function vxs(x0,y0,x1,y1) {
    return (x0*y1) - (x1*y0);
}
/* If p(osition) is outside of n or x, return a reversed s(peed) */
function bounce(p,s,n,x) {
  return (p>=x||p<=n)?-s:s;
}
/* This function takes two objects, and replaces or adds any values in object 1 with the values of object 2 */
function overRide(op,ov) {
   if(!ov) return op;
   for(var i in ov) {
      if(ov.hasOwnProperty(i) === false) continue;
      op[i] = ov[i];
   }
   return op;
}




/*------------------------ Positional Functions ------------------------------------*/
/* The distance between two points */
function pointDistance(x1,y1,x2,y2) {
    var dx = x1 - x2;
    var dy = y1 - y2;
    return distance = Math.sqrt(dx * dx + dy * dy);
}
/* check if two number ranges overlap */
function overlap(a0,a1,b0,b1){
    return Math.min(a0,a1) <= Math.max(b0,b1) && Math.min(b0,b1) <= Math.max(a0,a1);
}
/* check if two boxes overlap */
function intersectBox(x0,y0,x1,y1,x2,y2,x3,y3) {
    return overlap(x0,x1,x2,x3) && overlap(y0,y1,y2,y3);
}
/* determine which side of a line a point is on */
function pointSide(px,py,x0,y0,x1,y1) {
    return vxs(x1-x0,y1-y0,px-x0,py-y0);
}
/* Intersect: Calculate the point of intersection between two lines. */
function intersect(x0,y0,x1,y1,x2,y2,x3,y3) {
    return new xy(
    vxs(vxs(x0,y0,x1,y1),x0-x1,vxs(x2,y2,x3,y3),x2-x3) /
    vxs(x0-x1,y0-y1,x2-x3,y2-y3), 
    vxs(vxs(x0,y0,x1,y1),y0-y1,vxs(x2,y2,x3,y3),y2-y3) /
    vxs(x0-x1,y0-y1,x2-x3,y2-y3)
    );
}
/* Calculate if two lines intersect */
function isIntersect(x0,y0,x1,y1,x2,y2,x3,y3) {
    return IntersectBox(x0,y0,x1,y1, x2,y2,x3,y3)
        && abs(PointSide(x2,y2,x0,y0,x1,y1) + PointSide(x3,y3,x0,y0,x1,y1)) != 2
        && abs(PointSide(x0,y0,x2,y2,x3,y3) + PointSide(x1,y1,x2,y2,x3,y3)) != 2;
}
/* Detect if a point is in a rectangle */
function pointInRect(px,py,x1,y1,x2,y2){
   return px >= x1 && px <= x2 && py >= y1 && py <= y2;
}
/* Detect if a rectangle is fully within another rectangle */
function rectInRect(x0,y0,x1,y1,x2,y2,x3,y3) {
   return pointInRect(x0,y0,x2,y2,x3,y3) && pointInRect(x1,y1,x2,y2,x3,y3);
}
/* detect if a circle is touching another circle. Use 0 for r1 if a point */
function detectCircleCollission(x1,y1,r1,x2,y2,r2) {
    var dx = x1 - x2;
    var dy = y1 - y2;
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < r1 + r2) return true;
    else return false;
}






/*------------------------------- Point Detection Functions -----------------------*/
/* These Require jQuery Events */
/* Determine if an event is a touch event */
function isTouch(e) {
   return e.type.substring(0,5) == "touch";
}
/* Return an array of either touches or a click */
function ev(e){
   if(isTouch(e)) {
      if(!e.originalEvent.touches.length) return e.originalEvent.changedTouches;
      else return e.originalEvent.touches;
   } else {
      return [e];
   }
}
/* return an offset xy object for the position of the click or touch in the object */
function getEXY(e) {
   var offs = $(e.target).offset();
   x = e.pageX - offs.left;
   y = e.pageY - offs.top;
   var ratio = ratio===undefined?1:ratio;
   return new xy(ratio*x,ratio*y);
}
/* Return the first xy position from an event, whether touch or click */
function getEventXY(e){
   return getEXY(ev(e)[0]);
}


