// Expects jQuery and Lodash

function showData(arr,template_string,target){
	var output = "";
	var templ = _.template(template_string);
	for(var i in arr) {
		output += templ(arr[i]);
	}
	if(!target) return output;
	else $(target).html(output);
}

function searchData(data,search_str,props,template_string,target){
	var prop_search = props.split(",");
	// predicate
	var arr = _.filter(data,function(obj){

		for(var i in prop_search) {
			if((""+obj[prop_search[i]]).search(
			RegExp(search_str,'i')
			) != -1) return true;
		}

		return false;
	});
	showData(
		arr,
		template_string,
		target
		)
}
