layui.use(['common','table', 'layer', 'permission','form','laydate'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var permission = layui.permission;
    var table = layui.table;
    var form = layui.form;
    var laydate = layui.laydate;
    var dropDownList={
        cancelFlagList:{},
        InvoiceTypeList:{}
    }
    var invoiceList = {
        tableObj:null,
        orderStatusList:{},
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
                    area: ['800px', ($(window).height()-40)+'px'],
                    maxmin: true
                });
            },
            cancelLayer:function(url,options)
            {
                var action = url;
                if(options)
                {
                    action = $.addUrlPro(action,options);
                }
                layer.open({
                    type: 2,
                    title:'红冲',
                    content: action,
                    area: ['800px', ($(window).height()-40)+'px'],
                    maxmin: true
                });
            }
        },
        defaultEvent:function()
        {
            var _this = this;
            $('#resetform').click(function(){
                invoiceList.getData();
            });
            /*日期控件*/
            laydate.render({
                trigger: 'click',
                elem: '#createTimeStart',
                type: 'datetime'
            });
            laydate.render({
                trigger: 'click',
                elem: '#createTimeEnd',
                type: 'datetime'
            });
        },
        formatParams:function(object){
            let tmpObject = {};
            for(let o in object) {
                if(o=='createTimeEnd' || o=='createTimeStart'){
                    object[o]=object[o].replace(/\s/g,'T')
                    if(object[o]!='') {
                        tmpObject[o] = $.trim(object[o]);
                    }
                }
            }
            return tmpObject;
        },
        searchEvent:function()
        {
            let _this=this
            form.on('submit(invoiceSearch)', function(data){
                console.log(_this.formatParams(data.field))
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
            /*红冲标志*/
            $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                "categoryCode": "INVOICE_FLAG"
            },function(res)
            {
                if(res.code == 0)
                {
                    $.appendSelect('cancelFlag',res.content,'value','name');
                    res.content.forEach(function(ele){                       
                        dropDownList.cancelFlagList[ele.value]=ele.name
                    })
                    form.render('select');
                }
            });
            /*发票类型*/
            $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                "categoryCode": "INVOICE_TYPE"
            },function(res)
            {
                if(res.code == 0)
                {
                    res.content.forEach(function(ele){                       
                        dropDownList.InvoiceTypeList[ele.value]=ele.name
                    })
                    form.render('select');
                }
            });
            /*开票分公司*/
            $.getApi('/management/v1/carrent/listAll',{
            },function(res)
            {
                if(res.code == 0)
                {
                    res.content.forEach(function(ele){  
                        ele.chineseName=ele.chineseName?ele.chineseName:''                
                        _this.orderStatusList[ele.chineseName]=ele.chineseName
                    })
                    $.appendSelect('ivcCompanyName',res.content,'chineseName','chineseName');
                    form.render('select');
                    /*列表初始化*/
                    invoiceList.getData();
                }
            });
        },
        getData:function()
        {
            var _this=this
            this.tableObj = table.render({
                elem: '#invoiceList',
                height: 522,
                url: '/management/v1/invoice/query/paging',
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
                    {field:'invoiceCode2', title: '发票号码', align: 'center', sort: false},
                    {field:'invoiceType', title: '发票类型', sort: false,
                        templet:function(d){
                            if(d.invoiceType == 0){
                                return dropDownList.InvoiceTypeList[d.invoiceType];
                            } else if(d.invoiceType == 1) {
                                return dropDownList.InvoiceTypeList[d.invoiceType];
                            } else {
                                return '';
                            }
                        }
                    },
                    {field:'invoiceTitle', title: '发票抬头',sort: false},
                    {field:'ivcTaxNo', title: '纳税人识别号', align: 'center',sort: false},
                    {field:'amount', title: '开票金额', sort: false},
                    {field:'email', title: '电子邮箱', sort: false},
                    {field:'ivcCompanyName', title: '开票分公司', sort: false},
                    {field:'customerId', title: '会员账号', sort: false},
                    {field:'taxAmount', title: '税额', sort: false},
                    {field:'cancelFlag', title: '红冲标志', sort: false,
                        templet:function(d){
                            if(d.cancelFlag == 0){
                                return dropDownList.cancelFlagList[d.cancelFlag];
                            } else if(d.cancelFlag == 1) {
                                return dropDownList.cancelFlagList[d.cancelFlag];
                            } else {
                                return '';
                            }
                        }
                    },
                    {field:'invoiceTime', title: '开票日期', sort: true, align: 'right',templet:function(d){
                        if(d.invoiceTime){
                            return d.invoiceTime.slice(0, 4) +
                            '-' +
                            d.invoiceTime.slice(4, 6) +
                            '-' +
                            d.invoiceTime.slice(6, 8) +
                            ' ' +
                            d.invoiceTime.slice(8, 10) +
                            ':' +
                            d.invoiceTime.slice(10, 12) +
                            ':' +
                            d.invoiceTime.slice(12, 14);
                        }else{
                            return ""
                        }
                        
                    }},
                    {field: '', title: '操作', width:'150', sort: false,templet: function(d){
                        return '<button class="layui-btn layui-btn-xs"   lay-event="ele_show"  ><i class="layui-icon">&#xe615;</i> 查看</button>'+
                        ' <button class="layui-btn layui-btn-danger layui-btn-xs '+((d.invoiceType==0)?"":"layui-btn-disabled")+'"lay-event="ele_cancel"  ><i class="layui-icon" permission="sys:invoice:create">&#xe642;</i>红冲</button>';

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
                    _this.eventFun.editLayer('./invoice_list_view.html',{
                        invoiceCode2:obj.data.invoiceCode2,
                        invoiceId:obj.data.invoiceId
                   })
                }else if(obj.event =='ele_cancel'){
                    console.log(obj.data.invoiceId)
                    _this.eventFun.cancelLayer('./invoice_redinvoice.html',{
                        invoiceId:obj.data.invoiceId
                   })
                    
                }
            });
        }
    };
    
    /*表格工具栏*/
    invoiceList.toolBar();
    /*搜索*/
    invoiceList.searchEvent()
    invoiceList.defaultEvent()
    /*下拉菜单数据*/
    invoiceList.getSelectData()
});