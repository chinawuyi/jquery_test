layui.use(['common','form', 'layer', 'dict', 'permission','element','table'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var form = layui.form;
    var element = layui.element;
    var table = layui.table;
    var orderListCancel = {
        tableObj:null,
        dataObj:{
            'invoiceId':''
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
                $.postApi('/management/v1/invoice/apply/redinvoice',{
                    "invoiceId": data.invoiceId,
                    "remark": data.remark,
                    "operator":''
                },function(res)
                {
                    if(res.code == 0)
                    {
                        console.log(res)
                        layer.msg(res.message);
                        window.setTimeout(function(){
                            _this.closeLayer();
                            parent.window.$('#searchBt').click();
                        },1000);

                    }
                });
            },
            getUrlData:function()
            {
                var urlData = $.getUrlData();
                if(urlData)
                {
                    orderListCancel.dataObj.invoiceId = urlData.invoiceId;
                }
            },
            getInvoiceId:function(){
                console.log($('input[name="invoiceId"]'),orderListCancel.dataObj.invoiceId)
                $('input[name="invoiceId"]').val(orderListCancel.dataObj.invoiceId);
            }
        },
        defaultEvent:function()
        {
            var _this = this;
            $('#jsBrandBack').click(function(){
                _this.eventFun.closeLayer();
            });
            form.on('submit(*)',function(data){
                console.log(data.field)
                _this.eventFun.subData(data.field);
                return false;
            })
        }
    };
    //需要优先执行
    orderListCancel.eventFun.getUrlData();
    orderListCancel.eventFun.getInvoiceId();
    
    orderListCancel.defaultEvent();
});