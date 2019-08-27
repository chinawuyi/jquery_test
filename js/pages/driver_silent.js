layui.use(['common','form', 'layer', 'dict', 'permission','form','laydate'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var form = layui.form;
    var laydate=layui.laydate;
    var driverInfo = {
        dataObj:{
            'id':'',
            'type':'new',
            'readonly':'',
            'carId':''
        },
        eventFun:{
            closeLayer:function()
            {
                var index = parent.layer.getFrameIndex(window.name);
                parent.layer.close(index);
            },
            getUrlData:function()
            {
                var urlData = $.getUrlData();
                if(urlData)
                {
                    driverInfo.dataObj.id = urlData.id;
                    $('#name').val(decodeURI(urlData.name));
                    $('#phone').val(urlData.phone);
                    //查询车辆信息
                    if(urlData.carId&&urlData.carId!=0){
                        driverInfo.eventFun.getData()
                    }
                    
                    /**判断操作显示不同字段 */
                    if(urlData.status=='1'){//解除操作
                        $('input').addClass('layui-disabled').attr('readonly','readonly');
                        $('select').addClass('layui-disabled').attr('disabled','disabled');
                        
                        $('#disablesReason').val(urlData.disablesReason)
                        form.render('select');

                        if(urlData.readonly=='2'){//解除静默
                            $('#currentTime').val(new Date().Format('yyyy-MM-dd hh:mm:ss')+'  (当前时间)');
                            $('.currentTime').show();
                            $('#disablesDateStart').val(new Date(urlData.disablesDateStart*1000).Format('yyyy/MM/dd hh:mm:ss'))
                            $('#disablesDateEnd').val(new Date(urlData.disablesDateEnd*1000).Format('yyyy/MM/dd hh:mm:ss'))
                        }else if(urlData.readonly=='-1'){//解除冻结
                            $('.disablesDate').remove();
                            $('.currentTime').show().children('.label-title').text('解除冻结时间：')
                            $('#currentTime').val(new Date(urlData.disablesDateStart*1000).Format('yyyy/MM/dd hh:mm:ss'))
                        }
                    }else if(urlData.status=='-1'){//冻结
                        $('.disablesDate').remove();
                    }
                }
            },
            getSelectData:function(){
                $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                    "categoryCode": "SILENCE_REASONS"
                },function(res)
                {
                    if(res.code == 0)
                    {
                        $.appendSelect('disablesReason',res.content,'value','name');
                        driverInfo.eventFun.getUrlData();
                        form.render('select');
                    }
                });
            },
            getData:function(){
                $.getApi('/management/v1/vehicle/query',{
                    "carId": $.getUrlData().carId
                },function(res)
                {
                    if(res.code == 0)
                    {
                        $('#carNumber').val(res.content.carNumber)
                    }
                });
            }
        },
        setDriverStatu:function(data){

            $.postApi('/management/v1/driver/updateStatus',{
                "disablesDateEnd": data.disablesDateEnd?new Date(data.disablesDateEnd).getTime()/1000:parseInt(Date.now()/1000),
                "disablesDateStart": data.disablesDateStart?new Date(data.disablesDateStart).getTime()/1000:parseInt(Date.now()/1000),
                "disablesReason": data.disablesReason,
                "disablesReasonDes": $('#disablesReason option:selected').text(),
                "driverId": driverInfo.dataObj.id,
                "operator": sessionStorage.getItem('operator'),
                "remark":data.remark,
                "status": $.getUrlData().status
            },function(res)
            {
                if(res.code == 0)
                {
                    
                    layer.msg('司机状态变更成功');
                    parent.window.$('#searchBt').click();
                    window.setTimeout(function(){
                        var index = parent.layer.getFrameIndex(window.name);
                        parent.layer.close(index);
                        
                    },1000);
                }
            });
        },
        formSub:function(){
            var _this=this
            form.on('submit(*)', function(data){
                _this.setDriverStatu(data.field)
            });
        },
        /*默认方法*/
        defaultEvent:function()
        {
            var _this = this;
            
            $('#jsBrandBack').click(function(){
                _this.eventFun.closeLayer();
            });
            if($.getUrlData().status!='1'){
                laydate.render({
                    elem: '#disablesDateStart',
                    type: 'datetime',
                    trigger: 'click',
                    min:new Date(Date.now()).Format('yyyy/MM/dd')
                });
                laydate.render({
                    elem: '#disablesDateEnd',
                    type: 'datetime',
                    trigger: 'click',
                    min:new Date(Date.now()).Format('yyyy/MM/dd')
                });
            }
        }
    };
    //需要优先执行
    
    driverInfo.defaultEvent();
    driverInfo.eventFun.getSelectData()
    driverInfo.formSub();
});
