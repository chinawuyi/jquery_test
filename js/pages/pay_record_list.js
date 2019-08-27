layui.use(['common','table', 'layer', 'dict', 'permission','laydate'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var laydate = layui.laydate;
    var permission = layui.permission;
    var table = layui.table;
    var form = layui.form;
    var dropDownList={
        channel:{},
        reason:{}
    }
    var payList = {
        tableObj:null,
        eventFun:{
            addLayer:function(action,options,titleName)
            {
                if(options)
                {
                    action = $.addUrlPro(action,options);
                }
                layer.open({
                    type: 2,
                    title:titleName?titleName:'账户信息',
                    content: action,
                    area: ['800px', '420px'],
                    maxmin: true
                });
            },
        },
        getSelectData:function(){
            var _this=this
            /*支付渠道*/
            $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                "categoryCode": "PAY_CHANNEL"
            },function(res)
            {
                if(res.code == 0)
                {
                    $.appendSelect('channel',res.content,'value','name');
                    form.render('select');
                    res.content.forEach(function(ele){                       
                        dropDownList.channel[ele.value]=ele.name
                    })
                }
            });
            /*支付变更*/
            $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                "categoryCode": "PAY_STATUS"
            },function(res)
            {
                if(res.code == 0)
                {
                    $.appendSelect('reason',res.content,'value','name');
                    form.render('select');
                    res.content.forEach(function(ele){                       
                        dropDownList.reason[ele.value]=ele.name
                    })
                    payList.getData()
                }
            });
        },
        searchEvent:function(data)
        {
            this.tableObj.reload({
                where:{
                    accountId:data.accountId?data.accountId:null,
                    channel:data.channel?data.channel:null,
                    orderId:data.orderId?data.orderId:null,
                    endRecordTime:data.recordTime?new Date($.trim(data.recordTime.split('至')[1])).getTime()/1000:null,
                    startRecordTime:data.recordTime?new Date($.trim(data.recordTime.split('至')[0])).getTime()/1000:null,
                    tradeNo:data.tradeNo?data.tradeNo:null,
                    transactionId:data.transactionId?data.transactionId:null,
                    userId:data.userId?data.userId:null,
                    reason:data.reason||null
                },
                page: {
                    curr: 1
                  }
            });
        },
        defaultEvent:function()
        {
            var _this = this;
            /**绑定日期插件 */
            laydate.render({ 
                trigger: 'click',
                elem: '#recordTime',
                range: '至' ,
                max:new Date().Format('yyyy-MM-dd'),
                type: 'datetime'
              });
            /**提交表单 */
            form.on('submit(paySearch)', function(data){
                _this.searchEvent(data.field);
                return false;
            });
        },
        getData:function()
        {
            //第一个实例
            this.tableObj = table.render({
                elem: '#demo',
                height: 530,
                url: '/management/v1/payRecord/selects',
                method:'post',
                contentType:"application/json",
                page: true,
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
                    {field: 'balanceRecordId', title: '支付记录ID',sort: false,align: 'right'},
                    {field: 'accountId', title: '账户ID',sort: false,align: 'right',templet:function(d){
                        return '<span lay-event="ele_user_show" style="color:#01AAED;cursor:pointer;">'+d.accountId+'</span>'
                    }},
                    
                    {field: 'orderId', title: '订单号',sort: false,align: 'right'},
                    {field: 'tradeNo', title: '内部流水单号',sort: false,align: 'right'},
                    {field: 'transactionId', title: '支付渠道流水号',sort: false,align: 'right'},
                    {field: 'channel', title: '支付渠道',sort: false,align: 'right',templet:function(d){
                        return d.channel?dropDownList.channel[d.channel]:''
                    }},
                    {field: 'reason', title: '支付变更',sort: false,align: 'right',templet:function(d){
                        return d.reason?dropDownList.reason[d.reason]:''
                    }},
                    {field: 'recordTime', title: '记账时间',sort: false,align: 'right',templet:function(d){
                        return d.recordTime?new Date(d.recordTime).Format('yyyy-MM-dd hh:mm'):''
                    }},
                    {field: 'amount', title: '支付金额(元)',sort: false,align: 'right',templet:function(d){
                        var txt=''
                        if(d.reason=='3'){
                            txt='<span class="layui-badge">退</span>'
                        }
                        return d.amount/100+txt
                    }},
                    {field: 'merchantType', title: '商户类型',sort: false,align: 'right'},
                    {field: '', title: '操作', width:'90', sort: false,align: 'left',templet: function(d){
                        return '<button class="layui-btn layui-btn-sm"   lay-event="ele_show"  ><i class="layui-icon">&#xe615;</i> 查看</button>'

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
                    _this.eventFun.addLayer('./pay_record_view.html',{
                        'id':obj.data.balanceRecordId,
                        'readonly':'readonly'
                    },'支付详情');
                }else if(obj.event =='ele_user_show')
                {
                    $.getApi('/management/v1/pay/account/'+obj.data.accountId,{
               
                    },function(res)
                    {
                        if(res.code == 0)
                        {
                            _this.eventFun.addLayer('../security/alarm_list_user.html',{
                                'id':res.content.userId,
                                'readonly':'readonly',
                                'userType':'1'
                            });
                            
                        }
                    });
                    
                }
            });
        }
    };

    payList.defaultEvent();
    payList.toolBar();
    payList.getSelectData()
});