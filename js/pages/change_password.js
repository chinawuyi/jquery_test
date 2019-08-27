layui.use(['common','form', 'layer','laydate', 'dict', 'permission'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var permission = layui.permission;
    var form = layui.form;
    var laydate = layui.laydate;
    var userChangePassword = {
        photo:'',
        dataObj:{
            'username':'',
        },
        eventFun:{
            closeLayer:function()
            {
                var index = parent.layer.getFrameIndex(window.name);
                parent.layer.close(index);
            },
            /*修改用户密码*/
            subData:function(data,val)
            {
                var _this=this
                if($.getUrlData().id){
                    $.postApi('/management/v1/users/sys/resetPwd',{
                        newPassword:data.newPassword,
                        userId:$.getUrlData().id
                    },function(res)
                    {
                        if(res.code=='0'){
                            layer.msg(res.message);
                            window.setTimeout(function(){
                                _this.closeLayer();
                                
                            },1000);
                        }
                    });
                }else{
                    $.postApi('/management/v1/users/self/changePassword',{
                        oldPassword:data.oldPassword,
                        newPassword:data.newPassword
                    },function(res)
                    {
                        if(res.code=='0'){
                            if($.getUrlData().refresh=='1'){
                                parent.window.location.href = '/'
                            }
                            layer.msg(res.message);
                            window.setTimeout(function(){
                                _this.closeLayer();
                                
                            },1000);
                        }
                    });
                }
                
            },
            getUrlData()
            {
                var urlData = $.getUrlData();
                if(urlData)
                {                    
                    if(urlData.id){
                        userChangePassword.dataObj.id=urlData.id
                        $('.oldPassword').remove()
                    }else{
                        userChangePassword.dataObj.username=urlData.username
                    }
                    
                }
            },
            /**密码校验 */
            verify:function()
                {
                    form.verify({
                        passwordCheck: function(value, item){ 
                            if(!/^(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?]{8,30}$/.test(value)){
                              return '密码格式有误，密码必须是8-20位英文字母、数字或字符至少两种组合';
                            }
                        },
                        passwordSame: function(value, item){ 
                            if($('#newPassword').val()!=$('#newPassword2').val()){
                              return '两次输入密码不一样';
                            }
                        }
                    });
                },
        },
        /*提交表单*/
        formSub:function()
        {
            var _this = this;
            
            form.on('submit(*)', function(data){
                _this.eventFun.subData(data.field);
                return false;
            });

        },
        /*默认方法*/
        defaultEvent:function()
        {
            var _this = this;
            
            $('#jsBrandBack').click(function(){
                _this.eventFun.closeLayer();
            });
        }
    };
    //需要优先执行 
    userChangePassword.eventFun.getUrlData();
    userChangePassword.formSub();  
    userChangePassword.eventFun.verify()
    userChangePassword.defaultEvent();
    $.enlargeImg()
});
