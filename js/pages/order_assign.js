layui.use(['common','table', 'layer', 'dict', 'permission'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var table = layui.table;
    var form = layui.form;
    var dropDownList={
        brandTree:[],
        modelList:[],
        driverGenderList:{}
    }
    var driverList = {
        tableObj:null,
        eventFun:{
            closeLayer:function()
            {
                var index = parent.layer.getFrameIndex(window.name);
                parent.layer.close(index);
            },
            orderAssign:function(data)
            {
                var _this = this;
                $.postApi('/management/v1/orderAssign/assignDriver',{
                    "carTypeIds": $.getUrlData().carTypeIds,
                    "driverAssignList":[
                        {
                            "carId": data.carId,
                            "carTypeId": data.carTypeId,
                            "city": data.city,
                            "driverId": data.driverId,
                            "driverType": data.driverType,
                            "gender": data.gender,
                            "name": data.name,
                            "phone":data.phone
                        }
                    ],
                    "endCity": $.getUrlData().endCity,
                    "orderId": $.getUrlData().orderId,
                    "startCity": $.getUrlData().startCity,
                    "startLatitude": Number($.getUrlData().startLatitude),
                    "startLongitude": Number($.getUrlData().startLongitude),
                },function(res)
                {
                    if(res.code == 0)
                    {
                        layer.msg('指派成功');  
                        window.setTimeout(function(){
                            _this.closeLayer();
                            parent.window.$('#searchBt').click();
                        },1000);
                    }
                });
            },
            verify:function()
                {
                    form.verify({
                        manualRadiusCheck: function(value, item){ 
                            if(Number(value)>2000000000){ 
                              return '输入值不能大于2000000000';
                            }
                          },
                    });
                },
            getSelectData:function(){
                /*性别*/
                $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                    "categoryCode": "GENDER"
                },function(res)
                {
                    if(res.code == 0)
                    {
                        res.content.forEach(function(ele){                       
                            dropDownList.driverGenderList[ele.value]=ele.name
                        })
                    }
                });
            },
        },
        searchEvent:function()
        {
            this.tableObj.reload({
                where:{
                    "carTypeIds": $.getUrlData().carTypeIds,
                    "endCity": $.getUrlData().endCity,
                    "orderId": $.getUrlData().orderId,
                    "startCity": $.getUrlData().startCity,
                    "startLatitude": Number($.getUrlData().startLatitude),
                    "startLongitude": Number($.getUrlData().startLongitude),
                    "manualRadius":$('#manualRadius').val()==''?null:$('#manualRadius').val()
                },
            });
        },
        defaultEvent:function()
        {
            var _this = this;
            $('#searchBt').click(function(){});
            form.on('submit(*)', function(data){
                _this.searchEvent();
                return false;
            });
        },
        getData:function()
        {
            this.tableObj = table.render({
                elem: '#demo',
                height: 500,
                url: '/management/v1/orderAssign/selectDrivers',
                method:'post',
                contentType:"application/json",
                page:false,
                where:{
                    "carTypeIds": $.getUrlData().carTypeIds,
                    "endCity": $.getUrlData().endCity,
                    "orderId": $.getUrlData().orderId,
                    "startCity": $.getUrlData().startCity,
                    "startLatitude": Number($.getUrlData().startLatitude),
                    "startLongitude": Number($.getUrlData().startLongitude)
                },
                request:{
                    pageName: 'pageIndex',
                    limitName: 'manualLimit'
                },
                parseData: function(res)
                {
                    return {
                        "code": res.code, //解析接口状态
                        "msg": res.message, //解析提示文本
                        "count": res.content.total, //解析数据长度
                        "data": res.content //解析数据列表
                    };
                },
                cols: [[
                    {field: 'driverId', title: '司机ID',sort: false,align: 'right'},
                    {field: 'name', title: '司机姓名',sort: false,align: 'right'},
                    {field: 'phone', title: '手机号',sort: false,align: 'right'},
                    {field: 'gender', title: '性别',sort: false,align: 'right',templet:function(d){
                        return d.gender||d.gender==0?dropDownList.driverGenderList[d.gender]:''
                    }},
                    {field: '', title: '操作', width:'100', sort: false,align: 'left',templet: function(d){
                        return '<button class="layui-btn layui-btn-xs" lay-event="ele_show" ><i class="layui-icon">&#xe608;</i> 指派</button>';
                           

                    }}
                ]],
                toolbar: '#toolbarDemo'
            });
        },
        toolBar:function()
        {
            var _this = this;
            table.on('tool(test)', function(obj){
                if(obj.event =='ele_show')
                {
                    layer.open({
                        title: '司机指派确认',
                        content: '确认指派'+obj.data.name+'？',
                        yes: function(index,layer){
                            _this.eventFun.orderAssign(obj.data)
                            layer.close(index);
                          }
                      });
                }
            });
        }
    };

    driverList.defaultEvent();
    driverList.eventFun.verify();
    driverList.eventFun.getSelectData()
    driverList.toolBar();
    driverList.getData();
});