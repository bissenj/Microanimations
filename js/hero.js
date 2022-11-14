
import {imageCollage} from '../data/data.js';

// JS structure notes:  https://css-tricks.com/slider-with-sliding-backgrounds/

var ImageModal = {

    // Elements
    el: {
        //imageNode: 'div.image2', //document.querySelector('div.image1'),
        imageNodes: document.querySelectorAll('div.about-image'),
        animating: false,
    },

    // Event Handlers
    init: function() {
        //console.log(document.querySelector('div.image1'));
        console.log(this.el.imageNodes);

        // click handlers
        ImageModal.el.imageNodes.forEach((node) => {
            node.addEventListener("click", function(event) {
                ImageModal.handleClick(event);
            });
        })        
    },    

     // Functions
     handleClick: function(event) {
        console.log("Click!", event.target);
                
        const dataIndex = event.target.dataset.index;

        // Get window.computedValues for height, width
        let w = window.getComputedStyle(event.target).getPropertyValue("width");        
        let h = window.getComputedStyle(event.target).getPropertyValue("height");   
        let bounding = event.target.getBoundingClientRect();     
        //console.log("New Element: ", bounding);

        //console.log("Position Container: ", event.target.parentNode.parentNode.getBoundingClientRect());

        // GRANDPARENT -> Diagonal Recs Div
        let top = event.target.parentNode.parentNode.getBoundingClientRect().top - bounding.top;
        //console.log("Top Difference: ", top);


        //const body = document.querySelector('body');

        // PARENT
        const parent = event.target.parentNode;     // ie div.row1 or div.row2
        //console.log('Parent Height: ', parent.offsetHeight);
      

        // CALCULATE LEFT POSITION
        // -----------------------
        // To position the cloned element over it's original, need to add up the sibling elements widths
        // to the left of it:  
        //  ie.  Image1.left = 0.  Image2.left = (Image1.Width), Image3.left = (Image1.width + Image2.width)
        
        // Logic:  Figure out the index that this event element is at, and at the same time,
        //         add up the widths of the elements to the right of the element being iterated on.
        //        
        const widthAtPosition = [];      
        let cummulativeWidth = 0;
        let index = 0;
        for (const node of parent.children) {
            //console.log("Node: ", node, node.offsetWidth); 
            
            widthAtPosition.push(cummulativeWidth);
            if (node == event.target) {
                //console.log("Found it.  Done.");
                break;  // If we found our node, we're done.
            }            
            widthAtPosition[index++] = cummulativeWidth; 
            cummulativeWidth += node.offsetWidth;   // Do this now so next loop it will have this elements width.
        }
        //console.log("Index: ", index, "Left: ", widthAtPosition[index], " Cummulative Width: ", cummulativeWidth);
        const elementLeft = widthAtPosition[index];


        // CALCULATE RIGHT POSITION
        // ------------------------
        // The transformations occurred at 0,0 -> Top 0px, so we need to know which row this element
        // is on so later when we reposition the element we can adjust it to the correct 'Top' value.
        // ie.  Row 1 = Top 0px, Row 2 = (Row1.Height)
        

        // HACK FOR NOW
        let newTop = 0;
        if (parent.classList.contains('row2')) {   
            //console.log(event.target.parentNode.parentNode);         
            newTop = event.target.parentNode.parentNode.children[0].offsetHeight; 
        }
        //console.log("New Top: ", newTop);


        // 1.  Clone the element
        const newElement = event.target.cloneNode();
        newElement.tabIndex = 0;
        newElement.style.overflow = 'hidden';
        newElement.style.position = 'absolute';
        newElement.style.zIndex = 200;
        newElement.style.width = w; //bounding.width;
        newElement.style.height = h; //bounding.height;
        newElement.style.top = "0px"; //bounding.y + "px"; //bounding.top;
        newElement.style.left = elementLeft + "px"; //bounding.x + "px"; //bounding.left;   


        // Save these off to be restored when element transitions out.
        const savedElementSettings = {
            width: w,
            height: h,
            top: 0,
            left: elementLeft
        };
        
        const caption = imageCollage[dataIndex].caption;

        const textElement = document.createElement('div');
        textElement.classList.add('text-overlay');                
        textElement.innerHTML = `<p class='title'>${caption}</p>`; // + 
        //                         "<p class='description'>We usually visit Glacier National Park every week or so for " +
        //                         "hiking, biking, paddling or hoping to see the northern lights.<p>";
        newElement.appendChild(textElement);

        // Close Button
        const closeButton = document.createElement('button');
        closeButton.classList.add('close-button');
        closeButton.innerHTML = 'X';
        closeButton.addEventListener("click", function(event) {            
            ImageModal.transitionOut(newElement, savedElementSettings);
        });
        newElement.appendChild(closeButton);
        window.setTimeout(() => {
            closeButton.style.opacity = 1;
        }, 2000);
        
        // Add to parent container
        parent.appendChild(newElement);
        //newElement.focus();

        /// MODALS
        this.showModals(() => {this.transitionOut(newElement, savedElementSettings)});
        
        const debug = false;
        if (!debug) {
            window.setTimeout(() => {

                // TESTING - PUT THIS BACK!
                //newElement.focus();     
                    //event.preventDefault(); // Stop the scroll?

                // Kick of the Transition-In animation
                newElement.classList.add('transition-in');   
                //newElement.style.outline = '9999px solid rgba(0,0,0,0.3)';
                //newElement.style.transform = 'rotate(-30deg)';
                

                window.setTimeout(() => {
                    let screenWidth = window.innerWidth;
                    //let elementWidth = newElement.offsetWidth;
                    let parentWidth = parent.clientWidth;
                    //console.log("parent width: ", parentWidth);
                    //let expectedWidth = screenWidth * 0.5;
                    

                    // Because the 'diagonal row' has a width larger than the screen size, we need to 
                    // calculate the screen width version of that and use it instead of a straight width percentage.            
                    // Screen Dimensions for Test:  918 x 1214
                    //
                    const divisor = screenWidth / parentWidth;
                    const newWidth = 80 * divisor;     // 80% * 0.57 = 45.6
                    const newElementWidth = 0.8 * parentWidth * divisor;   // 0.8 * 1607 * 0.57 = 732
                    const newElementHeight = 0.8 * newElementWidth * divisor; // 0.8 is to shrink the size a bit so container isn't taller than image
                    // Left needs to be 127 but it gets computed at 92.  Because translation is happening
                    // at a 30' diagonal, enhance it a bit.
                    const newLeft = (screenWidth - newElementWidth) / 2 * 1.3;

                    // ROW2 Left:  119, needs to be 238
                                
                    //expectedWidth = screenWidth * (newWidth/100);

                    newElement.style.width = newWidth + '%';            
                    newElement.style.left = newLeft + "px";
                    newElement.style.top = "-" + newTop + "px";            

                    //console.log("Screen Width: ", screenWidth, " newElementWidth: ", newElementWidth);
                    //console.log("Divisor: ", divisor, " New Width %: ", newWidth, "Left: ", screenWidth - newElementWidth);

                    newElement.style.maxHeight = newElementHeight  + 'px'; //'500px';
                    newElement.style.height = newElementHeight + 'px';// '400px'; //'100%';

                }, 1200);   // This delay gives the rotation animatins time to finish before translating. Makes landing a bit smoother.             
            }, 100);

        }
    },
    transitionOut: function(newElement, savedElementSettings) {
        if (!ImageModal.el.animating) {
            console.log("Transition Out!", event.target);
                    
            // Fade the close button out
            // event.target.style.opacity = 0;
            newElement.querySelector('.close-button').style.opacity = 0;

            // Kick off the transition-out animations
            newElement.classList.add('transition-out');
            newElement.classList.remove('transition-in');
                        
            // Move element back to its original position when cloned.
            window.setTimeout(() => {        
                newElement.style.top = savedElementSettings.top + "px";
                newElement.style.left = savedElementSettings.left + "px"; 
                newElement.style.width = savedElementSettings.width; 
                newElement.style.height = savedElementSettings.height;        
            }, 1200);     // This delay gives the rotation animatins time to finish before translating. Makes landing a bit smoother.             

            // Fade out the element and specifically it's outline.
            window.setTimeout(() => {            
                newElement.style.opacity = 0;  
                //overlay.style.opacity = 0; 
                //overlay.classList.remove('show');
                this.fadeModals();
                //this.fadeModals(() => {this.transitionOut(newElement, savedElementSettings)});            
            }, 2500);

            // Remove the element from the DOM
            window.setTimeout(() => {            
                this.hideModals();            
                newElement.remove();                        
            }, 4000);
        }
        else console.log("Can't transitionOut(), currently animating");      
    },
    showModals: (callback) => {  
        if (!ImageModal.el.animating) {
            console.log("showModals()");

            ImageModal.el.animating = true;

            const pageModal = document.createElement('div');                
            pageModal.classList.add('modal');  
            document.querySelector('body').prepend(pageModal);
            window.setTimeout(() => {
                pageModal.classList.add('show', 'on-top');
            }, 100);  
            
            const transformedModal = document.createElement('div');                
            transformedModal.classList.add('modal-overlay'); 
            document.querySelector('.diagonal-rects').appendChild(transformedModal);
            window.setTimeout(() => {
                transformedModal.classList.add('show', 'on-top');
            }, 100);  

            // Add close handlers after everything has finished.
            window.setTimeout(() => {
                pageModal.addEventListener('click', callback);
                transformedModal.addEventListener('click', callback);
                ImageModal.el.animating = false;
            }, 3000);  
        }  
        else console.log("Can't showModals(), currently animating");      
    },
    fadeModals: () => {
        if (!ImageModal.el.animating) {
            console.log("fadeModals()");
            
            const pageModal = document.querySelector('.modal');
            pageModal.classList.remove('show');        
                    
            const transformedModal = document.querySelector('.modal-overlay');
            transformedModal.classList.remove('show');           
        }
        else console.log("Can't fadeModals(), currently animating");      
    },
    hideModals: () => { 
        if (!ImageModal.el.animating) {
            console.log("hideModals()");

            const pageModal = document.querySelector('.modal');
            pageModal.remove();
                //pageModal.classList.remove('show', 'on-top');         
                    
            const transformedModal = document.querySelector('.modal-overlay');
            transformedModal.remove();
                //transformedModal.classList.remove('show', 'on-top'); 
                
            ImageModal.el.animating = false;
        }
        else console.log("Can't hideModals(), currently animating");      
    },    
};

ImageModal.init();