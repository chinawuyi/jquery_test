layui.use(['common','form', 'layer', 'dict', 'permission'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var form = layui.form;
    var vehicleAdd = {
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
            subData:function(data)
            {

                var _this = this;
                $.postApi('/management/v1/carrent/create',{
                    "chineseName": data.chineseName,
                    "englishName": data.englishName,
                    "accountName": data.accountName,
                    "account": data.account,
                    "accountHolder": data.accountHolder,
                    "bank": data.bank,
                    "city":data.city,
                    "bankCode":data.bankCode,
                    "bankBranch":data.bankBranch,
                    "bankNumber":data.bankNumber,
                    "registrationNo":data.registrationNo,
                    "artificialPerson":data.artificialPerson,
                    "artificialPersonIdentity":data.artificialPersonIdentity
                },
                function(res)
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
            updateData:function(data)
            {
                var _this = this;
                $.postApi('/management/v1/carrent/update',{
                    'rentCompanyId':vehicleAdd.dataObj.id,
                    "chineseName": data.chineseName,
                    "englishName": data.englishName,
                    "accountName": data.accountName,
                    "account": data.account,
                    "accountHolder": data.accountHolder,
                    "bank": data.bank,
                    "bankCode":data.bankCode,
                    "bankBranch":data.bankBranch,
                    "bankNumber":data.bankNumber,
                    "city":data.city,
                    "registrationNo":data.registrationNo,
                    "artificialPerson":data.artificialPerson,
                    "artificialPersonIdentity":data.artificialPersonIdentity
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
            getData:function()
            {
                var _this = this;
                $.getApi('/management/v1/carrent/query',{
                    "carRentCompanyId": vehicleAdd.dataObj.id,
                },function(res)
                {
                    if(res.code == 0)
                    {
                        _this.getCitys(res.content);
                        $('#chineseName').val(res.content.chineseName);
                        $('#englishName').val(res.content.englishName);
                        $('#accountName').val(res.content.accountName);
                        $('#account').val(res.content.account);
                        $('#accountHolder').val(res.content.accountHolder);
                        $('#bank').val(res.content.bank);
                        $('#bankCode').val(res.content.bankCode);
                        $('#bankBranch').val(res.content.bankBranch);
                        $('#bankNumber').val(res.content.bankNumber);
                        $('#registrationNo').val(res.content.registrationNo);
                        $('#artificialPerson').val(res.content.artificialPerson);
                        $('#artificialPersonIdentity').val(res.content.artificialPersonIdentity);
                        if(vehicleAdd.dataObj.readonly === 'readonly')
                        {
                            $.readOnly();
                            $('#jsfilecon').empty();

                        }
                    }
                });
            },
            getCitys:function(data)
            {
                $.postApi('/management/v1/businesscity/cityList',{
                        "type":"2"
                    },
                    function(res)
                    {
                        $.appendSelect('city',res.content==null?[]:res.content,'code','name',data?data.city:null);
                        form.render('select');
                        if(vehicleAdd.dataObj.readonly == 'readonly')
                        {
                            $.replaceSelectByVal([
                                {
                                    'id':'city',
                                    'value':data.city
                                }
                            ]);
                        }
                    });
            },
            getBrands:function()
            {

            },
            getUrlData:function()
            {
                var urlData = $.getUrlData();
                if(urlData)
                {
                    vehicleAdd.dataObj.id = urlData.id;
                    vehicleAdd.dataObj.readonly = urlData.readonly;
                    vehicleAdd.dataObj.type = 'update';
                    this.getData();
                }
                else
                {
                    vehicleAdd.eventFun.getCitys();
                }
            },
            verify:function()
            {
                form.verify({
                    accountRule:function(value,item){
                        if(/[^\da-zA-Z]+/g.test(value))
                        {
                            return '请填写正确的公司账户';
                        }
                    },
                    enNameRule:function(val){
                        if(/[\u4e00-\u9fa5]+/.test(val)){
                            return '英文名称请不要输入中文';
                        }
                    },
                    //英文数字
                    normalRule:function(val){
                        if(!/^[a-zA-Z\d]+$/.test(val)){
                            return '请输入英文或数字组合的信息';
                        }
                    },
                });
            },
        },
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
        defaultEvent:function()
        {
            var _this = this;
            $('#jsBrandBack').click(function(){
                _this.eventFun.closeLayer();
            });
            this.eventFun.getBrands();
        }
    };
    //需要优先执行
    vehicleAdd.eventFun.getUrlData();
    vehicleAdd.eventFun.verify();
    vehicleAdd.defaultEvent();
    vehicleAdd.formSub();

    
});