layui.use(['common','form', 'layer','laydate', 'dict', 'permission'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var form = layui.form;
    var laydate = layui.laydate;
    var dropDownList={
        channel:{}
    };
    var payInfo = {
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
            getpayInfo:function(formData){
                /*循环表单赋值*/
                var inputDom=document.getElementsByClassName("label-content")
                if(formData){
                    for(var i=0;i<inputDom.length;i++){
                        var attr=inputDom[i].getAttribute("id") 
                        if(attr=='channel'){
                            inputDom[i].innerHTML=formData[attr]?dropDownList.channel[formData[attr]]:""
                        }else if(attr=='recordTime'){
                            inputDom[i].innerHTML=formData[attr]?new Date(formData[attr]).Format('yyyy-MM-dd hh:mm'):""
                        }else{
                            inputDom[i].innerHTML=formData[attr]?formData[attr]:""
                        }
                        
                        
                    }
                }
            },
            /*根据id查询支付信息*/
            getData:function()
            {
                var _this = this;
                $.getApi('/management/v1/payRecord/selects/'+payInfo.dataObj.id,{
               
                },function(res)
                {
                    if(res.code == 0)
                    {
                        $('.driverCont').show()
                        $('.passengerCont').hide()
                        payInfo.eventFun.getpayInfo(res.content)
                        
                    }
                });
                
            },
            /**支付渠道 */
            getSelectData:function()
            {
                var _this = this;
                $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                    "categoryCode": "PAY_CHANNEL"
                },function(res)
                {
                    if(res.code == 0)
                    {
                        res.content.forEach(function(ele){                       
                            dropDownList.channel[ele.value]=ele.name
                        })
                        payInfo.eventFun.getData();
                    }
                });
                
            },
            getUrlData:function()
            {
                var urlData = $.getUrlData();
                if(urlData)
                {
                    payInfo.dataObj.id = urlData.id;
                    payInfo.dataObj.readonly = urlData.readonly;
                    payInfo.dataObj.type = 'update';
                    
                    
                }
            }
        }
    };
    //需要优先执行
    payInfo.eventFun.getUrlData();
    payInfo.eventFun.getSelectData();
    
});