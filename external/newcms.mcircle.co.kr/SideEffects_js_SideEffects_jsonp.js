
(function($){
	$.support.cors = true;
    $.extend($.fn,{
        ftnMcircleSideEffectsGudie : function(options){
			/* Default Options
			================================================== */       
			var defaults = {
				hospi_cd : 0					/*	병원코드 */
				, dept : 0						/*	진료과코드 */
				, curl : ""						/*	사이트 url */
				, foldername : ""				/*	폴더네임 배열 */
				, click_medi : 0				/*	클릭메디코드 */
			};

			var $objName = this;
			var options = $.extend(defaults, options);
			var folders = $.extend({}, defaults.foldername);
			var folders_check = false;
			var check_url = "";
			//	사이트url and 폴더가 있을 경우
			if (defaults.foldername != "" && defaults.curl != "")
			{
				if (Array.isArray(defaults.foldername))
				{
					foldername_arr = Array.isArray(defaults.foldername);
					for (var i in defaults.foldername) {
						if(defaults.curl.toLowerCase().indexOf(defaults.foldername[i].toLowerCase()) != -1)
						{
							folders_check = true;
						}
					}

					check_domain = defaults.curl.split("//");
					check_domain = "http://" + check_domain[1].substr(0,check_domain[1].indexOf("/"));
					check_url = defaults.curl.toLowerCase().replace(check_domain.toLowerCase(),"");
				}
			}
			else{
				if(defaults.hospi_cd >0 && defaults.dept > 0)
				{
					folders_check = true;
				}
			}

//			alert(check_url);

			var ajax_url = "http://newcms.mcircle.co.kr/SideEffects/UserArea_jsonp.asp";
			ajax_url = ajax_url + "?hospi_cd=" + defaults.hospi_cd + "&dept=" + defaults.dept + "&click_medi=" + defaults.click_medi + "&check_url=" + encodeURIComponent (check_url);
			

//			console.log(ajax_url);
			/*
			//	ajax로 해당 컨텐츠 페이지를 호출한다.
			var ftnMcircleSideEffectsRead2 = function()
			{
				// location.url 과 option의 폴더를 비교하여 동일할 경우에만 ajax 실행
				$.ajax(
				{
					type: "POST",
					url: ajax_url,
					data: "hospi_cd=" + defaults.hospi_cd + "&dept=" + defaults.dept,
					dataType: "html",
					error: function(request,status,error){
						alert(request);
						alert(status);
						alert(error);
						alert("실행중 에러가 발생했습니다.\r관리자에게 문의 바랍니다.");
						return false;
					},
					success: function(html){
						if(html != ""){
							$objName.html(html);
						}
					}
				});
			}
			*/

			var ftnMcircleSideEffectsRead = function()
			{
				$.ajax({
						type: 'POST',
						url: ajax_url,
						dataType : 'jsonp', 
						jsonpCallback: "mySideCallback",
						success: function (data) {
/*
							alert(data.code);
							alert(data.hospicd);
							alert(data.deptcode);
*/
							ftnMcircleSideEffectsContents_jsonp(data);
						},
						error:function(request,status,error){
							/*
							alert("code : "+request.status+"\n"+"message : "+request.responseText+"\n"+"error : "+error);
							*/
							console.log("code : "+request.status+"\n"+"message : "+request.responseText+"\n"+"error : "+error);
						}
					});
				return false;
				/*
				if (window.XMLHttpRequest)
				{ // Mozilla, Safari, ...
					httpRequest = new XMLHttpRequest();
				} else if (window.ActiveXObject) { 
				// IE
					try {
						httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
					} 
					catch (e) {
						try {
							httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
						} 
						catch (e) {}
						}
					}

					if (!httpRequest) {
						alert('Giving up :( Cannot create an XMLHTTP instance');
						return false;
				}

				if (httpRequest == null)
				{
					alert("지원할 수 없는 브라우저입니다.");
				}

				httpRequest.onreadystatechange = ftnMcircleSideEffectsContents;
				httpRequest.open('POST', ajax_url, true);
				httpRequest.send();
				*/
			}

			var ftnMcircleSideEffectsContents = function()
			{
				if (httpRequest.readyState === 4)
				{
					if (httpRequest.status === 200)
					{
						$objName.html(httpRequest.responseText);
					} else 
					{
						alert('There was a problem with the request.');
					}
				}
			}

			var ftnMcircleSideEffectsContents_jsonp = function(data)
			{
				if (data.code == "ok")
				{
					side_html = "<br /><div id='side_effect-notice'>";
					side_html += "<h6 class='se-tit'><img src='http://newcms.mcircle.co.kr/SideEffects/images/se_notice_tit.png' alt='부작용 정보 안내'></h6>";
					side_html += "<p class='se-info'>본원은 의료법 제 56조에 의거 부작용을 명시하여 의료법을 준수하고 있습니다.</p>";
					side_html += "<a href='javascript:void(0)' onclick='ftnMcircleSideEffectsPopup(\"" + data.hospicd + "\",\"" + data.deptcode + "\");' class='se-view_btn'><img src='http://newcms.mcircle.co.kr/SideEffects/images/se_view_btn.png' alt='보기'></a></div><br />";		

					side_html += "<style>";
					side_html += "#side_effect-notice { border: 1px solid #f9ddb4; background: #fffbf7 url('http://newcms.mcircle.co.kr/SideEffects/images/se_notice_ico.png') no-repeat 15px center; padding: 15px 55px; position:relative;}";
					side_html += "#side_effect-notice h6.se-tit { margin-top: 2px; margin-bottom: 4px; }";
					side_html += "#side_effect-notice p.se-info { font-family: 'Nanum Gothic', '나눔고딕', 'NanumGothic', '맑은 고딕', 'Malgun Gothic', 'Gulim', '굴림', sans-serif; font-size: 13px; color: #4e4e4e; line-height: 1.2; }";
					side_html += "a.se-view_btn { position: absolute; display: block; top: 15px; right: 15px; }";
					side_html += "#GlobalSideEffectsLinkArea {width:98%;text-align:left;}";
					side_html += "</style>";
					$objName.html(side_html);
				}else{
					side_html = "";
				}

			}

			if(folders_check)
			{
				ftnMcircleSideEffectsRead();
			}
        }
    });
})(jQuery);


function ftnMcircleSideEffectsPopup(hospi_cd, dept_code){	
	var JWidth  = 800;
	var JHeight  = 600;
	var JWinName  = "sideeffects_popup";
	var query_data = "hospi_cd=" + hospi_cd + "&dept=" + dept_code;
	var JOpenedFile = "http://newcms.mcircle.co.kr/SideEffects/UserPopup.asp?" + query_data;

	var x = (screen.width/2) - (JWidth/2);
	var y = (screen.height/2) - (JHeight/2);
	var NewWin = window.open('', JWinName, 'toolbar=no,resizable=no,scrollbars=yes,status=0,width='+JWidth+',height='+JHeight+',left='+x+',top='+y);
	NewWin.location = JOpenedFile;
}