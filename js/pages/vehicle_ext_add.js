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
            'id':'',
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
                $.postApi('/management/'+$.BC.V+'/vehicle/ext/create',{
                    "carId":vehicleAdd.dataObj.carId,
                    "vehicleType": data.vehicle_type,
                    "ownerName": data.owner_name,
                    "transAgency": data.trans_agency,
                    "transDateStart": parseInt(new Date(data.trans_date_start).getTime()/1000),
                    "transDateStop": parseInt(new Date(data.trans_date_stop).getTime()/1000),
                    "certifyDateB": parseInt(new Date(data.certify_date_b).getTime()/1000),
                    "fixState": parseInt(data.fix_state),
                    "nextFixDate": parseInt(new Date(data.next_fix_date).getTime()/1000),
                    "checkDate": parseInt(new Date(data.check_date).getTime()/1000),
                    // 车辆年度审验状态:0-未年审;1-年审不合格;2-年审合格
                    "checkState":parseInt(data.check_state),
                    "feePrintid": data.fee_printid,
                    "gpsBrand":data.gps_brand,
                    "gpsModel": data.gps_model,
                    "gpsImei": data.gps_imei,
                    "commercialType": parseInt(data.commercial_type),
                    "fareType": data.fare_type,
                    "vehicleTec": data.vehicle_tec,
                    "gpsInstallDate": parseInt(new Date(data.gps_install_date).getTime()/1000),
                    "vehicleSafe":data.vehicle_safe,
                    "certifyDateA":parseInt(new Date(data.certifyDateA).getTime()/1000)
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
                        // window.location.reload();
                       
                    }
                });
            },
            updateData:function(data)
            {
                var _this = this;
                $.postApi('/management/'+$.BC.V+'/vehicle/ext/update',{
                    "carId":vehicleAdd.dataObj.carId,
                    "id":vehicleAdd.dataObj.id,
                    "vehicleType": data.vehicle_type,
                    "ownerName": data.owner_name,
                    "transAgency": data.trans_agency,
                    "transDateStart": parseInt(new Date(data.trans_date_start).getTime()/1000),
                    "transDateStop": parseInt(new Date(data.trans_date_stop).getTime()/1000),
                    "certifyDateB": parseInt(new Date(data.certify_date_b).getTime()/1000),
                    "fixState": parseInt(data.fix_state),
                    "nextFixDate": parseInt(new Date(data.next_fix_date).getTime()/1000),
                    "checkDate": parseInt(new Date(data.check_date).getTime()/1000),
                     // 车辆年度审验状态:0-未年审;1-年审不合格;2-年审合格
                    "checkState":parseInt(data.check_state),
                    "feePrintid": data.fee_printid,
                    "gpsBrand":data.gps_brand,
                    "gpsModel": data.gps_model,
                    "gpsImei": data.gps_imei,
                    "commercialType": parseInt(data.commercial_type),
                    "fareType": data.fare_type,
                    "vehicleTec": data.vehicle_tec,
                    "gpsInstallDate": parseInt(new Date(data.gps_install_date).getTime()/1000),
                    "vehicleSafe":data.vehicle_safe,
                    "certifyDateA":parseInt(new Date(data.certifyDateA).getTime()/1000)
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
                $.getApi2('/management/v1/vehicle/ext/info',[vehicleAdd.dataObj.carId],
                function(res)
                {
                    if(res.code == 0)
                    {
                        if(!res.content)
                        {

                        }
                        else{
                            vehicleAdd.dataObj.id = res.content.id;
                            $('#vehicle_type').val(res.content.vehicleType);
                            $('#owner_name').val(res.content.ownerName);
                            $('#trans_agency').val(res.content.transAgency);
                            $('#trans_date_start').val(new Date(res.content.transDateStart*1000).Format('yyyy-MM-dd'));
                            $('#trans_date_stop').val(new Date(res.content.transDateStop*1000).Format('yyyy-MM-dd'));
                            $('#certify_date_b').val(new Date(res.content.certifyDateB*1000).Format('yyyy-MM-dd'));
                            // $('#fix_state').val(res.content.fixState);
                            $('#next_fix_date').val(new Date(res.content.nextFixDate*1000).Format('yyyy-MM-dd'));
                            $('#check_date').val(new Date(res.content.checkDate*1000).Format('yyyy-MM-dd'));
                            // $('#check_state').val(res.content.checkState);

                            $('#fee_printid').val(res.content.feePrintid);

                            $('#gps_brand').val(res.content.gpsBrand);
                            $('#gps_model').val(res.content.gpsModel);
                            $('#gps_imei').val(res.content.gpsImei);
                            // $('#commercial_type').val(res.content.commercialType);
                            $('#fare_type').val(res.content.fareType);
                            $('#vehicle_tec').val(res.content.vehicleTec);
                            $('#gps_install_date').val(new Date(res.content.gpsInstallDate*1000).Format('yyyy-MM-dd'));
                            $('#vehicle_safe').val(res.content.vehicleSafe);
                            $('#certifyDateA').val(new Date(res.content.certifyDateA*1000).Format('yyyy-MM-dd'))

                        }

                         //查看
                        if(vehicleAdd.dataObj.readonly == 'readonly')
                        {
                            $.readOnly();
                            $.replaceSelectByVal([
                                {
                                    'id':'fix_state',
                                    'value':res.content.fixState
                                },
                                {
                                    'id':'check_state',
                                    'value':res.content.checkState
                                },
                                {
                                    'id':'commercial_type',
                                    'value':res.content.commercialType
                                }
                            ]);
                        }

                    }
                });
            },
            getTypes:function()
            {
                $.postApi('/management/v1/cartype/list',{
                    // "carBrandId": vehicleAdd.dataObj.carBrandId,
                },
                function(res)
                {
                    if(res.code == 0)
                    {
                        $.appendSelect('status2',res.content.data,'carTypeId','name');
                        form.render('select');
                    }
                });
            },
            getCarColor:function(data)
            {
                $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                    "categoryCode": "PLATE_COLOR"
                },function(res)
                {
                    if(res.code == 0)
                    {
                        $.appendSelect('plateColor',res.content,'value','name',data?data.plateColor:null);
                        form.render('select');
                        if(vehicleAdd.dataObj.readonly == 'readonly')
                        {
                            $.replaceSelectByVal([
                                {
                                    'id':'plateColor',
                                    'value':data.plateColor
                                }
                            ]);
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
            getBrandsTree:function(data)
            {
                var _this = this;
                $.getApi('/management/v1/vehicle/listTree',{

                },
                function(res)
                {
                    if(res.code == 0)
                    {
                        vehicleAdd.brandTree = res.content;
                        _this._initTree(res.content,data);

                    }
                });
            },
            getCompany:function(city)
            {
                var options = [];
                if(typeof(city) == 'string')
                {
                    options.push(city);
                }
                else{
                    options.push(city.city);
                }
                $.getApi2('/management/v1/carrent/list',options,
                    function(res)
                    {
                        if(res.code == 0)
                        {
                            $.appendSelect('rentCompanyId',res.content,'rentCompanyId','chineseName',city.rentCompanyId);
                            form.render('select');
                            if(vehicleAdd.dataObj.readonly == 'readonly')
                            {
                                $.replaceSelectByVal([
                                    {
                                        'id':'rentCompanyId',
                                        'value':city.rentCompanyId
                                    }
                                ]);
                            }
                        }
                    });
            },
            _initTree:function(data,defaultdata)
            {
                if(!defaultdata)
                {
                    $.appendSelect('carBrandId',data,'carBrandId','name');
                    form.render('select');
                }
                else
                {
                    $.appendSelect('carBrandId',data,'carBrandId','name',defaultdata.carBrandId);
                    $(data).each(function(){
                        if(this.carBrandId == defaultdata.carBrandId)
                        {
                            $.appendSelect('carModelId',this.modelList,'carModelId','name',defaultdata.carModelId);
                            $(this.modelList).each(function(){
                                if(this.carModelId == defaultdata.carModelId)
                                {
                                    $.appendSelect('carAttributeId',this.attributeList,'carAttributeId','name',defaultdata.carAttributeId);
                                }
                            });
                        }
                    });
                    form.render('select');
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
                    if( vehicleAdd.dataObj.id == '')
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
                carBrandId:function(value,item){
                    if(value == '')
                    {
                        return '请选择车型品牌';
                    }
                },
                carTypeId:function(value)
                {
                    if(value == '')
                    {
                        return '请选择车型';
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

            //certify_date_b
            laydate.render({
                trigger: 'click',
                elem: '#certify_date_b' //指定元素
            });
            //trans_date_start
            laydate.render({
                trigger: 'click',
                elem: '#trans_date_start' //指定元素
            });
            laydate.render({
                trigger: 'click',
                elem: '#trans_date_stop' //指定元素
            });
            laydate.render({
                trigger: 'click',
                elem: '#next_fix_date' //指定元素
            });
            laydate.render({
                trigger: 'click',
                elem: '#check_date' //指定元素
            });
            laydate.render({
                trigger: 'click',
                elem: '#gps_install_date' //指定元素
            });
            laydate.render({
                trigger: 'click',
                elem:'#certifyDateA'
            })
        }
    };
    //需要优先执行
    vehicleAdd.eventFun.getUrlData();
    vehicleAdd.defaultEvent();
    vehicleAdd.verify();
    vehicleAdd.formSub();
    $.enlargeImg()
});