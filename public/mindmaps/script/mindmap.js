console.log('mindmap generation script loaded');

class MapWeb {
    constructor(parentChode, settings) {
        this.settings = {};
        if(settings.autoscroll) {
            this.settings.autoscroll = true;
        }
        else {
            this.settings.autoscroll = false;
        }
        this.svgContainer = document.createElement('div');
        this.svgContainer.style.position = 'absolute';
        this.svgContainer.style.top = "0";
        this.svgContainer.style.left = "0";
        this.svgContainer.style.pointerEvents = 'none';

        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.startChode = parentChode;
        document.body.appendChild(this.svgContainer);
        this.svgContainer.appendChild(this.svg);
        document.addEventListener('DOMContentLoaded', ()=>{
            // this.svg.style.height = Math.floor(bb.height) + 'px';
            // this.svg.style.width = Math.floor(bb.width) + 'px';
            this.sizeElements();
            this.svg.style.top = '0px';
            this.svg.style.left = '0px';
            this.svg.style.position = "absolute";
            this.svg.style.display = "block";
            this.createSVGWeb(parentChode);
        });
    }

    sizeElements() {
        let width = Math.floor(document.body.offsetWidth);
        let height = Math.floor(document.body.offsetHeight);
        this.svgContainer.style.width = width + 'px';
        this.svgContainer.style.height = height + 'px';
        this.svg.setAttribute('width', width );
        this.svg.setAttribute('height', height);

    }

    createSVGWeb(parentChode) {
        parentChode.drawLines(this);
        for(let i = 0; i < parentChode.children.length; i++) {
            this.createSVGWeb(parentChode.children[i]);
        }

    }

    scrollTo(chode) {
        if(this.settings.autoscroll) {
            let targety = chode.textContent.offsetTop - window.screen.availHeight/2;
            window.scroll({
                top: targety,
                behavior:'smooth'
            })
            console.log('not scrollin')
        }
    }

    redraw() {
        while(this.svg.firstChild) {
            this.svg.removeChild(this.svg.firstChild);
        }
        this.sizeElements();
        this.createSVGWeb(this.startChode);
    }
}


class Chode {
    constructor(parent, representation, defaults) {
        this.parent = parent;
        this.defaults = defaults;
        this.representation = representation;
        this.showingChildren = true;
        // create a container and elements for the content and other nodes
        this.element = document.createElement('div');
        this.textContent = document.createElement('div');
        this.otherNodes = document.createElement('div');
        // give them class names
        this.element.className = "Chode-div";
        this.textContent.className = "Chode-text";
        this.otherNodes.className = "Chode-other-nodes";
        // append to each other
        this.element.appendChild(this.textContent);
        this.element.appendChild(this.otherNodes);
        //style flexbox floats for node elements
        this.element.style.display = 'flex';
        this.element.style.flexDirection = 'row';
        this.getStylesFromRepresentationOrDefault(representation);

        //subnodes
        this.children = [];
        this.lines = [];

        if(representation.node) {
            for(let i in representation.node) {
                this.children.push(new Chode(this, representation.node[i]));
            }
        } 

        //attach to parent node
        if(parent) {
            this.parent = parent;
            this.parent.otherNodes.appendChild(this.element);
        }

        let that = this;
        this.textContent.addEventListener('click', (ev) => {
            that.toggle();
        })
    }
    toggle() {
        if(this.showingChildren) {
            this.otherNodes.style.display = "none";
            this.showingChildren = false;
            this.mapWeb.scrollTo(this);
            this.mapWeb.redraw();
        }
        else {
            this.otherNodes.style.display = "block";
            this.showingChildren = true;
            this.mapWeb.scrollTo(this);
            this.mapWeb.redraw();
        }
    }
    getRichContent(richContentBody) {
        // let text = '';
        // let newElement = null;
        // for(key in richContentBody) {
        //     if(key == "__text" || "0" ) {
        //         text = richContentBody[key];
        //     } else if(key != 'length') {
        //         newElement = document.createElement(key);
        //         newElement.innerHTML = text;
                
        //     }
        // }

    }
    getStylesFromRepresentationOrDefault(representation) {
        let font = representation["font"];
        let edge = representation["edge"];
        let otherNodes = representation["node"];
        let props = representation['$'];
        if(props["LINK"]) {
            let a = document.createElement('a');
            a.href = props["LINK"];
            a.innerHTML = props["TEXT"] ? props["TEXT"] : "%";
            this.textContent.appendChild(a);
        }
        else {
            this.textContent.innerHTML = props["TEXT"] ? props["TEXT"] : "";
        }
        //is it html
        if(props["richcontent"]) {
            let body = props['richcontent']['body'];
            if(body) {
                // let element = this.getRichContent(body);
            }
        }
        this.textContent.style.whiteSpace = "pre-wrap";
        this.textContent.style.color = props["COLOR"] ? props["COLOR"] : "black";
        this.textContent.style.backgroundColor = props["BACKGROUND_COLOR"] ? props["BACKGROUND_COLOR"] : "white";
        this.textContent.style.maxWidth = props["MAX_WIDTH"] ? props["MAX_WIDTH"] + 'px' : "500px";

        // set font
        if(font) {
            if(Array.isArray(font)) {
                font = font[0];
            }
            this.textContent.style.fontFamily = font["NAME"] ? font["NAME"] + ", Verdana" : "Verdana";
            this.textContent.style.fontSize = font["SIZE"] ? font["SIZE"] + 'px' : "12px";
        }
        this.textContent.style.padding = '5px';

        if(props["STYLE"] == "oval") {
            this.textContent.style.borderRadius = '10px';
        }
        if(props["BORDER_COLOR"]) {
            this.textContent.style.borderColor = props["_BORDER_COLOR"];
        }
        if(props["BORDER_WIDTH"]) {
            this.textContent.style.borderWidth = '2px';
        } else {
            this.textContent.style.borderWidth = '2px';
        }
        if(props["MIN_WIDTH"]) {
            this.textContent.style.minWidth = props["_MIN_WIDTH"] +'px';
        } else {
            this.textContent.style.mindWidth = '100px';
        }

    }
    getStylesFromRepresentationOrInheritFromParent(representation) {
        // apply values to node
        this.textContent.innerHTML = representation["_TEXT"] ? representation["_TEXT"] : "";
        this.textContent.style.color = representation["_COLOR"] ? representation["_COLOR"] : this.parent.textContent.style.color;
        this.textContent.style.backgroundColor = representation["_BACKGROUND_COLOR"] ? representation["_BACKGROUND_COLOR"] : this.parent.textContent.style.backgroundColor;
        this.textContent.style.maxWidth = representation["_MAX_WIDTH"] ? representation["_MAX_WIDTH"] + 'px' : this.parent.textContent.style.maxWidth;
        this.textContent.style.fontFamily = representation["font"][0]["_NAME"] ? representation["font"][0]["_NAME"] + ", Verdana" : this.parent.textContent.style.fontFamily;
        this.textContent.style.fontSize = representation["font"][0]["_SIZE"] + "px" ? representation["font"][0]["_SIZE"] + "px" : this.parent.textContent.style.fontSize;
        this.textContent.style.padding = '5px';

    }
    /**
     * Create lines where x1,y1 are the right end of this node
     * And where each x2, y2 are the left ends of children nodes
     */
    drawLines(mapWeb) {
        let svg = mapWeb.svg;
        this.mapWeb = mapWeb;
        if(this.showingChildren) {
            let x1 = this.textContent.offsetLeft + this.textContent.offsetWidth;
            let y1 = this.textContent.offsetTop + this.textContent.offsetHeight/2;
            for(let i = 0; i < this.children.length; i++ ) {
                let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                if(this.representation["edge"]["_COLOR"]) {
                    line.setAttribute('stroke', this.representation["edge"]["_COLOR"])
                } else {
                    line.setAttribute('stroke', 'black');
                }
                line.setAttribute('strokeWidth', 2);

                let targetElement = this.children[i].textContent;

                let x2 = targetElement.offsetLeft;
                let y2 = targetElement.offsetTop + targetElement.offsetHeight/2;

                // if(y2 < 0 || x2 < 0 || y1 < 0 || x1 < 0) {
                //     console.log('less than 0 val detected')
                //     console.log('svg bb', svg.getBoundingClientRect());
                //     console.log('el1 bb', bb);
                //     console.log('el2 bb', targetbb);
                // }
                line.setAttribute('x1', x1);
                line.setAttribute('x2', x2);
                line.setAttribute('y1', y1);
                line.setAttribute('y2', y2);
                svg.appendChild(line);
            }
        }
    }
}


