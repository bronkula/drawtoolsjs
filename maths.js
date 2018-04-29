/*
 * Maths.js from the DrawTools.js library
 * Creator: Hamilton Cline
 * Email: hamdiggy@gmail.com
 * Website: hamiltondraws.com
*/

/*---------------------- Math Helper Functions -----------------------------*/

/* Turn degrees into Radians, necessary for circle math */
var degreesToRadians = (num) => (num * Math.PI)/180;
   
/* Turn Radians into Degrees, necessary for circle math */
var radiansToDegrees = (num) => (num * 180)/Math.PI;
   
/* Get a positional offset for x or y useful for placing something on an arc around point */
var getSatellite = (start,angle,distance,isX) => start+Math[isX?"cos":"sin"](degreesToRadians(angle))*distance;
   
/* Returns the angle from two points */
function angleFromPoints(x1,y1,x2,y2,inRadians){
   var angleRadians = Math.atan2(y2 - y1, x2 - x1);
   return inRadians?angleRadians:radiansToDegrees(angleRadians);
}
// Will return the angle opposite of the B side
var angleFromSides = (a,b,c) => Math.acos((c*c+a*a-b*b)/(2*c*a));
   
/* Returns a 0,360 degree angle from a -180,180 degree angle */
var trueAngle = (a) => a<0?360+a:a;
   
/* A random number between n and x */
var rand = (n,x) => Math.round(Math.random()*(x-n))+n;
   
/* Make sure a number does not passbelow a min or above a max */
var clamp = (a,min,max) => a>max?max:a<min?min:a;
/* Make sure a number does not go beyond a min or max, and wrap around to the other side instead.
Differently than a clampLoop, this number will always lose distance when wrapping. */
var clampWrap = (a,min,max) => a>max?clampWrap(a-(max-min)-1,min,max):a<min?clampWrap(a+(max-min)+1,min,max):a;
/* Make sure a number does not passbelow a min or above a max, and handle if the clamp is around the outside of a loop */
function circleclamp(a,min,max){
   if(max<min) {
      let d = ((min-max)*0.5)+max;
      return a<=min&&a>d?min:a>=max&&a<d?max:a;
   }
   return a>max?max:a<min?min:a;
}
// function circleclamp(a,min,max,loop){
//    if(max<min) {
//       let d = ((min-max)*0.5)+max;
//       return a<=min&&a>d?min:a>=max&&a<d?max:a;
//    }
//    return clamp(a,min,max);
// }


/* Returns an x y object */
function xy(x,y){
    this.x = x;
    this.y = y;
}
/* Absolute number */
var abs = (a) => a < 0 ? -a : a;

/* Vector cross product. This shit is magic */
var vxs = (x0,y0,x1,y1) => (x0*y1) - (x1*y0);
   
/* If p(osition) is outside of n or x, return a reversed s(peed) */
function bounce(p,s,n,x) {
  return (p>=x||p<=n)?-s:s;
}
/* This function takes two objects, and replaces or adds any values in object 1 with the values of object 2 */
function overRide(o1,o2) {
   if(!o2) return o1;
   for(var i in o2) {
      if(o2.hasOwnProperty(i) === false) continue;
      o1[i] = o2[i];
   }
   return o1;
}

/* This function is basic ratio math. returns a number in omax at a similar ratio to nmin in nmax */
var ratio = (n,min,max) => n*min/max;

/* This function returns an arbitrary positive number looped inside an arbitrary positive number range */
var within = (n,min,max) => (n-min)%(max-min);
   var withinCircle = (n) => within(n,0,360);
   
/* This function returns the percentage of an arbitrary number mapped to an arbitrary number range */
var partof = (n,min,max) => (n-min)/(max-min);
   var partofCircle = (n) => partof(n,0,360);
   
/* This function returns a number from an arbitrary number range using a percentage. Optional offset value.
example:
toward(0.5,10,20) > 15
*/
var toward = (n,min,max,o) => n*(max-min)+(o||min);
/* This function maps a number from one arbitrary range onto another arbitrary range. Uses range arrays.
example:
mapRange(5,[0,10],[0,360]) > 180*/
var mapRange = (n,r1,r2) => toward(partof(n,r1[0],r1[1]),r2[0],r2[1]);

var clampLoop = (n,min,max) => { var d=within(n,min,max); return (d<0?max-min:0)+d+min; }
   var clampCircle = (n) => clampLoop(n,0,360);



/* This function returns a number from one range transposed into another range, either of which could be loops */
/* eg: rangeRatio(5,[1,7],[280,80,360]) would result in 26.66. 5 inside of 1-7 is equal to 26.66 inside of a looped range of 280-80 inside a loop of 360. */
function circleRangeRatio(n,r1,r2) {
   if(r1[2] && r1[0]>r1[1]) {
      r1r = rangeRatio(n<=r1[1]?n+r1[2]:n,r1[0],r1[0]+(r1[2]-r1[0]+r1[1]),0,1);
   } else {
      r1r = (n-r1[0])/(r1[1]-r1[0]);
   }
   if(r2[2] && r2[0]>r2[1]) {
      r2r = (r1r*(r2[2]-r2[0]+r2[1]))+r2[0];
      return r2r>r2[2]?r2r-r2[2]:r2r;
   } else {
      return (r1r*(r2[1]-r2[0]))+r2[0];
   }
}


// function loopRangeRatio(n,r1,r2) {
//    if(r1[2] && r1[0]<0) {
//       var r1p = partof(n<=r1[1]?n+r1[2]:n, r1[0], r1[0]+(r1[2]-r1[0]+r1[1]);
//    } else var r1p = partof(n, r1[0], r1[1]);
//    if(r2[2] && r2[0]<0) {
//       var r2p = toward(r1p, r2[2], r2[0]+r2[1], r2[0]);
//       var r = r2p>r2[2]?r2p-r2[2]:r2p;
//    } else var r = toward(r1p, r2[0], r2[1]);
//    return r;
// }


/* DEPRECATED */
var numberToward = (n,x,p) => ((x-n)*p)+n;
var rangeRatio = (n,nmin,nmax,omin,omax) => (((n-nmin)/(nmax-nmin))*(omax-omin))+omin;
   

/* Round number n to nearest number x */
function roundTo(n,x){
   if(x<1){var m=(""+x).split(".");var m2=Math.pow(10,m[1].length);n*=m2;x*=m2;}
   var r=x*Math.round(n/x);
   return m2?r/m2:r;
}





/*------------------------ Positional Functions ------------------------------------*/
/* The distance between two points */
function pointDistance(x1,y1,x2,y2) {
    var dx = x1 - x2;
    var dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
}
/* Return a point between one point and another: Position1, Position2, Percentage */
function positionToward(x1,y1,x2,y2,p) {
  return {x:toward(p,x1,x2),y:toward(p,y1,y2)};
}
/* Expects an XY object, an angle, and a distance. Returns an XY object */
function getSatelliteXY(pos,angle,distance) {
   return {
      x:getSatellite(pos.x,angle,distance,true),
      y:getSatellite(pos.y,angle,distance,false)
   };
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
