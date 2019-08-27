layui.use(['common','form', 'layer','laydate', 'dict', 'permission'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var form = layui.form;
    var laydate = layui.laydate;
    var marketingAdd = {
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
                $.postApi('/management/v1/appadconfig/createAppAdConfig',{
                    "city": data.city,
                    "endTime": new Date(data.endTime).getTime()/1000,
                    "imgUrl": marketingAdd.photo[0],
                    "linkUrl": data.linkUrl,
                    "module": data.module,
                    "platform": data.platform,
                    'sort':data.sort,
                    "startTime": new Date(data.startTime).getTime()/1000,
                    "title": data.title
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
                $.postApi('/management/v1/appadconfig/updateAppAdConfig',{
                    "appAdConfigId":marketingAdd.dataObj.id,
                    "city": data.city,
                    "endTime": new Date(data.endTime).getTime()/1000,
                    "imgUrl": marketingAdd.photo[0],
                    "linkUrl": data.linkUrl,
                    "module": data.module,
                    "platform": data.platform,
                    'sort':data.sort,
                    "startTime": new Date(data.startTime).getTime()/1000,
                    "title": data.title
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
                $.getApi('/management/v1/appadconfig/query',{
                    "id": marketingAdd.dataObj.id,
                },function(res)
                {
                    if(res.code == 0)
                    {
                        $('#title').val(res.content.title);
                        $('#city').val(res.content.city);
                        $('#startTime').val(res.content.startTime?new Date(res.content.startTime*1000).Format('yyyy-MM-dd'):'');
                        $('#endTime').val(res.content.endTime?new Date(res.content.endTime*1000).Format('yyyy-MM-dd'):'');
                        $('#platform').val(res.content.platform);
                        $('#module').val(res.content.module);
                        $('#sort').val(res.content.sort);
                        $('#linkUrl').val(res.content.linkUrl);
                        if(res.content.imgUrl){
                            $.getFileUrl('advertising',res.content.imgUrl,function(status,option){
                                if(status == 'success')
                                {
                                    $('#jsphotoshow').empty();
                                    $('#jsphotoshow').append('<img src="'+option+'"  class="enlarge"/>');
                                }
                            });
                        }
                        
                        if(marketingAdd.dataObj.readonly === 'readonly')
                        {
                            $('input,textarea').addClass('layui-disabled').attr('readonly','readonly');
                            $('select,.real_file_btn').addClass('layui-disabled').attr('disabled','disabled');
                            $('#jsSub').css('display','none');
                            $('.my_file_btn').addClass('layui-btn-disabled')
                        }
                        form.render('select');
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
                    marketingAdd.dataObj.id = urlData.id;
                    marketingAdd.dataObj.readonly = urlData.readonly;
                    marketingAdd.dataObj.type = 'update';
                    
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
        getSelectData:function(){
            var _this=this
            /*业务城市*/
            $.postApi('/management/v1/businesscity/list',{
                
            },function(res)
            {
                if(res.code == 0)
                {
                    $.appendSelect('city',res.content.data,'code','name',$('#city').val());
                    form.render('select');
                }
            });
            /*平台类型*/
            $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                "categoryCode": "PLATFORM_TYPE"
            },function(res)
            {
                if(res.code == 0)
                {
                    $.appendSelect('platform',res.content,'value','name',$('#platform').val());
                    form.render('select');
                }
            });
            /*广告模块位置*/
            $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                "categoryCode": "AD_MODULE_LOCATION"
            },function(res)
            {
                if(res.code == 0)
                {
                    $.appendSelect('module',res.content,'value','name',$('#module').val());
                    /*查询广告信息*/
                    if(marketingAdd.dataObj.id){
                        marketingAdd.eventFun.getData();
                    }
                    form.render('select');
                }
            });
        },
        defaultEvent:function()
        {
            var _this = this;
            $('#jsBrandBack').click(function(){
                _this.eventFun.closeLayer();
            });
            if(marketingAdd.dataObj.readonly != 'readonly'){
                laydate.render({
                    elem: '#startTime', //指定元素
                    trigger: 'click'
                });
                laydate.render({
                    elem: '#endTime', //指定元素
                    trigger: 'click',
                });
            }
            
            $('#uploadImg').uploadFun('advertising',function(status,key){
                if(status =='success')
                {
                    $.getFileUrl('advertising',key,function(status,option){
                        if(status == 'success')
                        {
                            _this.photo = key;
                            $('#jsphotoshow').empty();
                            $('#jsphotoshow').append('<img src="'+option+'" class="enlarge"/>');
                        }
                    });
                }
            });
        }
    };
    //需要优先执行
    marketingAdd.eventFun.getUrlData();
    marketingAdd.defaultEvent();
    marketingAdd.formSub();
    marketingAdd.getSelectData();
    $.enlargeImg()
});