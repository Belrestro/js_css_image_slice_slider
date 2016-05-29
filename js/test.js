/* ----- Testing ----- */
slicer.buildGrid(10,10,slicer.getE('.grid')[0]);
var grid = slicer.gridOfElements('img-row','img-col');
var sizeTest = {width:600, height:386};
slicer.splitBackground('images/1.jpg', 'back', grid, sizeTest);
slicer.splitBackground('images/2.jpg', 'front', grid, sizeTest);

// Needs to be testes on good perfomance pc 

/*var size = {width:480, height:270};
splitBackground(grid, 'images/1.gif', size, 'back');
splitBackground(grid, 'images/2.gif', size, 'front');*/
var sidesSwitch = 0;
/* ----- end Testring ---- */
var spinTimes = 0;
function slidePic(direction){
	sidesSwitch = sidesSwitch == 1 ? 0 : 1;
	var querque = grid.length*grid[0].length;
	var turns = 0;
	var progress = {};
	/* Creating a function to hendle transformations */
	function runTransform(cols, times) {
		setTimeout(function(){
			cols.forEach(function(col){
				slicer.setStyles(col, {'transform':'rotateY('+( sidesSwitch == 1 ? (180+(360*spinTimes))+'deg' : '0deg' )+')'})
			});
		}, 100*times);
	}
	/* Seting a cycle to menage querque*/
	switch(direction) {
		case 'top-left' :
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
			break;
		case 'bottom-left':
			var rowNum = grid.length-1; 
			do{
				if(!(progress[rowNum]) && rowNum>=0){
					progress[rowNum] = -1;
					rowNum--;
				}
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
				if(turns>500)
					return;
				turns++;
			} while (querque>0);
			break;
		case 'top-right':
			do{
				if(!(progress[turns]) && turns < grid.length)
					progress[turns] = grid[0].length;
				for(var col in progress){
					if(progress[col]>0)
						progress[col]--;
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
			break;
		case 'bottom-right':
			var rowNum = grid.length-1; 
			do{
				if(!(progress[rowNum]) && rowNum>=0){
					progress[rowNum] = grid[0].length;
					rowNum--;
				}
				for(var col in progress){
					if(progress[col]>0)
						progress[col]--;
					else
						delete progress[col];
				}
				var colsInQuerque = [];
				for (var row in progress) {
					colsInQuerque.push(grid[row][progress[row]]);
				}
				runTransform(colsInQuerque, turns+1);
				querque -= colsInQuerque.length;
				if(turns>400)
					return;
				turns++;
			} while (querque>0);
			break;
	}
	
}
	grid = slicer.gridOfElements('img-row','img-col');
	slicer.getE('#create-grid').addEventListener('click', function(){
	slicer.getE('.grid')[0].innerHTML = '';
	slicer.buildGrid();
	grid = slicer.gridOfElements('img-row','img-col');
	slicer.splitBackground('images/1.jpg','back', grid, sizeTest);
	slicer.splitBackground('images/2.jpg', 'front', grid, sizeTest);
	spinTimes = slicer.getE('#cell-spins').value - 1;
	sidesSwitch = 0;
});
slicer.getE('#run-fromTopLeft').addEventListener('click', function(){slidePic('top-left')});
slicer.getE('#run-fromBottomLeft').addEventListener('click', function(){slidePic('bottom-left')});
slicer.getE('#run-fromTopRight').addEventListener('click', function(){slidePic('top-right')});
slicer.getE('#run-fromBottomRight').addEventListener('click', function(){slidePic('bottom-right')});