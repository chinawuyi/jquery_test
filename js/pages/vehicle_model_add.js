layui.use(['common','form', 'layer', 'dict', 'permission'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var form = layui.form;
    var vehicleAdd = {
        dataObj:{
            'carBrandId':'',
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
                $.postApi('/management/v1/model/create',{
                    "carBrandId": data.carBrandId,
                    "carTypeId": data.carTypeId,
                    "city": data.city,
                    "enName": data.enName,
                    "name": data.name,
                    "personNumber": data.personNumber
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
                $.postApi('/management/v1/brand/updateModel',{
                    "carBrandId":vehicleAdd.dataObj.carBrandId,
                    "enName": data.enName,
                    "name": data.name,
                    "photo": ""
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
                $.getApi('/management/v1/brand/query',{
                    "carBrandId": vehicleAdd.dataObj.carBrandId,
                },function(res)
                {
                    if(res.code == 0)
                    {
                        $('#name').val(res.content.name);
                        $('#enName').val(res.content.enName);

                    }
                });
            },
            getBrands:function()
            {
                //POST /management/v1/brand/list
                $.postApi('/management/v1/brand/list',{
                    // "carBrandId": vehicleAdd.dataObj.carBrandId,
                },function(res)
                {
                    if(res.code == 0)
                    {
                        $.appendSelect('status',res.content.data,'carBrandId','name');
                        form.render('select');
                    }
                });
            },
            getTypes:function()
            {
                $.postApi('/management/v1/cartype/list',{
                    // "carBrandId": vehicleAdd.dataObj.carBrandId,
                },function(res)
                {
                    console.log(res);
                    if(res.code == 0)
                    {
                        $.appendSelect('status2',res.content.data,'carTypeId','name');
                        form.render('select');
                    }
                });
            },
            getUrlData:function()
            {
                var urlData = $.getUrlData();
                if(urlData)
                {
                    vehicleAdd.dataObj.carBrandId = urlData.carBrandId;
                    vehicleAdd.dataObj.type = 'update';
                    this.getData();
                }
            }
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
                }
            });
        },
        defaultEvent:function()
        {
            var _this = this;
            $('#jsBrandBack').click(function(){
                _this.eventFun.closeLayer();
            });
            this.eventFun.getBrands();
            this.eventFun.getTypes();
        }
    };
    //需要优先执行
    vehicleAdd.eventFun.getUrlData();
    vehicleAdd.defaultEvent();
    vehicleAdd.verify();
    vehicleAdd.formSub();
});