
/*
Context options to remember


fillStyle:"#fff"
strokeStyle:"#000"

lineWidth:number
lineJoin:"round|bevel|miter"
lineCap:"round|butt|square"

font:"16px verdana"
textAlign:"center|left|right"
textBaselign:"top|middle|bottom|alphabetic|hanging"

globalAlpha:0-1
globalCompositeOperation:"source-over|destination-out"

*/




/* This function takes two objects, and replaces or adds any values in object 1 with the values of object 2 */
function overRide(op,ov) {
   if(!ov) return op;
   for(var i in ov) {
      op[i] = ov[i];
   }
   return op;
}




/*----------------------------------------------------------------------*/
/*                         Draw functions                               */

/* Draw a circle */
function drawCircle(ctx,x,y,r,options){
   ctx.beginPath();
   ctx.arc(x,y,r,0,2*Math.PI);
   fillIt(ctx,options);
   strokeIt(ctx,options);
}
/* Draw a rectangle */
function drawRect(ctx,x,y,w,h,options){
   ctx = overRide(ctx,options);
   ctx.fillRect(x,y,w,h);
}
/* Draw a rectangle with a random color */
function drawRandomRect(ctx,x,y,w,h,options){
   o = overRide({
      lineWidth:0,
      strokeStyle:"black",
      fillStyle:"rgba("+rand(120,250)+","+rand(120,250)+","+rand(120,250)+","+(options&&options.opacity!==undefined?options.opacity:0.7)+")"
   },options);
   drawRect(ctx,x,y,w,h,o);
}
/* Draw one line segment */
function drawSegment(ctx,x1,y1,x2,y2,options){
   ctx.beginPath();
   ctx.moveTo(x1,y1);
   ctx.lineTo(x2,y2);
   strokeIt(ctx,options)
}
/* Draw an array of line segments, allowing smooth connections */
function drawLine(ctx,lines,options){
   ctx.beginPath();
   ctx.moveTo(lines[0].x,lines[0].y);
   for(var i=1,l=lines.length; i<l; i++) {
      ctx.lineTo(lines[i].x,lines[i].y);
   }
   strokeIt(ctx,options);
}

/* Draw text */
function drawText(ctx,text,x,y,options){
   ctx = overRide(ctx,options);
   if(o.lineWidth) ctx.strokeText(text,x,y);
   ctx.fillText(text,x,y);
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
function drawPulse2(ctx,x,y,oRadius,iRadius,options){
   drawCircle(ctx,x,y,oRadius,options);
   ctx.globalCompositeOperation = "destination-out";
   drawCircle(ctx,x,y,iRadius,options);
   ctx.globalCompositeOperation = "source-over";
}

/* Draw a pie shape or donut pie shape */
function drawPie(ctx,x,y,outerRadius,innerRadius,startangle,endangle,additive,options){
   var startingAngle = degreesToRadians(startangle);
   var arcSize = degreesToRadians(endangle);
   var endingAngle = startingAngle + arcSize;

   ctx.beginPath();
   ctx.arc(x, y, outerRadius, startingAngle, endingAngle, !additive);
   ctx.arc(x, y, innerRadius, endingAngle, startingAngle, additive);
   ctx.closePath();
   fillIt(ctx,options);
   strokeIt(ctx,options);
}

/* draw a series of circle at x y coordinates */
function drawPoints(ctx,line,radius,options) {
   for(var i in line) {
      drawCircle(ctx,line[i].x,line[i].y,radius,options);
   }
}
/* draw a series of lines vertically and horizontally */
function drawGrid(ctx,rows,cols,x,y,w,h,options) {
   for(var i=0;i<=rows;i++) {
      drawSegment(ctx,x,(h*(i/rows))+y,x+w,(h*(i/rows))+y,options)
   }
   for(var i=0;i<=cols;i++) {
      drawSegment(ctx,(w*(i/cols))+x,y,(w*(i/cols))+x,y+h,options)
   }
}
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




function degreesToRadians(degrees) {
   return (degrees * Math.PI)/180;
}
function getSatellite(start,angle,distance,isX) {
   return start+Math[isX?"cos":"sin"](degreesToRadians(angle))*distance;
}





function strokeIt(ctx,options) {
   if(!options) return;
   if(options.lineWidth) {
      ctx = overRide(ctx,options);
      ctx.stroke();
   }
}
function fillIt(ctx,options){
   if(!options) return;
   if(options.fillStyle) {
      ctx = overRide(ctx,options);
      ctx.fill();
   }
}
