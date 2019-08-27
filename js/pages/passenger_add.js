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
            /*根据id查询用户信息*/
            getData:function()
            {
                var _this = this;
                $.postApi('/management/v1/passenger/query',{
                    userId:userInfo.dataObj.id
                },function(res)
                {
                    if(res.code == 0)
                    {
                        var formData=res.content
                        /*循环表单赋值*/
                        var inputDom=document.getElementsByClassName("label-content")
                        if(formData){
                            for(var i=0;i<inputDom.length;i++){
                                var attr=inputDom[i].getAttribute("id")
                                if(attr.toLowerCase().indexOf('time')>0){
                                    inputDom[i].innerHTML=formData[attr]?new Date(formData[attr]).Format('yyyy-MM-dd hh:mm'):""
                                }else if(attr=='gender'){
                                    inputDom[i].innerHTML=formData[attr]==1?'男':'女'
                                }else{
                                    inputDom[i].innerHTML=formData[attr]||formData[attr]==0?formData[attr]:""
                                }
                                
                            }
                        }
                        if(res.content.headImg){
                            $.getFileUrl('user',res.content.headImg.split(','),function(status,option){
                                if(status == 'success')
                                {
    
                                    $('#headImg').empty();
                                    $('#headImg').append('<img src="'+option+'"  class="enlarge"/>');
                                }
                            })
                        }
                        
                    }
                });
            },
            getUrlData:function()
            {
                var urlData = $.getUrlData();
                if(urlData)
                {
                    userInfo.dataObj.id = urlData.id;
                    userInfo.dataObj.readonly = urlData.readonly;
                    userInfo.dataObj.type = 'update';
                    
                }
            },
            defaultEvent:function()
            {
                $('#jsBrandBack').click(function(){
                    userInfo.eventFun.closeLayer();
                });
            }
        }
    };
    //需要优先执行
    userInfo.eventFun.getUrlData();
    userInfo.eventFun.getData();
    userInfo.eventFun.defaultEvent();
    $.enlargeImg()
});