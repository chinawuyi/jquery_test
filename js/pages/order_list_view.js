layui.use(['common','form', 'layer', 'dict', 'permission','element'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var form = layui.form;
    var element=layui.element;
    var orderDetailInfo={};//订单详情
    var orderRefundRecords=[];//退款信息
    var couponCheck={};//优惠券信息
    var loadIndex='';//loading层
    var orderListView = {
        dataObj:{
            'orderId':'',
            'payDoneAmount':'',
            'userId':'',
            'totalMoney':''
        },
        eventFun:{
            editLayer:function(url,options,titleName)
            {
                var action = url;
                if(options)
                {
                    action = $.addUrlPro(action,options);
                }
                layer.open({
                    type: 2,
                    title:titleName,
                    content: action,
                    area: ['600px', ($(window).height()-100)+'px'],
                    maxmin: true
                });
            },
            closeLayer:function()
            {
                var index = parent.layer.getFrameIndex(window.name);
                parent.layer.close(index);
            },
            snapshot:function(){
                $.postApi('/management/v1/charge/snapshot/get',{
                    "orderId": orderListView.dataObj.orderId,
                    "userType": 1
                },function(res)
                {
                    layer.close(loadIndex);
                    if(res.code == 0)
                    { 
                        var chargeResult=res.content.chargeResult;
                        orderListView.dataObj.totalMoney=chargeResult.originTotalAmount
                        $('#timeLength').val(chargeResult.timeLength+'分钟')
                        $('#distance').val(chargeResult.distance+'km')
                        $('#originTotalAmount').val(chargeResult.originTotalAmount+'元')
                    }
                },function(error){
                    console.log(error)
                    layer.close(loadIndex);
                })
            },
            getData:function()
            {
                var _this = this;
                $.getApi('/management/v1/orderinfo/query/'+orderListView.dataObj.orderId,{
                },function(res)
                {
                    if(res.code == 0)
                    {                        
                        orderDetailInfo=res.content.orderInfo;//订单信息
                        orderRefundRecords=res.content.orderRefundRecords[0];//退款信息
                        couponCheck=res.content.couponCheck;//优惠券信息
                        /*如果订单不是取消状态，不显示取消原因*/    
                        if(orderDetailInfo.status!=10){
                            $('input[name="cancelReasonId"],input[name="cancelSource"],input[name="timeCancel"]').hide()
                            $('.cancelOrder').hide()
                        }else{
                            $('input[name="timeEnd"]').hide()
                            $('.timeEnd').hide()
                            $('.cancelOrder').show()
                            $('input[name="timeCancel"]').show()
                        }
                        var inputDom=$('.labelInput')
                        //加载订单基本信息
                        if(orderDetailInfo){
                            $(inputDom).each(function(){
                                var attr=$(this).attr('name')
                                if(attr=='startCity'){
                                    $(this).val(orderDetailInfo['startCityName']+orderDetailInfo.startPosition)
                                }else if(attr=='endCity'){
                                    $(this).val(orderDetailInfo.endCityName+orderDetailInfo.endPosition)
                                }else if(attr=='timeEnd'||attr=='timeCancel'||attr=='timeInit'||attr=='expectStartTime'||attr=='timeRefund'){
                                    var timeDate=orderDetailInfo[attr]?new Date(orderDetailInfo[attr]*1000).Format('yyyy-MM-dd hh:mm:ss'):"";
                                    $(this).val(timeDate);
                                }else{
                                    $(this).val(orderDetailInfo[attr])
                                }
                            })
                        }
                        //加载退款信息
                        if(orderRefundRecords){
                            $('input[name="comment"]').val(orderRefundRecords.comment)
                            $('input[name="operator"]').val(orderRefundRecords.operator)
                        }
                        //加载优惠券信息
                        if(couponCheck){
                            $('input[name="couponId"]').val(couponCheck.couponId);
                            $('input[name="ifcouponId"]').val('是')
                        }else{
                            $('input[name="couponId"]').val('');
                            $('input[name="ifcouponId"]').val('否')  
                        }
                        //根据订单状态显示操作按钮
                        if(orderDetailInfo.status=='9'&&orderDetailInfo.statusRefund=='0'){//支付成功的订单可退款
                            $('#refund').show();
        
                        }else if(Number(orderDetailInfo.status)<6){//可取消订单
                            $('.cancellation').css('display','inline-block')
                            
                        }else if(Number(orderDetailInfo.status)==6){//可强制终止订单
                            $('.finishedOrder').css('display','inline-block')
                        }else if(Number(orderDetailInfo.status)==7&&orderDetailInfo.statusForceEnd==1){//订单为后台终止，需要继续结算费用
                            //查询终止时的结算
                            _this.snapshot()
                            
                            layer.open({
                                type: 1,
                                title: '结算金额确认',
                                content: $('#confirmCharge').html(),
                                area: ['500px', '300px'],
                                maxmin: true
                            })
                            loadIndex=layer.load(2)
                            layer.msg('此订单已结束服务请尽快结算订单！')
                        }
                    
                        form.render('select')
                        /*code转为对应的值*/
                        orderListView.eventFun.getSelectData();
                    }
                });
            },
            getUrlData:function()
            {
                var urlData = $.getUrlData();
                if(urlData)
                {
                    orderListView.dataObj.orderId = urlData.orderId;
                    this.getData();
                }
            },
            setVal:function(data){
                let info={}
                data.forEach(function(ele){
                    info[ele.value]=ele.name
                })
                return info
            },
            getSelectData:function(){
                /*订单状态*/
                $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                    "categoryCode": "ORDER_STATUS"
                },function(res)
                {
                    if(res.code == 0)
                    {
                       var statusList=orderListView.eventFun.setVal(res.content)
                       var statusVal=$('input[name="status"]').val()
                       statusVal?$('input[name="status"]').val(statusList[statusVal]):""
                    }
                });
                /*取消原因*/
                $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                    "categoryCode": "ALL_CANCLE_REASON"
                },function(res)
                {
                    if(res.code == 0)
                    {
                        var reasonList=orderListView.eventFun.setVal(res.content)
                        var reasonVal=$('input[name="cancelReasonId"]').val()
                        reasonVal?$('input[name="cancelReasonId"]').val(reasonList[reasonVal]):""
                    }
                });
                /*取消发起者*/
                $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                    "categoryCode": "ORDER_CANCLE_ORIGINATOR"
                },function(res)
                {
                    if(res.code == 0)
                    {
                        var canclePersonList=orderListView.eventFun.setVal(res.content)
                        var canclePersonVal=$('input[name="cancelSource"]').val()
                        canclePersonVal?$('input[name="cancelSource"]').val(canclePersonList[canclePersonVal]):""
                        $.appendSelect('cancelSource1',res.content,'value','name');
                        $.appendSelect('cancelSource2',res.content,'value','name');
                        form.render('select');
                    }
                });
                /*支付渠道*/
                $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                    "categoryCode": "PAY_CHANNEL"
                },function(res)
                {
                    if(res.code == 0)
                    {
                        var payList=orderListView.eventFun.setVal(res.content)
                        var payleVal=$('input[name="payChannel"]').val()
                        payleVal?$('input[name="payChannel"]').val(payList[payleVal]):""
                    }
                });
                /*下单平台*/
                $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                    "categoryCode": "PLATFORM_TYPE"
                },function(res)
                {
                    if(res.code == 0)
                    {
                        var platformList=orderListView.eventFun.setVal(res.content)
                        var platformVal=$('input[name="platform"]').val()
                        platformVal?$('input[name="platform"]').val(platformList[platformVal]):""
                    }
                });
                /*查询车型*/
                $.getApi('/management/v1/cartype/query',{
                    "id": $('input[name="carTypeId"]').val()
                },function(res)
                {
                    if(res.code == 0)
                    {
                        $('input[name="carTypeId"]').val(res.content.name)
                    }
                });
                /*产品类型*/
                $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                    "categoryCode": "PRODUCT_TYPE"
                },function(res)
                {
                    if(res.code == 0)
                    {
                        var productTypeList=orderListView.eventFun.setVal(res.content)
                        var productTypeVal=$('input[name="productTypeId"]').val()
                        productTypeVal?$('input[name="productTypeId"]').val(productTypeList[productTypeVal]):""
                    }
                });
                
            },
            cancelOrder(data){
                
                $.postApi('/management/v1/orderinfo/cancel',{
                    "cancelSource": data.cancelSource1,
                    "orderId":$.getUrlData().orderId,
                    "otherReason":data.otherReason,
                    "timestamp":parseInt(new Date().getTime()/1000),
                    "userId":orderDetailInfo.userId,
                    "cancelReasonId":4
                },function(res)
                {
                    if(res.code == 0)
                    {
                        layer.msg(res.message);
                        parent.window.$('#searchBt').click();
                        window.setTimeout(function(){
                            location.reload()
                        },1000);
                        
                    }
                });
            },
            getLastPosition(data){
                var _this=this
                $.postApi('/management/v1/lbs/search/'+(orderDetailInfo.status=='6'?'current':'history'),{
                    "orderId":$.getUrlData().orderId,
                    "track":1
                },function(res)
                {
                    if(res.code == 0)
                    {
                        if(res.content.track.length>0){
                            orderListView.eventFun.finishOrder(res.content.track[res.content.track.length-1])
                        }else{
                            orderListView.eventFun.finishOrder({
                                bind_lat:orderDetailInfo.realStartLatitude,
                                bind_lng:orderDetailInfo.realStartLongitude
                            })
                        }
                        
                    }
                });
            },
            finishOrder(data){
                $.postApi('/management/v1/orderinfo/finish',{
                    "latitude": data.bind_lat,
                    "longitude":data.bind_lng,
                    "orderId":$.getUrlData().orderId,
                    "timestamp":parseInt(new Date().getTime()/1000),
                    "driverId":orderDetailInfo.driverId
                },function(res)
                {
                    if(res.code == 0)
                    {
                        
                        layer.open({
                            type: 1,
                            title: '结算金额确认',
                            content: $('#confirmCharge').html(),
                            area: ['500px', '300px'],
                            maxmin: true
                        })
                        orderListView.dataObj.totalMoney=res.content.originTotalAmount
                        $('#timeLength').val(res.content.timeLength+'分钟')
                        $('#distance').val(res.content.distance+'km')
                        $('#originTotalAmount').val(res.content.originTotalAmount+'元')
                        //parent.window.$('#searchBt').click();
                    }
                });
            },
            confirmCharge(data){
                $.postApi('/management/v1/orderinfo/confirmCharge',{
                    //"cancelSource": $('#cancelSource2').val(),
                    "orderId":$.getUrlData().orderId,
                    "timestamp":parseInt(new Date().getTime()/1000),
                    "driverId":orderDetailInfo.driverId,
                    "parkingAmount":data.parkingAmount,
                    "bridgeAmount":data.bridgeAmount,
                    "highwayAmount":data.highwayAmount,
                    "otherAmount":data.otherAmount,
                    "tipAmount":data.tipAmount
                },function(res)
                {
                    if(res.code == 0)
                    {
                        layer.msg(res.message);
                        location.reload()

                    }
                });
            }
        },
        defaultEvent:function()
        {
            var _this = this;
            $('#jsBrandBack').click(function(){
                _this.eventFun.closeLayer();
            });
            $('#refund').click(function(){
                _this.eventFun.editLayer('./order_refund.html',{
                    orderId:$.getUrlData().orderId,
                    payDoneAmount:orderDetailInfo.payDoneAmount
                },'退款申请');
                return false;
            })
            $(document).on('change','.inputFee',function(){
                var originTotalAmount=Number(orderListView.dataObj.totalMoney);
                var bridgeAmount=Number($('#bridgeAmount').val());
                var highwayAmount=Number($('#highwayAmount').val())
                var otherAmount=Number($('#otherAmount').val());
                var parkingAmount=Number($('#parkingAmount').val())
                var tipAmount=Number($('#tipAmount').val())
                $('#originTotalAmount').val((originTotalAmount+tipAmount+bridgeAmount+parkingAmount+highwayAmount+otherAmount)+'元')
            })
        },
        /*提交表单*/
        formSub:function()
        {
            var _this = this;
            form.on('submit(cancelOrder)', function(data){//取消订单
                _this.eventFun.cancelOrder(data.field)
                return false;
            });
            form.on('submit(finishedOrder)',function(data){//终止订单
                _this.eventFun.getLastPosition()
                return false;
            })
            form.on('submit(confirmCharge)',function(data){//结算费用
                _this.eventFun.confirmCharge(data.field)
                return false;
            })
        },
    };
    //需要优先执行
    orderListView.eventFun.getUrlData();
    orderListView.formSub();
    orderListView.defaultEvent();
});