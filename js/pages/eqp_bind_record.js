layui.use(['common','form', 'table','layer', 'dict', 'permission'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var laydate = layui.laydate;
    var table = layui.table;
    var form = layui.form;
    var eqpBindRecord = {
        tableObj:null,
        dataObj:{
            'deviceId':'',
            'readonly':'',
        },
        eventFun:{
            closeLayer:function()
            {
                var index = parent.layer.getFrameIndex(window.name);
                parent.layer.close(index);

            },
            unbindAccount:function(data)
            {
                let _this = this;
                $.postApi('/management/v1/account/device/unbind',{
                    "deviceId": data.deviceId,
                    "userId": data.userId
                },function(res)
                {
                    if(res.code == 0)
                    {
                        layer.msg(res.message);
                        window.setTimeout(function(){
                            _this.getBindRecord();
                        },1000);

                    }
                });
            },
            getBindRecord:function(){
                let _this = this;
                $.postApi('/management/v1/account/device/listBindRecord', {
                    'deviceId': eqpBindRecord.dataObj.deviceId,
                }, function (res) {
                    if (res.code == 0) {
                       _this.getData(res.content.deviceBindList);
                    }
                })
            },
            getData:function(data)
            {
                this.tableObj = table.render({
                    elem: '#demo',
                    height: 330,
                    data:data,
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
                        // {field: 'phone', title: '账号',sort: false},
                        {field: 'userId', title: '账号',sort: false},
                        {field: 'timestamp', title: '绑定日期',sort: false,templet: function(d){
                            return d.timestamp?new Date(parseInt(d.timestamp)).Format('yyyy-MM-dd hh:mm'):'';
                        }},
                        {field: '', title: '操作',sort: false,templet: function(d){
                            return '<button class="layui-btn layui-btn-xs" lay-event="ele_unbind"  lay-event="show"><i class="layui-icon">&#xe615;</i>解绑</button>';
                        }},
                    ]],
                });
            },
            getUrlData:function()
            {
                var urlData = $.getUrlData();
                if(urlData)
                {
                    eqpBindRecord.dataObj.deviceId = urlData.deviceId;
                    this.getBindRecord();
                }
            }
        },
        defaultEvent:function()
        {
            var _this = this;

        },
        toolBar: function () {
            var _this = this
            table.on('tool(test)', function (obj) {
                if (obj.event == 'ele_unbind') {
                    _this.eventFun.unbindAccount(obj.data)
                } 
            })
        }
    };
    //需要优先执行
    eqpBindRecord.eventFun.getUrlData();
    eqpBindRecord.toolBar();
    // eqpBindRecord.defaultEvent();
    // eqpBindRecord.formSub();
});