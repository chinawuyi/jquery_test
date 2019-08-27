layui.use(['common','table', 'layer', 'permission','form'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var permission = layui.permission;
    var table = layui.table;
    var form = layui.form
    var orderDashboardChart = echarts.init(document.getElementById('main'));
    var option = {
        tooltip: {
            show: true,
            formatter:function(param){
                var value = param.value;
                return '提单量：12单<br />提单接单率：12%<br />提单成单率：12%'
            }
        },
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            smooth: true,
            symbolSize: 8,
            itemStyle : {  
                normal : {  
                    color:'#009688', 
                    lineStyle:{  
                        color:'#009688'  
                    }  
                }  
            },
        }]
    };
    var orderDashboard = {
        tableObj:null,
        orderStatusList:{},
        statusRefundList:{},
        eventFun:{
        },
        getData:function()
        {
            var _this=this
            this.tableObj = table.render({
                elem: '#orderDashboard',
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
                    {field:'orderId', title: '时间', align: 'center', sort: true},
                    {field:'userPhone', title: '提单量', sort: false},
                    {field:'startLoc', title: '提单接单率',templet:function(d){
                        return '<span>'+d.startCityName+d.startPosition+'</span>'
                    }},
                    {field:'endLoc', title: '提单成单率', align: 'center',templet:function(d){
                        return '<span>'+d.endCityName+d.endPosition+'</span>'
                    }}
                ]]
            });
        },

    };
    orderDashboard.getData();
    orderDashboardChart.setOption(option);
});