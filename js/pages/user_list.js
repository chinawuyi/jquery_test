layui.use(['common','table', 'layer', 'dict', 'permission','laydate'], function() {
  var common = layui.common;
  var layer = layui.layer;
  var dict = layui.dict;
  var laydate = layui.laydate;
  var permission = layui.permission;
  var table = layui.table;
  var form = layui.form;
  var dropDownList={
      userStatusList:{}
  }
  var userList = {
      tableObj:null,
      eventFun:{
          addLayer:function(action,options)
          {
              if(options)
              {
                  action = $.addUrlPro(action,options);
              }
              layer.open({
                  type: 2,
                  title:'用户',
                  content: action,
                  area: ['800px', ($(window).height()-80)+'px'],
                  maxmin: true
              });
          },
      },
      getSelectData:function(){
          var _this=this
          /*司机状态*/
          $.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode',{
              "categoryCode": "DATA_STATUS"
          },function(res)
          {
              if(res.code == 0)
              {
                  $.appendSelect('status',res.content,'value','name');
                  res.content.forEach(function(ele){                       
                      dropDownList.userStatusList[ele.value]=ele.name
                  })
                  form.render('select');
                  userList.getData();
              }
          });
      },
      searchEvent:function()
      {
          this.tableObj.reload({
              where:{
                params:{
                    username:$('#username').val()||null,
                    nickname:$('#nickname').val()||null,
                    status:$('#status').val()||null
                }
                  
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
          console.log(dropDownList)
          //第一个实例
          this.tableObj = table.render({
              elem: '#demo',
              height: 530,
              url: '/management/v1/users/query',
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
                {field: 'id', title: '用户ID', align: 'center'},
                {field: 'username', title: '用户名', align: 'center'},
                {field: 'nickname', title: '昵称'},
                {field: 'phone', title: '手机号'},
                {field: 'email', title: '邮箱'},
                {field: 'status', title: '状态', templet: function (res) 
                  {
                      return dropDownList.userStatusList[res.status]
                    }
                },
                {field: '', title: '操作', align: 'center',width:'150' , templet:function(d){
                  return '<button class="layui-btn layui-btn-xs" lay-event="ele_show"  lay-event="ele_show"><i class="layui-icon">&#xe615;</i> 查看</button>' +
                         '<button class="layui-btn layui-btn-xs jsupdate"  lay-event="ele_update" ><i class="layui-icon">&#xe642;</i> 编辑</button>';

                }}
              ]],
              toolbar: '#toolbarDemo',
          });
          
      },
      toolBar:function()
      {
          var _this = this;
          table.on('toolbar(test)', function(obj){
              switch(obj.event)
              {
                  case 'add':
                      _this.eventFun.addLayer('./add_user.html');
                      break;
              };
          });
          table.on('tool(test)', function(obj){
              if(obj.event =='ele_show')
              {
                  _this.eventFun.addLayer('./add_user.html',{
                      'id':obj.data.id,
                      'readonly':'readonly'
                  });
              }else if(obj.event =='ele_update')
              {
                  _this.eventFun.addLayer('./add_user.html',{
                      'id':obj.data.id
                  });
              }
          });
      }
  };
  
  userList.defaultEvent();
  userList.toolBar();
  userList.getSelectData()
});