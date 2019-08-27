layui.define(function(exports) {
	var ztreeMenu = {
		getMenuTree: function() {
			var root = {
				id : 0,
				name : "root",
				open : true,
			};
			var that = this;

			$.ajax({
				type : 'get',
				url : '/management/v1/permissions/all',
				contentType : "application/json; charset=utf-8",
				async : false,
				success : function(data) {
					var length = data.length;
					var children = [];
					for (var i = 0; i < length; i++) {
						var d = data[i];
						var node = that.createNode(d);
						children[i] = node;
					}

					root.children = children;
				}
			});

			return root;
		},

		initMenuDatas: function(roleId){
			var that = this;
			$.ajax({
				type : 'get',
				url : '/management/v1/permissions/rolePermissions/' + roleId,
				success : function(data) {
					var length = data.length;
					var ids = [];
					for(var i=0; i<length; i++){
						ids.push(data[i]['id']);
					}
					
					that.initMenuCheck(ids);
				}
			});
		},

		initMenuCheck: function(ids) {
			var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
			var length = ids.length;
			if(length > 0){
				var node = treeObj.getNodeByParam("id", 0, null);
				treeObj.checkNode(node, true, false);
			}
			
			for(var i=0; i<length; i++){
				var node = treeObj.getNodeByParam("id", ids[i], null);
				treeObj.checkNode(node, true, false);
			}
			
		},

		getCheckedMenuIds: function(){
			var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
			var nodes = treeObj.getCheckedNodes(true);
			
			var length = nodes.length;
			var ids = [];
			for(var i=0; i<length; i++){
				var n = nodes[i];
				var id = n['id'];
				ids.push(id);
			}
			
			return ids;
		},

		createNode: function(d) {
			var id = d['id'];
			var pId = d['parentId'];
			var name = d['name'];
			var child = d['child'];

			var node = {
				open : true,
				id : id,
				name : name,
				pId : pId,
			};

			if (child != null) {
				var length = child.length;
				if (length > 0) {
					var children = [];
					for (var i = 0; i < length; i++) {
						children[i] = this.createNode(child[i]);
					}

					node.children = children;
				}

			}
			return node;
		},

		initParentMenuSelect: function(){
			$.ajax({
		        type : 'get',
		        url : '/management/v1/permissions/parents',
		        async : false,
		        success : function(data) {
		            var select = $("#parentId");
		            select.append("<option value='0'>root</option>");
		            for(var i=0; i<data.length; i++){
		                var d = data[i];
		                var id = d['id'];
		                var name = d['name'];
		                
		                select.append("<option value='"+ id +"'>" +name+"</option>");
		            }
		        }
		    });
		},

		getSettting: function() {
			var setting = {
				check : {
					enable : true,
					chkboxType : {
						"Y" : "ps",
						"N" : "ps"
					}
				},
				async : {
					enable : true,
				},
				data : {
					simpleData : {
						enable : true,
						idKey : "id",
						pIdKey : "pId",
						rootPId : 0
					}
				},
				callback : {
					onCheck : this.zTreeOnCheck
				}
			};

			return setting;
		},

		zTreeOnCheck: function(event, treeId, treeNode) {
		//	console.log(treeNode.id + ", " + treeNode.name + "," + treeNode.checked
		//			+ "," + treeNode.pId);
		//	console.log(JSON.stringify(treeNode));
		}
	}

	exports('ztreeMenu', ztreeMenu)
})