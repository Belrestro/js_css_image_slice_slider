var slicer = {};
(function(exports){
	if(!exports)
		var exports = slicer;
	exports.getE = function (element) {
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
	exports.gridOfElements = function(rowClass, colClass){
		var array = [];
		var rows = exports.getE('.'+rowClass);
		var cols = exports.getE('.'+colClass);
		for(var i=0,a=0;i<rows.length;i++){
			for(;a<((cols.length/rows.length)*(i+1));a++){
				if(!array[i])
					array[i] = [];
				array[i].push(cols[a]);
			}
		}
		return array;
	}
	exports.setStyles = function(element, styleSheet){
		var rules = Object.keys(styleSheet);
		rules.forEach(function(property){
			element.style[property] = styleSheet[property];
		});
	};
	exports.splitBackground = function(imgSrc, side, grid, size){
		var grid = grid || this.grid;
		var size = size || this.size();
		var height = grid.length;
		var width = grid[0].length;
		var colHeight = size.height/height;
		var colWidth = size.width/width;
		for(var i=0,s=0; i<height; i++){
			for( var b=0; b<width; b++){
				exports.setStyles(grid[i][b], {'width':colWidth+'px','height':colHeight+'px'});
				exports.setStyles(slicer.getE('.'+side)[s], {'background-image':'url('+imgSrc+')', 'background-size':size.width+'px '+size.height+'px','background-position':(-(colWidth*(b)))+'px'+' '+(-(colHeight*(i)))+'px'});
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
	exports.buildGrid = function(width, height, parent, rowClass, colClass) {
		//var sides = ['front','back','left','right','top','bottom'];
		var width = width || exports.getE('#grid-x').value;
		width = width > 0 ? width : 1 ;
		var height = height || exports.getE('#grid-y').value;
		height = height > 0 ? height : 1;
		var parent = parent || exports.getE('.grid')[0];
		var rowClass = rowClass || 'img-row';
		var colClass = colClass || 'img-col';
		var sides = ['front', 'back'];
		var rows = document.createElement('div');
		rows.className = 'sliced-image';
		for(var i=0;i<height;i++){
			var row = document.createElement('div');
			row.className = rowClass;
			for(var a=0;a<width;a++){
				var col = document.createElement('div');
				col.className = colClass+' dim';
				for(var s in sides){
					var side = document.createElement('div');
					side.className = sides[s];
					col.appendChild(side);
				}
				row.appendChild(col);
			}
			rows.appendChild(row);
		}
		parent.appendChild(rows);
		parent.grid = exports.gridOfElements(rowClass, colClass);
		parent.size = function(){
			var style = window.getComputedStyle(this, null);
			function numeric(propertie){
				return Number(style.getPropertyValue(propertie).replace('px',''));
			};
			return {width : numeric('width'), height : numeric('height')};
		};
		parent.splitBackground = exports.splitBackground;
	}
})();
