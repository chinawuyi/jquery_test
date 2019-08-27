layui.use(['common','table', 'layer', 'dict', 'permission'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var table = layui.table;
    var form = layui.form;
    var dropDownList={
        moduleList:{},
        platformList:{}
    }
    var vehicleType = {
        tableObj:null,
        eventFun:{
            addLayer:function(options)
            {
                var action = './marketing_ad_add.html';
                if(options)
                {
                    action = $.addUrlPro(action,options);
                }
                layer.open({
                    type: 2,
                    title:'广告位',
                    content: action,
                    area: ['800px', '400px'],
                    maxmin: true
                });
            },
            deleteData:function(data,index)
            {

            },
            delete:function(data)
            {
                var _this = this;
                if(data.data.length == 0)
                {
                    layer.msg('请至少选择一条数据');
                }
                else
                {
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
            }
        },
        getSelectData:function(){
            var _this=this
            /*广告模块位置*/
            $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                "categoryCode": "AD_MODULE_LOCATION"
            },function(res)
            {
                if(res.code == 0)
                {
                    $.appendSelect('module',res.content,'value','name');
                    form.render('select');
                    res.content.forEach(function(ele){                       
                        dropDownList.moduleList[ele.value]=ele.name
                    })
                }
            });
            /*平台类型*/
            $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                "categoryCode": "PLATFORM_TYPE"
            },function(res)
            {
                if(res.code == 0)
                {
                    $.appendSelect('platform',res.content,'value','name');
                    form.render('select');
                    res.content.forEach(function(ele){                       
                        dropDownList.platformList[ele.value]=ele.name
                    })
                    vehicleType.getData();
                }
            });
        },
        searchEvent:function()
        {
            this.tableObj.reload({
                where:{
                    city:$('#city').val()==''?null:$('#city').val(),
                    platform:$('#platform').val()==''?null:$('#platform').val()
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
                url: '/management/v1/appadconfig/list',
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
                    {field: 'platform', title: '客户端',sort: true,templet:function(d){
                        return d.platform?dropDownList.platformList[d.platform]:""
                    }},
                    {field: 'module', title: '模块',sort: true,templet:function(d){
                        return d.module?dropDownList.moduleList[d.module]:''
                    }},
                    {field: 'title', title: '标题', sort: false},
                    {field: 'sort', title: '排序', sort: false},
                    {field: 'startTime', title: '开始时间',sort: true,templet:function(d){
                            return d.startTime?new Date(d.startTime*1000).Format('yyyy-MM-dd hh:mm:ss'):'';
                        }},
                    {field: 'endTime', title: '结束时间',sort: true,templet:function(d){
                            return d.endTime?new Date(d.endTime*1000).Format('yyyy-MM-dd hh:mm:ss'):"";
                        }},
                    {field: 'status', title: '状态',sort: true,templet:function(d){
                            var textInfo='';
                            if(d.startTime*1000>Date.now()){
                                textInfo='预上架'
                            }else if(d.endTime*1000>Date.now()&&d.endTime||d.startTime*1000<Date.now()&&d.startTime){
                                textInfo='上架'
                            }else if(d.endTime*1000<Date.now()&&d.endTime){
                                textInfo='过期'
                            }else if(!d.endTime&&!d.startTime){
                                textInfo='上架'
                            }
                            return d.status==1?textInfo:'禁用'
                        }},
                    {field: '', title: '操作', width:'220', sort: false,templet: function(d){
                            return '<button class="layui-btn layui-btn-xs"   lay-event="ele_show"  ><i class="layui-icon">&#xe615;</i> 查看</button>' +
                                '<button class="layui-btn layui-btn-xs jsupdate"  lay-event="ele_update" ><i class="layui-icon">&#xe642;</i> 编辑</button>'+
                                '<button class="layui-btn layui-btn-danger layui-btn-xs jsupdate" lay-event="ele_status" ><i class="layui-icon">'+(d.status==1?'&#x1006;':'&#xe605;')+'</i> '+(d.status==1?'禁用':'启用')+'</button>';

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
                switch(obj.event)
                {
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
                        'id':obj.data.appAdConfigId
                    });
                }
                else if(obj.event =='ele_show')
                {
                    _this.eventFun.addLayer({
                        'id':obj.data.appAdConfigId,
                        'readonly':'readonly'
                    });
                }else if(obj.event=='ele_status'){
                    var statusTxt='启用'
                    if(obj.data.status==1){
                        statusTxt='禁用'
                    }
                    layer.open({
                        title: '广告位状态确认',
                        content: '确定'+statusTxt+'此广告位吗？',
                        yes: function(index,layero){
                            $.postApi('/management/v1/appadconfig/updateStatus',{
                                "appAdConfigId": obj.data.appAdConfigId,
                                "status":obj.data.status==1?2:1
                            },function(res)
                            {
                                if(res.code == 0)
                                {
                                    layer.msg('广告位'+obj.data.title+'已'+statusTxt);  
                                    $('#searchBt').click()
                                }
                            });
                            layer.close(index);
                          }
                      });
                }
            });
        }
    };

    vehicleType.defaultEvent();
    vehicleType.toolBar();
    vehicleType.getSelectData()
});