/*
 * Maths.js from the DrawTools.js library
 * Creator: Hamilton Cline
 * Email: hamdiggy@gmail.com
 * Website: hamiltondraws.com
*/

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
/* Return a number between one number and another: Min, Max, Percentage */
function numberToward(n,x,p) {
  return ((x-n)*p)+n;
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
function overRide(o1,o2) {
   if(!o2) return o1;
   for(var i in o2) {
      if(o2.hasOwnProperty(i) === false) continue;
      o1[i] = o2[i];
   }
   return o1;
}
/* This function returns a number from one range transposed into another range */
/* eg: rangeRatio(5,1,7,35,72) would result in 59.66. 5 inside of 1-7 is equal to 59.66 inside of 35-72. */
function rangeRatio(n,nmin,nmax,omin,omax) {
   return (((n-nmin)/(nmax-nmin))*(omax-omin))+omin;
}
/* This function is basic ratio math. returns a number in omax at a similar ratio to nmin in nmax */
function simpleRatio(nmin,nmax,omax) {
   return nmin/nmax*omax;
}

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
    return distance = Math.sqrt(dx * dx + dy * dy);
}
/* Return a point between one point and another: Position1, Position2, Percentage */
function positionToward(x1,y1,x2,y2,p) {
  return {x:numberToward(x1,x2,p),y:numberToward(y1,y2,p)};
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
