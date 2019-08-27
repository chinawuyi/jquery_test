layui.use(['common','form', 'layer','laydate', 'dict', 'permission'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var permission = layui.permission;
    var form = layui.form;
    var laydate = layui.laydate;
    var userAdd = {
        photo:'',
        dataObj:{
            'id':'',
            'username':''
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
                    title:'修改密码',
                    content: action,
                    area: ['500px', '400px'],
                    maxmin: true
                });
            },
            closeLayer:function()
            {
                var index = parent.layer.getFrameIndex(window.name);
                parent.layer.close(index);
            },
            /*修改用户信息*/
            updateData:function(data,val)
            {         
                var _this = this;      
                $.postApi('/management/v1/users/self/update',{
                    birthday:data.birthday,//出生年月日
                    email:data.email,//邮箱
                    headImgUrl:$("#headImgUrl").attr('key'),//头像
                    nickname:data.nickname,//昵称
                    sex:data.sex,//性别
                    id:userAdd.dataObj.id,
                    username:data.username,
                    phone:data.phone,//手机
                },function(res)
                {
                    if(res.code=='0'){
                        layer.msg('修改成功');
                        window.setTimeout(function(){
                            _this.closeLayer();
                            
                        },1000);
                    }
                    
                },true);
            },
            /*根据key,id显示图片*/
            showDrivierImg(key,dom){
                if(key){
                    $.getFileUrl('driver',key,function(status,option){
                        if(status == 'success')
                        {
                            $('#'+dom).parents("tr").find(".jsphotoshow").empty();
                            $('.'+dom).val(key)
                            $('#'+dom).parents("tr").find(".jsphotoshow").append('<img src="'+option+'" class="enlarge"/>');
                            
                        }
                    });
                }
            },
            /*根据id查询用户*/
            getData:function()
            {
                var _this = this;
                $.getApi('/management/v1/users/self/queryInfo',{
                },function(res) 
                {
                    if(res.code=='0'){
                        var formData=res.content
                        /*循环表单赋值*/
                        var inputDom=document.getElementsByClassName("form-control")
                        if(formData){
                            for(var i=0;i<inputDom.length;i++){
                                var attr=inputDom[i].getAttribute("name")  
                                if(attr=='birthday'){
                                    inputDom[i].value=formData[attr]||""
                                }else{
                                    inputDom[i].value=formData[attr]
                                }
                                
                            }
                        }
                        userAdd.dataObj.id=formData.id
                        userAdd.dataObj.username=formData.username
                        /*显示用户图片*/
                        
                        userAdd.eventFun.showDrivierImg(res.content.headImgUrl,'headImgUrl')
                        form.render('select');
                    }

                });
            },
            blindUploadImg(dom,callBack){
                $('#'+dom).uploadFun('driver',function(status,key){
                    if(status =='success')
                    {
                        $.getFileUrl('driver',key,function(status,option){
                            if(status == 'success')
                            {
                                $('#'+dom).parents("tr").find(".jsphotoshow").empty();
                                $('#'+dom).attr('key',key)
                                $('.'+dom).val(key)
                                $('#'+dom).parents("tr").find(".jsphotoshow").append('<img src="'+option+'" class="enlarge"/>');
                                if(callBack){
                                    callBack(option)
                                }
                            }
                        });
                    }
                });
            },
            /**密码校验 */
            verify:function()
                {
                    form.verify({
                        passwordCheck: function(value, item){ 
                            if(!/^(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?]{8,30}$/.test(value)&&userAdd.dataObj.type=='new'){
                              return '密码格式有误，密码必须是8-20位英文字母、数字或字符至少两种组合';
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
                var checkoutCont=[]
                $('input[name="roleIds"]:checked').each(function(){ 
                    checkoutCont.push($(this).val()); 
                });
                _this.eventFun.updateData(data.field);
                return false;
            });

        },
        /*默认方法*/
        defaultEvent:function()
        {
            var _this = this;
            /**修改密码 */
            $('#changePassWord').click(function(){
                _this.eventFun.addLayer('./change_password.html',{
                    'username':userAdd.dataObj.username
                });
            })
            /*出生年月日*/
            laydate.render({
                trigger: 'click',
                elem: '#birthday',
                max:new Date(Date.now()-24*60*60*1000).Format('yyyy-MM-dd')
            });
            _this.eventFun.blindUploadImg('headImgUrl');//头像
        }
    };
    //需要优先执行 
    userAdd.eventFun.getData();
    userAdd.formSub();  
    userAdd.defaultEvent();
    $.enlargeImg()
});
