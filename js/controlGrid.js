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
    state = {
        quantity: 0,
        selectedIndex: 0,
        theme:'',
    }

    constructor(componentEl, quantity, selectedIndex, theme = '') {
        this.componentEl = componentEl;
        this.state.quantity = quantity;
        this.state.selectedIndex = selectedIndex;
        this.state.theme = theme;

        this.init();

        console.log("Control Grid Loaded. Selected Index: ", this.state.selectedIndex);
    }

    // Private Methods
    init() {
        this.render(this.componentEl, this.state.quantity, this.state.selectedIndex);

        // Add event handlers
        this.addEventHandlers(this.componentEl);
    }

    render(componentEl, quantity, index) {
        if (componentEl) {

            //componentEl.tabIndex=0;
            // Just in case aria-role is not set for the component.
            componentEl.setAttribute("role", "radiogroup");            

            let html = "<span>01</span>";   
           
            let i = 0; 
            for(i = 0; i < quantity; i++) {
                html += `<div class='control-box ${this.state.theme}' data-index=${i} role="radio" tabIndex=0></div>`;
            }  
            html += `<span>0${i}</span>`;   
            componentEl.innerHTML = html;

            // Set selected index styles
            componentEl.children[index+1].classList.add('selected');

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

    // Set the event handlers for this component
    // Keyboard: left / right updates index    
    addEventHandlers(componentEl) {                  
        // Add support for arrow keys to move through list.
        componentEl.onkeydown = (e) => {
            console.log('onkeydown');      
            e = e || window.event;  
            if (e.keyCode == '37') this.setIndex(this.state.index - 1);
            if (e.keyCode == '39') this.setIndex(this.state.index + 1);
        }
    }

    handleClick(e) {
        // Remove old selected index styles
        this.componentEl.querySelector('.selected').classList.remove('selected');

        // Set the new selected index
        this.state.selectedIndex = parseInt(e.target.dataset.index);

        // Add new selected index styles        
        this.componentEl.children[this.state.selectedIndex+1].classList.add('selected');
        
        // Send out an event so other components know the index changed
        this.dispatchIndexChanged(this.state.selectedIndex);
    }

    destroy() {
        this.componentEl.style.opacity = 0;    
    }

    // Public Methods
    setIndex(index) {
        console.log("Control Grid - setIndex: ", index);

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
        //console.log("Control Grid -> onIndexChange: ", index);
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