
function initAnimations(selector) {
    // Get all the elements to be scrolled to
    let elements = document.querySelectorAll(selector);
    if (elements) {
        let offsetX = elements[0].getBoundingClientRect().x;
        elements.forEach((element) => {
            const boundingX = element.getBoundingClientRect().x;
            element.dataset.x = boundingX;
            element.dataset.offsetX = offsetX;
        });
    }
}

// Implements the 'scrollIntoView' functionality but only on the horizontal axis.
function snapScrollHorizontal(el) {

    let watchList = [];
 
    let index = el.dataset.index;// - el.dataset.offsetX;
    let targetX = el.dataset.x;// - el.dataset.offsetX;
    // watchList.push({key: 'X: ', value: targetX});

    // Get the parent
    const parentEl = el.parentElement;

    let maxScrollWidth = parentEl.scrollWidth - parentEl.clientWidth

    // watchList.push({key: 'Scroll Width: ', value: parentEl.scrollWidth});  
    // watchList.push({key: 'Client Width: ', value: parentEl.clientWidth});  
    watchList.push({key: 'Actual Width: ', value: parentEl.scrollWidth - parentEl.clientWidth});  

    //const elementWidth = (el.parentElement.scrollWidth / 6); // -6?
    const elementWidth = (maxScrollWidth / 5);
    watchList.push({key: 'Element Width: ', value: elementWidth});  

    // Get the parents current scroll Left
    const parentScrollLeft = parentEl.scrollLeft;  
    watchList.push({key: 'Start Scroll Left: ', value: parentScrollLeft});  

       
    
    // Distance to center
    // const distanceToCenter1 = parentScrollLeft - targetX - 16; //targetX - parentScrollLeft; // - firstChildX; // - parentScrollLeft; // + padding; // - scrollLeft;
    // watchList.push({key: 'Distance1: ', value: distanceToCenter1});    

    // const distanceToCenter2 = targetX - parentScrollLeft; // - firstChildX; // - parentScrollLeft; // + padding; // - scrollLeft;
    // watchList.push({key: 'Distance2: ', value: distanceToCenter2});   
    
    const distanceToCenter3 = (elementWidth * index) - parentScrollLeft; 
    watchList.push({key: 'Distance3: ', value: distanceToCenter3});    

    watchList.push({key: 'Expected Scroll End: ', value: parentScrollLeft + distanceToCenter3});    
    
    // 
    //let d = parentScrollLeft - 0;
    //watchList.push({key: 'D: ', value: d});    

    // ANIMATION SEQUENCE

    const FRAMES = 50;
    const interval = distanceToCenter3 / FRAMES;
    watchList.push({key: '  interval: ', value: interval});

    //parentEl.scrollLeft += distanceToCenter3;
    //let endDistance = parentEl.scrollLeft;


    // let complete = false;
    let i = 0; let timeElapsed = 0; let timeDelay = 10;

    let loop = window.setInterval(() => {

        let easeInOutInterval = easeInOutQuint(timeElapsed, parentScrollLeft, distanceToCenter3, timeDelay * FRAMES);
        watchList.push({key: `easeInOutInterval: ${timeElapsed}`, value: easeInOutInterval});
        
        parentEl.scrollLeft = easeInOutInterval;
        //parentEl.scrollLeft += interval;      // old way

        i+=1;
        timeElapsed += timeDelay
        if (i >= FRAMES) { 
            // Cross the finish line by doing one more calculation to 
            // clean up any rounding errors.
            const distanceLeft = (elementWidth * index) - parentEl.scrollLeft; 
            watchList.push({key: '  distanceLeft: ', value: distanceLeft});
            parentEl.scrollLeft += distanceLeft;

            // Clean up 
            clearInterval(loop);
            watchList.push({key: '  End Scroll Left: ', value: parentEl.scrollLeft});            
        }
        debugPrintInformation(watchList);
    }, timeDelay);
    //console.log("ScrollLeft: ", parentEl.scrollLeft);

    // console.table("Start Scroll Left: ", parentScrollLeft, " | EndScrollLeft:", parentEl.scrollLeft,
    //     " | TargetX: ", targetX, " | Distance: ", distanceToCenter
    // );

    

    
    // for(i; i < FRAMES; i++) {
    //     window.setTimeout(() => {
    //         parentEl.scrollLeft += interval;
    //     },300);
    // };

    // Fact Checking
    //console.log("Center: ", centerX, "Parent: ", parentEl, "Parent Scroll Left: ", scrollLeft);
    //console.log("targetX: ", targetX);
    //console.log("Padding: ", padding);
    //console.log("Parent Scroll Left: ", parentEl.scrollLeft);
    //console.log("Distance to Center: ", distanceToCenter);    
}


/*
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

// function scrollItLeft(element, adjustment) {
//     element.scrollLeft += interval;
// }

// returns a list of elements which are in the viewport.
function getElementsOnScreen(selector) {
    console.log("getElementsOnScreen(): ", selector);
    return undefined;
}




//  DEBUG

function debugPrintScrollPosition() {
    let scrollX = document.querySelector('.horizontal-scroller').scrollLeft;    
    document.getElementById("ScrollLeft").innerText = `ScrollLeft:: ${scrollX}`;
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