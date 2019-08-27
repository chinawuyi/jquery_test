layui.use(['common','table', 'layer', 'dict', 'permission'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var form = layui.form;
    var table = layui.table;
    var dropDownList={
        productTypeList:{},
        statusList:{},
        cityList:{},
        carTypeList:{}
    };

    var vehicleType = {
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
                    title:titleName||'计价',
                    content: action,
                    area: ['900px', ($(window).height()-80)+'px'],
                    maxmin: true
                });
            },
            //禁用计价包
            disablePkg:function(data)
            {
                $.postApi('/management/v1/charge/pkg/disabel',{//接口拼写问题disable
                    'chargePkgId':data.chargePkgId
                },function(res){
                    if(res.code==0){
                    layer.msg('计价包'+data.chargePkgName+'已禁用');
                    vehicleType.searchEvent();
                    }
                });
            },
            //启用计价包
            enablePkg:function(data)
            {
                $.postApi('/management/v1/charge/pkg/enable',{
                    'chargePkgId':data.chargePkgId
                },function(res){
                    if(res.code==0){
                    layer.msg('计价包已启用');
                    vehicleType.searchEvent();
                    }
                });
            },
            //启用计价包
            disablePkg:function(data)
            {
                $.postApi('/management/v1/charge/pkg/disable',{
                    'chargePkgId':data.chargePkgId
                },function(res){
                    if(res.code==0){
                        layer.msg('计价包已禁用');
                        vehicleType.searchEvent();
                    }
                });
            },
            //复制一条数据
            newDataByCopy:function(data)
            {   
                $.postApi('/management/v1/charge/pkg/save',{
                    pkg:{
                        "chargePkgName":data.pkg.chargePkgName,
                        "carTypeId": data.pkg.carTypeId,
                        "city": data.pkg.city,
                        "productTypeId": data.pkg.productTypeId,
                        "effectiveTime":new Date(data.pkg.effectiveTime.slice(0,16)).getTime(),
                        "invalidTime":new Date(data.pkg.invalidTime.slice(19,35)).getTime(),
                        "remark":data.pkg.remark
                    },
                    rule:{
                        basic:{
                            'feeStart':data.rule.basic.feeStart,
                            'freeDistance':data.rule.basic.freeDistance,
                            'freeTime':data.rule.basic.freeTime
                        },
                        longDistanceList:longDistanceData,
                        segmentList:segmentData
                    }
                },function(res){
                        if(res.code == 0){
                            layer.msg('复制计价方案无效，请编辑后在启用');
                            window.setTimeout(function(){
                                _this.closeLayer();
                                parent.window.$('#searchBt').click();
                            },1000);
                        }
                    }
                );
            }

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
            form.on('submit(searchLog)', function(data){
                console.log(_this.formatParams(data.field))
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
            //         "chargePkgName":$('#chargePkgName').val()==''?null:$('#chargePkgName').val(),
            //         "productTypeId":$('#productTypeId').val()==''?null:$('#productTypeId').val(),
            //         // "chargePkgType":$('#chargePkgType').val()==''?null:$('#chargePkgType').val(),
            //         "city":$('#city').val()==''?null:$('#city').val(),
            //         "scope":$('#scope').val()==''?null:$('#scope').val(),
            //         "carTypeId":$('#carTypeId').val()==''?null:$('#carTypeId').val(),
            //         "status":$('#status').val()==''?null:$('#status').val()
            //     },
            //     page: {
            //         curr: 1
            //     }
            // });
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
                url: '/management/v1/charge/pkg/list',
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
                    {field: 'chargePkgName', title: '计价方案名称', sort: true, },
                    {field: 'productTypeId', title: '产品类型', sort: true,
                        templet:function(d){
                            return d.productTypeId?dropDownList.productTypeList[d.productTypeId]:""
                        }
                    },
                    {field: 'city', title: '城市', sort: true,
                        templet:function(d){
                            return d.city?dropDownList.cityList[d.city]:""
                        }
                    },
                    {field: 'chargePkgType', title: '属性', sort: true,templet: function(d){
                        return d.chargePkgType==0?'默认计价':'特殊计价';
                    }},
                    {field: 'carTypeId', title: '服务车型', sort: true,
                        templet:function(d){
                            return d.carTypeId?dropDownList.carTypeList[d.carTypeId]:""
                        }    
                    },
                    {field: 'status', title: '状态', sort: false,templet: function(d){
                        return d.status==1?'启用':'禁用';
                    }},
                    {field: '', title: '操作', width:'300', sort: false,templet: function(d){
                            var textbtn = d.status!=1?'启用':'禁用';
                            var chargePkgType = d.chargePkgType;
                            if(chargePkgType == 0)
                            {
                                var disableclass = d.status != 1? '':'layui-btn-disabled';
                            }
                            else{
                                var disableclass = d.status != 1? '':'';
                            }

                            return '<button class="layui-btn layui-btn-xs"   lay-event="ele_show"  ><i class="layui-icon">&#xe615;</i> 查看</button>' +
                                '<button class="layui-btn layui-btn-xs jsupdate"  lay-event="ele_copy" ><i class="layui-icon">&#xe60b;</i> 复制</button>'+
                                '<button class="layui-btn layui-btn-danger layui-btn-xs jsupdate '+disableclass+'"  lay-event="ele_status" ><i class="layui-icon">&#xe605;</i>'+textbtn+'</button>';
                        }}
                ]],
                toolbar: '#toolbarDemo'
                //defaultToolbar:['filter', 'print', 'exports']
            });
        },
        //获取选择数据
        getSelectData:function(data){
            //获取城市列表
            $.postApi('/management/v1/businesscity/cityList',{
                "type":"2"
            },
            function(res)
            {
                $.appendSelect('city',res.content==null?[]:res.content,'code','name',data?data.city:null);
                res.content.forEach(function(ele){                       
                    dropDownList.cityList[ele.code]=ele.name
                })
                form.render('select');
            }
            );
            //获取产品类型列表
            $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                "categoryCode": "PRODUCT_TYPE"
            },
            function(res)
            {
                $.appendSelect('productTypeId',res.content==null?[]:res.content,'value','name',data?data.productTypeId:null);
                res.content.forEach(function(ele){                       
                    dropDownList.productTypeList[ele.value]=ele.name
                })
                form.render('select');
            }
            );
            //获取车型列表
            $.postApi('/management/v1/cartype/list',{

                "pageIndex": "1",
                "pageSize": "200"
            },
            function(res)
            {
                console.log(res.content.data);
                $.appendSelect('carTypeId',res.content.data==null?[]:res.content.data,'carTypeId','name',res.content.data?res.content.data.carTypeId:null);
                res.content.data.forEach(function(ele){                       
                    dropDownList.carTypeList[ele.carTypeId]=ele.name
                })
                form.render('select');
            }
            );
        },
        toolBar:function()
        {
            var _this = this;
            table.on('toolbar(test)', function(obj){
                switch(obj.event)
                {
                    case 'add':
                        _this.eventFun.addLayer('./charge_add.html');
                        break;
                };
            });
            table.on('tool(test)', function(obj){

                if(obj.event =='ele_update')
                {
                    // console.log(obj);
                    _this.eventFun.addLayer('./charge_update.html',{
                        'id':obj.data.chargePkgId
                    },'编辑标准计价包');
                }
                else if(obj.event =='ele_show')
                {
                    console.log(obj.data.chargePkgId);
                    _this.eventFun.addLayer('./charge_update.html',{
                        'id':obj.data.chargePkgId,
                        'readonly':'readonly'
                    },'查看标准计价包');
                }
                else if(obj.event =='ele_copy')
                {
                    console.log(obj.data.chargePkgId);
                    var copyData = [];
                    _this.eventFun.addLayer('./charge_add.html',{
                        'id':obj.data.chargePkgId
                    },'复制标准计价包');
                    // $.postApi('/management/v1/charge/pkg/info',{"chargePkgId":obj.data.chargePkgId},
                    //     function(res){
                    //         if(res.code == 0){
                    //             copyData = res.content;
                    //             copyData.pkg.chargePkgName = res.content.pkg.chargePkgName += '副本';
                    //             console.log(copyData);
                    //             var longDistanceData = [];
                    //             var segmentData=[];
                    //             for(let e in copyData.rule.longDistanceList)
                    //             { 
                    //                 delete copyData.rule.longDistanceList[e].longDistancePriceId;
                    //             }
                    //             console.log(copyData.rule.longDistanceList);
                    //             longDistanceData = copyData.rule.longDistanceList;

                    //             for(let e in copyData.rule.segmentList)
                    //             { 
                    //                 delete copyData.rule.segmentList[e].segmentPriceId
                    //             }
                    //             segmentData = copyData.rule.segmentList;
                    //             console.log(copyData.rule.longDistanceList);
                    //             _this.eventFun.newDataByCopy(copyData);
                    //         }
                    //     }
                    // )
                    // _this.eventFun.addLayer('./charge_update.html',{
                    //     'id':obj.data.chargePkgId
                    // },'标准计价包计价规则');
                }
                else if(obj.event =='ele_status')
                {
                    if(obj.data.status!=1){
                        layer.open({
                            title: '计价包状态确认',
                            content: '计价方案启用后将直接生效，请慎重操作！',
                            yes: function(index,layero)
                            {
                                console.log(obj.data)
                                _this.eventFun.enablePkg(obj.data)
                                layer.close(index);
                            }
                        });
                    }
                    else if(obj.data.status == 1){
                        //特殊计价包
                        if(obj.data.chargePkgType == 1)
                        {
                            layer.open({
                                title: '计价包状态确认',
                                content: '计价方案禁用后将直接影响前端计价功能，请谨慎操作',
                                yes: function(index,layero)
                                {
                                    console.log(obj.data)
                                    _this.eventFun.disablePkg(obj.data)
                                    layer.close(index);
                                }
                            });
                        }
                    }
                    // var statusTxt='启用'
                    // if(obj.data.status==1)
                    // {
                    //     statusTxt='禁用'
                    // }
                    // layer.open({
                    //     title: '计价包状态确认',
                    //     content: '确定'+statusTxt+'此计价包吗？',
                    //     yes: function(index,layero)
                    //     {
                    //         console.log(obj.data)
                    //         if(obj.data.status==1){
                    //             _this.eventFun.disablePkg(obj.data)
                    //         }else{
                    //             _this.eventFun.enablePkg(obj.data)
                    //         }
                    //         layer.close(index);
                    //     }
                    // });
                }
            });
        }
    };

    vehicleType.defaultEvent();
    vehicleType.getSelectData();
    vehicleType.getData();
    vehicleType.toolBar();
});