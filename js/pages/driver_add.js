layui.use(['common','form', 'layer','laydate', 'dict', 'permission'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var form = layui.form;
    var laydate = layui.laydate;
    var driverAdd = {
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
                $.postApi('/management/v1/driver/create',{
                    headImg:$("#headImg").attr('key'),//头像
                    driverImg:$("#driverImg").attr('key'),//照片
                    idCardImgBack:$("#idCardImgBack").attr('key'),//身份证背面
                    idCardImgFront:$("#idCardImgFront").attr('key'),//身份证正面
                    idCardImgHold:$("#idCardImgHold").attr('key'),//手持身份证
                    licenseImg:$("#licenseImg").attr('key'),//驾照照片
                    idCardNumber:data.idCardNumber,//身份证号
                    licenseNumber:data.licenseNumber,//驾照号
                    driverType:data.driverType,//司机类型
                    email:data.email,//邮箱
                    loginName:data.loginName,//用户名
                    name:data.name,//姓名
                    phone:data.phone,//手机号
                    gender:data.gender,//性别
                    city:data.city,//城市
                    licenseType:data.licenseType,//准驾类型
                    licenseEndDate:new Date(data.licenseEndDate).getTime()/1000,//生日
                    licenseStartDate:new Date(data.licenseStartDate).getTime()/1000,//生日
                    rentCompanyId:data.rentCompanyId,//公司编号
                    listenCarTypes:val,//司机听单车型
                    birthDate:data.birthDate,//司机出生年月日
                    driverCertNo:data.driverCertNo,//网约车驾驶编号
                    nationality:data.nationality,
                    nation:data.nation
                },function(res)
                {
                    if(res.code == 0)
                    {
                        layer.msg(res.message);
                        window.setTimeout(function(){
                            parent.window.openExtLayer(res.content.driverId)
                            _this.closeLayer();
                            parent.window.$('#searchBt').click();
                            
                        },1000);

                    }
                });
            },
            /*修改司机信息*/
            updateData:function(data,val)
            {
                var _this = this;
                
                $.postApi('/management/v1/driver/update',{
                    driverId:driverAdd.dataObj.id,
                    headImg:$(".headImg").val(),//头像
                    driverImg:$(".driverImg").val(),//照片
                    idCardImgBack:$(".idCardImgBack").val(),//身份证背面
                    idCardImgFront:$(".idCardImgFront").val(),//身份证正面
                    idCardImgHold:$(".idCardImgHold").val(),//手持身份证
                    licenseImg:$(".licenseImg").val(),//驾照照片
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
                    rentCompanyId:data.rentCompanyId,//公司编号
                    listenCarTypes:val,//司机听单车型
                    birthDate:data.birthDate,//司机出生年月日
                    driverCertNo:data.driverCertNo,//网约车驾驶编号
                    nationality:data.nationality,
                    nation:data.nation
                },function(res)
                {
                    if(res.code == 0)
                    {
                        parent.window.openMsg(res.message)

                    }
                });
            },
            /*根据key,id显示图片*/
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
            /*根据id查询司机*/
            getData:function()
            {
                var _this = this;
                $.postApi('/management/v1/driverdetail/info/'+driverAdd.dataObj.id,{
                },function(res)
                {
                    if(res.code == 0)
                    {
                        var formData=res.content
                        /*循环表单赋值*/
                        var inputDom=document.getElementsByClassName("form-control")
                        if(formData){
                            for(var i=0;i<inputDom.length;i++){
                                var attr=inputDom[i].getAttribute("name")  
                                if(attr=='licenseEndDate'||attr=='licenseStartDate'){
                                    inputDom[i].value=formData[attr]?new Date(formData[attr]*1000).Format('yyyy-MM-dd'):""
                                }else if(attr=='birthDate'){
                                    inputDom[i].value=formData[attr]?new Date(formData[attr]).Format('yyyy-MM-dd'):""
                                }else{
                                    inputDom[i].value=formData[attr]
                                }
                            }
                        }
                        /**绑/收车需要的参数 */
                        driverAdd.dataObj.carId=formData.carId
                        driverAdd.dataObj.city=formData.city
                        
                        /*显示司机图片*/
                        driverAdd.eventFun.showDrivierImg(res.content.headImg,'headImg')
                        driverAdd.eventFun.showDrivierImg(res.content.driverImg,'driverImg')
                        driverAdd.eventFun.showDrivierImg(res.content.idCardImgFront,'idCardImgFront')
                        driverAdd.eventFun.showDrivierImg(res.content.idCardImgBack,'idCardImgBack')
                        driverAdd.eventFun.showDrivierImg(res.content.idCardImgHold,'idCardImgHold')
                        driverAdd.eventFun.showDrivierImg(res.content.licenseImg,'licenseImg')
                        
                        /**判断绑车还是收车 */
                        if(!formData.carId){
                            $('#bindCar').show();
                            $('#unBindCar').hide();
                        }else{
                            $('#bindCar').hide();
                            $('#unBindCar').show();
                            $('#unBindCar span').text(formData.carBrand+'-'+formData.carModel+'-'+formData.carAttribute+'-'+formData.carNumber)
                        }

                        

                        /**设置勾选的车型 */
                        formData.listenCarTypes.split(",").forEach(function(ele){
                            $('input[name="listenCarTypes"]').each(function(){ 
                                if($(this).val()==ele){
                                    $(this).attr("checked",true)
                                }
                            });
                        })
                        form.render('checkbox');
                        /*用户名+手机号不可修改*/
                        $('#phone,#loginName').attr('readonly','readonly');
                        form.render('select');

                        /*判断是预览还是编辑*/
                        if(driverAdd.dataObj.readonly === 'readonly')
                        { 
                            $('input[type="checkbox"]').addClass('layui-disabled').attr('disabled','disabled');
                            $('#bindCarCont button').css('display','none')                    
                        }
                    }
                });
            },
            getUrlData:function()
            {
                var urlData = $.getUrlData();
                if(urlData)
                {
                    driverAdd.dataObj.id = urlData.id;
                    driverAdd.dataObj.readonly = urlData.readonly;
                    driverAdd.dataObj.type = 'update';
                    $('#jsSub').text('保存')
                    $('#jsBrandBack').hide()
                    
                }
                /*判断是预览还是编辑*/
                if(driverAdd.dataObj.readonly === 'readonly')
                {
                    $('input,textarea').addClass('layui-disabled').attr('readonly','readonly');
                    $('select,.real_file_btn,input[type="checkbox"]').addClass('layui-disabled').attr('disabled','disabled');
                    $('#jsSub').css('display','none');
                    $('.my_file_btn').addClass('layui-btn-disabled')
                    $('#bindCarCont button').css('display','none')                    
                }
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
                });
            },
            
            verify:function()
                {
                    form.verify({
                        driverCertNoCheck: function(value, item){ 
                            if(!/^.{0,64}$/.test(value)){
                              return '不能大于64位数值';
                            }
                          },
                        licenseNumberCheck: function(value, item){ 
                            if(!/^.{0,32}$/.test(value)){
                                return '不能大于32位数值';
                            }
                          },
                        driverNameCheck:function(value,item){
                            if(!/^[\u4e00-\u9fa5a-zA-Z0-9]{1,20}$/.test(value)){
                                return '只能为1-20位英文/汉字/数字';
                            }
                        },
                        driverLoginName:function(value,item){
                            if(!/^[a-zA-Z0-9]{1,20}$/.test(value)){
                                return '用户名只能为1-20位英文或者数字';
                            }
                        }
                    });
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
                    var checkoutCont=[]
                    $('input[name="listenCarTypes"]:checked').each(function(){ 
                        checkoutCont.push($(this).val()); 
                    });
                    _this.eventFun.subData(data.field,checkoutCont.join());
                    return false;
                });
                $('#bindCarCont').hide();
            }
            //更新
            else if(_this.dataObj.type == 'update')
            {
                form.on('submit(*)', function(data){
                    var checkoutCont=[]
                    $('input[name="listenCarTypes"]:checked').each(function(){ 
                        checkoutCont.push($(this).val()); 
                    });
                    _this.eventFun.updateData(data.field,checkoutCont.join());
                    return false;
                });
            }

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
            /**车型列表 */
            $.postApi('/management/v1/cartype/list',{
                
            },function(res)
            {
                if(res.code == 0)
                {
                    var str=''
                    res.content.data.forEach(function(ele,index){
                        str+='<input type="checkbox" name="listenCarTypes" title="'+ele.name+'" lay-skin="primary" value="'+ele.carTypeId+'"> '
                    })
                    $("#CarTypes").append(str)
                    form.render('checkbox');
                }
            });
            /*司机类型*/
            $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                "categoryCode": "DRIVER_TYPE"
            },function(res)
            {
                if(res.code == 0)
                {
                    $.appendSelect('driverType',res.content,'value','name');
                    /*查询广告信息*/
                    if(driverAdd.dataObj.id){
                        driverAdd.eventFun.getData();
                    }
                    form.render('select');
                }
            });
        },
        /*默认方法*/
        defaultEvent:function()
        {
            var _this = this;
            
            $('#jsBrandBack').click(function(){
                _this.eventFun.closeLayer();
            });

            

            //绑定图片事件
            _this.eventFun.blindUploadImg('headImg');//头像
            _this.eventFun.blindUploadImg('driverImg');//司机照片
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
                        $("#gender").val(res.content.sex=='女'?"1":"2")//性别
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
            if(!$.getUrlData().readonly){
                /**选择劳务公司 */
                $('#rentCompanyId').click(function(){
                    if($('#city').val()==''){
                        layer.msg('请先选择司机所在城市');
                    }else{
                        parent.window.addParentLayer?parent.window.addParentLayer('./driver_choose_labor.html',{
                            'city':$('#city').val(),
                        }):driverAdd.eventFun.addLayer('./driver_choose_labor.html',{
                            'city':$('#city').val(),
                        })
                    }
                })
                /*出生年月日*/
                laydate.render({
                    elem: '#licenseEndDate',
                    trigger: 'click',
                    min:new Date(Date.now()+24*60*60*1000).Format('yyyy-MM-dd')
                });
                laydate.render({
                    elem: '#licenseStartDate',
                    trigger: 'click',
                    max:new Date(Date.now()-24*60*60*1000).Format('yyyy-MM-dd')
                });
                laydate.render({
                    elem: '#birthDate',
                    trigger: 'click',
                    max:new Date(Date.now()-24*60*60*1000).Format('yyyy-MM-dd')
                });
            }
            
            /**解绑车辆 */
            $('#unBindCar').click(function(){
                parent.window.driverunBindCar(driverAdd.dataObj.carId,driverAdd.dataObj.id)               
            })
            /**绑定车辆 */
            $('#bindCar').click(function(){
                if(!driverAdd.dataObj.city){
                    layer.msg('请先设置司机所在城市');
                    return false
                }
                parent.window.addParentLayer?parent.window.addParentLayer('./driver_allot_car.html',{
                    'id':driverAdd.dataObj.id,
                    'city':driverAdd.dataObj.city
                }):driverAdd.eventFun.addLayer('./driver_allot_car.html',{
                    'id':driverAdd.dataObj.id,
                    'city':driverAdd.dataObj.city
                });
            })
        }
    };
    //需要优先执行
    driverAdd.eventFun.getUrlData();
    driverAdd.eventFun.verify()
    driverAdd.defaultEvent();
    driverAdd.formSub();
    driverAdd.getSelectData();
    window.getData=driverAdd.eventFun.getData
    $.enlargeImg()
});
