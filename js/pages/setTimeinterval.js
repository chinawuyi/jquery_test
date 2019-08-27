layui.use(['common','form', 'layer','laydate', 'dict', 'permission'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var form = layui.form;
    var laydate = layui.laydate;
    var setTimeinterval = {
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
            clearData:function(cityCode){
                var _this = this;
                $.postApi('/management/v1/charge/cache/segment/clear',{
                    "cityCode": cityCode,
                },function(res)
                {
                    if(res.code == 0)
                    {
                        window.setTimeout(function(){
                            _this.closeLayer();
                            parent.window.$('#searchBt').click();
                        },1000);
                    }
                })
            },
            subData:function(data)
            {
                var _this = this;
                $.postApi('/management/v1/timeinterval/'+(setTimeinterval.dataObj.id?'update':'add'),{
                    "cityCode": data.cityCode,
                    "cityName": $('#cityCode option:selected').text(),
                    "hourEndTime": Number(data.endTime.split(':')[0]),
                    "hourStartTime": Number(data.startTime.split(':')[0]),
                    "minuteEndTime": Number(data.endTime.split(':')[1]),
                    "minuteStartTime": Number(data.startTime.split(':')[1]),
                    "timeIntervalName": data.timeIntervalName,
                    "timeIntervalType": data.timeIntervalType,
                    "id":setTimeinterval.dataObj.id||0,
                    "sort":data.sort
                },function(res)
                {
                    if(res.code == 0)
                    {
                        layer.msg(res.message);
                        _this.clearData(data.cityCode);//刷时段缓存
                        

                    }
                });
            },
            getUrlData:function()
            {
                var urlData = $.getUrlData();
                if(urlData)
                {
                    setTimeinterval.dataObj.id = urlData.id;
                    setTimeinterval.dataObj.readonly = urlData.readonly;
                    setTimeinterval.dataObj.type = 'update';
                    
                    if(setTimeinterval.dataObj.readonly === 'readonly')
                        {
                            $('input,textarea').addClass('layui-disabled').attr('readonly','readonly');
                            $('select').addClass('layui-disabled').attr('disabled','disabled');
                            $('#jsSub').css('display','none');
                        }
                    
                }
            }
        },
        /*提交表单*/
        formSub:function()
        {
            var _this = this;
            form.on('submit(timeintervalData)', function(data){
                _this.eventFun.subData(data.field);
                return false;
            });

        },
        timeFormat:function(_data){
            if(_data<10&&_data!=-1){
                return "0"+_data
            }else{
                return _data
            }
        },
        setFormData:function(){
            var _this=this
            var timeintervalData=parent.window.timeintervalData
            form.val('timeintervalData',{
                'sort':timeintervalData.sort,
                'timeIntervalName':timeintervalData.timeIntervalName,
                'cityCode':timeintervalData.cityCode,
                'timeIntervalType':timeintervalData.timeIntervalType,
                'startTime':_this.timeFormat(timeintervalData.hourStartTime)+':'+_this.timeFormat(timeintervalData.minuteStartTime),
                'endTime':_this.timeFormat(timeintervalData.hourEndTime)+':'+_this.timeFormat(timeintervalData.minuteEndTime)
            })
            form.render()
        },
        /*获取下拉菜单数据*/
        getSelectData:function(){
            var _this=this
            /*业务城市*/
            $.postApi('/management/v1/businesscity/cityList',{
                'type':'2'
            },function(res)
            {
                if(res.code == 0)
                {
                    $.appendSelect('cityCode',res.content,'code','name');
                    if(setTimeinterval.dataObj.id){
                        setTimeinterval.setFormData()
                    }
                    form.render('select');
                }
            });
        },
        /*默认方法*/
        defaultEvent:function()
        {
            var _this = this;
            
            $('#jsBrandBack').click(function(){
                _this.eventFun.closeLayer();
            });
            if($.getUrlData().readonly != 'readonly'){
                /*签约时间*/
                laydate.render({
                    trigger: 'click',
                    elem: '#endTime',
                    type: 'time',
                    format: 'HH:mm'
                });
                /*到期时间*/
                laydate.render({
                    trigger: 'click',
                    elem: '#startTime',
                    type: 'time',
                    format: 'HH:mm'
                });
            }
            
            
        }
    };
    //需要优先执行
    setTimeinterval.eventFun.getUrlData();
    setTimeinterval.defaultEvent();
    setTimeinterval.formSub();
    setTimeinterval.getSelectData();
    
});