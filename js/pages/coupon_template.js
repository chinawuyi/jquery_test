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
    var couponTemplate = {
        tableObj:null,
        eventFun:{
            addLayer:function(urlPath,options,titleName)
            {
                var action = urlPath;
                if(options)
                {
                    action = $.addUrlPro(action,options);
                }
                layer.open({
                    type: 2,
                    title:titleName,
                    content: action,
                    area: ['800px', ($(window).height()-80)+'px'],
                    maxmin: true
                });
            },
            couponStatus:function(data){
                $.postApi('/management/v1/coupon/rule/'+(data.enable=='1'?'disable':'enable'),{
                    "couponRuleId": data.couponRuleId
                },function(res)
                {
                    if(res.code == 0)
                    {
                        layer.msg(data.enable=='1'?'已禁用':'已启用');  
                        $('#searchBt').click()
                    }
                });
            }
        },
        getSelectData:function(){
            var _this=this
            /*优惠券类型*/
            $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                "categoryCode": "COUPON_TYPE"
            },function(res)
            {
                if(res.code == 0)
                {
                    $.appendSelect('couponType',res.content,'value','name');
                    form.render('select');
                }
            });
            /*优惠券状态*/
            $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
                "categoryCode": "COUPON_STATUS"
            },function(res)
            {
                if(res.code == 0)
                {
                    $.appendSelect('status',res.content,'value','name');
                    form.render('select');
                    
                }
            });
        },
        searchEvent:function()
        {
            this.tableObj.reload({
                where:{
                    couponName:$("#couponName").val()||null,
                    couponRuleId:$("#couponRuleId").val()||null,
                    couponType:$("#couponType").val()||null,
                    status:$("#status").val()||null
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
        },
        getData:function()
        {
            //第一个实例
            this.tableObj = table.render({
                elem: '#demo',
                height: 522,
                url: '/management/v1/coupon/rule/query/paging',
                method:'post',
                contentType:"application/json",
                page: true,
                request: {
                    pageName: 'pageNum',
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
                    {field: 'couponRuleId', title: '模板ID',sort: false},
                    {field: 'couponTypeText', title: '优惠券类型',sort: false},
                    {field: 'modeText', title: '失效类型',sort: false},
                    {field: 'couponName', title: '优惠券名称',sort: false},
                    {field: 'remark', title: '折扣数值', sort: false,templet:function(d){
                        if(d.couponType==1){
                            return '免单'
                        }else if(d.couponType==2){
                            return '满'+d.limitAmount+'减'+d.couponValue
                        }else if(d.couponType==3){
                            return d.couponValue/10+'折'
                        }else if(d.couponType==4){
                            return d.couponValue+'代金券'
                        }
                    }},
                    {field: 'remainingQuantity', title: '剩余数量', sort: false},
                    {field: 'startTime', title: '使用说明',sort: false,templet:function(d){
                            return ''
                        }},
                    {field: 'endTime', title: '失效日期',sort: false,templet:function(d){
                            return d.endTime?new Date(d.endTime*1000).Format('yyyy-MM-dd hh:mm:ss'):'';
                        }},
                    {field: 'statusText', title: '状态',sort: false,templet:function(d){
                        return d.enable==1?d.statusText:d.enableText
                    }},
                    {field: '', title: '操作', width:'260', sort: false,templet: function(d){
                            return '<button class="layui-btn layui-btn-xs" lay-event="ele_update" permission="sys:coupontemplate:create"><i class="layui-icon">&#xe642;</i> 编辑</button>' +
                                '<button class="layui-btn layui-btn-xs jsupdate '+(d.enable==1?'':'layui-btn-disabled')+'"  lay-event="ele_send" '+(d.enable==1?'':'disabled')+'><i class="layui-icon">&#xe609;</i> 发券</button>'+
                                '<button class="layui-btn layui-btn-warm layui-btn-xs jsupdate" lay-event="ele_batch" ><i class="layui-icon">&#xe615;</i> 批次</button>'+
                                '<button class="layui-btn layui-btn-danger layui-btn-xs jsupdate" lay-event="ele_enable" ><i class="layui-icon">'+(d.enable==1?'&#x1006;':'&#xe605;')+'</i> '+(d.enable==1?'禁用':'启用')+'</button>';

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
                        _this.eventFun.addLayer('./coupon_template_add.html',"",'新建优惠券模板');
                        break;
                };
            });
            table.on('tool(test)', function(obj){
                if(obj.event =='ele_update')
                {
                    _this.eventFun.addLayer('./coupon_template_add.html',{
                        'id':obj.data.couponRuleId
                    },'修改优惠券模板');
                }
                else if(obj.event =='ele_send')
                {
                    _this.eventFun.addLayer('./coupon_send.html',{
                        'id':obj.data.couponRuleId     
                    },'发券');
                    
                }else if(obj.event=='ele_batch'){
                    _this.eventFun.addLayer('./coupon_batch.html',{
                        'id':obj.data.couponRuleId
                    },'优惠券批次');
                }else if(obj.event=='ele_enable'){
                    var statusTxt='启用'
                    if(obj.data.enable==1){
                        statusTxt='禁用'
                    }
                    layer.open({
                        title: '优惠券模板状态确认',
                        content: '确定'+statusTxt+'此优惠券模板吗？',
                        yes: function(index,layero){
                            _this.eventFun.couponStatus(obj.data)
                            layer.close(index);
                          }
                      });
                }
            });
        }
    };

    couponTemplate.defaultEvent();
    couponTemplate.toolBar();
    couponTemplate.getSelectData()
    couponTemplate.getData();
});