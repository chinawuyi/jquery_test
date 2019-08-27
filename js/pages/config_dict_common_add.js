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
            addLayer:function(action,options)
            {
                if(options)
                {
                    action = $.addUrlPro(action,options);
                }
                layer.open({
                    type: 2,
                    title:'所属分类',
                    content: action,
                    area: ['700px', $(window).height()-40+'px'],
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
                $.postApi('/management/v1/dictcommon/createDictCommon',{
                    "code": data.code,
                    "name": data.name,
                    "description": data.description,
                    "isLeaf": data.isLeaf?data.isLeaf:'0',
                    "parentCode": data.parentCode,
                    "categoryId":data.categoryId,
                    "value":data.value
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
                $.postApi('/management/v1/dictcommon/updateDictCommon',{
                    "dictCommonId":vehicleAdd.dataObj.id,
                    "code": data.code,
                    "name": data.name,
                    "description": data.description,
                    "isLeaf": data.isLeaf?data.isLeaf:'0',
                    "parentCode": data.parentCode,
                    "categoryId":data.categoryId,
                    "value":data.value
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
                $.getApi('/management/v1/dictcommon/query',{
                    "id": vehicleAdd.dataObj.id,
                },function(res)
                {
                    if(res.code == 0)
                    {
                        $('#description').val(res.content.description);
                        $('#code').val(res.content.code);
                        $('#name').val(res.content.name);
                        $('#categoryId').val(res.content.categoryId);
                        $('#value').val(res.content.value);
                        if(vehicleAdd.dataObj.readonly === 'readonly')
                        {
                            $.readOnly(['checkbox']);

                        }
                        if(res.content.isLeaf == '0')
                        {
                            $('#isLeaf').removeAttr('checked');
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
                    this.getData();
                }
            }, // 校验规则
            verify:function()
            {
                form.verify({
                    nameRule: function(value, item){ 
                        if(/[^\da-zA-Z\u4e00-\u9fa5]+/g.test(value)){
                            return '数据字典名称不能包含特殊字符';
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
                    $('#jsphotoshow').append('<img src="'+key[0]+'" />');
                }
            });

            //添加所属分类
            $('#categoryId').click(function(){
                vehicleAdd.eventFun.addLayer('./dict_category_choose.html',{
                    'city':$('#city').val(),
                });
            });
        }
    };
    //需要优先执行
    vehicleAdd.eventFun.getUrlData();
    vehicleAdd.defaultEvent();
    vehicleAdd.formSub();
    vehicleAdd.eventFun.verify();
});