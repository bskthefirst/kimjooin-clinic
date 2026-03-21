jQuery(document).ready(function($) {

	// 슬로건 미 입력시 영역 제거
	$('.slide_slogan .txt_02:empty').hide();

	// ALL_MENU_GNB
	$("#all_menu > a").click(function() {
		$("#all_gnb").slideDown(400);
	})
	$("#all_gnb > .close > a").click(function() {
		$("#all_gnb").slideUp(400);
	})

	// WMUSLIDER
	if ($('.main_slide_box .wmuSliderWrapper article').length == 1) {
		$('.main_slide_box').wmuSlider({
			animation: 'fade',
			animationDuration: 1000,
			slideshow: false,
			slideshowSpeed: 6000,
			navigationControl: true,
			paginationControl: true,
			previousText: 'Previous',
			nextText: 'Next',
			touch: false,
			slide: 'article'
		});
	} else {
		$('.main_slide_box').wmuSlider({
			animation: 'fade',
			animationDuration: 1000,
			slideshow: true,
			slideshowSpeed: 6000,
			navigationControl: true,
			paginationControl: true,
			previousText: 'Previous',
			nextText: 'Next',
			touch: false,
			slide: 'article'
		});
	};

	// GNB Wrapper
	$('.dropdown-content').each(function() {
		$(this).find('a').wrapAll('<div class="lnb">');
	});

	// LNB Five Wrapper
	$('.dropdown-content').each(function() {
		var five = $(this).find('.lnb>a');
		for (var i = 0; i < five.length; i += 5) {
			five.slice(i, i + 5).wrapAll('<div class="five">');
		};
	});

	// Slider Prev-Next
	$('.wmuSliderPrev, .wmuSliderNext').appendTo('.contents_area_1');

		// LNB
		var lnbHideTimer = null;
		var $nav = $('.head_bar_2 .head_cont .nav');

		function positionDropdown($dropdown) {
			var $content = $dropdown.find('.dropdown-content');
			var $btn = $dropdown.find('a.dropbtn');
			var navOffset = $nav.offset();
			var btnOffset = $btn.offset();
			if (!navOffset || !btnOffset) {
				return;
			}

			var navWidth = $nav.outerWidth();
			var wasHidden = !$content.is(':visible');
			if (wasHidden) {
				$content.css({ visibility: 'hidden', display: 'block' });
			}
			var menuWidth = $content.outerWidth();
			if (wasHidden) {
				$content.css({ visibility: '', display: 'none' });
			}

			var targetLeft = btnOffset.left - navOffset.left + ($btn.outerWidth() / 2) - (menuWidth / 2);
			var minLeft = 0;
			var maxLeft = Math.max(0, navWidth - menuWidth);
			var clampedLeft = Math.min(Math.max(targetLeft, minLeft), maxLeft);
			var dropdownLeftInNav = $dropdown.offset().left - navOffset.left;
			var localLeft = clampedLeft - dropdownLeftInNav;

			$content.css({ left: localLeft + 'px' });
		}

		function hideAllDropdowns() {
			$('.dropdown .dropdown-content').stop(true, true).fadeOut(120);
			$('.dropdown a.dropbtn').removeClass('arrow');
		}

		$('.dropdown').on('mouseenter', function(event) {
			event.stopPropagation();
			if (lnbHideTimer) {
				clearTimeout(lnbHideTimer);
				lnbHideTimer = null;
			}
			var $current = $(this);
			hideAllDropdowns();
			positionDropdown($current);
			$current.find('.dropdown-content').stop(true, true).fadeIn(140);
			$current.find('a.dropbtn').addClass('arrow');
		});

		$('.head_bar_2 .head_cont .nav').on('mouseleave', function() {
			if (lnbHideTimer) {
				clearTimeout(lnbHideTimer);
			}
			lnbHideTimer = setTimeout(function() {
				hideAllDropdowns();
			}, 180);
		});

	// 이미지 사이즈 업데이트
	updateImageSize();
	$(window).resize(function() {
		updateImageSize();
	});

	function updateImageSize() {
		var thumb_container = $(".gallery ul li a img");
		thumb_container.each(function() {
			var ratio_cont = $(this).width() / $(this).height();
			var $img = $(this).find("img");
			var ratio_img = $img.width() / $img.height();
			if (ratio_cont > ratio_img) {
				$img.css({
					"width": "100%",
					"height": "auto"
				});
			} else if (ratio_cont < ratio_img) {
				$img.css({
					"width": "auto",
					"height": "100%"
				});
			}
		});
	};

	// 대표번호 감추기 및 이동
	$('.call p.phone').each(function() {
		if ($('.call p.phone span').is(':empty')) {
			$(this).empty();
		}
	});
	$('.call p.fax').each(function() {
		if ($('.call p.fax span').is(':empty')) {
			$(this).empty();
		}
	});

	$('.call').each(function() {
		if ($('.call p.phone').is(':empty') && $('.call p.fax').is(':empty')) {
			$(this).addClass('middle');
		}
	});

	// 클릭메디
	$('#sub_contents meta[name=viewport]').remove();
	$('<meta name="viewport" content="width=device-width, initial-scale=0.5, minimum-scale=0, maximum-scale=1, user-scalable=yes">').insertAfter('#sub_contents meta[name=author]');

});
