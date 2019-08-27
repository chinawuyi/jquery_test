layui.use(['common','table', 'layer', 'dict', 'permission'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var table = layui.table;
    var form = layui.form;
    var dropDownList={
        userType:{},
        passengerType:{}
    }
    var driverList = {
        tableObj:null,
        eventFun:{
            addLayer:function(options)
            {
                var action = './passenger_add.html';
                if(options)
                {
                    action = $.addUrlPro(action,options);
                }
                layer.open({
                    type: 2,
                    title:'乘客',
                    content: action,
                    area: ['800px', '500px'],
                    maxmin: true
                });
            },
            formatParams:function(object){
                let tmpObject = {};
                for(let o in object) {
                    if(object[o]!='') {
                    tmpObject[o] = object[o];
                    }
                }
                return tmpObject;
            },
            userStatus:function(data)
            {
                var _this = this;
                $.postApi('/management/v1/passenger/update',{
                    "userId": data.userId,
                    "status":data.status==1?2:1
                },function(res)
                {
                    if(res.code == 0)
                    {
                        layer.msg('乘客已'+(data.status==1?'冻结':'启用'));  
                        driverList.tableObj.reload({
                            where:{
                                userId:$('#userId').val()==''?null:$('#driverType').val(),
                                phone:$('#phone').val()==''?null:$('#name').val()
                            }
                        });
                    }
                });
            }
        },
        getSelectData:function(){
            var _this=this
            /*用户类型*/
            $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                "categoryCode": "ACCOUNT_TYPE"
            },function(res)
            {
                if(res.code == 0)
                {
                    res.content.forEach(function(ele){                       
                        dropDownList.userType[ele.value]=ele.name
                    })
                }
            });
            /*用户状态*/
            $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                "categoryCode": "PASSENGER_OPTYPE"
            },function(res)
            {
                if(res.code == 0)
                {
                    res.content.forEach(function(ele){                       
                        dropDownList.passengerType[ele.value]=ele.name
                    })
                }
                driverList.getData()
            });
        },
        defaultEvent:function()
        {
            var _this = this;
            $('#jsVehicleBrandAdd').click(function(){
                _this.eventFun.addLayer();
            });
            /*提交搜索*/
            form.on('submit(searchPassegner)', function(data){
                _this.tableObj.reload({
                    where:_this.eventFun.formatParams(data.field),
                    page: {
                        curr: 1
                      }
                });
                return false;
            });
        },
        getData:function()
        {
            this.tableObj = table.render({
                elem: '#demo',
                height: 530,
                url: '/management/v1/passenger/list',
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
                        "data": res.content.list //解析数据列表
                    };
                },
                cols: [[
                    {field: 'userId', title: 'ID',sort: false,align: 'right'},
                    {field: 'userName', title: '姓名',sort: false,align: 'right'},
                    {field: 'nickName', title: '昵称',sort: false,align: 'right'},
                    {field: 'gender', title: '性别',sort: false,align: 'right',templet:function(d){
                        return d.gender=='1'?"男":"女"
                    }},
                    {field: 'phone', title: '手机号',sort: false,align: 'right'},
                    {field: 'userType', title: '用户类型',sort: false,align: 'right',templet:function(d){
                        return dropDownList.userType[d.userType]
                    }},
                    {field: 'status', title: '状态',sort: false,align: 'right',templet:function(d){
                        return dropDownList.passengerType[d.status]
                    }},
                    {field: '', title: '操作', width:'220', sort: false,align: 'left',templet: function(d){
                        return '<button class="layui-btn layui-btn-sm" lay-event="ele_show"><i class="layui-icon">&#xe615;</i> 查看</button>'+
                        '<button class="layui-btn layui-btn-sm '+(d.status==-1?'layui-btn-disabled':'')+' layui-btn-danger"  lay-event="ele_status"><i class="layui-icon">'+(d.status==1?'&#x1006;':'&#xe605;')+'</i> '+(d.status==1?'限制':'正常')+'</button>'

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
                        _this.eventFun.addLayer();
                        break;
                };
            });
            table.on('tool(test)', function(obj){
                if(obj.event =='ele_show')
                {
                    _this.eventFun.addLayer({
                        'id':obj.data.userId,
                        'readonly':'readonly'
                    });
                }else if(obj.event =='ele_status')
                {
                    var statusTxt='启用'
                    if(obj.data.status==1){
                        statusTxt='限制'
                    }
                    if(obj.data.status==-1){//注销用户不可修改状态
                        return false
                    }
                    layer.open({
                        title: '会员状态确认',
                        content: '确定'+statusTxt+'此会员吗？',
                        yes: function(index,layero){
                            _this.eventFun.userStatus(obj.data)
                            layer.close(index);
                          }
                      });
                }
            });
        }
    };

    driverList.defaultEvent();
    driverList.toolBar();
    driverList.getSelectData()
    
});