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
        searchEvent:function()
        {
            this.tableObj.reload({
                where:{
                    accountName:$('#accountName').val()==''?null:$('#accountName').val(),
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
        },
        getData:function()
        {
            console.log(1)
            this.tableObj = table.render({
                elem: '#demo',
                height: 330,
                url: '/management/v1/carrent/list',
                method:'post',
                contentType:"application/json",
                page: true,
                where:{
                    city:$.getUrlData().city,

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
                    {field: 'chineseName', title: '中文名称',sort: false,align: 'right'},
                    {field: 'englishName', title: '英文名称',sort: false,align: 'right'},
                    {field: 'accountName', title: '公司名称',sort: false,align: 'right'},
                    {field: '', title: '操作', width:'100', sort: false,align: 'left',templet: function(d){
                            return '<button class="layui-btn layui-btn-xs" lay-event="ele_show" ><i class="layui-icon">&#xe608;</i> 选择</button>';
                        }}
                ]],
            });
        },
        toolBar:function()
        {
            table.on('tool(test)', function(obj){
                if(obj.event =='ele_show')
                {
                    parent.window.$("#rentCompanyId").val(obj.data.chineseName).attr('data-id',obj.data.rentCompanyId)
                    var index = parent.layer.getFrameIndex(window.name);
                    parent.layer.close(index);
                }
            });
        }
    };

    driverList.defaultEvent();
    driverList.toolBar();
    driverList.getData();
});