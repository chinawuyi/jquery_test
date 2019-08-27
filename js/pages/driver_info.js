layui.use(['common','form', 'layer','element', 'dict', 'permission','table','laydate'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var element = layui.element;
    var table = layui.table;
    var form=layui.form;
    var laydate=layui.laydate;
    var dropDownList={
        trainTypeList:{}
    }
    var driverInfo = {
        dataObj:{
            'id':'',
            'type':'new',
            'readonly':'',
            'carId':'',
            'contractType':false,
            'extType':false,
        },
        eventFun:{
            addLayer:function(action,options,titleName)
            {
                if(options)
                {
                    action = $.addUrlPro(action,options);
                }
                layer.open({
                    type: 2,
                    title:titleName||'司机管理',
                    content: action,
                    area: ['700px', ($(window).height()-50)+'px'],
                    maxmin: true
                });
            },
            closeLayer:function()
            {
                var index = parent.layer.getFrameIndex(window.name);
                parent.layer.close(index);
            },
            getUrlData:function()
            {
                var urlData = $.getUrlData();
                if(urlData)
                {
                    driverInfo.dataObj.id = urlData.id;
                    driverInfo.dataObj.readonly = urlData.readonly;
                    driverInfo.dataObj.type = 'update';
                    if(urlData.readonly){
                        $('input,textarea').addClass('layui-disabled').attr('readonly','readonly');
                        $('select,.real_file_btn,input[type="checkbox"]').addClass('layui-disabled').attr('disabled','disabled');
                        $('.jsSub').css('display','none');
                        $('.my_file_btn').addClass('layui-btn-disabled')
                    }
                    
                }
            },
            /**解绑车辆 */
            unBindCar:function(carId,driverId){
                layer.open({
                    title: '车辆解绑确认',
                    content: '确定解绑吗？',
                    yes: function(index,layero){  
                        $.postApi('/management/v1/driver/unBindCar',{
                            "carId":carId,
                            "driverId":driverId,
                            "operator":sessionStorage.getItem('operator')
                            },function(res){
                                if(res.code == 0){
                                    layer.msg('司机已解绑'); 
                                    driverInfo.dataObj.carId=null
                                    $('#unBlindCar').hide().siblings().show(); 
                                    $('input[name="listenCarTypes"]').each(function(){
                                        $(this).attr('checked',false)
                                    })
                                    form.render('checkbox');    
                                    $('#carNumber,#carModle').val('');              
                                }
                            })                     
                        layer.close(index);
                      }
                  });                
            },
            setFormatDate:function(numValue){
                if(numValue&&!isNaN(numValue)){
                    return new Date(Number(numValue)*1000).Format('yyyy/MM/dd')
                }else{
                    return numValue
                }
                
            },
            getBaseInfo:function(){
                var _this = this;

                /**司机基本信息 */                
                $.postApi('/management/v1/driverdetail/info/'+driverInfo.dataObj.id,{
                },function(res)
                {
                    if(res.code == 0)
                    {
                        var formData=res.content
                        form.val("detail",formData)
                        //格式化值
                        var dateVal=$('#baseInfo .setFormatDate')
                        $(dateVal).each(function(){
                            $(this).val(driverInfo.eventFun.setFormatDate($(this).val()))
                        })
                        

                        //显示司机图片
                        _this.showDrivierImg(formData.headImg,'headImg')
                        _this.showDrivierImg(formData.driverImg,'driverImg')
                        _this.showDrivierImg(formData.idCardImgFront,'idCardImgFront')
                        _this.showDrivierImg(formData.idCardImgBack,'idCardImgBack')
                        _this.showDrivierImg(formData.idCardImgHold,'idCardImgHold')
                        _this.showDrivierImg(formData.licenseImg,'licenseImg')
                        
                        if(formData.carId){//已分配车辆
                            //司机车辆信息
                            driverInfo.dataObj.carId=formData.carId
                            $('#carNumber').val(formData.carNumber)
                            $('#carModle').val(formData.carBrand+'-'+formData.carModel+'-'+formData.carAttribute);
                            //可分配车辆
                            $.getUrlData().readonly?'':$('#unBlindCar').show().siblings().hide();
                            //显示听单车型
                            var listenCarTypes=formData.listenCarTypes?formData.listenCarTypes.split(','):[]
                            
                            $('input[name="listenCarTypes"]').each(function(i){
                                if(listenCarTypes.indexOf($(this).val())>-1){
                                    $(this).attr("checked",true)
                                }
                            });
                        }
                        form.render();
                        driverInfo.dataObj.city=formData.city
                    }
                })

                /**司机扩展信息 */                
                $.getApi('/management/v1/driver/ext/info/'+driverInfo.dataObj.id,{
                },function(res)
                {
                    if(res.code == 0)
                    {
                        if(res.content){//更新
                            driverInfo.dataObj.extType=true
                            driverInfo.dataObj.driverExtId=res.content.driverExtId
                        }else{
                            return false
                        }
                        form.val("detail",res.content)
                        var dateVal=$('#baseInfo .setFormatDate')
                        $(dateVal).each(function(){
                            $(this).val(driverInfo.eventFun.setFormatDate($(this).val()))
                        })
                        form.render();
                        
                    }
                })

                /**司机合同信息 */                
                $.getApi('/management/v1/driver/contract/info/'+driverInfo.dataObj.id,{
                },function(res)
                {
                    if(res.code == 0)
                    {
                        var formData=res.content
                        if(res.content){//更新
                            driverInfo.dataObj.contractType=true
                            driverInfo.dataObj.driverIndividualContractId=formData.driverIndividualContractId
                        }else{
                            return false
                        }
                        form.val("contractCont",res.content)
                        var dateVal=$('#contractCont .setFormatDate')
                        $(dateVal).each(function(){
                            $(this).val(driverInfo.eventFun.setFormatDate($(this).val()))
                        })
                        
                        form.render();
                        
                        if(formData.contractPhoto){
                            $.getFileUrl('driver',formData.contractPhoto,function(status,option){
                                if(status == 'success')
                                {
                                    $('#contractPhoto').parents("tr").find(".jsphotoshow").empty();
                                    $('#contractPhoto').attr('key',formData.contractPhoto)
                                    $('.contractPhoto').val(formData.contractPhoto)
                                    $('#contractPhoto').parents("tr").find(".jsphotoshow").append('<span urlData="'+option+'" style="cursor:pointer" class="reviewPdf">预览</span>');
                                }
                            });
                        }
                    }
                })

                _this.getTrainInfo()
                
            },
            getTrainInfo:function(){
                /**司机培训信息 */                
                $.getApi('/management/v1/driver/cource/info/'+driverInfo.dataObj.id,{
                },function(res)
                {
                    if(res.code == 0)
                    {
                        driverInfo.eventFun.getTrain(res.content||[])
                    }
                })
            },
            /**司机培训信息 */
            getTrain:function(tableData){
                                
                this.tableObj = table.render({
                    elem: '#train',
                    height: 400,
                    method:'get',
                    contentType:"application/json",
                    page: false,
                    data:tableData,
                    cols: [[
                        {field: 'courseName', title: '培训名称',sort: false,align: 'right'},
                        {field: 'courseDate', title: '培训日期',sort: false,align: 'right',templet:function(d){
                            return new Date(d.courseDate*1000).Format('yyyy-MM-dd')
                        }},
                        {field: 'startTime', title: '培训起始日期',sort: false,align: 'right',templet:function(d){
                            return new Date(d.startTime*1000).Format('yyyy-MM-dd')
                        }},
                        {field: 'stopTime', title: '培训结束日期',sort: false,align: 'right',templet:function(d){                      
                            return new Date(d.stopTime*1000).Format('yyyy-MM-dd')
                        }},
                        {field: 'trainerName', title: '培训师名称',sort: false,align: 'right'},
                        {field: 'operator', title: '录入账号',sort: false,align: 'right'},
                        {field: 'type', title: '培训类型',sort: false,align: 'right',templet:function(d){
                           return d.type?dropDownList.trainTypeList[d.type]:""
                        }},
                        {field: '', title: '操作', width:'120', sort: false,align: 'left',templet: function(d){
                            return '<button class="layui-btn layui-btn-xs" lay-event="ele_showImg"><i class="layui-icon">&#xe656;</i> 查看台账</button>'
                        }}
                    ]],
                    toolbar: '#toolbarDemo',
                    done:function(){
                        if($.getUrlData().readonly=='readonly'){
                            $('#jsTrainAdd').addClass('layui-btn-disabled').attr('disabled','disabled')
                        }
                    }
                });
            },
            blindUploadImg:function(dom,callBack){
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
                },'',$.getUrlData().id);
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
            driverStatus:function(data)
            {
                var _this = this;
                $.postApi('/management/v1/driver/setCar',{
                    "driverId":$.getUrlData().id,
                    "carId":$('#serCar').attr('carId'),
                    "listenCarTypes":data,
                    "operator":sessionStorage.getItem('operator')
                },function(res)
                {
                    if(res.code == 0)
                    {
                        layer.msg('分配成功');
                        //更新司机的车
                        $('#serCar').hide().siblings().show();
                        driverInfo.dataObj.carId=$('#serCar').attr('carId')
                    }
                });
            },
            getDriverCar:function(datas){
                $('#serCar').attr('carId',datas.carId)
                $('#carNumber').val(datas.carNumber)
                $('#carModle').val(datas.carBrand+'-'+datas.carModel+'-'+datas.carAttribute);
            }
        },

        /*默认方法*/
        defaultEvent:function()
        {
            var _this = this;
            
            $('#jsBrandBack').click(function(){
                _this.eventFun.closeLayer();
            });
            //点击预览pdf
            $(document).on('click','.reviewPdf',function(){
                _this.eventFun.addLayer($(this).attr('urldata'))
            })
            
            /**初始化日历控件 */
            if(!$.getUrlData().readonly){
                laydate.render({
                    elem: '#getDriverLicenseDate',//初次领取驾驶证日期
                    max:new Date().Format('yyyy/MM/dd'),
                    trigger: 'click',
                    format: 'yyyy/MM/dd'
                });
                laydate.render({
                    elem: '#getNetworkCarProofDate',//初次领取资格证日期
                    max:new Date().Format('yyyy/MM/dd'),
                    trigger: 'click',
                    format: 'yyyy/MM/dd'
                });
                laydate.render({
                    elem: '#networkCarIssueDate',//网约预约出租车驾驶员资格证发放日期
                    max:new Date().Format('yyyy/MM/dd'),
                    trigger: 'click',
                    format: 'yyyy/MM/dd'
                });
                laydate.render({
                    elem: '#networkCarProofOff',//网络预约出租汽车驾驶员证有效期止
                    min:new Date().Format('yyyy/MM/dd'),
                    trigger: 'click',
                    format: 'yyyy/MM/dd'
                });
                laydate.render({
                    elem: '#networkCarProofOn',//网络预约出租汽车驾驶员证有效期起
                    max:new Date().Format('yyyy/MM/dd'),
                    trigger: 'click',
                    format: 'yyyy/MM/dd'
                });
                laydate.render({
                    elem: '#licenseEndDate',//驾驶证有效期限止
                    min:new Date().Format('yyyy/MM/dd'),
                    trigger: 'click',
                    format: 'yyyy/MM/dd'
                });
                laydate.render({
                    elem: '#licenseStartDate',//驾驶证有效期限起
                    max:new Date().Format('yyyy/MM/dd'),
                    trigger: 'click',
                    format: 'yyyy/MM/dd'
                });
                laydate.render({
                    elem: '#birthDate',//生日
                    max:new Date().Format('yyyy/MM/dd'),
                    trigger: 'click',
                    format: 'yyyy/MM/dd'
                });
                laydate.render({
                    elem: '#invalidTime',
                    trigger: 'click',
                    format: 'yyyy/MM/dd'
                });
                laydate.render({
                    elem: '#signTime',
                    trigger: 'click',
                    format: 'yyyy/MM/dd'
                });
                laydate.render({
                    elem: '#validTime',
                    trigger: 'click',
                    format: 'yyyy/MM/dd'
                }); 
                
                /** 打开可分配车辆层*/
                $('#carModle').click(function(){
                    if(driverInfo.dataObj.carId){
                        return false
                    }
                    if(driverInfo.dataObj.city){
                        _this.eventFun.addLayer('./driver_allot_car.html',{
                            city:driverInfo.dataObj.city
                        },'可分配车辆')
                    }else{
                        layer.msg('请先设置司机城市')
                    }
                })

                //打开劳务公司
                $('#labourCompanyId').click(function(){
                    if(driverInfo.dataObj.city){
                        _this.eventFun.addLayer('./driver_choose_labor.html',{
                            city:driverInfo.dataObj.city
                        },'可分配车辆')
                    }else{
                        layer.msg('请先设置司机城市')
                    }
                })
            }

            /**绑定图片事件 */
            _this.eventFun.blindUploadImg('headImg');//头像
            _this.eventFun.blindUploadImg('driverImg');//司机照片
            _this.eventFun.blindUploadImg('contractPhoto',function(url){//合同PDF
                $('#contractPhoto').parents("tr").find(".jsphotoshow").empty();
                $('#contractPhoto').parents("tr").find(".jsphotoshow").append('<span urlData="'+url+'" style="cursor:pointer" class="reviewPdf">预览</span>');
            })
            _this.eventFun.blindUploadImg('idCardImgFront',function(url){//身份证正面
                $.postApi('/management/ocr/v1/idcard',{
                    "cardType": 0,
                    "url": url[0]
                },function(res)
                {
                    if(res.code == 0)
                    {
                        $("#idCardNumber").val(res.content.id)//身份证号
                        $("#name").val(res.content.name)//姓名
                        $("#birthDate").val(res.content.birth.replace(/\//g,'-'))//出生年月日
                        $("#gender").val(res.content.sex=='女'?"0":"1")//性别 男1，女0
                        form.render('select');
                    }
                });
            });
            _this.eventFun.blindUploadImg('idCardImgBack');//身份证背面
            _this.eventFun.blindUploadImg('idCardImgHold');//手持身份证
            _this.eventFun.blindUploadImg('licenseImg',function(url){//驾照
                $.postApi('/management/ocr/v1/driverLicense',{
                    "type":1,
                    "url": url[0]
                },function(res)
                {
                    if(res.code == 0)
                    {
                        res.content.forEach(function(ele) {
                            if(ele.item=='有效日期'){//
                                $('#licenseEndDate').val(ele.itemstring)
                            }else if(ele.item=='证号'){//驾照号
                                $('#licenseNumber').val(ele.itemstring)
                            }else if(ele.item=='起始日期'){//驾照号
                                $('#licenseStartDate').val(ele.itemstring)
                            }else if(ele.item=='准驾车型'){//驾照号
                                $('#licenseType').val(ele.itemstring)
                            }
                        });
                    }
                });
            });

            
        },
        subDriverInfo:function(data){ 
            $.postApi('/management/v1/driver/base/info/update',{
                driverId:driverInfo.dataObj.id,
                idCardNumber:data.idCardNumber,//身份证号
                licenseNumber:data.licenseNumber,//驾照号
                driverType:data.driverType,//司机类型
                licenseType:data.licenseType,//准驾类型
                email:data.email,//邮箱
                name:data.name,//姓名
                gender:data.gender,//性别
                city:data.city,//城市
                licenseEndDate:new Date(data.licenseEndDate).getTime()/1000,//生日
                licenseStartDate:new Date(data.licenseStartDate).getTime()/1000,//生日
                labourCompanyId:data.labourCompanyId,//公司编号
                birthDate:new Date(data.birthDate).getTime()/1000,//司机出生年月日
                nation:data.nation,
                driverId:driverInfo.dataObj.id,
                driverHeight:data.driverHeight,
                driverWeight:data.driverWeight,
                appVersion:data.appVersion,//APP版本号
                commercialType:data.commercialType,//出租资格类别
                contractCompany:data.contractCompany,//驾驶员合同（或协议）签署公司标识
                driverAddress:data.driverAddress,//户口地址或常住地址
                driverCensus:data.driverCensus,//户口登记机关名称
                driverResidentType:data.driverResidentType,//户口类型
                driverContactAddress:data.driverContactAddress,//驾驶员通信地址
                driverEducation:data.driverEducation,//驾驶员学历
                nativePlace:data.nativePlace,//司机籍贯
                licensePhotoId:data.licensePhotoId,//机动车驾驶证扫描件文件编号
                recruitmentChannels:data.recruitmentChannels,//招募渠道
                //driverExtId:driverInfo.dataObj.driverExtId,//司机扩展ID
                driverLanguageLevel:data.driverLanguageLevel,//驾驶员外语能力
                driverMaritalStatus:data.driverMaritalStatus,//驾驶员婚姻状况
                certificateA:data.certificateA,//网络预约出租汽车驾驶员资格证号
                emergencyContact:data.emergencyContact,//紧急情况联系人
                emergencyContactAddress:data.emergencyContactAddress,//紧急情况联系人地址
                emergencyContactPhone:data.emergencyContactPhone,//紧急情况联系人电话
                fulltimeDriver:data.fulltimeDriver,//是否专职驾驶员
                getDriverLicenseDate:data.getDriverLicenseDate?new Date(data.getDriverLicenseDate).getTime()/1000:'',//初次领取驾驶证日期
                getNetworkCarProofDate:data.getNetworkCarProofDate?new Date(data.getNetworkCarProofDate).getTime()/1000:'',//初次领取资格证日期
                inDriverBlackList:data.inDriverBlackList,//是否在驾驶员黑名单内
                mobileModel:data.mobileModel,//司机手机型号
                mapType:data.mapType,
                netType:data.netType,//司机手机运营商
                presentFamilyAddress:data.presentFamilyAddress,//现家庭住址
                networkCarIssueDate:data.networkCarIssueDate?new Date(data.networkCarIssueDate).getTime()/1000:'',//资格证发证日期
                networkCarIssueOrganization:data.networkCarIssueOrganization,//网络预约出租汽车驾驶员证发证机构
                networkCarProofOff:data.networkCarProofOff?new Date(data.networkCarProofOff).getTime()/1000:'',//网络预约出租汽车驾驶员证有效期止
                networkCarProofOn:data.networkCarProofOn?new Date(data.networkCarProofOn).getTime()/1000:'',//网络预约出租汽车驾驶员证有效期起
                operator:sessionStorage.getItem('operator'),
                taxiDriver:data.taxiDriver//是否巡游出租汽车驾驶员
            },function(res)
            {
                if(res.code == 0)
                {
                    layer.msg(res.message)
                }
            });
        },
        subDriverExt:function(data){
            $.postApi('/management/v1/driver/ext/'+(driverInfo.dataObj.extType?'update':'create'),{
                driverId:driverInfo.dataObj.id,
                driverHeight:data.driverHeight,
                driverWeight:data.driverWeight,
                appVersion:data.appVersion,//APP版本号
                commercialType:data.commercialType,//出租资格类别
                contractCompany:data.contractCompany,//驾驶员合同（或协议）签署公司标识
                driverAddress:data.driverAddress,//户口地址或常住地址
                driverCensus:data.driverCensus,//户口登记机关名称
                driverResidentType:data.driverResidentType,//户口类型
                driverContactAddress:data.driverContactAddress,//驾驶员通信地址
                driverEducation:data.driverEducation,//驾驶员学历
                nativePlace:data.nativePlace,//司机籍贯
                licensePhotoId:data.licensePhotoId,//机动车驾驶证扫描件文件编号
                recruitmentChannels:data.recruitmentChannels,//招募渠道
                driverExtId:driverInfo.dataObj.driverExtId,//司机扩展ID
                driverLanguageLevel:data.driverLanguageLevel,//驾驶员外语能力
                driverMaritalStatus:data.driverMaritalStatus,//驾驶员婚姻状况
                certificateA:data.certificateA,//网络预约出租汽车驾驶员资格证号
                emergencyContact:data.emergencyContact,//紧急情况联系人
                emergencyContactAddress:data.emergencyContactAddress,//紧急情况联系人地址
                emergencyContactPhone:data.emergencyContactPhone,//紧急情况联系人电话
                fulltimeDriver:data.fulltimeDriver,//是否专职驾驶员
                getDriverLicenseDate:data.getDriverLicenseDate?new Date(data.getDriverLicenseDate).getTime()/1000:'',//初次领取驾驶证日期
                getNetworkCarProofDate:data.getNetworkCarProofDate?new Date(data.getNetworkCarProofDate).getTime()/1000:'',//初次领取资格证日期
                inDriverBlackList:data.inDriverBlackList,//是否在驾驶员黑名单内
                mobileModel:data.mobileModel,//司机手机型号
                mapType:data.mapType,
                netType:data.netType,//司机手机运营商
                presentFamilyAddress:data.presentFamilyAddress,//现家庭住址
                networkCarIssueDate:data.networkCarIssueDate?new Date(data.networkCarIssueDate).getTime()/1000:'',//资格证发证日期
                networkCarIssueOrganization:data.networkCarIssueOrganization,//网络预约出租汽车驾驶员证发证机构
                networkCarProofOff:data.networkCarProofOff?new Date(data.networkCarProofOff).getTime()/1000:'',//网络预约出租汽车驾驶员证有效期止
                networkCarProofOn:data.networkCarProofOn?new Date(data.networkCarProofOn).getTime()/1000:'',//网络预约出租汽车驾驶员证有效期起
                operator:sessionStorage.getItem('operator'),
                taxiDriver:data.taxiDriver//是否巡游出租汽车驾驶员
            },function(res)
            {
                if(res.code == 0)
                {
                    layer.msg(res.message)
                }
            });
        },
        subDriverContract:function(data){
            $.postApi('/management/v1/driver/contract/'+(driverInfo.dataObj.contractType?'update':'create'),{
                driverIndividualContractId:driverInfo.dataObj.driverIndividualContractId,
                driverId:driverInfo.dataObj.id,
                contractPhoto:$('.contractPhoto').val(),
                operator:sessionStorage.getItem('operator'),
                contractStatus:data.contractStatus,
                contractType:data.contractType,
                invalidTime:data.invalidTime?new Date(data.invalidTime)/1000:'',
                signTime:data.signTime?new Date(data.signTime)/1000:'',
                type:data.type,
                validTime:data.validTime?new Date(data.validTime)/1000:'',
            },function(res)
            {
                if(res.code == 0)
                {
                    layer.msg(res.message)
                }
            });
        },
        subDriverImg:function(){
            $.postApi('/management/v1/driver/recruit/img/uploadImg',{
                driverId:driverInfo.dataObj.id,
                headImg:$('.headImg').val(),
                driverImg:$('.driverImg').val(),
                idCardImgFront:$('.idCardImgFront').val(),
                idCardImgBack:$('.idCardImgBack').val(),
                idCardImgHold:$('.idCardImgHold').val(),
                licenseImg:$('.licenseImg').val()
            },function(res)
            {
                if(res.code == 0)
                {
                    layer.msg(res.message);
                }
            });
        },
        /**表单方法 */
        formSub:function(){
            var _this=this
            //提交照片信息
            form.on('submit(subDriverImg)', function(data){
                _this.subDriverImg(data.field);
                return false;

            });
            //提交基本信息
            form.on('submit(detail)', function(data){
                _this.subDriverInfo(data.field);
                //_this.subDriverExt(data.field);
                return false;
            });
            
            //提交车辆分配信息
            form.on('submit(allotCar)', function(data){
                if(driverInfo.dataObj.carId){//解绑
                    driverInfo.eventFun.unBindCar(driverInfo.dataObj.carId,$.getUrlData().id)
                }else{
                    var checkData = new Array();
                    $("input:checkbox[name='listenCarTypes']:checked").each(function(i){
                        checkData[i] = $(this).val();
                    });
                    _this.eventFun.driverStatus(checkData.join())
                }
                
                return false;
            });
            //提交合同信息
            form.on('submit(contractCont)', function(data){
                _this.subDriverContract(data.field)
                return false;
            });
        },
        /*获取下拉菜单数据*/
        getSelectData:function(){
            var _this=this
            /*业务城市*/
            $.postApi('/management/v1/businesscity/cityList',{
                type:'2'
            },function(res)
            {
                if(res.code == 0)
                {
                    $.appendSelect('city',res.content,'code','name');
                    form.render('select');
                }
            });
            $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                "categoryCode": "GENDER"
            },function(res)
            {
                if(res.code == 0)
                {
                    $.appendSelect('gender', res.content, 'value', 'name')
					form.render('select')
                }
            });
            // 驾照类型
			$.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode', {
				'categoryCode': "LICENSE_TYPE",
			}, function (res) {
				if (res.code == 0) {
					$.appendSelect('licenseType', res.content, 'value', 'name')
					form.render('select')
				}
            })
            // 招募渠道
			$.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode', {
				'categoryCode': "RECRUITMENT_CHANNELS",
			}, function (res) {
				if (res.code == 0) {
					$.appendSelect('recruitmentChannels', res.content, 'value', 'name')
					form.render('select')
				}
            })
            // 培训类型
			$.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode', {
				'categoryCode': "TRAINING_TYPE",
			}, function (res) {
				if (res.code == 0) {
					res.content.forEach(function (ele) {
						dropDownList.trainTypeList[ele.value] = ele.name
					})
				}
            })
            /*司机类型*/
            $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                "categoryCode": "DRIVER_TYPE"
            },function(res)
            {
                if(res.code == 0)
                {
                    $.appendSelect('driverType',res.content,'value','name');
                    form.render('select');
                    
                }
            });
            /**车型列表 */
            $.postApi('/management/v1/cartype/list2',{
                "status": 1
            },function(res)
            {
                if(res.code == 0)
                {
                    var str=''
                    res.content.forEach(function(ele,index){
                        str+='<input type="checkbox" name="listenCarTypes" title="'+ele.name+'" lay-skin="primary" value="'+ele.carTypeId+'"> '
                    })
                    $("#CarTypes").append(str)
                    if(driverInfo.dataObj.readonly){
                        $('input[type="checkbox"]').addClass('layui-disabled').attr('disabled','disabled');
                    }
                    driverInfo.eventFun.getBaseInfo();
                    form.render('checkbox');
                }
            });
        },
        toolBar:function()
        {
            var _this = this;
            table.on('toolbar(train)', function(obj){
                switch(obj.event)
                {
                    case 'add':
                        _this.eventFun.addLayer('./driver_train_add.html',{
                            id:driverInfo.dataObj.id
                        },'新增培训信息')
                        break;
                };
            });
            table.on('tool(train)', function(obj){
                if(obj.event=='ele_showImg'){
                    if(obj.data.trainingAccountInfo){
                        $.getFileUrl('driver',obj.data.trainingAccountInfo,function(status,option){
                            if(status == 'success')
                            {                                
                                _this.eventFun.addLayer(option)
                            }
                        });
                    }
                }
            });
        }
    };
    //需要优先执行
    driverInfo.eventFun.getUrlData();
    driverInfo.getSelectData();
    driverInfo.defaultEvent();
    driverInfo.formSub();
    driverInfo.toolBar();
    $.enlargeImg();//图片放大
    window.getDriverCar=driverInfo.eventFun.getDriverCar;//设置司机的车
    window.getTrainInfo=driverInfo.eventFun.getTrainInfo;//设置页面数据

});
