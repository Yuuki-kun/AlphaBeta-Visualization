//file nay ok nay!
addEventListener('resize', function () {
    canvas.width = innerWidth;
    canvas.height = canvas.width / 1.8 - 20;

    // radius = radius = (canvas.width + canvas.height) / 64;
    radius = radius = (canvas.width + canvas.height) / 90;

    // newtyle = (canvas.width + canvas.height) / 96;
    newtyle = (canvas.width + canvas.height) / 116;

    // chieuCaoCacNut = canvas.height / 6;
    chieuCaoCacNut = canvas.height / 10;

    sizeChu = canvas.width / 58;
    tyleDTcatnut = canvas.width / 72;
    tyleChuCatNutX = canvas.width / 29;
    tyleChuCatNutY = canvas.height / 32;
    sizeStroke = canvas.width / 300;
    c.fillStyle = "#838483";
    c.fillRect(0, 0, canvas.width, canvas.height);
    draw(listTree[currentTree]);
    // console.log("size=", sizeStroke);

});

let tyleDTcatnut;
//vi tri x cua chu "alpha" or "beta"
let tyleChuCatNutX;
//vi tri y cua chu "alpha" or "beta"
let tyleChuCatNutY;

let sizeChu;
//ty le khoang cach giua cac nut
let newtyle;
let chieuCaoCacNut;
var hasNoValue = "NOVALUE";
var hasNoParent = null;
var hasNoKey = "NOKEY";



class Node {
    constructor(key = hasNoKey, value = hasNoValue, parent = hasNoParent) {
        this.key = key;
        this.value = value;
        this.parent = parent;
        this.children = [];
        this.x = 0;
        this.y = 0;
        this.tyle = 0;
        this.color = "black";
        this.isCut = false;
        this.isCut2 = false;
        this.isMax = false;
        this.code = undefined;
        this.isMark = false;
        this.nowIsCut = false;
    }
    get isLeaf() {
        return this.children.length == 0;
    }
    get hasChildren() {
        return this.children.length > 0;
    }
}

class Tree {
    constructor(key, value) {
        let rootNode = new Node(key, value);
        this._root = rootNode;
    }

    *preOrder(node = this._root) {
        yield node;
        if (node.children.length) {
            for (let child of node.children)
                yield* this.preOrder(child);
        }
    }

    *postOrder(node = this._root) {
        if (node.children.length) {
            for (let child of node.children)
                yield* this.postOrder(child);
        }
        yield node;
    }

    find(key) {
        for (let node of this.preOrder()) {
            if (key == node.key)
                return node;
        }
        return "NOT FOUND";
    }

    findByName(name) {
        for (let node of this.preOrder()) {
            if (name == node.value)
                return node;
        }
        return "NOT FOUND";
    }

    insert(parentKey, nodeKey, nodeValue = hasNoValue) {
        let parentNode = this.find(parentKey);
        if (parentNode != "NOT FOUND") {
            parentNode.children.push(new Node(nodeKey, nodeValue, parentNode));
        } else {
            throw new Error(`Cannot add node: parent with key ${parentKey} not found!`);
        }
    }

    remove(nodeKey) {
        let node = this.find(nodeKey);
        if (node) {
            let parentNode = node.parent;
            if (parentNode instanceof Node) {
                let indexOfNode = parentNode.children.indexOf(node);
                parentNode.children.splice(indexOfNode, 1);
            } else {
                node.key = hasNoKey;
                node.value = hasNoValue;
            }
        } else {
            throw new Error(`Cannot remove node: node with key ${nodeKey} not found!`);
        }
    }
}

const codeAB = document.getElementById("codeAB");
var callABMax = document.getElementById("callABMax");
var callABMin = document.getElementById("callABMin");
var bestAlpha = document.getElementById("bestAlpha");
var bestBeta = document.getElementById("bestBeta");
var alphaCut = document.getElementById("alphaCut");
var betaCut = document.getElementById("betaCut");
var returnLeaf = document.getElementById("returnLeaf");

var returnBestAlpha = document.getElementById("returnBestAlpha");
var returnBestBeta = document.getElementById("returnBestBeta");

var ab_max_pruning = document.getElementById("ab-max-pruning");
var ab_min_pruning = document.getElementById("ab-min-pruning");


var MAX = "MAX";
var MIN = "MIN";

//insert tree 

// var tree = new Tree(1, 'A');
// tree.insert(1, 2, 'B');
// tree.insert(1, 3, 'C');
// tree.insert(1, 4, 'D');
// tree.insert(2, 5, 'E');
// tree.insert(2, 6, 'F');
// tree.insert(3, 7, 'G');
// tree.insert(4, 8, 'H');
// tree.insert(4, 9, 'I');
// tree.insert(4, 10, 'J');

// tree.insert(5, 11, 7);
// tree.insert(5, 12, 2);

// tree.insert(6, 13, 11);
// tree.insert(6, 14, 12);

// tree.insert(7, 15, 10);
// tree.insert(7, 16, 12);
// tree.insert(8, 17, 3);
// tree.insert(9, 18, 20);
// tree.insert(9, 19, 17);
// tree.insert(9, 20, 8);
// tree.insert(10, 21, 12);
// tree.insert(10, 22, 16);


//tao mang cac tree


class newNode {
    constructor(key, value, isValueOfNodeCha, oldValue, code) {
        this.key = key;
        this.value = value;
        this.isValueOfNodeCha = isValueOfNodeCha;
        this.oldValue = oldValue;
        this.code = code; //string
    }
}

//mang chua cac nut bi cat
var toaDoCacNutBiCat = [];
var alphabetaprunning = [];
//nut bi cat va toa do cac nut bi cat
class NutCat {
    constructor(node, firstXCut, firstYCut, xCut, yCut) {
        this.node = node;
        this.firstXCut = firstXCut;
        this.firstYCut = firstYCut;
        this.xCut = xCut;
        this.yCut = yCut;
    }
}
var hasXY = false;
var lastAlpha;
var lastBeta;
//ve nut bi cat theo toa do x, y
function veNuBiCat(node, firstXCut, firstYCut, xCut, yCut) {

    var toadoX1 = (node.x + firstXCut) / 2;
    var toadoY1 = (node.y + firstYCut) / 2;
    var toadoX2 = (node.x + xCut) / 2;
    var toadoY2 = (node.y + yCut) / 2;
    veDT(toadoX1 - tyleDTcatnut, toadoY1 - radius, toadoX2 + tyleDTcatnut, toadoY2, null);

    //isMax = false có nghĩa là nút đó là min => cha của nó là Max
    hasXY = false;
    if (hasXY == false) {
        var parentx = node.x;
        var parenty = node.y;
        var pparentx = node.parent.x;
        var pparenty = node.parent.y;
        hasXY = true;
    }

    let stringAlpha;
    let stringBeta;

    if (node.value.length > 2 && node.parent.value.length > 2) {
        if (node.isMax) {
            stringAlpha = node.value.substring(2, node.value.length);
            stringBeta = node.parent.value.substring(2, node.parent.value.length);
        } else {
            stringBeta = node.value.substring(2, node.value.length);
            stringAlpha = node.parent.value.substring(2, node.parent.value.length);
        }
    // }
    } else if (node.value.length == undefined || node.parent.value == undefined) {
        // stringAlpha = lastAlpha;
        // stringBeta = lastBeta;
        stringAlpha = null;
        stringBeta = null;
    }
    else {
        if (node.isMax) {
            stringAlpha = node.value;
            stringBeta = node.parent.value;
        } else {
            stringBeta = node.value;
            stringAlpha = node.parent.value;
        }
    }

    if (node.isMax == false && stringAlpha!=null && stringBeta!=null) {
        c.font = sizeChu + "px Arial";
        c.fillStyle = "red";
        c.fillText("alpha-cut", toadoX2 + tyleChuCatNutX, toadoY2 - tyleChuCatNutY);
        c.fillText("beta=" + stringBeta, parentx, parenty - 45);
        c.fillText("alpha=" + stringAlpha, pparentx, pparenty - 45);

        c.fillStyle = "black";
        c.textAlign = "center";
    } else if(node.isMax == true && stringAlpha!=null && stringBeta!=null){
        c.font = sizeChu + "px Arial";
        c.fillStyle = "blue";
        c.fillText("beta-cut", toadoX2 + tyleChuCatNutX, toadoY2 - tyleChuCatNutY);
        c.fillText("alpha=" + stringAlpha, parentx, parenty - 45);
        c.fillText("beta=" + stringBeta, pparentx, pparenty - 45);
        c.fillStyle = "black";
        c.textAlign = "center";
    }

    lastAlpha = stringAlpha;
    lastBeta = stringBeta;

    for (let child of node.children) {
        if (child.isCut == true) {
            nowIsCutOfNode(child, true);
        }
    }

}

//điều kiện để tô đen các nút bị cắt
function nowIsCutOfNode(node, t) {
    if (node == null) return;
    node.nowIsCut = t;
    for (let child of node.children) {
        nowIsCutOfNode(child, t);
    }
}

//mang chua cac nut bi thay doi
var cacNutBiThayDoi = [];

function alphaBeta(node, nodeMode, valueOfParent) {
    let value;
    // console.log("callAB = "+node.value);
    cacNutBiThayDoi.push(new newNode(node.key, node.value, true, node.value, "callAB"));

    if (node.isLeaf) {
        cacNutBiThayDoi.push(new newNode(node.key, node.value, true, node.value, "returnLeaf"));
        return node.value;
    }
    if (nodeMode == "MAX") {

        value = Number.MIN_VALUE;
    } else {
        value = Number.MAX_VALUE;
    }

    for (let child of node.children) {
        if (nodeMode == "MAX") {
            // node.isMax = true;

            value = Math.max(value, alphaBeta(child, MIN, value));
            cacNutBiThayDoi.push(new newNode(node.key, value, false, node.value, "bestAlpha"));

            if (valueOfParent <= value) {
                let tempt = 0;
                for (let i = 0; i < node.children.length; i++) {
                    if (node.children[i] != child && i > 0) {
                        node.children[i].isCut = true;
                        console.log("node=" + node.children[i].value + "code=isCut");
                        // node.children[i].isMax = true;
                        // node.isMax = true;
                        if (tempt == 0) {
                            cacNutBiThayDoi.push(new newNode(node.children[i].key, node.children[i].value, false, node.children[i].value, "alphaCut"));
                            tempt++;
                        }
                    }
                }
                // console.log("nut gi day = " + node.value);
                //nen la nut return value
                //gia tri nut anh em cua nut bi cat?
                cacNutBiThayDoi.push(new newNode(node.key, value, true, node.value));

                return value;
            }
        } else {
            // node.isMax = false;

            value = Math.min(value, alphaBeta(child, MAX, value));
            cacNutBiThayDoi.push(new newNode(node.key, value, false, node.value, "bestBeta"));

            if (valueOfParent >= value) {
                let tempt = 0;
                for (let i = 0; i < node.children.length; i++) {
                    if (node.children[i] != child && i > 0) {
                        node.children[i].isCut = true;
                        // node.children[i].isMax = false;
                        console.log("node=" + node.children[i].value + "code=isCut");

                        // node.isMax = false;
                        if (tempt == 0) {
                            cacNutBiThayDoi.push(new newNode(node.children[i].key, node.children[i].value, false, node.children[i].value, "betaCut"));
                            tempt++;
                        }
                    }
                }
                //nen la nut return value
                // console.log("nut gi day = " + node.value);
                cacNutBiThayDoi.push(new newNode(node.key, value, true, node.value));
                return value
            };
        }
    }
    //gia tri nut goc
    // console.log("GOC = " + node.value);
    cacNutBiThayDoi.push(new newNode(node.key, value, true, node.value, "isBest"));
    return value;
}
// alphaBeta(tree._root, MAX, Number.MAX_VALUE);


// console.log(cacNutBiThayDoi);

//mang chua cac nut tren cay


const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

var sizeStroke = canvas.width / 90;
// console.log("size=", sizeStroke);
canvas.width = innerWidth;
canvas.height = canvas.width / 1.8 - 20;

c.fillStyle = "#838483";
c.fillRect(0, 0, canvas.width, canvas.height);

// var radius = (canvas.width + canvas.height) / 66;
var radius = (canvas.width + canvas.height) / 90;

// newtyle = (canvas.width + canvas.height) / 96;
newtyle = (canvas.width + canvas.height) / 116;

// chieuCaoCacNut = canvas.height / 6;
chieuCaoCacNut = canvas.height / 10;

sizeChu = canvas.width / 58;
tyleDTcatnut = canvas.width / 72;
tyleChuCatNutX = canvas.width / 29;
tyleChuCatNutY = canvas.height / 32;

var sizeCode = 20;
var positionX = 100;
var positionY = 200;
var lineHeight = 21;

var previousLeaf = null;
var isPre = false;

//ve code

function veCode(node) {
    if (node.code == undefined) {
        if (node.isMax) {
            c.clearRect(50, 350, 450, 450);

            // console.log("node = callABMax");

            c.drawImage(returnBestAlpha, 50, 350, 450, 450);
        }
        if (node.isMax == false) {
            c.clearRect(50, 350, 450, 450);

            // console.log("node = callABMin");
            c.drawImage(returnBestBeta, 50, 350, 450, 450);
        }
    }

    if (node.code == "isBest") {
        if (node.isMax) {
            c.clearRect(50, 350, 450, 450);

            // console.log("node = callABMax");

            c.drawImage(returnBestAlpha, 50, 350, 450, 450);
        }
        if (node.isMax == false) {
            c.clearRect(50, 350, 450, 450);

            // console.log("node = callABMin");
            c.drawImage(returnBestBeta, 50, 350, 450, 450);
        }

    }


    if (node.code == "callAB") {
        // console.log("callll AB");
        if (node.isMax) {
            c.clearRect(50, 350, 450, 450);

            // console.log("node = callABMax");

            c.drawImage(callABMax, 50, 350, 450, 450);
        }
        if (node.isMax == false) {
            c.clearRect(50, 350, 450, 450);

            // console.log("node = callABMin");
            c.drawImage(callABMin, 50, 350, 450, 450);
        }
    }


    if (node.code == "bestAlpha") {
        // console.log("node = bestAlpha");
        c.clearRect(50, 350, 450, 450);

        c.drawImage(bestAlpha, 50, 350, 450, 450);
    }
    if (node.code == "bestBeta") {
        // console.log("node = bestBeta");

        c.clearRect(50, 350, 450, 450);

        // c.clearRect(50, 500, 900, 300);
        c.drawImage(bestBeta, 50, 350, 450, 450);
    }
    if (node.code == "returnLeaf") {
        // console.log("reutrnnnnnnnn Leaf")
        c.clearRect(50, 350, 450, 450);
        c.drawImage(returnLeaf, 50, 350, 450, 450);
    }
    if (node.code == "alphaCut") {
        c.clearRect(50, 350, 450, 450);
        c.drawImage(alphaCut, 50, 350, 450, 450);

        // c.clearRect(50, 500, 900, 300);
        // c.drawImage(returnBestAlpha, 50, 500, 900, 300);

    }
    if (node.code == "betaCut") {

        c.clearRect(50, 350, 450, 450);
        c.drawImage(betaCut, 50, 350, 450, 450);

        // c.clearRect(50, 500, 900, 300);
        // c.drawImage(returnBestBeta, 50, 500, 900, 300);

    }
}


//ve cay
function draw(tree) {
    c.clearRect(0, 0, canvas.width, canvas.height);

    // c.clearRect(50, 500, 1000, 300);
    c.fillStyle = "#838483";
    c.fillRect(0, 0, canvas.width, canvas.height);

    // c.drawImage(code2, 500, 500, 400, 300);
    // c.drawImage(code2, 500, 500, 400, 300);
    for (let node of cay) {
        if (node == tree._root) {
            node.x = canvas.width / 2;
            node.y = 75;
            // node.tyle = 20;
            node.tyle = newtyle;
            // addEventListener("resize", function(){
            //     node.tyle = (canvas.width+canvas.height)/99;  
            // })
            ve(node.x, node.y, radius, node.color, node);
            node.color = "black";
            veChu(node.x, node.y, node.value);

            veCode(node);

            //ve cho nut goc
            //tam dong de xem co hoat dong k


            if (node.code == "callAB" && node.code != "isBest") {
                // console.log("callll AB");
                if (node.isMax) {
                    c.clearRect(50, 350, 450, 450);

                    // console.log("AB MAXXXXXX")

                    // c.drawImage(callABMax, 50, 500, 900, 300);
                    c.drawImage(callABMax, 50, 350, 450, 450);


                }
                if (node.isMax == false) {
                    c.clearRect(50, 350, 450, 450);

                    // console.log("AB MINNNN")
                    c.drawImage(callABMin, 50, 350, 450, 450);
                }
            }


            // if (node.code == "bestAlpha" && !isPre) {
            //     c.clearRect(50, 350, 450, 450);

            //     c.drawImage(bestAlpha, 50, 350, 450, 450);
            // }
            // if (node.code == "bestBeta" && !isPre) {
            //     c.clearRect(50, 350, 450, 450);

            //     // c.clearRect(50, 500, 900, 300);
            //     c.drawImage(bestBeta, 50, 350, 450, 450);
            // }
            // if (node.code == "alphaCut") {
            //     console.log("alphaCutttt neeeee");
            //     c.clearRect(50, 350, 450, 450);
            //     c.drawImage(alphaCut, 50, 350, 450, 450);

            //     // c.clearRect(50, 500, 900, 300);
            //     // c.drawImage(returnBestAlpha, 50, 500, 900, 300);

            // }
            // if (node.code == "betaCut") {

            //     console.log("betaCuttttt neeeeeee");
            //     c.clearRect(50, 350, 450, 450);
            //     c.drawImage(betaCut, 50, 350, 450, 450);

            //     // c.clearRect(50, 500, 900, 300);
            //     // c.drawImage(returnBestBeta, 50, 500, 900, 300);

            // }

        }
        for (let i = 0; i < node.children.length; i++) {
            var x;
            var y;
            var soOgiua = Math.floor(node.children.length / 2);

            if (node.children.length % 2 == 0) {

                if (i < soOgiua) {
                    x = node.x + (i - soOgiua) * 10 * node.tyle;
                } else {
                    x = node.x + (i - soOgiua + 1) * 10 * node.tyle;
                }
            } else {
                x = node.x + (i - soOgiua) * 20 * node.tyle;
            }
            node.children[i].x = x;
            node.children[i].y = node.y + chieuCaoCacNut;
            // node.children[i].tyle = node.tyle - 15;
            node.children[i].tyle = node.tyle / 2.5;
            ve(node.children[i].x, node.children[i].y, radius, node.children[i].color, node.children[i]);
            //đặt lại màu viền là đen
            node.children[i].color = "black";
            veChu(node.children[i].x, node.children[i].y, node.children[i].value);
            veDT(node.x, node.y, node.children[i].x, node.children[i].y, node.children[i]);

            for (let nut of toaDoCacNutBiCat) {
                console.log("Cac nut bu cat = "+nut.node.value);
                veNuBiCat(nut.node, nut.firstXCut, nut.firstYCut, nut.xCut, nut.yCut);
            }

        }
    }
}
function ve(x, y, r, color, node) {
    c.beginPath();
    //vẽ màu cho cái vòng màu xanh xung quanh cái nút
    c.strokeStyle = color;
    c.lineWidth = sizeStroke;
    c.arc(x, y, r, 0, Math.PI * 2, false);
    if (node.isMax){
        veChu(canvas.width-60, y, "MAX");
        veChu(50, y, "MAX");

        c.fillStyle = "#60B260";
    }else {
        veChu(50, y, "MIN");
        veChu(canvas.width-60, y, "MIN");
        c.fillStyle = "#99FF99";

    }
    if (node.nowIsCut) {
        c.fillStyle = "#6D6D6D";
    }
    // else c.fillStyle = "#99FF99";


    // if (node.parent.isMax == undefined) {
    //     if (node.parent.parent.isMax) {
    //         c.fillStyle = "#161517";
    //     } else c.fillStyle = "#e8efee";
    // }

    c.fill();
    c.stroke();
    c.closePath();
}
function veChu(x, y, text) {
    c.font = sizeChu + "px Arial";
    c.fillStyle = "black";
    c.fillText(text, x, y + 5);
    c.textAlign = "center";

}
function veDT(x, y, x2, y2, node) {
    c.beginPath();
    if (node == null) {
        c.strokeStyle = "white";

    }

    // else {
    //     if (node.isMax) {
    //         c.strokeStyle = "white";

    //     } else {
    c.strokeStyle = "black";
    // }
    // }

    c.lineWidth = 2;
    c.moveTo(x, y + radius);
    c.lineTo(x2, y2 - radius);
    c.stroke();
    c.closePath();
}

//loop ve cay
var myInterval;
myInterval = setInterval(animate, 1000);

var Interval = {
    interval: myInterval,
    isPause: true
};

var isNext = false;

//bien dem loop qua mang cac nut bi thay doi
let counter = 0;

function animate() {
    if (counter > cacNutBiThayDoi.length) {
        clearInterval(myInterval);
        console.log("CLEARRRRRRR");
    }
    if (!Interval.isPause) {
        veCacNutBiThayDoi();
    }
    // if (counter > cacNutBiThayDoi.length) {
    //     clearInterval(myInterval);
    //     console.log("CLEARRRRRRR");
    // }
}

let XRunning = 0;
let YRunning = 0;


function veCacNutBiThayDoi() {

    // console.log(counter);
    if (counter > cacNutBiThayDoi.length) {
        clearInterval(myInterval);
    }

    var node;
    // if (counter != 0 && counter <= cacNutBiThayDoi.length) {
    if (counter < cacNutBiThayDoi.length) {

        //tìm vị trí các nút bị thay đổi trong cây
        // node = tree.find(cacNutBiThayDoi[counter - 1].key);
        node = listTree[currentTree].find(cacNutBiThayDoi[counter].key);
        if (!node.isCut) {
            XRunning = node.x;
            YRunning = node.y;

        }
        // console.log(node.value, cacNutBiThayDoi[counter].isValueOfNodeCha);
        //thay đổi giá trị của nó và vẽ lại cây
        // node.value = cacNutBiThayDoi[counter - 1].value;

        //xét theo mảng chứa các nút bị thay đổi, nếu nút đó là nút chốt => return cuối trong thuật toán
        //thì tô màu cho nó màu đỏ và gán trị cho nó
        //nếu nó chỉ là giá trị tạm => tô màu cho nó màu xanh
        //nếu nó là max => gán trị >=, ngược lại <=
        if (cacNutBiThayDoi[counter].isValueOfNodeCha) {
            node.value = Math.floor(cacNutBiThayDoi[counter].value);
            if (node.value != 0) {
                node.value = (cacNutBiThayDoi[counter].value);
            }
            console.log("REDDDDDDDDDDDDDD");
            node.color = 'red';

            //cai nay la cai nut dang xet -> nen cai dat no thanh cai vong quay q

        } else {
            if (node.isMax) {
                if (!node.isCut) {
                    node.value = ">=" + Math.floor(cacNutBiThayDoi[counter].value);
                    node.color = 'green';
                    console.log("GRENNNNNNNNNNNN");
                }
            } else {
                if (!node.isCut) {
                    node.value = "<=" + Math.floor(cacNutBiThayDoi[counter].value);
                    node.color = 'green';
                    console.log("GRENNNNNNNNNNNN");
                }

            }
        }

        node.code = cacNutBiThayDoi[counter].code;
        if (node.isMax) {
            // console.log("Max: " + node.code);
        } else {
            // console.log("Min: " + node.code);
        }

        //tìm các con đầu mà nó nhận giá trị => tô màu cho con đó bằng màu xanh
        for (let child of node.children) {
            if (child.value == node.value) {
                child.color = "blue";
                break;
            }
        }

        //cái vòng xanh xanh để biết nó đang đc xét
        // node.color = "green";
        // c.beginPath();
        var veCut = false;
        var xCut = 0;
        var yCut = 0;
        var firstXCut = 0;
        var firstYCut = 0;
        var iii = 0;
        //xét các con bị cắt của node
        //nếu nó là con đầu tiên thì lưu lại để tính toạ độ vẽ đường thẳng
        if (node.isCut) {
            console.log("CUTTTTT " + node.value + "mode=" + node.isMax);

            // console.log("parent=" + node.parent.value);
            // console.log("grandparent=" + node.parent.parent.value); 
            var parentNode = node.parent;
            for (let child of parentNode.children) {
                if (child.isCut == true) {
                    if (iii === 0) {
                        firstXCut = child.x;
                        firstYCut = child.y;
                    }
                    xCut = child.x;
                    yCut = child.y;
                    iii = iii + 1;
                }
            }
            veCut = true;
            // console.log("cut?");
        }
        if (veCut) {
            // console.log("CUTTTTT")
            veNuBiCat(parentNode, firstXCut, firstYCut, xCut, yCut);
            toaDoCacNutBiCat.push(new NutCat(parentNode, firstXCut, firstYCut, xCut, yCut));
            // drawAlphaBetaPrunning(parentNode);
            alphabetaprunning.push(parentNode);
            console.log(ab_max_pruning);
            // c.clearRect(800, 350, 450, 450);

            // // console.log("AB MINNNN")
            // c.drawImage(ab_max_pruning, 800, 350, 450, 450);

        }

    }
    draw(listTree[currentTree]);

    // if (node.code == "isBest") {
    //     // console.log("node = isBest")
    //     c.clearRect(50, 350, 450, 450);
    //     c.drawImage(codeAB, 50, 350, 450, 450);

    // }


    // if (node.code == "callAB") {
    //     // console.log("callll AB");
    //     if (node.isMax) {
    //         c.clearRect(50, 350, 450, 450);

    //         // console.log("node = callABMax");

    //         c.drawImage(callABMax, 50, 350, 450, 450);
    //     }
    //     if (node.isMax == false) {
    //         c.clearRect(50, 350, 450, 450);

    //         // console.log("node = callABMin");
    //         c.drawImage(callABMin, 50, 350, 450, 450);
    //     }
    // }


    // if (node.code == "bestAlpha") {
    //     // console.log("node = bestAlpha");
    //     c.clearRect(50, 350, 450, 450);

    //     c.drawImage(bestAlpha, 50, 350, 450, 450);
    // }
    // if (node.code == "bestBeta") {
    //     // console.log("node = bestBeta");

    //     c.clearRect(50, 350, 450, 450);

    //     // c.clearRect(50, 500, 900, 300);
    //     c.drawImage(bestBeta, 50, 350, 450, 450);
    // }
    // if (node.code == "returnLeaf") {
    //     // console.log("reutrnnnnnnnn Leaf")
    //     c.clearRect(50, 350, 450, 450);
    //     c.drawImage(returnLeaf, 50, 350, 450, 450);
    // }
    // if (node.code == "alphaCut") {
    //     c.clearRect(50, 350, 450, 450);
    //     c.drawImage(alphaCut, 50, 350, 450, 450);

    //     // c.clearRect(50, 500, 900, 300);
    //     // c.drawImage(returnBestAlpha, 50, 500, 900, 300);

    // }
    // if (node.code == "betaCut") {

    //     c.clearRect(50, 350, 450, 450);
    //     c.drawImage(betaCut, 50, 350, 450, 450);

    //     // c.clearRect(50, 500, 900, 300);
    //     // c.drawImage(returnBestBeta, 50, 500, 900, 300);

    // }
    console.log("NODE=" + node.value + " CODE=" + node.code);
    veCode(node);
    if (node.isCut) {
        console.log("NNNNNNN " + node.isMax);
        if (node.isMax) {
            c.clearRect(800, 350, 450, 450);
            c.drawImage(ab_max_pruning, 800, 350, 450, 450);
        }
        else {
            c.clearRect(800, 350, 450, 450);
            c.drawImage(ab_min_pruning, 800, 350, 450, 450);
        }
    }
    // c.clearRect(800, 350, 450, 450);
    // c.drawImage(ab_max_pruning, 800, 350, 450, 450);
    //đi tới nút bị thay đổi tiếp theo
    if (!Interval.isPause || isNext)
        counter += 1;
}
var isPause = true;
var pauseBtn = document.getElementById("pause");
pauseBtn.onclick = function () {
    isPause=!isPause;
    if(isPause){
        pauseBtn.innerHTML = "Play";
    }else{
        pauseBtn.innerHTML = "Pause";
    }
    Interval.isPause = !Interval.isPause;
}
var preBtn = document.getElementById("previous");
//tim vi tri dau cua nut cha
var findFirstIdx;

preBtn.onclick = function () {
    isPre = true;
    Interval.isPause = true;

    //nếu vị trí hiện tại là vị trị cũ của cha nó => trả lại giá trị cũ cho cha nó, và vẽ lại cây
    // c.clearRect(0,0,canvas.width, canvas.height);
    if (counter == findFirstIdx) {

        var node = listTree[currentTree].find(cacNutBiThayDoi[counter].key);

        node.value = cacNutBiThayDoi[counter].oldValue;
        draw(listTree[currentTree]);
        // return;
    }

    var node;
    if (counter < 0) return;
    if (counter > 0) {
        counter -= 1;
        node = listTree[currentTree].find(cacNutBiThayDoi[counter].key);

        console.log("nut=" + node.value);
        console.log("code=" + node.code);


        if (cacNutBiThayDoi[counter].isValueOfNodeCha) {
            node.value = cacNutBiThayDoi[counter].value;
            if (!isNaN(node.value)) node.value = Math.floor(node.value);
            if (!node.isCut) {
                node.color = 'red';
            } else {
                node.color = "black";
            }
        } else {
            if (node.isMax) {
                if (!node.isCut) {
                    node.value = ">=" + Math.floor(cacNutBiThayDoi[counter].value);
                    node.color = 'green';
                }
            } else {
                if (!node.isCut) {
                    node.value = "<=" + Math.floor(cacNutBiThayDoi[counter].value);
                    node.color = 'green';
                }

            }
        }

        node.code = cacNutBiThayDoi[counter].code;

        // veCode(node);

        for (let child of node.children) {
            if (child.value == node.value) {
                child.color = "blue";
            }
        }

        for (let i = 0; i < cacNutBiThayDoi.length; i++) {
            if (cacNutBiThayDoi[i].oldValue == cacNutBiThayDoi[counter].oldValue) {
                findFirstIdx = i;
                break;
            }

        }
        draw(listTree[currentTree]);
        veCode(node);

        //ve code cho cac nut dang xet
        //--------------------------------
        // if (node.code == "isBest") {
        //     console.log("node = isBest")
        //     c.clearRect(50, 350, 450, 450);
        //     c.drawImage(codeAB, 50, 350, 450, 450);

        // }


        // if (node.code == "callAB") {
        //     // console.log("callll AB");
        //     if (node.isMax) {
        //         c.clearRect(50, 350, 450, 450);

        //         console.log("node = callABMax");

        //         c.drawImage(callABMax, 50, 350, 450, 450);
        //     }
        //     if (node.isMax == false) {
        //         c.clearRect(50, 350, 450, 450);

        //         console.log("node = callABMin");
        //         c.drawImage(callABMin, 50, 350, 450, 450);
        //     }
        // }


        // if (node.code == "bestAlpha") {
        //     console.log("node = bestAlpha");
        //     c.clearRect(50, 350, 450, 450);

        //     c.drawImage(bestAlpha, 50, 350, 450, 450);
        // }
        // if (node.code == "bestBeta") {
        //     console.log("node = bestBeta");

        //     c.clearRect(50, 350, 450, 450);

        //     // c.clearRect(50, 500, 900, 300);
        //     c.drawImage(bestBeta, 50, 350, 450, 450);
        // }
        // if (node.code == "returnLeaf") {
        //     console.log("reutrnnnnnnnn Leaf")
        //     c.clearRect(50, 350, 450, 450);
        //     c.drawImage(returnLeaf, 50, 350, 450, 450);
        // }
        // if (node.code == "alphaCut") {
        //     console.log("alphaCutttt");
        //     c.clearRect(50, 350, 450, 450);
        //     c.drawImage(alphaCut, 50, 350, 450, 450);

        //     // c.clearRect(50, 500, 900, 300);
        //     // c.drawImage(returnBestAlpha, 50, 500, 900, 300);

        // }
        // if (node.code == "betaCut") {

        //     console.log("betaCuttttt");
        //     c.clearRect(50, 350, 450, 450);
        //     c.drawImage(betaCut, 50, 350, 450, 450);

        //     // c.clearRect(50, 500, 900, 300);
        //     // c.drawImage(returnBestBeta, 50, 500, 900, 300);

        // }

        ///---------------

    }
    //xoá vết cắt
    // let isFirstChildCut = 0;

    // for (let child of node.children) {
    //     if (child.isCut == true && isFirstChildCut == 0) {
    //         isFirstChildCut += 1;
    //         c.clearRect(0, 0, canvas.width, canvas.height);
    //         node.color = "red";
    //         draw(tree);
    //         toaDoCacNutBiCat.pop();
    //         for (let nut of toaDoCacNutBiCat) {
    //             veNuBiCat(nut.node, nut.firstXCut, nut.firstYCut, nut.xCut, nut.yCut);
    //         }
    //     }
    // }
    // for (let child of node.children) {
    if (node.isCut == true) {

        nowIsCutOfNode(node, false);
        for (let child of node.parent.children) {
            if (child.key > node.key) {
                nowIsCutOfNode(child, false);
            }
        }
        // isFirstChildCut += 1;
        c.clearRect(0, 0, canvas.width, canvas.height);
        // node.color = "red";
        // draw(tree);
        toaDoCacNutBiCat.pop();
        for (let nut of toaDoCacNutBiCat) {
            veNuBiCat(nut.node, nut.firstXCut, nut.firstYCut, nut.xCut, nut.yCut);
        }
        c.fillStyle = "#838483";
        c.fillRect(0, 0, canvas.width, canvas.height);

        draw(listTree[currentTree]);

        // if (node.code == "isBest") {
        //     console.log("node = isBest")
        //     c.clearRect(50, 350, 450, 450);
        //     c.drawImage(codeAB, 50, 350, 450, 450);

        // }


        // if (node.code == "callAB") {
        //     // console.log("callll AB");
        //     if (node.isMax) {
        //         c.clearRect(50, 350, 450, 450);

        //         console.log("node = callABMax");

        //         c.drawImage(callABMax, 50, 350, 450, 450);
        //     }
        //     if (node.isMax == false) {
        //         c.clearRect(50, 350, 450, 450);

        //         console.log("node = callABMin");
        //         c.drawImage(callABMin, 50, 350, 450, 450);
        //     }
        // }


        // if (node.code == "bestAlpha") {
        //     console.log("node = bestAlpha");
        //     c.clearRect(50, 350, 450, 450);

        //     c.drawImage(bestAlpha, 50, 350, 450, 450);
        // }
        // if (node.code == "bestBeta") {
        //     console.log("node = bestBeta");

        //     c.clearRect(50, 350, 450, 450);

        //     // c.clearRect(50, 500, 900, 300);
        //     c.drawImage(bestBeta, 50, 350, 450, 450);
        // }
        // if (node.code == "returnLeaf") {
        //     console.log("reutrnnnnnnnn Leaf")
        //     c.clearRect(50, 350, 450, 450);
        //     c.drawImage(returnLeaf, 50, 350, 450, 450);
        // }
        if (node.code == "alphaCut") {
            console.log("alphaCutttt neeeee");
            c.clearRect(50, 350, 450, 450);
            c.drawImage(alphaCut, 50, 350, 450, 450);

            // c.clearRect(50, 500, 900, 300);
            // c.drawImage(returnBestAlpha, 50, 500, 900, 300);

        }
        if (node.code == "betaCut") {

            console.log("betaCuttttt neeeeeee");
            c.clearRect(50, 350, 450, 450);
            c.drawImage(betaCut, 50, 350, 450, 450);

            // c.clearRect(50, 500, 900, 300);
            // c.drawImage(returnBestBeta, 50, 500, 900, 300);

        }
        // draw(listTree[currentTree]);


    }

    // }
}
var nextBtn = document.getElementById("next");
nextBtn.onclick = function () {
    isPre = false;
    Interval.isPause = true;
    isNext = true;
    veCacNutBiThayDoi();
}

// console.log(cacNutBiThayDoi);

let cay = [];
let cayI = 0;

var nodeIsMax = true;

var listTree = [];
var currentTree = -1;
function addFromFile() {
    var root = null;
    var parent = null;
    var key = 1;
    var newTreeFromFile;
    var lastNewLine = 0;
    var keyOfLastParent = 1;
    let number = "";
    const [file] = document.getElementById("loadFromFile").files;
    const reader = new FileReader();

    reader.addEventListener(
        "load",
        () => {
            let stringText = reader.result;
            let hasnoroot = true;
            for (let i = 0; i <= stringText.length; i++) {
                // console.log(stringText[i]);
                if (stringText[i] == "\n" || i == stringText.length) {
                    let stringValue = stringText.substring(lastNewLine, i);
                    lastNewLine = i + 1;
                    console.log(stringValue);
                    let StringSplited = stringValue.split(" ");
                    console.log(StringSplited);
                    if (hasnoroot) {
                        // root = parseInt(StringSplited[0]);
                        root = StringSplited[0];
                        // console.log(StringSplited[0]);
                        // console.log("root="+root);
                        newTreeFromFile = new Tree(key, root);
                        var node = newTreeFromFile.find(key);
                        node.isMax = true;
                        key += 1;
                        hasnoroot = false;
                    }
                    // parent = parseInt(StringSplited[0]);
                    parent = StringSplited[0];

                    if (parent != root) {
                        keyOfLastParent = newTreeFromFile.findByName(parent).key;
                        var node = newTreeFromFile.find(keyOfLastParent);
                        // node.isMax=!nodeIsMax;
                    }
                    for (let y = 1; y < StringSplited.length; y++) {
                        newTreeFromFile.insert(keyOfLastParent, key, (StringSplited[y]));
                        var node = newTreeFromFile.find(key);

                        if (node.parent != null) {
                            console.log(node.parent.value, "=" + node.parent.isMax);
                            node.isMax = !node.parent.isMax;

                        }
                        console.log("node=" + node.value + "ismax=" + node.isMax);

                        key += 1;
                        console.log(StringSplited[y]);
                        console.log("---------------")
                    }
                    // console.log("\\\\nnnnn")

                }

            }

            console.log(newTreeFromFile);
            listTree.push(newTreeFromFile);
            currentTree += 1;
            console.log(listTree[currentTree]);

            [...listTree[currentTree].preOrder()].map(x => {
                cay[cayI] = x;
                cayI += 1;
            });

            draw(listTree[currentTree]);
            c.clearRect(50, 350, 450, 450);
            c.drawImage(codeAB, 50, 350, 450, 450);
            alphaBeta(listTree[currentTree]._root, MAX, Number.MAX_VALUE);
        },
        false
    );

    if (file) {
        reader.readAsText(file);
    }
}

var isDone = false;
var isHasRoot = false;

var root;
var parent;
var child;
var newTree;
var key = 1;
var parentField = document.getElementById("parentText");
var childField = document.getElementById("childrenText");

function addNew() {
    cay=[];
    cayI=0;
    c.clearRect(0, 0, canvas.width, canvas.height);

    c.fillStyle = "#838483";
    c.fillRect(0, 0, canvas.width, canvas.height);
    document.getElementById("addText").style.display = "block";
    document.getElementById("showAddBtn").style.display = "none";
    isDone = false;
    isHasRoot = false;
}

function done() {
    isDone = true;
    document.getElementById("addText").style.display = "none";
    document.getElementById("showAddBtn").style.display = "block";

    c.fillStyle = "#838483";
    c.fillRect(0, 0, canvas.width, canvas.height);
    if (isDone) {
        listTree.push(newTree);
        currentTree += 1;
        cayI = 0;
        cay = [];
        [...listTree[currentTree].preOrder()].map(x => {
            cay[cayI] = x;
            cayI += 1;
        });
        draw(listTree[currentTree]);
        c.clearRect(50, 350, 450, 450);
        c.drawImage(codeAB, 50, 350, 450, 450);
        // alphaBeta(newTree._root, MAX, Number.MAX_VALUE);
        alphaBeta(listTree[currentTree]._root, MAX, Number.MAX_VALUE);
        console.log(listTree[currentTree]);
        console.log(cacNutBiThayDoi);
    }
}
function addNewNode() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = "#838483";
    c.fillRect(0, 0, canvas.width, canvas.height);
    if (!isHasRoot) {
        console.log("!isHasroot?");
        root = childField.value;
        console.log(childField.value);
        newTree = new Tree(1, root);
        isHasRoot = true;
        key += 1;
        newTree._root.isMax = true;
    } else {
        console.log("isHasroot?");

        parent = parentField.value;
        child = childField.value;
        var node = newTree.findByName(parent);
        newTree.insert(node.key, key, child);
        var childnode = newTree.find(key);
        childnode.isMax = !childnode.parent.isMax;
        key += 1;

    }
    [...newTree.preOrder()].map(x => {
        cay[cayI] = x;
        cayI += 1;
    });
    draw(newTree);
    c.clearRect(50, 350, 450, 450);
    c.drawImage(codeAB, 50, 350, 450, 450);
}
