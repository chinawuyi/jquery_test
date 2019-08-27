window.dev = {}
layui.use(['common', 'form', 'layer', 'element', 'dict', 'permission', 'table', 'laydate'], function () {
	var common = layui.common
	var layer = layui.layer
	var dict = layui.dict
	var permission = layui.permission
	var element = layui.element
	var table = layui.table
	var form = layui.form
	var laydate = layui.laydate
	var dropDownList = {
		genderList: {},
		recruitmentChannelsList: {},
		cityList: {},
		licenseTypeList: {},
		drivingAgeList: {},
		isCertificateAList: {},
		auditStatusList: {},
		isPayDepositList:{},
		depositPayTypeList:{},
	}
    var driverInfo = {
		dataObj: {
			'driverId': '',
			'type': 'new',
			'readonly': '',
			'status':'',
		},
		eventFun: {
			addLayer: function (action, options, titleName) {
				if (options) {
					action = $.addUrlPro(action, options)
				}
				layer.open({
					type: 2,
					title: titleName || '司机管理',
					content: action,
					area: ['700px', ($(window).height() - 50) + 'px'],
					maxmin: true
				})
			},
			closeLayer: function () {
				var index = parent.layer.getFrameIndex(window.name)
				parent.layer.close(index);
				parent.window.$('#searchBt').click();
			},
			getUrlData: function () {
				var urlData = $.getUrlData(),
					_this = this;

				if (urlData) {
					driverInfo.dataObj.driverId = urlData.driverId
					driverInfo.dataObj.readonly = urlData.readonly
					driverInfo.dataObj.type = 'update'
					driverInfo.dataObj.status = urlData.status
					if (urlData.readonly) { //查看
						$('input,textarea').addClass('layui-disabled').attr('readonly', 'readonly')
						$('select,.real_file_btn,input[type="checkbox"]').addClass('layui-disabled').attr('disabled', 'disabled')
						$('.jsSub').css('display', 'none')
						$('.my_file_btn').addClass('layui-btn-disabled')
						
					}else{ //编辑
						$('form').each(function(i){
							if(i != parseInt(urlData.tabId.replace('tab',''))-1){
								$(this).find('input,textarea').addClass('layui-disabled').attr('readonly', 'readonly');
								$(this).find('select,.real_file_btn,input[type="checkbox"]').addClass('layui-disabled').attr('disabled', 'disabled');
								$(this).find('.my_file_btn').addClass('layui-disabled');
								$(this).find('.jsSub').hide();
							}else{
								$(this).find('.jsSub').show();
							}
						})
						
					}
					_this.getCancelStep();
					
					// 打开指定tab
					if (urlData.tabId) {
						element.tabChange('layTab', urlData.tabId);
					}
				}else{
					if (!urlData.readonly) {
						$('.jsSub').hide();
						$('.jsSub').eq(0).show();
					}
				}
			},
			getCancelStep:function(){
				$.getApi('/management/v1/driver/recruit/fail/node/' + driverInfo.dataObj.driverId, {},function(res){
					if (res.code == 0) {
						let status = res.content?res.content.statusChange.split('-')[0]:driverInfo.dataObj.status;
						// 1：待邀约; 2:待面试;3:待路考;4:待培训;5:待签约;6:已签约;0:招募不通过;-1:已解约
						switch(status){
							case '3': //面试结果
										$('#interviewResult').val(1);
										break;
							case '4': //路考结果
										$('#interviewResult').val(1);
										$('#roadTestResult').val(1);
										break;
							case '5': //培训结果
							case '6': //培训结果
							case '-1': //培训结果
										$('#interviewResult').val(1);
										$('#roadTestResult').val(1);
										$('#trainResult').val(1);
										break;
						}
					}
				}) 
			},
			setFormatDate: function (numValue) {
				if (numValue && !isNaN(numValue)) {
					return new Date(Number(numValue) * 1000).Format('yyyy/MM/dd')
				} else {
					return numValue
				}
			},
			getBaseInfo: function () {
				var _this = this

				/**司机基本信息 */
				$.postApi('/management/v1/driverdetail/info/' + driverInfo.dataObj.driverId, {}, function (res) {
					if (res.code == 0) {
						var formData = res.content;
						form.val('subCreate', formData);
						var dateVal=$('.setFormatDate')
						$(dateVal).each(function(){
							$(this).val(_this.setFormatDate($(this).val()))
						})
						$('#isCertificateA').val(formData.isCertificateA?1:0)

						// //显示司机图片
						_this.showDrivierImg(formData.headImg, 'headImg')
						_this.showDrivierImg(formData.driverImg, 'driverImg')
						_this.showDrivierImg(formData.idCardImgFront, 'idCardImgFront')
						_this.showDrivierImg(formData.idCardImgBack, 'idCardImgBack')
						_this.showDrivierImg(formData.idCardImgHold, 'idCardImgHold')
						_this.showDrivierImg(formData.licenseImg, 'licenseImg')
						_this.showDrivierImg(formData.residencePermitImgFront, 'residencePermitImgFront')
						_this.showDrivierImg(formData.residencePermitImgBack, 'residencePermitImgBack')
						_this.showDrivierImg(formData.certificateAImgFront, 'certificateAImgFront')
						_this.showDrivierImg(formData.certificateAImgBack, 'certificateAImgBack')


						form.render();
					}
				})

				/**司机扩展信息 */
				$.getApi('/management/v1/driver/ext/info/' + driverInfo.dataObj.driverId, {}, function (res) {
					if (res.code == 0) {
						if (res.content) {//更新
							var formData = res.content;							

							form.val('subCreate', formData);
							form.val('subInterview', formData);
							form.val('subRoadTest', formData);
							form.val('subTrain', formData);
							form.val('subSign', formData);
							form.val('subUploadImg', formData);

							

							var dateVal=$('.setFormatDate');
							$(dateVal).each(function(){
								$(this).val(_this.setFormatDate($(this).val()))
							})

							//面试资料
							if(formData.interviewData){
								$.getFileUrl('driver',formData.interviewData,function(status,option){
									if(status == 'success')
									{
										$('#interviewData').parents("tr").find(".jsphotoshow").empty();
										$('#interviewData').attr('key',formData.interviewData)
										$('.interviewData').val(formData.interviewData)
										$('#interviewData').parents("tr").find(".jsphotoshow").append('<span urlData="'+option+'" style="cursor:pointer" class="reviewPdf">预览</span>');
									}
								});
							}
							
							//路考资料
							if(formData.roadTestData){
								$.getFileUrl('driver',formData.roadTestData,function(status,option){
									if(status == 'success')
									{
										$('#roadTestData').parents("tr").find(".jsphotoshow").empty();
										$('#roadTestData').attr('key',formData.roadTestData)
										$('.roadTestData').val(formData.roadTestData)
										$('#roadTestData').parents("tr").find(".jsphotoshow").append('<span urlData="'+option+'" style="cursor:pointer" class="reviewPdf">预览</span>');
									}
								});
							}

							//培训资料
							if(formData.courseData){
								$.getFileUrl('driver',formData.courseData,function(status,option){
									if(status == 'success')
									{
										$('#courseData').parents("tr").find(".jsphotoshow").empty();
										$('#courseData').attr('key',formData.courseData)
										$('.courseData').val(formData.courseData)
										$('#courseData').parents("tr").find(".jsphotoshow").append('<span urlData="'+option+'" style="cursor:pointer" class="reviewPdf">预览</span>');
									}
								});
							}

							// 信息档案资料
							if(formData.informationArchives){
								$.getFileUrl('driver',formData.informationArchives,function(status,option){
									if(status == 'success')
									{
										$('#informationArchives').parents("tr").find(".jsphotoshow").empty();
										$('#informationArchives').attr('key',formData.informationArchives)
										$('.informationArchives').val(formData.informationArchives)
										$('#informationArchives').parents("tr").find(".jsphotoshow").append('<span urlData="'+option+'" style="cursor:pointer" class="reviewPdf">预览</span>');
									}
								});
							}
							form.render();
							
						} else {
							return false
						}

					}
				})
			},
			blindUploadImg:function(dom,callBack,type){
				$('#'+dom).uploadFun('driver',function(status,key){
					if(status =='success')
					{
						$.getFileUrl('driver',key,function(status,option){
							if(status == 'success')
							{
								$('#'+dom).parents("tr").find(".jsphotoshow").empty();
								$('#'+dom).attr('key',key)
								$('.'+dom).val(key)
								$('#'+dom).parents("tr").find(".jsphotoshow").append('<img src="'+option+'" class="enlarge"/>');
								if(callBack){
									callBack(option)
								}
							}
						});
					}
				},'',$.getUrlData().driverId,type);
			},
			showDrivierImg:function(key,dom){
                if(key){
                    $.getFileUrl('driver',key,function(status,option){
                        if(status == 'success')
                        {
                            $('#'+dom).parents("tr").find(".jsphotoshow").empty();
                            $('.'+dom).val(key)
                            $('#'+dom).parents("tr").find(".jsphotoshow").append('<img src="'+option+'" class="enlarge"/>');
                            
                        }
                    });
                }
            },
		},
		verify:function()
        {
            form.verify({
                phoneRule:function(value,item){
                    if(!/^1\d{10}$/g.test(value))
                    {
                        return '请输入正确的手机号码';
                    }
                },
            });
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
				}
			})
			//保证金缴纳情况
			$.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode', {
				'categoryCode': 'DEPOSIT_STATUS'.toUpperCase(),
			}, function (res) {
				if (res.code == 0) {
					$.appendSelect('isPayDeposit', res.content, 'value', 'name')
					form.render('select')
					res.content.forEach(function (ele) {
						dropDownList.isPayDepositList[ele.value] = ele.name
					})
				}
			})
			//支付渠道
			$.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode', {
				'categoryCode': 'DRIVER_SIGN_PAY_CHANNEL'.toUpperCase(),
			}, function (res) {
				if (res.code == 0) {
					$.appendSelect('depositPayType', res.content, 'value', 'name')
					form.render('select')
					res.content.forEach(function (ele) {
						dropDownList.depositPayTypeList[ele.value] = ele.name
					})
					_this.dataObj.driverId?_this.eventFun.getBaseInfo():'';
				}
			})
		},
		/*默认方法*/
		defaultEvent: function () {
			var _this = this

			$('#jsBrandBack').click(function () {
				_this.eventFun.closeLayer()
			})
			//点击预览pdf
	
            $(document).on('click','.reviewPdf',function(){
				_this.eventFun.addLayer($(this).attr('urldata'))               
            })

			/**初始化日历控件 */
			if (!$.getUrlData().readonly) {
				// lay('.layDate-item').each(function(){
				// 	laydate.render({
				// 		elem: this
				// 		,format:'yyyy-MM-dd HH:mm:ss'
				// 		,trigger: 'click'
				// 		});
				// 	});
				laydate.render({
					elem: '#getDriverLicenseDate',//初次领取驾驶证日期
					max: new Date().Format('yyyy/MM/dd'),
					trigger: 'click',
					format: 'yyyy/MM/dd'
				})
				laydate.render({
					elem: '#getNetworkCarProofDate',//初次领取资格证日期
					max: new Date().Format('yyyy/MM/dd'),
					trigger: 'click',
					format: 'yyyy/MM/dd'
				})
				laydate.render({
					elem: '#networkCarIssueDate',//网约预约出租车驾驶员资格证发放日期
					max: new Date().Format('yyyy/MM/dd'),
					trigger: 'click',
					format: 'yyyy/MM/dd'
				})
				laydate.render({
					elem: '#networkCarProofOff',//网络预约出租汽车驾驶员证有效期止
					min: new Date().Format('yyyy/MM/dd'),
					trigger: 'click',
					format: 'yyyy/MM/dd'
				})
				laydate.render({
					elem: '#networkCarProofOn',//网络预约出租汽车驾驶员证有效期起
					max: new Date().Format('yyyy/MM/dd'),
					trigger: 'click',
					format: 'yyyy/MM/dd'
				})
				laydate.render({
					elem: '#licenseEndDate',//驾驶证有效期限止
					min: new Date().Format('yyyy/MM/dd'),
					trigger: 'click',
					format: 'yyyy/MM/dd'
				})
				laydate.render({
					elem: '#licenseStartDate',//驾驶证有效期限起
					max: new Date().Format('yyyy/MM/dd'),
					trigger: 'click',
					format: 'yyyy/MM/dd'
				})
				laydate.render({
					elem: '#interviewDate',//面试日期
					max: new Date().Format('yyyy/MM/dd'),
					trigger: 'click',
					format: 'yyyy/MM/dd'
				})
				laydate.render({
					elem: '#roadTestDate',//路考日期
					max: new Date().Format('yyyy/MM/dd'),
					trigger: 'click',
					format: 'yyyy/MM/dd'
				})
				laydate.render({
					elem: '#courseDate',//培训日期
					max: new Date().Format('yyyy/MM/dd'),
					trigger: 'click',
					format: 'yyyy/MM/dd'
				})
				laydate.render({
					elem: '#depositPayDate',//保证金缴纳日期
					trigger: 'click',
					format: 'yyyy/MM/dd'
				})
				laydate.render({
					elem: '#signDate',//签约日期
					trigger: 'click',
					format: 'yyyy/MM/dd'
				})

			}

			/**绑定图片事件 */
			_this.eventFun.blindUploadImg('headImg')//头像
			_this.eventFun.blindUploadImg('driverImg')//司机照片
			_this.eventFun.blindUploadImg('interviewData', function (url) {//面试资料
				$('#interviewData').parents('tr').find('.jsphotoshow').empty()
				$('#interviewData').parents('tr').find('.jsphotoshow').append('<span urlData="' + url + '" style="cursor:pointer" class="reviewPdf">预览</span>')
			},'pdf|jpg|png|bmp|jpeg')
			_this.eventFun.blindUploadImg('roadTestData', function (url) {//路考资料
				$('#roadTestData').parents('tr').find('.jsphotoshow').empty()
				$('#roadTestData').parents('tr').find('.jsphotoshow').append('<span urlData="' + url + '" style="cursor:pointer" class="reviewPdf">预览</span>')
			},'jpg|png|bmp|jpeg')
			_this.eventFun.blindUploadImg('courseData', function (url) {//培训资料
				$('#courseData').parents('tr').find('.jsphotoshow').empty()
				$('#courseData').parents('tr').find('.jsphotoshow').append('<span urlData="' + url + '" style="cursor:pointer" class="reviewPdf">预览</span>')
			},'pdf|jpg|png|bmp|jpeg')
			
			_this.eventFun.blindUploadImg('informationArchives', function (url) {//信息档案资料
				$('#informationArchives').parents('tr').find('.jsphotoshow').empty()
				$('#informationArchives').parents('tr').find('.jsphotoshow').append('<a urlData="' + url + '" style="cursor:pointer" href="'+url+'">预览</a>')
			},'rar|zip')
			
			_this.eventFun.blindUploadImg('idCardImgFront', function (url) {//身份证正面
				$.postApi('/management/ocr/v1/idcard', {
				'cardType': 0,
				'url': url[0]
				}, function (res) {
				if (res.code == 0) {
					$('#idCardNumber').val(res.content.id)//身份证号
					$('#name').val(res.content.name)//姓名
					$('#birthDate').val(res.content.birth.replace(/\//g, '-'))//出生年月日
					$('#gender').val(res.content.sex == '女' ? '1' : '2')//性别
					form.render('select')
				}
				})
			})
			_this.eventFun.blindUploadImg('idCardImgBack')//身份证背面
			_this.eventFun.blindUploadImg('idCardImgHold')//手持身份证
			_this.eventFun.blindUploadImg('licenseImg', function (url) {//驾照
				$.postApi('/management/ocr/v1/driverLicense', {
				'type': 1,
				'url': url[0]
				}, function (res) {
				if (res.code == 0) {
					res.content.forEach(function (ele) {
					if (ele.item == '有效日期') {//
						$('#licenseEndDate').val(ele.itemstring)
					} else if (ele.item == '证号') {//驾照号
						$('#licenseNumber').val(ele.itemstring)
					} else if (ele.item == '起始日期') {//驾照号
						$('#licenseStartDate').val(ele.itemstring)
					} else if (ele.item == '准驾车型') {//驾照号
						$('#licenseType').val(ele.itemstring)
					}
					})
				}
				})
			})

			_this.eventFun.blindUploadImg('residencePermitImgFront');
			_this.eventFun.blindUploadImg('residencePermitImgBack');
			_this.eventFun.blindUploadImg('certificateAImgFront');
			_this.eventFun.blindUploadImg('certificateAImgBack');
		},
		// 招募司机基本信息
		subCreate: function () {
			let _this = this;
			$.postApi('/management/v1/driver/recruit/create', {
				'name': $('#name').val(),
				'gender': $('#gender').val(),
				'idCardNumber': $('#idCardNumber').val(),
				'phone': $('#phone').val(),
				'licenseType': $('#licenseType').val(),
				'city': $('#city').val(),
				'nativePlace': $('#nativePlace').val(),
				'currentResidentialAddress': $('#currentResidentialAddress').val(),
				'drivingAge': $('#drivingAge').val(),
				'recruitmentChannels': $('#recruitmentChannels').val(),
				'isCertificateA': $('#isCertificateA').val() == '1'?true:false,
				'recruitComment': $('#recruitComment').val(),
			}, function (res) {
				if (res.code == 0) {
					layer.msg(res.message)
					window.setTimeout(function(){
						_this.eventFun.closeLayer(); 
					},1000);
				}
			})
		},
		// 招募司机面试信息
		subInterview: function () {
			let _this = this;
			$.postApi('/management/v1/driver/recruit/interview/create', {
				'driverId': driverInfo.dataObj.driverId,
				'driverAddress': $('#driverAddress').val(),
				'nation': $('#nation').val(),
				'driverHeight': $('#driverHeight').val(),
				'driverWeight': $('#driverWeight').val(),
				'driverEducation': $('#driverEducation').val(),
				'driverResidentType': $('#driverResidentType').val(),
				'driverMaritalStatus': $('#driverMaritalStatus').val(),
				'presentFamilyAddress': $('#presentFamilyAddress').val(),
				'emergencyContact': $('#emergencyContact').val(),
				'emergencyContactPhone': $('#emergencyContactPhone').val(),
				'licenseNumber': $('#licenseNumber').val(),
				'getDriverLicenseDate': parseInt(new Date($('#getDriverLicenseDate').val()).getTime()/1000),
				'licenseStartDate': parseInt(new Date($('#licenseStartDate').val()).getTime()/1000),
				'licenseEndDate': parseInt(new Date($('#licenseEndDate').val()).getTime()/1000),
				'certificateA': $('#certificateA').val(),
				'networkCarIssueDate': parseInt(new Date($('#networkCarIssueDate').val()).getTime()/1000),
				'getNetworkCarProofDate': parseInt(new Date($('#getNetworkCarProofDate').val()).getTime()/1000),
				'networkCarProofOn':parseInt(new Date($('#networkCarProofOn').val()).getTime()/1000),
				'networkCarProofOff': parseInt(new Date($('#networkCarProofOff').val()).getTime()/1000),
				'email': $('#email').val(),
				'result': $('#interviewResult').val() == 1?true:false,
				'interviewDate':parseInt(new Date($('#interviewDate').val()).getTime()/1000),
				'interviewComment': $('#interviewComment').val(),
				'interviewData':$('.interviewData').val(),
			}, function (res) {
				if (res.code == 0) {
					layer.msg(res.message)
					window.setTimeout(function(){
						_this.eventFun.closeLayer(); 
					},1000);
				}
			})
		},
		// 招募司机路考信息
		subRoadTest: function () {
			let _this = this;
			$.postApi('/management/v1/driver/recruit/roadTest/create', {
				'driverId': driverInfo.dataObj.driverId,
				'result': $('#roadTestResult').val() == 1?true:false,
				'roadTestDate': parseInt(new Date($('#roadTestDate').val()).getTime()/1000),
				'roadTestComment': $('#roadTestComment').val(),
				'roadTestData': $('.roadTestData').val(),
			}, function (res) {
				if (res.code == 0) {
					layer.msg(res.message)
					window.setTimeout(function(){
						_this.eventFun.closeLayer(); 
					},1000);
				}
			})
		},
		// 招募司机培训信息
		subTrain: function () {
			let _this = this;
			$.postApi('/management/v1/driver/recruit/train/create', {
				'driverId': driverInfo.dataObj.driverId,
				'result': $('#trainResult').val() == 1?true:false,
				'courseDate': parseInt(new Date($('#courseDate').val()).getTime()/1000),
				'trainComment': $('#trainComment').val(),
				'courseData': $('.courseData').val(),
			}, function (res) {
				if (res.code == 0) {
					layer.msg(res.message)
					window.setTimeout(function(){
						_this.eventFun.closeLayer();
					},1000);
				}
			})
		},
		// 招募司机签约信息
		subSign: function () {
			let _this = this;
			$.postApi('/management/v1/driver/recruit/sign/create', {
				'driverId': driverInfo.dataObj.driverId,
				'isPayDeposit': parseInt($('#isPayDeposit').val()),
				'depositPayDate': parseInt(new Date($('#depositPayDate').val()).getTime()/1000),
				'depositPayAmt': $('#depositPayAmt').val(),
				'depositPayType': parseInt($('#depositPayType').val()),
				'signDate': parseInt(new Date($('#signDate').val()).getTime()/1000),
				'materialReceivingInstructions': $('#materialReceivingInstructions').val(),
				'informationArchives': $('.informationArchives').val(),
			}, function (res) {
				if (res.code == 0) {
					layer.msg(res.message)
					window.setTimeout(function(){
						_this.eventFun.closeLayer();   
					},1000);
				}
			})
		},
		// 招募司机照片信息
		subUploadImg: function () {
			let _this = this;
			$.postApi('/management/v1/driver/recruit/img/uploadImg', {
				'driverId': driverInfo.dataObj.driverId,
				'headImg': $('.headImg').val(),
				'driverImg': $('.driverImg').val(),
				'idCardImgFront': $('.idCardImgFront').val(),
				'idCardImgBack': $('.idCardImgBack').val(),
				'idCardImgHold': $('.idCardImgHold').val(),
				'licenseImg': $('.licenseImg').val(),
				'residencePermitImgFront': $('.residencePermitImgFront').val(),
				'residencePermitImgBack': $('.residencePermitImgBack').val(),
				'certificateAImgFront': $('.certificateAImgFront').val(),
				'certificateAImgBack': $('.certificateAImgBack').val(),
			}, function (res) {
				if (res.code == 0) {
					layer.msg(res.message)
					window.setTimeout(function(){
						_this.eventFun.closeLayer();  
					},1000);
				}
			})
		},
		/**表单方法 */
		formSub: function () {
			var _this = this
			//提交基本信息
			form.on('submit(subCreate)', function (data) {
				console.log(data)
				_this.subCreate(data.field)
				return false
			})
			//提交面试信息
			form.on('submit(subInterview)', function (data) {
				console.log(data)
				_this.subInterview(data.field)
				return false
			})
			//提交路考信息
			form.on('submit(subRoadTest)', function (data) {
				_this.subRoadTest(data.field)
				return false
			})
			//提交培训信息
			form.on('submit(subTrain)', function (data) {
				_this.subTrain(data.field)
				return false
			})
			//提交签约信息
			form.on('submit(subSign)', function (data) {
				_this.subSign(data.field)
				return false
			})
			//提交司机照片信息
			form.on('submit(subUploadImg)', function (data) {
				_this.subUploadImg(data.field)
				return false
			})

		},
  }
  //需要优先执行
  driverInfo.eventFun.getUrlData()
  driverInfo.getSelectData()
  driverInfo.defaultEvent()
  driverInfo.formSub()
  driverInfo.verify();
  $.enlargeImg();//图片放大
  dev.element = element
})
