layui.use(['common','table', 'layer', 'dict', 'permission'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var table = layui.table;

    var vehicleBrand = {
        tableObj:null,
        eventFun:{
            addLayer:function(options)
            {
                var action = './vehicle_brand_add.html';
                if(options)
                {
                    action = $.addUrlPro(action,options);
                }
                layer.open({
                    type: 2,
                    title:'品牌',
                    content: action,
                    area: ['800px', '500px'],
                    maxmin: true
                });
            },
            deleteData(data,index)
            {
                var carBrandId = '';
                $(data.data).each(function(){
                    carBrandId += this.carBrandId+'|';
                });
                carBrandId = carBrandId.slice(0,carBrandId.length-1);
                $.postApi('/management/v1/brand/updateStatus',{
                    'carBrandId':carBrandId,
                    'status':'0'
                },function(res){
                    console.log(res);
                });
                console.log(carBrandId);
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
            updateStatus:function(data)
            {
                $.postApi('/management/v1/brand/updateStatus',{
                    'carBrandId':data.carBrandId,
                    "status":data.status==1?2:1
                },function(res){
                    layer.msg('品牌'+data.name+'已'+(data.status==1?'禁用':'启用'));
                    vehicleBrand.searchEvent();
                });
            }
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
        searchEvent:function()
        {
            this.tableObj.reload({
                where:{
                    "userId":$('#userId').val()==''?null:$('#userId').val()
                },
                page: {
                    curr: 1
                }
            });
        },
        getData:function()
        {
            this.tableObj = table.render({
                elem: '#demo',
                height: 522,
                url: '/management/v1/appsuggest/list',
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
                    {field: 'userId', title: '用户ID', width:'20%', sort: false,}
                    ,{field: 'content', title: '用户留言', width:'80%',sort: false}
                ]],
                toolbar: '#toolbarDemo'
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
                        'carBrandId':obj.data.carBrandId
                    });
                }
                else if(obj.event =='ele_show')
                {
                    _this.eventFun.addLayer({
                        'carBrandId':obj.data.carBrandId,
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
                        title: '品牌状态确认',
                        content: '确定'+statusTxt+'此品牌吗？',
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

    vehicleBrand.defaultEvent();
    vehicleBrand.getData();
    vehicleBrand.toolBar();
});