layui.use(['common','form', 'layer', 'dict', 'permission'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var form = layui.form;
    var vehicleAdd = {
        dataObj:{
            'carModelId':'',
            'type':'new',
            'readonly':''
        },
        brandTree:[],
        modelList:[],
        eventFun:{
            closeLayer:function()
            {
                var index = parent.layer.getFrameIndex(window.name);
                parent.layer.close(index);
            },
            subData:function(data)
            {
                var _this = this;
                $.postApi('/management/v1/model/create',{
                    "carBrandId": data.carBrandId,
                    // "carTypeId": data.carTypeId,
                    // "city": data.city,
                    "enName": data.enName,
                    "name": data.name
                },
                function(res)
                {
                    if(res.code == 0)
                    {
                        layer.msg(res.message);
                        window.setTimeout(function(){
                            _this.closeLayer();
                            parent.window.$('#searchBt').click();
                        },1000);

                    }
                });
            },
            updateData:function(data)
            {
                var _this = this;
                $.postApi('/management/v1/model/updateModel',{
                    "carBrandId": data.carBrandId,
                    "carModelId": vehicleAdd.dataObj.carModelId,
                    // "carTypeId": data.carTypeId,
                    // "city": data.city,
                    "enName": data.enName,
                    "name": data.name
                },function(res)
                {
                    if(res.code == 0)
                    {
                        layer.msg(res.message);
                        window.setTimeout(function(){
                            _this.closeLayer();
                            parent.window.$('#searchBt').click();
                        },1000);

                    }
                });
            },
            getData:function()
            {
                $.getApi('/management/v1/model/query',{
                    "carModelId": vehicleAdd.dataObj.carModelId,
                },
                function(res)
                {
                    if(res.code == 0)
                    {
                         //获取品牌，车系联动JSON接口
                        vehicleAdd.eventFun.getBrandsTree(res.content);
                        // vehicleAdd.eventFun.getBrands(res.content);
                        // vehicleAdd.eventFun.getTypes(res.content);
                        vehicleAdd.eventFun.getCitys(res.content);
                        $('#name').val(res.content.name);
                        $('#enName').val(res.content.enName);
                        $('#city').val(res.content.city);
                        $('#carBrandId').val(res.content.carBrandId);
                        $('#carModelId').val(res.content.carModelId);
                        if(vehicleAdd.dataObj.readonly === 'readonly')
                        {
                            $.readOnly();
                            $.replaceSelect([
                                {
                                    'id':'carBrandId',
                                    'value':res.content.carBrand
                                },
                                {
                                    'id':'carModelId',
                                    'value':res.content.name
                                },
                                {
                                    'id':'carAttributeId',
                                    'value':res.content.carAttribute
                                }
                            ]);
                        }
                        
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
            getBrands:function(data)
            {
                //POST /management/v1/brand/list
                $.postApi('/management/v1/brand/list',{
                   // "carBrandId": vehicleAdd.dataObj.carBrandId,
                },function(res)
                {
                    if(res.code == 0)
                    {
                        if(vehicleAdd.dataObj.readonly === 'readonly')
                        {
                            $.appendSelect('status',res.content.data,'carBrandId','name',data?data.carBrandId:null);
                            form.render('select');
                            $.replaceSelectByVal([
                                {
                                    'id':'status',
                                    'value':data.carBrandId
                                }
                            ]);
                        }
                        else
                        {
                            $.appendSelect('status',res.content.data,'carBrandId','name',data?data.carBrandId:null);
                            form.render('select');
                        }

                    }
                });
            },
            getTypes:function(data)
            {
                $.postApi('/management/v1/cartype/list',{
                    // "carBrandId": vehicleAdd.dataObj.carBrandId,
                },
                function(res)
                {
                    if(res.code == 0)
                    {
                        if(vehicleAdd.dataObj.readonly === 'readonly')
                        {
                            //$.readOnly();
                            $.appendSelect('status2',res.content.data,'carTypeId','name',data?data.carTypeId:null);
                            form.render('select');
                            $.replaceSelectByVal([
                                {
                                    'id':'status2',
                                    'value':data.carTypeId
                                }
                            ]);

                        }
                        else
                        {
                            $.appendSelect('status2',res.content.data,'carTypeId','name',data?data.carTypeId:null);
                            form.render('select');
                        }

                    }
                });
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
            getUrlData:function()
            {
                var urlData = $.getUrlData();
                if(urlData)
                {
                    vehicleAdd.dataObj.carModelId = urlData.carModelId;
                    vehicleAdd.dataObj.readonly = urlData.readonly;
                    vehicleAdd.dataObj.type = 'update';
                    this.getData();
                }
                else
                {
                    //获取品牌，车系联动JSON接口
                    vehicleAdd.eventFun.getBrandsTree();
                    // vehicleAdd.eventFun.getBrands();
                    // vehicleAdd.eventFun.getTypes();
                    vehicleAdd.eventFun.getCitys();
                }
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
                city:function(value)
                {
                    if(value == '')
                    {
                        return '请选择城市';
                    }
                },
                name:function(value)
                {
                    if(value.length >64)
                    {
                        return '不能超过64个字符';
                    }
                },
                enNameRule:function(value)
                {
                    if(!/^[a-zA-Z]+$/.test(value) && value)
                    {
                        return '车系名称(EN)请输入英文字母';
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
            //上传图片
            $('#photo').uploadFun('carbrand',function(status,key)
            {
                if(status =='success')
                {
                    $.getFileUrl('carbrand',key,function(status,option){
                        if(status == 'success')
                        {
                            _this.photo = key[0];
                            $('#jsphotoshow').empty();
                            $('#jsphotoshow').append('<img src="'+option+'" class="enlarge"/>');
                        }
                    });
                }
            });
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
        }
    };
    //需要优先执行
    vehicleAdd.eventFun.getUrlData();
    vehicleAdd.defaultEvent();
    vehicleAdd.verify();
    vehicleAdd.formSub();
    $.enlargeImg()
});