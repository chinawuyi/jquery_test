layui.use(['common', 'layer', 'laydate', 'dict', 'role'], function() {
  var layer = layui.layer
  var laydate = layui.laydate
  var common = layui.common
  var dict = layui.dict
  var role = layui.role
  var $ = layui.jquery
  
  laydate.render({
    trigger: 'click',
    elem: '#birthday'
  });
  
  dict.showDictSelect("sex", "sex");
  dict.showDictSelect("status", "userStatus");
  role.initRoles();
  
  initData();
  
  function initData(){
    var id = common.getUrlParam("id");
    if(id != ""){
      $.ajax({
        type : 'get',
        url : '/management/v1/users/'+id,
        async : false,
        success : function(data) {
          $("#id").val(data.id);
          $("#username").val(data.username);
          $("#nickname").val(data.nickname);
          $("#phone").val(data.phone);
          $("#telephone").val(data.telephone);
          $("#email").val(data.email);
          $("#birthday").val(data.birthday);
          $("#sex").val(data.sex);
          $("#status").val(data.status);
        }
      });
      
      role.initRoleDatas(id);
    }
  }
  
  $('#form').bootstrapValidator();
  
  function update() {
    var bootstrapValidator = $("#form").data('bootstrapValidator');
    bootstrapValidator.validate();
    if(!bootstrapValidator.isValid()){
     return;
    }
    
    var formdata = $("#form").serializeObject();
    formdata.roleIds = role.getCheckedRoleIds();

    $.ajax({
      type : 'put',
      url : '/management/v1/users',
      contentType: "application/json; charset=utf-8",  
      data : JSON.stringify(formdata),
      success : function(data) {
        layer.msg("修改成功", {shift: -1, time: 1000}, function(){
          location.href = "userList.html";
        });
      }
    });
  }
})