layui.use(['common', 'table', 'layer', 'dict', 'permission', 'rate'], function () {
	var common = layui.common
	var layer = layui.layer
	var dict = layui.dict
	var rate = layui.rate
	var permission = layui.permission
	var table = layui.table
	var form = layui.form
	var dropDownList = {
		genderList: {},
		recruitmentChannelsList: {},
		cityList: {},
		licenseTypeList: {},
		drivingAgeList: {},
		isCertificateAList: {},
		auditStatusList: {},
	}
  var driverList = {
    tableObj: null,
    eventFun: {
		addLayer: function (action, options, titleName) {
			if (options) {
				action = $.addUrlPro(action, options)
			}
			layer.open({
				type: 2,
				title: titleName || '司机',
				content: action,
				area: ['900px', ($(window).height() - 80) + 'px'],
				maxmin: true
			})
		},
    },
    getSelectData: function () {
		var _this = this
		// 性别
		$.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode', {
			'categoryCode': 'gender'.toUpperCase(),
		}, function (res) {
			if (res.code == 0) {
				$.appendSelect('gender', res.content, 'value', 'name')
				form.render('select')
				res.content.forEach(function (ele) {
					dropDownList.genderList[ele.value] = ele.name
				})
			}
		})
		// 招募渠道
		$.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode', {
			'categoryCode': 'recruitment_channels'.toUpperCase(),
		}, function (res) {
			if (res.code == 0) {
				$.appendSelect('recruitmentChannels', res.content, 'value', 'name')
				form.render('select')
				res.content.forEach(function (ele) {
					dropDownList.recruitmentChannelsList[ele.value] = ele.name
				})
			}
		})
		// 工作城市
		$.postApi('/management/v1/businesscity/cityList', {
			'type': '2'
		}, function (res) {
			if (res.code == 0) {
				$.appendSelect('city', res.content, 'code', 'name')
				form.render('select')
				res.content.forEach(function (ele) {
					dropDownList.cityList[ele.code] = ele.name
				})
			}
		})
		// 驾驶证类型
		$.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode', {
			'categoryCode': 'license_type'.toUpperCase(),
		}, function (res) {
			if (res.code == 0) {
				$.appendSelect('licenseType', res.content, 'value', 'name')
				form.render('select')
				res.content.forEach(function (ele) {
					dropDownList.licenseTypeList[ele.value] = ele.name
				})
			}
		})
		// 驾龄
		$.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode', {
			'categoryCode': 'driving_age'.toUpperCase(),
		}, function (res) {
			if (res.code == 0) {
				$.appendSelect('drivingAge', res.content, 'value', 'name')
				form.render('select')
				res.content.forEach(function (ele) {
					dropDownList.drivingAgeList[ele.value] = ele.name
				})
			}
		})
		// 网约车资格证
		$.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode', {
			'categoryCode': 'is_certificate_a'.toUpperCase(),
		}, function (res) {
			if (res.code == 0) {
				$.appendSelect('isCertificateA', res.content, 'value', 'name')
				form.render('select')
				res.content.forEach(function (ele) {
					dropDownList.isCertificateAList[ele.value] = ele.name
				})
			}
		})
		// 招募状态
		$.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode', {
			'categoryCode': 'audit_status'.toUpperCase(),
		}, function (res) {
			if (res.code == 0) {
				$.appendSelect('auditStatus', res.content, 'value', 'name')
				form.render('select')
				res.content.forEach(function (ele) {
					dropDownList.auditStatusList[ele.value] = ele.name
				})
				driverList.getData()
			}
		})
    },
	closeLayer: function () {
		var index = parent.layer.getFrameIndex(window.name)
		parent.layer.close(index);
		this.searchEvent();
	},
    searchEvent: function () {
		this.tableObj.reload({
			where: {
				name: $('#name').val() == '' ? null : $('#name').val(),
				gender: $('#gender').val() == '' ? null : parseInt($('#gender').val()),
				phone: $('#phone').val() == '' ? null : $('#phone').val(),
				recruitmentChannels: $('#recruitmentChannels').val() == '' ? null : $('#recruitmentChannels').val(),
				city: $('#city').val() == '' ? null : $('#city').val(),
				licenseType: $('#licenseType').val() == '' ? null : $('#licenseType').val(),
				drivingAge: $('#drivingAge').val() == '' ? null : parseInt($('#drivingAge').val()),
				isCertificateA: $('#isCertificateA').val() == '' ? null : $('#isCertificateA').val()==1?true:false,
				auditStatus: $('#auditStatus').val() == '' ? null : $('#auditStatus').val(),
			},
			page: {
				curr: 1
			}
		})
    },
    defaultEvent: function () {
		var _this = this
		$('#searchBt').click(function () {
			_this.searchEvent()
		})
    },
    getData: function () {
		//第一个实例
		this.tableObj = table.render({
			elem: '#demo',
			height: 530,
			url: '/management/v1/driver/recruit/list',
			method: 'post',
			contentType: 'application/json',
			page: true,
			request: {
				pageName: 'pageIndex',
				limitName: 'pageSize'
			},
			parseData: function (res) {
				return {
					'code': res.code, //解析接口状态
					'msg': res.message, //解析提示文本
					'count': res.content.total, //解析数据长度
					'data': res.content.data //解析数据列表
				}
			},
			cols: [[
				{field: 'name', title: '司机姓名',sort: false, },
				{field: 'gender', title: '性别', sort: false, templet:function(d){
					return d.gender == 1 ?'男':'女'
				}},
				{field: 'phone', title: '司机手机号', sort: false},
				{
					field: 'recruitmentChannels', title: '招募渠道',sort: false,templet:function(d){
						return d.recruitmentChannels!=null?dropDownList.recruitmentChannelsList[d.recruitmentChannels]:""
					}
				},
				{
					field: 'city', title: '工作城市', sort: false,templet:function(d){
						return d.city?dropDownList.cityList[d.city]:""
					}
				},
				{
					field: 'licenseType', title: '驾驶证类型',sort: false
				},
				{
					field: 'drivingAge', title: '驾龄', sort: false, templet:function(d){
						return d.drivingAge!=null?dropDownList.drivingAgeList[d.drivingAge]:""
					}
				},
				{
					field: 'isCertificateA', title: '网络预约出租车驾驶员资格证',sort: false, templet:function(d){
						return d.isCertificateA!=null?(d.isCertificateA?'有':'没有'):""
					}
				},
				{
					field: 'auditStatus', title: '招募状态', sort: false, templet: function (d) {
					// 1：待邀约; 2:待面试;3:待路考;4:待培训;5:待签约;6:已签约;0:招募不通过;-1:已解约
					switch (d.auditStatus){
						case 1: 
							return '待邀约';
							break;
						case 2:
							return '待面试';
							break;
						case 3:
							return '待路考';
							break;
						case 4:
							return '待培训';
							break;
						case 5:
							return '待签约';
							break;
						case 6:
							return '已签约';
							break;
						case 0:
							return '招募不通过';
							break;
						case -1:
							return '已解约';
							break;
					}
					}
				},
				{
					field: '', title: '操作', width: '250', sort: false, templet: function (d) {
					// 1：待邀约; 2:待面试;3:待路考;4:待培训;5:待签约;6:已签约;0:招募不通过;-1:已解约
					let html = '<button class="layui-btn layui-btn-xs" lay-event="ele_show" ><i class="layui-icon">&#xe615;</i> 查看</button>' ;
					switch (d.auditStatus){
						case 1: 
							return html+
								'<button class="layui-btn layui-btn-xs" lay-event="ele_notice_interview" ><i class="layui-icon">&#xe645;</i> 通知面试</button>' +
								'<button class="layui-btn layui-btn-xs" lay-event="ele_cancel" ><i class="layui-icon">&#xe645;</i> 取消面试</button>';
							break;
						case 2:
							return html+
								'<button class="layui-btn layui-btn-xs" lay-event="ele_interview" ><i class="layui-icon">&#xe645;</i> 面试</button>' +
								'<button class="layui-btn layui-btn-xs" lay-event="ele_cancel" ><i class="layui-icon">&#xe645;</i> 取消面试</button>';
							break;
						case 3:
							return html+
								'<button class="layui-btn layui-btn-xs" lay-event="ele_roadTest" ><i class="layui-icon">&#xe645;</i> 路考</button>' +
								'<button class="layui-btn layui-btn-xs" lay-event="ele_cancel" ><i class="layui-icon">&#xe645;</i> 取消路考</button>';
							break;
						case 4:
							return html+
								'<button class="layui-btn layui-btn-xs" lay-event="ele_train" ><i class="layui-icon">&#xe645;</i> 培训</button>' +
								'<button class="layui-btn layui-btn-xs" lay-event="ele_cancel" ><i class="layui-icon">&#xe645;</i> 取消培训</button>';
							break;
						case 5:
							return html+
								'<button class="layui-btn layui-btn-xs" lay-event="ele_sign" ><i class="layui-icon">&#xe645;</i> 签约</button>' +
								'<button class="layui-btn layui-btn-xs" lay-event="ele_cancel" ><i class="layui-icon">&#xe645;</i> 取消签约</button>';
							break;
						case 6:
							return html+
								'<button class="layui-btn layui-btn-xs" lay-event="ele_uploadImg"><i class="layui-icon">&#xe642;</i> 上传照片</button>';
							break;
						case 0:
							return html;
							break;
						case -1:
							return html+
								'<button class="layui-btn layui-btn-xs" lay-event="ele_recruitment"><i class="layui-icon">&#xe642;</i> 重新招募</button>';
							break;
						default:
							return html;
							break;
					}
					//   return '' +
						
					//     '<button class="layui-btn layui-btn-xs" lay-event="ele_show_interview" ><i class="layui-icon">&#xe642;</i> 面试</button>' +
					//     '<button class="layui-btn layui-btn-xs" lay-event="ele_update"><i class="layui-icon">&#xe642;</i> 路考</button>' +
					//     '<button class="layui-btn layui-btn-xs" lay-event="ele_roadTest_cancel"><i class="layui-icon">&#xe645;</i> 取消路考</button>' +
					//     '<button class="layui-btn layui-btn-xs" lay-event="ele_train"><i class="layui-icon">&#xe642;</i> 培训</button>' +
					//     '<button class="layui-btn layui-btn-xs" lay-event="ele_train_cancel"><i class="layui-icon">&#xe645;</i> 取消培训</button>' +
					//     '<button class="layui-btn layui-btn-xs" lay-event="ele_sign"><i class="layui-icon">&#xe642;</i> 签约</button>' +
					//     '<button class="layui-btn layui-btn-xs" lay-event="ele_sign_cancel"><i class="layui-icon">&#xe645;</i> 取消签约</button>' +

					//     '<button class="layui-btn layui-btn-xs" lay-event="ele_uploadImg"><i class="layui-icon">&#xe642;</i> 上传照片</button>' +
					//     '<button class="layui-btn layui-btn-xs" lay-event="ele_recruitment"><i class="layui-icon">&#xe642;</i> 重新招募</button>'
					}
				}
			]],
			toolbar: '#toolbarDemo',
		})

    },
	//取消招募
	cancelRecruitment:function(data){
		 // 1：待邀约; 2:待面试;3:待路考;4:待培训;5:待签约;6:已签约;0:招募不通过;-1:已解约
		let status = '';
		switch (data.auditStatus){
			case 1: 
					status = '面试';
					break;
			case 2:
					status = '面试';
					break;
			case 3:
					status = '路考';
					break;
			case 4:
					status = '培训';
					break;
			case 5:
					status = '签约';
					break;
		}
		layer.open({
			title: '确认',
			content: '请确认'+data.name+'无法参加'+status+'，则需要取消'+status,
			yes: function(index,layero)
			{
				$.postApi('/management/v1/driver/recruit/cancel',{
					"driverId": data.driverId
				},function(res){
					if (res.code == 0) { 
						layer.msg(res.message);
						window.setTimeout(function(){
							layer.close(layer.index);
							driverList.searchEvent();
						},500)
					}else{
						layer.msg(res.message)
					}
				});
			}
		});
	},
	//重新招募
	reRecruit:function(data){
		 // 1：待邀约; 2:待面试;3:待路考;4:待培训;5:待签约;6:已签约;0:招募不通过;-1:已解约
		let status = '';
		switch (data.auditStatus){
			case 1: 
					status = '面试';
					break;
			case 2:
					status = '面试';
					break;
			case 3:
					status = '路考';
					break;
			case 4:
					status = '培训';
					break;
			case 5:
					status = '签约';
					break;
		}
		layer.open({
			title: '确认',
			content: '请确认重新招募司机'+data.name,
			yes: function(index,layero)
			{
				$.postApi('/management/v1/driver/recruit/reRecruit',{
					"driverId": data.driverId
				},function(res){
					if (res.code == 0) { 
						layer.msg(res.message);
						window.setTimeout(function(){
							layer.close(layer.index);
							driverList.searchEvent();
						},500)
					}else{
						layer.msg(res.message)
					}
					
				});
			}
		});
	},
	// 通知面试
	noticeInterview:function(data){
		layer.open({
			title: '确认',
			content: '请确认您已通知'+data.name+'招募司机面试，并已告知其面试时间、地点及相关准备材料。',
			yes: function(index,layero)
			{
				$.getApi('/management/v1/driver/recruit/notice/interview/' + data.driverId, {
				}, function (res) {
					if (res.code == 0) { 
						layer.msg(res.message);
						window.setTimeout(function(){
							layer.close(layer.index);
							driverList.searchEvent();
						},500)
					}else{
						layer.msg(res.message)
					}
				})
			}
		});
	},
    toolBar: function () {
		var _this = this
		table.on('toolbar(test)', function (obj) {
			switch (obj.event) {
				case 'add':
					_this.eventFun.addLayer('./driver_recruitment_add.html', null,'招募司机')
					break
				case 'import':
					_this.eventFun.addLayer('./driver_recruitment_import.html', null, '导入招募司机')
				default:
			}

		})
      	table.on('tool(test)', function (obj) {
			if (obj.event == 'ele_show') {
				// 查看资料
				_this.eventFun.addLayer('./driver_recruitment_add.html', {
					'driverId': obj.data.driverId,
					'readonly': 'readonly',
					'status':obj.data.auditStatus
				}, '查看司机信息')
			} else if (obj.event == 'ele_notice_interview') {
				_this.noticeInterview(obj.data);
			} else if (obj.event == 'ele_cancel') {
				_this.cancelRecruitment(obj.data);
			} else if (obj.event == 'ele_interview') {
				// 面试
				_this.eventFun.addLayer('./driver_recruitment_add.html', {
					'driverId': obj.data.driverId,
					'tabId': 'tab2',
					'status':obj.data.auditStatus
				}, '招募司机')
			} else if (obj.event == 'ele_roadTest') {
				// 路考
				_this.eventFun.addLayer('./driver_recruitment_add.html', {
					'driverId': obj.data.driverId,
					'tabId': 'tab3',
					'status':obj.data.auditStatus
				}, '招募司机')
			} else if (obj.event == 'ele_train') {
				// 培训
				_this.eventFun.addLayer('./driver_recruitment_add.html', {
					'driverId': obj.data.driverId,
					'tabId': 'tab4',
					'status':obj.data.auditStatus
				}, '招募司机')
			} else if (obj.event == 'ele_sign') {
				// 签约
				_this.eventFun.addLayer('./driver_recruitment_add.html', {
					'driverId': obj.data.driverId,
					'tabId': 'tab5',
					'status':obj.data.auditStatus
				}, '招募司机')
			}else if (obj.event == 'ele_uploadImg') {
				// 上传照片
				_this.eventFun.addLayer('./driver_recruitment_add.html', {
					'driverId': obj.data.driverId,
					'tabId': 'tab6',
					'status':obj.data.auditStatus
				}, '招募司机')
			} else if (obj.event == 'ele_recruitment') {
				//重新招募
				_this.reRecruit(obj.data)	
			}
      })
    }
  }

  driverList.defaultEvent()
  driverList.toolBar()
  driverList.getSelectData()
})