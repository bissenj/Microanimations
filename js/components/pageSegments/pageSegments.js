

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
    const image1 = data.image1;
    const optionalClasses = data.classes || '';

    let html = `
        <!-- Full Width Image -->
        <div class='segment  ${optionalClasses}'>
            <div class='image-full-width grid-center'>          
            </div>
        </div>
    `;    
    return createNode(html);
}

function renderFullWidthImageWithTextOverlay(data) {
    const image1 = data.image1;
    const text1 = data.text1;
    const optionalClasses = data.classes || '';
    
    let html = `
        <!-- Full width Image with Text Overlay -->
        <div class='segment ${optionalClasses}'>
            <div class='image-full-width grid-center'>
                <h1 class='text-overlay'>${text1}<h1/>
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
