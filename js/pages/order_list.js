layui.use(['common','table', 'layer', 'permission','form'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var permission = layui.permission;
    var table = layui.table;
    var form = layui.form

    var orderList = {
        tableObj:null,
        orderStatusList:{},
        statusRefundList:{},
        eventFun:{
            editLayer:function(url,options)
            {
                var action = url;
                if(options)
                {
                    action = $.addUrlPro(action,options);
                }
                layer.open({
                    type: 2,
                    title:'订单详情',
                    content: action,
                    area: ['800px', ($(window).height()-100)+'px'],
                    maxmin: true
                });
            },
        },
        defaultEvent:function()
        {
            var _this = this;
            $('#resetform').click(function(){
                orderList.getData();
            });
        },
        formatParams:function(object){
            let tmpObject = {};
            for(let o in object) {
                if(object[o]!='') {
                tmpObject[o] = $.trim(object[o]);
                }
            }
            return tmpObject;
        },
        searchEvent:function()
        {
            let _this=this
            form.on('submit(orderSearch)', function(data){
                _this.tableObj.reload({
                    where:_this.formatParams(data.field),
                    page: {
                        curr: 1
                      }
                });
                return false;
              });
        },
        getSelectData:function(){
            var _this=this
            /*业务城市*/
            $.postApi('/management/v1/businesscity/list',{
                
            },function(res)
            {
                if(res.code == 0)
                {
                    $.appendSelect('startCity',res.content.data,'code','name');
                    form.render('select');
                }
            });
            /*退款状态*/
            $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                "categoryCode": "REFUND_STATUS"
            },function(res)
            {
                if(res.code == 0)
                {
                    $.appendSelect('statusRefund',res.content,'value','name');
                    res.content.forEach(function(ele){                       
                        _this.statusRefundList[ele.value]=ele.name
                    })
                    form.render('select');
                }
            });
            /*产品类型*/
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
            /*订单状态*/
            $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                "categoryCode": "ORDER_STATUS"
            },function(res)
            {
                if(res.code == 0)
                {
                    $.appendSelect('status',res.content,'value','name');
                    res.content.forEach(function(ele){                       
                        _this.orderStatusList[ele.value]=ele.name
                    })
                    form.render('select');
                    /*列表初始化*/
                    orderList.getData();
                }
            });
        },
        getData:function()
        {
            var _this=this
            this.tableObj = table.render({
                elem: '#orderList',
                height: 522,
                url: '/management/v1/orderinfo/queryListByFilter',
                method:'post',
                contentType:"application/json",
                page: true,
                request: {
                    pageName: 'pageIndex',
                    limitName: 'pageSize'
                },
                parseData: function(res){
                    return {
                        "code": res.code,
                        "msg": res.message,
                        "count": res.content.total,
                        "data": res.content.data 
                    };
                },
                cols: [[
                    // {field:'productTypeId', title: '产品', align: 'center', sort: false, },
                    {field:'orderId', title: '订单ID', align: 'center', sort: true},
                    {field:'userPhone', title: '乘车人', sort: false},
                    {field:'startLoc', title: '出发地',templet:function(d){
                        return '<span>'+d.startCityName+d.startPosition+'</span>'
                    }},
                    {field:'endLoc', title: '目的地', align: 'center',templet:function(d){
                        return '<span>'+d.endCityName+d.endPosition+'</span>'
                    }},
                    {field:'timeStart', title: '上车时间', sort: true, align: 'right',templet:function(d){
                        if(d.timeStart){
                            return new Date(d.timeStart*1000).Format('yyyy-MM-dd hh:mm:ss');
                        }else{
                            return ""
                        }
                        
                    }},
                    {field:'timeInit', title: '预定时间', sort: true, align: 'right',templet:function(d){
                        if(d.timeInit){
                            return new Date(d.timeInit*1000).Format('yyyy-MM-dd hh:mm:ss');
                        }else{
                            return ""
                        }
                        
                    }},
                    {field:'driverInfo', title: '司机信息', sort: true, align: 'right',templet:function(d){
                        return '<span>'+d.driverName+d.driverPhone+'</span>'
                    }},
                    {field:'carNumber', title: '车牌号', sort: true, align: 'right'},
                    {field:'status', title: '状态', sort: true, align: 'right',templet:function(d){
                        return d.statusRefund==0?_this.orderStatusList[d.status]:_this.statusRefundList[d.statusRefund]
                    }},
                    {field: '', title: '操作', width:'225', sort: false,templet: function(d){
                        return '<button class="layui-btn layui-btn-xs" lay-event="ele_show" permission="sys:order:querydetail"><i class="layui-icon">&#xe615;</i> 查看</button>' +
                               '<button class="layui-btn layui-btn-xs layui-btn-warm '+((d.status==6||d.status==7||d.status==8||d.status==9)?"":"layui-btn-disabled")+'" permission="sys:sys:order:querydetail"  lay-event="ele_trail" ><i class="layui-icon">&#xe609;</i> 轨迹</button>'+
                               '<button class="layui-btn layui-btn-xs layui-btn-normal '+((d.status==2||d.status==3||d.status==4||d.status==5)?"":"layui-btn-disabled")+'"  permission="sys:order:assigndriver" lay-event="ele_assign" ><i class="layui-icon">&#xe609;</i> 指派</button>';

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
                    _this.eventFun.editLayer('./order_list_view.html',{
                        orderId:obj.data.orderId
                   })
                }else if(obj.event =='ele_trail'){
                    if(obj.data.status==6||obj.data.status==7||obj.data.status==8||obj.data.status==9){
                        _this.eventFun.editLayer('./order_trail.html',{
                            orderId:obj.data.orderId,
                            status:obj.data.status
                       })
                    }else{

                    }
                    
                }else if(obj.event =='ele_assign'){
                    if(obj.data.status==2||obj.data.status==3||obj.data.status==4||obj.data.status==5){
                        _this.eventFun.editLayer('./order_assign.html',{
                            orderId:obj.data.orderId,
                            endCity:obj.data.endCity,
                            startCity:obj.data.startCity,
                            carTypeIds:obj.data.carTypeIds,
                            startLatitude:obj.data.startLatitude,
                            startLongitude:obj.data.startLongitude
                       })
                    }
                }
            });
        }
    };
    
    /*表格工具栏*/
    orderList.toolBar();
    /*搜索*/
    orderList.searchEvent()
    orderList.defaultEvent()
    /*下拉菜单数据*/
    orderList.getSelectData()
});