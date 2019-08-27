layui.use(['common','table', 'layer', 'dict', 'permission'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var table = layui.table;

    var vehicleType = {
        tableObj:null,
        eventFun:{
            addLayer:function(options)
            {
                var action = './vehicle_type_add.html';
                if(options)
                {
                    action = $.addUrlPro(action,options);
                }
                layer.open({
                    type: 2,
                    title:'车型',
                    content: action,
                    area: ['800px', $(window).height()-80+'px'],
                    maxmin: true
                });
            },
            deleteData:function(data,index)
            {
                var carTypeId = '';
                $(data.data).each(function(){
                    carTypeId += this.carTypeId+'|';
                });
                carTypeId = carTypeId.slice(0,carTypeId.length-1);
                $.postApi('/management/v1/brand/updateStatus',{
                    'carTypeId':carBrandId
                },function(res){
                    console.log(res);
                });
            },
            delete:function(data)
            {
                var _this = this;
                if(data.data.length == 0)
                {
                    layer.msg('请至少选择一条数据');
                }
                else{
                    layer.confirm('确认删除？',
                        {
                            btn: ['确认', '取消']
                        },
                        function(index, layero)
                        {
                            _this.deleteData(data,index);
                        },
                        function(index){

                        }
                    );
                }
            },
            //更新车型状态
            updateStatus:function(data)
            {
                $.postApi('/management/v1/cartype/updateStatus',{
                    'id':data.id,
                    "status":data.status==1?2:1
                },function(res){
                    layer.msg('车型'+data.name+'已'+(data.status==1?'禁用':'启用'));
                    vehicleType.searchEvent();
                });
            }
        },
        searchEvent:function()
        {
            this.tableObj.reload({
                where:{
                    "name":$('#name').val()==''?null:$('#name').val(),
                    "enName":$('#enName').val()==''?null:$('#enName').val()
                },
                page: {
                    curr: 1
                }
            });
        },
        defaultEvent:function()
        {
            var _this = this;
            $('#jsVehicleBrandAdd').click(function(){
                _this.eventFun.addLayer();
            });
            $('#searchBt').click(function(){
                _this.searchEvent();
            });
        },
        getData:function()
        {
            //第一个实例
            this.tableObj = table.render({
                elem: '#demo',
                height: 522,
                url: '/management/v1/cartype/list',
                method:'post',
                contentType:"application/json",
                page: true,
                request: {
                    pageName: 'pageIndex',
                    limitName: 'pageSize'
                },
                parseData: function(res){
                    return {
                        "code": res.code, //解析接口状态
                        "msg": res.message, //解析提示文本
                        "count": res.content.total, //解析数据长度
                        "data": res.content.data //解析数据列表
                    };
                },
                cols: [[
                    // {type: 'checkbox', fixed: 'left'},
                    {field: 'carTypeId', title: 'ID',  sort: true},
                    {field: 'name', title: '车型名称', sort: true},
                    {field: 'enName', title: '车型名称(EN)', sort: true},
                    {field: 'enName', title: '图片预览', sort: false,templet:function(d){
                        //console.log(d);
                        if(d.img !='' && d.img !=null)
                        {
                             return '<img style="height:100%;width:auto;" src="'+d.img+'">';
                        }
                        else{
                            return '';
                        }
                     }},

                    {field: 'status', title: '状态', sort: false,templet:function(d){
                        if(d.status =='1')
                        {
                            return '启用';
                        }
                        else{
                            return '禁用';
                        }
                        }},
                    {field: '', title: '操作', width:'215',sort: false,templet: function(d){
                            return '<button class="layui-btn layui-btn-xs"   lay-event="ele_show"  ><i class="layui-icon">&#xe615;</i> 查看</button>' +
                                '<button class="layui-btn layui-btn-xs jsupdate"  lay-event="ele_update" ><i class="layui-icon">&#xe642;</i> 编辑</button>'+
                                '<button class="layui-btn layui-btn-danger layui-btn-xs jsupdate"  lay-event="ele_status" ><i class="layui-icon">'+(d.status==1?'&#x1006;':'&#xe605;')+'</i> '+(d.status==1?'禁用':'启用')+'</button>';


                        }}
                ]],
                toolbar: '#toolbarDemo'
                //defaultToolbar:['filter', 'print', 'exports']
            });
        },
        toolBar:function()
        {
            var _this = this;
            table.on('toolbar(test)', function(obj){
                var checkStatus = table.checkStatus(obj.config.id);
                console.log(obj);
                switch(obj.event){
                    case 'add':
                        _this.eventFun.addLayer();
                        break;
                    case 'delete':
                        _this.eventFun.delete(checkStatus);
                        break;
                };
            });
            table.on('tool(test)', function(obj){
                if(obj.event =='ele_update')
                {
                    _this.eventFun.addLayer({
                        'id':obj.data.id,
                        'readonly':'update'
                    });
                }
                else if(obj.event =='ele_show')
                {
                    _this.eventFun.addLayer({
                        'id':obj.data.id,
                        'readonly':'readonly'
                    });
                }
                else if(obj.event =='ele_status')
                {
                    var statusTxt='启用'
                    if(obj.data.status==1)
                    {
                        statusTxt='禁用'
                    }
                    layer.open({
                        title: '车型状态确认',
                        content: '确定'+statusTxt+'此车型吗？',
                        yes: function(index,layero)
                        {
                            _this.eventFun.updateStatus(obj.data)
                            layer.close(index);
                        }
                    });
                }
            });
        }
    };

    vehicleType.defaultEvent();
    vehicleType.getData();
    vehicleType.toolBar();
});