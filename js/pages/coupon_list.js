layui.use(['common','table', 'layer', 'dict', 'permission','laydate','form'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var table = layui.table;
    var laydate=layui.laydate;
    var form=layui.form;
    var couponList = {
        tableObj:null,
        eventFun:{
            addLayer:function(action,options)
            {
                if(options)
                {
                    action = $.addUrlPro(action,options);
                }
                layer.open({
                    type: 2,
                    title:'优惠券详情',
                    content: action,
                    area: ['800px', ($(window).height()-40)+'px'],
                    maxmin: true
                });
            },
        },
        searchEvent:function()
        {
            var sendTime=$('#sendTime').val()
            this.tableObj.reload({
                where:{
                    "beginSendTime": sendTime?new Date(sendTime.split('~')[0]).getTime()/1000:null,
                    "couponBatchId": $('#couponBatchId').val()||null,
                    "couponName":$('#couponName').val()||null,
                    "couponRuleId": $('#couponRuleId').val()||null,
                    "couponType": $('#couponType').val()||null,
                    "endSendTime": sendTime?new Date(sendTime.split('~')[1]).getTime()/1000:null,
                    "orderId": $('#orderId').val()||null,
                    "pageNum": $('#pageNum').val()||null,
                    "status": $('#status').val()||null,
                    "userCouponId":$('#userCouponId').val()||null,
                    "userPhone":$('#userPhone').val()||null,
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
                elem: '#sendTime'
                ,type: 'datetime'
                ,range: '~' //或 range: '~' 来自定义分割字符
              });
        },
        getData:function()
        {
            //第一个实例
            this.tableObj = table.render({
                elem: '#demo',
                height: 522,
                url: '/management/v1/coupon/record/query/paging',
                method:'post',
                contentType:"application/json",
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
                    {field: 'userCouponId', title: '券编号',sort: false},
                    {field: 'couponRuleId', title: '优惠券模板号',sort: false},
                    {field: 'couponBatchId', title: '优惠券批次',sort: false},
                    {field: 'couponName', title: '优惠券名称',sort: false},
                    {field: 'orderId', title: '订单号', sort: false},
                    {field: 'userPhone', title: '用户手机号', sort: false},
                    {field: 'couponTypeText', title: '优惠券类型',sort: false},
                    {field: 'sendTime', title: '发放时间',sort: false,templet:function(d){
                            return d.sendTime?new Date(d.sendTime*1000).Format('yyyy-MM-dd hh:mm:ss'):'';
                        }},
                    {field: 'statusText', title: '状态',sort: false},
                    {field: '', title: '操作',sort: false,templet:function(d){
                        return '<button class="layui-btn layui-btn-xs" lay-event="ele_show" ><i class="layui-icon">&#xe615;</i> 查看</button>'
                    }}
                ]],
                toolbar: '#toolbarDemo'
            });
        },
        toolBar:function(){
            table.on('tool(test)', function(obj){
                if(obj.event =='ele_show'){
                    couponList.eventFun.addLayer('./couponList_detail.html',{
                        'id':obj.data.userCouponId,
                    }) 
                }
            })
        },
        getSelectData:function(){
            var _this=this
            /*优惠券类型*/
            $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                "categoryCode": "COUPON_TYPE"
            },function(res)
            {
                if(res.code == 0)
                {
                    $.appendSelect('couponType',res.content,'value','name');
                    form.render('select');
                }
            });
            /*优惠券状态*/
            $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                "categoryCode": "COUPON_TEMPLATE_STATUS"
            },function(res)
            {
                if(res.code == 0)
                {
                    $.appendSelect('status',res.content,'value','name');
                    form.render('select');
                    
                }
            });
        },
    };

    couponList.defaultEvent();
    couponList.getSelectData()
    couponList.getData();
    couponList.toolBar();
});