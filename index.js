
$('document').ready(function(){
	console.log('hi')
	$('.ui.accordion').accordion();
	$('input').keypress(function(e){
		$('#class_list').css({"display": "block"});
		if (!$('input').val()){
			$('#class_list').css({"display": "None"});
		}
	});
});

function searchCourses(data, search, callback) {
	var course_list=[]
	console.log(data[1])
	var i
	for(i=0; i<data.length; i++){
		if( data[i]['title'].search(new RegExp(search, "i")) != -1 ){
			console.log(data[i]['title'])
			course_list.push(data[i]);
		}
	}
	if(course_list.length === 0) {
		alert("no courses found")
	} else {
		console.log(course_list)
		callback(course_list)
	}
}

function getName(course) {
	if (course['topic'] != null){
		return course['topic']
	} else {
		return course['title']
	}
}

function getDesc(course) {
	if (course['coursedesc_set'].length === 0){
		return "No Description!"
	}
	var i
	var result=""
	for(i=0; i<course['coursedesc_set'].length; i++){
		result.append(course['coursedesc_set'][i][0])
	}
}

function showCourses(course_list){
	$("#course_list").html('')
	console.log(course_list[0])
	var i;
	for(i =0; i<course_list.length; i++){
		$("#course_list").append("<div class='title'><i class='dropdown icon'></i>"+ getName(course_list[i]) + "</div><div class='hidden content'><div><div class='ui ribbon label'>Course Number</div><p>" + course_list[i]['catalog_num'] + "</p><div class='ui ribbon label'>Instructor</div><p>" + course_list[i]['instructor']['name'] + "</p><div class='ui hover green button' style='float:right; margin-bottom:10px;''>Add Cart</div></div></div>")
	}
	$('.ui.accordion').accordion();
}

function getCourses() {
	var course_list;

	var term = $("#term").val();
	console.log(term)
	var subject = $("#subject").val();
	console.log(subject)
	var search = $("#search").val();

	var url = "http://vazzak2.ci.northwestern.edu/courses/?term=" + term + "&subject=" + subject;
	console.log(url);
	$.ajax({
		type: 'GET',
 		url: url,
 		datatype: 'jsonp',
 		async: false,
 		success: function(data) {
 			searchCourses(data, search, showCourses)
 		},
 		error: function(errorData) {
 			alert("Error getting data!")
 		}
	});
}