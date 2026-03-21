/*********************************************************************
function name : MCheckPassword
설명 : 비밀번호 유효성검사
param {pwd=비밀번호, [checkType=체크유형({S=강력함,L=약함})], [blockList=필터키워드(배열타입)]}
return {연속된문자=false, 연속되지않은문자=true} 
사용예 : if (!MCheckPassword('비밀번호')) {실패처리}
*********************************************************************/
function MCheckPassword(pwd, checkType, blockList) {
    if (!checkType) checkType = 'S'; // 체크유형이 없으면 강력함으로 설정
    /*문자길이제한, 문자,숫자,특수문자조합*/
    var check = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{10,16}$/;
    var check2 = /^[a-zA-Z0-9]{6,16}$/; /*문자,숫자만 조합*/
    if (checkType == 'S' && !check.test(pwd)) {
        //강력한 비밀번호
		alert("비밀번호는 영문,숫자,특수문자 조합으로 10자이상 16자이하로 입력해주세요.");
        return false;
    }
    else {
        //약한 비밀번호
        if (pwd.length < 6 || pwd.length > 16) {
            alert("비밀번호는 6자이상 16자이하로 입력해주세요.");
            return false;
        }
    }
    /*같은문자가 세번이상 반복될수 없음*/
    if (/(\w)\1\1/.test(pwd)) {
        alert('비밀번호는 같은 문자를 3번 이상 사용할 수 없습니다.');
        return false;
    }
    /*연속된문자가 3개이상 있을수 없음*/
    if (!MConsecutiveCheck(pwd, 3)) {
        alert('비밀번호는 연속된 문자를 사용할수 없습니다.(abc, 123등)');
        return false;
    }
	if(blockList)
	{
		for	(i = 0; i < blockList.length; i++) {
			if(blockList[i] != '' && pwd.indexOf(blockList[i]) >= 0){				
				alert('비밀번호에 사용할 수 없는문자 '+blockList[i]+'(이)가 입력되었습니다.\r\n(아이디, 생년월일, 핸드폰번호등)');
		        return false;
			}
		}		
	}
    return true;
}

/*********************************************************************
function name : MConsecutiveCheck
설명 : 연속된문자유무체크[abc,1234]
param {str=체크문자열,limit=연속된문자개수}
return {false=연속된문자, true=연속되지않은문자} 
*********************************************************************/
function MConsecutiveCheck(str, limit) {
    var o, d, p, n = 0, l = limit == null ? 4 : limit;
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        if (i > 0 && (p = o - c) > -2 && p < 2 && (n = p == d ? n + 1 : 0) > l - 3) return false;
        d = p, o = c;
    }
    return true;
}

function MGetCookie( name ) {
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
function MSetCookie( name, value, expiredays ) {
	var endDate = new Date();
	endDate.setDate( endDate.getDate()+ expiredays );
	document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + endDate.toGMTString() + ";"
}