layui.use(['common','table', 'layer', 'dict', 'permission'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var table = layui.table;
    var form = layui.form;
    var deviceOperate = {
        tableObj:null,
        dataObj:{
            'deviceId':'',
            'type':'block'
        },
        eventFun:{
            closeLayer:function()
            {
                var index = parent.layer.getFrameIndex(window.name);
                parent.layer.close(index);
                parent.window.$('#searchBt').click();
            },
            subData:function(data)
            {
                var _this = this;
                $.postApi('/management/'+$.BC.V+'/account/device/'+deviceOperate.dataObj.type,{
                    "deviceId": deviceOperate.dataObj.deviceId,
                    "remark": data[deviceOperate.dataObj.type+'remark'],
                },function(res)
                {
                    if(res.code == 0)
                    {
                        if(res.message=='success')
                        {
                            layer.msg("成功");
                        }
                        window.setTimeout(function(){
                            _this.closeLayer();
                        },1000);

                    }
                });
            },
            getUrlData:function()
            {
                var urlData = $.getUrlData();
                if(urlData)
                {
                    deviceOperate.dataObj.deviceId = urlData.deviceId;
                    deviceOperate.dataObj.type = urlData.type;
                    if(deviceOperate.dataObj.type == 'block'){
                        $('#jsBlock').show();
                        $('#jsUnBlock').remove();
                    }else{
                        $('#jsBlock').remove();
                        $('#jsUnBlock').show();
                    }
                    
                    deviceOperate.getData();
                }
            },
        },
        formSub:function()
        {
            var _this = this;
            //解除拉黑
            if(_this.dataObj.type == 'block')
            {
                form.on('submit(*)', function(data){
                    _this.eventFun.subData(data.field);
                    return false;
                });
            }
            //拉黑
            else if(_this.dataObj.type == 'unblock')
            {
                form.on('submit(*)', function(data){
                    _this.eventFun.subData(data.field);
                    return false;
                });
            }

        },
        //获取历史处理记录
        getData:function()
        {
            this.tableObj = table.render({
                elem: '#demo',
                height: 330,
                url: '/management/v1/account/device/listBlockRecord',
                method:'post',
                contentType:"application/json",
                page: true,
                where:{
                    deviceId:$.getUrlData().deviceId,
                },
                request: {
                    pageName: 'pageIndex',
                    limitName: 'pageSize',

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
                    {field: 'timestamp', title: '处理日期',sort: false,align: 'right',templet: function(d){
                        console.log(d.timestamp)
                        return d.timestamp?new Date(parseInt(d.timestamp)).Format('yyyy-MM-dd hh:mm'):'';
                    }},
                    {field: 'operator', title: '处理人',sort: false,align: 'right'},
                    {field: 'blackStatus', title: '处理内容',sort: false,align: 'right',templet: function(d){
                        return d.blackStatus == 'delete' ?'解除拉黑':'拉黑';
                    }},
                    {field: 'remark', title: '备注',sort: false,align: 'right'},
                ]],
            });
        }
    };

    deviceOperate.eventFun.getUrlData();
    deviceOperate.formSub();
});