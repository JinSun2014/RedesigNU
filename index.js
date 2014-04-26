
$('document').ready(function(){
	console.log('hi')
	$('.ui.accordion').accordion();
	/*$('input').keypress(function(e){
		$('#class_list').css({"display": "block"});
		if (!$('input').val()){
			$('#class_list').css({"display": "None"});
		}
	});*/
	$('.dropdown')
		.dropdown()
	;
});

function searchCoursesByName(data, search, callback) {
	var course_list=[]
	console.log(data[1])
	var i
	for(i=0; i<data.length; i++){
		if(data[i]['title'].search(new RegExp(search, "i")) != -1 ){
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

function searchCoursesByInstructor(data, instructor, search, callback) {
	var course_list=[]
	console.log(data[1])
	var i
	for(i=0; i<data.length; i++){
		if(data[i]['name'].search(new RegExp(instructor, "i")) != -1 ){
			console.log(data[i]['name'])
			course_list.push(data[i]);
		}
	}
	if(course_list.length === 0) {
		alert("no courses found")
	} else {
		console.log(course_list)
		console.log(callback)
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
	$('#class_list').css({"display": "block"});
	console.log(course_list[0])
	var i;
	for(i =0; i<course_list.length; i++){
		$("#course_list").append(
			"<div class='title'>	\
				<i class='dropdown icon'></i>"+ getName(course_list[i]) + "</div>	\
				<div class='hidden content'>	\
				<div>	\
					<div class='ui orange ribbon label'>Course Number</div>	\
					<p>" + course_list[i]['catalog_num'] + "</p>	\
					<div class='ui orange ribbon label'>Instructor</div>	\
					<p>" + course_list[i]['instructor']['name'] + "</p>	\
					<div class='ui hover blue button' id='addBtn"+ i + "'style='float:right;'	\
					onclick='addCart(\"" + getName(course_list[i]) +"\"," + i +")'>Add Cart</div>	\
				</div>	\
			</div>")
	}
	$('.ui.accordion').accordion();
}

function getCourses() {
	var course_list;

	var term = $("#term").html();
	console.log(term)
	switch(term){
		case "2014 Spring":
			term = 4540;
			break;
		case "2014 Winter":
			term = 4530;
			break;
		case "2013 Fall":
			term = 4520;
			break;
		default:
			term = 4540;
			break;
	}
	var subject = $("#subject").val();
	console.log(subject)
	var instructor = $("#instructor").val();
	var search = $("#search").val();
	if(! $.isEmptyObject(instructor)){
		url = "http://vazzak2.ci.northwestern.edu/instructors/?subject=" + subject;
	} else {
		url = "http://vazzak2.ci.northwestern.edu/courses/?term=" + term + "&subject=" + subject;
	}
	console.log(url);
	$.ajax({
		type: 'GET',
 		url: url,
 		datatype: 'jsonp',
 		async: false,
 		success: function(data) {
 			if($.isEmptyObject(instructor)){
 				console.log(search)
 				searchCoursesByName(data, search, showCourses)
 			} else {
 				searchCoursesByInstructor(data, instructor, search, showCourses)
 			}
 		},
 		error: function(errorData) {
 			alert("Error getting data!")
 		}
	});
}
var num=0
function addCart(courseList,cnum){
	//$('.menu').splice(-1, 1);
	console.log(cnum)
	
	cnumADD='#addBtn'+cnum;
	if ($(cnumADD).html() == 'Added'){
		return;
	}
	$(cnumADD).html('Added');
	$(cnumADD).attr('class', 'ui hover button');
	num+=1
	$('.menu').append('<div class="ui attached segment" id='+num+'><p>' + courseList + '<i class="remove icon" onclick=rmCourse(' + num + ') ></i></p></div>');
	$('.dropdown').dropdown();
}
function rmCourse(num){
	//console.log('hello')
	var rmnum='#'+ num
	$(rmnum).remove();
	$(".ui.simple.dropdown.item").dropdown('show');
}

$('#enroll').click(function(){
	$('.dimmer').dimmer('toggle');
});