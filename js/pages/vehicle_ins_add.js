layui.use(['common','form', 'layer','laydate', 'dict', 'permission'], function()
{
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var form = layui.form;
    var laydate = layui.laydate;
    var vehicleAdd = {
        //车辆照片，前后左右4张图
        carImgs:'',
        carLicenseImg:'',
        carNumberImg:'',
        dataObj:{
            'carInsuranceId':'',
            'carId':'',
            'type':'new',
            'readonly':''
        },
        brandTree:[],
        modelList:[],
        eventFun:{
            addLayer:function(action,options)
            {
                if(options)
                {
                    action = $.addUrlPro(action,options);
                }
                layer.open({
                    type: 2,
                    title:'租赁公司',
                    content: action,
                    area: ['700px', $(window).height()-80+'px'],
                    maxmin: true
                });
            },
            closeLayer:function()
            {
                var index = parent.layer.getFrameIndex(window.name);
                parent.layer.close(index);
            },
            subData:function(data)
            {
                var _this = this;
                $.postApi('/management/'+$.BC.V+'/vehicle/insurance/create',{
                        "carId":vehicleAdd.dataObj.carId,
                        //'附件不计免赔'
                        "additionalExcludingDeductible":data.additional_excluding_deductible?data.additional_excluding_deductible:null,
                        //'玻璃单独破碎险'
                        "brokenGlass": data.broken_glass?data.broken_glass:null,
                        //折扣(单位万分之一)
                        "discount": data.discount?parseInt(data.discount):null,
                        "endTime": parseInt(new Date(data.end_time).getTime()/1000),
                        //'不计免赔'
                        "excludingDeductible": data.excluding_deductible?data.excluding_deductible:null,
                        "insurCom": data.insur_com,
                        "insurNum": data.insur_num,
                        "liabilityOtherMoney": data.liability_other_money?data.liability_other_money:null,
                        "liabilityOtherSum": data.liability_other_sum?data.liability_other_sum:null,
                        "peopleLiabilityMoney": data.people_liability_money?data.people_liability_money:null,
                        "peopleLiabilitySum": data.people_liability_sum?data.people_liability_sum:null,
                        "rearview": data.rearview?parseInt(data.rearview):null,
                        "riskOfDelivery": data.risk_of_delivery?data.risk_of_delivery:null,
                        "scratchRisk": data.scratch_risk?data.scratch_risk:null,
                        "startTime":parseInt(new Date(data.start_time).getTime()/1000),
                        "stolenMoney": data.stolen_money?data.stolen_money:null,
                        "stolenSum": data.stolen_sum?data.stolen_sum:null,
                        "transportRoyalities": data.transport_royalities?data.transport_royalities:null,
                        "wading": data.wading?data.wading:null,
                    },
                    function(res)
                    {
                        if(res.code == 0)
                        {
                            parent.layer.msg(res.message);
                            window.setTimeout(function(){
                                _this.closeLayer();
                                window.location.reload();
                            },1000);
                            // parent.window.openMsg(res.message);


                        }
                    });
            },
            updateData:function(data)
            {
                var _this = this;
                $.postApi('/management/'+$.BC.V+'/vehicle/insurance/update',{
                    "carInsuranceId":vehicleAdd.dataObj.carInsuranceId,
                    "carId":vehicleAdd.dataObj.carId,
                    //'附件不计免赔'
                    "additionalExcludingDeductible":data.additional_excluding_deductible?data.additional_excluding_deductible:null,
                    //'玻璃单独破碎险'
                    "brokenGlass": data.broken_glass?data.broken_glass:null,
                    //折扣(单位万分之一)
                    "discount": data.discount?parseInt(data.discount):null,
                    "endTime": parseInt(new Date(data.end_time).getTime()/1000),
                    //'不计免赔'
                    "excludingDeductible": data.excluding_deductible?data.excluding_deductible:null,
                    "insurCom": data.insur_com,
                    "insurNum": data.insur_num,
                    "liabilityOtherMoney": data.liability_other_money?data.liability_other_money:null,
                    "liabilityOtherSum": data.liability_other_sum?data.liability_other_sum:null,
                    "peopleLiabilityMoney": data.people_liability_money?data.people_liability_money:null,
                    "peopleLiabilitySum": data.people_liability_sum?data.people_liability_sum:null,
                    "rearview": data.rearview?parseInt(data.rearview):null,
                    "riskOfDelivery": data.risk_of_delivery?data.risk_of_delivery:null,
                    "scratchRisk": data.scratch_risk?data.scratch_risk:null,
                    "startTime":parseInt(new Date(data.start_time).getTime()/1000),
                    "stolenMoney": data.stolen_money?data.stolen_money:null,
                    "stolenSum": data.stolen_sum?data.stolen_sum:null,
                    "transportRoyalities": data.transport_royalities?data.transport_royalities:null,
                    "wading": data.wading?data.wading:null,
                },function(res)
                {
                    if(res.code == 0)
                    {
                        parent.layer.msg(res.message);
                        window.setTimeout(function(){
                            _this.closeLayer();
                        },1000);
                        // parent.window.openMsg(res.message);
                        // window.location.reload();
                    }
                });
            },
            getData:function()
            {
                $.getApi2('/management/'+$.BC.V+'/vehicle/insurance/info',[vehicleAdd.dataObj.carId],
                    function(res)
                    {
                        if(res.code == 0)
                        {
                            if(!res.content)
                            {

                            }
                            else{
                                vehicleAdd.dataObj.carInsuranceId = res.content.carInsuranceId;
                                $('#insur_com').val(res.content.insurCom);
                                $('#insur_num').val(res.content.insurNum);
                                $('#liability_other_sum').val(res.content.liabilityOtherSum);
                                $('#liability_other_money').val(res.content.liabilityOtherMoney);
                                $('#stolen_sum').val(res.content.stolenSum);
                                $('#stolen_money').val(res.content.stolenMoney);
                                $('#people_liability_sum').val(res.content.peopleLiabilitySum);
                                $('#people_liability_money').val(res.content.peopleLiabilityMoney);
                                $('#broken_glass').val(res.content.brokenGlass);
                                $('#scratch_risk').val(res.content.scratchRisk);
                                $('#wading').val(res.content.wading);
                                $('#rearview').val(res.content.rearview);
                                $('#additional_excluding_deductible').val(res.content.additionalExcludingDeductible);
                                $('#excluding_deductible').val(res.content.excludingDeductible);
                                $('#discount').val(res.content.discount);
                                $('#risk_of_delivery').val(res.content.riskOfDelivery);
                                $('#transport_royalities').val(res.content.transportRoyalities);


                                $('#start_time').val(new Date(res.content.startTime*1000).Format('yyyy-MM-dd'));
                                $('#end_time').val(new Date(res.content.endTime*1000).Format('yyyy-MM-dd'));


                            }

                            //查看
                            if(vehicleAdd.dataObj.readonly == 'readonly')
                            {
                                $.readOnly();

                            }

                        }
                    });
            },
            getUrlData:function()
            {
                var urlData = $.getUrlData();
                if(urlData)
                {
                    vehicleAdd.dataObj.carId = urlData.carId;
                    vehicleAdd.dataObj.readonly = urlData.readonly;
                    vehicleAdd.dataObj.type = 'update';
                    if(urlData.readonly == 'readonly')
                    {
                        vehicleAdd.dataObj.readonly = 'readonly';
                        this.getData();
                    }
                    else if(vehicleAdd.dataObj.type  == 'update')
                    {
                        this.getData();
                    }

                }
                else{
                    //获取品牌，车系联动JSON接口
                    //   vehicleAdd.eventFun.getBrandsTree();
                    //   vehicleAdd.eventFun.getCitys();
                    //   vehicleAdd.eventFun.getCarColor();
                }
            }
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
                    if( vehicleAdd.dataObj.carInsuranceId == '')
                    {
                        _this.eventFun.subData(data.field);
                    }
                    else{
                        _this.eventFun.updateData(data.field);
                    }
                    return false;
                });
            }

        },
        verify:function()
        {
            form.verify({
                moneyRule:function(value,item){
                    if(!/^\d+(\.\d+)?$/g.test(value) && value)
                    {
                        return '请输入金额';
                    }
                },
                //保险号码
                insCodeRule:function(val){
                    if(!/^[\da-zA-Z]+$/g.test(val))
                    {
                        return '请输入正确的保险号码';
                    }
                }
            });
        },
        defaultEvent:function()
        {
            var _this = this;
            $('#jsBrandBack').click(function(){
                _this.eventFun.closeLayer();
            });
            laydate.render({
                trigger: 'click',
                elem: '#start_time' //指定元素
            });

            laydate.render({
                trigger: 'click',
                elem: '#end_time' //指定元素
            });
        }
    };
    //需要优先执行
    vehicleAdd.eventFun.getUrlData();
    vehicleAdd.defaultEvent();
    vehicleAdd.verify();
    vehicleAdd.formSub();
    $.enlargeImg()
});