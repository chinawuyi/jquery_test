layui.use(['common','form', 'layer','laydate', 'dict', 'permission'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var form = layui.form;
    var laydate = layui.laydate;
    var laborCompanyAdd = {
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
            /*创建司机劳务公司*/
            subData:function(data)
            {
                var _this = this;
                $.postApi('/management/v1/driver/labor/create',{
                    chineseName:data.chineseName,//公司名称
                    accountName:data.accountName,//账户名称
                    contacts:data.contacts,//联系人
                    contactsCellphone:data.contactsCellphone,//联系人手机
                    signTime:new Date(data.signTime).getTime()/1000,//签约时间
                    expireTime:new Date(data.expireTime).getTime()/1000,//到期时间
                    licenseNo:data.licenseNo,//合同编号
                    bankName:data.bankName,//开户行
                    city:data.city,//城市
                    maxNum:data.maxNum,//允许最大数
                    legalPerson:data.legalPerson,//法人代表
                    bankCard:data.bankCard,//对公账户卡号
                    type:data.type==''?null:data.type,//类型
                    status:data.status==''?null:data.status//性别
                },function(res)
                {
                    if(res.code == 0)
                    {
                        layer.msg(res.message);
                        window.setTimeout(function(){
                            _this.closeLayer();
                            parent.window.$('#searchBt').click();
                        },1000);

                    }
                });
            },
            /*修改司机信息*/
            updateData:function(data)
            {
                var _this = this;
                $.postApi('/management/v1/driver/labor/update',{
                    labourCompanyId: laborCompanyAdd.dataObj.id,
                    accountName:accountName.data,//账户名称
                    contacts:data.contacts,//联系人
                    contactsCellphone:data.contactsCellphone,//联系人手机
                    signTime:new Date(data.signTime).getTime()/1000,//签约时间
                    expireTime:new Date(data.expireTime).getTime()/1000,//到期时间
                    licenseNo:data.licenseNo,//合同编号
                    bankName:data.bankName,//开户行
                    city:data.city,//城市
                    maxNum:data.maxNum,//允许最大数
                    legalPerson:data.legalPerson,//法人代表
                    bankCard:data.bankCard,//对公账户卡号
                    type:data.type,//类型
                    status:data.status//性别
                },function(res)
                {
                    if(res.code == 0)
                    {
                        layer.msg(res.message);
                        window.setTimeout(function(){
                            _this.closeLayer();
                            parent.window.$('#searchBt').click();
                        },1000);

                    }
                });
            },
            /*根据id查询司机劳务公司*/
            getData:function()
            {
                var _this = this;
                $.postApi('/management/v1/driver/labor/info/'+laborCompanyAdd.dataObj.id,{
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
                                if(attr=='signTime'||attr=='expireTime'){
                                    inputDom[i].value=formData[attr]?new Date(formData[attr]*1000).Format('yyyy-MM-dd'):""
                                }else{
                                    inputDom[i].value=formData[attr]
                                }
                            }
                        }

                        /*判断是预览还是编辑*/
                        if(laborCompanyAdd.dataObj.readonly === 'readonly')
                        {
                            $('input,textarea').addClass('layui-disabled').attr('readonly','readonly');
                            $('select,.real_file_btn').addClass('layui-disabled').attr('disabled','disabled');
                            $('#jsSub').css('display','none');
                            $('.my_file_btn').addClass('layui-btn-disabled')
                        }
                        $('#chineseName').attr('readonly','readonly');
                        form.render('select');
                    }
                });
            },
            getUrlData:function()
            {
                var urlData = $.getUrlData();
                if(urlData)
                {
                    laborCompanyAdd.dataObj.id = urlData.id;
                    laborCompanyAdd.dataObj.readonly = urlData.readonly;
                    laborCompanyAdd.dataObj.type = 'update';
                    
                }
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
        /*获取下拉菜单数据*/
        getSelectData:function(){
            var _this=this
            /*司机劳务公司 状态*/
            $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                "categoryCode": "DATA_STATUS"
            },function(res)
            {
                if(res.code == 0)
                {
                    $.appendSelect('status',res.content,'value','name');
                    form.render('select');
                }
            });
            /*司机劳务公司 类型*/
            $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                "categoryCode": "DRIVER_LABOUR_COMPANY_TYPE"
            },function(res)
            {
                if(res.code == 0)
                {
                    $.appendSelect('type',res.content,'value','name');
                    form.render('select');
                }
            });
            /*业务城市*/
            $.postApi('/management/v1/businesscity/list',{
                
            },function(res)
            {
                if(res.code == 0)
                {
                    $.appendSelect('city',res.content.data,'code','name');
                    if(laborCompanyAdd.dataObj.id){
                        laborCompanyAdd.eventFun.getData();
                    }
                    form.render('select');
                }
            });
        },
        /*默认方法*/
        defaultEvent:function()
        {
            var _this = this;
            
            $('#jsBrandBack').click(function(){
                _this.eventFun.closeLayer();
            });
            if($.getUrlData().readonly != 'readonly'){
                /*签约时间*/
                laydate.render({
                    elem: '#signTime',
                    trigger: 'click',
                });
                /*到期时间*/
                laydate.render({
                    elem: '#expireTime',
                    trigger: 'click',
                });
            }
            
            
        }
    };
    //需要优先执行
    laborCompanyAdd.eventFun.getUrlData();
    laborCompanyAdd.defaultEvent();
    laborCompanyAdd.formSub();
    laborCompanyAdd.getSelectData();
});