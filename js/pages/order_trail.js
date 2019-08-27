var mapObj,endIcon,startIcon,vehicleIcon;//地图图标
/**定义页面方法 */
var orderTail={
    dataObj:{},
    eventFun:{
        closeLayer:function()
        {
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);

        },
        getHistoryData:function()
        {
            $.postApi('/management/v1/lbs/search/'+(orderTail.dataObj.status==6?'current':'history'),{
                "orderId":orderTail.dataObj.orderId,
                "track":1
            },function(res)
            {
                if(res.code == 0)
                {
                    var polygonObj,polygonPoint=[];
                    res.content.track.forEach(function(ele){
                        var LatLng=new qq.maps.LatLng(ele.bind_lat,ele.bind_lng)
                        polygonPoint.push(LatLng)
                    });
                    mapObj.setCenter(polygonPoint[0])
                    //起点图标
                    new qq.maps.Marker({
                        'position': polygonPoint[0],
                        'map': mapObj,
                        'icon':startIcon
                    });
                    if(polygonPoint.length==1){//只有一个点不绘线
                        return false
                    }
                    //终点图标
                    var endIconMarker=new qq.maps.Marker({
                        'position': polygonPoint[polygonPoint.length-1],
                        'map': mapObj,
                        'icon':endIcon
                    });
                    //进行中的订单终点图标为小车
                    if(orderTail.dataObj.status==6){
                        endIconMarker.setIcon(vehicleIcon)
                    }
                    polygonObj = new qq.maps.Polyline({
                        map: mapObj,
                        path: polygonPoint,
                        editable: false,
                        strokeWeight:6
                    });
                    
                }
            });
        },
        getUrlData:function()
        {
            var urlData = $.getUrlData();
            if(urlData)
            {
                orderTail.dataObj.orderId = urlData.orderId;
                orderTail.dataObj.status=urlData.status
                this.getHistoryData();
                
            }
        }
    },
}
$(function(){
    $('#mapCont').height($(window).height())
    $(window).resize(function() {
        $('#mapCont').height($(window).height())
      });
    
})
window.onload=function(){
    var anchor = new qq.maps.Point(0, 39),
    size = new qq.maps.Size(40, 40),
    origin = new qq.maps.Point(0, 0);
    /*地图对象初始化*/
    mapObj = new qq.maps.Map(document.getElementById('mapCont'),{
        'mapTypeId':"roadmap",
        'center': new qq.maps.LatLng(23.11680906626857,113.33007728328984),
        'zoom':14
    });  
    endIcon=new qq.maps.MarkerImage("../../img/order/endIcon.png",size,origin,null,size)
    startIcon=new qq.maps.MarkerImage("../../img/order/startIcon.png",size,origin,null,size)
    vehicleIcon=new qq.maps.MarkerImage("../../img/driver/serviceMapIcon.png",size,origin,null,size);
    layui.use(['common'], function() {   
        orderTail.eventFun.getUrlData()
    })
}