const el = document.querySelector('.landing'); 
const backgroundEl = document.querySelector('.background'); 

const ALLOW_JAVASCRIPT = true;
if (ALLOW_JAVASCRIPT) {

    // EFFECT 1:  FUNKY BACKGROUND MOVE EFFECT
    const DAMPER = 90;  
    const MAX_VALUE = 5;

    let startX = -1;
    let startY = -1;

    // Animate the background image and decorative dashed lines
    el.addEventListener('mousemove', (function(e) {        
        var amountMovedX = (e.pageX * 1 / DAMPER);  
        // if (amountMovedX > MAX_VALUE)  amountMovedX = MAX_VALUE ; 
        // if (amountMovedX < -MAX_VALUE) amountMovedX = -MAX_VALUE ;
        
        var amountMovedY = (e.pageY * 1 / DAMPER);
        // if (amountMovedY > MAX_VALUE)  amountMovedY = MAX_VALUE ; 
        // if (amountMovedY < -MAX_VALUE) amountMovedY = -MAX_VALUE ;
        // var amountMovedX = (e.movementX * 1 / DAMPER);
        // var amountMovedY = (e.movementY * 1 / DAMPER);

        //backgroundEl.style.backgroundPosition =  amountMovedX + 'px ' + amountMovedY + 'px';

        //console.log("1: ", backgroundEl.style.backgroundPosition);
        // let currentPosition = window.getComputedStyle(backgroundEl).getPropertyValue("background-position").split(' ');        
        // if (startX == -1 && startY == -1) {
        //     startX = parseFloat(currentPosition[0].toString().replace('px', ''));    
        //     startY = parseFloat(currentPosition[1].toString().replace('px', ''));   
        //     //console.log("Got start positions: ", startX, startY);         
        // }
        
                        
        //let x = parseFloat(currentPosition[0].toString().replace('px', ''));
        let x = startX + amountMovedX;
        //let y = parseFloat(currentPosition[1].toString().replace('px', ''));
        let y = startY + amountMovedY;  
        
        backgroundEl.style.backgroundPosition =  x + 'px ' + y + 'px';


        // Update the pseudo selector animation
        let gradientUpEl = document.querySelector('.gradient-up');    
        gradientUpEl.style.backgroundPosition = 'right ' + amountMovedX * 75 + 'px';
        
        let gradientDownEl = document.querySelector('.gradient-down');
        gradientDownEl.style.backgroundPosition = 'right ' + amountMovedY * 75 + 'px';
    }));
    // animate the decorative dashed lines when section has focus
    // el.addEventListener('mouseover', (function(e) {        
    //     let gradientUpEl = document.querySelector('.gradient-up');    
    //     let gradientDownEl = document.querySelector('.gradient-down');
    //     gradientUpEl.classList.add('animate');
    //     gradientDownEl.classList.add('animate');
    // }));
    // // save resources by stopping animation when section no longer has focus
    el.addEventListener('mouseleave', (function(e) {        
        let gradientUpEl = document.querySelector('.gradient-up');    
        let gradientDownEl = document.querySelector('.gradient-down');
        gradientUpEl.classList.remove('animate');
        gradientDownEl.classList.remove('animate');
    }));

}
    

// EFFECT 2:  Image Carousel
const backgrounds = ['huckleberry-lookout.jpg', 'whitefish.jpg', 'lakemcdonald.jpg'];
const carouselEls = document.querySelectorAll('.nav-carousel li');
//console.log("Carousel Els: ", carouselEls);
carouselEls.forEach((item) => {        
    item.addEventListener('click', () => {

        // Remove prior clicked style.
        carouselEls.forEach((item) => { 
            item.classList.remove('clicked');
        });
        item.classList.add('clicked');

        let index = item.dataset.index;
        console.log("Index: ", index, backgrounds[index], backgroundEl);
        if (index) {      
            backgroundEl.classList.remove('fade-in');
            backgroundEl.classList.add('fade-out');
            window.setTimeout(() => {
                // remove previous
                backgroundEl.classList.remove('background-1');
                backgroundEl.classList.remove('background-2');
                backgroundEl.classList.remove('background-3');

                backgroundEl.classList.add(`background-${index}`);
                // backgroundEl.style.background = "url('../img/hero/" + backgrounds[index] + "')";
                // backgroundEl.style.backgroundSize = "cover";
                // backgroundEl.style.backgroundRepeat = "no-repeat";
                // console.log('New background setting: ', backgroundEl.style.background);
                backgroundEl.classList.remove('fade-out');
                backgroundEl.classList.add('fade-in');
            }, 600);                                 
        }
        else {
            console.error("No index found on this link");
        }
    })
});


let scale = 1;

// EFFECT 3:  PARALAXX
window.addEventListener('scroll', () => {
    const target = document.querySelectorAll('.scroll');
    
    // // Save off the initial transform  -> WHY?????
    // target.forEach((scrollEl) => {
    //     const initialTransform = scrollEl.style.transform;
    //     // Save it into the dataset
    //     scrollEl.dataset.initialTransform = initialTransform;
    // });

    var index = 0; length = target.length;
    for (0; index < target.length; index++) {
        let current = target[index];
        var pos = window.pageYOffset * current.dataset.rate;       

        // Adjust the scale as screen moves down
        let scrollPercent =  (window.pageYOffset / target[index].offsetHeight);
        let scaleAdjust = 0.15 * scrollPercent;         
        scale = 1.0 + scaleAdjust;
        
        const initialTransform = (current.dataset.transform != undefined) ? current.dataset.transform + " " : "";
        const move = initialTransform + 'translate3d(0px, '+pos+'px, 0px)';              
        //const move = 'translate3d(0px, '+pos+'px, 0px)';  // Non-Scale adjust method                                           
        current.style.transform = "scale(" + scale + ") " + move;                     
    }
});

