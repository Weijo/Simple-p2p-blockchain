// block class
class Block {
    constructor(index, timestamp, cont, hash, prevHash) {
        this.x = circles[index].x;
        this.y = circles[index].y;
        this.index = index;
        this.timestamp = timestamp;
        this.cont = cont;
        this.hash = hash;
        this.prevHash = prevHash;
        this.radius = circles[index].r;
        this.diameter = this.radius * 2;
        this.over = false;
    }

    // Check if mouse is over the block
    rollover(px, py) {
        let d = dist(px, py, this.x, this.y);
        this.over = d < this.radius;
    }

    // Display the block
    display() {
        stroke(0);
        strokeWeight(0.8);
        noFill();
        textAlign(CENTER);
        ellipse(this.x, this.y, this.diameter, this.diameter);
        vertex(this.x, this.y);
        text(this.index, this.x, this.y-this.radius/3);
        if (this.over) {
        let showItems = {
            "Index:": this.index, 
            "Time:": this.timestamp, 
            "Data:": this.cont, 
            "Hash:": this.hash, 
            "Previous Hash:": this.prevHash
            };
            let count = 0;
            for (var key in showItems) {
                text(key+" "+showItems[key], width/2, height-80+count*15);
                count++;
            }
        }
    }
}

let data = {}; // Global object to hold results from the loadJSON call
let blocks = []; // Global array to hold all block Objects
var circles = []; // Global array to hold all coordinates of non-overlapping circles

// Put any asynchronous data loading in preload to complete before "setup" is run
function preload() {
    data = json;
}

// Convert saved block data into block Objects
function loadData() {
    let blockData = JSON.parse(data);
    for (let i = 0; i < Object.keys(blockData).length; i++) {
        // Get each object in the array
        let block = blockData[i];
        appendData(block);
    }
}

// Appends JSON data from XMLHttpRequest
function appendData(responseData) {
    // Get hash, previousHash from block
    let hash = responseData['Hash'];
    let prevHash = responseData['PrevHash'];

    // Get index and timestamp and data
    let index = responseData['Index'];
    let timestamp = responseData['Timestamp'];
    let cont = responseData['Data'];

    // Put object in array
    if (index == blocks.length) {
        blocks.push(new Block(index, timestamp, cont, hash, prevHash));
    } else {
        location.reload();
    }
}

// Sanitize input value
String.prototype.stripSlashes = function(){
    return this.replace(/\\(.)/mg, "$1");
}

// Create a new block each time the button is clicked.
function click() {
    var http = new XMLHttpRequest();
    var url = 'http://localhost:'+port+'/';
    
    // Check for none input
    if (input.value().length == 0) {
        alert("No input given!");
        return;
    }
    
    var params = '{"Data":"'+input.value().stripSlashes()+'"}';
    http.open('POST', url, true);

    //Send the proper header information along with the request
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == XMLHttpRequest.DONE) {
            appendData(JSON.parse(http.responseText));
        }
    }
    http.send(params);
}

// Circle packing algorithm
function loadCircles() {
    // Lets make sure we don't get stuck in infinite loop
    var protection = 0;

    // Try to get to 500
    while (circles.length < 500) {
        // Pick a random circle
        var circle = {
            x: random(100, width-100),
            y: random(100, height-100),
            r: random(40,80)/2.0
        };

        // Does it overlap any previous circles?
        var overlapping = false;
        for (var j = 0; j < circles.length; j++) {
            var other = circles[j];
            var d = dist(circle.x, circle.y, other.x, other.y);
            if (d < circle.r + other.r) {
                overlapping = true;
            }
        }

        // If not keep it!
        if (!overlapping) {
            circles.push(circle);
        }

        // Are we stuck?
        protection++;
        if (protection > 10000) {
            break;
        }
    }
}

// Creates canvas on browser window
function setup() {
    createCanvas(windowWidth, windowHeight);

    // Handles inputs
    input = createInput();
    input.position(width/2-150,30);
    button = createButton("Post to BlockChain");
    button.position(input.x + input.width, 30);
    button.mousePressed(click);

    loadCircles();
    loadData();
}

function draw() {
    background(255);

    rect(width/2-255, height-94, 510, 80);
    beginShape();
    // Display all blocks
    for (let i = 0; i < blocks.length; i++) {
        blocks[i].display();
        blocks[i].rollover(mouseX, mouseY);
    }
    endShape();
}
