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
            'id':'',
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
                console.log(data)
                var cronStr = encodeURI(data.cronExpression);
                var _this = this;
                $.postApi('/management/v1/cron/create',{
                    "jobClassName": data.jobClassName,
                    "jobTriggerUrl": data.jobTriggerUrl,
                    "cronExpression": cronStr,
                    "description": data.description
                },function(res)
                {
                    console.log(res)
                    if(res.code == 0)
                    {
                        layer.msg(res.message);
                        window.setTimeout(function(){
                            _this.closeLayer();
                            parent.window.$('#searchBt').click(function(){
                                _this.searchEvent();
                            });
                        },1000);
                    }
                });
            },
            updateData:function(data)
            {
                console.log(data)
                var cronStr = encodeURI(data.cronExpression)
                var _this = this;
                $.postApi('/management/v1/cron/update',{
                    "id": vehicleAdd.dataObj.id,
                    "jobClassName": data.jobClassName,
                    "jobTriggerUrl": data.jobTriggerUrl,
                    "cronExpression": cronStr,
                    "description": data.description
                },function(res)
                {
                    console.log(res)
                    if(res.code == 0)
                    {
                        layer.msg(res.message);
                        window.setTimeout(function(){
                            _this.closeLayer();
                            parent.window.$('#searchBt').click(function(){
                                _this.searchEvent();
                            });
                        },1000);
                    }
                });
            },
            getData:function()
            {
                $.getApi('/management/'+$.BC.V+'/attribute/query',{
                    "id": vehicleAdd.dataObj.jobId,
                },function(res)
                {
                    console.log(res)
                    if(res.code == 0)
                    {
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
            getUrlData:function()
            {
                var urlData = $.getUrlData();
                console.log(urlData)
                if(urlData)
                {
                    // console.log(urlData)
                    vehicleAdd.dataObj.id = urlData.id;
                    $('#jobClassName').val(urlData.jobClassName);
                    $('#jobTriggerUrl').val(urlData.jobTriggerUrl);
                    // $('#cronExpression').val(decodeURI(urlData.cronExpression));
                    $('#cronExpression').val(urlData.cronExpression);
                    $('#description').val(urlData.description);
                    // vehicleAdd.dataObj.jobClassName = urlData.jobClassName;
                    // vehicleAdd.dataObj.jobTriggerUrl = urlData.jobTriggerUrl;
                    // vehicleAdd.dataObj.cronExpression = urlData.cronExpression;
                    // vehicleAdd.dataObj.description = urlData.description;
                    vehicleAdd.dataObj.type = 'update';
                    // this.getData();
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
        }
    };
    //需要优先执行
    vehicleAdd.eventFun.getUrlData();
    vehicleAdd.eventFun.verify();
    vehicleAdd.defaultEvent();
    vehicleAdd.formSub();
});