layui.define(function(exports){
	var Dict = {
		showDictSelect: function(id, type, all) {
			var data = this.getDict(type);
			var select = $("#" + id);
			select.empty();

			if (all != undefined || all) {
				select.append("<option value=''>全部</option>");
			}

			$.each(data, function(k, v) {
				select.append("<option value ='" + k + "'>" + v + "</option>");
			});

			return data;		
		},
		getDict: function(type) {
			var v = sessionStorage[type];
			if (v == null || v == "") {
				$.ajax({
					type : 'get',
					url : '/dicts?type=' + type, // @TODO 接口无效
					async : false,
					success : function(data) {
						v = {};
						$.each(data, function(i, d) {
							v[d.k] = d.val;
						});

						sessionStorage[type] = JSON.stringify(v);
					}
				});
			}

			return JSON.parse(sessionStorage[type]);
		}
	}

	exports('dict', Dict)
})

