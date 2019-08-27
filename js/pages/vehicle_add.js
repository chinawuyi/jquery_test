layui.use(['common','form', 'layer', 'dict', 'permission'], function()
{
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var form = layui.form;

    var table = layui.table;
    var vehicleAdd = {
        //车辆照片，前后左右4张图
        carImgs:'',
        carLicenseImg:'',
        carNumberImg:'',
        dataObj:{
            'carId':'',
            'type':'new',
            'readonly':''
        },
        brandTree:[],
        modelList:[],
        eventFun:{
            addLayer:function(action,options)
            {
                if(options)
                {
                    action = $.addUrlPro(action,options);
                }
                layer.open({
                    type: 2,
                    title:'租赁公司',
                    content: action,
                    area: ['700px', $(window).height()-80+'px'],
                    maxmin: true
                });
            },
            closeLayer:function()
            {
                var index = parent.layer.getFrameIndex(window.name);
                parent.layer.close(index);
            },
            subData:function(data)
            {
                var _this = this;
                $.postApi('/management/'+$.BC.V+'/vehicle/create',{
                    "carAttributeId": data.carAttributeId,
                    //车辆行驶证图片
                    "carLicenseImg": vehicleAdd.carLicenseImg,
                    //汽车照片，多图片
                    "carImgs":vehicleAdd.carImgs,
                    //车牌号码
                    "carNumber":data.carNumber,
                    //车牌号码图片
                    "carNumberImg":vehicleAdd.carNumberImg,
                    //车辆识别码，行驶证上的号码
                    "carVerifyCode":data.carVerifyCode,
                    "city": data.city,
                    //发动机号
                    "engineNumber":data.engineNumber,
                    //油耗
                    "oilWear": data.oilWear,
                    //租赁公司
                    "rentCompanyId":$('#rentCompanyId').attr('data-id'),
                    //变速箱
                    "variableBox":data.variableBox,
                    //车辆的行驶总里程数
                    "totalMileage":data.totalMileage,
                    "plateColor":data.plateColor,
                    "carCertNo":data.carCertNo
                },
                function(res)
                {
                    if(res.code == 0)
                    {
                        var carId = res.content.carId;
                        window.location.href = 'vehicle_ext_add.html?carId='+carId;
                    }
                });
            },
            updateData:function(data)
            {
                var _this = this;
                $.postApi('/management/v1/vehicle/update',{
                    "carId":vehicleAdd.dataObj.carId,
                    "carAttributeId": data.carAttributeId,
                    //车辆行驶证图片
                    "carLicenseImg": vehicleAdd.carLicenseImg,
                    //汽车照片，多图片
                    "carImgs":vehicleAdd.carImgs,
                    //车牌号码
                    "carNumber":data.carNumber,
                    //车牌号码图片
                    "carNumberImg":vehicleAdd.carNumberImg,
                    //车辆识别码，行驶证上的号码
                    "carVerifyCode":data.carVerifyCode,
                    "city": data.city,
                    //发动机号
                    "engineNumber":data.engineNumber,
                    //油耗
                    "oilWear": data.oilWear,
                    //租赁公司
                    "rentCompanyId":$('#rentCompanyId').attr('data-id'),
                    //变速箱
                    "variableBox":data.variableBox,
                    //车辆的行驶总里程数
                    "totalMileage":data.totalMileage,
                    "plateColor":data.plateColor,
                    "carCertNo":data.carCertNo
                },function(res)
                {
                    if(res.code == 0)
                    {
                        parent.layer.msg(res.message);
                        window.setTimeout(function(){
                            _this.closeLayer();
                        },1000);

                    }
                });
            },
            getData:function()
            {
                $.getApi('/management/v1/vehicle/query',{
                    "carId": vehicleAdd.dataObj.carId,
                },
                function(res)
                {
                    console.log(res);
                    if(res.code == 0)
                    {
                        //获取品牌，车系联动JSON接口
                        vehicleAdd.eventFun.getBrandsTree(res.content);
                        //获取城市字典接口
                        vehicleAdd.eventFun.getCitys(res.content);
                        //获取公司接口
                        vehicleAdd.eventFun.getCompany(res.content);
                        vehicleAdd.eventFun.getCarColor(res.content);
                        $('#carAttributeId').val(res.content.carAttributeId);
                        $('#carNumber').val(res.content.carNumber);
                        $('#carVerifyCode').val(res.content.carVerifyCode);
                        $('#engineNumber').val(res.content.engineNumber);
                        $('#oilWear').val(res.content.oilWear);
                        // $('#rentCompanyId').val(res.content.rentCompanyId);
                        $('#variableBox').val(res.content.variableBox);

                        $('#carCertNo').val(res.content.carCertNo);
                        $('#totalMileage').val(res.content.totalMileage);
                        if(res.content.driverId !=null && res.content.driverId != 0)
                        {
                            $('#driverId').append(res.content.driverId);
                            $('#driverId').append('<button type="button" id="ele_clear" style="margin-left:20px;" class="layui-btn layui-btn-xs jsupdate"  lay-event="ele_clear" >解绑</button>');
                            $('#ele_clear').click(function(){
                                console.log(parent);
                                parent.window.driverunBindCar(res.content.carId,res.content.driverId);
                            });
                        }
                        //查看
                        if(vehicleAdd.dataObj.readonly == 'readonly')
                        {
                            $.readOnly();
                            $('#carImgsBtn,#carLicenseImgBtn,#carNumberImgBtn').empty();
                            $.replaceSelect([
                                {
                                    'id':'carBrandId',
                                    'value':res.content.carBrand
                                },
                                {
                                    'id':'carModelId',
                                    'value':res.content.carModel
                                },
                                {
                                    'id':'carAttributeId',
                                    'value':res.content.carAttribute
                                }
                            ]);
                        }
                        if(res.content.carImgs)
                        {
                            $.getFileUrl('vehicle',res.content.carImgs.split(','),function(status,urldata)
                            {
                                $(urldata).each(function(){
                                    $('#imgcon').append('<img style="margin-right:5px;" src="'+this+'"  class="enlarge"/>');
                                });
                            });
                        }
                        if(res.content.carLicenseImg)
                        {
                            //carLicenseImgCon
                            $.getFileUrl('vehicle',res.content.carLicenseImg.split(','),function(status,urldata)
                            {
                                $(urldata).each(function(){
                                    $('#carLicenseImgCon').append('<img style="margin-right:5px;" src="'+this+'"  class="enlarge"/>');
                                });
                            });
                        }
                        if(res.content.carNumberImg)
                        {
                            //carNumberImgCon
                            $.getFileUrl('vehicle',res.content.carNumberImg.split(','),function(status,urldata)
                            {
                                $(urldata).each(function(){
                                    $('#carNumberImgCon').append('<img style="margin-right:5px;" src="'+this+'"  class="enlarge"/>');
                                });
                            });
                        }
                    }
                });
            },
            getTypes:function()
            {
                $.postApi('/management/v1/cartype/list',{
                    // "carBrandId": vehicleAdd.dataObj.carBrandId,
                },
                function(res)
                {
                    if(res.code == 0)
                    {
                        $.appendSelect('status2',res.content.data,'carTypeId','name');
                        form.render('select');
                    }
                });
            },
            getCarColor:function(data)
            {
                $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                    "categoryCode": "PLATE_COLOR"
                },function(res)
                {
                    if(res.code == 0)
                    {
                        $.appendSelect('plateColor',res.content,'value','name',data?data.plateColor:null);
                        form.render('select');
                        if(vehicleAdd.dataObj.readonly == 'readonly')
                        {
                            $.replaceSelectByVal([
                                {
                                    'id':'plateColor',
                                    'value':data.plateColor
                                }
                            ]);
                        }
                    }
                });
            },
            getUrlData:function()
            {
                var urlData = $.getUrlData();
                if(urlData)
                {
                    vehicleAdd.dataObj.carId = urlData.carId;
                    vehicleAdd.dataObj.readonly = urlData.readonly;
                    vehicleAdd.dataObj.type = 'update';
                    if(urlData.readonly == 'readonly')
                    {
                        vehicleAdd.dataObj.readonly = 'readonly';
                    }
                    this.getData();
                }
                else{
                    //获取品牌，车系联动JSON接口
                    vehicleAdd.eventFun.getBrandsTree();
                    vehicleAdd.eventFun.getCitys();
                    vehicleAdd.eventFun.getCarColor();
                }
            },
            getCitys:function(data)
            {
                $.postApi('/management/v1/businesscity/cityList',{
                    "type":"2"
                },
                function(res)
                {
                    $.appendSelect('city',res.content==null?[]:res.content,'code','name',data?data.city:null);
                    form.render('select');
                    if(vehicleAdd.dataObj.readonly == 'readonly')
                    {
                        $.replaceSelectByVal([
                            {
                                'id':'city',
                                'value':data.city
                            }
                        ]);
                    }


                });
            },
            getBrandsTree:function(data)
            {
                var _this = this;
                $.getApi('/management/v1/vehicle/listTree',{

                },
                function(res)
                {
                    if(res.code == 0)
                    {
                        vehicleAdd.brandTree = res.content;
                        _this._initTree(res.content,data);

                    }
                });
            },
            getCompany:function(city)
            {
                var options = [];
                if(typeof(city) == 'string')
                {
                    options.push(city);
                }
                else{
                    options.push(city.city);
                }
                $.getApi2('/management/v1/carrent/list',options,
                function(res)
                {
                    if(res.code == 0)
                    {
                        // $.appendSelect('rentCompanyId',res.content,'rentCompanyId','chineseName',city.rentCompanyId);
                        // form.render('select');
                        $(res.content).each(function(){
                            if(this.rentCompanyId == city.rentCompanyId){
                                if(vehicleAdd.dataObj.readonly == 'readonly')
                                {
                                    $('#rentCompanyId').replaceWith(this.chineseName);
                                }else{
                                    $('#rentCompanyId').val(this.chineseName).attr('data-id',this.rentCompanyId)
                                }
                            }
                        })

                    }
                });
            },
            _initTree:function(data,defaultdata)
            {
                if(!defaultdata)
                {
                    $.appendSelect('carBrandId',data,'carBrandId','name');
                    form.render('select');
                }
                else
                {
                    $.appendSelect('carBrandId',data,'carBrandId','name',defaultdata.carBrandId);
                    $(data).each(function(){
                        if(this.carBrandId == defaultdata.carBrandId)
                        {
                            $.appendSelect('carModelId',this.modelList,'carModelId','name',defaultdata.carModelId);
                            $(this.modelList).each(function(){
                                if(this.carModelId == defaultdata.carModelId)
                                {
                                    $.appendSelect('carAttributeId',this.attributeList,'carAttributeId','name',defaultdata.carAttributeId);
                                }
                            });
                        }
                    });
                    form.render('select');
                }
            },
        },
        formSub:function()
        {
            var _this = this;
            //新创建
            if(_this.dataObj.type == 'new')
            {
                $('#jsSub').text('保存，下一步');
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
        verify:function()
        {
            form.verify({
                carBrandId:function(value,item){
                    if(value == '')
                    {
                        return '请选择车型品牌';
                    }
                },
                carTypeId:function(value)
                {
                    if(value == '')
                    {
                        return '请选择车型';
                    }
                },
                //油耗
                oilRule:function(value){
                    if(!/^\d+(.\d)*$/.test(value)){
                        return '请填写正确的油耗';
                    }
                },
                // 车牌号
                carPlateRule:function(val){
                    var reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/g
                    if(!reg.test(val)){
                        return '请输入正确的车牌号';
                    }
                },
                //车辆识别vin码
                vinRule:function(val){
                    if(!/^[\da-zA-Z]{17}$/.test(val)){
                        return '请输入17位车辆识别VIN码'
                    }
                },
                //车辆行驶总里程数
                totalMileageRule:function(val){
                    if(!/^\d+(.\d+)*$/.test(val)){
                        return '请填写正确格式的车辆行驶总里程数'
                    }
                }
            });
        },
        defaultEvent:function()
        {
            var _this = this;
            $('#jsBrandBack').click(function(){
                _this.eventFun.closeLayer();
            });
            this.eventFun.getTypes();

            form.on('select(carBrandId)', function(data)
            {

                if(data.value !='')
                {
                    $(_this.brandTree).each(function()
                    {
                        if(this.carBrandId == data.value)
                        {
                            $.appendSelect('carModelId',this.modelList==null?[]:this.modelList,'carModelId','name');
                            _this.modelList= (this.modelList == null)?[]:this.modelList;
                            form.render('select');
                        }

                    });
                }
            });
            form.on('select(city)', function(data)
            {

                if(data.value !='')
                {
                    vehicleAdd.eventFun.getCompany(data.value)
                }
            });
            form.on('select(carModelId)', function(data)
            {
                console.log(data);

                if(data.value !='')
                {
                    if(_this.modelList.length == 0)
                    {
                        //车系没有数据

                    }
                    else{
                        $(_this.modelList).each(function()
                        {
                            if(this.carModelId == data.value)
                            {
                                $.appendSelect('carAttributeId',this.attributeList==null?[]:this.attributeList,'carAttributeId','name');
                                form.render('select');
                            }

                        });
                    }

                }
            });


            $('#carImgs').uploadFun('vehicle',function(status,data)
            {
                if(status == 'success')
                {
                    vehicleAdd.carImgs = data.join(',');
                    $('#imgcon').empty();

                }
                $.getFileUrl('vehicle',data,function(status,urldata)
                {
                   $(urldata).each(function(){
                       $('#imgcon').append('<img style="margin-right:5px;" src="'+this+'"  class="enlarge"/>');
                   });
                });
            },5);
            //carNumberImg
            $('#carLicenseImg').uploadFun('vehicle',function(status,data){
                if(status == 'success')
                {
                    vehicleAdd.carLicenseImg = data.join(',');
                    $('#carLicenseImgCon').empty();

                }
                $.getFileUrl('vehicle',data,function(status,urldata)
                {
                    $(urldata).each(function()
                    {
                        $('#carLicenseImgCon').append('<img style="margin-right:5px;" src="'+this+'"  class="enlarge"/>');
                    });
                    $.postApi('/management/ocr/v1/driverLicense',{
                        // "carBrandId": vehicleAdd.dataObj.carBrandId,
                        "type": 0,
                        "url": urldata[0]
                    },
                    function(res)
                    {
                        console.log(res);
                        if(res.code == 0)
                        {
                            $(res.content).each(function(){
                                if(this.item == '车牌号码')
                                {
                                    $('#carNumber').val(this.itemstring);
                                }
                                if(this.item == '识别代码')
                                {
                                    $('#carVerifyCode').val(this.itemstring);
                                }
                                if(this.item == '发动机号')
                                {
                                    $('#engineNumber').val(this.itemstring);
                                }
                            });

                        }else{
                            layer.msg('行驶证识别失败')
                        }
                    },true);
                });
            });
            $('#carNumberImg').uploadFun('vehicle',function(status,data){
                if(status == 'success')
                {
                    vehicleAdd.carNumberImg = data.join(',');
                    console.log(vehicleAdd.carNumberImg);
                    $('#carNumberImgCon').empty();

                }
                $.getFileUrl('vehicle',data,function(status,urldata)
                {
                    $(urldata).each(function(){
                        $('#carNumberImgCon').append('<img style="margin-right:5px;" src="'+this+'"  class="enlarge"/>');
                    });
                });
            });


            //添加租赁公司事件
            $('#rentCompanyId').click(function(){
                if($('#city').val() == '')
                {
                    layer.msg('请选择城市');
                }
                else{
                    vehicleAdd.eventFun.addLayer('./vehicle_rent_choose.html',{
                        'city':$('#city').val(),
                    });
                }
            });

        }
    };
    //需要优先执行
    vehicleAdd.eventFun.getUrlData();
    vehicleAdd.defaultEvent();
    vehicleAdd.verify();
    vehicleAdd.formSub();
    $.enlargeImg();


});