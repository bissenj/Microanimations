
// JS structure notes:  https://css-tricks.com/slider-with-sliding-backgrounds/

var ImageModal = {

    // Elements
    el: {
        imageNode: 'div.image1', //document.querySelector('div.image1'),
        imageNode2: document.querySelector('div.image1'),
    },

    // Event Handlers
    init: function() {
        //console.log(document.querySelector('div.image1'));
        console.log(this.el.imageNode2);

        // click handler
        ImageModal.el.imageNode2.addEventListener("click", function(event) {
            ImageModal.handleClick(event);
        });
        
    },    

     // Functions
     handleClick: function(event) {
        console.log("Click!", event.target);

        // Get window.computedValues for height, width
        let w = window.getComputedStyle(event.target).getPropertyValue("width");        
        let h = window.getComputedStyle(event.target).getPropertyValue("height");   
        let bounding = event.target.getBoundingClientRect();     
        console.log("New Element: ", bounding);

        // parent's parent 
        //const section = event.target.parentNode.parentNode.parentNode;
        const section = event.target.parentNode;

        // 1.  Clone the element
        const newElement = event.target.cloneNode();
        newElement.tabIndex = 0;
        newElement.style.position = 'absolute';
        newElement.style.zIndex = 200;
        newElement.style.width = w; //bounding.width;
        newElement.style.height = h; //bounding.height;
        newElement.style.top = "0px"; //bounding.y + "px"; //bounding.top;
        newElement.style.left = "0px"; //bounding.x + "px"; //bounding.left;        
        newElement.classList.add('slow-transition');   
        //newElement.focus();     
        newElement.addEventListener("blur", function(event) {
            ImageModal.loseFocus(event);
        });

        section.appendChild(newElement);

        window.setTimeout(() => {
            newElement.focus(); 
            newElement.classList.add('revert');
        }, 1000);
        
        //newElement.classList.add('revert');

        // // 2.  Create a modal element
        // const modal = document.createElement('div');
        // modal.classList.add('modal');
        // modal.innerHTML = "<div><h1>Modal</h1><p>This is some text<p></div>";
        
        // const imageContainer = document.createElement('div');
        // imageContainer.classList.add('modal-image');
        // imageContainer.appendChild(newElement);

        // // 2.  Add some styles
        // modal.appendChild(imageContainer);
        // section.appendChild(modal);

    },
    loseFocus: function(event) {
        console.log("Lost Focus!", event.target);

        event.target.classList.add('revert-undo');

        window.setTimeout(() => {
            event.target.remove();
            console.log("Element Removed.");
        }, 3000);
    }
};

ImageModal.init();