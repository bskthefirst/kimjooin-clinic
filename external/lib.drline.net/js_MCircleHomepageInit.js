/*********************************************************************
function name : McircleHomepageCommonLoad
설명 : 홈페이지 공통 OnLoad
param
	hospiCd : 병원코드
	hpType : 홈페이지구분[EDT=EDT,HEALTHCARE=헬스케어,SEMI=중소병원,FLEXIBLE=플렉서블3,S3=S3,SPECIAL=개별,MOBILE=모바일,ADMIN=관리자]
	memberID : 회원아이디
	isAdmin : 관리자여부["True","False"]
*********************************************************************/
function McircleHomepageCommon(hospiCd, hpType, memberID, isAdmin) {    
	//McircleMemberPrivatePOP(hospiCd, hpType, memberID); /*2015 개인정보처리방침 변경 팝업 공통*/
}

/*********************************************************************
function name : McircleMemberPrivatePOP
설명 : 2015 개인정보처리방침 변경 팝업 공통
*********************************************************************/
function McircleMemberPrivatePOP(hospiCd, hpType, memberID) {
	/*팝업삭제처 예외처리*/
	var exceptions = ["9760", "6935"];
	for (var i = 0; i < exceptions.length; i++) {
        if (exceptions[i] == hospiCd) {
            return;
        }
    }
	
	if(memberID == '' || (window.location.pathname.toLowerCase() != '/' && window.location.pathname.toLowerCase() != '/index.asp')) {
		//로그인상태 메인에서만 팝업 노출
		return;
	}
	var pop_name = 'mcircle_popup_150319';
	if (InnerGetCookie(pop_name) == 'Y' ) {
		return;
	}
	var agt = navigator.userAgent.toLowerCase();
	var winSizeW = '500';
	var winSizeH = '500';
	var ifSizeW = '500';
	var ifSizeH = '456';
	if (agt.indexOf("chrome") >= 0)
	{
		//크롬브라우저
		winSizeW = '500';
		winSizeH = '500';
		ifSizeW = '500';
		ifSizeH = '457';
	}

	var contsHtml = '';
	contsHtml += '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
	contsHtml += '<html xmlns="http://www.w3.org/1999/xhtml"><head>';
	contsHtml += '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />';
	contsHtml += '<title>개인정보처리방침 변경 안내</title>';
	contsHtml += '<style type="text/css"> *{margin:0;padding:0;} body{padding:0; margin:0;} body, input,p {font:12px "Dotum", sans-serif;color:#5e5e5e;} a {text-decoration:none;} .foot {overflow:hidden;width:459px;height:13px;padding:16px 17px 14px 24px;background:#3e3e3e;} .foot .txt {float:left;color:#fff;}	.foot .txt input {vertical-align:middle;} .foot .txt input {margin-right:11px;} .foot .close {float:right;} .foot .close a {color:#fff;} </style>';
	contsHtml += '<script language="javascript" src="/external/lib.drline.net/McircleCommon.js"></script>';
	contsHtml += '</head><body>';
	contsHtml += '<div><iframe src="/external/lib.drline.net/popup_PopMemberPrivateNoti.asp?hospiCd='+hospiCd+'&hpType='+hpType+'&domain='+escape(document.domain)+'" width="'+ifSizeW+'" height="'+ifSizeH+'" frameborder="0" scrolling="auto"></iframe></div>';
	contsHtml += '<div class="foot"><p class="txt"><input type="checkbox" name="chkBlock" id="chkBlock" value="Y"><label for="month">오늘하루 보지 않기</label></p> <p class="close"><a href="javascript:if(document.getElementById(\'chkBlock\').checked){MSetCookie(\''+pop_name+'\',\'Y\',1);} self.close();" title="">닫기</a></p></div>';
	contsHtml += '</body></html>';
	
	var winCommonPop = window.open('',pop_name,'width='+winSizeW+', height='+winSizeH+', top=30, left=30, scrollbars=auto, resizable=yes');
	winCommonPop.document.write(contsHtml);	
}

/*********************************************************************
function name : McircleCrossPOP
설명 : CrossDomain 팝업
*********************************************************************/
function McircleCrossPOP(openUrl, pop_name, title, w, h, top, left)
{
	if (InnerGetCookie(pop_name) == 'Y' ) {
		return;
	}

	var agt = navigator.userAgent.toLowerCase();
	var ifSizeW = w;
	var ifSizeH = h;
	if (agt.indexOf("chrome") >= 0)
	{
		//크롬브라우저
		ifSizeW = w;
		ifSizeH = h;
	}

	var contsHtml = '';
	contsHtml += '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
	contsHtml += '<html xmlns="http://www.w3.org/1999/xhtml"><head>';
	contsHtml += '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />';
	contsHtml += '<title>'+title+'</title>';
	contsHtml += '<style type="text/css"> *{margin:0;padding:0;} body{padding:0; margin:0;} </style>';
	contsHtml += '<script language="javascript" src="/external/lib.drline.net/McircleCommon.js"></script>';
	contsHtml += '<script language="javascript" src="/external/lib.drline.net/js_MCircleHomepageInit.js"></script>';
	contsHtml += '<script language="javascript">window.addEventListener("message", receiveMessage, false);';
	contsHtml += '</script>';
	contsHtml += '</head><body>';
	contsHtml += '<div><iframe src="'+openUrl+'" width="'+String(ifSizeW)+'" height="'+String(ifSizeH)+'" frameborder="0" scrolling="auto"></iframe></div>';
	contsHtml += '</body></html>';
	
	var winCommonPop = window.open('',pop_name,'width='+String(w)+', height='+String(h)+', top='+String(top)+', left='+String(left)+', scrollbars=auto, resizable=yes');
	winCommonPop.document.write(contsHtml);	
}

/*********************************************************************
function name : receiveMessage
설명 : Receive postMessage
*********************************************************************/
function receiveMessage(event)
{
	var jsData = JSON.parse(event.data);
	switch(jsData.command) {
		case "close" :
			window.close();
			break;
		case "javascript":
			eval(jsData.javascript);
			break;
		default:
			break;
	}
}

function testCall() {
	alert('test call');
}

function InnerGetCookie( name ) {
	var nameOfCookie = name + "=";
	var x = 0;

	while ( x <= document.cookie.length ) {
		var y = (x+nameOfCookie.length);	
		if ( document.cookie.substring( x, y ) == nameOfCookie ) {
			if ( (endOfCookie=document.cookie.indexOf( ";", y )) == -1 ) endOfCookie = document.cookie.length;
			return unescape( document.cookie.substring( y, endOfCookie ) );
		}
		x = document.cookie.indexOf( " ", x ) + 1;	
		if ( x == 0 ) break;
	}
	return "";
}
function InnerSetCookie( name, value, expiredays ) {
	var endDate = new Date();
	endDate.setDate( endDate.getDate()+ expiredays );
	document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + endDate.toGMTString() + ";"
}
