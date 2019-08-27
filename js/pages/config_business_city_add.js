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
                console.log(data);
                var _this = this;
                $.postApi('/management/'+$.BC.V+'/businesscity/createBusinessCity',{
                    "code": data.code,
                    "type":2,
                    "name": data.name,
                    "pinyin": data.pinyin
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
                $.postApi('/management/'+$.BC.V+'/businesscity/updateBusinessCity',{
                    "cityId": vehicleAdd.dataObj.id,
                    "type":2,
                    "code": data.code,
                    "name": data.name,
                    "pinyin": data.pinyin
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
                $.getApi('/management/'+$.BC.V+'/businesscity/query',{
                    "id": vehicleAdd.dataObj.id,
                },function(res)
                {
                    if(res.code == 0)
                    {
                        $('#pinyin').val(res.content.pinyin);
                        $('#code').val(res.content.code);
                        $('#name').val(res.content.name);
                        if(vehicleAdd.dataObj.readonly === 'readonly')
                        {
                            $.readOnly();
                            $('#jsfilecon').empty();

                        }
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
                    vehicleAdd.eventFun.getData();
                }
            }, //校验
            verify:function()
            {
                form.verify({
                    cityNameRule: function(value, item){ 
                        if(!/^[\u4e00-\u9fa5]{1,15}$/g.test(value)){
                            return '城市名称只能为汉字,且最长为15个汉字';
                        }
                    },
                    cityCodeRule:function(value, item){ 
                        if(!/^\d{6}$/g.test(value)){
                            return '城市编码只能为6位数字';
                        }
                    },
                    cityPyRule:function(value, item){ 
                        if(!/^[a-zA-Z]+$/g.test(value)){
                            return '拼音简写只能为字母';
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

        }
    };
    //需要优先执行
    vehicleAdd.eventFun.getUrlData();
    vehicleAdd.defaultEvent();
    vehicleAdd.formSub();
    vehicleAdd.eventFun.verify();
});