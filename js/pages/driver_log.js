layui.use(['common','table', 'layer', 'dict', 'permission','laydate','form'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var laydate=layui.laydate;
    var dict = layui.dict;
    var permission = layui.permission;
    var table = layui.table;
    var form=layui.form;

    var driverList = {
        tableObj:null,
        eventFun:{
        },
        searchEvent:function()
        {
            var changeDate=$('#changeDate').val();
            this.tableObj.reload({
                where:{
                    changeDateEnd:changeDate?new Date(changeDate.split("~")[1]).getTime():null,
                    changeDateStart:changeDate?new Date(changeDate.split("~")[0]).getTime():null,
                    statusChangeSource:$('#statusChangeSource option:selected').text()=='请选择'?null:$('#statusChangeSource option:selected').text(),
                    statusChangeNew:$('#statusChangeNew option:selected').text()=='请选择'?null:$('#statusChangeNew option:selected').text(),
                    driverId:$.getUrlData().id
                },
                page: {
                    curr: 1
                  }
            });
        },
        defaultEvent:function()
        {
            var _this = this;
            $('#searchBt').click(function(){
                _this.searchEvent();
            });
            laydate.render({ 
                elem: '#changeDate'
                ,trigger: 'click'
                ,type: 'datetime'
                ,range: '~' 
              });
        },
        getData:function()
        {
            this.tableObj = table.render({
                elem: '#demo',
                height: 530,
                url: '/management/v1/driver/status/logs/list',
                method:'post',
                contentType:"application/json",
                page: true,
                where:{
                    driverId:$.getUrlData().id
                },
                request: {
                    pageName: 'pageIndex',
                    limitName: 'pageSize'
                },
                parseData: function(res)
                {
                    return {
                        "code": res.code, //解析接口状态
                        "msg": res.message, //解析提示文本
                        "count": res.content.total, //解析数据长度
                        "data": res.content.data //解析数据列表
                    };
                },
                cols: [[
                    {field: 'statusChange', title: '状态变化',sort: false,align: 'right'},
                    {field: 'changeDate', title: '变化时间',sort: false,align: 'right',templet:function(d){
                        return new Date(Number(d.changeDate)).Format('yyyy-MM-dd hh:mm:ss')
                    }},
                    {field: 'operator', title: '变化操作',sort: false,align: 'right',templet:function(d){
                        return d.operator+'操作'
                    }},
                    {field: 'reason', title: '操作原因',sort: false,align: 'right'},
                    {field: 'result', title: '变化结果',sort: false,align: 'right'},
                    {field: 'remark', title: '备注',sort: false,align: 'right'}
                ]],
                toolbar: '#toolbarDemo'
            });
            
        },
        getSelectData:function(){
            var _this=this
            /*司机类型*/
            $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                "categoryCode": "DRIVER_STATUS"
            },function(res)
            {
                if(res.code == 0)
                {
                    $.appendSelect('statusChangeSource',res.content,'value','name');
                    $.appendSelect('statusChangeNew',res.content,'value','name');
                    form.render();
                }
            });
        },
    };
    
    driverList.defaultEvent();
    driverList.getData();
    driverList.getSelectData();
});