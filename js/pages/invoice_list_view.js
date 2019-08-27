layui.use(['common','form', 'layer', 'dict', 'permission','element','table'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var form = layui.form;
    var element = layui.element;
    var table = layui.table;
    var dropDownList={
        cancelFlagList:{},
        InvoiceTypeList:{}
    }
    var orderListView = {
        tableObj:null,
        dataObj:{
            'invoiceCode2':'',
            'invoiceId':''
        },
        eventFun:{
            closeLayer:function()
            {
                var index = parent.layer.getFrameIndex(window.name);
                parent.layer.close(index);

            },
            getData:function()
            {
                var _this = this;
                $.postApi('/management/v1/invoice/query/paging',{
                    "invoiceCode2":orderListView.dataObj.invoiceCode2,
                },function(res)
                {
                    if(res.code == 0)
                    {
                        var invoiceDetail=res.content.data
                        var formData=res.content.data[0]
                        var inputDom=document.getElementsByTagName("input")
                        if(formData){
                            for(var i=0;i<inputDom.length;i++){
                                var attr=inputDom[i].getAttribute("name")  
                                inputDom[i].value=formData[attr]                              
                                if(attr=='titleType'){
                                    inputDom[i].value=inputDom[i].value==0?"企业":"个人" // 开票类型（企业/个人）, 0：企业 1：个人
                                }else if(attr=='invoiceTime'){
                                    let time=formData.invoiceTime.slice(0, 4) +
                                    '-' +
                                    formData.invoiceTime.slice(4, 6) +
                                    '-' +
                                    formData.invoiceTime.slice(6, 8) +
                                    ' ' +
                                    formData.invoiceTime.slice(8, 10) +
                                    ':' +
                                    formData.invoiceTime.slice(10, 12) +
                                    ':' +
                                    formData.invoiceTime.slice(12, 14)
                                    inputDom[i].value=formData.invoiceTime?time:"";
                                }else if(attr=='createTime'||attr=='updateTime'){
                                    inputDom[i].value=formData[attr]?new Date(formData[attr]).Format('yyyy-MM-dd hh:mm:ss'):"";
                                }else if(attr=='invoiceType'){
                                    inputDom[i].value=inputDom[i].value==0?"原发票":"正常票" // 发票类型, 0：原发票 1：正常票
                                    // if(inputDom[i].value==0 || inputDom[i].value==1){
                                    //     inputDom[i].value=dropDownList.InvoiceTypeList[inputDom[i].value]
                                    // }
                                    // else{
                                    //     inputDom[i].value=""
                                    // }
                                }else if(attr=='cancelFlag'){
                                    inputDom[i].value=inputDom[i].value==0?"否":"是" // 红冲标志, 0：未开红冲 1：已开红冲
                                    // if(inputDom[i].value==0 || inputDom[i].value==1){
                                    //     inputDom[i].value=dropDownList.cancelFlagList[inputDom[i].value]
                                    // }
                                    // else{
                                    //     inputDom[i].value=""
                                    // }
                                }else if(attr=='operator' || attr=='cancelInvoiceId'){
                                    inputDom[i].value=inputDom[i].value?inputDom[i].value:''
                                }
                                else{
                                    inputDom[i].value=formData[attr]
                                }
                            }
                        }
                        this.tableObj = table.render({
                            elem: '#invoiceDetailList',
                            height: 100,
                            data: invoiceDetail, 
                            cols: [[
                                {field:'content', title: '开票内容', align: 'center', sort: false},
                                {field:'reduce', title: '金额（元）', sort: false,templet:function(d){
                                    return '<span>'+(Number(d.amount)-Number(d.taxAmount)).toFixed(2)+'</span>'          
                                }},
                                {field:'taxAmount', title: '税额（元）',sort: false},
                                {field:'amount', title: '合计（元）', align: 'center'},
                            ]]
                        });
                    }
                });
            },
            getUrlData:function()
            {
                var urlData = $.getUrlData();
                if(urlData)
                {
                    orderListView.dataObj.invoiceCode2 = urlData.invoiceCode2;
                    orderListView.dataObj.invoiceId = urlData.invoiceId;
                    this.getData();
                }
            },
            setVal:function(data){
                let info={}
                data.forEach(function(ele){
                    info[ele.value]=ele.name
                })
                return info
            }
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
                    res.content.forEach(function(ele){                       
                        dropDownList.cancelFlagList[ele.value]=ele.name
                    })
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
                }
            });
        },
        getOrderDetail:function()
        {
            var _this=this
            $.postApi('/management/v1/invoice/query/detail',{
                "invoiceId":orderListView.dataObj.invoiceId,
            },function(res){
                var orderList=res.content.orderList
                this.tableObj = table.render({
                    elem: '#orderDetailList',
                    data: orderList,
                    cols: [[
                        {field:'orderId', title: '订单号', align: 'center', sort: false},
                        {field:'startAddress', title: '出发地', sort: false},
                        {field:'endAddress', title: '目的地',sort: false},
                        {field:'amount', title: '金额', align: 'center'},
                    ]]
                });
            });
        },
        defaultEvent:function()
        {
            var _this = this;
            $('#jsBrandBack').click(function(){
                _this.eventFun.closeLayer();
            });
        }
    };
    //需要优先执行
    orderListView.eventFun.getUrlData();
    orderListView.eventFun.getData();
    orderListView.getOrderDetail();
    
    orderListView.defaultEvent();
});