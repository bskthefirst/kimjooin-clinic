function FlashActivate ( strFlashUrl , n4Width , n4Height , strWmode , strId , strClassName ) {
	document.writeln( GetFlashActivateString( strFlashUrl , n4Width , n4Height , strWmode , strId , strClassName ) );
}

function GetFlashActivateString ( strFlashUrl , n4Width , n4Height , strWmode , strId , strClassName ) {
	//width,height 여부 & 묶음 (width,height가 없을때는 0 으로 선언)
	var objSize_attribute = "";
	var objId_attribute = "";
	var objId_IE_attribute = "";
	var className_attribute = "";
	var wmode_param = "";
	var wmode_attribute = "";

	
	if (n4Width != 0) {
		objSize_attribute = " width='"+ n4Width +"' height='"+ n4Height +"'";
	} 
	//id 여부 (ID 셀렉렉터가 없을경우 0으로선언)
	if (strId != 0) {
		objId_attribute = " id='" + strId + "'";
		objId_IE_attribute = " id='" + strId + "'";
	} 
	//class 여부 (class가 없을때는 0 으로 선언)
	if (strClassName != 0) {
		className_attribute = " class='" + strClassName + "'";
	} 
	//wmode 여부 (wmode가 없을때는 0 으로 선언)
	if (strWmode != 0) {
		wmode_param = "<param name='wmode' value='" + strWmode + "' />";
		wmode_attribute = " wmode='" + strWmode + "'";
	} 
	
	var textToWrite = "<object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='https://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0' " + objSize_attribute + objId_IE_attribute + className_attribute + ">\n";
	textToWrite += "<param name='movie' value='"+ strFlashUrl +"' />\n";
	textToWrite += "<param name='quality' value='high' />\n";
	textToWrite += "<param name=bgcolor value='#FFFFFF'>\n";
	textToWrite += "<param name='allowScriptAccess' value='always' />\n";
	textToWrite += wmode_param+"\n";
	textToWrite += "<!-- Hixie method -->\n";
	textToWrite += "<!--[if !IE]> <-->\n";
	textToWrite += "<object type='application/x-shockwave-flash' bgcolor='#FFFFFF' data='"+ strFlashUrl +"'" + objSize_attribute + objId_attribute + wmode_attribute + className_attribute + "></object>\n";
	textToWrite += "<!--> <![endif]-->\n";
	textToWrite += "</object>\n";

	return 	textToWrite;
}

// Common플래시
function SetCommonFlashObject(src, width, Height, loop, quality, wmode, bgcolor, FlashVars)
{
    var strflash;

    strflash = "";

    strflash = strflash + "<object type='application/x-shockwave-flash' classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0' width='" + width + "' height='" + Height + "' align='middle'>";
    strflash = strflash + "<param name='movie' value='" + src + "'>";
	strflash = strflash + "<param name='scale' value='noscale'>";
	strflash = strflash + "<param name='allowScriptAccess' value='sameDomain'>";
	strflash = strflash + "<param name='allowFullScreen' value='false'>";
    strflash = strflash + "<param name='loop' value='" + loop + "'>";
    strflash = strflash + "<param name='quality' value='" + quality + "'>";
    strflash = strflash + "<param name='wmode' value='" + wmode + "'>";
    strflash = strflash + "<PARAM NAME='FlashVars' Value='" + FlashVars + "'>";
    strflash = strflash + "<embed src='" + src + "' flashvars='" + FlashVars + "' scale='noscale' loop='" + loop + "' quality='" + quality + "' wmode='" + wmode + "' bgcolor='" + bgcolor + "' width='" + width + "' height='" + Height + "' allowScriptAccess='sameDomain' allowFullScreen='false' type='application/x-shockwave-flash' pluginspage='http://www.adobe.com/go/getflashplayer'>";
    strflash = strflash + "</object>";

    document.write(strflash);
}


// Common동영상
function SetCommonMovieObject(id, FileName, width, Height, AutoStart, ShowControls, ShowDisplay, ShowGotoBar)
{
    var strmovie;

    strmovie = "";

    strmovie = strmovie + "<object id=" + id + " classid='clsid:22D6F312-B0F6-11D0-94AB-0080C74C7E95' codebase='http://activex.microsoft.com/activex/controls/mplayer/en/nsmp2inf.cab#Version=6,4,5,715' width='" + width + "' height='" + Height + "'>";
    strmovie = strmovie + "<param name='FileName' value='" + FileName + "'>";
    strmovie = strmovie + "<PARAM NAME='AutoStart' Value='" + AutoStart + "'>";
    strmovie = strmovie + "<param name='ShowControls' value='" + ShowControls + "'>";
    strmovie = strmovie + "<param name='ShowDisplay' value='" + ShowDisplay + "'>";
    strmovie = strmovie + "<param name='ShowGotoBar' value='" + ShowGotoBar + "'>";
    strmovie = strmovie + "<embed src='" + FileName + "' pluginspage='http://www.microsoft.com/Windows/Downloads/Contents/Products/MediaPlayer/' width='" + width + "' height='" + Height + "'></embed>";
    strmovie = strmovie + "</object>";

    document.write(strmovie);
}

function makeFlashObject(swfURL,w,h,id,flashVars,wmode){
	var swfHTML = ('<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0" width="'+ w +'" height="'+h+'" id="'+id+'" align="middle">');
	swfHTML+=('<param name="allowScriptAccess" value="sameDomain" />');
	swfHTML+=('<param name="FlashVars" value="'+ flashVars +'"/>');
	swfHTML+=('<param name="menu" value="false"/>');
	swfHTML+=('<param name="wmode" value="transparent"/>');
//	swfHTML+=('<param name="wmode" value="'+wmode+'"/>');
	swfHTML+=('<param name="movie" value="'+swfURL+'" /><param name="quality" value="high" /><param name="salign" value="lt" />');
	swfHTML+=('<embed menu="false" src="'+ swfURL +'"  quality="high" FlashVars="'+flashVars+'" wmode="transparent" width="'+w+'" height="'+h+'" name="'+id+'" align="middle" salign="lt" allowScriptAccess="sameDomain" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />');
	swfHTML+=('</object>');
	document.write(swfHTML);
}

