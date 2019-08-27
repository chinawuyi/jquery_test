layui.use(['common', 'layer', 'table', 'ztreeMenu', 'form','validate'], function(){
  var layer = layui.layer
  var permission = layui.permission
  var common = layui.common
  var table = layui.table
  var ztreeMenu = layui.ztreeMenu
  var form = layui.form
  var validate=layui.validate

  var role = {
    tableIns: (function(){

      var ins = table.render({
        elem: '#rolelist',
        url: '/management/v1/roles/query',
        method: 'post',
        height: 522,
        contentType:"application/json",
        page: true,
        request: {
          pageName: 'pageIndex',
          limitName: 'pageSize'
        },
        parseData: function(res) {
          return {
            "code": res.code, //解析接口状态
            "msg": res.message, //解析提示文本
            "count": res.content.total, //解析数据长度
            "data": res.content.data //解析数据列表
          };
        },
        cols: [[
          {field:'name', title: '角色', align: 'center', sort: true, width: '20%'},
          {field:'description', title: '描述'}, //width 支持：数字、百分比和不填写。你还可以通过 minWidth 参数局部定义当前单元格的最小宽度，layui 2.2.1 新增
          {field:'updateTime', title: '修改时间', sort: true, width: '20%', templet: function(res){
            return new Date(res.updateTime).Format('yyyy-MM-dd hh:mm:ss')
          }},
          {field:'', title: '操作', align: 'center', width: '10%', templet: function(res){
            var tem = [];

            tem.push("<button class='layui-btn layui-btn-xs' permission='sys:role:add' title='编辑' lay-event='edit'><i class='layui-icon'>&#xe642;</i></button>")
            tem.push("<button class='layui-btn layui-btn-xs' permission='sys:role:del' title='删除' lay-event='del'><i class='layui-icon'>&#xe640;</i></button>")

            return tem.join('')
          }}
        ]],
        done: function() { // 检查操作权限
          //$.publish('permission:check', 'rolelist')
        }
      })

      // 搜索按钮
      $('#searchBt').click(function(e){
        var params={
          params:{}
        }
        params.params.name = $('#name').val() || null
        ins.reload({
          where: params
        })
      })

      // 添加按钮
      // @TODO:覆盖样式
      $('#addBt').click(function(e){
        layer.open({
          type: 1,
          title: '添加角色',
          content: $('#addLayer').html(),
          area: ['800px', '500px'],
          maxmin: true,
          success: function() {
            $.fn.zTree.init($("#treeDemo"), ztreeMenu.getSettting(), ztreeMenu.getMenuTree());
          }
        })

        role.add('post')
      })

      table.on('tool(rolelist)', function(obj){
        var data = obj.data
        if (obj.event == 'edit') {
          layer.open({
            type: 1,
            title: '编辑角色',
            content: $('#addLayer').html(),
            area: ['800px', '500px'],
            maxmin: true,
            success: function() {
              $.fn.zTree.init($("#treeDemo"), ztreeMenu.getSettting(), ztreeMenu.getMenuTree());

              form.val('addrole', {
                name: data.name,
                description: data.description
              })
              ztreeMenu.initMenuDatas(data.id)

              role.add('post',data.id)
            }
          })
        }
        else if (obj.event == 'del') {
          role.del(data.id)
        }
      })

      //ins.params = params
      return ins
    }()),
    add: function(type,roleId) {
      form.on('submit(addrole-btn)', function(data){
        data.field.permissionIds = ztreeMenu.getCheckedMenuIds()

        $.ajax({
          url: '/management/v1/roles/add',
          type: type,
          contentType: "application/json",
          data: roleId?JSON.stringify(Object.assign({id:roleId},data.field)):JSON.stringify(data.field),
          success: function(data) {
            layer.msg("操作成功", {shift: -1, time: 1000}, function(){
              location.href = "role_list.html";
            });
          }
        })

        return false
      })
    },
    del: function(id) {
      layer.confirm('确定要删除吗？', {
        btn : [ '确定', '取消' ]
      }, function() {
        $.ajax({
          type: 'post',
          url: '/management/v1/roles/delete/'+id,
          success : function(data) {
            layer.msg("删除成功", {shift: -1, time: 1000}, function(){
              location.href = "role_list.html";
            });
          }
        });
        
        layer.close(1);
      });
    }
  }
  validate.verify()
})