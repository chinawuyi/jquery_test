layui.use(['common', 'layer', 'ztreeMenu'], function(){
  var common = layui.common;
  var layer = layui.layer;
  var ztreeMenu = layui.ztreeMenu;
  $.fn.zTree.init($("#treeDemo"), ztreeMenu.getSettting(), ztreeMenu.getMenuTree());
  initData();

  function initData(){
    var id = common.getUrlParam("id");
    if(id != ""){
      $.ajax({
        type : 'get',
        url : '/management/v1/roles/'+id,
        async : false,
        success : function(data) {
          $("#id").val(data.id);
          $("#name").val(data.name);
          $("#description").val(data.description);
        }
      });
      
      ztreeMenu.initMenuDatas(id);
    }
  }
  
  
  $('#form').bootstrapValidator();

  $('.form-actions .saveBt').click(function(e){
    add()
  })
  
  function add() {
    var bootstrapValidator = $("#form").data('bootstrapValidator');
    bootstrapValidator.validate();
    if(!bootstrapValidator.isValid()){
     return;
    }
    
    var formdata = $("#form").serializeObject();
    formdata.permissionIds = ztreeMenu.getCheckedMenuIds();

    $.ajax({
      type : 'post',
      url : '/management/v1/roles',
      contentType: "application/json; charset=utf-8",  
      data : JSON.stringify(formdata),
      success : function(data) {
        layer.msg("成功", {shift: -1, time: 1000}, function(){
          location.href = "role_list.html";
        });
      }
    });
  }
});