/*
 * Draw.js
 * Creator: Hamilton Cline
 * Email: hamdiggy@gmail.com
 * Website: hamiltondraws.com
 * Version 1.4.1
 * 2018-12-13
 * https://github.com/bronkula/drawtoolsjs
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
/* CANVAS.JS */
/*----------------------------------------------------------------------*/
/*                         Path functions                               */

const pathmaker = {
   start(ctx){
      ctx.beginPath();
   },
   end(ctx){
      ctx.closePath();
   },
   points(ctx,pts){
      if(pts.length<2) return false;
      ctx.moveTo(pts[0].x,pts[0].y);
      for(let i in pts) {
         ctx.lineTo(pts[i].x,pts[i].y);
      }
   },
   polygon(ctx,x,y,r,a,s){
     let eachangle = 360/s;
     let line = [];
     for(let i=0;i<=s;i++) {
       line.push(getSatelliteXY({x,y},a+(eachangle*i),r));
     }
     pathmaker.points(ctx,line);
   },
   circle(ctx,x,y,r,a1,a2,a3){
      pathmaker.arc(ctx,x,y,r,
        a1!==undefined?a1:0,
        a2!==undefined?a2:2*Math.PI,
        a3!==undefined?a3:undefined);
   },
   arc(ctx,x,y,r,a1,a2,a3){
      ctx.arc(x,y,r,a1,a2,a3);
   },
   rect(ctx,x,y,w,h){
      pathmaker.points(ctx,[
         {x:x,y:y},
         {x:x+w,y:y},
         {x:x+w,y:y+h},
         {x:x,y:y+h},
         {x:x,y:y}
      ]);
   },
   pie(ctx,x,y,or,ir,sa,ea,ad){
      pathmaker.arc(ctx,x,y,or, sa, ea+sa, !ad);
      pathmaker.arc(ctx,x,y,ir, ea+sa, sa, ad);
   },
   roundRect(ctx,x,y,w,h,r){
      if (typeof r === 'undefined') r = 0;
      else if (typeof r === 'number') {
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
const makePath = (ctx,paths) => {
   pathmaker.start(ctx);
   for(let i in paths) pathmaker[paths[i].splice(0,1,ctx)[0]].apply(null,paths[i]);
   pathmaker.end(ctx);
}


/*----------------------------------------------------------------------*/
/*                         Draw functions                               */

/* Stroke path */
const strokeIt = (ctx,options) => {
   if(!options) return;
   if(options.lineWidth) overRide(ctx,options).stroke();
}
/* Fill a path */
const fillIt = (ctx,options) =>{
   if(!options) return;
   if(options.fillStyle) overRide(ctx,options).fill();
}


/* Draw a circle */
const drawCircle = (ctx,x,y,r,options) => {
   makePath(ctx,[["circle",x,y,r]]);
   fillIt(ctx,options);
   strokeIt(ctx,options);
}
/* Draw a rectangle: x,y, width, height */
const drawRect = (ctx,x,y,w,h,options) => {
   makePath(ctx,[["rect",x,y,w,h]]);
   fillIt(ctx,options);
   strokeIt(ctx,options);
}
/* Draw a Polygon: x,y, radius, start angle, sides */
const drawPolygon = drawShape = (ctx,x,y,r,a,s,options) => {
   makePath(ctx,[["polygon",x,y,r,a,s]]);
   fillIt(ctx,options);
   strokeIt(ctx,options);
}
/* Draw a rectangle with a random color, using the rand helper function */
const drawRandomRect = (ctx,x,y,w,h,options) => {
   options.fillStyle = "rgba("+
      rand(120,250)+","+
      rand(120,250)+","+
      rand(120,250)+","+
      (options&&options.opacity!==undefined?options.opacity:0.7)+
      ")";
   drawRect(ctx,x,y,w,h,options);
}
/* Draw one line segment */
const drawSegment = (ctx,x1,y1,x2,y2,options) => {
   makePath(ctx,[["points",[
      {x:x1,y:y1},
      {x:x2,y:y2}
      ]]]);
   strokeIt(ctx,options);
}
/* Draw an array of line segments, allowing smooth connections */
const drawLine = (ctx,line,options) => {
   makePath(ctx,[["points",line]]);
   strokeIt(ctx,options);
   fillIt(ctx,options);
}

/* Create a curryed function which preloads an image to be placed onto canvas */
/*
example:
var drawMyImage = drawableImage("imageurl.jpg");
drawMyImage(ctx,10,10,50,50);
*/
const drawableImage = url => {
  let loaded = false;
  let i = new Image();
  i.onload = ()=> loaded=true;
  i.src = url;

  const drawI = (ctx,x,y,w,h) => {
//     console.log(i)
    if(!loaded) setTimeout(drawI,10);
    else {
//       console.log(arguments)
      ctx.drawImage(i,x,y,w,h);
    }
  }
  return drawI;
}

/* Draw text */
const drawText = (ctx,text,x,y,options) => {
   if(options.lineWidth) overRide(ctx,options).strokeText(text,x,y);
   if(options.fillStyle) overRide(ctx,options).fillText(text,x,y);
}
/* Draw text, replacing new lines characters with visible line breaks */
const drawParagraph = (ctx,text,x,y,lineHeight,options) => {
  var ps = text.split(/\n/);
  for(var i in ps) {
    drawText(ctx,ps[i],x,y+(lineHeight*i),options);
  }
}
/* Draw text with a cut out stroke */
const drawLabel = (ctx,text,x,y,options) => {
   ctx = overRide(ctx,options);
   ctx.globalCompositeOperation = "destination-out";
   ctx.strokeText(text,x,y);
   ctx.globalCompositeOperation = "source-over";
   ctx.fillText(text,x,y);
}

/* Draw a circle with a cutout circle */
const drawPulse = (ctx,x,y,outerRadius,innerRadius,options) => {
   drawCircle(ctx,x,y,outerRadius,options);
   ctx.globalCompositeOperation = "destination-out";
   drawCircle(ctx,x,y,innerRadius,options);
   ctx.globalCompositeOperation = "source-over";
}

/* Draw a pie shape or donut pie shape */
const drawPie = (ctx,x,y,outerRadius,innerRadius,startangle,endangle,additive,options) => {
   makePath(ctx,[["pie",x,y,outerRadius,innerRadius,startangle,endangle,additive]]);
   fillIt(ctx,options);
   strokeIt(ctx,options);
}

// http://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-on-html-canvas
const drawRoundRect = (ctx, x, y, w, h, r, options) => {
   makePath(ctx,[["roundRect",x, y, w, h, r]])
   strokeIt(ctx,options);
   fillIt(ctx,options);
}

/* Draw a gradient
direction: [x1,y1,x2,y2]
stops: [[percent,color],[percent,color]]
position: [x,y,w,h]
*/
const drawGradient = (ctx,direction,stops,position) => {
  var grd=ctx.createLinearGradient.apply(ctx,direction);
  for(let i in stops) {
    grd.addColorStop.apply(grd,stops[i]);
  }
  ctx.fillStyle=grd;
  ctx.fillRect.apply(ctx,position);
}



/* draw a series of circle at x y coordinates */
const drawPoints = (ctx,line,radius,options) => {
   pathmaker.start(ctx);
   for(let i in line) {
      pathmaker.circle(ctx,line[i].x,line[i].y,radius);
   }
   pathmaker.end(ctx);
   strokeIt(ctx,options);
   fillIt(ctx,options);
}
/* draw a series of lines vertically and horizontally */
const drawGrid = (ctx,rows,cols,x,y,w,h,options) => {
   pathmaker.start(ctx);
   // Draw the rows
   for(let i=0;i<=rows;i++) {
      pathmaker.points(ctx,[
         {x:x,y:(h*(i/rows))+y},
         {x:x+w,y:(h*(i/rows))+y}
         ]);
   }
   // Draw the columns
   for(let i=0;i<=cols;i++) {
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
const drawLineGraph = (ctx,line,x,y,w,h) => {
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
const rotateAndDo = ( ctx, angleInRad , positionX, positionY, callback) => {
   ctx.translate( positionX, positionY );
   ctx.rotate( angleInRad );
   callback();
   ctx.rotate( -angleInRad );
   ctx.translate( -positionX, -positionY );
}
/* This function does three operations, and saves first */
const translateScaleRotate = (ctx,x,y,sx,sy,r,fn) => {
  ctx.save();
   ctx.translate(x,y);
   ctx.scale(sx,sy);
   ctx.rotate(r);
   fn();
  ctx.restore();
}
/* This function will Translate and then Scale, and saves first */
const translateScale = (ctx,x,y,sx,sy,fn) => {
  ctx.save();
   ctx.translate(x,y);
   ctx.scale(sx,sy);
   fn();
  ctx.restore();
}
/* Translate, Scale, Rotate, then draw an image */
const drawImageTSR = (ctx,img,x,y,w,h,sx,sy,r) => {
  translateScaleRotate(ctx,x,y,sx,sy,r,function(){
    ctx.drawImage(img,-w*0.5,-h*0.5,w,h);
  });
}




/* This function will store a canvas into an image */
const storeImage = (cvs,w,h) => { 
  let i = new Image();
  i.src = cvs.toDataURL();
  return i;
}





/* COLORS.JS */
function RGB(r,g,b) {
    this.r = +r;
    this.g = +g;
    this.b = +b;
}
function HSL(h,s,l) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
}
function CMYK(c,m,y,k) {
    this.c = +c;
    this.m = +m;
    this.y = +y;
    this.k = +k;
}
function COLOR(o,t) {
    this.rgb = new RGB(0,0,0);
    this.hsl = new HSL(0,0,0);
    this.cmyk = new CMYK(0,0,0,0);
    this.hex = "000000";
    
    if(t===undefined) {
        if(COLOR.hexReg.test(o)) t = "hex";
        else if(o instanceof RGB) t = "rgb";
        else if(COLOR.rgbReg.test(o)) t = "rgbs";
        else if(o instanceof HSL) t = "hsl";
        else if(COLOR.hslReg.test(o)) t = "hsls";
        else if(/[a-zA-z]+/.test(o)) t = "word";
        else if(typeof o == "object") {
            if(o.r!==undefined) t = "rgb";
            if(o.h!==undefined) t = "hsl";
        }
    }
    
    if(t!==undefined) {
        this.setVal(t,o);
        this.updateVals(t);
    }
};

COLOR.hexReg = /^#?[0-9a-fA-F]{3,6}/;
COLOR.rgbReg = /^rgba?\((\d+),\s*(\d+),\s*(\d+)[,\d\.]*\)/;
COLOR.hslReg = /^hsla?\((\d+),\s*(\d+)%,\s*(\d+)%[,\d\.]*\)/;

    COLOR.prototype.ov = function(o1,o2){ // override function
       if(!o2) return o1;
       for(var i in o2) {
          if(o2.hasOwnProperty(i) === false) continue;
          o1[i] = o2[i];
       }
       return o1;
    };
    COLOR.prototype.setVal = function(k,v){
        k=k||"r";
        var ok = {},reg;
        switch(k) {
            case "r":
            case "g":
            case "b":
                this.rgb[k] = v; k = "rgb";
                break;
            case "rgb":
                this.ov(this.rgb,v);
                break;
            case "rgbs":
                reg = COLOR.rgbReg.exec(v);
                this.ov(this.rgb,new RGB(reg[1],reg[2],reg[3]));
                k = "rgb";
                break;
            case "h":
            case "s":
            case "l":
                this.hsl[k] = v; k = "hsl";
                break;
            case "hsl":
                this.ov(this.hsl,v);
                break;
            case "hsls":
                reg = COLOR.hslReg.exec(v);
                this.ov(this.hsl,new HSL(reg[1],reg[2],reg[3]));
                k = "hsl";
                break;
            case "c":
            case "m":
            case "y":
            case "k":
                this.cmyk[k] = v; k = "cmyk";
                break;
            case "cmyk":
                this.ov(this.cmyk,v);
                break;
            case "hex":
                v = v[0]=="#"?v.substr(1):v;
                this.hex = v.length==3?v[0]+v[0]+v[1]+v[1]+v[2]+v[2]:v;
                break;
            case "word":
                this.hex = this.wordToHex(v);
                k = "hex";
                break;
        }
        this.updateVals(k);
        return this;
    };
    COLOR.prototype.updateVals = function(k){
        switch(k) {
            case "rgb":
                this.rgbToHsl().rgbToCmyk().rgbToHex();
                break;
            case "hsl":
                this.hslToRgb().rgbToCmyk().rgbToHex();
                break;
            case "cmyk":
                this.cmykToRgb().rgbToHsl().rgbToHex();
                break;
            case "hex":
                this.hexToRgb().rgbToHsl().rgbToCmyk();
                break;
        }
        return this;
    }
    COLOR.prototype.rgbToHsl = function() {
        var r=this.rgb.r / 255,
            g=this.rgb.g / 255,
            b=this.rgb.b / 255,
            max = Math.max(r, g, b),
            min = Math.min(r, g, b),
            h, s, l = (max + min) / 2;
        if(max == min){
            h = s = 0; // achromatic
        }else{
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max){
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        this.hsl.h = h * 360;
        this.hsl.s = s * 100;
        this.hsl.l = l * 100;
        return this;
    };
    COLOR.prototype.rgbToCmyk = function() {
        var r = this.rgb.r / 255,
            g = this.rgb.g / 255,
            b = this.rgb.b / 255,
            k = Math.min( 1 - r, 1 - g, 1 - b ),
            c = ( 1 - r - k ) / ( 1 - k ),
            m = ( 1 - g - k ) / ( 1 - k ),
            y = ( 1 - b - k ) / ( 1 - k );
        this.cmyk.c = c * 255 || 0;
        this.cmyk.m = m * 255 || 0;
        this.cmyk.y = y * 255 || 0;
        this.cmyk.k = k * 255;
        return this;
    };
    COLOR.prototype.rgbToHex = function() {
        this.hex = 
            ("0"+Math.round(this.rgb.r).toString(16)).substr(-2)+
            ("0"+Math.round(this.rgb.g).toString(16)).substr(-2)+
            ("0"+Math.round(this.rgb.b).toString(16)).substr(-2);
        return this;
    };
    COLOR.prototype.hslToRgb = function() {
        var h=this.hsl.h / 360,
            s=this.hsl.s / 100,
            l=this.hsl.l / 100,
            r, g, b;
        if(s == 0){
            r = g = b = l;
        }else{
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = this.hue2rgb(p, q, h + 1/3);
            g = this.hue2rgb(p, q, h);
            b = this.hue2rgb(p, q, h - 1/3);
        }
        this.rgb.r = r * 255;
        this.rgb.g = g * 255;
        this.rgb.b = b * 255;
        return this;
    };

    COLOR.prototype.wordToHex = function(str){ 
      var ctx = document.createElement('canvas').getContext('2d');
      ctx.fillStyle = str;
      return ctx.fillStyle.substr(1);
    }
    COLOR.prototype.hue2rgb = function(p, q, t){
        if(t < 0) t += 1;
        if(t > 1) t -= 1;
        if(t < 1/6) return p + (q - p) * 6 * t;
        if(t < 1/2) return q;
        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    };
    COLOR.prototype.cmykToRgb = function() {
        var c = this.cmyk.c / 100,
            m = this.cmyk.m / 100,
            y = this.cmyk.y / 100,
            k = this.cmyk.k / 100,
            r = 1 - Math.min( 1, c * ( 1 - k ) + k ),
            g = 1 - Math.min( 1, m * ( 1 - k ) + k ),
            b = 1 - Math.min( 1, y * ( 1 - k ) + k );
        this.rgb.r = r*255;
        this.rgb.g = g*255;
        this.rgb.b = b*255;
        return this;
    };
    COLOR.prototype.hexToRgb = function() {
        this.rgb.r = parseInt(this.hex.substr(0,2),16);
        this.rgb.g = parseInt(this.hex.substr(2,2),16);
        this.rgb.b = parseInt(this.hex.substr(4,2),16);
        return this;
    };
    COLOR.prototype.toString = function(type,alpha) {
        switch(type) {
            case "rgb":return "rgb("+Math.round(this.rgb.r)+","+Math.round(this.rgb.g)+","+Math.round(this.rgb.b)+")";
            case "rgba":return "rgba("+Math.round(this.rgb.r)+","+Math.round(this.rgb.g)+","+Math.round(this.rgb.b)+","+alpha+")";
            case "rgbv":return Math.round(this.rgb.r)+","+Math.round(this.rgb.g)+","+Math.round(this.rgb.b);
            case "hsl":return "hsl("+Math.round(this.hsl.h)+","+Math.round(this.hsl.s)+"%,"+Math.round(this.hsl.l)+"%)";
            case "hsla":return "hsla("+Math.round(this.hsl.h)+","+Math.round(this.hsl.s)+"%,"+Math.round(this.hsl.l)+"%,"+alpha+")";
            case "hslv":return Math.round(this.hsl.h)+","+Math.round(this.hsl.s)+"%,"+Math.round(this.hsl.l)+"%";
            case "cmyk":return "cmyk("+Math.round(this.cmyk.c)+","+Math.round(this.cmyk.m)+","+Math.round(this.cmyk.y)+","+Math.round(this.cmyk.k)+")";
            case "hex":return "#"+this.hex;
        }
    };



/* EVENTS.JS */
/*------------------------------- Point Detection Functions -----------------------*/
/* Return an array of either touches or a click */
const evPoints = e =>
   e.type.substring(0,5)!="touch"?[e]:!e.touches.length?e.changedTouches:e.touches;
/* return an offset xy object for the position of the click or touch in the object */
/* pass in an optional object that will be used for basis */
const getEXY = (e,o) => {
  let rect = (o||e.target).getBoundingClientRect();
  return ({ x:e.clientX-rect.left, y:e.clientY-rect.top }); 
}
/* Return the first xy position from an event, whether touch or click */
const getEventXY = (e,o) => getEXY(evPoints(e)[0],o);



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
