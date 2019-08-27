layui.use(['layer', 'ztreeMenu'], function(){
  var layer = layui.layer;
  var ztreeMenu = layui.ztreeMenu;
  
  ztreeMenu.initParentMenuSelect();
    
  function add() {
    $('#form').bootstrapValidator();
    var bootstrapValidator = $("#form").data('bootstrapValidator');
    bootstrapValidator.validate();
      if(!bootstrapValidator.isValid()){
       return;
      }
      
      var formdata = $("#form").serializeObject();

    $.ajax({
      type : 'post',
      url : '/management/v1/permissions',
      contentType: "application/json; charset=utf-8",  
      data : JSON.stringify(formdata),
      success : function(data) {
        layer.msg("添加成功", {shift: -1, time: 1000}, function(){
          location.href = "menu_list.html";
        });
      }
    });
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
});