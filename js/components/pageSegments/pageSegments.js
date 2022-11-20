
const IMAGE_PATH = './img/projects';


function renderFactory(data) {
    // console.log('RenderFactory(): ', data);

    const index = data.type;
    let result = '';

    switch(index) {
        case 0: 
            result = renderFullWidthImageWithTextOverlay(data);
            break;
        case 1:
            result = renderTextBlockCentered(data);
            break;
        case 2: 
            result = renderImageCollageTwoOne(data);
            break;
        case 3: 
            result = renderFullWidthImage(data);
            break;
        case 4: 
            result = renderTextBlockTwoColumn(data);
            break;
        case 5: 
            result = renderTextBlocksWithHeading(data);
            break;
        case 6: 
            result = renderMixedBlock(data);
            break;
        default:
            console.log("renderFactory: unidentified index -> ", index);
            result = renderOops();
    }
    return result;
}


function createNode(html) {
    const node = document.createElement('div');
    node.innerHTML = html;
    return node;
}

function renderOops() {
    return createNode('<div class="grid-center" style="color:red; padding:20px; border: 1px solid red;margin:20px;">oops</div>');
}


function renderFullWidthImage(data) {
    const image1 = data.image1 ?? '';    
    const optionalClasses = data.classes ?? '';

    // Logic

    let imageContainer = '';
    if (image1 != '') {
        imageContainer = `<img src='${IMAGE_PATH}/${image1}'></img>`;                        
    }

    console.log("imageContainer: ", imageContainer);

    // let style = `background: url(${IMAGE_PATH}/${image1}); background-size: cover;`;
    // let html = `
    //     <!-- Full Width Image -->
    //     <div class='segment ${optionalClasses}' style='${style}'>
    //         <div class='image-background-full-width'></div>
    //     </div>
    // `;    

    let html = `
        <!-- Full width Image -->
        <div class='segment scroll-target  ${optionalClasses}'>
            <div class='image-full-width grid-center'>
                ${imageContainer}                                    
            </div>
        </div>
    `;
    return createNode(html);
}

function renderFullWidthImageWithTextOverlay(data) {
    const image1 = data.image1 ?? '';
    const text1 = data.text1;
    const text2 = data.text2 ?? '';
    const optionalClasses = data.classes ?? '';

    // Logic
    let imageContainer = '';
    if (image1 != '') {
        imageContainer = `<img src='${IMAGE_PATH}/${image1}'></img>`;                        
    }

    let text2Container = '';
    if (text2 != '') {
        text2Container = `<div class='top-right slide-left'>${text2}</div>`;
    }

    console.log("imageContainer: ", imageContainer);
    
    // let html = `
    //     <!-- Full width Image with Text Overlay -->
    //     <div class='segment ${optionalClasses}'>
    //         <div class='image-full-width grid-center'>
    //             <h1 class='text-overlay'>${text1}<h1/>
    //         </div>
    //     </div>
    // `;

    let html = `
        <!-- Full width Image with Text Overlay -->
        <div class='segment ${optionalClasses}'>
            <div class='image-full-width grid-center'>
                ${imageContainer}                        
                <div class='text-container grid-center'>
                    <h1 class='text-overlay bottom-right slide-right'>${text1}</h1>               
                </div>
                ${text2Container}
            </div>
        </div>
    `;



    return createNode(html);
}

function renderTextBlockCentered(data) {    
    const text1 = data.text1;
    const optionalClasses = data.classes || '';

    let html = `
        <!-- Centered Text Block -->
        <div class='segment p80 ${optionalClasses}'>
            <div class='text-block-half grid-center'>
                <p>${text1}</p>            
            </div>
        </div>
    `;
    return createNode(html);
}

function renderImageCollageTwoOne(data) {
    const image1 = data.image1;    
    const image2 = data.image1;    
    const image3 = data.image1;    
    const optionalClasses = data.classes || '';

    let html = `
        <!-- 2-1 Image collage -->
        <div class='segment ${optionalClasses}'>
            <div class='image-grid-2-1'>
                <div class='grid-left'>            
                    <div class='one'>One</div>
                    <div class='two'>Two</div>
                </div>            
                <div class='three'>Three</div>            
            </div>
        </div>
    `;
    return createNode(html);
}

function renderTextBlockTwoColumn(data) {
    const text1 = data.text1;
    const text2 = data.text2;
    const optionalClasses = data.classes || '';

    let html = `
        <!-- 2 text columns -->
        <div class='segment p80 ${optionalClasses}'>
            <div class='text-block-2'>
                <div class='text-block-half grid-center'>
                    <p>${text1}</p>            
                </div>
                <div class='text-block-half grid-center'>
                <p>${text2}</p>            
                </div>
            </div>        
        </div>
    `;
    return createNode(html);
}

function renderTextBlocksWithHeading(data) {
    const heading = data.heading || '';

    const text1 = data.text1;
    const optionalClasses = data.classes || '';

    let headingHtml = '';
    if (heading != '') {
        headingHtml = `<h4>${heading}</h4>`;
    }

    let paragraphHtml = '';
    data.text.map((item) => {
        let classes = item.classes ?? '';        

        paragraphHtml += `<p class='${classes}'>${item.text}</p>`;

        let imageContainer = '';
        let image = item.image ?? '';
        if (image != '') {
            imageContainer = `<img src='${IMAGE_PATH}/${image}'></img>`;                        
        }
        
        paragraphHtml += imageContainer;

    });

    let html = `
        <!-- Centered Text Block -->
        <div class='segment p80 ${optionalClasses}'>
            <div class='text-block-half grid-center'>
                ${headingHtml}
                ${paragraphHtml}
            </div>
        </div>
    `;
    return createNode(html);
}


function renderMixedBlock(data) {    
    const optionalClasses = data.classes || '';

    const heading = data.heading || '';    
    let headingHtml = '';
    if (heading != '') {
        headingHtml = `<h4>${heading}</h4>`;
    }
    

    let elementsHtml = '';
    data.content.map((item) => {        
        let classes = item.classes ?? '';        
        
        // Mixed block content needs to go in their own div
        elementsHtml += `<div class=${classes}>`;
        
        // Add a paragraph
        let text = item.text ?? '';  
        console.log("Text: ", text);      
        if (text != '') {        
            elementsHtml += `<p>${text}</p>`;
        }

        // Add an image        
        let image = item.image ?? '';
        if (image != '') {
            elementsHtml += `<img src='${IMAGE_PATH}/${image}'></img>`;                        
        }        
        elementsHtml += `</div>`;
    });

    let html = `
        <!-- Centered Text Block -->
        <div class='segment p80 ${optionalClasses}'>
            <div class='image-full-width grid-center'> 
                ${headingHtml}               
                ${elementsHtml}
            </div>
        </div>
    `;
    return createNode(html);
}
