layui.use(['common','table', 'layer', 'dict', 'permission'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var table = layui.table;
    var form = layui.form;
    var passengerList=[];
    layui.sessionData('passengerList',null)
    var couponSend = {
        userList:[],
        tableObj:null,
        eventFun:{
            addLayer:function(urlPath,options,titleName)
            {
                var action = urlPath;
                if(options)
                {
                    action = $.addUrlPro(action,options);
                }
                layer.open({
                    type: 2,
                    title:titleName,
                    content: action,
                    area: ['700px', ($(window).height()-80)+'px'],
                    maxmin: true
                });
            },
            closeLayer:function()
            {
                var index = parent.layer.getFrameIndex(window.name);
                parent.layer.close(index);
            },
            getBatchData:function(){

                $('.form-control').addClass('layui-disabled').attr('readonly','readonly')

                $.postApi('/management/v1/coupon/rule/prepareSendCoupon',{
                    "couponRuleId": $.getUrlData().id
                },function(res)
                {
                    if(res.code == 0)
                    {
                        var data=res.content;
                        $("#couponBatchId").val(data.couponBatchId)
                        $("#couponName").val(data.couponName)
                        $("#couponRuleId").val(data.couponRuleId)
                        $("#expiryDate").val(data.expiryDate)
                        $("#sendDate").val(data.sendDate)
                        $("#operation").val(sessionStorage.getItem('operation'))
                    }
                });
            },
            
        },
        defaultEvent:function()
        {
            var _this = this;
            //返回
            $('#jsBrandBack').click(function(){
                _this.eventFun.closeLayer();
            });
            $('#jsSub').click(function(){
                $.each(layui.sessionData('passengerList'),function(k,v){
                    couponSend.userList.push({"phone":v.phone,"uid":v.userId})
                    
                })
                $.postApi('/management/v1/coupon/rule/sendCoupon',{
                    "couponRuleId": $.getUrlData().id,
                    "couponBatchId":$("#couponBatchId").val(),
                    "operator":sessionStorage.getItem('operator'),
                    "userList":couponSend.userList
                },function(res)
                {
                    if(res.code == 0)
                    {
                        var data=res.content;
                        layer.msg(res.message);
                        window.setTimeout(function(){
                            couponSend.eventFun.closeLayer()
                            parent.window.$('#searchBt').click();                            
                        },1000);
                    }
                });

            });
        },
        getData:function()
        {
            //第一个实例
            this.tableObj = table.render({
                elem: '#demo',
                height: 250,
                page: true,
                data:[],
                cols: [[
                    {field: 'userId', title: 'ID',sort: false,align: 'right'},
                    {field: 'userName', title: '姓名',sort: false,align: 'right'},
                    {field: 'nickName', title: '昵称',sort: false,align: 'right'},
                    {field: 'phone', title: '手机号',sort: false,align: 'right'},
                    {field: 'operation', title: '操作',sort: false,align: 'right',templet:function(d){
                        return '<button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="ele_show" ><i class="layui-icon">&#x1006;</i> 取消</button>'
                    }}
                ]],
                toolbar: '#toolbarDemo'
            });
        },
        toolBar:function()
        {
            var _this = this;
            table.on('toolbar(test)', function(obj){
                switch(obj.event)
                {
                    case 'add':
                        _this.eventFun.addLayer('./coupon_passenger_list.html',"",'添加用户');
                        break;
                };
            });
            table.on('tool(test)', function(obj){
                if(obj.event=='ele_show'){
                    layui.sessionData('passengerList',{
                        key:obj.data.userId,remove: true
                    })
                    var list=[];
                    $.each(layui.sessionData('passengerList'),function(k,v){
                        list.push(v)
                    })
                    table.reload('demo', {
                        "data":list
                    });
                    couponSend.exploreExcel();
                }
            });
        },
        exploreExcel:function(){
            $('#exploreExcel').click(function(){
                $('#exploreExcel').val('');
            });
            $('#exploreExcel').change(function(e) {
                var files = e.target.files;
                var fileReader = new FileReader();
                fileReader.onload = function(ev) {
                    try {
                        var data = ev.target.result,
                            workbook = XLSX.read(data, {
                                type: 'binary'
                            }), // 以二进制流方式读取得到整份excel表格对象
                            persons = []; // 存储获取到的数据
                    } catch (e) {
                        console.log('文件类型不正确');
                        return;
                    }
    
                    // 表格的表格范围，可用于判断表头是否数量是否正确
                    var fromTo = '';
                    // 遍历每张表读取
                    for (var sheet in workbook.Sheets) {
                        if (workbook.Sheets.hasOwnProperty(sheet)) {
                            fromTo = workbook.Sheets[sheet]['!ref'];
                            console.log(fromTo);
                            persons = persons.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
                             //break; // 只取第一张表
                        }
                    } 
                    console.log('excel')
                    var selectPassenger=[]
                    $.each(persons,function(k,v){
                        var keyName=v.ID,valueName={'userId':v.ID,'userName':v.姓名,'nickName':v.昵称,'phone':v.手机号}
                        layui.sessionData('passengerList',{
                            key:keyName,value:valueName
                        })
                    })
                    $.each(layui.sessionData('passengerList'),function(k,v){
                        selectPassenger.push(v)
                    })
                    table.reload('demo', {
                        "data":selectPassenger
                    });
                    couponSend.exploreExcel();
                };   
                // 以二进制方式打开文件
                fileReader.readAsBinaryString(files[0]);
            });
        }
    };
    couponSend.eventFun.getBatchData();
    couponSend.defaultEvent();
    couponSend.toolBar();
    couponSend.getData();
    couponSend.exploreExcel();
    window.setPassenger=function(list){
        passengerList=list
        
        table.reload('demo', {
            "data":list
        });
        couponSend.exploreExcel();
        //存储数据
        $.each(list,function(k,v){
            layui.sessionData('passengerList',{
                key:v.userId,value:v
            })
        })
    };
});