layui.use(['common','table', 'layer', 'dict', 'permission'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var table = layui.table;
    var form = layui.form;
    var dropDownList={
        cityList:{},
    };
    var specialTimeinterval = {
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
                    $.appendSelect('city',res.content,'code','name','440100');
                    form.render('select');
                    res.content.forEach(function(ele){                       
                        dropDownList.cityList[ele.code]=ele.name
                    })
                    
                }
            });

            
        },
        getTimeData:function(code){
            $.postApi('/management/v1/timeinterval/list',{
                "cityCode": code||$('#city').val()
            },function(res)
            {
                if(res.code == 0)
                {
                    
                    specialTimeinterval.getData(res.content);
                }
            });
        },
        searchEvent:function()
        {
            specialTimeinterval.getTimeData();
        },
        defaultEvent:function()
        {
            var _this = this;
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
        timeFormat:function(_data){
            if(_data<10){
                return "0"+_data
            }else{
                return _data
            }
        },
        getData:function(_data)
        {
            var _this=this;
            //第一个实例
            this.tableObj = table.render({
                elem: '#demo',
                height: 522,
                data: _data,
                page: true,
                cols: [[
                    {field: 'cityName', title: '适用城市',sort: false},
                    {field: 'timeIntervalName', title: '时段名称',sort: false},
                    {field: '时段', title: '时段', sort: false,templet:function(d){
                        return d.hourEndTime==-1?'——':_this.timeFormat(d.hourStartTime)+':'+_this.timeFormat(d.minuteStartTime)+'~'+_this.timeFormat(d.hourEndTime)+':'+_this.timeFormat(d.minuteEndTime)
                    }},
                    {field: '', title: '操作', width:'220', sort: false,templet: function(d){
                            return '<button class="layui-btn layui-btn-xs '+(d.hourEndTime==-1?"layui-btn-disabled":"")+'" lay-event="ele_edit" permission="sys:discount:update" '+(d.hourEndTime==-1?"disabled":"")+'><i class="layui-icon">&#xe615;</i> 编辑</button>'+
                            '<button class="layui-btn layui-btn-xs" lay-event="ele_show" ><i class="layui-icon">&#xe6b1;</i> 查看</button>' 

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
                        _this.eventFun.addLayer('./setTimeinterval.html','','新建特殊时段信息');
                        break;
                };
            });
            table.on('tool(test)', function(obj){
                if(obj.event =='ele_edit')
                {
                    _this.eventFun.addLayer('./setTimeinterval.html',{
                        'id':obj.data.id
                    },'特殊时段信息');
                    
                    window.timeintervalData=obj.data;
                } 
                else if(obj.event =='ele_show')
                {
                    _this.eventFun.addLayer('./setTimeinterval.html',{
                        'readonly':'readonly',
                        'id':obj.data.id
                    },'特殊时段信息');
                    window.timeintervalData=obj.data;
                }
            });
        }
    };

    specialTimeinterval.defaultEvent();
    specialTimeinterval.toolBar();
    specialTimeinterval.getSelectData();
    specialTimeinterval.getTimeData('440100');
    
});