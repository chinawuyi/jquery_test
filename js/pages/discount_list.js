layui.use(['common','table', 'layer', 'dict', 'permission'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var table = layui.table;
    var form = layui.form;
    var dropDownList={
        cityList:{},
        carTypeList:{},
        statusList:{},
        productTypeList:{}
    };
    var discountList = {
        tableObj:null,
        eventFun:{
            addLayer:function(action,options,titleName)
            {
                if(options)
                {
                    action = $.addUrlPro(action,options);
                }
                layer.open({
                    type: 2,
                    title:titleName,
                    content: action,
                    area: ['800px', ($(window).height()-100)+'px'],
                    maxmin: true
                });
            },
        },
        getSelectData:function(){
            var _this=this
            /*城市列表*/
            $.postApi('/management/v1/businesscity/cityList',{
                "type": "2"
            },function(res)
            {
                if(res.code == 0)
                {
                    $.appendSelect('city',res.content,'code','name');
                    form.render('select');
                    res.content.forEach(function(ele){                       
                        dropDownList.cityList[ele.code]=ele.name
                    })
                }
            });
            /**车型列表 */
            $.postApi('/management/v1/cartype/list2',{
                "status": 1
            },function(res)
            {
                if(res.code == 0)
                {
                    $.appendSelect('carTypeId',res.content,'carTypeId','name');
                    form.render('select');
                    res.content.forEach(function(ele){                       
                        dropDownList.carTypeList[ele.carTypeId]=ele.name
                    })
                }
            });
            /*状态类型*/
            $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                "categoryCode": "BASE_DATA_STATUS"
            },function(res)
            {
                if(res.code == 0)
                {
                    $.appendSelect('status',res.content,'value','name');
                    res.content.forEach(function(ele){                       
                        dropDownList.statusList[ele.value]=ele.name
                    })
                    form.render('select');
                    
                }
            });
            /*产品类型*/
            $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                "categoryCode": "PRODUCT_TYPE"
            },function(res)
            {
                if(res.code == 0)
                {
                   
                    res.content.forEach(function(ele){                       
                        dropDownList.productTypeList[ele.value]=ele.name
                    })
                    discountList.getData();
                    
                }
            });
        },
        searchEvent:function()
        {
            this.tableObj.reload({
                where:{
                    city:$('#city').val()||null,
                    carTypeId:$('#carTypeId').val()||null,
                    status:$('#status').val()||null
                },
                page: {
                    curr: 1
                  }
            });
        },
        defaultEvent:function()
        {
            var _this = this;
            // $('#jsVehicleBrandAdd').click(function(){
            //     _this.eventFun.addLayer('');
            // });
            $('#searchBt').click(function(){
                _this.searchEvent();
            });
        },
        setDiscountStatus:function(data){
            $.postApi('/management/v1/discount/'+(data.status==0?'enable':'disable'),{
                "discountBasicId": data.discountBasicId,
                "operator":sessionStorage.getItem('operator')
            },function(res)
            {
                if(res.code == 0)
                {
                   
                    layer.msg(res.message)
                    $('#searchBt').click();
                    
                }
            });
        },
        getData:function()
        {
            //第一个实例
            this.tableObj = table.render({
                elem: '#demo',
                height: 522,
                url: '/management/v1/discount/baselist',
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
                    {field: 'city', title: '适用城市',sort: false,templet:function(d){
                        return d.city?dropDownList.cityList[d.city]:""
                    }},
                    {field: 'carTypeId', title: '适用车型',sort: false,templet:function(d){
                        return d.carTypeId?dropDownList.carTypeList[d.carTypeId]:''
                    }},
                    {field: 'productTypeId', title: '产品类型', sort: false,templet:function(d){
                        return d.productTypeId?dropDownList.productTypeList[d.productTypeId]:''
                    }},
                    {field: 'status', title: '状态', sort: false,templet:function(d){
                        return d.status||d.status==0?dropDownList.statusList[d.status]:''
                    }},
                    {field: '', title: '操作', width:'220', sort: false,templet: function(d){
                            return '<button class="layui-btn layui-btn-xs" lay-event="ele_edit" permission="sys:discount:update"><i class="layui-icon">&#xe615;</i> 编辑</button>'+
                            '<button class="layui-btn layui-btn-danger layui-btn-xs" lay-event="ele_enable" ><i class="layui-icon">&#xe6b1;</i> '+(d.status==1?'禁用':'启用')+'</button>' 

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
                        _this.eventFun.addLayer('./discount_add.html','','新建折扣信息');
                        break;
                };
            });
            table.on('tool(test)', function(obj){
                if(obj.event =='ele_edit')
                {
                    _this.eventFun.addLayer('./discount_detail.html',{
                        'id':obj.data.discountBasicId,
                        'city':obj.data.city
                    },'折扣信息编辑');
                    
                    window.discountDetailData=obj.data;
                } 
                else if(obj.event =='ele_enable')
                {
                    layer.open({
                        title: '操作确认',
                        content: '确定'+(obj.data.status==0?'启用':'禁用')+'该折扣？',
                        yes: function(index,layero){
                            discountList.setDiscountStatus(obj.data)
                            layer.close(index);
                          }
                      });
                }
            });
        }
    };

    discountList.defaultEvent();
    discountList.toolBar();
    discountList.getSelectData()
    
});