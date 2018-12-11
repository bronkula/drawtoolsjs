/*
 * Maths.js from the DrawTools.js library
 * Creator: Hamilton Cline
 * Email: hamdiggy@gmail.com
 * Website: hamiltondraws.com
*/

/*---------------------- Math Helper Functions -----------------------------*/

/* Turn degrees into Radians, necessary for circle math */
const degreesToRadians = a => a*Math.PI/180;
   
/* Turn Radians into Degrees, necessary for circle math */
const radiansToDegrees = a => a*180/Math.PI;
   
/* Get a sin or cos offset for angle a in radians, offset from position s by length d */
const getSatellite = (s,a,d,x=false) => s+Math[x?"cos":"sin"](a)*d;
   
/* Returns the angle from two points */
const angleFromPoints = (x1,y1,x2,y2) => Math.atan2(y2 - y1, x2 - x1);

// Will return the angle opposite of the B side
const angleFromSides = (a,b,c) => Math.acos((c*c+a*a-b*b)/(2*c*a));
   
/* A random number between n and x */
const rand = (n,x) => Math.round(Math.random()*(x-n))+n;



/* Returns an x y object from x y values */
const xy = (x,y) => ({x,y});

/* Vector cross product. This shit is magic */
const vxs = (x0,y0,x1,y1) => (x0*y1) - (x1*y0);
   
/* If p(osition) is outside of n or x, return a reversed s(peed) */
const bounce = (p,s,n,x) => p>=x||p<=n?-s:s;

const bounceXY = (a,y) => y?-a:a-(Math.abs(a)<90?90:-90);

/* This function takes two objects, and replaces or adds any values in object 1 with the values of object 2 */
const overRide = (o1,o2) => !o2?o1:Object.assign(o1,o2);

/* This function is basic ratio math. returns a number in omax at a similar ratio to nmin in nmax */
const ratio = (min,max) => n => n*min/max;

/* Make sure a number does not passbelow a min or above a max */
const clamp = (min,max) => n => n>max?max:n<min?min:n;

/* Given a curried max value, attempts to bring negative numbers to positive range of loop */
const trueNumber = max => n => n<0?n+max:n;
   const trueRadian = trueNumber(Math.PI);
   const trueAngle = trueNumber(360);

/* Given a curried max value, attempts to wrap a number over half into a negative number of loop */
const signNumber = max => n => n>max*0.5?n%max-max:n;
   const signRadian = signNumber(Math.PI);
   const signAngle = signNumber(360);

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



/* DEPRECATED */
var numberToward = (n,x,p) => ((x-n)*p)+n;
var rangeRatio = (n,nmin,nmax,omin,omax) => (((n-nmin)/(nmax-nmin))*(omax-omin))+omin;
   





/*------------------------ Positional Functions ------------------------------------*/
/* The distance between two points */
const pointDistance = (x1,y1,x2,y2) => Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2,2));

/* Return a point between one point and another: Position1, Position2, Percentage */
const positionToward = (x1,y1,x2,y2,p) => {x:toward(x1,x2)(p),y:toward(y1,y2)(p)};

/* Expects an XY object, an angle, and a distance. Returns an XY object */
const getSatelliteXY = (pos,angle,distance) => {
   x:getSatellite(pos.x,angle,distance,true),
   y:getSatellite(pos.y,angle,distance,false)
};

/* check if two number ranges overlap */
const overlap = (a0,a1,b0,b1) => Math.min(a0,a1) <= Math.max(b0,b1) && Math.min(b0,b1) <= Math.max(a0,a1);

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
const pointInRect = (px,py,x1,y1,x2,y2) => px >= x1 && px <= x2 && py >= y1 && py <= y2;

const pointInArc = (px,py,ax,ay,ir,or,as,ae) => {
   var a = angleFromPoints(px,py,ax,ay);
   var d = pointDistance(px,py,ax,ay);
   return a>=as && a<=ae && d>=ir && d<=or;
}
/* Detect if a rectangle is fully within another rectangle */
const rectInRect = (x0,y0,x1,y1,x2,y2,x3,y3) => pointInRect(x0,y0,x2,y2,x3,y3) && pointInRect(x1,y1,x2,y2,x3,y3);

/* detect if a circle is touching another circle. Use 0 for r1 if a point */
const detectCircleCollission = (x1,y1,r1,x2,y2,r2) => pointDistance(x1,y1,x2,y2) < (r1 + r2);

