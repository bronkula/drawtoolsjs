
/* This function takes two objects, and replaces or adds any values in object 1 with the values of object 2 */
function overRide(op,ov) {
    if(!ov) return op;
    for(var i in ov) {
        op[i] = ov[i];
    }
    return op;
}




/*----------------------------------------------------------------------*/
/*                         Draw functions                               */

/* Draw a circle */
function drawCircle(ctx,x,y,r,options){
    ctx.beginPath();
    ctx.arc(x,y,r,0,2*Math.PI);
    fillIt(ctx,options);
    strokeIt(ctx,options);
}
/* Draw a rectangle */
function drawRect(ctx,x,y,w,h,options){
    ctx = overRide(ctx,options);
    ctx.fillRect(x,y,w,h);
}
/* Draw a rectangle with a random color */
function drawRandomRect(ctx,x,y,w,h,options){
    o = overRide({
        lineWidth:0,
        strokeStyle:"black",
        fillStyle:"rgba("+rand(120,250)+","+rand(120,250)+","+rand(120,250)+","+(options&&options.opacity!==undefined?options.opacity:0.7)+")"
    },options);
    drawRect(ctx,x,y,w,h,o);
}
/* Draw one line segment */
function drawSegment(ctx,x1,y1,x2,y2,options){
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    strokeIt(ctx,options)
}
/* Draw an array of line segments, allowing smooth connections */
function drawLine(ctx,lines,options){
    ctx.beginPath();
    ctx.moveTo(lines[0].x,lines[0].y);
    for(var i=1,l=lines.length; i<l; i++) {
        ctx.lineTo(lines[i].x,lines[i].y);
    }
    strokeIt(ctx,options);
}

function drawText(ctx,text,x,y,options){
    o = overRide({
        strokeStyle:"black",
        lineWidth:0,
        radius:10,
        textAlign:"center",
        font:"16px Verdana"
    },options);

    ctx = overRide(ctx,o);

    ctx.globalCompositeOperation = "destination-out";
    if(o.lineWidth) ctx.strokeText(text,x,y);

    ctx.globalCompositeOperation = "source-over";
    ctx.fillText(text,x,y);
}


function drawPulse2(ctx,x,y,oRadius,iRadius,options){
    drawCircle(ctx,x,y,oRadius,options);
    ctx.globalCompositeOperation = "destination-out";
    drawCircle(ctx,x,y,iRadius,options);
    ctx.globalCompositeOperation = "source-over";
}


function drawPie(ctx,x,y,outerRadius,innerRadius,startangle,endangle,additive,options){
    var startingAngle = degreesToRadians(startangle);
    var arcSize = degreesToRadians(endangle);
    var endingAngle = startingAngle + arcSize;

    ctx.beginPath();
    ctx.arc(x, y, outerRadius, startingAngle, endingAngle, !additive);
    ctx.arc(x, y, innerRadius, endingAngle, startingAngle, additive);
    ctx.closePath();
    fillIt(ctx,options);
    strokeIt(ctx,options);
}



function degreesToRadians(degrees) {
    return (degrees * Math.PI)/180;
}
function getSatellite(start,angle,distance,isX) {
    return start+Math[isX?"cos":"sin"](degreesToRadians(angle))*distance;
}





function strokeIt(ctx,options) {
    if(!options) return;
    if(options.lineWidth) {
        ctx = overRide(ctx,options);
        ctx.stroke();
    }
}
function fillIt(ctx,options){
    if(!options) return;
    if(options.fillStyle) {
        ctx = overRide(ctx,options);
        ctx.fill();
    }
}