layui.use(['common','form', 'layer', 'dict', 'permission'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var form = layui.form;
    var vehicleAdd = {
        photo:'',
        dataObj:{
            'id':'',
            'type':'new',
            'readonly':''
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
                $.postApi('/management/v1/cartype/saveCarType',{
                    "carTypeId": data.carTypeId,
                    "description": data.description,
                    "enName": data.enName,
                    "img": vehicleAdd.photo,
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
            updateData:function(data)
            {
                var _this = this;
                $.postApi('/management/v1/cartype/saveCarType',{
                    "id":vehicleAdd.dataObj.id,
                    "carTypeId": data.carTypeId,
                    "description": data.description,
                    "enName": data.enName,
                    "img": vehicleAdd.photo,
                    "name": data.name,
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
                var _this = this;
                $.getApi('/management/v1/cartype/query',{
                    "id": vehicleAdd.dataObj.id,
                },function(res)
                {
                    if(res.code == 0)
                    {
                        $('#carTypeId').val(res.content.carTypeId);
                        $('#name').val(res.content.name);
                        $('#enName').val(res.content.enName);
                        $('#description').val(res.content.description);
                        vehicleAdd.photo = res.content.img;
                        if(res.content.status == '0')
                        {
                            $('#status').removeAttr('checked');
                            form.render();
                        }
                        if(vehicleAdd.dataObj.readonly === 'readonly')
                        {
                            $.readOnly(['checkbox']);
                            $('#jsfilecon').empty();
                            $('#description').attr('readonly',true);
                        }
                        $('#jsphotoshow').empty();
                        $('#jsphotoshow').append('<img src="'+res.content.img+'" class="enlarge"/>');
                    }
                });
            },
            getBrands:function()
            {

            },
            getUrlData:function()
            {
                var urlData = $.getUrlData();
                if(urlData)
                {
                    vehicleAdd.dataObj.id = urlData.id;
                    vehicleAdd.dataObj.readonly = urlData.readonly;
                    vehicleAdd.dataObj.type = 'update';
                    this.getData();
                }
            },
            verify:function()
            {
                form.verify({
                    number:function(value,item){
                        if(!/^\d+$/g.test(value))
                        {
                            return '请输入数字类型';
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
            this.eventFun.getBrands();
            $('#photo').uploadFun('cartype-public',function(status,key)
            {
                if(status =='success')
                {
                    vehicleAdd.photo = key[0];
                    $('#jsphotoshow').empty();
                    $('#jsphotoshow').append('<img src="'+key[0]+'" class="enlarge"/>');
                }
            });
        }
    };
    //需要优先执行
    vehicleAdd.eventFun.getUrlData();
    vehicleAdd.eventFun.verify()
    vehicleAdd.defaultEvent();
    vehicleAdd.formSub();
    $.enlargeImg()
});