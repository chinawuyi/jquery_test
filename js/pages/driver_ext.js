layui.use(['common','form', 'layer','laydate', 'dict', 'permission'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var form = layui.form;
    var laydate = layui.laydate;
    var driverExt = {
        photo:'',
        dataObj:{
            'id':'',
            'type':'new',
            'readonly':'',
            'carId':''
        },
        eventFun:{
            addLayer:function(action,options)
            {
                if(options)
                {
                    action = $.addUrlPro(action,options);
                }
                layer.open({
                    type: 2,
                    title:'司机管理',
                    content: action,
                    area: ['700px', '400px'],
                    maxmin: true
                });
            },
            closeLayer:function()
            {
                var index = parent.layer.getFrameIndex(window.name);
                parent.layer.close(index);
            },
            /*创建司机*/
            subData:function(data,val)
            {
                var _this = this;
                $.postApi('/management/v1/driver/ext/create',{
                    driverId:driverExt.dataObj.id,
                    appVersion:data.appVersion,//APP版本号
                    certificateB:data.certificateB,//巡游出租汽车驾驶员资格证号
                    commercialType:data.commercialType,//出租资格类别
                    contractCompany:data.contractCompany,//驾驶员合同（或协议）签署公司标识
                    contractOff:data.contractOff?new Date(data.contractOff).getTime()/1000:'',//合同（或协议）有效期起
                    contractOn:data.contractOn?new Date(data.contractOn).getTime()/1000:'',//合同（或协议）有效期止
                    driverAddress:data.driverAddress,//户口地址或常住地址
                    driverCensus:data.driverCensus,//户口登记机关名称
                    driverContactAddress:data.driverContactAddress,//驾驶员通信地址
                    driverEducation:data.driverEducation,//驾驶员学历
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
                    // licensePhoto:data.licensePhoto,//机动车驾驶证扫描件文件
                    // licensePhotoId:data.licensePhotoId,//机动车驾驶证扫描件文件编号
                    mobileModel:data.mobileModel,//司机手机型号
                    mapType:data.mapType,
                    netType:data.netType,//司机手机运营商
                    networkCarIssueDate:data.networkCarIssueDate?new Date(data.networkCarIssueDate).getTime()/1000:'',//资格证发证日期
                    networkCarIssueOrganization:data.networkCarIssueOrganization,//网络预约出租汽车驾驶员证发证机构
                    networkCarProofOff:data.networkCarProofOff?new Date(data.networkCarProofOff).getTime()/1000:'',//网络预约出租汽车驾驶员证有效期止
                    networkCarProofOn:data.networkCarProofOn?new Date(data.networkCarProofOn).getTime()/1000:'',//网络预约出租汽车驾驶员证有效期起
                    operator:sessionStorage.getItem('operator'),
                    // photoid:data.photoid,//驾驶员照片文件编号
                    taxiDriver:data.taxiDriver//是否巡游出租汽车驾驶员
                },function(res)
                {
                    if(res.code == 0)
                    {                        
                        
                        if(parent.window.openMsg){
                            parent.window.openMsg(res.message)
                            window.location.reload()
                        }else{
                            layer.msg(res.message);
                            window.setTimeout(function(){
                                _this.closeLayer();                            
                            },1000);
                        }
                    }
                });
            },
            /*修改司机信息*/
            updateData:function(data,val)
            {
                var _this = this;
                
                $.postApi('/management/v1/driver/ext/update',{
                    driverId:driverExt.dataObj.id,
                    appVersion:data.appVersion,//APP版本号
                    certificateB:data.certificateB,//巡游出租汽车驾驶员资格证号
                    commercialType:data.commercialType,//出租资格类别
                    contractCompany:data.contractCompany,//驾驶员合同（或协议）签署公司标识
                    contractOff:data.contractOff?new Date(data.contractOff).getTime()/1000:'',//合同（或协议）有效期止
                    contractOn:data.contractOn?new Date(data.contractOn).getTime()/1000:'',//合同（或协议）有效期起
                    driverAddress:data.driverAddress,//户口地址或常住地址
                    driverCensus:data.driverCensus,//户口登记机关名称
                    driverContactAddress:data.driverContactAddress,//驾驶员通信地址
                    driverEducation:data.driverEducation,//驾驶员学历
                    driverExtId:driverExt.dataObj.driverExtId,//司机扩展ID
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
                    // licensePhoto:data.licensePhoto,//机动车驾驶证扫描件文件
                    // licensePhotoId:data.licensePhotoId,//机动车驾驶证扫描件文件编号
                    mobileModel:data.mobileModel,//司机手机型号
                    mapType:data.mapType,
                    netType:data.netType,//司机手机运营商
                    networkCarIssueDate:data.networkCarIssueDate?new Date(data.networkCarIssueDate).getTime()/1000:'',//资格证发证日期
                    networkCarIssueOrganization:data.networkCarIssueOrganization,//网络预约出租汽车驾驶员证发证机构
                    networkCarProofOff:data.networkCarProofOff?new Date(data.networkCarProofOff).getTime()/1000:'',//网络预约出租汽车驾驶员证有效期止
                    networkCarProofOn:data.networkCarProofOn?new Date(data.networkCarProofOn).getTime()/1000:'',//网络预约出租汽车驾驶员证有效期起
                    operator:sessionStorage.getItem('operator'),
                    // photoid:data.photoid,//驾驶员照片文件编号
                    taxiDriver:data.taxiDriver//是否巡游出租汽车驾驶员
                },function(res)
                {
                    if(res.code == 0)
                    {
                        parent.window.openMsg(res.message)

                    }
                });
            },
            /*根据id查询司机*/
            getData:function()
            {
                var _this = this;
                $.getApi('/management/v1/driver/ext/info/'+driverExt.dataObj.id,{
                },function(res)
                {
                    if(res.code == 0)
                    {
                        var formData=res.content
                        /*循环表单赋值*/
                        var inputDom=document.getElementsByClassName("form-control")
                        
                        if(formData){//已存在扩展
                            driverExt.dataObj.type='update'
                            driverExt.dataObj.driverExtId=formData.driverExtId
                            for(var i=0;i<inputDom.length;i++){
                                var attr=inputDom[i].getAttribute("name")  
                                if(attr=='contractOff'||attr=='contractOn'||attr=='getDriverLicenseDate'||attr=='getNetworkCarProofDate'||attr=='networkCarIssueDate'||attr=='networkCarProofOff'||attr=='networkCarProofOn'){
                                    inputDom[i].value=formData[attr]?new Date(formData[attr]*1000).Format('yyyy-MM-dd'):''
                                }else{
                                    inputDom[i].value=typeof(formData[attr])=='undefined'?"":formData[attr]
                                }
                                
                            }
                        }
                        form.render('select');
                        driverExt.formSub();

                    }
                });
            },
            getUrlData:function()
            {

                driverExt.dataObj.id = $.getUrlData().id;
                driverExt.dataObj.readonly = $.getUrlData().readonly;
                driverExt.eventFun.getData();
                /*判断是预览还是编辑*/
                if(driverExt.dataObj.readonly === 'readonly')
                {
                    $('input,textarea').addClass('layui-disabled').attr('readonly','readonly');
                    $('select,.real_file_btn,input[type="checkbox"]').addClass('layui-disabled').attr('disabled','disabled');
                    $('#jsSub').css('display','none');
                    $('.my_file_btn').addClass('layui-btn-disabled')                   
                }
            },
        },
        /*提交表单*/
        formSub:function()
        {
            var _this = this;
            //获取复选框的值
            
            //新创建
            if(_this.dataObj.type == 'new')
            {
                form.on('submit(*)', function(data){
                    _this.eventFun.subData(data.field);
                    return false;
                });
            }
            //更新
            else if(_this.dataObj.type == 'update')
            {
                form.on('submit(*)', function(data){
                    _this.eventFun.updateData(data.field);
                    return false;
                });
            }

        },

        /*默认方法*/
        defaultEvent:function()
        {
            var _this = this;
            
            $('#jsBrandBack').click(function(){
                _this.eventFun.closeLayer();
            });
            if($.getUrlData().readonly != 'readonly'){            
                /*出生年月日*/
                laydate.render({
                    trigger: 'click',
                    elem: '#contractOff',
                    min:new Date(Date.now()+24*60*60*1000).Format('yyyy/MM/dd')
                });
                laydate.render({
                    trigger: 'click',
                    elem: '#contractOn',
                    max:new Date(Date.now()-24*60*60*1000).Format('yyyy/MM/dd')
                });
                laydate.render({
                    trigger: 'click',
                    elem: '#getDriverLicenseDate',
                    max:new Date(Date.now()-24*60*60*1000).Format('yyyy/MM/dd')
                });
                laydate.render({
                    trigger: 'click',
                    elem: '#getNetworkCarProofDate',
                    max:new Date(Date.now()-24*60*60*1000).Format('yyyy/MM/dd')
                });
                laydate.render({
                    trigger: 'click',
                    elem: '#networkCarIssueDate',
                    max:new Date(Date.now()-24*60*60*1000).Format('yyyy/MM/dd')
                });
                laydate.render({
                    trigger: 'click',
                    elem: '#networkCarProofOff',
                    min:new Date(Date.now()+24*60*60*1000).Format('yyyy/MM/dd')
                });
                laydate.render({
                    trigger: 'click',
                    elem: '#networkCarProofOn',
                    max:new Date(Date.now()-24*60*60*1000).Format('yyyy/MM/dd')
                });
            }
        }
    };
    //需要优先执行
    driverExt.eventFun.getUrlData();
    driverExt.defaultEvent();
    
});
