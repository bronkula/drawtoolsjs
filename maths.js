/*
 * https://github.com/bronkula/drawtoolsjs/edit/master/maths.js
 * Maths.js from the DrawTools.js library
 * Creator: Hamilton Cline
 * Email: hamdiggy@gmail.com
 * Website: hamiltondraws.com
*/



/* MATHS.JS */
/*---------------------- Math Helper Functions -----------------------------*/

/* Turn degrees into Radians, necessary for circle math */
const degreesToRadians = a => a*Math.PI/180;
   
/* Turn Radians into Degrees, necessary for circle math */
const radiansToDegrees = a => a*180/Math.PI;
   
/* Returns the angle from two points */
const angleFromPoints = (x1,y1,x2,y2) => Math.atan2(y2 - y1, x2 - x1);

// Will return the angle opposite of the B side
const angleFromSides = (a,b,c) => Math.acos((c*c+a*a-b*b)/(2*c*a));
   
/* A random number between n and x */
const rand = (n,x) => Math.round(Math.random()*(x-n))+n;

const circumference = r => Math.PI*2*r;



/* Returns an x y object from x y values */
const xy = (x,y) => ({x,y});

/* Vector cross product. This shit is magic */
const vxs = (x0,y0,x1,y1) => (x0*y1) - (x1*y0);
   
/* If p(osition) is outside of n or x, return a reversed s(peed) */
const bounce = (p,s,n,x) => p>=x||p<=n?-s:s;

/* Bounce angle a off of a vertical or horizontal wall */
const bounceX = a => Math.sign(a)*trueHalfRadian(-signHalfRadian(Math.abs(signRadian(a))));
const bounceY = a => -signRadian(a);

/* This function takes two objects, and replaces or adds any values in object 1 with the values of object 2 */
const overRide = (o1,o2) => !o2?o1:Object.assign(o1,o2);

/* This function is basic ratio math. curries a ratio and then multiplies that by another number */
const ratio = (min,max) => n => n*min/max;

/* Nudge a number a certain percentage of a distance using a starting offset */
const nudge = (s,p,d) => p*d+s;

/* Make sure a number does not passbelow a min or above a max */
const clamp = (min,max) => n => n>max?max:n<min?min:n;

/* Given a curried max value, attempts to bring negative numbers to positive range of loop */
const trueNumber = max => n => n<0?n+max:n;
   const trueRadian = trueNumber(Math.PI*2);
   const trueHalfRadian = trueNumber(Math.PI);
   const trueDegree = trueNumber(360);

/* Given a curried max value, attempts to wrap a number over half into a negative number of loop */
const signNumber = max => n => n>max*0.5?n%max-max:n;
   const signRadian = signNumber(Math.PI*2);
   const signHalfRadian = signNumber(Math.PI);
   const signDegree = signNumber(360);

/* This function returns an arbitrary positive number looped inside an arbitrary positive number range */
const within = (min,max) => n => trueNumber(max-min)((n-min)%(max-min))+min;
   const withinCircle = within(0,360);
   
/* This function returns the percentage of an arbitrary number mapped to an arbitrary number range */
const partof = (min,max) => n => (n-min)/(max-min);
   const partofCircle = partof(0,360);
   
/* This function returns a number from an arbitrary number range using a percentage. Optional offset value.
example:
toward(10,20)(0.5) > 15
*/
const toward = (min,max,o=false) => n => n*(max-min)+(o||min);

/* This function maps a number from one arbitrary range onto another arbitrary range.
example:
mapRange(5,0,10,0,360) > 180*/
const mapRange = (n,min1,max1,min2,max2) => toward(min2,max2)(partof(min1,max1)(n));

/* Round number n to nearest number x */
const roundTo = (n,x) => {
   if(x<1){var m=(""+x).split(".");var m2=Math.pow(10,m[1].length);n*=m2;x*=m2;}
   let r=x*Math.round(n/x);
   return m2?r/m2:r;
}
   





/*------------------------ Positional Functions ------------------------------------*/
/* The distance between two points */
const pointDistance = (x1,y1,x2,y2) => Math.hypot(x1-x2,y1-y2);

/* Return a point between one point and another: Position1, Position2, Percentage */
const positionToward = (x1,y1,x2,y2,p) => xy(toward(x1,x2)(p),toward(y1,y2)(p));

/* Expects an X and a Y, an angle, and a distance. Returns an XY object */
const getSatelliteXY = (x,y,a,d) => xy(x+Math.cos(a)*d,y+Math.sin(a)*d);

/* check if two number ranges overlap */
const overlap = (a1,a2,b1,b2) => Math.min(a1,a2) <= Math.max(b1,b2) && Math.min(b1,b2) <= Math.max(a1,a2);

/* check if two boxes overlap */
const intersectBox = (x0,y0,x1,y1,x2,y2,x3,y3) => overlap(x0,x1,x2,x3) && overlap(y0,y1,y2,y3);

/* determine which side of a line a point is on */
const pointSide = (px,py,x0,y0,x1,y1) => vxs(x1-x0,y1-y0,px-x0,py-y0);

/* Intersect: Calculate the point of intersection between two lines. */
const intersect = (x0,y0,x1,y1,x2,y2,x3,y3) => xy(
   vxs(vxs(x0,y0,x1,y1),x0-x1,vxs(x2,y2,x3,y3),x2-x3) / vxs(x0-x1,y0-y1,x2-x3,y2-y3),
   vxs(vxs(x0,y0,x1,y1),y0-y1,vxs(x2,y2,x3,y3),y2-y3) / vxs(x0-x1,y0-y1,x2-x3,y2-y3)
);

/* Calculate if two lines intersect */
const isIntersect = (x0,y0,x1,y1,x2,y2,x3,y3) => IntersectBox(x0,y0,x1,y1, x2,y2,x3,y3)
   && Math.abs(PointSide(x2,y2,x0,y0,x1,y1) + PointSide(x3,y3,x0,y0,x1,y1)) != 2
   && Math.abs(PointSide(x0,y0,x2,y2,x3,y3) + PointSide(x1,y1,x2,y2,x3,y3)) != 2;

/* Detect if a point is in a rectangle */
const pointInRect = (x1,y1,x2,y2) => (px,py) => px>=x1&&px<=x2&&py>=y1&&py<=y2;

const inRange = (a,b) => n => a<=n&&b>=n;

const pointInArc = (px,py,ax,ay,ir,or,as,ae) => {
   var a = angleFromPoints(px,py,ax,ay);
   var d = pointDistance(px,py,ax,ay);
   return a>=as && a<=ae && d>=ir && d<=or;
}
/* Detect if a rectangle is fully within another rectangle */
const rectInRect = (x0,y0,x1,y1,x2,y2,x3,y3) => pointInRect(x0,y0,x2,y2,x3,y3) && pointInRect(x1,y1,x2,y2,x3,y3);

/* detect if a circle is touching another circle. Use 0 for r1 if a point */
const circleCollission = (x1,y1,r1,x2,y2,r2) => pointDistance(x1,y1,x2,y2) < (r1 + r2);
