function editReply(rid, reg_id, content) {

	console.log("articleId : " + rid);
	console.log("writerId : " + reg_id);
	console.log("articleContents : " + content);
		var htmls = "";
		htmls += '<div class="media text-muted pt-3" id="rid ' + rid + '">';
//	  htmls += '<svg class="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder:32x32">';
//	  htmls += '<title>Placeholder</title>';
//    htmls += '<rect width="100%" height="100%" fill="#007bff"></rect>';
//	  htmls += '<text x="50%" fill="#007bff" dy=".3em">32x32</text>';
//	  htmls += '</svg>';
		htmls += '<p class="media-body pb-3 mb-0 small lh-125 border-bottom horder-gray">';
		htmls += '<span class="d-block">';
		htmls += '<strong class="text-gray-dark">' + reg_id + '</strong>';
		htmls += '<span style="padding-left: 7px; font-size: 9pt">';
		htmls += '<a href="javascript:void(0)" onclick="fn_updateReply(' + rid + ', \'' + reg_id + '\')" style="padding-right:5px">저장</a>';
		htmls += '<a href="javascript:void(0)" onClick="showReplyList()">취소<a>';
		htmls += '</span>';
		htmls += '</span>';		
		htmls += '<textarea name="editContent" id="editContent" class="form-control" rows="3">';
		htmls += content;
		htmls += '</textarea>';
		htmls += '</p>';
		htmls += '</div>';
		var RID = document.getElementById('rid ' + rid);
		RID.insertAdjacentHTML('afterend', htmls);
		$('#rid ' + rid + ' #editContent').focus();
}

$(".answer-write input[type=submit]").click(addAnswer);
		
function addAnswer(e) {
	e.preventDefault();
	console.log("click me!");
	
	var queryString = $(".answer-write").serialize();
	console.log("query : " + queryString);
	
	var url = $(".answer-write").attr("action");
	console.log("url : " + url);
	
	$.ajax({
		type : 'post',
		url : url,
		data : queryString,
		dataType : 'json' ,
		error : onError , 
		success : onSuccess
	});
	
} 

function onError() {
}

function onSuccess(data, status) {
	console.log(data);
	var answerTemplate = $("#answerTemplate").html();
	var template = answerTemplate.format(data.writer.userId, data.formattedCreateDate, data.contents, data.question.id, data.id);
	$(".qna-comment-slipp-articles").prepend(template);
	$("textarea[name=contents]").val("");
	window.location.reload();
}

$(".link-delete-article").click(deleteAnswer);

function deleteAnswer(e) {
	e.preventDefault();
	
	var deleteBtn = $(this);
	var url = deleteBtn.attr("href");
	console.log("url : " + url);
	
	$.ajax({
		type : 'delete',
		url  : url,
		dataType : 'json',
		error : function(request, status) {
			console.log("error");
		},
		success : function(data, status) {
			console.log(data);
			if(data.valid) {
				deleteBtn.closest("article").remove();
			} else {
				alert(data.errorMessage);
			}
		}
	});
}

String.prototype.format = function() {
	  var args = arguments;
	  return this.replace(/{(\d+)}/g, function(match, number) {
	    return typeof args[number] != 'undefined'
	        ? args[number]
	        : match
	        ;
	  });
	};

