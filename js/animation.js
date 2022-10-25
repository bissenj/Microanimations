// ---------------------------------------------------------------------------------------------------
// Author:  JAB (Mountains & Code)
// Date:    10/22/2022
// Summary: Animation library for modern UI effects
// ---------------------------------------------------------------------------------------------------


// What: Implements the 'scrollIntoView' functionality but only on the horizontal axis.
//
// Why:  The scrollIntoView native function ends up vertically scrolling the view (in addition to horizontal) 
//       any vertical scrolling is not desired for a standard horizontal slider.
//
// Assumptions:
//   1.  Each slide takes up 100% of the viewport
//   2.  Uniform padding and gap on the scroll container.
//   3.  Slide should be centered at end of animation.

function slideShow_SnapScrollToNewSlide(el, onFinish) {

    snapScrollHorizontal(el, onFinish)
}
function snapScrollHorizontal(el, onFinish) {
 
    // Get the element index stored in DOM.  This is used to calculate how far 
    // the slide show needs to update.
    let index = el.dataset.index;
    
    // Get the parent
    const parentEl = el.parentElement;

    // Get the parents current scroll Left
    const parentScrollLeft = parentEl.scrollLeft;           

    // Get the number of elements in the slideshow
    const elementCount = parentEl.childNodes.length;

    // Calculate the max scroll distance.  ie. the total element width minus the elements creen width.   
    const maxScrollWidth = parentEl.scrollWidth - parentEl.clientWidth

    // Calculate the width of a single slide. Subtract one because on the first slide we don't need to scroll.
    const elementWidth = (maxScrollWidth / (elementCount-1));
           
    // Calculate the distance we need to scroll.  This takes into account how far the user has already scrolled.
    const distanceToTravel = (elementWidth * index) - parentScrollLeft;         
    //debugAddToWatchList('distance To Travel', distanceToTravel);
    

    // ANIMATION SEQUENCE   

    // These control how long and smooth our animation is.
    // More Frames and lower time delay = smoother animation.  
    const FRAMES = 60; const timeDelay = 10;
    let i = 0; let timeElapsed = 0; 
    //console.log("animation start");          
    let loop = window.setInterval(() => {

        // Calculate the distance to update in this frame using one of several standard easing equations (ease-in, ease-out, ease-in-out);
        let easingInterval = easeInOutQuint(timeElapsed, parentScrollLeft, distanceToTravel, timeDelay * FRAMES);        
        //debugAddToWatchList("easeInOutInterval", easingInterval);
        
        // animate by scrolling the parent container a bit
        parentEl.scrollLeft = easingInterval;
        
        i+=1;                       // update so we get out of the loop eventually.
        timeElapsed += timeDelay;   // update or current time variable for our easing equation.
        if (i >= FRAMES) { 
            // Cross the finish line by doing one more calculation to 
            // clean up any rounding errors.
            const remainingDistance = (elementWidth * index) - parentEl.scrollLeft;                         
            parentEl.scrollLeft += remainingDistance;
            //debugAddToWatchList("Remaining distance", remainingDistance);

            // Clean up 
            clearInterval(loop);
            //debugAddToWatchList("Scroll Left (End)", parentEl.scrollLeft);  
            //console.log("animation done");   
            onFinish(false);       
        }
        debugPrintInformation(watchList);
    }, timeDelay);

    //console.log("ending animation");
}


// ---------------------------------------------------------------------------------------------------
/*  --------------------- EASING FUNCTIONS -----------------------------------------------------------
    t = 0 - Animation is just started. Zero time has passed
    b = 200 - The starting position of the objects x-coordinate is 200
    c = 300 - The object has to move 300 to the right, ending at 500
    d = 1 - The object has one second to perform this motion from 200 to 500

    x = easeLinear(0, 200, 300, 1);
    x = 200

    x = easeLinear(0.5, 200, 300, 1);
    x = 350

    x = easeLinear(1, 200, 300, 1);
    x = 500

    Credit:  https://spicyyoghurt.com/tools/easing-functions
*/
function easeLinear (t, b, c, d) {
    return c * t / d + b;
}
function easeInOutCirc (t, b, c, d) {
    if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
    return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
}
function easeInOutQuint (t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
}


// ----------- VIEWPORT UTILITIES -------------------------------------------------------------------------------

// Returns a list of elements which are in the viewport.
function getElementsOnScreen(selector) {
     //console.log("getElementsOnScreen(): ", selector);

    // Calculate which element is most visible on the screen and scroll to it.
    let elements = document.querySelectorAll(selector);
    let elementsInView = [];
    
    elements.forEach((element) => {
        const bounding = element.getBoundingClientRect();

        const width = (window.innerWidth || document.documentElement.clientWidth);
        if (            
            (bounding.left >= 0 && bounding.left < width) ||
            (bounding.right >= 0 && bounding.right < width)            
        ) {             
            elementsInView.push(element);
        } else {
            //console.log('Not in the viewport...');
        }
    });
    return elementsInView;
}


// ------------ DEBUG UTILITIES ---------------------------------------------------------------------------------

let watchList = [];
function debugAddToWatchList(key, value) {    
    watchList.push({key: `${key}:`, value: value});        
}

function debugPrintScrollPosition(selectorSource, selectorDestId) {        
    let scrollX = document.querySelector(selectorSource).scrollLeft;    
    document.getElementById(selectorDestId).innerText = `ScrollLeft:: ${scrollX}`;    
}

// Prints out an array of key values {key: "target", value: "100"}
function debugPrintInformation(arr) {    
    let html = "<div>";

    arr.map((item) => {
        html += `<div><span class='label'>${item.key}</span>
                 <span class='value'>${item.value}</span></div>`;                
    });

    html +=  "</div>";

    document.getElementById("debug").innerHTML = html;
}


// ------------ DEAD CODE TO BE REMOVED AFTER REFACTORING AND TESTING --------------------------------------------

