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
                    name:$('#name').val()==''?null:$('#name').val()
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
            this.tableObj = table.render({
                elem: '#demo',
                height: 330,
                url: '/management/v1/dictcategory/list',
                method:'post',
                contentType:"application/json",
                page: true,
                where:{
                    name:$('#name').val()==''?null:$('#name').val(),
                    status:1,
                    isMultiLevel:1
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
                    {field: 'name', title: '分类名称',width:'25%',sort: false,align: 'right'},
                    {field: 'code', title: '分类编码',width:'25%',sort: false,align: 'right'},
                    {field: 'status', title: '状态', width:'25%', sort: false,templet:function(d){
                            if(d.status =='1')
                            {
                                return '启用';
                            }
                            else{
                                return '禁用';
                            }
                        }},
                    {field: '', title: '操作', width:'25%', sort: false,align: 'left',templet: function(d){
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
                    parent.window.$("#categoryId").val(obj.data.dictCategoryId)
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