layui.use(['common','table', 'layer', 'dict', 'permission','laydate'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var table = layui.table;
    var form = layui.form;
    var laydate=layui.laydate;
    var dropDownList={
        moduleList:{},
        platformList:{}
    }
    var couponTemplate = {
        tableObj:null,
        eventFun:{
            couponStatus:function(data){
                $.postApi('/management/v1/coupon/batch/'+(data.enable=='1'?'disable':'enable'),{
                    "couponBatchId": data.couponBatchId
                },function(res)
                {
                    if(res.code == 0)
                    {
                        layer.msg(data.enable=='1'?'已禁用':'已启用');  
                        $('#searchBt').click()
                    }
                });
            }
        },
        searchEvent:function()
        {
            var timeRang=$("#time").val();
            this.tableObj.reload({
                where:{
                    beginDate:timeRang?timeRang.split('~')[1]:null,
                    couponBatchId:$("#couponBatchId").val()||null,
                    endDate:timeRang?timeRang.split('~')[0]:null,
                    couponRuleId:$.getUrlData().id
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
                trigger: 'click',
                elem: '#time'
                ,type: 'datetime'
                ,range: '~' //或 range: '~' 来自定义分割字符
            });
        },
        getData:function()
        {
            //第一个实例
            this.tableObj = table.render({
                elem: '#demo',
                height: 322,
                url: '/management/v1/coupon/batch/query/paging',
                method:'post',
                contentType:"application/json",
                where:{
                    couponRuleId:$.getUrlData().id
                },
                page: true,
                request: {
                    pageName: 'pageNum',
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
                    {field: 'couponBatchId', title: '批次ID', sort: false},
                    {field: 'updateTime', title: '发放时间',sort: false,templet:function(d){
                            return d.updateTime?new Date(d.updateTime).Format('yyyy-MM-dd hh:mm:ss'):""
                        }},
                    {field: 'count', title: '数量',sort: false},
                    {field: 'operator', title: '发放人',sort: false},
                    {field: 'test', title: '操作',  sort: false,templet: function(d){
                        return '<button class="layui-btn layui-btn-danger layui-btn-xs jsupdate" lay-event="ele_enable" ><i class="layui-icon">'+(d.enable==1?'&#x1006;':'&#xe605;')+'</i> '+(d.enable==1?'禁用':'启用')+'</button>'
                

                    }}
                ]],
                toolbar: '#toolbarDemo'
            });
        },
        toolBar:function()
        {
            var _this = this;
            table.on('tool(test)', function(obj){
                 if(obj.event=='ele_enable'){
                    var statusTxt='启用'
                    if(obj.data.enable==1){
                        statusTxt='禁用'
                    }
                    layer.open({
                        title: '优惠券批次状态确认',
                        content: '确定'+statusTxt+'此优惠券批次吗？',
                        yes: function(index,layero){
                            _this.eventFun.couponStatus(obj.data)
                            layer.close(index);
                          }
                      });
                }
            });
        }
    };

    couponTemplate.defaultEvent();
    couponTemplate.getData();
    couponTemplate.toolBar();
});