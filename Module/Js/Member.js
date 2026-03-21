// 관리자 회원 목록의 등급 변경
	var MemberGradeChange_Script = function(){
			var Grade = $(this).val();
			var IndexNumber = $("select[name=MemberGrade]").index($(this));
			var ID = $("input[name=ID]").eq(IndexNumber).val();

			$.ajax({
				type : "post",
				url : "/Module/Member/Ajax_MemberGradeChange.asp",
				data : "ID=" + ID + "&Grade=" + Grade,
				dataType : "text",
				complete: function( res, status ) {
					if ( status === "success" || status === "notmodified" ) {
						var Result = res.responseText;

						if(Result == 0){
							alert(ID + "의 회원 등급이 변경됐습니다.");
						}else{
							alert("등급 변경 중 오류가 발생했습니다.");
						}
					}else{
						alert(status);
					}
				}
			});
		};

//=====================================================================================================
// MemberWrite.html Start
//=====================================================================================================
	var MemberWriteDocumentReady = function(){
		$("#Name").focus();

		if(PState == "Modify"){
			$(".ReadOnly").attr({ readonly: true });
		}else{
			$("#ID").keyup(
				function(){
					IDOverlapCheck(this.value);
				}
			);
		}

//		$.validator.messages.required = "";
//
//		$("form[name=WriteForm]").validate({
//			rules: {
//				Pwd2: { equalTo: "#Pwd1" },
//				Email: { email: true }
//			},
//			messages: {
//				Pwd2: { equalTo: "비밀번호와 비밀번호 확인의 입력값이 다릅니다." },
//				Email: { email: "올바른 이메일 형식이 아닙니다." }
//			}
//		});
	};

	function IDOverlapCheck(InputValue){
		var InputValue = $.trim(RemoveNull(InputValue));

		if(InputValue.length > 4){
			if(!chkPatten("ID", "idCheck")){
				alert("아이디는 영문으로 시작하고 영문, 숫자로 구성된 5자이상 12자 이하의 조합이여야 합니다.");
				return;
			}

			$.ajax({
				type : "post",
				url : "/Module/Member/Ajax_IDOverlapCheck.asp",
				data : "ID=" + InputValue,
				dataType : "text",
				complete: function( res, status ) {
					if ( status === "success" || status === "notmodified" ) {
						if(res.responseText == ""){
							$("#IDOverlapResult").html("아이디를 입력해 주세요.")
						}else if(res.responseText == "0"){
							$("#IDOverlapResult").html("사용 가능한 아이디입니다.")
						}else{
							$("#IDOverlapResult").html("이미 사용중인 아이디입니다.")
						}
					}else{
						alert(status);
					}
				}
			});
		}else{
			$("#IDOverlapResult").html("");
		}
	}

	function fnIDCheckProc(){
		if(!FieldCheckAlert("ID", "아이디를 입력하세요.", "input", "Y")){ return false; }
		if(!chkPatten("ID", "idCheck")){
			alert("아이디는 영문으로 시작하고 영문, 숫자로 구성된 5자이상 12자 이하의 조합이여야 합니다.");
			return false;
		}
		
		var p = document.WriteForm;
		var ID = p.ID.value;
		IframeProc.location.href = "MemberIDCheckProc.asp?strmode=MemberIDCheck&ID=" + ID;
	}

	function WriteCheck(){

		var check_pstate_value = $("#PState").val().toLowerCase();

		if($("#PState").val() == "write")
		{
			var CHECK_01 = $(":input:radio[name=AgreeYN1]:checked");
			if(!FieldCheckAlert("AgreeYN1", "이용약관에 여부를 선택하세요.", "radio", "Y")){ return false; }
			if (CHECK_01.val() != "Y")
			{
				alert("이용약관에 동의하셔야 합니다.");
				CHECK_01.focus();
				return false;
			}

			var CHECK_02 = $(":input:radio[name=AgreeYN2]:checked");
			if(!FieldCheckAlert("AgreeYN2", "개인정보 수집 및 이용에 대한 동의 여부를 선택하세요.", "radio", "Y")){ return false; }
			if (CHECK_02.val() != "Y")
			{
				alert("개인정보 수집 및 이용에 대한 동의를 하셔야 합니다.");
				CHECK_02.focus();
				return false;
			}
			/** 수집한 개인정보의 위탁처리(선택) 메뉴 추가 2015 11 12**/
			var CHECK_03 = $(":input:radio[name=AgreeYN3]:checked");
			if(!FieldCheckAlert("AgreeYN3", "수집한 개인정보의 위탁처리에 대한 동의 여부를 선택하세요.", "radio", "Y")){ return false; }
		}

		if(!FieldCheckAlert("Name", "이름을 입력하세요.", "input", "Y")){ return false; }
		if(!FieldCheckAlert("ID", "아이디를 입력하세요.", "input", "Y")){ return false; }

		if (check_pstate_value != "modify")
		{
			if(!chkPatten("ID", "idCheck")){
				alert("아이디는 영문으로 시작하고 영문, 숫자로 구성된 5자이상 12자 이하의 조합이여야 합니다.");
				return false;
			}

			if(!FieldCheckAlert("ReID", "아이디 중복 확인 하시기 바랍니다.", "input", "Y")){ return false; }

			if(ReturnFieldValue("ReID", "input") != ReturnFieldValue("ID", "input")){
				alert("아이디 중복확인이 올바르지 않습니다.\n다시 중복확인 하시기 바랍니다.");
				return false;
			}
		}

		/*
		if(!FieldCheckAlert("BirthYear", "생년월일을 입력하세요.", "select", "Y")){ return false; }
		if(!FieldCheckAlert("BirthMonth", "생년월일을 입력하세요.", "select", "Y")){ return false; }
		if(!FieldCheckAlert("BirthDay", "생년월일을 입력하세요.", "select", "Y")){ return false; }
		if(!FieldCheckAlert("Sex", "성별을 입력하세요.", "radio", "Y")){ return false; }
		*/

		if(!FieldCheckAlert("Email", "이메일을 입력하세요.", "input", "Y")){ return false; }

		if(!chkPatten("Email", "mailCheck")){
			alert("올바른 이메일 형식이 아닙니다.");
			return false;
		}

		/**********************************************
		# 비밀번호 작성규칙 변경 (2015.03.11)
		# http://lib.drline.net/js/McircleCommon.js
		***********************************************/
		var blockList = [document.getElementById("ID").value, $("#BirthMonth").val() + $("#BirthDay").val()];
		if (!MCheckPassword(document.getElementById("Pwd1").value, "L", blockList)) {
			document.getElementById("Pwd1").focus();
			return false;
		}

		if(ReturnFieldValue("Pwd1", "input") != ReturnFieldValue("Pwd2", "input")){
			alert("비밀번호와 비밀번호 확인의 입력값이 다릅니다.");
			return false;
		}

		return true;
	}
//=====================================================================================================
// MemberWrite.html Finish
//=====================================================================================================

//=====================================================================================================
// IDSearch.html, PWDSearch.html Start
//=====================================================================================================
	var IDPwdSearchDocumentReady = function(){
		$.validator.setDefaults({
			onkeyup: false,
			onclick: false,
			onfocusout: false,
			showErrors: function(errorMap, errorList){
				if(errorList.length > 0){
					alert(errorList[0].message);
				}
			}
		});

		$.validator.messages.required = "";

		$("form[name=BirthSearchForm]").validate({
			rules: {
				Name: { required: true },
				BirthYear: { required: true },
				BirthMonth: { required: true },
				BirthDay: { required: true },
				Sex: { required: true }
			},
			messages: {
				Name: { required: "이름을 입력하세요." },
				BirthYear: { required: "생일을 입력하세요." },
				BirthMonth: { required: "생일을 입력하세요." },
				BirthDay: { required: "생일을 입력하세요." },
				Sex: { required: "성별을 입력하세요." }
			}
		});

		$("form[name=EmailSearchForm]").validate({
			rules: {
				Name: { required: true },
				Email: { required: true, email: true }
			},
			messages: {
				Name: { required: "이름을 입력하세요." },
				Email: { required: "이메일을 입력하세요.", email: "이메일 형식이 올바르지 않습니다." }

			}
		});
	}

	function BirthSearhCheck()
	{
		if ($("input[name=Name]").eq(0).val() == "")
		{
			alert("이름을 입력하세요.");
			$("input[name=Name]").eq(0).focus();
			return false;	
		}

//		if(!FieldCheckAlert("Name", "이름을 입력하세요.", "input", "Y")){ return false; }
		if(!FieldCheckAlert("BirthYear", "생일 년도를 선택하세요.", "select", "Y")){ return false; }
		if(!FieldCheckAlert("BirthMonth", "생일 월 선택하세요.", "select", "Y")){ return false; }
		if(!FieldCheckAlert("BirthDay", "생일 일을 선택하세요.", "select", "Y")){ return false; }
		if(!FieldCheckAlert("Sex", "성별을 선택하세요.", "radio", "Y")){ return false; }
//		return true;
	}

	function EmailSearchCheck(){		
		if ($("input[name=Name]").eq(1).val() == "")
		{
			alert("이름을 입력하세요.");
			$("input[name=Name]").eq(1).focus();
			return false;	
		}
//		if(!FieldCheckAlert("Name", "이름을 입력하세요.", "input", "Y")){ return false; }
		if(!FieldCheckAlert("Email", "이메일을 입력하세요.", "input", "Y")){ return false; }
//		return true;
	}
//=====================================================================================================
// IDSearch.html, PWDSearch.html Finish
//=====================================================================================================

//=====================================================================================================
// PWDChange.html Start
//=====================================================================================================
	var PWDChangeDocumentReady = function(){
		$.validator.setDefaults({
			onkeyup: false,
			onclick: false,
			onfocusout: false,
			showErrors: function(errorMap, errorList){
				if(errorList.length > 0){
					alert(errorList[0].message);
				}
			}
		});

		$("form[name=ChangeForm]").validate({
			rules : {
				PWD1: { required: true },
				PWD2: {
					required: true,
					equalTo: "#PWD1"
				}
			},
			messages: {
				PWD1: { required: "비밀번호를 입력하세요." },
				PWD2: {
					required: "비밀번호 확인을 입력하세요.",
					equalTo: "비밀번호와 비밀번호 확인을 입력값이 일치하지 않습니다."
				}
			}
		});
	};
//=====================================================================================================
// PWDChange.html Finish
//=====================================================================================================

	function PasswordPreCheck(){
		if($("#userPwd").val() == "")
		{
			alert("비밀번호를 입력하세요.");
			$("#userPwd").focus();
			return false;	
		}
		return true;
	}