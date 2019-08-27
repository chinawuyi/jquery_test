layui.use(['common','form', 'layer', 'dict', 'permission'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var form = layui.form;
    var discountAdd = {
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
            subData:function(data)
            {
                var _this = this;
                
                $.postApi('/management/v1/discount/base/save',{
                    "carTypeId": data.carTypeId,
                    "city": data.city,
                    "operator": sessionStorage.getItem('operator'),
                    "productTypeId":data.productTypeId,
                    "remark":data.remark
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
        },
        /*提交表单*/
        formSub:function()
        {
            var _this = this;
            
            //新创建
            form.on('submit(*)', function(data){

                _this.eventFun.subData(data.field);
                
                return false;
            });

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
            
        }
    };
    //需要优先执行
    discountAdd.defaultEvent();
    discountAdd.formSub();
    discountAdd.getSelectData();
});
