layui.use(['common','form', 'layer','laydate', 'dict', 'permission'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var form = layui.form;
    var laydate = layui.laydate;
    var driverCount = {
        photo:'',
        dataObj:{
            'id':'',
            'type':'new',
            'readonly':'',
            'carId':''
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
                    title:'司机管理',
                    content: action,
                    area: ['700px', '400px'],
                    maxmin: true
                });
            },
            closeLayer:function()
            {
                var index = parent.layer.getFrameIndex(window.name);
                parent.layer.close(index);
            },
            /*创建司机*/
            subData:function(data,val)
            {
                var _this = this;
                $.postApi('/management/v1/driver/count/create',{
                    driverId:driverCount.dataObj.id,
                    complainedCount:data.complainedCount,//乘客被投诉次数
                    cycle:new Date(data.cycle).getTime()/1000,//统计周期
                    operator:sessionStorage.getItem('operator'),
                    orderCount:data.orderCount,//完成订单次数
                    trafficAccidentCount:data.trafficAccidentCount,//交通事故次数
                    trafficViolationCount:data.trafficViolationCount,//交通违章次数
                    violateRecord:data.violateRecord//接单违约次数
                },function(res)
                {
                    if(res.code == 0)
                    {
                        parent.window.openMsg(res.message)
                        window.location.reload()
                    }
                });
            },
            /*修改司机信息*/
            updateData:function(data,val)
            {
                var _this = this;
                
                $.postApi('/management/v1/driver/count/update',{
                    driverId:driverCount.dataObj.id,
                    driverCountId:driverCount.dataObj.driverCountId,//出租资格类别
                    complainedCount:data.complainedCount,//乘客被投诉次数
                    cycle:new Date(data.cycle).getTime()/1000,//统计周期
                    operator:sessionStorage.getItem('operator'),
                    orderCount:data.orderCount,//完成订单次数
                    trafficAccidentCount:data.trafficAccidentCount,//交通事故次数
                    trafficViolationCount:data.trafficViolationCount,//交通违章次数
                    violateRecord:data.violateRecord//接单违约次数
                },function(res)
                {
                    if(res.code == 0)
                    {
                        parent.window.openMsg(res.message)

                    }
                });
            },
            /*根据id查询司机*/
            getData:function()
            {
                var _this = this;
                $.getApi('/management/v1/driver/count/info/'+driverCount.dataObj.id,{
                },function(res)
                {
                    if(res.code == 0)
                    {
                        var formData=res.content
                        /*循环表单赋值*/
                        var inputDom=document.getElementsByClassName("form-control")
                        if(formData){
                            for(var i=0;i<inputDom.length;i++){
                                var attr=inputDom[i].getAttribute("name") 
                                if(attr=='cycle'){
                                    inputDom[i].value=formData[attr]?new Date(formData[attr]*1000).Format('yyyy/MM/dd'):''
                                } else{
                                    inputDom[i].value=formData[attr]||""
                                }
                                
                            }
                            driverCount.dataObj.driverCountId=formData.driverCountId
                            driverCount.dataObj.type='update'                            
                        }
                        driverCount.formSub();

                    }
                });
            },
            getUrlData:function()
            {

                driverCount.dataObj.id = $.getUrlData().id;
                driverCount.dataObj.readonly = $.getUrlData().readonly;
                driverCount.eventFun.getData();
                /*判断是预览还是编辑*/
                if(driverCount.dataObj.readonly === 'readonly')
                {
                    $('input,textarea').addClass('layui-disabled').attr('readonly','readonly');
                    $('select,.real_file_btn,input[type="checkbox"]').addClass('layui-disabled').attr('disabled','disabled');
                    $('#jsSub').css('display','none');
                    $('.my_file_btn').addClass('layui-btn-disabled')                   
                }
            },
        },
        /*提交表单*/
        formSub:function()
        {
            var _this = this;
            //获取复选框的值
            
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

        /*默认方法*/
        defaultEvent:function()
        {
            var _this = this;
            
            $('#jsBrandBack').click(function(){
                _this.eventFun.closeLayer();
            });

            if($.getUrlData().readonly != 'readonly'){            
                /*出生年月日*/
                laydate.render({
                    trigger: 'click',
                    elem: '#cycle',
                    format: 'yyyy/MM/dd'
                });
                
            }

        }
    };
    //需要优先执行
    driverCount.eventFun.getUrlData();
    driverCount.defaultEvent();
    
});
