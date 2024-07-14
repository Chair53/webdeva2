// JavaScript source code

/* Global variables */
//target all elements to save to constants
const mobile = window.innerWidth <= 800;
var colourNow = "purple"; //"pink" "blue"
if (mobile) {
    document.querySelector("h3+ul").classList.add("collapsed");
}
const settingsbtn = document.querySelector("#settings img");
settingsbtn.addEventListener("click", function () {
    document.querySelector("#options").classList.toggle("collapsed");
    document.querySelector("#options").classList.toggle("collapsable");
})
const colourables = document.querySelectorAll(".colourable");
//Setting up things for form
for (let colourable of colourables) {
    colourable.classList.add(colourNow);
}
const colourInputs = document.querySelectorAll("#theme input");
for (let input of colourInputs)
    input.addEventListener("change", changeTheme);
function changeTheme() {
    var prev = colourNow;
    for (let input of colourInputs) {
        if (input.checked) {
            colourNow = input.value;
            break;
        }
    }
    for (let colourable of colourables) {
        colourable.classList.remove(prev);
        colourable.classList.add(colourNow);
    }
}

const page1btn = document.querySelector("#page1btn");
const page2btn = document.querySelector("#page2btn");
const page3btn = document.querySelector("#page3btn");
var allpages = document.querySelectorAll(".page");
//JS for home button
const homeButton = document.querySelector("footer>button");
//JS for hamMenu
const hamBtn = document.querySelector("#hamIcon");
const menuItemsList = document.querySelector("nav ul");
//Page 1 variables
const sections = allpages[1].querySelectorAll("h3");
//Page 3 variables
const dimension = 4;
const board = document.querySelector("#board");
const cells = document.querySelectorAll(".cell");
var lefts = [];
var tops = [];
var size;
var gameOverInt;
class block {
    constructor(element, x, y, value) {
        this.element = element;
        element.addEventListener("transitionstart", disableKeyboard);
        element.addEventListener("transitionend", updateBlock);
        this.x = x;
        this.y = y;
        this.currX = x;
        this.currY = y;
        this.value = value;
        this.currValue = value;
    }
    setPos(dirX, dirY) {
        if (dirX > 0)
            this.x = Math.min(this.x + dirX, dimension - 1);
        else if (dirX < 0)
            this.x = Math.max(0, this.x + dirX);
        if (dirY > 0)
            this.y = Math.min(this.y + dirY, dimension - 1);
        else if (dirY < 0)
            this.y = Math.max(0, this.y + dirY);
    }
    move() {
        this.element.style.left = lefts[this.x] + "px";
        this.element.style.top = tops[this.y] + "px";
        this.currX = this.x;
        this.currY = this.y;
    }
    selfSize() {
        this.element.style.height =
            this.element.style.width = size + "px";
        this.element.style.left = lefts[this.currX] + "px";
        this.element.style.top = tops[this.currY] + "px";
    }
}
var blocks = [];
/* End global variables */

/* Event listeners */
/*Listen for clicks on the buttons, assign anonymous
eventhandler functions to call show function*/
page1btn.addEventListener("click", function () {
    show(1);
});
page2btn.addEventListener("click", function () {
    show(2);
});
page3btn.addEventListener("click", function () {
    show(3);
});
homeButton.addEventListener("click", function () {
    show(0);
});

hamBtn.addEventListener("click", function () {
    document.querySelector("h3+ul").classList.toggle("collapsed");
    document.querySelector("h3+ul").classList.toggle("collapsable");
});

//Page 1 listeners
for (let section of sections) {
    //Make collapsable
    section.addEventListener("click", function () {
        section.nextElementSibling.classList.toggle("collapsed");
    });
}
/* End event listeners */

show(0);
function showHide(element, forceHide = false, forceShow = false) {
    if (forceHide) {
        if (element.classList.contains("showBlock")) {
            element.classList.remove("showBlock");
            if (!element.classList.contains("hideBlock"))
                element.classList.add("hideBlock");
        }
        else if (element.classList.contains("showFlex")) {
            element.classList.remove("showFlex");
            if (!element.classList.contains("hideFlex"))
                element.classList.add("hideFlex");
        }
    }
    else if (forceShow) {
        if (element.classList.contains("hideBlock")) {
            element.classList.remove("hideBlock");
            if (!element.classList.contains("showBlock"))
                element.classList.add("showBlock");
        }
        else if (element.classList.contains("hideFlex")) {
            element.classList.remove("hideFlex");
            if (!element.classList.contains("showFlex"))
                element.classList.add("showFlex");
        }
    }
    else {
        if (element.classList.contains("showBlock")
            || element.classList.contains("hideBlock")) {
            element.classList.toggle("showBlock");
            element.classList.toggle("hideBlock");
        }
        else if (element.classList.contains("showFlex")
            || element.classList.contains("hideFlex")) {
            element.classList.toggle("showFlex");
            element.classList.toggle("hideFlex");
        }
    }
}
function hideall() { //function to hide all pages
    for (let onepage of allpages) { //go through all subtopic pages
        showHide(onepage, true);
    }
    resetPg1();
    resetPg3();
    resetPg2();
}
function show(pgno) { //function to show selected page no
    hideall();
    //move the title to the header
    var title = document.querySelector("#title");
    if (pgno != 0) {
        document.querySelector("#page0").removeChild(title);
        document.querySelector("header").appendChild(title);
        if (!document.querySelector("#pagecontainer").classList.contains("autoMargin"))
            document.querySelector("#pagecontainer").classList.add("autoMargin");
    }
    else {
        document.querySelector("header").removeChild(title);
        document.querySelector("#page0").insertBefore(title, document.querySelector("h2"));
        if (document.querySelector("#pagecontainer").classList.contains("autoMargin"))
            document.querySelector("#pagecontainer").classList.remove("autoMargin");
    }
    showHide(document.querySelector("header"));
    showHide(document.querySelector("footer"));
    //select the page based on the parameter passed in
    let onepage = document.querySelector("#page" + pgno);
    //show the page
    showHide(onepage);

    //setup the page
    if (pgno == 1) {
        alignPg1();
        window.addEventListener("resize", alignPg1);
    }
    else if (pgno == 3) {
        sizePg3();
        window.addEventListener("resize", sizePg3);
        enableKeyboard();
        gameWinLose();
    }
    else if (pgno == 2) {
        sizePg2Grid();
        window.addEventListener("resize", sizePg2Grid);
    }
}


function alignPg1() {
    for (let section of sections) {
        var divEle = section.nextElementSibling;
        var pEles = divEle.querySelectorAll("p");
        pEles[0].style.height = pEles[1].style.height = "unset";
        pEles[0].style.height = pEles[1].style.height =
            Math.max(pEles[0].offsetHeight, pEles[1].offsetHeight) + "px";
    }
}
function resetPg1() {
    //uncollapse everything
    for (let section of allpages[1].querySelectorAll("h3"))
        showHide(section.nextElementSibling, false, true);
    //remove unneeded listener
    window.removeEventListener("resize", alignPg1);
}

function sizePg3() {
    size = cells[0].getBoundingClientRect().height;
    for (var col = 0, row = (dimension - 1) * dimension;
        col < dimension; col++, row -= dimension) {
        var rect = cells[col].getBoundingClientRect();
        lefts[col] = rect.left;
        rect = cells[row].getBoundingClientRect();
        tops[col] = rect.top;
    }
    for (let b of blocks)
        b.selfSize();
}
function resetPg3() {
    window.removeEventListener("resize", sizePg3);
    dir = [0, 0];
    clearInterval(gameOverInt);
    resetGame();
}
function updateBlock(e) {
    //find the block
    for (let b of blocks) {
        if (e.target == b.element) {
            //check for merging
            if (b.currValue != b.value) {
                b.currValue = b.value;
                //update the image
                var img = b.element.querySelector("img");
                img.src = "img/" + Math.min(b.currValue, 2048) + ".jpg";
                img.alt = "value " + b.currValue;

                for (let otherB of blocks) {
                    if (otherB != b
                        && otherB.x == b.x && otherB.y == b.y
                        && otherB.value < b.value) {
                        b.element.style.zIndex = "unset";
                    }
                }
            }
            enableKeyboard();
        }
    }

    var del = document.querySelectorAll(".deleteBlock");
    for (var i = del.length - 1; i >= 0; i--) {
        for (let b of blocks)
            if (b.element == del[i])
                blocks = blocks.filter(function (thing) {
                    return thing.element != del[i];
                })
        del[i].remove();
    }
}

function gameWinLose() {
    gameOverInt = setInterval(function () {
        //check for game over
        //are all cells filled?
        var lose = blocks.length >= dimension * dimension;
        console.log("1: " + lose);
        if (lose) {
            //do any blocks have adjacent identical values?
            for (let b of blocks) {
                for (let otherB of blocks) {
                    if (b == otherB)
                        continue;
                    if (b.value == otherB.value
                        && ((Math.abs(b.x - otherB.x) == 1 && otherB.y == b.y)
                            || (Math.abs(b.y - otherB.y) == 1 && otherB.x == b.x))) {
                        console.log(b);
                        console.log(otherB);
                        lose = false;
                        break;
                    }
                }
            }
        }
        console.log("2: " + lose);

        if (lose)
            console.log("lose");
    })
}

//align button texts
document.addEventListener("resize", formatButtons);
function formatButtons(){
    /*var buttons = document.querySelectorAll(".button");
    var lineHeight = buttons[0].offsetHeight;
    lineHeight *= 0.9;
    for(let button of buttons)
        button.nextElementSibling.style.lineHeight = lineHeight + "px";*/
}
formatButtons();

//Game
var dir = [0, 0];
function disableKeyboard() {
    document.removeEventListener("keyup", onInput);

}
function enableKeyboard() {
    document.addEventListener("keyup", onInput);
}

function createBlock(value, x, y) {
    var ele = document.createElement("div");
    ele.style.left = lefts[x] + "px";
    ele.style.top = tops[y] + "px";
    ele.classList.add("block");
    var img = document.createElement("img");
    img.src = "img/" + Math.min(value, 2048) + ".jpg";
    img.alt = "value " + value;
    ele.appendChild(img);
    allpages[3].appendChild(ele);
    blocks.push(new block(ele, x, y, value));
    ele.style.height = ele.style.width = size + "px";
}
function onInput(e) {
    //get input direction
    dir = handleInput(e);
    if (dir == [0, 0])
        return;

    //check if cannot move
    var stuck = true;
    for (let b of blocks) {
        if (b.x + dir[0] < 0 || b.x + dir[0] >= dimension || b.y + dir[0] < 0 || b.y + dir[1] >= dimension)
            continue;
        var next = blockAt(b.x + dir[0], b.y + dir[1]);
        if (next == null || next.value == b.value) {
            stuck = false;
            break;
        }
    }
    if (stuck)
        return;

    var rowStart, colStart;
    var rowIt = -dir[1];
    var colIt = -dir[0];
    //move right: check row 0 -> 3, col 2 -> 0
    if (dir[0] > 0)
        colStart = dimension - 2;
    //move left: check row 0 -> 3, col 1 -> 3
    else if (dir[0] < 0)
        colStart = 1;
    else {
        colStart = 0;
        colIt = 1;
    }
    //move up: check row 2 -> 0, col 0 -> 3
    if (dir[1] > 0)
        rowStart = dimension - 2;
    //move down: check row 1 -> 3, col 0 -> 3
    else if (dir[1] < 0)
        rowStart = 1;
    else {
        rowStart = 0;
        rowIt = 1;
    }

    //set new positions
    var col = colStart;
    var row = rowStart;
    while (col >= 0 && col < dimension && row >= 0 && row < dimension) {
        if (blockAt(col, row) != null)
            moveBlock(blockAt(col, row));
        row += rowIt;
        if (row < 0 || row >= dimension) {
            row = rowStart;
            col += colIt;
        }
    }
    //move the blocks
    for (let b of blocks)
        b.move();

    //spawn new block at random empty position
    var emptyCells = [];
    for (var i = 0; i < dimension; i++) {
        for (var j = 0; j < dimension; j++) {
            if (blockAt(j, i) == null)
                emptyCells.push([j, i]);
        }
    }
    if (emptyCells.length > 0) {
        var idx = Math.floor(Math.random() * emptyCells.length);
        var newValue = Math.floor(Math.random() * 3) + 1;
        newValue = Math.pow(2, newValue);
        createBlock(newValue, emptyCells[idx][0], emptyCells[idx][1]);
    }
}
function handleInput(e) {
    if (e.key == ("ArrowLeft") || e.key == ("a"))
        return [-1, 0];
    else if (e.key == ("ArrowRight") || e.key == ("d"))
        return [1, 0];
    else if (e.key == ("ArrowUp") || e.key == ("w"))
        return [0, 1];
    else if (e.key == ("ArrowDown") || e.key == ("s"))
        return [0, -1];
    else
        return [0, 0];
}
function blockAt(x, y) {
    //want to return greatest value block
    var v = [];
    for (let b of blocks)
        if (b.x == x && b.y == y)
            v.push(b);
    //no blocks at position
    if (v.length < 1)
        return null;
    else {
        var v2 = v[0];
        for (let b of v) {
            if (b.value >= v2.value)
                v2 = b;
        }
        return v2;
    }
}

function moveBlock(block) {
    //keep checking until block at edge or next block cannot merge
    while (block.x + dir[0] >= 0 && block.x + dir[0] < dimension
        && block.y + dir[1] >= 0 && block.y + dir[1] < dimension) {
        var next = blockAt(block.x + dir[0], block.y + dir[1]);
        //next one is empty --> just move
        if (next == null)
            block.setPos(dir[0], dir[1]);
        //next one not same value --> end
        else if (next.value != block.value)
            break;
        //next one same value --> merge
        else {
            //increase this block's value
            block.value += block.value;
            //set this block to the top most
            block.element.style.zIndex = block.value;
            //mark other block for deletion
            next.element.classList.add("deleteBlock");
            //move it on top of the next block
            block.setPos(dir[0], dir[1]);
        }
    }
}
function startGame() {
    createBlock(2, 0, 1);
    createBlock(2, 1, 1);
}
function resetGame() {
    blocks = [];
    var eles = document.querySelectorAll(".block");
    for (let ele of eles)
        ele.remove();
    startGame();
}

//page 2
const animGrids = document.querySelectorAll(".animGrid");
const clouds = document.querySelectorAll(".cloud");
for (var i = 0; i < clouds.length; i++) {
    var cloud = clouds[i];
    cloud.style.gridArea = "2/" + (i + 2) + "/3/" + (i + 3);
    cloud.style.animationName = "cloud" + i;
}
function sizePg2Grid() {
    for (let grid of animGrids) {
        grid.style.height = grid.querySelector(".stainedCup").offsetHeight + "px";
    }
}
function resetPg2() {
    window.removeEventListener("resize", sizePg2Grid);
}