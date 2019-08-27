layui.use(['common','form', 'layer','laydate', 'dict', 'permission','validate'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var permission = layui.permission;
    var form = layui.form;
    var laydate = layui.laydate;
    var validate=layui.validate
    var userAdd = {
        photo:'',
        dataObj:{
            'id':'',
            'type':'new',
            'readonly':'',
            'carId':''
        },
        eventFun:{
            addLayer:function(titleName,action,options)
            {
                if(options)
                {
                    action = $.addUrlPro(action,options);
                }
                layer.open({
                    type: 2,
                    title:titleName,
                    content: action,
                    area: ['500px', ($(window).height()-80)+'px'],
                    maxmin: true
                });
            },
            closeLayer:function()
            {
                var index = parent.layer.getFrameIndex(window.name);
                parent.layer.close(index);
            },
            /*创建用户*/
            subData:function(data,val)
            {
                $.postApi('/management/v1/users/add',{
                    birthday:data.birthday,//出生年月日
                    email:data.email,//邮箱
                    headImgUrl:$("#headImgUrl").attr('key'),//头像
                    nickname:data.nickname,//昵称
                    password:data.password,//密码
                    phone:data.phone,//手机
                    roleIds:val,//角色
                    sex:data.sex,//性别
                    username:data.username
                },function(res)
                {
                    if(res.code=='0'){
                        parent.window.$('#searchBt').click();
                        window.userRQCode=res.content.authUrl
                        userAdd.eventFun.addLayer('操作成功，请使用谷歌身份验证器扫描二维码，以开启动态安全认证','./user_RqCode.html');
                    }
                    
                });
            },
            /*修改用户信息*/
            updateData:function(data,val)
            {         
                var _this = this;      
                $.postApi('/management/v1/users/sys/update',{
                    birthday:data.birthday,//出生年月日
                    email:data.email,//邮箱
                    headImgUrl:$("#headImgUrl").attr('key'),//头像
                    nickname:data.nickname,//昵称
                    roleIds:val,//角色
                    sex:data.sex,//性别
                    id:userAdd.dataObj.id,
                    password:data.password,
                    phone:data.phone,//手机
                },function(res)
                {
                    if(res.code=='0'){
                        layer.msg('修改成功');
                        window.setTimeout(function(){
                            _this.closeLayer();
                            parent.window.$('#searchBt').click();
                        },1000);
                    }
                    
                },true);
            },
            /*根据key,id显示图片*/
            showDrivierImg:function(key,dom){
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
                $.getApi('/management/v1/users/'+userAdd.dataObj.id,{
                },function(res)
                {
                        var formData=res.content
                        /*循环表单赋值*/
                        var inputDom=document.getElementsByClassName("form-control")
                        if(formData){
                            for(var i=0;i<inputDom.length;i++){
                                var attr=inputDom[i].getAttribute("name")
                                if(attr=='birthday'){
                                    inputDom[i].value=formData[attr]||''
                                } else{
                                    inputDom[i].value=formData[attr]
                                } 
                                
                            }
                        }
                        
                        /*显示用户图片*/
                        userAdd.eventFun.showDrivierImg(res.content.headImgUrl,'headImgUrl')                    

                        /*判断是预览还是编辑*/
                        if(userAdd.dataObj.readonly === 'readonly')
                        {
                            
                            $('input,textarea').addClass('layui-disabled').attr('readonly','readonly');
                            $('select,.real_file_btn,input[type="checkbox"]').addClass('layui-disabled').attr('disabled','disabled');
                            $('#jsSub').css('display','none');
                            $('.my_file_btn').addClass('layui-btn-disabled')
                            $('#changePassWord').hide()
                            
                        }else{
                            $('#changePassWord').show()
                            $('#password').hide()
                        }
                        /**用户名不可修改 */
                        $('#username').addClass('layui-disabled').attr('readonly','readonly');
                        /**设置勾选的角色 */                        
                        form.render('select');
                });
            },
            getUrlData:function()
            {
                var urlData = $.getUrlData();
                if(urlData)
                {
                    userAdd.dataObj.id = urlData.id;
                    userAdd.dataObj.readonly = urlData.readonly;
                    userAdd.dataObj.type = 'update';
                    userAdd.eventFun.getData();
                    
                }
            },
            blindUploadImg:function(dom,callBack){
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
            /**获取角色 */
            getRoleData(){
                $.getApi('/management/v1/roles/getAllRoles',{
                },function(res)
                    {
                        var str=''
                        $.each(res,function(key,val){
                            
                            str+='<input type="checkbox" name="roleIds" title="'+val.name+'" lay-skin="primary" value="'+val.id+'" '+(val.id=="100014"?"disabled checked":"")+'> '
                        })
                        
                        $("#roleIds").append(str)
                        form.render('checkbox');
                        if($.getUrlData()){
                            userAdd.eventFun.getCheckRole()
                        }                        
                        
                    },true)
            },
            /**获取选中角色 */
            getCheckRole(){
                $.getApi('/management/v1/roles/getAllRoles/'+userAdd.dataObj.id,{
                },function(res)
                    {
                        if(res){
                            $.each(res,function(index,val){
                                $('input[name="roleIds"]').each(function(){ 
                                    if($(this).val()==val.id){
                                        $(this).attr("checked",true)
                                    }
                                });
                            })
                        }
                        if(userAdd.dataObj.readonly === 'readonly'){
                            $('input[type="checkbox"]').addClass('layui-disabled').attr('disabled','disabled');
                        }
                        
                        form.render('checkbox');
                    },true)
            }
        },
        /*提交表单*/
        formSub:function()
        {
            var _this = this;
            
            //新创建
            if(_this.dataObj.type == 'new')
            {
                form.on('submit(*)', function(data){
                    var checkoutCont=[]
                    $('input[name="roleIds"]:checked').each(function(){ 
                        checkoutCont.push($(this).val()); 
                    });
                    _this.eventFun.subData(data.field,checkoutCont);
                    return false;
                });
                $('#bindCarCont').hide();
            }
            //更新
            else if(_this.dataObj.type == 'update')
            {
                form.on('submit(*)', function(data){
                    var checkoutCont=[]
                    $('input[name="roleIds"]:checked').each(function(){ 
                        checkoutCont.push($(this).val()); 
                    });
                    _this.eventFun.updateData(data.field,checkoutCont);
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

            /*出生年月日*/
            if(!userAdd.dataObj.readonly){//查看时不绑定控件
                laydate.render({
                    elem: '#birthday',
                    trigger: 'click',
                    max:new Date(Date.now()-24*60*60*1000).Format('yyyy-MM-dd')
                });
            }
            
            _this.eventFun.blindUploadImg('headImgUrl');//头像
            /**修改密码 */
            $('#changePassWord').click(function(){
                _this.eventFun.addLayer('修改密码','./change_password.html',{
                    'id':userAdd.dataObj.id
                });
            })
        }
    };
    //需要优先执行 
    userAdd.eventFun.getUrlData();
    userAdd.formSub();  
    userAdd.eventFun.getRoleData()
    userAdd.eventFun.verify()
    userAdd.defaultEvent();
    validate.verify()
    $.enlargeImg()
});
