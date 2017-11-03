
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
