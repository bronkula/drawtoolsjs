

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
