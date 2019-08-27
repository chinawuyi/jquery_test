layui.use(['common','form','table', 'layer', 'dict', 'permission'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var table = layui.table;
    var form = layui.form;
    var vehicleSeries = {
        brandTree:[],
        tableObj:null,
        cityList:[],
        eventFun:{
            addLayer:function(options)
            {
                var action = './vehicle_info.html';
                if(options)
                {
                    action = $.addUrlPro(action,options);
                }
                layer.open({
                    type: 2,
                    title:'新增车辆',
                    content: action,
                    area: ['800px', ($(window).height()-80)+'px'],
                    maxmin: true
                });
            },
            addLayer2:function(options)
            {
                var action = './vehicle_add.html';
                if(options)
                {
                    action = $.addUrlPro(action,options);
                }
                layer.open({
                    type: 2,
                    title:'新增车辆',
                    content: action,
                    area: ['800px', ($(window).height()-80)+'px'],
                    maxmin: true
                });
            },
            deleteData:function(data,index)
            {
                var carBrandId = '';
                $(data.data).each(function(){
                    carBrandId += this.carBrandId+'|';
                });
                carBrandId = carBrandId.slice(0,carBrandId.length-1);
                $.postApi('/management/v1/brand/updateStatus',{
                    'carBrandId':carBrandId
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
                $.postApi('/management/v1/vehicle/updateStatus',{
                    'carId':data.carId,
                    "status":data.status==1?2:1
                },function(res){
                    layer.msg('车辆'+data.carNumber+'已'+(data.status==1?'禁用':'启用'));
                    vehicleSeries.searchEvent();
                });
            },
            getBrandsTree:function(data)
            {
                var _this = this;
                $.getApi('/management/v1/vehicle/listTree',{
                },function(res)
                {
                    if(res.code == 0)
                    {

                        vehicleSeries.brandTree = res.content;
                        _this._initTree(res.content,data);

                    }
                });
            },
            getCityList:function(){
                $.postApi('/management/v1/businesscity/cityList',{
                    "type":"2"
                },
                function(res)
                {
                    if(res.code == 0){
                        vehicleSeries.cityList = res.content;
                        vehicleSeries.getData();
                    }
                });
            },
            getCityNameByCode:function(code){
                var name;
                $(vehicleSeries.cityList).each(function(index,item){
                    if(item.code == code){
                        name = item.name;
                        return false;
                    }
                })
                return name;
            },
            _initTree:function(data,defaultdata)
            {
                if(!defaultdata)
                {
                    $.appendSelect('carBrandId',data,'carBrandId','name');
                    form.render('select');
                }
                else{
                    $.appendSelect('carBrandId',data,'carBrandId','name',defaultdata.carBrandId);
                    $(data).each(function(){
                        if(this.carBrandId == defaultdata.carBrandId)
                        {
                            $.appendSelect('carModelId',this.modelList,'carModelId','name',defaultdata.carModelId);
                        }
                    });
                    form.render('select');

                }

            }
        },
        searchEvent:function()
        {
            this.tableObj.reload({
                where:{
                    "carNumber":$('#carNumber').val()==''?null:$('#carNumber').val(),
                    "carBrandId":$('#carBrandId').val()==''?null:parseInt($('#carBrandId').val()),
                    "carModelId":$('#carModelId').val()==''?null:parseInt($('#carModelId').val()),
                    "carAttributeId":$('#carAttributeId').val()==''?null:parseInt($('#carAttributeId').val())
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

            form.on('select(carBrandId)', function(data)
            {

                if(data.value !='')
                {
                    $(_this.brandTree).each(function()
                    {
                        if(this.carBrandId == data.value)
                        {
                            $.appendSelect('carModelId',this.modelList==null?[]:this.modelList,'carModelId','name');
                            _this.modelList= (this.modelList == null)?[]:this.modelList;
                            form.render('select');
                        }

                    });
                }
            });
            form.on('select(carModelId)', function(data)
            {
                if(data.value !='')
                {
                    if(_this.modelList.length == 0)
                    {
                        //车系没有数据

                    }
                    else{
                        $(_this.modelList).each(function()
                        {
                            if(this.carModelId == data.value)
                            {
                                $.appendSelect('carAttributeId',this.attributeList==null?[]:this.attributeList,'carAttributeId','name');
                                form.render('select');
                            }

                        });
                    }

                }
            });
        },
        getData:function()
        {
            //第一个实例
            this.tableObj = table.render({
                elem: '#demo',
                height: 522,
                url: '/management/v1/vehicle/list',
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
                    // {type: 'checkbox'},
                    {field: 'carId', title: 'ID', sort: true}
                    ,{field: 'carNumber', title: '车牌号',sort: true}
                    ,{field: 'city', title: '城市', sort: true,templet:function(d){
                       return vehicleSeries.eventFun.getCityNameByCode(d.city)?vehicleSeries.eventFun.getCityNameByCode(d.city):'';
                    }},
                    {field: 'carBrand', title: '品牌', sort: true},
                    {field: 'carModel', title: '车系', sort: false},
                    {field: '', title: '操作', width:'215', sort: false,templet: function(d){
                            return '<button class="layui-btn layui-btn-xs" lay-event="ele_show"  lay-event="show"  ><i class="layui-icon">&#xe615;</i> 查看</button>' +
                                '<button class="layui-btn layui-btn-xs jsupdate"  lay-event="ele_update" ><i class="layui-icon">&#xe642;</i> 编辑</button>'+
                                '<button class="layui-btn layui-btn-danger layui-btn-xs jsupdate"  lay-event="ele_status" ><i class="layui-icon">'+(d.status==1?'&#x1006;':'&#xe605;')+'</i> '+(d.status==1?'禁用':'启用')+'</button>';

                            //return 'ID：'+ d.id +'，标题：<span style="color: #c00;">'+ d.title +'</span>'
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
                        _this.eventFun.addLayer2();
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
                        'carId':obj.data.carId
                    });
                }
                else if(obj.event =='ele_show')
                {
                    _this.eventFun.addLayer({
                        'carId':obj.data.carId,
                        'readonly':'readonly'
                    });
                }
                else if(obj.event =='ele_status')
                {
                    var statusTxt='启用'
                    if(obj.data.status==1){
                        statusTxt='禁用'
                    }
                    layer.open({
                        title: '车辆状态确认',
                        content: '确定'+statusTxt+'此车辆吗？',
                        yes: function(index,layero){
                            _this.eventFun.updateStatus(obj.data)
                            layer.close(index);
                        }
                    });
                }
            });
        }
    };

    vehicleSeries.defaultEvent();

    vehicleSeries.eventFun.getBrandsTree();
    vehicleSeries.eventFun.getCityList();
    
    vehicleSeries.toolBar();
});