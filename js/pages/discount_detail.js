layui.use(['common','form', 'layer', 'dict', 'permission','element','validate'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var element=layui.element;
    var dict = layui.dict;
    var permission = layui.permission;
    var validate=layui.validate;
    var form = layui.form;
    var discountDetail = {
        discountType:'save',
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
            /*创建优惠券模板*/
            subData:function(updata,savedata)
            {
                var _this = this;
                if(updata.length>0){//更新
                    $.postApi('/management/v1/discount/update',{
                        "discountBasicId":discountDetail.dataObj.id,
                        "discountList": updata,
                        "operator": sessionStorage.getItem('operator')
                    },function(res)
                    {
                        if(res.code == 0)
                        {
                            layer.msg(res.message);
                            window.setTimeout(function(){
                                
                                parent.window.$('#searchBt').click();
                            },1000);
    
                        }
                    });
                }
                if(savedata.length>0){//新增
                    $.postApi('/management/v1/discount/save',{
                        "discountBasicId":discountDetail.dataObj.id,
                        "discountList": savedata,
                        "operator": sessionStorage.getItem('operator')
                    },function(res)
                    {
                        if(res.code == 0)
                        {
                            layer.msg(res.message);
                            window.setTimeout(function(){
                                parent.window.$('#searchBt').click();
                            },1000);
    
                        }
                    });
                }
                
            },
            getDetail:function(){//查询
                $.postApi('/management/v1/discount/list',{
                    "discountBasicId":$.getUrlData().id,
                    "operator":sessionStorage.getItem('operator')
                },function(res)
                {
                    if(res.code == 0)
                    {
                        if(res.content.length>0){//已有折扣详情信息
                            discountType='update'
                            $(res.content).each(function(v,k){
                                $('#discountDetail tr[segmentId="'+k.segmentId+'"]').find('.discount').val(k.discount)
                                $('#discountDetail tr[segmentId="'+k.segmentId+'"]').find('.discountMaxFee').val(k.discountMaxFee)
                                $('#discountDetail tr[segmentId="'+k.segmentId+'"]').attr('discountId',k.discountId)
                            })
                            
                        }else{//无折扣信息
                            discountType='save'
                        }
                    }
                });
            },
            getSegmentList:function(){//查询时段
                $.postApi('/management/v1/charge/cache/segment/list',{
                    "cityCode": $.getUrlData().city
                },function(res)
                {
                    if(res.code == 0)
                    {
                        var str=''
                        if(res.content.length==0){
                            $('#discountDetail').html('当前城市暂无折扣时段')
                            return false;
                        }
                        $(res.content).each(function(k,v){
                            str+='<tr segmentId="'+v.segmentId+'"><td class="label-title">'+v.segmentName+'('+(v.startTime?v.startTime:"")+'-'+(v.endTime?v.endTime:"")+')'+':</td>'+
                                '<td class="label-content"><input class="form-control discount" placeholder="" type="text" id="" name="" lay-verify="checkDiscount"/>'+
                                '<div class="layui-form-mid layui-word-aux">折</div></td>'+
                                '<td class="label-title">最高不超过:</td><td class="label-content">'+
                                '<input class="form-control discountMaxFee" placeholder="" type="text" id="" name="" lay-verify="checkInter"/>'+
                                '<div class="layui-form-mid layui-word-aux">元</div></td></tr>'
                        })
                        
                        $('#discountDetail').html(str)
                        discountDetail.eventFun.getDetail()
                        form.render()
                    }
                });
            },
            getUrlData:function(){
                var urlData = $.getUrlData();
                if(urlData)
                {
                    discountDetail.dataObj.id = urlData.id;
                    var discountDetailData=parent.window.discountDetailData
                    form.val("discountBase",{
                        carTypeId:discountDetailData.carTypeId,
                        city:discountDetailData.city,
                        remark:discountDetailData.remark,
                        productTypeId:discountDetailData.productTypeId
                    })
                    form.render();
                    
                }
            },
            uploadBaseData:function(data){
                $.postApi('/management/v1/discount/base/update',{
                    "carTypeId":data.carTypeId,
                    "city": data.city,
                    "discountBasicId":$.getUrlData().id,
                    "operator": sessionStorage.getItem('operator'),
                    "productTypeId":data.productTypeId,
                    "remark": data.data
                },function(res)
                {
                    if(res.code == 0)
                    {
                        layer.msg('折扣基本信息更新: '+res.message)
                        parent.window.$('#searchBt').click();
                    }
                });
            }
        },
        /*获取下拉菜单数据*/
        getSelectData:function(){
            var _this=this
            /**车型列表 */
            $.postApi('/management/v1/cartype/list2',{
                "status": 1
            },function(res)
            {
                if(res.code == 0)
                {
                    $.appendSelect('carTypeId',res.content,'carTypeId','name');
                    form.render('select');
                    discountDetail.eventFun.getUrlData();
                }
            });
            /*业务城市*/
            $.postApi('/management/v1/businesscity/cityList',{
                type:'2'
            },function(res)
            {
                if(res.code == 0)
                {
                    $.appendSelect('city',res.content,'code','name');
                    form.render('select');
                    discountDetail.eventFun.getUrlData();
                }
            });
            /**产品类型 */
            $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                "categoryCode": "PRODUCT_TYPE"
            },function(res)
            {
                if(res.code == 0)
                {
                    $.appendSelect('productTypeId',res.content,'value','name');
                    form.render('select');
                    discountDetail.eventFun.getUrlData();
                }
            });
        },
        /*提交表单*/
        formSub:function()
        {
            var _this = this;
            form.on('submit(discountBase)',function(data){
                _this.eventFun.uploadBaseData(data.field);
                return false;
            })
            form.on('submit(discountDetail)',function(data){
                var updataDiscountList=[],saveDiscountList=[];
                $('#discountDetail tr').each(function(){
                    if($(this).find('.discount').val()){//有值
                        if($(this).attr('discountId')){//更新
                            updataDiscountList.push({
                                "discount":$(this).find('.discount').val(),
                                "discountBasicId": discountDetail.dataObj.id,
                                "discountMaxFee": $(this).find('.discountMaxFee').val(),
                                "segmentId":$(this).attr('segmentId'),
                                "discountId":$(this).attr('discountId')
                            })
                        }else{
                            saveDiscountList.push({
                                "discount":$(this).find('.discount').val(),
                                "discountBasicId": discountDetail.dataObj.id,
                                "discountMaxFee": $(this).find('.discountMaxFee').val(),
                                "segmentId":$(this).attr('segmentId')
                            })
                        }
                        
                    }
                    
                })
                if(updataDiscountList.length==0&&saveDiscountList==0){
                    layer.msg('请先填写折扣详情信息')
                }else{
                    _this.eventFun.subData(updataDiscountList,saveDiscountList);
                }
                
                

                return false;
            })

        },
        /*默认方法*/
        defaultEvent:function()
        {
            var _this = this;
            //返回
            $('#jsBrandBack').click(function(){
                _this.eventFun.closeLayer();
            });
            
        }
    };
    //需要优先执行
    
    discountDetail.getSelectData();
    discountDetail.defaultEvent();
    discountDetail.formSub();
    validate.verify()
    discountDetail.eventFun.getSegmentList();
});
