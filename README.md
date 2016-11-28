# DrawToolsjs

Created by Hamilton Cline

[Draw.js](./README.md#user-content-draw-tools) is a canvas library for javascript. I will almost certainly write something in depth here. For now, there's a file. It's got some functions. Most of them should be relatively clear how to use.

[Color.js](./README.md#user-content-color) is a color handling library for javascript. It easily converts between Hex colors, RGB colors, HSL colors, and even CMYK colors. It outputs easy strings for css and presentation.


## Draw Tools
Many of the actual drawing tools in this library, as opposed to the positional tools, Use the same methodology for arguments. A context to be applied, some values necessary for the particular shape, and then an options object. This object should be all the relevant context options for drawing, such as colors and line widths.

## Where to Start?
Well, it helps to come at this with a cursory understanding of the html5 canvas already. Much of this library is simplifying certain overly complex common operations when using the canvas.

but.

Let's start here. You have to have a canvas, and get its context. That goes like this.

```html
<canvas width="400" height="400"></canvas>

<script>
var cvs = document.querySelector("canvas");
var ctx = cvs.getContext("2d");
</script>
```

There we go. Now what? Let's actually use the library. Let's draw a circle.


```html
<canvas width="400" height="400"></canvas>

<script src="drawtools.js"></script>
<script>
var cvs = document.querySelector("canvas");
var ctx = cvs.getContext("2d");

drawCircle(ctx,50,50,25,{fillStyle:"blue"});
</script>
```

Ok, so we've included the drawtools library. You see that right? Don't mess up that part. Now we use the drawCircle function with the context, a width and height of 50, a radius of half that, and an options object that includes a fillStyle color.

This is ok, but now let's use the positional tools to draw a circle wherever we click on the canvas. Also, let's include some jquery, because it sure helps with event delegation and element selection.

```html
<canvas width="400" height="400"></canvas>

<script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
<script src="drawtools.js"></script>
<script>
var cvs = $("canvas");
var ctx = cvs[0].getContext("2d");

cvs.on("mousedown touchstart",function(e){
  var pos = getEventXY(e);
  drawCircle(ctx,pos.x,pos.y,25,{fillStyle:"blue"});
});
</script>
```

Ok, obviously, there's so much more. Explore a bit, and see if you can figure anything out. If you'd like to improve or help me with this project, please fork and do some goodness.



## Color Tools

Color.js is a couple object types for handling color. The most basic color objects are RGB, HSL, and CMYK. Then there is the COLOR object. This has each of the previous objects as properties, as well as a hex property.

New COLOR objects can be created with or without an initial value. The default color is black.

```javascript
var black = new COLOR();
var red = new COLOR("rgb",{r:255,g:0,b:0});
```

Values of color objects can simply be updated, or set with the setVal() method which requires a value type, and a value which can be simple or a HSL/RGB/CMYK color object.

```javascript
var c = new COLOR();
c.hsl.h = 255; // Will not update other color objects
c.setVal("hex","25e79c");
c.setVal("rgb",{r:156,g:57,b:211});
```

Output strings can be generated for all the color object types using the toString method.

```javascript
var c = new COLOR("rgb",{r:255,g:0,b:0});
console.log(c.toString("hsl")); // returns `hsl(0,100%,50%)`
```
