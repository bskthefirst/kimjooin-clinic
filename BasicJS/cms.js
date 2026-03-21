
var cms={};

cms={
	// ��
	tab: function(options) {
		// Default Options
		var defaults = {
			"tabs": null,
			"activeClass": "on",
			"firstLoadTab": null,
			"callback": null
		};
        var options = $.extend(defaults, options);

		options.tabs.on("click.eventCustom", function(event) {
			var target = $(this).attr("href");

			$.each(options.tabs, function(i) {
				var targets = options.tabs.eq(i).attr("href");

				options.tabs.eq(i).parents().removeClass(options.activeClass);

				$(targets).hide();
			});

			$(target).show();
			$(this).parent().addClass(options.activeClass);

			// 湲곕낯 event 痍⑥냼
			event.preventDefault() ? event.preventDefault() : event.returnValue = false;

			// 肄쒕갚 �몄텧
			if ( typeof(options.callback) == "function" ) {
				options.callback.call( $(this) );
			};
		});

		// 湲곕낯 �쒖꽦�� ��
		if (options.firstLoadTab !== null) {
			$(options.firstLoadTab).trigger("click.eventCustom");
		};

		return this;
	}
};


$(function () {
	var hash = window.location.hash;
	var loadTab = $(".find_sub_tab span a").first();
	var reg = /tab/g;
	var idx = 0;
	var length = 0;

	if (reg.test(hash)) {
		idx = parseInt(hash.replace(/[^0-9]/g, ''), 10);
		idx = idx - 1;
		length = $(".find_sub_tab span a").size();

		if (idx < 0 || idx > length || isNaN(idx)) {
			idx = 0;
		};

		loadTab = $(".find_sub_tab span a").eq(idx);
	};

	cms.tab({
		"tabs": $(".find_sub_tab span a"),
		"activeClass": "on",
		"firstLoadTab": loadTab
	});
});
