/*初始全局化值*/
var driverLocation,
mapObj,//地图对象
listenMapIcon,//听单图标--1
restMapIcon,//休息图标--0
serviceMapIcon,//服务中图标--2
markersArray=[],
citylocation,//城市中心点
showLayer=true,//是否显示司机信息窗口
setFitView=true,//是否自适应缩放地图
searchFormData={
    "locationCityCode": '440100'
};

layui.use(['form','layer','dict','permission','common'], function() {
    var layer = layui.layer;
    var common = layui.common
    var dict = layui.dict;
    var permission = layui.permission;
    var form = layui.form;
    var dropDownList={
        driverTypeList:{},
        vehicleColorList:{}
    }
    driverLocation= {
        eventFun:{
            getDriverDetail:function(id){
                $.postApi('/management/v1/driverdetail/info/'+id,{
                },function(res)
                {
                    if(res.code == 0)
                    {
                        $('.showInfoLayer').show()
                        for(var i=0;i<$('.showInfoLayer .driverInfo').length;i++){
                            var valName=$('.showInfoLayer .driverInfo').eq(i).attr('valName')
                            $('.showInfoLayer .driverInfo').eq(i).text(res.content[valName])
                            if(valName=='color'){
                                $('.showInfoLayer .driverInfo').eq(i).text(dropDownList.vehicleColorList[res.content[valName]])
                            }else if(valName=='driverType'){
                                $('.showInfoLayer .driverInfo').eq(i).text(dropDownList.driverTypeList[res.content[valName]])
                            }
                        }
                    }
                });
            },
            /*查询坐标*/
            setMapMarks:function(info){
                var markerPolygonobj,markerPolygon=[];
                info.forEach(function(ele,index){
                    if(ele.pointInfo.bind_lat&&ele.pointInfo.bind_lng){
                        var latLng = new qq.maps.LatLng(ele.pointInfo.bind_lat,ele.pointInfo.bind_lng);
                        var marker = new qq.maps.Marker({
                            'position': latLng,
                            'map': mapObj
                        });
                        marker.setTitle(ele.driverId)
                        if(ele.driverStatus==0){
                            marker.setIcon(restMapIcon)
                        }else if(ele.driverStatus==1){
                            marker.setIcon(listenMapIcon)
                        }else if(ele.driverStatus==2||ele.driverStatus==100){
                            marker.setIcon(serviceMapIcon)
                        }
                        markersArray.push(marker)
                        markerPolygon.push(latLng)
                        qq.maps.event.addListener(marker, 'click', function() {
                            showLayer=true                    
                            driverLocation.eventFun.getDriverDetail(marker.getTitle())
                            mapObj.setCenter(marker.getPosition())                        
                        });
                    }
                })
                if(!setFitView){return false}

                //根据点设置折线
                //构造一个点使成为区域
                if(markerPolygon.length==2){
                    markerPolygon.push(new qq.maps.LatLng(markerPolygon[0].lat-0.0002,markerPolygon[0].lng-0.0002))
                }
                markerPolygonobj=new qq.maps.Polyline({
                    path: markerPolygon,
                    strokeWeight: 5,
                    mapObj
                });
                if(markerPolygon.length==1){
                    
                    mapObj.setCenter(markerPolygon[0])
                   
                }else if(markerPolygon.length>2){
                    mapObj.fitBounds(markerPolygonobj.getBounds())
                }
            }
        },
        getSelectData:function(){
            var _this=this
            /*城市*/
            $.postApi('/management/v1/businesscity/cityList',{
                "type": "2"
            },function(res)
            {
                if(res.code == 0)
                {
                    $.appendSelect('locationCityCode',res.content,'code','name','440100');
                    $.appendSelect('srvCityCode',res.content,'code','name');
                    form.render('select');
                    driverLocation.getData(driverLocation.eventFun.setMapMarks)
                }
            });
            /*司机类型*/
            $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                "categoryCode": "DRIVER_TYPE"
            },function(res)
            {
                if(res.code == 0)
                {
                    res.content.forEach(function(ele){                       
                        dropDownList.driverTypeList[ele.value]=ele.name
                    })
                }
            });
            /*颜色*/
            $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                "categoryCode": "VEHICLE_COLOR"
            },function(res)
            {
                if(res.code == 0)
                {
                    res.content.forEach(function(ele){                       
                        dropDownList.vehicleColorList[ele.value]=ele.name
                    })
                }
            });
        },
        defaultEvent:function()
        {
            $('#searchBt').click(function(){
                showLayer=false
                setFitView=true
                searchFormData={//记录当前筛选条件
                    "locationCityCode": $('#locationCityCode').val(),
                    "srvCityCode": $('#srvCityCode').val()
                }
                driverLocation.getData(driverLocation.eventFun.setMapMarks)
            });
            $('.close').click(function(){
                $('.showInfoLayer').hide()
            })
        },
        getData:function(callBack)
        {
            if (markersArray) {
                for (i in markersArray) {
                    markersArray[i].setMap(null);
                }
                markersArray.length = 0;
                /*定时刷新不隐藏司机layer，点击搜索隐藏layer*/
                if(!showLayer){
                    $('.showInfoLayer').hide()
                }
                
            }
            $.postApi('/management/v1/lbs/driver/track',searchFormData,function(res)
            {
                if(res.code == 0)
                {
                    if(res.content.data){
                        callBack(res.content.data)
                    }else{//无数据
                        $('#srvCityCode').val()&&setFitView?citylocation.searchCityByName($('#srvCityCode option:selected').text()):"";
                    }                   
                }
            });
        },

    };
    driverLocation.defaultEvent();
    driverLocation.getSelectData()
});
//dom加载完后执行
$(function(){
    $('#mapCont').height($(window).height()-58)
    $(window).resize(function() {
        $('#mapCont').height($(window).height()-58)
      });
    
})

//最后执行
window.onload=function(){
    /*地图对象初始化*/
    mapObj = new qq.maps.Map(document.getElementById('mapCont'),{
        'mapTypeId':"roadmap",
        'center': new qq.maps.LatLng(23.11680906626857,113.33007728328984),
        'zoom':14
    });
    /*操作过地图 则不自适应缩放*/
    qq.maps.event.addListener(mapObj,'center_changed',
        function(event) {
            setFitView=false
        }
    );
        
    /*创建不同状态的图标*/
    //自定义图标的属性
    var anchor = new qq.maps.Point(0, 39),
    size = new qq.maps.Size(40, 40),
    origin = new qq.maps.Point(0, 0);
    //听单图标--1
    listenMapIcon=new qq.maps.MarkerImage("../../img/driver/listenMapIcon.png",size,origin,null,size)
    //休息图标--0
    restMapIcon=new qq.maps.MarkerImage("../../img/driver/restMapIcon.png",size,origin,null,size),
    //服务中图标--2
    serviceMapIcon=new qq.maps.MarkerImage("../../img/driver/serviceMapIcon.png",size,origin,null,size);
    setInterval(function(){
        driverLocation.getData(driverLocation.eventFun.setMapMarks)
       }, 5000);
    
    //设置城市信息查询服务
    citylocation = new qq.maps.CityService();
    //设置请求成功的回调函数
    citylocation.setComplete(function(results) {
        mapObj.setCenter(results.detail.latLng);
    });
    citylocation.setError(function() {//查询城市信息出错
        
    });
    
    
}