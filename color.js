
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
        if(this.hexReg.test(o)) t = "hex";
        else if(o instanceof RGB) t = "rgb";
        else if(this.rgbReg.test(o)) t = "rgbs";
        else if(o instanceof HSL) t = "hsl";
        else if(this.hslReg.test(o)) t = "hsls";
        else if(o!==undefined) t = "word";
    }
    
    if(t!==undefined) {
        this.setVal(t,o);
        this.updateVals(t);
    }
};

COLOR.prototype.hexReg = /#?[0-9a-fA-F]{3,6}/;
COLOR.prototype.rgbReg = /rgba?\((\d+),(\d+),(\d+)[,\d\.]*\)/;
COLOR.prototype.hslReg = /hsla?\((\d+),(\d+)%,(\d+)%[,\d\.]*\)/;

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
                reg = this.rgbReg.exec(v);
                this.ov(this.rgb,new RGB(reg[1],reg[2],reg[3]);
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
                reg = this.hslReg.exec(v);
                this.ov(this.hsl,new HSL(reg[1],reg[2],reg[3]);
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
        this.cmyk.c = c * 255;
        this.cmyk.m = m * 255;
        this.cmyk.y = y * 255;
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
        if(this.hex.length==3) {
            this.rgb.r = parseInt(this.hex[0]+this.hex[0],16);
            this.rgb.g = parseInt(this.hex[1]+this.hex[1],16);
            this.rgb.b = parseInt(this.hex[2]+this.hex[2],16);
        } else {
            this.rgb.r = parseInt(this.hex.substr(0,2),16);
            this.rgb.g = parseInt(this.hex.substr(2,2),16);
            this.rgb.b = parseInt(this.hex.substr(4,2),16);
        }
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
