layui.use(['common','layer'], function () {
    var common = layui.common;
    var layer = layui.layer;
    
    if (top != self) {
        parent.location.href = '/login.html';
    }

    var user = common.loginInfo();
    if (user != "") {
        location.href = '/';
    }

    $('.btn-login').on('click', function () {
        login(this)
    })

    function login(obj) {
        $(obj).attr("disabled", true);

        var username = $.trim($('#username').val());
        var password = $.trim($('#password').val());
        var token = $.trim($('#token').val());
        if (username == "" || password == "") {
            $("#info").html('用户名或者密码不能为空');
            $(obj).attr("disabled", false);
            return;
        }

        if (token == "") {
            $("#info").html('动态安全码不能为空');
            $(obj).attr("disabled", false);
            return;
        }

        $.ajax({
            type: 'post',
            url: '/management/v1/login/web',
            data: $("#login-form").serialize(),
            success: function (res) {
                if(res.code=='0'){
                    location.href = '/'
                }else if(res.code=='180017'||res.code=='180018'){//强制修改密码
                    layer.open({
                        type: 2,
                        title:res.message,
                        content: './pages/user/change_password.html?refresh=1',
                        area: ['600px', '400px'],
                        maxmin: true
                    });
                }                
                layer.msg(res.message);
                $(obj).attr("disabled", false);
            },
            error: function (xhr, textStatus, errorThrown) {
                $(obj).attr("disabled", false);
                var msg = xhr.responseText;
                var response = JSON.parse(msg);
                $("#info").html(response.message);
                $(obj).attr("disabled", false);
            }
        });

    }

    $('#jsWechatCode').hover(function(){
       $('#jsWechatImg').show();
    },function(){
        $('#jsWechatImg').hide();
    })
})