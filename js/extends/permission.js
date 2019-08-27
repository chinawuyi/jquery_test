layui.define('jquery', function(exports) {
	var $ = layui.jquery
	var pers = []
	var Permission = {
		checkPermission: function() {
			if (pers.length > 0) {
				return pers
			}
			else {
				$.ajax({
					type : 'get',
					url : '/management/v1/permissions/owns',
					contentType : "application/json; charset=utf-8",
					async : false,
					success : function(data) {
						pers = data;
						$("[permission]").each(function() {
							var per = $(this).attr("permission");
							if ($.inArray(per, data) < 0) {
								$(this).hide();
							}
						});
					}
				});
				return pers;
			}
		},
		// 检查页面中需要校验权限的dom元素
		checkDom: function(layid) {
			var perlist = this.checkPermission()
			var dom = (layid ? $('button, a', $('[lay-id="' + layid + '"]')) : $('button, a'))
			dom.each(function(idx, el){
				var permission = $(el).attr('permission')
				if (permission && perlist.indexOf(permission) != -1) {
					$(this).removeClass('hide')
				}
			})
		}
	}

	exports('permission', Permission)
})