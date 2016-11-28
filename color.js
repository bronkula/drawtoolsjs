


function rgbToHex(r,g,b) {
    if(g===undefined) {
        var g = r.g;
        var b = r.b;
        var r = r.r;
    }
    return ("0"+r.toString(16)).substr(-2)+
        ("0"+g.toString(16)).substr(-2)+
        ("0"+b.toString(16)).substr(-2);
}
function hexToRgb(h) {
    return {r:parseInt(h.substr(0,2),16),
        g:parseInt(h.substr(2,2),16),
        b:parseInt(h.substr(4,2),16)};
}

/* https://gist.github.com/mjijackson/5311256 */
function hslToRgb(h, s, l){
    if(s===undefined) {
        var s = h.s;
        var l = h.l;
        var h = h.h;
    }
    var r, g, b;

    if(s == 0){
        r = g = b = l;
    }else{

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return {r:Math.round(r * 255), g:Math.round(g * 255), b:Math.round(b * 255)};
}
function hue2rgb(p, q, t){
    if(t < 0) t += 1;
    if(t > 1) t -= 1;
    if(t < 1/6) return p + (q - p) * 6 * t;
    if(t < 1/2) return q;
    if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
}

function rgbToHsl(r, g, b){
    if(g===undefined) {
        var g = r.g;
        var b = r.b;
        var r = r.r;
    }
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

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

    return {h:h*360, s:s*100, l:l*100};
}

function rgbToHsv(r, g, b) {
    if(g===undefined) {
        var g = r.g;
        var b = r.b;
        var r = r.r;
    }
    r = r/255, g = g/255, b = b/255;

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max == 0 ? 0 : d / max;

    if (max == min) {
        h = 0; // achromatic
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return {h:h, s:s, v:v};
}

function hsvToRgb(h, s, v) {
    if(s===undefined) {
        var s = h.s;
        var v = h.v;
        var h = h.h;
    }
    var r, g, b;

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return {r:r * 255, g:g * 255, b:b * 255 };
}


function cmykToRgb(c,m,y,k){
    if(m===undefined) {
        var m = c.m;
        var y = c.y;
        var k = c.k;
        var c = c.c;
    }
    var result = {r:0,g:0,b:0};

    c = c / 100;
    m = m / 100;
    y = y / 100;
    k = k / 100;

    result.r = 1 - Math.min( 1, c * ( 1 - k ) + k );
    result.g = 1 - Math.min( 1, m * ( 1 - k ) + k );
    result.b = 1 - Math.min( 1, y * ( 1 - k ) + k );

    result.r = Math.round( result.r * 255 );
    result.g = Math.round( result.g * 255 );
    result.b = Math.round( result.b * 255 );

    return result;
}

function rgbToCmyk(r,g,b){
    if(g===undefined) {
        var g = r.g;
        var b = r.b;
        var r = r.r;
    }
    var result = {c:0,m:0,y:0,k:0};

    r = r / 255;
    g = g / 255;
    b = b / 255;

    result.k = Math.min( 1 - r, 1 - g, 1 - b );
    result.c = ( 1 - r - result.k ) / ( 1 - result.k );
    result.m = ( 1 - g - result.k ) / ( 1 - result.k );
    result.y = ( 1 - b - result.k ) / ( 1 - result.k );

    result.c = Math.round( result.c * 100 );
    result.m = Math.round( result.m * 100 );
    result.y = Math.round( result.y * 100 );
    result.k = Math.round( result.k * 100 );

    return result;
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
function HSV(h,s,v) {
    this.h = +h;
    this.s = +s;
    this.v = +v;
}
function CMYK(c,m,y,k) {
    this.c = +c;
    this.m = +m;
    this.y = +y;
    this.k = +k;
}
function COLOR(t,o) {
    this.rgb = new RGB(0,0,0);
    this.hsl = new HSL(0,0,0);
    this.hsv = new HSV(0,0,0);
    this.cmyk = new CMYK(0,0,0,0);
    this.hex = 0;
    if(t!==undefined) {
        this.ov(this[t],o);
        this.updateVals(t);
    }
};
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
        var ok = {};
        switch(k) {
            case "r":
            case "g":
            case "b":
                this.rgb[k] = v; k = "rgb";
                break;
            case "rgb":
                this.ov(this.rgb,v);
                break;
            case "h":
            case "s":
            case "l":
                this.hsl[k] = v; k = "hsl";
                break;
            case "hsl":
                this.ov(this.hsl,v);
                break;
            case "hsv":
                this.ov(this.hsv,v);
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
                this.x = v;
                break;
        }
        this.updateVals(k);
        return this;
    };
    COLOR.prototype.updateVals = function(k){
        switch(k) {
            case "rgb":
                this.rgbToHsl().rgbToHsv().rgbToCmyk().rgbToHex();
                break;
            case "hsl":
                this.hslToRgb().rgbToHsv().rgbToCmyk().rgbToHex();
                break;
            case "hsv":
                this.hsvToRgb().rgbToHsl().rgbToCmyk().rgbToHex();
                break;
            case "cmyk":
                this.cmykToRgb().rgbToHsl().rgbToHsv().rgbToHex();
                break;
            case "hex":
                this.hexToRgb().rgbToHsl().rgbToHsv().rgbToCmyk();
                break;
        }
        return this;
    }
    COLOR.prototype.rgbToHsl = function() {
        this.ov(this.hsl,rgbToHsl(this.rgb));
        return this;
    };
    COLOR.prototype.rgbToHsv = function() {
        this.ov(this.hsv,rgbToHsv(this.rgb));
        return this;
    };
    COLOR.prototype.rgbToCmyk = function() {
        this.ov(this.cmyk,rgbToCmyk(this.rgb));
        return this;
    };
    COLOR.prototype.rgbToHex = function() {
        this.hex = rgbToHex(this.rgb);
        return this;
    };
    COLOR.prototype.hslToRgb = function() {
        this.ov(this.rgb,hslToRgb(this.hsl));
        return this;
    };
    COLOR.prototype.hsvToRgb = function() {
        this.ov(this.rgb,hslToRgb(this.hsv));
        return this;
    };
    COLOR.prototype.cmykToRgb = function() {
        this.ov(this.rgb,cmykToRgb(this.cmyk));
        return this;
    };
    COLOR.prototype.hexToRgb = function() {
        this.ov(this.rgb,hexToRgb(this.hex));
        return this;
    };
    COLOR.prototype.toString = function(type) {
        switch(type) {
            case "rgb":return "rgb("+Math.round(this.rgb.r)+","+Math.round(this.rgb.g)+","+Math.round(this.rgb.b)+")";
            case "hsl":return "hsl("+Math.round(this.hsl.h)+","+Math.round(this.hsl.s)+"%,"+Math.round(this.hsl.l)+"%)";
            case "cmyk":return "cmyk("+Math.round(this.cmyk.c)+","+Math.round(this.cmyk.m)+","+Math.round(this.cmyk.y)+","+Math.round(this.cmyk.k)+")";
            case "hex":return "#"+this.hex;
        }
    };
