layui.use(['common','form', 'layer','laydate', 'dict', 'permission'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var form = layui.form;
    var laydate = layui.laydate;
    var userInfo = {
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
            getUserInfo:function(formData){
                /*循环表单赋值*/
                var inputDom=document.getElementsByClassName("label-content")
                if(formData){
                    for(var i=0;i<inputDom.length;i++){
                        var attr=inputDom[i].getAttribute("id") 
                        if(attr=='gender'){
                            inputDom[i].innerHTML=formData[attr]==1?'男':"女"
                        }else{
                            inputDom[i].innerHTML=formData[attr]?formData[attr]:""
                        }
                        
                    }
                }
                if(formData.headImg){
                    $.getFileUrl('user',formData.headImg.split(','),function(status,option){
                        if(status == 'success')
                        {

                            $('#headImg').empty();
                            $('#headImg').append('<img src="'+option+'" class="enlarge"/>');
                        }
                    })
                }
            },
            /*根据id查询用户信息*/
            getData:function()
            {
                var _this = this;
                if(userInfo.dataObj.id=='undefined'){
                    layer.msg('用户ID不存在')
                    return false
                }

                if(userInfo.dataObj.userType=='1'||!userInfo.dataObj.userType){//乘客
                    $.postApi('/management/v1/passenger/query',{
                        userId:userInfo.dataObj.id
                    },function(res)
                    {
                        if(res.code == 0)
                        {
                            $('.passengerCont').show()
                            $('.driverCont').hide()
                            userInfo.eventFun.getUserInfo(res.content)
                            
                        }
                    });
                }else if(userInfo.dataObj.userType=='2'){
                    $.postApi(' /management/v1/driverdetail/info/'+userInfo.dataObj.id,{
               
                    },function(res)
                    {
                        if(res.code == 0)
                        {
                            $('.driverCont').show()
                            $('.passengerCont').hide()
                            userInfo.eventFun.getUserInfo(res.content)
                            
                        }
                    });
                }
                
            },
            getUrlData:function()
            {
                var urlData = $.getUrlData();
                if(urlData)
                {
                    userInfo.dataObj.id = urlData.id;
                    userInfo.dataObj.userType=urlData.userType
                    userInfo.dataObj.readonly = urlData.readonly;
                    userInfo.dataObj.type = 'update';
                    userInfo.eventFun.getData();
                    
                }
            }
        }
    };
    //需要优先执行
    userInfo.eventFun.getUrlData();
    $.enlargeImg()
});