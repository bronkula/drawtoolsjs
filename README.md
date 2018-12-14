# DrawToolsjs

Created by Hamilton Cline

[Draw.js](#user-content-draw-tools-js) is a canvas library for javascript. It mostly abstracts the basic canvas functionality into something easier to use, basic maths for geometry and trigonometry, and some very basic event data for XY coordinates. It includes the canvas.js, maths.js, color.js, and events.js libraries.  

Dependencies - **jQuery** - For event detection

[Color.js](#user-content-color-tools-js) is a color handling library for javascript. It easily converts between Hex colors, RGB colors, HSL colors, and even CMYK colors. It outputs easy strings for css and presentation.

[Canvas.js](#user-content-canvas-tools-js) is an abstraction library for javascript and the HTML5 Canvas. This library not only simplifies drawing a number of common shapes, but also includes other things like grids, and also abstracts drawing paths into something that can be handled separately from filling and stroking in order to greatly enhance performance when drawing layers in certain instances. 

Dependencies - **jQuery, Maths.js**

[Event.js](#user-content-event-tools-js) is an event handling library for javascript. It uses jQuery in order to simplify turning any touch, click, or pen input into a return or even just a simple xy coordinate return.   

Dependencies - **jQuery**

[Maths.js](#user-content-maths-tools-js) is a maths library for javascript. It has the basic concept math for geometry, trigonometry, and calculus to give the user a more easy to use, and possibly understand set of tools for positional math in games and art projects.


## Draw Tools JS
Many of the actual drawing tools in the draw.js library (as opposed to the positional tools) use similar methodologies for arguments. They use a context to be applied, some values necessary for the particular shape, and then an options object. This object should be all the relevant context options for drawing, such as colors and line widths, that would normally be applied to a canvas context.

So, where to start? Well, it helps to come at this with a cursory understanding of the html5 canvas already. Much of this library is simplifying certain overly complex common operations when using the canvas.

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

<script src="draw.js"></script>
<script>
var cvs = document.querySelector("canvas");
var ctx = cvs.getContext("2d");

drawCircle(ctx,50,50,25,{fillStyle:"blue"});
</script>
```

Ok, so we've included the drawtools library. You see that right? Don't mess up that part. Now we use the drawCircle function with the context, a width and height of 50, a radius of half that, and an options object that includes a fillStyle color.


## Event Tools JS
This is ok, but now let's use the Event Tools to draw a circle wherever we click on the canvas. Also, let's include some jquery, because it sure helps with event delegation and element selection... And also because the Event Tools require it...

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


## Maths Tools JS
The Maths file is really all about not having to think about all that hard positional math that comes with geometry and trigonometry.

Let's really get in here now. Let's use the Event Tools to gather a position we'll call `mouse` any time that the mouse is moved around. By storing this value in a global variable, we can access it whether the mouse is moving or not.

Then we'll start a `setInterval` when the mouse is pressed. Now every 10 milliseconds, we'll draw a circle that is rotating around the point of our mouse, using the `getSatelliteXY` function, from our Maths Tools. This will get a point somewhere around a point, based on an angle and distance given. We're also starting a number that increments every time our interval gets called, which will increase the angle of the satellite every tick.

```html
<canvas width="400" height="400" style="border:1px solid #ddd;"></canvas>

	<script src="http://culurs.com/js/jquery-2.2.1.min.js"></script>
	<script src="http://culurs.com/js/drawtools.js"></script>
	<script>
	var cvs = $("canvas");
	var ctx = cvs[0].getContext("2d");
	var drawing = false;
	var num = 0;
	var mouse = {x:0,y:0};

	cvs
	  .on("mousedown touchstart",function(e){
	    drawing = setInterval(function(){
	      num+=2;
	      var pos = getSatelliteXY(mouse.x,mouse.y,num%360,40);
	      drawCircle(ctx,pos.x,pos.y,2,{fillStyle:"blue"});
	    },10);
	    mouse = getEventXY(e);
	    ;
	  })
	  .on("mouseup touchend",function(e){
	    clearInterval(drawing);
	    num=0;
	  })
	  .on("mousemove touchmove",function(e){
	    mouse = getEventXY(e);
	  });
	</script>
```

## Color Tools JS

Color.js is a couple object types for handling color. The most basic color objects are RGB, HSL, and CMYK. Then there is the COLOR object. This has each of the previous objects as properties, as well as a hex property.

New COLOR objects can be created with or without an initial value. The default color is black.

```javascript
var black = new COLOR();
var red = new COLOR({r:255,g:0,b:0},"rgb");
```

Values of color objects can simply be updated, or set with the setVal() method which requires a value type, and a value which can be simple or a HSL/RGB/CMYK color object.

```javascript
var c = new COLOR();
c.hsl.h = 255; // Will not update other color objects
c.setVal("hex","#25e79c");
c.setVal("rgb",{r:156,g:57,b:211});
```

Output strings can be generated for all the color object types using the toString method.

```javascript
var c = new COLOR("rgb",{r:255,g:0,b:0});
console.log(c.toString("hsl")); // returns `hsl(0,100%,50%)`
console.log(c.toString("rgba",0.5)); // returns `rgba(255,0,0,0.5)`
```




Ok, obviously, there's so much more. Explore a bit, and see if you can figure anything out. If you'd like to improve or help me with this project, please fork and do some goodness.


