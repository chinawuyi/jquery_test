layui.use(['common', 'layer', 'permission', 'treetable', 'form', 'icon'], function() {
  var permission = layui.permission
  var common = layui.common
  var layer = layui.layer
  var treetable = layui.treetable
  var form = layui.form
  var icon = layui.icon

  var pers = permission.checkPermission();

  function initMenuList(callback){
    $.ajax({
      type : 'get',
      url : '/management/v1/permissions',
      contentType: "application/json; charset=utf-8",  
      async:false,
      success : function(data) {
        var res = []
        for(var i = 0; i < data.length; i++) {
          var item = data[i]
          item.pid = item.parentId
          res.push(item)
        }
        callback(res)
      }
    });
  }

  var menu = {
    tableIns: (function(){
      var ins
      initMenuList(function(data){
        ins = treetable.render({
          elem: '#menulist',
          data: data,
          field: 'name',
          cols: [
            {
              field: 'name',
              title: '名称',
              width: '25%',
            },
            {
              field: 'id',
              title: 'ID',
              width: '5%'
            },
            {
              field: 'href',
              title: '链接',
              width: '30%'
            },
            {
              field: 'permission',
              title: '权限',
              width: '15%',
            },
            {
              field: 'sort',
              title: '排序',
              width: '10%',
            },
            {
              field: 'actions',
              title: '操作',
              width: '15%',
              template: function(item){
                var tem = [];

                if ($.inArray('sys:menu:add', pers) >= 0) { // 编辑按钮
                  tem.push("<button class='layui-btn layui-btn-xs' title='编辑' lay-filter='edit'><i class='layui-icon'>&#xe642;</i></button>")
                }
                if ($.inArray('sys:menu:del', pers) >= 0) { // 删除按钮
                  tem.push("<button class='layui-btn layui-btn-xs' title='删除' lay-filter='del'><i class='layui-icon'>&#xe640;</i></button>")
                }

                return tem.join('')
              },
            },
          ]
        })

        treetable.on('treetable(edit)', function(opt){
          layer.open({
            type: 1,
            title: '编辑菜单',
            content: $('#addLayer').html(),
            area: ['800px', $(window).height() - 80 +'px'],
            maxmin: true
          })

          menu.add('put',opt.item.id)
          form.val('addmenu', {
            parentId: opt.item.pid,
            name: opt.item.name,
            css: opt.item.css,
            href: opt.item.href,
            type: opt.item.type,
            permission: opt.item.permission,
            sort: opt.item.sort
          })
          $('#cssImg').addClass(opt.item.css)
        })
        treetable.on('treetable(del)', function(opt){
          layer.confirm('确定要删除吗？', {
            btn : [ '确定', '取消' ]
          }, function() {
            $.ajax({
              url : '/management/v1/permissions/' + opt.item.id,
              type : 'delete',
              success : function(data) {
                location.reload();
              }
            });
          });
        })
        $('.menuadd').click(function(e){
          layer.open({
            type: 1,
            title: '添加菜单',
            content: $('#addLayer').html(),
            area: ['800px', $(window).height() - 80 +'px'],
            maxmin: true
          })

          menu.add('post')
        })
      })
    }()),
    getParentMenus: function(callback){ // 获取上级菜单
      $.ajax({
        url: '/management/v1/permissions/parents',
        type: 'get',
        contentType: "application/json",
        success: function(data) {
          var res = [
            '<option value="0">root</option>'
          ]
          for(var i = 0; i < data.length; i++) {
            var item = data[i]
            res.push(
              ['<option value="', item.id, '">', item.name, '</option>'].join('')
            )
          }

          callback(res.join(''))
        }
      })
    },
    add: function(type,permissionsId){
      type = type.toLowerCase()
      this.getParentMenus(function(options){
        $('#addmenu .parentId')[0].innerHTML = options

        form.render(null, 'addmenu')
        $('#addmenu .css-btn').click(function(e){
          icon.select(function(icon){
            form.val('addmenu', {
              css: icon
            })
            $('#cssImg')[0].className = ['fa ', icon].join('')
          })
          return false
        })
        form.on('submit(save)', function(opt){
          $.ajax({
            url: '/management/v1/permissions',
            type: type,
            contentType: "application/json",
            data : permissionsId?JSON.stringify(Object.assign({id:permissionsId},opt.field)):JSON.stringify(opt.field),
            success : function(data) {
              var msg = '操作成功'
              if (type == 'post') {
                msg = '添加成功'
              }
              else if (type == 'put') {
                msg = '修改成功'
              }
              layer.msg(msg, {shift: -1, time: 1000}, function(){
                location.href = "menu_list.html";
              });
            }
          })
          return false
        })
      })
    }
  }
});