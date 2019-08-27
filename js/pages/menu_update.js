layui.use(['common', 'layer', 'ztreeMenu'], function(){
  var common = layui.common;
  var layer = layui.layer;
  var ztreeMenu = layui.ztreeMenu;
  
  ztreeMenu.initParentMenuSelect();
  
  var id = common.getUrlParam("id");
  initData();
  
  function initData(){
    if(id != ""){
      $.ajax({
        type : 'get',
        url : '/management/v1/permissions/'+id,
        async : false,
        success : function(data) {
          $("#id").val(data.id);
          $("#parentId").val(data.parentId);
          $("#name").val(data.name);
          var css = data.css;
          $("#css").val(css);
          $("#href").val(data.href);
          $("#type").val(data.type);
          $("#permission").val(data.permission);
          $("#sort").val(data.sort);
          
          if(css != ""){
            $("#cssImg").addClass("fa");
            $("#cssImg").addClass(css);
          }
        }
      });
      
    }
  }
  
  function selectCss(){
    layer.open({
        type: 2,
        title: "样式",
        area: ['800px', ($(window).height()-80)+'px'],
        maxmin: true,
        shadeClose: true,
        content: ['icon.html']
      });
  }
  
  function update() {
    if($("#parentId").val() == id){
      layer.msg("父级菜单不能是自己");
      return;
    }
    
    $('#form').bootstrapValidator();
    var bootstrapValidator = $("#form").data('bootstrapValidator');
    bootstrapValidator.validate();
    if(!bootstrapValidator.isValid()){
     return;
    }
    
    var formdata = $("#form").serializeObject();

    $.ajax({
      type : 'put',
      url : '/management/v1/permissions/',
      contentType: "application/json; charset=utf-8",  
      data : JSON.stringify(formdata),
      success : function(data) {
        layer.msg("修改成功", {shift: -1, time: 1000}, function(){
          location.href = "menu_list.html";
        });
      }
    });
  }
});