layui.use(['common','form', 'layer','element', 'dict', 'permission'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var element = layui.element;
    var driverInfo = {
        dataObj:{
            'id':'',
            'type':'new',
            'readonly':'',
            'carId':''
        },
        eventFun:{
            addLayer:function(action,options,titleName)
            {
                if(options)
                {
                    action = $.addUrlPro(action,options);
                }
                layer.open({
                    type: 2,
                    title:titleName||'司机管理',
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
            getUrlData:function()
            {
                var urlData=window.location.search
                var srcDom=$('.layui-colla-item iframe')
                srcDom.each(function(){
                    $(this).attr('src',$(this).attr('urlPageName')+urlData)
                })

            },
            /**解绑车辆 */
            unBindCar:function(carId,driverId){
                layer.open({
                    title: '车辆解绑确认',
                    content: '确定解绑吗？',
                    yes: function(index,layero){
                        $.postApi('/management/v1/driver/unBindCar',{
                            "carId":carId,
                            "driverId":driverId
                        },function(res){
                            if(res.code == 0){
                                layer.msg('司机已解绑');
                                driverAdd.window.getData()
                            }
                        })
                        layer.close(index);
                    }
                });

            },
        },

        /*默认方法*/
        defaultEvent:function()
        {
            var _this = this;

            $('#jsBrandBack').click(function(){
                _this.eventFun.closeLayer();
            });
        }
    };
    //需要优先执行
    driverInfo.eventFun.getUrlData();
    driverInfo.defaultEvent();
    window.openMsg=layer.msg
    /**子页面信息弹框 */
    window.addParentLayer=driverInfo.eventFun.addLayer;
    window.driverunBindCar=driverInfo.eventFun.unBindCar;
});
