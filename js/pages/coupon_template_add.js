layui.use(['common','form', 'layer','laydate', 'dict', 'permission'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var form = layui.form;
    var laydate = layui.laydate;
    layui.sessionData('checkedCity', null);//初始化选择城市
    layui.sessionData('checkedCarType', null);//初始化选择车型
    var couponTemplateAdd = {
        photo:'',
        dataObj:{
            'id':'',
            'type':'new',
            'readonly':''
        },
        eventFun:{
            addLayer:function(options,titleName)
            {
                var action='./selectCouponData.html'
                if(options)
                {
                    action = $.addUrlPro(action,options);
                }
                layer.open({
                    type: 2,
                    title:titleName,
                    content: action,
                    area: ['700px', ($(window).height()-80)+'px'],
                    maxmin: true
                });
            },
            closeLayer:function()
            {
                var index = parent.layer.getFrameIndex(window.name);
                parent.layer.close(index);
            },
            /*创建优惠券模板*/
            subData:function(data,p_val,p_val1)
            {
                var _this = this;
                
                $.postApi('/management/v1/coupon/rule/save',{
                    "carTypeIdList": data.carTypeIdList,//车型ID列表,逗号分隔
                    "cityList": data.cityList,//城市简码列表，逗号分隔
                    "couponName": data.couponName,//优惠券名称
                    "couponType": data.couponType,//优惠券类型：1 免单 2 满减 3 折扣 4 代金券
                    "couponValue": $('#couponType'+data.couponType+' input[name="couponValue"]').val(),//优惠券面额/折扣 折扣为1-100
                    "delayDay": data.delayDay,//生效延迟的天数
                    "effectiveTime": data.effectiveTime,//有效天数
                    "endTime": data.endTime?new Date(data.endTime).getTime()/1000:'',//优惠券结束时间
                    "limitAmount": $('#couponType'+data.couponType+' input[name="limitAmount"]').val(),//额度限制, 单位:元
                    "mode": data.mode,//1 没有限制 2. 有效天数，从发券开始, 3. 有效日期
                    "operator": sessionStorage.getItem('operator'),
                    "platformList":p_val1,//平台列表，逗号分隔
                    "productTypeIdList": p_val,//产品ID列表，逗号分隔
                    "remark": data.remark,
                    "startTime": data.startTime?new Date(data.startTime).getTime()/1000:'',//优惠券开始时间
                    "totalQuantity": data.totalQuantity//
                },function(res)
                {
                    if(res.code == 0)
                    {
                        layer.msg(res.message);
                        window.setTimeout(function(){
                            _this.closeLayer()
                            parent.window.$('#searchBt').click();                            
                        },1000);

                    }
                });
            },
            /*修改司机信息*/
            updateData:function(data,val)
            {
                var _this = this;
                
                $.postApi('/management/v1/coupon/rule/updateDiscountValue',{
                    couponRuleId:couponTemplateAdd.dataObj.id,
                    operator:sessionStorage.getItem('operator'),
                    couponValue:$('#couponType'+data.couponType+' input[name="couponValue"]').val(),
                    limitAmount:$('#couponType'+data.couponType+' input[name="limitAmount"]').val()
                                        
                },function(res)
                {
                    if(res.code == 0)
                    {
                        layer.msg(res.message);
                        window.setTimeout(function(){
                            _this.closeLayer()
                            parent.window.$('#searchBt').click();                            
                        },1000);
                    }
                });
            },
            /*根据id查询司机*/
            getData:function()
            {
                var _this = this;
                $.postApi('/management/v1/coupon/rule/query/info',{
                    couponRuleId:couponTemplateAdd.dataObj.id
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
                                if(attr=='endTime'||attr=='startTime'){
                                    inputDom[i].value=formData[attr]?new Date(formData[attr]*1000).Format('yyyy-MM-dd hh:mm:ss'):""
                                }else{
                                    inputDom[i].value=formData[attr]
                                }
                            }
                        }
                        //显示对应的优惠券
                        $('#couponType'+formData.couponType).show();
                        $('#couponType'+formData.couponType+' input[name="limitAmount"]').val(formData.limitAmount).removeClass('layui-disabled').removeAttr('readonly');
                        $('#couponType'+formData.couponType+' input[name="couponValue"]').val(formData.couponValue).removeClass('layui-disabled').removeAttr('readonly');
                        
                        //显示对应的到期类型

                        if(formData.mode=='3'){//失效时间
                            $('#endTime').attr('lay-verify','required');
                            $('.endTime').show();
                        }else if(formData.mode=='2'){//有效天数
                            $('#effectiveTime').attr('lay-verify','required')
                            $('.effectiveTime').show()
                        }

                        /**设置勾选的车型 */
                        formData.platformList.split(",").forEach(function(ele){
                            $('input[name="platformList"]').each(function(){ 
                                if($(this).val()==ele){
                                    $(this).attr("checked",true)
                                }
                            });
                        })
                        formData.productTypeIdList.split(",").forEach(function(ele){
                            $('input[name="productTypeIdList"]').each(function(){ 
                                if($(this).val()==ele){
                                    $(this).attr("checked",true)
                                }
                            });
                        })
                        form.render('checkbox');
                        form.render('select');
                    }
                });
            },
            getUrlData:function()
            {
                var urlData = $.getUrlData();
                if(urlData)
                {
                    couponTemplateAdd.dataObj.id = urlData.id;
                    couponTemplateAdd.dataObj.readonly = urlData.readonly;
                    couponTemplateAdd.dataObj.type = 'update';
                    
                }
                /*判断是预览还是编辑*/
                if(couponTemplateAdd.dataObj.id)
                {
                    $('input,textarea').addClass('layui-disabled').attr('readonly','readonly');
                    $('select,input[type="checkbox"]').addClass('layui-disabled').attr('disabled','disabled');
                    $('.my_file_btn').addClass('layui-btn-disabled')                 
                }
            },
        },
        /*提交表单*/
        formSub:function()
        {
            var _this = this;
            
            //新创建
            if(_this.dataObj.type == 'new')
            {
                form.on('submit(*)', function(data){
                    var productTypeIdList=[],platformList=[]
                    $('input:checkbox[name="productTypeIdList"]:checked').each(function(){
                        productTypeIdList.push($(this).val())
                        
                    })
                    $('input:checkbox[name="platformList"]:checked').each(function(){
                        platformList.push($(this).val())
                        
                    })
                    _this.eventFun.subData(data.field,productTypeIdList.toString(),platformList.toString());
                    
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
            //选择优惠券类型
            form.on('select(couponType)', function(data){ 
                $('.couponType input').removeAttr('lay-verify')
                $('#couponType'+data.value+' input').attr('lay-verify','required|number')             
                if(data.value=='1'){//免单
                    $('.couponType').hide()
                    $('#couponType1').show()
                }else if(data.value=='2'){//满减
                    $('.couponType').hide()
                    $('#couponType2').show()
                }else if(data.value=='3'){//折扣
                    $('.couponType').hide()
                    $('#couponType3').show()
                    $('#couponType3 input[name="couponValue3"]').attr('lay-verify','required|number|limitMax')
                }else if(data.value=='4'){//代金券
                    $('.couponType').hide()
                    $('#couponType4').show()
                }else{
                    $('.couponType').hide()
                }
                
              });
              //选择优惠券失效类型
            form.on('select(mode)', function(data){                
                if(data.value=='1'){//无限制
                    $('.invalidType').hide();
                    $('.invalidTypeAttr').removeAttr('lay-verify')
                }else if(data.value=='3'){//失效时间
                    $('.invalidType').hide();
                    $('.invalidTypeAttr').removeAttr('lay-verify')
                    $('#endTime').attr('lay-verify','required');
                    $('.endTime').show();
                }else if(data.value=='2'){//有效天数
                    $('.invalidType').hide();
                    $('.invalidTypeAttr').removeAttr('lay-verify')
                    $('#effectiveTime').attr('lay-verify','required')
                    $('.effectiveTime').show()
                }
              });
              form.verify({
                limitMax: function(value, item){ 
                    if(Number(value)>100||Number(value)<10){
                      return '折扣必须大于10小于100';
                    }
                  }
            });

        },
        /*获取下拉菜单数据*/
        getSelectData:function(){
            var _this=this
            /*业务城市*/
            $.postApi('/management/v1/businesscity/cityList',{
                type:'2'
            },function(res)
            {
                if(res.code == 0)
                {
                    $.appendSelect('city',res.content,'code','name');
                    form.render('select');
                }
            });
            /*优惠券失效类型*/
            $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                "categoryCode": "COUPON_INVALID_TYPE"
            },function(res)
            {
                if(res.code == 0)
                {
                    $.appendSelect('mode',res.content,'value','name');
                    form.render('select');
                }
            });
            /*优惠券类型*/
            $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                "categoryCode": "COUPON_TYPE"
            },function(res)
            {
                if(res.code == 0)
                {
                    $.appendSelect('couponType',res.content,'value','name');
                    form.render('select');
                }
            });
            /**平台类型 */
            $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                "categoryCode": "PLATFORM_TYPE"
            },function(res)
            {
                if(res.code == 0)
                {
                    var str=''
                    res.content.forEach(function(ele,index){
                        str+='<input type="checkbox" name="platformList" title="'+ele.name+'" lay-skin="primary" value="'+ele.value+'" '+($.getUrlData().id?'disabled':'')+'> '
                    })
                    $("#platformList").append(str)
                    form.render('checkbox');
                }
            });
            /**产品类型 */
            $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                "categoryCode": "PRODUCT_TYPE"
            },function(res)
            {
                if(res.code == 0)
                {
                    var str=''
                    res.content.forEach(function(ele,index){
                        str+='<input type="checkbox" name="productTypeIdList" title="'+ele.name+'" lay-skin="primary" value="'+ele.value+'" '+($.getUrlData().id?'disabled':'')+'> '
                    })
                    $("#productTypeIdList").append(str)
                    form.render('checkbox');

                    if(couponTemplateAdd.dataObj.id){
                        couponTemplateAdd.eventFun.getData();
                    }
                }
            });
        },
        /*默认方法*/
        defaultEvent:function()
        {
            var _this = this;
            //返回
            $('#jsBrandBack').click(function(){
                _this.eventFun.closeLayer();
            });
            //日期控件绑定
            if(!$.getUrlData().id){
                laydate.render({
                    trigger: 'click',
                    elem: '#startTime',
                    type: 'datetime',
                    min:new Date(Date.now()).Format('yyyy-MM-dd hh:mm:ss')
                });
                laydate.render({
                    trigger: 'click',
                    elem: '#endTime',
                    type: 'datetime',
                    min:new Date(Date.now()).Format('yyyy-MM-dd hh:mm:ss')
                });
                //选车型
                $('#carTypeIdList').click(function(){
                    _this.eventFun.addLayer({
                        type:'carTypeIdList',
                        checkData:$('#carTypeIdList').val()
                    },'选择优惠劵模板适用车型')
                });
                //选城市
                $('#cityList').click(function(){
                    _this.eventFun.addLayer({
                        type:'cityList',
                        checkData:$('#cityList').val()
                    },'选择优惠劵模板适用城市')
                })
            }
            
        }
    };
    //需要优先执行
    couponTemplateAdd.eventFun.getUrlData();
    couponTemplateAdd.defaultEvent();
    couponTemplateAdd.formSub();
    couponTemplateAdd.getSelectData();
});
