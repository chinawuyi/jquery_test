layui.use(['common','form', 'laydate','layer', 'dict', 'permission'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var form = layui.form;
    var laydate = layui.laydate;
    var checkboxloaded = false;
    var checkboxstr = '';
    var chargeAdd = {
        photo:'',
        dataObj:{
            'id':'',
            'type':'new',
            'readonly':'',
            'basicPriceId':''
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
                $.postApi('/management/v1/charge/pkg/save',{

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
            updateData:function(data)
            {
                console.log(data)
                var longDistanceData =[];
                var segmentData = [];
                $('#longDistanceList tr').each(function(){
                    longDistanceData.push({
                        "chargePkgId": Number(chargeAdd.dataObj.id),
                        "longDistancePriceId":Number($(this).attr('longDistanceId')),
                        "feeLongPerKilometer": Number($(this).find('.feeLongPerKilometer').val()),
                        "freeLongDistance": Number($(this).find('.freeLongDistance').val())
                    })
                });
                $('#segmentList tr').each(function(){
                    segmentData.push({
                        "chargePkgId": Number(chargeAdd.dataObj.id),
                        "segmentId":Number($(this).attr('segmentId')),
                        "segmentPriceId":Number($(this).attr('segmentPriceId')),
                        "feePerKilometer": Number($(this).find('.feePerKilometer').val()),
                        "feePerMinute": Number($(this).find('.feePerMinute').val())
                    })
                });
                var _this = this;
                $.postApi('/management/v1/charge/pkg/update',{
                    pkg:{
                        "chargePkgId":chargeAdd.dataObj.id,
                        "chargePkgName":data.chargePkgName,
                        "carTypeId": data.carTypeId,
                        "city": data.city,
                        "productTypeId": data.productTypeId,
                        "effectiveTime":new Date(data.time.slice(0,16)).getTime(),
                        "invalidTime":new Date(data.time.slice(19,35)).getTime(),
                        "remark":data.remark
                    },
                    rule:{
                        basic:{
                            'basicPriceId':Number(chargeAdd.dataObj.basicPriceId),
                            'feeStart':Number(data.feeStart),
                            'freeDistance':Number(data.freeDistance),
                            'freeTime':Number(data.freeTime)
                        },
                        longDistanceList:longDistanceData,
                        segmentList:segmentData
                    }
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
                $.postApi('/management/v1/charge/pkg/info',
                {
                    "chargePkgId":chargeAdd.dataObj.id
                },
                function(res){
                    if(res.code == 0)
                    {
                        let pkgData = res.content.pkg;
                        let ruleData = res.content.rule;
                        // console.log(pkgData);
                        // console.log(ruleData);
                        pkgData.effectiveTime=Number(pkgData.effectiveTime)
                        pkgData.invalidTime=Number(pkgData.invalidTime)
                        //content.pkg
                        $('#chargePkgName').val(pkgData.chargePkgName);
                        // $('#carTypeId').val(pkgData.carTypeId);
                        // $('#productTypeId').val(pkgData.productTypeId);
                        $('#time').val(new Date(pkgData.effectiveTime*1000).Format("yyyy-MM-dd hh:mm")+' - '+new Date(pkgData.invalidTime*1000).Format("yyyy-MM-dd hh:mm"));
                        $('#founder').val(pkgData.founder);
                        $('#remark').val(pkgData.remark);
                        $('#createTime').val(new Date(pkgData.createTime).Format('yyyy-MM-dd hh:mm:ss'));
                        $('#updateTime').val(new Date(pkgData.updateTime).Format('yyyy-MM-dd hh:mm:ss'));
                        $('#modifier').val(pkgData.modifier);
                       
                        //content.rule.basic
                        chargeAdd.dataObj.basicPriceId = ruleData.basic.basicPriceId;
                        $('#feeStart').val(ruleData.basic.feeStart);
                        $('#freeDistance').val(ruleData.basic.freeDistance);
                        $('#freeTime').val(ruleData.basic.freeTime);

                        //content.rule.longDistanceList
                        var longDistanceStr='';
                        $(res.content.rule.longDistanceList).each(function(k,v){
                            longDistanceStr += '<tr longDistanceId="'+v.longDistancePriceId+'">'+
                            '<td class="label-title" colspan="3"><span class="required-icon">*</span>远途费'+ v.longDistancePriceId +'(¥/km)</td>'+
                            '<td class="label-content" colspan="3"><input class="form-control feeLongPerKilometer"  lay-verify="required"  id=""  type="text"  name=""></td>'+
                            '<td class="label-title" colspan="3"><span class="required-icon">*</span>远途定义'+ v.longDistancePriceId +'(km)</td>'+
                            '<td class="label-content" colspan="3"><input class="form-control freeLongDistance"  lay-verify="required"  id=""  type="text"  name=""></td></tr>'
                        })
                        $('#longDistanceList').html(longDistanceStr);

                        $(res.content.rule.longDistanceList).each(function(v,k){
                            $('#longDistanceList tr[longDistanceId="'+k.longDistancePriceId+'"]').find('.feeLongPerKilometer').val(k.feeLongPerKilometer)
                            $('#longDistanceList tr[longDistanceId="'+k.longDistancePriceId+'"]').find('.freeLongDistance').val(k.freeLongDistance)
                            // $('#discountDetail tr[segmentId="'+k.segmentId+'"]').attr('discountId',k.discountId)
                        });
                        var segmentListStr='';
                        console.log(res);
                        $(res.content.rule.segmentList).each(function(k,v){
                            segmentListStr += '<tr segmentId="'+v.segmentId+'" segmentPriceId="'+v.segmentPriceId+'">'+
                            '<td class="label-title" colspan="4"><span class="required-icon">*</span>'+((v.startTime||v.endTime)?'('+(v.startTime?v.startTime:"")+'-'+(v.endTime?v.endTime:"")+')':'(除去已定义时段外全部时间)')+'</td>'+
                            '<td class="label-content" colspan="4"><input class="form-control feePerKilometer"  lay-verify="required"  id=""  type="text"  name=""></td>'+
                            '<td class="label-content" colspan="4"><input class="form-control feePerMinute"  lay-verify="required"  id=""  type="text"  name=""></td></tr>'
                        })
                        $('#segmentList').html(segmentListStr);

                        $(res.content.rule.segmentList).each(function(v,k){
                            $('#segmentList tr[segmentId="'+k.segmentId+'"]').find('.feePerKilometer').val(k.feePerKilometer)
                            $('#segmentList tr[segmentId="'+k.segmentId+'"]').find('.feePerMinute').val(k.feePerMinute)
                            // $('#discountDetail tr[segmentId="'+k.segmentId+'"]').attr('discountId',k.discountId)
                        });

                        chargeAdd.eventFun.getProductType(res.content);
                        chargeAdd.eventFun.getChargePkgType(res.content);
                        chargeAdd.eventFun.getCitys(res.content);
                        chargeAdd.eventFun.getCarList(res.content);
                        chargeAdd.eventFun.getDateType(res.content);
                        
                        if(chargeAdd.dataObj.readonly === 'readonly')
                        {
                            var dateType = res.content.pkg.dateType.split(',');
                            checkboxstr = dateType;
                            if(checkboxloaded == true)
                            {
                                $("input:checkbox[name='dateType']").each(function() { // 遍历name=standard的多选框
                                    if($.inArray($(this).val(),checkboxstr) >=0)
                                    {
                                        $(this).attr('checked','checked');
                                    }
                                });
                            }
                            form.render();
                            $.readOnly();


                        }
                        if($.getUrlData())
                        {
                            // console.log(res.content);
                            // $.setSelect('userType',res.content?res.content.userType:null);
                            $.setSelect('carTypeId',res.content?res.content.carTypeId:null);
                            $.setSelect('productTypeId',res.content?res.content.productTypeId:null);
                            $.setSelect('chargePkgType',res.content?res.content.chargePkgType:null);
                            $.setSelect('getDateType',res.content?res.content.getDateType:null);
                            form.render('select');
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
                        // console.log(res.content);
                        $.appendSelect('city',res.content==null?[]:res.content,'code','name',data?data.pkg.city:null);
                        form.render('select');
                        if(chargeAdd.dataObj.readonly == 'readonly')
                        {
                            $.replaceSelectByVal([
                                {
                                    'id':'city',
                                    'value':data.pkg.city
                                }
                            ]);
                        }
                    }
                );
            },
            getProductType:function(data)
            {   
                $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                        "categoryCode": "PRODUCT_TYPE"
                    },
                    function(res)
                    {
                        if(res.code == 0){
                            // console.log(res.content)
                            $.appendSelect('productTypeId',res.content==null?[]:res.content,'value','name',data?data.pkg.productTypeId:null);
                            form.render('select');
                            if(chargeAdd.dataObj.readonly == 'readonly')
                            {
                                $.replaceSelectByVal([
                                    {
                                        'id':'productTypeId',
                                        'value':data.pkg.productTypeId
                                    }
                                ]);
                            }
                        }
                    }
                );
            },
            getDateType:function(data)
            {   
                $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                        "categoryCode": "DATE_TYPE"
                    },
                    function(res)
                    {
                        if(res.code == 0){
                            // console.log(res.content)
                            $(res.content).each(function(){
                                $('#dateType').append('<input type="checkbox" name="dateType" disabled value="'+this.value+'" title="'+this.name+'" lay-skin="primary">');
                            });
                            checkboxloaded = true;
                            if(checkboxstr != '')
                            {
                                $("input:checkbox[name='dateType']").each(function() { // 遍历name=standard的多选框
                                     if($.inArray($(this).val(),checkboxstr) >=0)
                                     {
                                         $(this).attr('checked','checked');
                                     }
                                });
                            }
                            form.render();

                        }
                    }
                );
            },
            getChargePkgType:function(data)
            {   
                $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                        "categoryCode": "CHARGE_PKG_TYPE"
                    },
                    function(res)
                    {
                        if(res.code == 0){
                            // console.log(res.content)
                            $.appendSelect('chargePkgType',res.content==null?[]:res.content,'value','name',data?data.pkg.chargePkgType:null);
                            form.render('select');
                            if(chargeAdd.dataObj.readonly == 'readonly')
                            {
                                $.replaceSelectByVal([
                                    {
                                        'id':'chargePkgType',
                                        'value':data.pkg.chargePkgType
                                    }
                                ]);
                            }
                        }
                    }
                );
            },
            getCarList:function(data)
            {
                $.postApi('/management/v1/cartype/list',{

                        "pageIndex": "1",
                        "pageSize": "200"
                    },
                    function(res)
                    {
                        if(res.code == 0){
                            // console.log(res.content.data)
                            $.appendSelect('carTypeId',res.content.data==null?[]:res.content.data,'carTypeId','name',data?data.pkg.carTypeId:null);
                            form.render('select');
                            if(chargeAdd.dataObj.readonly == 'readonly')
                            {
                                $.replaceSelectByVal([
                                    {
                                        'id':'carTypeId',
                                        'value':data.pkg.carTypeId
                                    }
                                ]);
                            }
                        }
                    }
                );
            },
            getUrlData()
            {
                var urlData = $.getUrlData();
                if(urlData)
                {
                    // console.log(urlData.id)
                    chargeAdd.dataObj.id = urlData.id;
                    chargeAdd.dataObj.readonly = urlData.readonly;
                    chargeAdd.dataObj.type = 'update';
                    this.getData();
                }
                else{
                    this.getCitys();
                    this.getCarList();
                    this.getDateType();
                    this.getChargePkgType();
                    this.getProductType();
                }
            },
            /** 标准计价校验 **/
            verify:function(){
                form.verify({
                    decimal:function(value,item){
                        if(!new RegExp("^[0-9]+([.]{1}[0-9]{1})?$").test(value)){
                            return '最多保留一位小数'
                        }
                    },
                    integer:function(value,item){
                        if(!new RegExp("^\\d+$").test(value)){
                            return '请输入整数'
                        }
                    }
                })
            }
        },
        formSub:function()
        {
            var _this = this;
            //新创建
            if(_this.dataObj.type == 'new')
            {
                form.on('submit(*)', function(data){
                    // console.log(data)
                    _this.eventFun.subData(data.field);
                    return false;
                });
            }
            //更新
            else if(_this.dataObj.type == 'update')
            {
                form.on('submit(*)', function(data){
                    console.log(data)
                    // _this.eventFun.updateData(data.field);
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
            laydate.render({
                trigger: 'click',
                elem: '#time',
                range: true,
                type: 'datetime',
                format:'yyyy-MM-dd HH:mm'
            });
        }
    };
    //需要优先执行
    chargeAdd.eventFun.getUrlData();
    chargeAdd.eventFun.verify();
    chargeAdd.defaultEvent();
    chargeAdd.formSub();
});