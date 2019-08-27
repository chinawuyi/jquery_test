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
        driverStatusList:{},
        cityList:{},
        genderList: {}
    }
    var driverList = {
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
                    title:titleName||'司机',
                    content: action,
                    area: ['900px', ($(window).height()-80)+'px'],
                    maxmin: true
                });
            },
            driverStatus:function(data,statusTxt)
            {
                var _this = this;
                $.postApi('/management/v1/driver/updateStatus',{
                    "driverId": data.driverId,
                    "status": data.status<0?1:(data.status==2?1:(statusTxt=='静默'?2:'-1'))
                },function(res)
                {
                    if(res.code == 0)
                    {
                        if(data.status==-1){
                            layer.msg('司机'+data.name+'已冻结');
                        }else if(data.status>0){
                            layer.msg('司机'+data.name+'已'+statusTxt);
                        }
                        driverList.tableObj.reload({
                            where:{
                                driverType:$('#driverType').val()==''?null:$('#driverType').val(),
                                name:$('#name').val()==''?null:$('#name').val(),
                                phone:$('#phone').val()==''?null:$('#phone').val(),
                            }
                        });
                    }
                });
            },
            setRate:function(dom,val){
                rate.render({
                    elem: dom,
                    value:Number(val),
                    half:true,
                    readonly:true
                  })
            },
            openExtLayer:function(id){
                driverList.eventFun.addLayer('./driver_ext.html',{
                    'id':id
                },'司机扩展信息');
            }
        },
        getSelectData:function(){
            var _this=this
            /*司机类型*/
            $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                "categoryCode": "DRIVER_TYPE"
            },function(res)
            {
                if(res.code == 0)
                {
                    $.appendSelect('driverType',res.content,'value','name');
                    form.render('select');
                    res.content.forEach(function(ele){                       
                        dropDownList.driverTypeList[ele.value]=ele.name
                    })
                }
            });
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
            /*司机状态*/
            $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                "categoryCode": "DRIVER_STATUS"
            },function(res)
            {
                if(res.code == 0)
                {
                    $.appendSelect('status',res.content,'value','name');
                    res.content.forEach(function(ele){                       
                        dropDownList.driverStatusList[ele.value]=ele.name
                    })
                    form.render('select');
                    driverList.getData();
                }
            });
            
            // 性别
			$.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode', {
				'categoryCode': "GENDER",
			}, function (res) {
				if (res.code == 0) {
					$.appendSelect('gender', res.content, 'value', 'name')
					form.render('select')
					res.content.forEach(function (ele) {
						dropDownList.genderList[ele.value] = ele.name
					})
				}
			})
        },
        formatParams:function(object){
            let tmpObject = {};
            for(let o in object) {
                if(object[o]!='') {
                tmpObject[o] = $.trim(object[o]);
                }
            }
            return tmpObject;
        },
        searchEvent:function()
        {
            let _this=this
            form.on('submit(driverSearch)', function(data){
                console.log(data.field)
                _this.tableObj.reload({
                    where:_this.formatParams(data.field),
                    page: {
                        curr: 1
                      }
                });
                return false;
              });
            // this.tableObj.reload({
            //     where:{
            //         driverType:$('#driverType').val()==''?null:$('#driverType').val(),
            //         name:$('#name').val()==''?null:$('#name').val(),
            //         phone:$('#phone').val()==''?null:$('#phone').val(),
            //         city:$('#city').val()==''?null:$('#city').val()
            //     },
            //     page: {
            //         curr: 1
            //       }
            // });
        },
        defaultEvent:function()
        {
            var _this = this;
            $('#searchBt').click(function(){
                _this.searchEvent();
            });
        },
        getData:function()
        {
            console.log(dropDownList)
            //第一个实例
            this.tableObj = table.render({
                elem: '#demo',
                height: 530,
                url: '/management/v1/driver/queryListByFilter',
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
                    {field: 'name', title: '姓名',sort: false,align: 'right'},
                    {field: 'gender', title: '性别',sort: false,align: 'right',
                        templet:function(d){
                            return d.gender==1 || d.gender==0?dropDownList.genderList[d.gender]:""
                        }
                    },
                    {field: 'phone', title: '手机号',sort: false,align: 'right'},
                    {field: 'driverStar', title: '星级',sort: false,align: 'right',
                        templet:function(d){                      
                            return '<span class="driverStar driverStar'+d.LAY_INDEX+'" starLevel=".driverStar'+d.LAY_INDEX+'" starNum="'+d.driverStar+'"></span>'
                        }
                    },
                    {field: 'driverType', title: '司机类型',sort: false,align: 'right',
                        templet:function(d){
                            return d.driverType?dropDownList.driverTypeList[d.driverType]:""
                        }
                    },
                    {field: 'city', title: '工作城市',sort: false,align: 'right',
                        templet:function(d){
                            return d.city?dropDownList.cityList[d.city]:""
                        }
                    },
                    // {field: 'manageName', title: '司管',sort: false,align: 'right'},
                    {field: 'status', title: '司机状态',sort: false,align: 'right',templet:function(d){
                        return dropDownList.driverStatusList[d.status]
                    }},
                    {field: '', title: '操作', width:'410', sort: false,align: 'left',templet: function(d){
                        return '<button class="layui-btn layui-btn-xs" lay-event="ele_show" permission="sys:driver:querydetail"><i class="layui-icon">&#xe615;</i> 查看</button>'+
                            '<button class="layui-btn layui-btn-xs" lay-event="ele_update" permission="sys:driver:update"><i class="layui-icon">&#xe642;</i> 编辑</button>'+
                            '<button class="layui-btn layui-btn-danger layui-btn-xs '+((d.status==1||d.status==2)?"":"layui-btn-disabled")+'" permission="sys:driver:silent" lay-event="ele_silent" '+((d.status==1||d.status==2)?"":"disabled")+'><i class="layui-icon">&#xe645;</i> '+(d.status!=2?'静默':'解除静默')+'</button>'+
                            '<button class="layui-btn layui-btn-danger layui-btn-xs '+((d.status==-1||d.status==1)?"":"layui-btn-disabled")+'" permission="	sys:driver:freeze" lay-event="ele_freeze" '+((d.status==-1||d.status==1)?"":"disabled")+'><i class="layui-icon">&#xe6b1;</i> '+(d.status!=-1?'冻结':'启用')+'</button>'+
                            '<button class="layui-btn layui-btn-normal layui-btn-xs " lay-event="ele_statusLog" ><i class="layui-icon">&#xe615;</i> 状态日志</button>'
                    }}
                ]],
                toolbar: '#toolbarDemo',
                done:function(){
                    $(".driverStar").each(function(){
                        driverList.eventFun.setRate($(this).attr("starLevel"),$(this).attr("starNum"))
                    })
                    
                }
            });
            
        },
        
        setDriverFreeze(obj,cont){
            var _this=this
            _this.eventFun.addLayer('./driver_silent.html',{
                'id':obj.data.driverId,
                'carId':obj.data.carId,
                'phone':obj.data.phone,
                'name':obj.data.name,
                'readonly':obj.data.status,
                'disablesDateStart':cont?cont.disablesDateStart:'',
                'disablesDateEnd':cont?cont.disablesDateEnd:'',
                'disablesReason':cont?cont.disablesReason:'',
                'status':obj.data.status==1?'-1':'1'
            },'司机状态变更');
            
        },
        toolBar:function()
        {
            var _this = this;
            table.on('toolbar(test)', function(obj){
                switch(obj.event)
                {
                    case 'add':
                        _this.eventFun.addLayer('./driver_add.html');
                        break;
                };
            });
            table.on('tool(test)', function(obj){
                if(obj.event =='ele_show')
                {
                    _this.eventFun.addLayer('./driver_info.html',{
                        'id':obj.data.driverId,
                        'readonly':'readonly'
                    },'查看司机信息');
                }else if(obj.event =='ele_update')
                {
                    _this.eventFun.addLayer('./driver_info.html',{
                        'id':obj.data.driverId
                    },'编辑司机信息');
                }
                else if(obj.event =='ele_silent')
                {   
                    $.getApi('/management/v1/driver/status/info/'+obj.data.driverId,{
                    },function(res)
                    {
                        var cont=res.content
                        if(res.code==0&&cont&&obj.data.status=='1')
                        {
                            layer.msg('该司机当前已经被设置了'+new Date(cont.disablesDateStart*1000).Format('yyyy-MM-dd hh:mm:ss')+'-'+new Date(cont.disablesDateEnd*1000).Format('yyyy-MM-dd hh:mm:ss')+'时间段静默，请勿重复操作！')
                        }else{
                            
                            _this.eventFun.addLayer('./driver_silent.html',{
                                'id':obj.data.driverId,
                                'carId':obj.data.carId?obj.data.carId:'',
                                'phone':obj.data.phone,
                                'name':obj.data.name,
                                'readonly':obj.data.status,
                                'disablesDateStart':cont?cont.disablesDateStart:'',
                                'disablesDateEnd':cont?cont.disablesDateEnd:'',
                                'disablesReason':cont?cont.disablesReason:'',
                                'status':obj.data.status==1?'2':'1'
                            },'司机状态变更');
                        }
                    });
                    
                }
                else if(obj.event =='ele_freeze')
                {
                    $.getApi('/management/v1/driver/status/info/'+obj.data.driverId,{
                    },function(res)
                    {
                        var cont=res.content
                        if(res.code==0&&cont&&obj.data.status=='1')
                        {
                            layer.open({
                                title: '操作确认',
                                content: '该司机当前已经被设置了'+new Date(cont.disablesDateStart*1000).Format('yyyy-MM-dd hh:mm:ss')+'-'+new Date(cont.disablesDateEnd*1000).Format('yyyy-MM-dd hh:mm:ss')+'时间段静默，若要继续将司机冻结，则定时静默将会取消！',
                                yes: function(index,layero){
                                    driverList.setDriverFreeze(obj,cont)
                                    layer.close(index);
                                  }
                              });
                        
                        }else{
                            _this.setDriverFreeze(obj,cont)
                        }
                        
                    });
                   
                    
                   
                }
                else if(obj.event =='ele_statusLog')
                {
                    _this.eventFun.addLayer('./driver_log.html',{
                        'id':obj.data.driverId
                    },'状态日志');
                }
            });
        }
    };
    
    driverList.defaultEvent();
    driverList.toolBar();
    driverList.getSelectData()
    window.openExtLayer=driverList.eventFun.openExtLayer
});