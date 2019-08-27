layui.use(['common','table', 'layer', 'laydate', 'permission'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var laydate = layui.laydate;
    var permission = layui.permission;
    var table = layui.table;
    var form = layui.form;
    var dropDownList={
        userType:{},
        loginType:{}
    }
    var loginLog_Data = {
        tableObj:null,
        eventFun:{
            addLayer:function(options)
            {
                var action = '../user/add_user.html';
                if(options)
                {
                    action = $.addUrlPro(action,options);
                }
                layer.open({
                    type: 2,
                    title:'用户信息',
                    content: action,
                    area: ['800px', '450px'],
                    maxmin: true
                });
            },
            formatParams:function(object){
                let tmpObject = {};
                for(let o in object) {
                    if(o.toLowerCase().indexOf('time')>0){
                        if(object[o]!='') {
                            tmpObject[o] = new Date(object[o]).getTime();
                            }
                    }else{
                        if(object[o]!='') {
                            tmpObject[o] = object[o];
                            }
                    }
                }
                return tmpObject;
            },
            getSelectData:function(){
                var _this=this
                /*业务城市*/
                $.postApi('/management/v1/businesscity/list',{
                    
                },function(res)
                {
                    if(res.code == 0)
                    {
                        $.appendSelect('cityCode',res.content.data,'code','name');
                        form.render('select');
                    }
                });
                /*用户类型*/
                $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                    "categoryCode": "ACCOUNT_TYPE"
                },function(res)
                {
                    if(res.code == 0)
                    {
                        $.appendSelect('userType',res.content,'value','name');
                        form.render('select');
                        res.content.forEach(function(ele){                       
                            dropDownList.userType[ele.value]=ele.name
                        })
                    }
                });
                /*登录类型*/
                $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                    "categoryCode": "APPLOGIN_TYPE"
                },function(res)
                {
                    if(res.code == 0)
                    {
                        res.content.forEach(function(ele){                       
                            dropDownList.loginType[ele.value]=ele.name
                        })
                    }
                });
            },
        },
        
        defaultEvent:function()
        {
            var _this = this;
            /*提交表单_搜索*/
            form.on('submit(searchLog)', function(data){
                loginLog_Data.tableObj.reload({
                    where:_this.eventFun.formatParams(data.field),
                    page: {
                        curr: 1
                      }
                });
                return false;
            });
            /*日期控件*/
            laydate.render({
                elem: '#startTime',
                trigger: 'click',
                type: 'datetime'
            });
            laydate.render({
                elem: '#endTime',
                trigger: 'click',
                type: 'datetime'
            });
        },
        getData:function()
        {
            console.log('1')
            //第一个实例
            this.tableObj = table.render({
                elem: '#demo',
                height: 522,
                url: '/management/v1/audit/list',
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
                        "data": res.content.datas //解析数据列表
                    };
                },
                cols: [[
                    {field: 'userId', title: '用户id',sort: true,templet:function(d){
                        return '<span lay-event="ele_show" style="color:#01AAED;cursor:pointer;">'+d.userId+'</span>'
                    }},
                    {field: 'userName', title: '用户名', sort: false},
                    {field: 'requestTime', title: '操作开始时间', sort: false,templet:function(d){
                        return d.requestTime?new Date(Number(d.requestTime)).Format('yyyy-MM-dd hh:mm'):''
                    }},
                    {field: 'finishTime', title: '操作结束时间', sort: false,templet:function(d){
                        return d.finishTime?new Date(Number(d.finishTime)).Format('yyyy-MM-dd hh:mm'):''
                    }},
                    {field: 'requestResult', title: '请求结果', sort: false,templet:function(d){
                        return d.requestResult==0?'成功':'失败'
                    }},
                    {field: 'ip', title: 'IP', sort: false},
                    {field: 'methodName', title: '方法名', sort: false},
                    {field: 'url', title: '请求URL', sort: false}
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
                    _this.eventFun.addLayer({
                        'id':obj.data.userId,
                        'readonly':'readonly'
                    });
                }
            });
        }
    };

    loginLog_Data.defaultEvent();
    loginLog_Data.toolBar();
    loginLog_Data.eventFun.getSelectData()
    loginLog_Data.getData();
});