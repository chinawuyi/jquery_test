layui.use(['common','form', 'layer', 'dict', 'permission'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var form = layui.form;
    var vehicleBrandAdd = {
        photo:'',
        dataObj:{
            'carBrandId':'',
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
                $.postApi('/management/v1/brand/create',{
                    "enName": data.enName,
                    "name": data.name,
                    "photo": vehicleBrandAdd.photo
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
                $.postApi('/management/v1/brand/updateModel',{
                    "carBrandId":vehicleBrandAdd.dataObj.carBrandId,
                    "enName": data.enName,
                    "name": data.name,
                    // "status":data.status==1?-1:1,
                    "photo": vehicleBrandAdd.photo
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
                $.getApi('/management/v1/brand/query',{
                    "carBrandId": vehicleBrandAdd.dataObj.carBrandId,
                },function(res)
                {
                    if(res.code == 0)
                    {
                        $('#name').val(res.content.name);
                        $('#enName').val(res.content.enName);
                        vehicleBrandAdd.photo = res.content.photo;
                        if(res.content.status != '1')
                        {
                            $('#status').removeAttr('checked');
                        }
                        form.render();
                        if(vehicleBrandAdd.dataObj.readonly === 'readonly')
                        {
                            $.readOnly(['checkbox']);
                            $('#jsfilecon').empty();
                            $.eleDisabled(['#status']);
                        }
                        if(res.content.photo){
                             $.getFileUrl('carbrand',res.content.photo.split(','),function(status,option){
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
            getUrlData:function()
            {
                var urlData = $.getUrlData();
                if(urlData)
                {
                    vehicleBrandAdd.dataObj.carBrandId = urlData.carBrandId;
                    vehicleBrandAdd.dataObj.readonly = urlData.readonly;
                    vehicleBrandAdd.dataObj.type = 'update';

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
        defaultEvent:function()
        {
            var _this = this;
            $('#jsBrandBack').click(function(){
                _this.eventFun.closeLayer();
            });

            $('#photo').uploadFun('carbrand',function(status,key)
            {
                if(status =='success')
                {
                    $.getFileUrl('carbrand',key,function(status,option){
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
    vehicleBrandAdd.eventFun.getUrlData();
    vehicleBrandAdd.defaultEvent();
    vehicleBrandAdd.formSub();
    $.enlargeImg()
});