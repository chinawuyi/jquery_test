layui.use(['common','form', 'laydate','layer', 'dict', 'permission'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var form = layui.form;
    var laydate = layui.laydate;
    var cityList = null;
    var newList = null;
    var checkboxloaded = false;
    var checkboxstr = '';
    var chargeAdd = {
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
            subData:function(data)
            {
                var longDistanceData =[];
                var segmentData = [];
                longDistanceData.push(
                    {
                        // "longDistancePriceId": 1,
                        "feeLongPerKilometer": Number($('#feeLongPerKilometer1').val()),
                        "freeLongDistance": Number($('#freeLongDistance1').val())
                    },
                    {
                        // "longDistancePriceId": 2,
                        "feeLongPerKilometer": Number($('#feeLongPerKilometer2').val()),
                        "freeLongDistance": Number($('#freeLongDistance2').val())
                    },
                    {
                        // "longDistancePriceId": 3,
                        "feeLongPerKilometer": Number($('#feeLongPerKilometer3').val()),
                        "freeLongDistance": Number($('#freeLongDistance3').val())
                    }
                )

                var segmentData=[]
                for(k in data){
                    var num=k.split('FeePerKilometer')[1];
                    if(k.split('FeePerKilometer')[1]){
                        segmentData.push({
                            "segmentId":num,
                            // "segmentPriceId": $('#segmentPriceId').val(),
                            "feePerKilometer": Number($('#FeePerKilometer'+num).val()),
                            "feePerMinute": Number($('#FeePerMinute'+num).val())
                        })
                    }
                }
                var _this = this;
                var dateType = [];
                $("input:checkbox[name='dateType']:checked").each(function() { // 遍历name=standard的多选框
                   // dateType += ',' + $(this).val();
                    dateType.push($(this).val());
                });
                dateType = dateType.join(',');
                if(_this.checkTrue(segmentData)){
                    $.postApi('/management/v1/charge/pkg/save',{
                        pkg:{
                            "chargePkgName":data.chargePkgName,
                            "carTypeId": data.carTypeId,
                            "city": data.city,
                            "productTypeId": data.productTypeId,
                            "chargePkgType":data.chargePkgType,
                            "dateType": dateType,
                            "effectiveTime":parseInt(new Date(data.time.slice(0,16)).getTime()/1000),
                            "invalidTime":parseInt(new Date(data.time.slice(19,35)).getTime()/1000),
                            "remark":data.remark
                        },
                        rule:{
                            basic:{
                                'feeStart':data.feeStart,
                                'freeDistance':data.freeDistance,
                                'freeTime':data.freeTime
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
                }
                else{
                    layer.msg('时段计费不能为空');
                }
            },
            checkTrue:function(segmentData){
                var flag = false;
                // segmentData.forEach(item=>{
                //     if(item.feePerKilometer && item.feePerMinute){
                //         flag = true;//判断标签数组中的值是否存在，若存在且不为空，则返回true
                //         return false; //此返回false是结束each遍历
                //     }
                // })
                $(segmentData).each(function(k,v){
                    if(v.feePerKilometer && v.feePerMinute){
                        flag = true;//判断标签数组中的值是否存在，若存在且不为空，则返回true
                        return false; //此返回false是结束each遍历
                    }
                })
                return flag;
            },
            updateData:function(data)
            {
                var _this = this;
                $.postApi('/management/v1/charge/pkg/update',{
                    "chargePkgId":chargeAdd.dataObj.id,
                    "carTypeId": parseInt(data.carTypeId),
                    "city": data.city,
                    "feeLongPerKilometer": data.feeLongPerKilometer,
                    // "feePerKilometer": data.feePerKilometer,
                    // "feePerMinute": data.feePerMinute,
                    // "feeStart": data.feeStart,
                    // "freeDistance": data.freeDistance,
                    // "freeLongDistance": data.freeLongDistance,
                    // "freeTime": data.freeTime,
                    "isSegment": 0,
                    "productTypeId": parseInt(data.productTypeId),
                    "segmentTimeEnd": data.segmentTimeEnd,
                    "segmentTimeStart": data.segmentTimeStart,
                    "title": data.title,
                    "userType": parseInt(data.userType)
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
                        // console.log(ruleData);
                        pkgData.effectiveTime=Number(pkgData.effectiveTime)
                        pkgData.invalidTime=Number(pkgData.invalidTime)
                        //content.pkg
                        $('#chargePkgName').val(pkgData.chargePkgName);
                        // $('#carTypeId').val(pkgData.carTypeId);
                        // $('#productTypeId').val(pkgData.productTypeId);
                        $('#time').val(new Date(pkgData.effectiveTime*1000).Format("yyyy-MM-dd hh:mm")+' - '+new Date(pkgData.invalidTime*1000).Format("yyyy-MM-dd hh:mm"));
                        $('#dateType').val(pkgData.dateType);
                        $('#founder').val(pkgData.founder);
                        $('#remark').val(pkgData.remark);
                        $('#createTime').val(new Date(pkgData.createTime).Format('yyyy-MM-dd hh:mm:ss'));
                        $('#updateTime').val(new Date(pkgData.updateTime).Format('yyyy-MM-dd hh:mm:ss'));
                        $('#modifier').val(pkgData.modifier);
                       
                        //content.rule.basic
                        chargeAdd.dataObj.basicPriceId = ruleData.basic.basicPriceId;
                        console.log(ruleData.basic);
                        $('#feeStart').val(ruleData.basic.feeStart);
                        $('#freeDistance').val(ruleData.basic.freeDistance);
                        $('#freeTime').val(ruleData.basic.freeTime);

                        //content.rule.longDistanceList
                        var longDistanceStr='';
                        var longDistanceListindex = 0;
                        $(res.content.rule.longDistanceList).each(function(k,v){
                            longDistanceListindex++;
                            var deletebtn = '';
                            if(longDistanceListindex>1){
                                deletebtn = '<button style="margin-right:5px;" type="button" class="layui-btn layui-btn-sm layui-btn-primary jsdelete"><i class="layui-icon" style="margin-right:0px;">&#xe640;</i></button>';
                            }
                            longDistanceStr += '<tr longDistanceId="'+v.longDistancePriceId+'">'+
                            '<td class="label-title" colspan="3">'+deletebtn+'<span class="required-icon">*</span>远途费'+ v.longDistancePriceId +'(¥/km)</td>'+
                            '<td class="label-content" colspan="3"><input class="form-control feeLongPerKilometer"  lay-verify="required"  id="feeLongPerKilometer'+longDistanceListindex+'"  type="text"  name=""></td>'+
                            '<td class="label-title" colspan="3"><span class="required-icon">*</span>远途定义'+ v.longDistancePriceId +'(km)</td>'+
                            '<td class="label-content" colspan="3"><input class="form-control freeLongDistance"  lay-verify="required"  id="freeLongDistance'+longDistanceListindex+'" type="text"  name=""></td></tr>'
                        })
                        $('#longDistanceList').html(longDistanceStr);
                        $('.jsdelete').each(function(){
                            $(this).click(function(){
                                $(this).parents('tr').remove();
                            });
                        });

                        $(res.content.rule.longDistanceList).each(function(v,k){
                            $('#longDistanceList tr[longDistanceId="'+k.longDistancePriceId+'"]').find('.feeLongPerKilometer').val(k.feeLongPerKilometer)
                            $('#longDistanceList tr[longDistanceId="'+k.longDistancePriceId+'"]').find('.freeLongDistance').val(k.freeLongDistance)
                            // $('#discountDetail tr[segmentId="'+k.segmentId+'"]').attr('discountId',k.discountId)
                        })
                        

                        var segmentListStr='';
                        $(res.content.rule.segmentList).each(function(k,v){
                            segmentListStr += `<tr segmentId="${v.segmentId}">
                                <td class="label-title" colspan="4">(${(v.startTime?v.startTime:"")}-${(v.endTime?v.endTime:"")})</td>
                                <td class="label-content" colspan="4"><input class="form-control feePerKilometer"  lay-verify="feeStart"  id="FeePerKilometer${v.segmentId}"  type="text"  name="FeePerKilometer${v.segmentId}"></td>
                                <td class="label-content" colspan="4"><input class="form-control feePerMinute"  lay-verify="priceVerify"  id="FeePerMinute${v.segmentId}"  type="text"  name="FeePerMinute${v.segmentId}"></td>
                            </tr>`
                       })
                        $('#segmentList').html(segmentListStr);

                        $(res.content.rule.segmentList).each(function(v,k){
                            $('#segmentList tr[segmentId="'+k.segmentId+'"]').find('.feePerKilometer').val(k.feePerKilometer)
                            $('#segmentList tr[segmentId="'+k.segmentId+'"]').find('.feePerMinute').val(k.feePerMinute)
                            // $('#discountDetail tr[segmentId="'+k.segmentId+'"]').attr('discountId',k.discountId)
                        })


                        
                        chargeAdd.eventFun.getProductType(res.content);
                        chargeAdd.eventFun.getChargePkgType(res.content);
                        chargeAdd.eventFun.getCitys(res.content);
                        chargeAdd.eventFun.getCarList(res.content);
                        chargeAdd.eventFun.getDateType(res.content);
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
                        if(chargeAdd.dataObj.readonly === 'readonly')
                        {

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
                            $(res.content).each(function(){
                                $('#dateType').append('<input type="checkbox" name="dateType" value="'+this.value+'" title="'+this.name+'" lay-skin="primary">');
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
                         /*   $.appendSelect('dateType',res.content==null?[]:res.content,'value','name',data?data.pkg.dateType:null);
                            form.render('select');
                            if(chargeAdd.dataObj.readonly == 'readonly')
                            {
                                $.replaceSelectByVal([
                                    {
                                        'id':'dateType',
                                        'value':data.pkg.dateType
                                    }
                                ]);
                            }
                            */
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
            getSegmentList:function(checkList,currentVal){//查询时段
                var str='';
                if(cityList.length==0){
                    $('#chooseBox').html('当前城市暂无折扣时段')
                    return false;
                }
                var list= cityList.filter((item)=>{
                    return checkList.indexOf(item.segmentId)!=-1
                });
                newList.sort(function(a,b){
                    return parseInt(a.sort) - parseInt(b.sort);
                });
                console.log(newList);
                $(newList).each(function(k,v){
                //     str+=`<tr segmentId="${v.segmentId}">
                //     <td class="label-title" colspan="4">${v.segmentName}(${(v.startTime?v.startTime:"")}-${(v.endTime?v.endTime:"")})</td>
                //     <td class="label-content" colspan="4"><input class="form-control"  lay-verify="feeStart"  id="FeePerKilometer${v.segmentId}"  type="text"  name="FeePerKilometer${v.segmentId}"></td>
                //     <td class="label-content" colspan="4"><input class="form-control"  lay-verify="feeStart"  id="FeePerMinute${v.segmentId}"  type="text"  name="FeePerMinute${v.segmentId}"></td>
                // </tr>`
                        str+='<tr segmentId="'+v.segmentId+'">'+
                        '<td class="label-title" colspan="4">'+v.segmentName+'('+(v.startTime?v.startTime:"")+'-'+(v.endTime?v.endTime:"")+')</td>'+
                        '<td class="label-content" colspan="4"><input class="form-control"  lay-verify="priceVerify"  id="FeePerKilometer'+v.segmentId+'"  type="text"  name="FeePerKilometer'+v.segmentId+'"></td>'+
                        '<td class="label-content" colspan="4"><input class="form-control"  lay-verify="priceVerify"  id="FeePerMinute'+v.segmentId+'"  type="text"  name="FeePerMinute'+v.segmentId+'"></td>'+
                    '</tr>'
                })
                $('#segmentList').html(str);
                    
            },
            // 校验时间段
            vaildEffectDateArray:function(obj,effectDateArray){
                var effectDate=obj.startTime;
                var loseEffectDate=obj.endTime;
                if(effectDateArray.length>0){
                    for(var i=0;i<effectDateArray.length;i++){
                        var tmp=effectDateArray[i];
                        var startTime=tmp.startTime;
                        var endTime=tmp.endTime;
                        if(typeof startTime =='undefined' || typeof endTime == 'undefined') continue;
                        if((effectDate>=startTime&&effectDate<=endTime)||(loseEffectDate>=startTime&&loseEffectDate<=endTime)){
                            //生效时间和失效时间与已有的时间段有交集
                            return false;
                        }
                        if(effectDate<=startTime&&loseEffectDate>=endTime){
                            //生效时间和失效时间把已有的时间段包含在内
                            return false;
                        }
                    }
                }
                return true;
            },
            getchooseList:function(){//查询时段
                var _this = this;

                if($('#city').val() == '')
                {
                    layer.msg('请先选择生效城市');
                    return;
                }

                $.postApi('/management/v1/charge/cache/segment/list',{
                    "cityCode": $('#city').val()
                },function(res)
                {
                    if(res.code == 0)
                    {
                        if(!$('#chooseBox').attr('cityId'))
                        {
                            $('#chooseBox').attr('cityId',$('#city').val());
                        }
                        var str='';
                        if(res.content.length==0){
                            $('#chooseBox').html('当前城市暂无折扣时段')
                            return false;
                        }
                        cityList = res.content;
                        $(res.content).each(function(k,v){
                            if($('#chargePkgType').val()=='0' && v.segmentName=='平峰'){
                                // str+=` <tr><td class="label-title" colspan="4"><input name="cityTime" type="checkbox" lay-skin="primary" lay-filter="c_one" value="${v.segmentId}" checked disabled>${v.segmentName}(${(v.startTime?v.startTime:"")}-${(v.endTime?v.endTime:"")})</td></tr>`
                                str+='<tr><td class="label-title" colspan="4"><input name="cityTime" type="checkbox" lay-skin="primary" lay-filter="c_one" value="'+v.segmentId+'" checked disabled>'+v.segmentName+'('+(v.startTime?v.startTime:"")+'-'+(v.endTime?v.endTime:"")+')</td></tr>'
                            }
                            else{
                                // str+=` <tr><td class="label-title" colspan="4"><input name="cityTime" type="checkbox" lay-skin="primary" lay-filter="c_one" value="${v.segmentId}">${v.segmentName}(${(v.startTime?v.startTime:"")}-${(v.endTime?v.endTime:"")})</td></tr>`
                                str+='<tr><td class="label-title" colspan="4"><input name="cityTime" type="checkbox" lay-skin="primary" lay-filter="c_one" value="'+v.segmentId+'">'+v.segmentName+'('+(v.startTime?v.startTime:"")+'-'+(v.endTime?v.endTime:"")+')</td></tr>'
                            }
                        })
                        
                        $('#chooseBox').html(str);
                        form.render();
                        var str=''
                        var info=document.getElementsByName("cityTime");
                        var checkList=[];
                        for(k in info){
                            if(info[k].checked){
                                checkList.push(info[k].value)
                            }
                        }
                        newList= cityList.filter((item)=>{
                            return checkList.indexOf(item.segmentId)!=-1
                        })
                        $(newList).each(function(k,v){
                        //     str+=`<tr segmentId="${v.segmentId}">
                        //     <td class="label-title" colspan="4">${v.segmentName}(${(v.startTime?v.startTime:"")}-${(v.endTime?v.endTime:"")})</td>
                        //     <td class="label-content" colspan="4"><input class="form-control"  lay-verify="priceVerify"  id="FeePerKilometer${v.segmentId}"  type="text"  name="FeePerKilometer${v.segmentId}"></td>
                        //     <td class="label-content" colspan="4"><input class="form-control"  lay-verify="priceVerify"  id="FeePerMinute${v.segmentId}"  type="text"  name="FeePerMinute${v.segmentId}"></td>
                        // </tr>`
                                str+='<tr segmentId="'+v.segmentId+'">'+
                                '<td class="label-title" colspan="4">'+v.segmentName+'('+(v.startTime?v.startTime:"")+'-'+(v.endTime?v.endTime:"")+')</td>'+
                                '<td class="label-content" colspan="4"><input class="form-control"  lay-verify="priceVerify"  id="FeePerKilometer'+v.segmentId+'"  type="text"  name="FeePerKilometer'+v.segmentId+'"></td>'+
                                '<td class="label-content" colspan="4"><input class="form-control"  lay-verify="priceVerify"  id="FeePerMinute'+v.segmentId+'"  type="text"  name="FeePerMinute'+v.segmentId+'"></td>'+
                            '</tr>'
                        });
                        $('#segmentList').html(str);
                    }
                });
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
                    },
                    priceVerify:function(value,item){
                        if(!value && $(item).parent('td').siblings().find('input').val()){
                            return '不能为空'
                        }
                    },
                    feeStart:function(value)
                    {
                        if(new Number(value) <=0 )
                        {
                            return '计费不可小于或者等于0'
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
                    layer.open({
                        title: '确认',
                        content: '请再次确认内容已填写无误',
                        yes: function(index,layero)
                        {

                            _this.eventFun.subData(data.field);
                        }
                    });
                    return false;
                });
            }
            //更新
            else if(_this.dataObj.type == 'update')
            {
                form.on('submit(*)', function(data){
                    layer.open({
                        title: '确认',
                        content: '请再次确认内容已填写无误',
                        yes: function(index,layero)
                        {
                            _this.eventFun.subData(data.field);
                        }
                    });

                    return false;
                });
            }

        },
        defaultEvent:function()
        {
            var _this = this;
            $('#chooseBox').hide();
            $('#segmentList').html('')
            $('#jsBrandBack').click(function(){
                _this.eventFun.closeLayer();
            });
            $('#chooseTime').click(function(){
                if($('#city').val() == '')
                {
                    layer.msg('请先选择生效城市');
                    return;
                }
                if($('#chargePkgType').val() == '')
                {
                    layer.msg('请先选择属性');
                    return;
                }
                if($('#chooseBox').css('display')=='table-row-group'){
                    $('#chooseBox').hide();
                }
                else{

                    $('#chooseBox').show();
                    _this.eventFun.getchooseList();
                }
            });
            form.on('select(city)', function(data){
                console.log(data.value)
                $('#segmentList').html('')
                $('#chooseBox').html('');
                // _this.eventFun.getchooseList();
                // _this.eventFun.getSegmentList([])
			});
            //form监听事件
            form.on('checkbox(c_one)', function(obj){
                // 当前选中的value值
                var currentVal=$(obj.elem).val();
                var info=document.getElementsByName("cityTime");
                var checkList=[];
                for(k in info){
                    if(info[k].checked){
                        checkList.push(info[k].value)
                    }
                }
                var info=''
                var newObj={}

                $(cityList).each(function(k,v){
                    if(v.segmentId==currentVal){
                        info=v
                        newObj={
                            "startTime":v.startTime,
                            "endTime":v.endTime
                        }
                     }
                })
                if(newList.indexOf(info)==-1){
                    if(_this.eventFun.vaildEffectDateArray(newObj,newList)){
                        newList.push(info)
                    }
                    else{
                        layer.msg('不能同时选择两个有时间重叠的时段');
                    }
                }
                else{
                    newList=newList.filter((item)=>{
                        return item.segmentId!=currentVal
                    })
                }
                _this.eventFun.getSegmentList(checkList,currentVal)
            });
            form.on('select(chargePkgType)', function(data){
                //console.log(data); //得到select原始DOM对象
                if($('#chooseBox').css('display')=='table-row-group'){
                    $('#chooseTime').click();
                }

                $('#segmentList').html('');
                //普通
                if(data.value == '0')
                {

                }
                else if(data.value == '1')
                //特殊
                {

                }
            });
            laydate.render({
                elem: '#time',
                trigger: 'click',
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