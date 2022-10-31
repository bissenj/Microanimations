
// JS structure notes:  https://css-tricks.com/slider-with-sliding-backgrounds/

var ImageModal = {

    // Elements
    el: {
        //imageNode: 'div.image2', //document.querySelector('div.image1'),
        imageNodes: document.querySelectorAll('div.about-image'),
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

        // Get window.computedValues for height, width
        let w = window.getComputedStyle(event.target).getPropertyValue("width");        
        let h = window.getComputedStyle(event.target).getPropertyValue("height");   
        let bounding = event.target.getBoundingClientRect();     
        //console.log("New Element: ", bounding);

        // parent's parent 
        //const section = event.target.parentNode.parentNode.parentNode;        
        const parent = event.target.parentNode;     // ie div.row1 or div.row2


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
            console.log("Node: ", node, node.offsetWidth); 
            
            widthAtPosition.push(cummulativeWidth);
            if (node == event.target) {
                console.log("Found it.  Done.");
                break;  // If we found our node, we're done.
            }            
            widthAtPosition[index++] = cummulativeWidth; 
            cummulativeWidth += node.offsetWidth;   // Do this now so next loop it will have this elements width.
        }
        console.log("Index: ", index, "Left: ", widthAtPosition[index], " Cummulative Width: ", cummulativeWidth);
        const elementLeft = widthAtPosition[index];
        


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
        
        const textElement = document.createElement('div');
        textElement.classList.add('text-overlay');
        textElement.innerHTML = "<p class='title'>Paddling across Lake McDonald in Glacier National Park </p>" + 
                                "<p class='description'>We usually visit Glacier National Park every week or so for " +
                                "hiking, biking, paddling or hoping to see the northern lights.<p>";
        newElement.appendChild(textElement);

        
        newElement.addEventListener("blur", function(event) {
            ImageModal.loseFocus(event);
        });


        // TRY TO PUT IT OUTSIDE OF ITS DIAGONAL CONTAINER
        parent.appendChild(newElement);
        //section.appendChild(newElement);

        const debug = false;
        if (!debug) {
            window.setTimeout(() => {
                newElement.focus(); 
                newElement.classList.add('revert');   

                window.setTimeout(() => {
                let screenWidth = window.innerWidth;
                //let elementWidth = newElement.offsetWidth;
                let parentWidth = parent.clientWidth;
                console.log("parent width: ", parentWidth);
                let expectedWidth = screenWidth * 0.5;
                


                // Because the 'diagonal row' has a width larger than the screen size, we need to 
                // calculate the screen width version of that and use it instead of a straight width percentage.            
                // Screen Dimensions for Test:  918 x 1214
                //
                const divisor = screenWidth / parentWidth;
                const newWidth = 80 * divisor;     // 80% * 0.57 = 45.6
                const newElementWidth = 0.8 * parentWidth * divisor;   // 0.8 * 1607 * 0.57 = 732
                // Left needs to be 127 but it gets computed at 92.  Because translation is happening
                // at a 30' diagonal, enhance it a bit.
                const newLeft = (screenWidth - newElementWidth) / 2 * 1.3;
                            
                expectedWidth = screenWidth * (newWidth/100);

                newElement.style.width = newWidth + '%';            
                newElement.style.left = newLeft + "px";            

                console.log("Screen Width: ", screenWidth, " newElementWidth: ", newElementWidth);
                console.log("Divisor: ", divisor, " New Width %: ", newWidth, "Left: ", screenWidth - newElementWidth);

                newElement.style.maxHeight = '500px';
                newElement.style.height = '100%';

                }, 1000);                
            }, 100);

        }
    },
    loseFocus: function(event) {
        console.log("Lost Focus!", event.target);

        event.target.classList.add('revert-undo');

        window.setTimeout(() => {
            event.target.remove();
            console.log("Element Removed.");
        }, 2000);
    }
};

ImageModal.init();