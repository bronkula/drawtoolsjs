# DrawToolsjs

Created by Hamilton Cline

Canvas library for javascript. I will almost certainly write something in depth here. For now, there's a file. It's got some functions. Most of them should be relatively clear how to use.

## A note on Draw Tools
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
