layui.define(['layer','form'], function(exports){
    var form = layui.form;
    $.extend($,{
        //BASECONFIG
        BC:{
            //版本号
            'V':'v1',
            //字典
            'WB':{
                //车辆颜色
                'VEHICLE_COLOR':'VEHICLE_COLOR'
            }
        }
    });

    Date.prototype.Format = function(fmt)
    {
        var o = {
            "M+" : this.getMonth()+1,                 //月份
            "d+" : this.getDate(),                    //日
            "h+" : this.getHours(),                   //小时
            "m+" : this.getMinutes(),                 //分
            "s+" : this.getSeconds(),                 //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S"  : this.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt))
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o){

            if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }

        }
        return fmt;
    };


    var layer = layui.layer;
    //form序列化为json
    $.fn.serializeObject = function()
    {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };

    $.extend($,{
        getGuid:function()
        {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        },
        uploadFun:function(contentdata,file,callbackfun,public)
        {
            var len    = file.length;
            var _len   = 0;
            //存储文件上传之后的图片路径
            var filePath = [];
            var Bucket = contentdata.bucketName;
            var Region = contentdata.region;
            var cos = new COS({
                getAuthorization: function (options, callback) {
                    callback({
                        TmpSecretId: contentdata.credentials.tmpSecretId,
                        TmpSecretKey: contentdata.credentials.tmpSecretKey,
                        XCosSecurityToken: contentdata.credentials.sessionToken,
                        ExpiredTime: contentdata.expiredTime,
                    });
                }
            });
            $(file).each(function(){
                var filename = $.getGuid()+new Date().getTime();
                var key    = contentdata.filePath+'/'+filename;
                cos.putObject({
                        Bucket: Bucket,
                        Region: Region,
                        Key: key,
                        Body: this,
                        onProgress: function (progressData) {
                            console.log('上传中', JSON.stringify(progressData));
                        },
                    },
                    function (err, data)
                    {
                        if(err != null)
                        {
                            _len ++;
                            if(_len == len)
                            {
                                callbackfun('error',filePath);
                            }
                        }
                        else
                        {
                            if(public == 'public')
                            {
                                var returnKey = 'https://';
                                returnKey += Bucket;
                                returnKey += '.cos.';
                                returnKey += Region;
                                returnKey += '.myqcloud.com/';
                                returnKey += key;
                            }
                            else{
                                returnKey = key;
                            }
                            filePath.push(returnKey);
                            _len++;
                            if(_len == len){
                                callbackfun('success',filePath);
                            }
                        }


                    });
            });
        },
        getBucketFileUrl:function(request,id,callbackfun){
            $.postApi('/management/v1/cos/tempkey',{
                "type":2,
                "request":request,
                "bussinessType": 1,
                "id":id
            },function(res)
            {
                if(res.code == 0)
                {
                    var contentdata = res.content;
                    var Bucket = contentdata.bucketName;
                    var Region = contentdata.region;
                    var cos = new COS({
                        getAuthorization: function (options, callback) {
                            callback({
                                TmpSecretId: contentdata.credentials.tmpSecretId,
                                TmpSecretKey: contentdata.credentials.tmpSecretKey,
                                XCosSecurityToken: contentdata.credentials.sessionToken,
                                ExpiredTime: contentdata.expiredTime,
                            });
                        }
                    });
                    cos.getBucket({
                        Bucket: Bucket, 
                        Region: Region,
                        Prefix:id
                    }, function(err, data) {
                        if(data.Contents&&data.Contents.length>0){
                            var keylen = data.Contents.length;
                            var start  = 0;
                            var urlarr = [];
                            $(data.Contents).each(function()
                            {
                                cos.getObjectUrl({
                                    Bucket:Bucket,
                                    Region:Region,
                                    Key: this.Key
                                }, function (err, data) {
                                    start ++;
                                    if(err == null)
                                    {
                                        urlarr.push(data.Url);
                                        if(start == keylen)
                                        {
                                            callbackfun('success',urlarr);
                                        }
                                    }
                                    else{
                                        if(start == keylen)
                                        {
                                            callbackfun('error',data);
                                        }
                                    }


                                });
                            });
                        }else{
                            callbackfun('success',[]);
                        }
                    });
                    
                }
                else{
                    callbackfun('ajaxerror','');
                }
            });
        },
        getFileUrl:function(request,key,callbackfun)
        {
            $.postApi('/management/v1/cos/tempkey',{
                "type":1,
                "request":request
            },function(res)
            {
                if(res.code == 0)
                {
                    var contentdata = res.content;
                    var Bucket = contentdata.bucketName;
                    var Region = contentdata.region;
                    var cos = new COS({
                        getAuthorization: function (options, callback) {
                            callback({
                                TmpSecretId: contentdata.credentials.tmpSecretId,
                                TmpSecretKey: contentdata.credentials.tmpSecretKey,
                                XCosSecurityToken: contentdata.credentials.sessionToken,
                                ExpiredTime: contentdata.expiredTime,
                            });
                        }
                    });
                    if($.isArray(key))
                    {
                        var keylen = key.length;
                        var start  = 0;
                        var urlarr = [];
                        $(key).each(function()
                        {
                            cos.getObjectUrl({
                                Bucket:Bucket,
                                Region:Region,
                                Key: this
                            }, function (err, data) {
                                start ++;
                                if(err == null)
                                {
                                    urlarr.push(data.Url);
                                    if(start == keylen)
                                    {
                                        callbackfun('success',urlarr);
                                    }
                                }
                                else{
                                    if(start == keylen)
                                    {
                                        callbackfun('error',data);
                                    }
                                }


                            });
                        });
                    }
                    else
                    {
                        cos.getObjectUrl({
                            Bucket:Bucket,
                            Region:Region,
                            Key: key
                        }, function (err, data) {
                            callbackfun(err==null?'success':err,data.Url)
                        });
                    }
                }
                else{
                    callbackfun('ajaxerror','');
                }
            });
        }
    });
    $.extend($.fn,{
        uploadFun:function(request,callbackfun,maxsize,id,typeName)
        {
            this.each(function(){
                $(this).click(function(){
                    $(this).val('');
                });
                $(this).change(function()
                {
                    var file = this.files;
                    if (!this.files[0]) return;
                    var fileName=file[0].name.split('.')[file[0].name.split('.').length-1]
                    if(!typeName){//不传允许类型则认为只能上传图片和pdf
                        typeName='jpg|png|jpeg|pdf'
                    }
                    if(typeName.indexOf(fileName.toLowerCase())<0){
                        layer.msg('请上传符合要求的文件格式('+typeName+')');
                        return;
                    }
                    // if (!/\/(jpg|png|jpeg|pdf)$/gi.test(file[0].type)){
                    //     layer.msg('图片格式不正确');
                    //     return;
                    // }
                    if(!maxsize)
                    {
                        maxsize = 1;
                    }
                    if(file.length > maxsize)
                    {
                        layer.msg('最多只能上传5张图片');
                        return;
                    }
                    var requestData={
                        "type":0,
                        "request":request
                    };
                    if(id){
                        Object.assign(requestData,{"id":id})
                    }
                    $.postApi('/management/v1/cos/tempkey',requestData,function(res)
                    {
                        if(res.code == 0)
                        {
                            if(request.indexOf('-public') >0 )
                            {
                                $.uploadFun(res.content,file,callbackfun,'public');
                            }
                            else{
                                $.uploadFun(res.content,file,callbackfun);
                            }


                        }
                        else{
                            callbackfun('ajaxerror','');
                        }
                    });
                });

            });
        }
    });
    $.ajaxSetup({
        cache : false,
        error : function(xhr, textStatus, errorThrown) {
            var msg = xhr.responseText;
            var response = JSON.parse(msg);
            var code = response.code;
            var message = response.message;
            if (code == 400) {
                layer.msg(message);
            } else if (code == 401) {
                layer.msg('未登录');
            } else if (code == 403) {
                console.log("未授权:" + message);
                layer.msg('未授权');
            } else if (code == 500) {
                layer.msg('系统错误：' + message);
            }
        }
    });
    $.extend($,{
        getApi:function(action,options,callback,checkBack)
        {
            $.ajax({
                type : 'get',
                url : action,
                contentType: "application/json; charset=utf-8",
                data : options,
                success : function(data) {
                    if(checkBack){
                        callback(data);
                    }else{
                        if(data.code == 0)
                        {
                            callback(data);
                        }
                        else{
                            layer.msg(data.message);
                        }
                    }
                    
                }
            });
        },
        getApi2:function(action,options,callback)
        {
            var action = action+'/'+options.join('/');
            $.ajax({
                type : 'get',
                url : action,
                contentType: "application/json; charset=utf-8",
                success : function(data) {
                    if(data.code == 0)
                    {
                        callback(data);
                    }
                    else{
                        layer.msg(data.message);
                    }
                }
            });
        },
        postApi:function(action,options,callback,checkBack)
        {
            $.ajax({
                type : 'post',
                url : action,
                contentType: "application/json; charset=utf-8",
                data : JSON.stringify(options),
                success : function(data) {
                    if(checkBack){
                        callback(data);
                    }else{
                        if(data.code == 0)
                        {
                            callback(data);
                        }
                        else{
                            layer.msg(data.message);
                        }
                    }
                }
            });
        },
        putApi:function(action,options,callback,checkBack)
        {
            $.ajax({
                type : 'put',
                url : action,
                contentType: "application/json; charset=utf-8",
                data : JSON.stringify(options),
                success : function(data) {
                    if(checkBack){
                        callback(data);
                    }else{
                        if(data.code == 0)
                        {
                            callback(data);
                        }
                        else{
                            layer.msg(data.message);
                        }
                    }
                    
                }
            });
        },
        addUrlPro:function(url,options)
        {
            for(var i in options)
            {
                if(url.indexOf('?')>=0){
                    url += i+'='+options[i]+'&';
                }
                else{
                    url += '?'+i+'='+options[i]+'&';
                }
            }
            url = url.slice(0,url.length-1);
            return url;
        },
        getUrlData: function()
        {
            var url = window.location.href,
                urlstr = url.split('?')[1];
            if (urlstr)
            {
                urlstr = urlstr.split('#')[0];
                var urlarr = urlstr.split('&'),
                    data = {};
                $(urlarr).each(function() {
                    var arr = (this + '').split('=');
                    data[arr[0]] = arr[1];
                });
                return data;
            }
            else {
                return false;
            }
        },
        appendSelect:function(id,data,key,name,defaultname)
        {
            var options = '<option value="">请选择</option>';
            $(data).each(function(){
                if(defaultname==this[name]||defaultname==this[key]){
                    options += '<option value="'+this[key]+'" selected>'+this[name]+'</option>';
                }else{
                    options += '<option value="'+this[key]+'">'+this[name]+'</option>';
                }
            });
            $('#'+id).empty();
            $('#'+id).append(options);
        },
        setSelect:function(id,defaultname)
        {
            $('#'+id).find('option').each(function(){
                if($(this).text() == defaultname || $(this).val() == defaultname)
                {
                    $(this).attr('selected','selected');
                }
                else{
                    $(this).removeAttr('selected');
                }
            });
        },
        readOnly:function(unfilter){
            $('input:not([data-val="text"])').each(function(){
                var val = $(this).val();
                var type = $(this).attr('type');
                if(unfilter)
                {
                    if($.inArray(type,unfilter) >=0)
                    {
                        return;
                    }
                }
                $(this).replaceWith(val);
            });
            $('#jsSub').css('display','none');
        },
        eleDisabled:function(obj){
            $(obj).each(function(index,item){
                $(item).attr('disabled',true);
            })
        },
        replaceSelect:function(selects)
        {
            $(selects).each(function(){
                var id = this.id,val = this.value;
                $('#'+id).siblings().remove();
                $('#'+id).replaceWith(val);
            });
        },
        replaceSelectByVal:function(selects)
        {
            $(selects).each(function(){
                var id = this.id,val = this.value,text='';
                $('#'+id).find('option').each(function(){
                    if($(this).attr('value')==val)
                    {
                        text = $(this).text();
                    }
                });
                $('#'+id).siblings().remove();
                $('#'+id).replaceWith(text);
            });
        },
        enlargeImg:function(){
            $('body').on('click','img.enlarge',function(){
                var large_image = '<div class="enlargeLayer" style="text-align:center;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);line-height:100vh;">'+
                '<i class="layui-icon" style="color:#fff;font-size:30px;cursor:pointer;position:absolute;top:20px;right:20px;line-height:30px;">&#x1006;</i>'+
                '<img src= ' + $(this).attr("src") + ' style="max-width:100%;max-height:100%;"></img></div>';
                $('body').append($(large_image));
            })
            $('body').on('click','.enlargeLayer .layui-icon',function(){
                $(".enlargeLayer").remove();
            })
        },
        //设置所有文本的可输入长度为20
        inputMaxLength:function(){
            $('input[type="text"]').each(function(){
                if(!$(this).attr('maxlength')){
                    $(this).attr('maxlength',20);
                }
            })
        },
        //过滤所有文本框输入的特殊字符
        filterSpecialWord:function(){
            $('input[type="text"],textarea').each(function(){
                if($(this).attr('lay-verify')){
                    $(this).attr('lay-verify',$(this).attr('lay-verify')+'|specialWord');  
                }else{
                    $(this).attr('lay-verify','specialWord')
                }
                
            })
        },
        //修改表单校验提示框位置
        modifyVerfiyPos:function(){
            $('input,select,textarea').each(function(){
                $(this).attr('lay-verify')?$(this).attr('lay-verType','tips'):'';
            })
        }

    });
    var Common = {
        getUrlParam: function(key) { //获取url后的参数值
            var href = window.location.href;
            var url = href.split("?");
            if(url.length <= 1){
                return "";
            }
            var params = url[1].split("&");

            for(var i=0; i<params.length; i++){
                var param = params[i].split("=");
                if(key == param[0]){
                    return param[1];
                }
            }
        },
        loginInfo: function() {
            var user = "";
            $.ajax({
                type : 'get',
                url : '/management/v1/login/currentUser',
                async: false,
                success : function(data){
                    if(data != null && data != ""){
                        user = data;
                    }
                },
                error: function(xhr,textStatus,errorThrown){
                    var msg = xhr.responseText;
                    var response = JSON.parse(msg);
                    $("#info").html(response.message);
                }
            });

            return user;
        },
        buttonDel: function(data, permission, pers){
            if(permission != ""){
                if ($.inArray(permission, pers) < 0) {
                    return "";
                }
            }

            var btn = $("<button class='layui-btn layui-btn-xs' title='删除' onclick='del(\"" + data +"\")'><i class='layui-icon'>&#xe640;</i></button>");
            return btn.prop("outerHTML");
        },
        buttonEdit: function(href, permission, pers){
            if(permission != ""){
                if ($.inArray(permission, pers) < 0) {
                    return "";
                }
            }

            var btn = $("<button class='layui-btn layui-btn-xs' title='编辑' onclick='window.location=\"" + href +"\"'><i class='layui-icon'>&#xe642;</i></button>");
            return btn.prop("outerHTML");
        },
        deleteCurrentTab: function(){
            var lay_id = $(parent.document).find("ul.layui-tab-title").children("li.layui-this").attr("lay-id");
            parent.active.tabDelete(lay_id);
        }
    }
      
    form.verify({
        specialWord:function(value,item){
            if(/[~!@#$^&`]+/.test(value)){
                return '请不要输入特殊字符';
            }
        }
    })
    $.inputMaxLength();
    $.filterSpecialWord();
    $.modifyVerfiyPos();
    exports('common', Common)
})