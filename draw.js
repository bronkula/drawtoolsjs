/*
 * Draw Tools v1.31
 * 2018/04/12
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
/* pass in an optional object that will be used for basis */
function getEXY(e,o) {
   var offs = $(o||e.target).offset();
   x = e.pageX - offs.left;
   y = e.pageY - offs.top;
   var ratio = ratio===undefined?1:ratio;
   return {x:ratio*x,y:ratio*y};
}
/* Return the first xy position from an event, whether touch or click */
function getEventXY(e,o){
   return getEXY(ev(e)[0],o);
}








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
    console.log(t)
    
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
