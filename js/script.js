function getE(element) {
	var selector = element.charAt(0);
	var query = element.slice(1);
	if(selector=="#") {
		return document.getElementById(query);
	} else if(selector==".") {
		return document.getElementsByClassName(query);
	} else {
		return document.getElementsByTagName(element);
	}
}
function buildGrid(width, height, parent) {
	//var sides = ['front','back','left','right','top','bottom'];
	var sides = ['front', 'back'];
	var rows = document.createElement('div');
	rows.className = 'sliced-image';
	for(var i=0;i<height;i++){
		var row = document.createElement('div');
		row.className = 'img-row';
		for(var a=0;a<width;a++){
			var col = document.createElement('div');
			col.className = 'img-col dim';
			for(var b=0;b<6;b++){
				var side = document.createElement('div');
				side.className = sides[b];
				col.appendChild(side);
			}
			row.appendChild(col);
		}
		rows.appendChild(row);
	}
	parent.appendChild(rows);
}
function gridOfElements(rowClass, colClass){
	var array = [];
	var rows = getE('.'+rowClass);
	var cols = getE('.'+colClass);
	for(var i=0,a=0;i<rows.length;i++){
		for(;a<((cols.length/rows.length)*(i+1));a++){
			if(!array[i])
				array[i] = [];
			array[i].push(cols[a]);
		}
	}
	return array;
}
function setStyles(element, styleSheet){
	var rules = Object.keys(styleSheet);
	rules.forEach(function(propertie){
		element.style[propertie] = styleSheet[propertie];
	});
};
function splitBackground(grid, imgSrc, size, side){
	var height = grid.length;
	var width = grid[0].length;
	var colHeight = size.height/height;
	var colWidth = size.width/width;
	for(var i=0,s=0; i<height; i++){
		for( var b=0; b<width; b++){
			setStyles(grid[i][b], {'width':colWidth+'px','height':colHeight+'px'});
			setStyles(getE('.'+side)[s], {'background-image':'url('+imgSrc+')', 'background-size':size.width+'px '+size.height+'px','background-position':(-(colWidth*(b)))+'px'+' '+(-(colHeight*(i)))+'px'});
			s++;
		}
	}
	// --- 3d Box - in development
	/*var sides = {'front':'rotateY(0deg)','back':'rotateX(180deg)','left':'transform: rotateY(-90deg)','right':'rotateY(90deg)','top':'rotateX(90deg)','bottom':'rotateX(-90deg)'};
	for(var side in sides){
		document.styleSheets[1].insertRule('.img-col.dim .'+side+'{transform: '+sides[side]+' translateZ('+colHeight+'px);}',0);
	}
	console.log(document.styleSheets[1]);*/
}

/* ----- Testing ----- */
buildGrid(12,12,getE('.grid')[0]);
var grid = gridOfElements('img-row','img-col');
var size = {width:600, height:386};
splitBackground(grid, 'images/1.jpg', size, 'back');
splitBackground(grid, 'images/2.jpg', size, 'front');

// Needs to be testes on good perfomance pc 

/*var size = {width:480, height:270};
splitBackground(grid, 'images/1.gif', size, 'back');
splitBackground(grid, 'images/2.gif', size, 'front');*/
var sidesSwitch = 0;
/* ----- end Testring ---- */

function rotateXYZ(){
	var x = getE('#rotate-X').value;
	var y = getE('#rotate-Y').value;
	var z = getE('#rotate-Z').value;
	grid.forEach(function(row){
		row.forEach(function(col){
			setStyles(col, {'transform':'rotateX('+x+'deg) rotateY('+y+'deg) rotateZ('+z+'deg)'});
		});
	});
}
function fromTopLeft(){
	sidesSwitch = sidesSwitch == 1 ? 0 : 1;
	var querque = grid.length*grid[0].length;
	var turns = 0;
	var progress = {};
	/* Creating a function to hendle transformations */
	function runTransform(cols, times) {
		setTimeout(function(){
			cols.forEach(function(col){
				setStyles(col, {'transform':'rotateY('+( sidesSwitch == 1 ? '180deg' : '0deg' )+')'})
			});
		}, 100*times);
	}
	/* Seting a cycle to menage querque*/
	do{
		if(!(progress[turns]) && turns < grid.length)
			progress[turns] = -1;
		for(var col in progress){
			if(progress[col] < grid[0].length-1)
				progress[col]++;
			else
				delete progress[col];
		}
		var colsInQuerque = [];
		for (var row in progress) {
			colsInQuerque.push(grid[row][progress[row]]);
		}
		runTransform(colsInQuerque, turns+1);
		querque -= colsInQuerque.length;
		turns++;
	} while (querque>0);
}
getE('#run-fromTopLeft').addEventListener('click', fromTopLeft);