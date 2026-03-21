//=====================================================================================
// Made in Korea Start (JQuery)
//=====================================================================================
	document.writeln("<scr" + "ipt type=\"text/jav" + "asc" + "ript\" src=\"/BasicJs/jquery.js\"></scr" + "ipt>");

    function ReturnFieldValue(FieldName, FieldType){   // 필드에 입력된 값을 반환한다
        if(FieldName == null){
            alert("필드 정보를 입력하세요.");
        }else if(FieldType == "input" || FieldType == "textarea" || FieldType == "select"){
            return $.trim($(FieldType + "[name=" + FieldName+ "]").val());
        }else if(FieldType == "radio" || FieldType == "checkbox"){
            return $.trim($(":input:" + FieldType + "[name=" + FieldName + "]:checked").val());
        }
    }

    function FieldCheckAlert(FieldName, AlertMent, FieldType, FocusYN){ // 필드에 값이 입력됬는지 체크
        var ReturnValue = false;

        if(FieldName == null){
            alert("필드 정보를 입력하세요.");
        }else if(!ReturnFieldValue(FieldName, FieldType)){
			alert(AlertMent);

            if(FocusYN == "Y"){
                if(FieldType == "input" || FieldType == "textarea" || FieldType == "select"){
                    $(FieldType + "[name=" + FieldName + "]").focus();
                }else if(FieldType == "radio" || FieldType == "checkbox"){
                    $(":input:" + FieldType + "[name=" + FieldName + "]").eq(0).focus();
                }
            }

            ReturnValue = false;
        }else{
            ReturnValue = true;
        }

        return ReturnValue;
    }

    function ButtonValueReturn(FieldName){ // Radio,Checkbox의 선택된 값을 반환한다
        var ReturnValue;

        $("input[name=" + FieldName + "]").each(function(){
            if(this.checked == true){
                ReturnValue = this.value;
            }
        });

        return ReturnValue
    }

    function chkPatten(field, patten){ // 입력된 값들의 형식 체크
        var idCheck = /^[a-zA-Z]{1}[a-zA-Z0-9_-]{4,12}$/;
        var pwCheck = /^[a-zA-Z0-9_-]{4,12}$/;
        var memberPwCheck = /^[a-zA-Z0-9]{8,15}$/;
        var mailCheck = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        var telCheck = /^[0-9]{8,11}$/;
        
        patten = eval(patten);

        if(!patten.test(ReturnFieldValue(field, "input"))){
            return false;
        } else {
            return true;
        }
    }

/**
 * 비밀번호 영문/숫자 8~12자 체크
 */
	function validPWD(field){
		var pw = ReturnFieldValue(field, "input");
		var msg = "";
		msg += "패스워드는 필히 영문 숫자 조합하여 10자~15자 이내로 수정해주세요";
		var filter = pw.search(/[^0-9a-zA-Z]/g);

		if(filter > -1){ 
			return false;
		}else{ 
			var chk_num = pw.search(/[0-9]/g); 
			var chk_eng = pw.search(/[a-z]/ig); 

			if(chk_num < 0 || chk_eng < 0){ 
				return false;
			} else {
				if( pw.length < 10 || pw.length > 15 ){
					 return false;
				} else {
					return true;
				}
			}
		} 	
	}	

	function ftnNumbercheck(strValue)
	{
		var pattern = /[0-9]/g;
		return pattern.test(strValue);
	}


    function EmailCheck(FieldName){
        var EmailValue = $("input[name=" + FieldName + "1]").val() + '@' + $("input[name=" + FieldName + "2]").val();
        var mailCheck = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        if(!mailCheck.test(EmailValue)){
            alert("올바른 이메일 형식이 아닙니다.");
            return false;
        } else {
            return true;
        }
    }

    function EmailCheck2(FieldName){
        var EmailValue = $("input[name=" + FieldName + "]").val();
        var mailCheck = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        if(!mailCheck.test(EmailValue)){
            alert("올바른 이메일 형식이 아닙니다.");
            return false;
        } else {
            return true;
        }
    }

    function ShowHidden(Type, Name, ChangeState, Option){
        /*
            대상의 Display 상태를 변경한다.
            Type : Class, Id
            Name : class 나 id 명
            ChangeState : show, hide
            Option : slow
        */        
            
        if(ChangeState != "show" && ChangeState != "hide"){
            alert(Name + " " + Type + "의 변경할 Display 속성을 입력하세요.");
            return;
        }

        var Oj;

        if(Type == "Class"){
            Type = ".";
        }else if(Type == "Id"){
            Type = "#";
        }
        
        Oj = "$(\"" + Type + Name + "\")";
        eval(Oj + "." + ChangeState + "(\"" + Option+ "\")");
    }

    function ZipcodeSearch(FieldName){
        window.open("/Etc/ZipcodeSearch.asp?FieldName=" + FieldName, "ZipcodeSearch", "scrollbars=yes, width=100, height=100");
    }

    function ZipcodeSearchCheck(){
        var SearchText = ReturnFieldValue("SearchText", "input");

        if(!FieldCheckAlert("SearchText", "검색할 지역을 입력하세요.", "input", "Y")){ return false; }

        $.ajax({
            type : "post",
            url : "/Etc/Ajax_ZipcodeSearch.asp",
            data : "SearchText=" + SearchText,
            error: function(html){
                alert("실행중 에러 발생");
            },
            success: function(html){
                if(html == "Not Found"){
                    $(".ResultFail").show();
                    $("input[name=SearchText]").attr({"value" : ""});
                }else{
                    $(".ResultSuccess").show();
                    $("#ZipcodeList").html(html);
                }
            }
        });

        return false;
    }

    function AddressSend(SeqNum){
        ZipCode = $("#Zipcode" + SeqNum).text().split("-");
        
        ReturnValue = Array();

        ReturnValue[0] = ZipCode[0];
        ReturnValue[1] = ZipCode[1];
        ReturnValue[2] = $("#Address" + SeqNum).text();

        var FieldName = ReturnFieldValue("FieldName", "input");

        for(var i = 1; i <= 3; i++){
            opener.$("input[name=" + FieldName + i + "]").attr({"value" : ReturnValue[i - 1]});
        }

        opener.$("input[name=" + FieldName + "4]").focus();
        self.close();
    }

    function AddressSend2(SeqNum){
        ZipCode = $("#Zipcode").text();

        ReturnValue = Array();

        ReturnValue[0] = ZipCode;
        ReturnValue[1] = $("#Address" + SeqNum).text();

		var FieldName = ReturnFieldValue("FieldName", "input");

        for(var i = 1; i <= 2; i++){
            opener.$("input[name=" + FieldName + i + "]").attr({"value" : ReturnValue[i - 1]});
        }

        opener.$("input[name=" + FieldName + "3]").focus();
        self.close();
    }

    function AllCheck(FieldName){ // Checkbox 전체 선택, 선택 상태값은 AllCheck 필드에 저장
        var AllCheckState, CheckState, CheckStateValue;

        AllCheckState = ReturnFieldValue("AllCheck", "input");

        if(AllCheckState == ""){
            CheckState = true;
            CheckStateValue = "Y";
        }else{
            CheckState = false;
            CheckStateValue = "";
        }

         $("input[name=AllCheck]").attr({ value : CheckStateValue});

        $("input[name=" + FieldName + "]").each(
            function(){
                this.checked = CheckState;
            }
        );
    }

    function AllCheck2(FieldName){ // Checkbox 전체 선택, 선택 상태값은 AllCheck 필드에 저장
        $("input[name=" + FieldName + "]").each(
            function(){
                this.checked = true;
            }
        );
    }

	function setComma(str){
		str = "" + str + "";
		var retValue = "";
		
		for(i = 0; i < str.length; i++)
			if(i > 0 && (i % 3) == 0)
				retValue = str.charAt(str.length - i -1) + "," + retValue;
			else
				retValue = str.charAt(str.length - i -1) + retValue;
		
		return retValue;
	}

    function CheckValueReset(FieldName){
        $("input[name=" + FieldName + "]").attr({checked : false });
    }

    function JuminCheck(FieldName){
        var Number = $("input[name=" + FieldName + "1]").val() + $("input[name=" + FieldName + "2]").val();
		var Sum=0;
		var Chk=0;
	
		for	(i=0;i<12;i++)	{
			if(i<8)
				Sum+=parseInt(Number.charAt(i))*(i+2);

			if(i>7)
				Sum+=parseInt(Number.charAt(i))*(i-6);
		}
		
		Chk = (Sum%11) + parseInt(Number.charAt(12));

        if(!(Chk == 1 || Chk == 11))	{
            alert("올바른 주민등록번호가 아닙니다.");
			return false;
		}else{
            return true;
        }
    }

    function JuminCheck2(Number){
		var Sum=0;
		var Chk=0;
	
		for	(i=0;i<12;i++)	{
			if(i<8)
				Sum+=parseInt(Number.charAt(i))*(i+2);

			if(i>7)
				Sum+=parseInt(Number.charAt(i))*(i-6);
		}
		
		Chk = (Sum%11) + parseInt(Number.charAt(12));

        if(!(Chk == 1 || Chk == 11))	{
            alert("올바른 주민등록번호가 아닙니다.");
			return false;
		}else{
            return true;
        }
    }
	
	function ForeignNumberCheck(FieldName){
		var ForeignNumber = $("input[name=" + FieldName + "1]").val() + $("input[name=" + FieldName + "2]").val();

		sum = 0;

		if(ParseInt(ForeignNumber.Substring(7, 2)) % 2 != 0){
			return false;      
		}

		for(var i = 0; i < 12; i++){
			sum += ParseInt(ForeignNumber.Substring(i, 1)) * ((i % 8) + 2);
		}

		if((((11 - (sum % 11)) % 10 + 2) % 10) == ParseInt(ForeignNumber.Substring(12, 1))){
			return true;
		}else{
			return false;
		}
	}

    function EmailInputFieldDisplay(Value){
        $("input[Name=Email2]").attr({value: Value});
        
        if($("select[name=EmailDomain]").val() == ""){
            $("input[Name=Email2]").css({width: 120});
            $("#EmailTD").css({width:130});
        }else{
            $("input[Name=Email2]").css({width: 0});
            $("#EmailTD").css({width:0});
        }
    }

    function Random(StartNumber, FinishNumber){
       var rand = Math.floor(Math.random() * FinishNumber) + StartNumber;

       return rand;
    }
    
    function TextLength(FieldName){
        var cByte = 0;
        var ContentsLength = $(":textarea:input[name=" + FieldName +"]").val().length;
        
        for(var i = 0; i < ContentsLength; i++){
            var TempChar = $(":textarea:input[name=" + FieldName +"]").val().charAt(i);

            if(escape(TempChar).length > 4)
                cByte += 2;
            else
                cByte += 1;
        }

        return cByte;
    }
	
	function RemoveNull(Value){
		if(Value == undefined){
			Value = "";
		}

		return Value;
	}
    
// type = file 인 컨트롤만 사용한다.
function ftnControlDisabledCheck(strValue,FieldName)
{
	if(!strValue)
	{
		$("input:[name="+FieldName+"]").attr({"disabled" : true });
	}
	else
	{
		$("input:[name="+FieldName+"]").attr({"disabled" : false });
	}
}
// 이메일체크
function Global_EmailCheck(FieldName1,FieldName2)
{
	var EmailValue = $("input[name=" + FieldName1+ "]").val() + '@' + $("input[name=" + FieldName2 +"]").val();
	var mailCheck = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	if(!mailCheck.test(EmailValue))
	{
		alert("올바른 이메일 형식이 아닙니다.");
		$("input[name=" + FieldName1 + "]").attr({"value":""});
		$("input[name=" + FieldName2 + "]").attr({"value":""});
		$("input[name=" + FieldName1 + "]").focus();
		return false;
	}
	else
		return true;
}  
// 이메일체크
function Global_EmailCheck2(FieldName)
{
	var EmailValue = $("input[name=" + FieldName+ "]").val();
	var mailCheck = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	if(!mailCheck.test(EmailValue))
	{
		alert("올바른 이메일 형식이 아닙니다.");
		$("input[name=" + FieldName + "]").attr({"value":""});
		$("input[name=" + FieldName + "]").focus();
		return false;
	}
	else
		return true;
}
// 해당 텍스트 값에서 확장자를 추출합니다.
function Global_GetFileExtension( controlObject )
{
	var contolValue = controlObject.value;

	var index = contolValue.lastIndexOf(".")

	if ( ( Global_TrimSpaces(contolValue) != "" ) && ( contolValue.length != 0 ) )
	{
		return contolValue.substring(index+1).toLowerCase();
	}
	else
	{
		return '';
	}
}
// 입력값 체크
function Global_ValuePattenCheck(fieldName,msg,checkEnd,minlen,maxlen)
{
	var reg_exp1 = /^[a-zA-Z0-9_-]{1,20}$/;
	var reg_exp2 = /[a-zA-Z]/i;
	var reg_exp3 = /\d/;
	var reg_exp4 = /^[a-zA-Z]/;
	var reg_exp5 = /[a-zA-Z0-9_-]{1,20}$/;

	if (fieldName == null)	{ alert('오류가 발생했습니다');return false ;}
	if (msg == null)	{ msg = "" ;}
	if (minlen == null)	{ minlen = 5 ;}
	if (maxlen == null)	{ maxlen = 20 ;}

	var checkValue = $.trim($("input[name=" + fieldName + "]").val());
	var match1 = reg_exp1.test(checkValue);
	var match2 = reg_exp2.test(checkValue);
	var match3 = reg_exp3.test(checkValue);
	var match4 = reg_exp4.test(checkValue);
	var match5 = reg_exp5.test(checkValue);

	if(checkValue == "")
	{
		alert(msg + "를 입력 하세요.");
		$("input[name=" + fieldName + "]").attr({"value":""})
		$("input[name=" + fieldName + "]").focus();
		return false;
	}
	if(checkValue.length < minlen || checkValue.length > maxlen)
	{
		alert(msg + "는 " + minlen + "자 이상 " + maxlen + "자 이하로 입력 하세요.");
//		$("input[name=" + fieldName + "]").attr({"value":""})
		$("input[name=" + fieldName + "]").focus();
		return false;
	}
	if(checkEnd)
	{
		if(match1)
		{
			if(match4 && match2 && match3)
			{
				return true;
			}
			else
			{
				alert(msg + "는 첫글자는 영문으로 시작하며 영문과 숫자 조합만 가능합니다.");
				$("input[name=" + fieldName + "]").attr({"value":""})
				$("input[name=" + fieldName + "]").focus();
				return false;
			}
		}
		else
		{
			if(match4 && match2 && match3)
			{
				return true;
			}
			else
			{
				alert(msg + "는 첫글자는 영문으로 시작하며 영문과 숫자 조합만 가능합니다.");
				$("input[name=" + fieldName + "]").attr({"value":""})
				$("input[name=" + fieldName + "]").focus();
				return false;
			}
		}
	}
	else
	{
		if(match5)
			return true;
		else
		{
			alert(msg + "는 영문, 숫자 만 가능합니다.");
			$("input[name=" + fieldName + "]").attr({"value":""})
			$("input[name=" + fieldName + "]").focus();
			return false;
		}
	}
	return true;
}   


// 입력불가 파일명 정리
function Global_FileTypeCheck(strType)
{
	var strTypeCheck = strType.replace(".","");
	if(strType.toLowerCase() != 'exe' && strType.toLowerCase() != 'asp' && strType.toLowerCase() != 'php' && strType.toLowerCase() != 'jsp' && strType.toLowerCase() != 'aspx' && strType.toLowerCase() != 'bat' && strType.toLowerCase() != 'cmd' && strType.toLowerCase() != 'msi' && strType.toLowerCase() != 'com' && strType.toLowerCase() != 'js' && strType.toLowerCase() != 'html')
		return true;
	else
		return false;
}

// 입력파일 체크
function Global_FileControlValueCheck(ControlName,strFileType)
{
	var CheckControlName = $("input:[name=" + ControlName + "]")

	if(CheckControlName.val() != "")
	{
		val = CheckControlName.val().split("\\");
		f_name = val[val.length-1]; //마지막 화일명
		s_name = f_name.substring(f_name.lastIndexOf('.') + 1, f_name.len);

		if(Global_FileTypeCheck(s_name))
		{
			if(strFileType.toLowerCase() == "image")
			{
				if(s_name.toLowerCase() != 'jpg' && s_name.toLowerCase() != 'gif' && s_name.toLowerCase() != 'jpge')
				{
					CheckControlName.select();
//					document.selection.clear();
					alert("확장자가 jpg, gif, jpge 이미지파일만 업로드 하실수 있습니다.");
					return false;
				}
			}
			else if(strFileType.toLowerCase() == "movie")
			{
				if(s_name.toLowerCase() != 'avi' && s_name.toLowerCase() != 'wmv' && s_name.toLowerCase() != 'mpge' && s_name.toLowerCase() != 'asf' && s_name.toLowerCase() != 'swf')
				{
					CheckControlName.select();
//					document.selection.clear();
					alert("확장자가 avi, wmv, mpge, asf, swf 동영상파일만 업로드 하실수 있습니다.");
					return false;
				}
			}
			else
			{
				return true;
			}
		}
		else
		{
			CheckControlName.select();
//			document.selection.clear();
			alert("업로드가 불가능한 파일입니다.\r\n다른 파일을 선택해 주세요.");
			return false;
		}
	}
	return true;
}
//    $(document).ajaxError(
//        function(info, xhr){
//            if(xhr.status == 500){
//                alert(xhr.statusText);
//            }
//        }
//    );
//=====================================================================================
// Made in Korea Finish (JQuery)
//=====================================================================================


//퀵 메뉴
QuickMenu = function(element, startPoint, endPoint) {
 var STATICMENU = element;
 var stmnScrollSpeed = 1;
 var stmnTimer;

 RefreshStaticMenu = function ()
 {
 var stmnStartPoint = parseInt(STATICMENU.style.top, 10);
 var stmnEndPoint = parseInt(document.documentElement.scrollTop, 10)+endPoint;
 var stmnRefreshTimer = 1;

 if ( stmnStartPoint != stmnEndPoint ) {
 stmnScrollAmount = Math.ceil( Math.abs( stmnEndPoint - stmnStartPoint ) / 17 );
 STATICMENU.style.top = parseInt(STATICMENU.style.top, 10) + ( ( stmnEndPoint<stmnStartPoint ) ? -stmnScrollAmount : stmnScrollAmount ) + "px";
 stmnRefreshTimer = stmnScrollSpeed;
 }
 stmnTimer = setTimeout ("RefreshStaticMenu();", stmnRefreshTimer);
 }

 this.InitializeStaticMenu = function ()
 {
 STATICMENU.style.top = startPoint + "px";
 RefreshStaticMenu();
 }
}

