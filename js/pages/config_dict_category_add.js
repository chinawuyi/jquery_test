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
                $.postApi('/management/'+$.BC.V+'/dictcategory/createDictCategory',{
                    "canModify": data.canModify?data.canModify:'0',
                    "code": data.code,
                    "description": data.description,
                    "isLeaf": data.isLeaf?data.isLeaf:'0',
                    "isMultiLevel": data.isMultiLevel?data.isMultiLevel:'0',
                    "name": data.name,
                    "parentCode": data.parentCode
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
                $.postApi('/management/'+$.BC.V+'/dictcategory/updateDictCategory',{
                    "canModify": data.canModify?data.canModify:'0',
                    "code": data.code,
                    "description": data.description,
                    "dictCategoryId": vehicleAdd.dataObj.id,
                    "isLeaf": data.isLeaf?data.isLeaf:'0',
                    "isMultiLevel": data.isMultiLevel?data.isMultiLevel:'0',
                    "name": data.name,
                    "parentCode": data.parentCode
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
                $.getApi('/management/'+$.BC.V+'/dictcategory/query',{
                    "id": vehicleAdd.dataObj.id,
                },function(res)
                {
                    if(res.code == 0)
                    {
                        console.log(res.content);
                        $('#description').val(res.content.description);
                        $('#code').val(res.content.code);
                        $('#name').val(res.content.name);
                        if(vehicleAdd.dataObj.readonly === 'readonly')
                        {
                            $.readOnly(['checkbox']);
                            $.eleDisabled(['#isLeaf','#isMultiLevel','#canModify','#description'])
                        }
                        if(res.content.isLeaf == '0')
                        {
                            $('#isLeaf').removeAttr('checked');
                        }
                        if(res.content.canModify == '0')
                        {
                            $('#canModify').removeAttr('checked');
                        }
                        if(res.content.isMultiLevel == '0')
                        {
                            $('#isMultiLevel').removeAttr('checked');
                        }
                        form.render();
                    }
                });
            },
            getBrands:function()
            {

            },
            getUrlData()
            {
                var urlData = $.getUrlData();
                if(urlData)
                {
                    vehicleAdd.dataObj.id = urlData.id;
                    vehicleAdd.dataObj.readonly = urlData.readonly;
                    vehicleAdd.dataObj.type = 'update';
                    this.getData();
                }else{
                    // $.eleDisabled('#isLeaf,#isMultiLevel,#canModify,#isMultiLevel,description')
                }
            },
            // 校验规则
            verify:function()
            {
                form.verify({
                    categoryNameRule: function(value, item){ 
                        if(/[^\da-zA-Z\u4e00-\u9fa5]+/g.test(value)){
                            return '分类名称不能包含特殊字符';
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