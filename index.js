
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

	//$('.ui.dimmable').dimmer('toggle');
	$('#enroll').click(function(){
		//$('.ui.dimmable').dimmer('show');
		//$('.ui.dimmer').dimmer('show');
		$('.ui.dimmer').dimmer('show');
	});

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
function getSchedule(course) {
	var time="";
	console.log(course['meeting_days'])
	time += course['meeting_days'];
	time += ';';
	time += (course['start_time'] + ';' + course['end_time'])
	console.log(time)
	return time
}

/*
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
*/
function showCourses(course_list){
	$("#course_list").html('')
	$('#class_list').css({"display": "block"});
	console.log(course_list[0])
	var i;
	for(i =0; i<course_list.length; i++){
		$("#course_list").append(
			"<div class='title'>	\
				<i class='dropdown icon'></i>"+ getName(course_list[i]) + "</div>	\
				<div class='hidden content' style='height:260px'>	\
				<div>	\
					<div class='ui orange ribbon label'>Instructor</div>	\
					<p>" + course_list[i]['instructor']['name'] + "</p>	\
					<div class='ui orange ribbon label'>Course Number</div>	\
					<p>" + course_list[i]['catalog_num'] + "</p>	\
					<div class='ui orange ribbon label'>Course Schedule</div>	\
					<p>" + course_list[i]['meeting_days'] + ": " + course_list[i]['start_time'] + "-" + course_list[i]['end_time'] + "</p>	\
					<div class='ui hover blue button' id='addBtn"+ i + "'style='float:right;'	\
					onclick='addCart(\"" + getName(course_list[i]) +"\"," + i + ",\"" + getSchedule(course_list[i]) + "\")'>Add Cart</div>	\
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

var cart_list=[];

function conflict_with(sch1, sch2) {
	start1 = parseInt(sch1[1].split(':')[0]) + parseInt(sch1[1].split(':')[1]) / 60
	end1 = parseInt(sch1[2].split(':')[0]) + parseInt(sch1[2].split(':')[1]) / 60
	start2 = parseInt(sch2[1].split(':')[0]) + parseInt(sch2[1].split(':')[1]) / 60
	end2 = parseInt(sch2[2].split(':')[0]) + parseInt(sch2[2].split(':')[1]) / 60
	if(start1 > end2 || start2 > end1){
		return false
	}
	date1 = []
	date2 = []
	var i,j;
	for(i=0; i<sch1[0].length; i=i+2){
		date1.push(sch1[0].substring(i,i+2))
	}
	for(i=0; i<sch1[0].length; i=i+2){
		date2.push(sch2[0].substring(i,i+2))
	}
	for(i=0; i<date1.length; i++){
		for(j=0; j<date2.length;j++){
			if(date1[i] === date2[j]){
				return true
			}
		}
	}
	return false
}

function check_conflict(schedule) {
	var i;
	for (i=0; i<cart_list.length; i++){
		if(conflict_with(cart_list[i],schedule) === true){
			return cart_list[i][3]
		}
	}
	return null
}

function addCart(courseName, cnum, courseTime){
	//$('.menu').splice(-1, 1);
	console.log(courseName)
	console.log(cnum)
	var schedule = courseTime.split(";")
	schedule.push(courseName)
	console.log(schedule)

	var conflict_course = check_conflict(schedule)
	if(conflict_course != null){
		alert("Conflict with " + conflict_course)
		return
	}
	cart_list.push(schedule)
	//console.log(cart_list)

	cnumADD='#addBtn'+cnum;
	if ($(cnumADD).html() == 'Added'){
		return;
	}
	$(cnumADD).html('Added');
	$(cnumADD).attr('class', 'ui hover button');
	$('.menu').append('<div class="ui attached segment" id='+cnum+'><p>' + courseName + '<i class="remove icon" onclick=rmCourse(' + cnum + ') ></i></p></div>');
	$('.dropdown').dropdown();
}
function rmCourse(num){
	//console.log('hello')
	var rmnum='#'+ num
	$(rmnum).remove();
	cnumADD='#addBtn'+num;
	$(cnumADD).html('ADD CART')
	$(cnumADD).attr('class', 'ui hover blue button');
	$('.dropdown').dropdown();
	//$(".ui.simple.dropdown.item").dropdown('show');
	//$(".ui.simple.dropdown.item").style.display='block';
}


$('.dropdown').on({
	"shown.bs.dropdown": function() {$(this).data('closable', false);}
	// "click": function() {$(this).data('closable',true);}
	// "hide.bs.dropdown": function() {return $(this).data('closable');}
});