layui.use(['common','table', 'layer', 'dict', 'permission'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var table = layui.table;
    var form = layui.form;
    var dropDownList={
        brandTree:[],
        modelList:[]

    }
    var driverList = {
        tableObj:null,
        eventFun:{
            closeLayer:function()
            {
                var index = parent.layer.getFrameIndex(window.name);
                parent.layer.close(index);
            },
            
            getBrandsTree:function()
            {
                var _this = this;
                $.getApi('/management/v1/vehicle/listTree',{
                },function(res)
                {
                    if(res.code == 0)
                    {
                        dropDownList.brandTree = res.content;
                        _this._initTree(res.content);

                    }
                });
                /**车型下拉 */
                // $.postApi('/management/v1/cartype/list2',{
                //     "status": 1
                // },function(res)
                // {
                //     if(res.code == 0)
                //     {
                //         $.appendSelect('carTypeId',res.content,'carTypeId','name');
                //         form.render('select');
                //     }
                // });
            },
            _initTree:function(data)
            {
                $.appendSelect('carBrandId',data,'carBrandId','name');
                form.render('select');
            }
        },
        searchEvent:function()
        {
            this.tableObj.reload({
                where:{
                    carAttributeId:$('#carAttributeId').val()==''?null:$('#carAttributeId').val(),
                    carBrandId:$('#carBrandId').val()==''?null:$('#carBrandId').val(),
                    carModelId:$('#carModelId').val()==''?null:$('#carModelId').val(),
                    carNumber:$('#carNumber').val()==''?null:$('#carNumber').val(),
                    //carTypeId:$('#carTypeId').val()==''?null:$('#carTypeId').val(),
                    city:$.getUrlData().city
                },
                page: {
                    curr: 1
                }
            });
        },
        defaultEvent:function()
        {
            var _this = this;
            $('#searchBt').click(function(){
                _this.searchEvent();
            });
            /*监控select 改变下拉数据*/
            form.on('select(carBrandId)', function(data)
            {
                if(data.value !='')
                {
                    $(dropDownList.brandTree).each(function()
                    {
                        if(this.carBrandId == data.value)
                        {
                            $.appendSelect('carModelId',this.modelList==null?[]:this.modelList,'carModelId','name');
                            dropDownList.modelList= (this.modelList == null)?[]:this.modelList;
                            form.render('select');
                        }

                    });
                }
            });
            form.on('select(carModelId)', function(data)
            {
                if(data.value !='')
                {
                    if(dropDownList.modelList.length == 0)
                    {
                        //车系没有数据

                    }
                    else{
                        $(dropDownList.modelList).each(function()
                        {
                            if(this.carModelId == data.value)
                            {
                                console.log(this.attributeList==null?[]:this.attributeList);
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
            this.tableObj = table.render({
                elem: '#demo',
                height: 530,
                url: '/management/v1/vehicle/listAssigned',
                method:'post',
                contentType:"application/json",
                page: true,
                where:{
                    city:$.getUrlData().city
                },
                request: {
                    pageName: 'pageIndex',
                    limitName: 'pageSize',
                    
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
                    {field: 'carNumber', title: '车牌',sort: false,align: 'right'},
                    {field: 'engineNumber', title: '发动机号',sort: false,align: 'right'},
                    {field: 'carVerifyCode', title: '车辆识别代号',sort: false,align: 'right'},
                    {field: '', title: '操作', width:'100', sort: false,align: 'left',templet: function(d){
                        return '<button class="layui-btn layui-btn-xs" lay-event="ele_show" ><i class="layui-icon">&#xe608;</i> 选择</button>';
                           

                    }}
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
                    parent.window.getDriverCar(obj.data)
                    _this.eventFun.closeLayer();
                }
            });
        }
    };

    driverList.defaultEvent();
    driverList.eventFun.getBrandsTree()
    driverList.toolBar();
    driverList.getData();
});