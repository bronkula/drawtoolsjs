/*
 * Event.js from the DrawTools.js library
 * Creator: Hamilton Cline
 * Email: hamdiggy@gmail.com
 * Website: hamiltondraws.com
*/

/* EVENTS.JS */
/*------------------------------- Point Detection Functions -----------------------*/
/* Return an array of either touches or a click */
const evPoints = e => e.type.substring(0,5)!="touch"?[e]:!e.touches.length?e.changedTouches:e.touches;
/* return an offset xy object for the position of the click or touch in the object */
/* pass in an optional object that will be used for basis */
const getEXY = (e,o) => { let rect = (o||e.target).getBoundingClientRect(); return ({ x:e.pageX-rect.left, y:e.pageY-rect.top }); }
/* Return the first xy position from an event, whether touch or click */
const getEventXY = (e,o) => getEXY(evPoints(e)[0],o);
