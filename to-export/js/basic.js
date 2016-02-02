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
function setStyles(element, styleSheet){
	var rules = Object.keys(styleSheet);
	rules.forEach(function(propertie){
		element.style[propertie] = styleSheet[propertie];
	});
};