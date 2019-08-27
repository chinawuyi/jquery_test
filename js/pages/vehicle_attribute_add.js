layui.use(['common','form', 'layer', 'dict', 'permission'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var form = layui.form;
    var vehicleAdd = {
        //存储上传图片路径
        photo:'',
        brandTree:[],
        dataObj:{
            'carAttributeId':'',
            'readonly':'',
            'type':'new'
        },
        eventFun:{
            closeLayer:function()
            {
                var index = parent.layer.getFrameIndex(window.name);
                parent.layer.close(index);
            },
            subData:function(data)
            {

                var _this = this;
                $.postApi('/management/'+$.BC.V+'/attribute/create',{
                    "carModelId": data.carModelId,
                    "color": data.color,
                    "enName": data.enName,
                    "name": data.name,
                    "personNumber":data.personNumber,
                    //排气量
                    "exhaustVolume":data.exhaustVolume,
                    //排气量单位
                    "exhaustVolumeUnit":data.exhaustVolumeUnit,
                    "photo": data.photo,
                    "photoId":data.photoId,
                    "fuelType":data.fuelType,
                    "wheelBase":data.wheelBase
                },function(res)
                {
                    if(res.code == 0)
                    {
                        layer.msg(res.message);
                        window.setTimeout(function(){
                            _this.closeLayer();
                        },1000);

                    }
                });
            },
            updateData:function(data)
            {
                var _this = this;
                $.postApi('/management/'+$.BC.V+'/attribute/updateAttribute',{
                    "carAttributeId":vehicleAdd.dataObj.carAttributeId,
                    "carModelId": data.carModelId,
                    "color": data.color,
                    "enName": data.enName,
                    "name": data.name,
                    //排气量
                    "exhaustVolume":data.exhaustVolume,
                    //排气量单位
                    "exhaustVolumeUnit":data.exhaustVolumeUnit,
                    "personNumber":data.personNumber,
                    "photo": vehicleAdd.photo,
                    "photoId":data.photoId,
                    "fuelType":data.fuelType,
                    "wheelBase":data.wheelBase
                },function(res)
                {
                    if(res.code == 0)
                    {
                        layer.msg(res.message);
                        window.setTimeout(function(){
                            _this.closeLayer();
                        },1000);

                    }
                });
            },
            getData:function()
            {
                $.getApi('/management/'+$.BC.V+'/attribute/query',{
                    "carAttributeId": vehicleAdd.dataObj.carAttributeId,
                },function(res)
                {
                    console.log(res)
                    if(res.code == 0)
                    {

                        //获取品牌，车系联动JSON接口
                        vehicleAdd.eventFun.getBrandsTree(res.content);
                        //获取颜色字典接口
                        vehicleAdd.eventFun.getColors(res.content);

                        $('#name').val(res.content.name);
                        $('#enName').val(res.content.enName);
                        $('#personNumber').val(res.content.personNumber);

                        $('#exhaustVolume').val(res.content.exhaustVolume);
                        $('#exhaustVolumeUnit').val(res.content.exhaustVolumeUnit);
                        $('#photoId').val(res.content.photoId);
                        $('#fuelType').val(res.content.fuelType);
                        $('#wheelBase').val(res.content.wheelBase);
                        if(vehicleAdd.dataObj.readonly === 'readonly')
                        {
                            $.readOnly();
                            $('#jsfilecon').empty();
                            $.replaceSelect([
                                {
                                    'id':'carBrandId',
                                    'value':res.content.carBrand
                                },
                                {
                                    'id':'carModelId',
                                    'value':res.content.carModel
                                }
                            ]);
                            vehicleAdd.eventFun.getColorValueById(res.content.color)
                        }
                        if(res.content.photo){
                            $.getFileUrl('carattribute',res.content.photo.split(','),function(status,option){
                                if(status == 'success')
                                {

                                    $('#jsphotoshow').empty();
                                    $('#jsphotoshow').append('<img src="'+option+'"  class="enlarge"/>');
                                }
                            });
                        }
                    }
                });
            },
            getBrandsTree:function(data)
            {
                var _this = this;
                $.getApi('/management/v1/vehicle/listTree',{
                },function(res)
                {
                    if(res.code == 0)
                    {

                        vehicleAdd.brandTree = res.content;
                        _this._initTree(res.content,data);

                    }
                });
            },
            getColors:function(data)
            {
                var _this = this;
                $.postApi('/management/'+$.BC.V+'/dictcommon/getDictCommonsByCategoryCode',{
                    "categoryCode":$.BC.WB.VEHICLE_COLOR
                },
                function(res)
                {
                    if(res.code == 0)
                    {
                        $.appendSelect('color',res.content,'value','name',data?data.color:'');
                        form.render('select');

                    }
                });
            },
            getColorValueById:function(id){
                var _this = this,name='';
                console.log(id);
                $.postApi('/management/'+$.BC.V+'/dictcommon/getDictCommonsByCategoryCode',{
                    "categoryCode":$.BC.WB.VEHICLE_COLOR
                },
                function(res)
                {
                    console.log(res)
                    if(res.code == 0)
                    {

                        $(res.content).each(function(){
                            if(id == this.value){
                                name = this.name
                            }
                        })
                        $.replaceSelect([
                            {
                                'id':'color',
                                'value':name
                            }
                        ]); 
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
                else{
                    $.appendSelect('carBrandId',data,'carBrandId','name',defaultdata.carBrandId);
                    $(data).each(function(){
                        if(this.carBrandId == defaultdata.carBrandId)
                        {
                            $.appendSelect('carModelId',this.modelList,'carModelId','name',defaultdata.carModelId);
                        }
                    });
                    form.render('select');

                }

            },
            getUrlData:function()
            {
                var urlData = $.getUrlData();
                if(urlData)
                {
                    vehicleAdd.dataObj.carAttributeId = urlData.carAttributeId;
                    vehicleAdd.dataObj.readonly = urlData.readonly;
                    vehicleAdd.dataObj.type = 'update';
                    this.getData();
                }
                else
                {
                    //获取品牌，车系联动JSON接口
                    vehicleAdd.eventFun.getBrandsTree();
                    //获取颜色字典接口
                    vehicleAdd.eventFun.getColors();
                }
            },
            verify:function()
            {
                form.verify({
                    //可乘人数
                    passageRule:function(value,item){
                        if(!/^\d+$/g.test(value))
                        {
                            return '请填写正确的可乘人数';
                        }
                    },
                    //排气量
                    floatRule:function(value,item){
                        if(!/^\d+(.\d+)*$/g.test(value))
                        {
                            return '请填写正确排气量';
                        }
                    },
                });
            },
        },
        formSub:function()
        {
            var _this = this;
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
        defaultEvent:function()
        {
            var _this = this;
            $('#jsBrandBack').click(function(){
                _this.eventFun.closeLayer();
            });
            //车辆品牌联动
            form.on('select(carBrandId)', function(data){
                if(data.value !='')
                {
                    $(_this.brandTree).each(function()
                    {
                        if(this.carBrandId == data.value)
                        {
                            $.appendSelect('carModelId',this.modelList==null?[]:this.modelList,'carModelId','name');
                            form.render('select');
                        }

                    });
                }
            });
            //图片上传
            $('#photo').uploadFun('carattribute',function(status,key)
            {
                if(status =='success')
                {
                    $.getFileUrl('carattribute',key,function(status,option){
                        if(status == 'success')
                        {
                            _this.photo = key[0];
                            $('#jsphotoshow').empty();
                            $('#jsphotoshow').append('<img src="'+option+'"  class="enlarge"/>');
                        }
                    });
                }
            });



        }
    };
    //需要优先执行
    vehicleAdd.eventFun.getUrlData();
    vehicleAdd.eventFun.verify();
    vehicleAdd.defaultEvent();
    vehicleAdd.formSub();
    $.enlargeImg()
});