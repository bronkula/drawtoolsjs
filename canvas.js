/*
 * Canvas.js from the DrawTools.js library
 * Creator: Hamilton Cline
 * Email: hamdiggy@gmail.com
 * Website: hamiltondraws.com
*/


/* This library requires the Maths.js library for a number of its functions */

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
   polygon:function(ctx,x,y,r,a,s){
     var eachangle = 360/s;
     var line = [];
     for(var i=0;i<=s;i++) {
       line.push(getSatelliteXY({x:x,y:y},a+(eachangle*i),r));
     }
     pathmaker.points(ctx,line);
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
      pathmaker.points(ctx,[
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
/* Draw a rectangle: x,y, width, height */
function drawRect(ctx,x,y,w,h,options){
   ctx = overRide(ctx,options);
   makePath(ctx,[["rect",x,y,w,h]]);
   fillIt(ctx,options);
   strokeIt(ctx,options);
}
/* Draw a Polygon: x,y, radius, start angle, sides */
function drawPolygon(ctx,x,y,r,a,s,options){
   ctx = overRide(ctx,options);
   makePath(ctx,[["polygon",x,y,r,a,s]]);
   fillIt(ctx,options);
   strokeIt(ctx,options);
}
/* Draw a rectangle with a random color, using the rand helper function */
function drawRandomRect(ctx,x,y,w,h,options){
   options.fillStyle = "rgba("+
      rand(120,250)+","+
      rand(120,250)+","+
      rand(120,250)+","+
      (options&&options.opacity!==undefined?options.opacity:0.7)+
      ")";
   drawRect(ctx,x,y,w,h,options);
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
/* Draw a shape with any number of sides */
function drawShape(ctx,x,y,r,a,s,options){
  var eachangle = 360/s;
  var line = [];
  for(var i=0;i<=s;i++) {
    line.push(getSatelliteXY({x:x,y:y},a+(eachangle*i),r));
  }
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
function drawPulse(ctx,x,y,outerRadius,innerRadius,options){
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
   // Draw the rows
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
