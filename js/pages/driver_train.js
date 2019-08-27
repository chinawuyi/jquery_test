layui.use(['common','table', 'layer', 'dict', 'permission','rate'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var rate = layui.rate;
    var permission = layui.permission;
    var table = layui.table;
    var form = layui.form;
    var dropDownList={
        driverTypeList:{},
        driverStatusList:{}
    }
    var driverTrainList = {
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
                    title:'司机培训信息',
                    content: action,
                    area: ['700px', '400px'],
                    maxmin: true
                });
            },
            driverTrainDel:function(data){
                $.getApi('/management/v1/driver/cource/del/'+data.driverCourseId,{
                },function(res)
                {
                    if(res.code == 0)
                    {
                        layer.msg('‘'+data.courseName+'’已删除');  
                        driverTrainList.getData()
                    }
                });
            }
        },
        defaultEvent:function()
        {
            
        },
        getData:function(){
            $.getApi('/management/v1/driver/cource/info/'+$.getUrlData().id,{
            },function(res)
            {
                driverTrainList.setTableData(res.content||[])
            });
        },
        setTableData:function(tableData)
        {
            //第一个实例
            this.tableObj = table.render({
                elem: '#demo',
                height: 200,
                method:'get',
                contentType:"application/json",
                page: false,
                data:tableData,
                cols: [[
                    {field: 'courseName', title: '培训名称',sort: false,align: 'right'},
                    {field: 'courseDate', title: '培训日期',sort: false,align: 'right',templet:function(d){
                        return new Date(d.courseDate*1000).Format('yyyy-MM-dd')
                    }},
                    {field: 'startTime', title: '培训起始日期',sort: false,align: 'right',templet:function(d){
                        return new Date(d.startTime*1000).Format('yyyy-MM-dd')
                    }},
                    {field: 'stopTime', title: '培训结束日期',sort: false,align: 'right',templet:function(d){                      
                        return new Date(d.stopTime*1000).Format('yyyy-MM-dd')
                    }},
                    {field: 'duration', title: '培训时长',sort: false,align: 'right',templet:function(d){
                       
                        return (d.duration/60/60).toFixed(2)+'小时'
                    }},
                    {field: '', title: '操作', width:'175', sort: false,align: 'left',templet: function(d){
                        return '<button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="ele_del" ><i class="layui-icon">&#x1006;</i> 删除</button>'+
                            '<button class="layui-btn layui-btn-xs jsupdate"  lay-event="ele_update"><i class="layui-icon">&#xe642;</i> 编辑</button>'
                    }}
                ]],
                toolbar: '#toolbarDemo',
                done:function(){
                    if($.getUrlData().readonly=='readonly'){
                        $('button').addClass('layui-btn-disabled').attr('disabled','disabled')
                    }
                }
            });
            
        },
        toolBar:function()
        {
            var _this = this;
            table.on('toolbar(test)', function(obj){
                switch(obj.event)
                {
                    case 'add':
                        parent.window.addParentLayer('./driver_train_add.html?driverId='+$.getUrlData().id,'','创建司机培训信息')
                        break;
                };
            });
            table.on('tool(test)', function(obj){
                if(obj.event =='ele_del')
                {
                    layer.open({
                        title: '删除培训信息确认',
                        content: '确定删除‘'+obj.data.courseName+'’？',
                        yes: function(index,layero){
                            _this.eventFun.driverTrainDel(obj.data)
                            layer.close(index);
                          }
                      });
                }else if(obj.event =='ele_update')
                {
                    window.driverTrainData=obj.data
                    parent.window.addParentLayer('./driver_train_add.html',{
                        'id':obj.data.driverCourseId,
                        'driverId':obj.data.driverId
                    },'编辑司机培训信息')
                    
                }
            });
        }
    };
    
    driverTrainList.defaultEvent();
    driverTrainList.toolBar();
    driverTrainList.getData();
    window.setNewTrainData=driverTrainList.getData
});