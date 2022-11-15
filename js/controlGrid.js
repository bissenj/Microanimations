/*
    CONTROL GRID
   
    Creates a vertical or horizontal grid of clickable boxes.  Generally used with a slider
    to show and update position.   [] [] || []

    BEHAVIOURS
        - Listen for changes to selected slider index.
        - Notify slider index has changed.


    UI STATES
        - Selectable Item:  Empty Box
        - Selected Item:    Full Box

*/

class ControlGrid {

    componentEl = undefined;
    quantity = 0;
    selectedIndex = 0;

    constructor(componentEl, quantity, selectedIndex) {
        this.componentEl = componentEl;
        this.quantity = quantity;
        this.selectedIndex = selectedIndex;

        this.init();

        console.log("Control Grid Loaded. Selected Index: ", this.selectedIndex);
    }

    // Private Methods
    init() {
        this.render(this.componentEl, this.quantity, this.selectedIndex);
    }

    render(componentEl, quantity, index) {
        if (componentEl) {
            let html = "";   
           
            let i = 0; 
            for(i = 0; i < quantity; i++) {
                html += `<div class='control-box' data-index=${i} ></div>`;
            }    
            componentEl.innerHTML = html;

            // Set selected index styles
            componentEl.children[index].classList.add('selected');

            // Set event handlers
            const boxes = componentEl.querySelectorAll('.control-box');
            boxes.forEach((item) => {                
                item.onclick = (e) => this.handleClick(e);
            });
        }
        else {
            console.error("No component element found.");
        }  
    }

    handleClick(e) {
        // Remove old selected index styles
        this.componentEl.querySelector('.selected').classList.remove('selected');

        // Set the new selected index
        this.selectedIndex = parseInt(e.target.dataset.index);

        // Add new selected index styles        
        this.componentEl.children[this.selectedIndex].classList.add('selected');
        
        // Send out an event so other components know the index changed
        this.dispatchIndexChanged(this.selectedIndex);
    }

    // Public Methods
    setIndex(index) {
        this.selectedIndex = index;

        const boxes = this.componentEl.querySelectorAll('.control-box');
        for(let i = 0; i < boxes.length; i++) {
            if (index == i) { boxes[i].classList.add('selected'); }
            else { boxes[i].classList.remove('selected'); }
        }

    }


    // -----------------------------------------------------------------
    // CUSTOM EVENTS
    // -----------------------------------------------------------------

    // Triggered when selected index is changed
    dispatchIndexChanged(index) {
        const event = new CustomEvent('onindexchange', {
            bubbles: true,
            detail: { 
                index: index,        
            }    
        });

        // Send out the event (target is the main component)
        this.componentEl.dispatchEvent(event);
    }
}