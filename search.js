// Expects jQuery and Lodash


/* 
This function takes an array of objects, 
stamps each object onto a lodash template string, 
then places that output into a target_selector jQuery element
or returns the output string if no target_selector is given

example:
showDataList(
	[{x:10,y:10},{x:20,y:5}],
	`<div><%= x %> x <%= y%></div>`,
	'.output'
	);
*/
function showDataList(object_array,template_string,target_selector){
	var output = "";
	var templ = _.template(template_string);
	for(var i in object_array) {
		output += templ(object_array[i]);
	}
	if(!target_selector) return output;
	else $(target_selector).html(output);
}


/*
This function takes an array of objects,
a search_string to search for in each object,
a string of comma separated search_properties in each object to search in,
an optional template_string and target_selector to activate the showDataList function

example:
showDataList(
	[{x:10,y:10},{x:20,y:5}],
	'George',
	'email,name,description',
	`<div><%= x %> x <%= y%></div>`,
	'.output'
	);
*/
function searchDataList(object_array,search_string,search_properties,template_string,target_selector){
	var prop_search = search_properties.split(",");
	var arr = _.filter(object_array,function(obj){
		for(var i in prop_search) {
			return (""+obj[prop_search[i]]).search(RegExp(search_string,'i')) >= 0;
		}
		return false;
	});
	if(template_string === undefined) return arr;
	else if(target_selector === undefined) {
		return showDataList(arr, template_string);
	} else {
		showDataList(arr, template_string, target_selector);
	}
}
