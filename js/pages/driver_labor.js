layui.use(['common','table', 'layer', 'dict', 'permission'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var table = layui.table;
    var form = layui.form;
    var dropDownList={
        driverTypeList:{},
        driverStatusList:{}
    }
    var driverList = {
        tableObj:null,
        eventFun:{
            addLayer:function(options)
            {
                var action = './driver_labor_add.html';
                if(options)
                {
                    action = $.addUrlPro(action,options);
                }
                layer.open({
                    type: 2,
                    title:'司机劳务公司',
                    content: action,
                    area: ['800px', ($(window).height()-80)+'px'],
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
            driverLaborStatus:function(data)
            {
                var _this = this;
                $.postApi('/management/v1/driver/labor/updateStatus',{
                    "labourCompanyId": data.labourCompanyId,
                    "status":data.status==1?2:1
                },function(res)
                {
                    if(res.code == 0)
                    {
                        layer.msg(data.chineseName+'已'+(data.status==1?'冻结':'启用'));  
                        driverList.tableObj.reload({
                            where:{}
                        });
                    }
                });
            }
        },
        getSelectData:function(){
            var _this=this
            /*城市*/
            $.postApi('/management/v1/businesscity/list',{
            },function(res)
            {
                if(res.code == 0)
                {
                    $.appendSelect('city',res.content.data,'code','name');
                    form.render('select');
                }
            });
        },
        defaultEvent:function()
        {
            var _this = this;
            $('#jsVehicleBrandAdd').click(function(){
                _this.eventFun.addLayer();
            });
            /*提交搜索*/
            form.on('submit(searchLabor)', function(data){
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
                url: '/management/v1/driver/labor/query',
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
                    {field: 'chineseName', title: '公司名称',sort: false,align: 'right'},
                    {field: 'accountName', title: '账户名称',sort: false,align: 'right'},
                    {field: 'contacts', title: '联系人',sort: false,align: 'right'},
                    {field: 'contactsCellphone', title: '联系人手机号',sort: false,align: 'right'},
                    {field: 'legalPerson', title: '法人代表',sort: false,align: 'right'},
                    {field: 'licenseNo', title: '合同编号',sort: false,align: 'right'},
                    {field: '', title: '操作', width:'220', sort: false,align: 'left',templet: function(d){
                        return '<button class="layui-btn layui-btn-xs"   lay-event="ele_show"><i class="layui-icon">&#xe615;</i> 查看</button>'+
                            '<button class="layui-btn layui-btn-xs jsupdate"  lay-event="ele_update" ><i class="layui-icon">&#xe642;</i> 编辑</button>'+
                            '<button class="layui-btn layui-btn-danger layui-btn-xs jsupdate"  lay-event="ele_status" ><i class="layui-icon">'+(d.status==1?'&#x1006;':'&#xe605;')+'</i> '+(d.status==1?'冻结':'启用')+'</button>'

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
                        'id':obj.data.labourCompanyId,
                        'readonly':'readonly'
                    });
                }else if(obj.event =='ele_update')
                {
                    _this.eventFun.addLayer({
                        'id':obj.data.labourCompanyId
                    });
                }
                else if(obj.event =='ele_status')
                {
                    var statusTxt='启用'
                    if(obj.data.status==1){
                        statusTxt='冻结'
                    }
                    layer.open({
                        title: '司机劳务公司状态确认',
                        content: '确定'+statusTxt+'此劳务公司吗？',
                        yes: function(index,layero){
                            _this.eventFun.driverLaborStatus(obj.data)
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
    driverList.getData()
});