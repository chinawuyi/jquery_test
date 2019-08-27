layui.use(['common','form', 'layer','laydate', 'dict', 'permission'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var form = layui.form;
    var laydate = layui.laydate;
    var driverContract = {
        photo:'',
        dataObj:{
            'id':'',
            'type':'new',
            'readonly':'',
            'carId':''
        },
        eventFun:{
            addLayer:function(action,options)
            {
                if(options)
                {
                    action = $.addUrlPro(action,options);
                }
                layer.open({
                    type: 2,
                    title:'司机管理',
                    content: action,
                    area: ['700px', '400px'],
                    maxmin: true
                });
            },
            closeLayer:function()
            {
                var index = parent.layer.getFrameIndex(window.name);
                parent.layer.close(index);
            },
            /*创建司机*/
            subData:function(data,val)
            {
                var _this = this;
                $.postApi('/management/v1/driver/contract/create',{
                    driverId:driverContract.dataObj.id,
                    contractPhoto:$('.contractPhoto').val(),
                    //contractPhotoBase64:driverContract.dataObj.contractPhotoBase64,
                    operator:sessionStorage.getItem('operator'),
                    contractStatus:data.contractStatus,
                    contractType:data.contractType,
                    invalidTime:data.invalidTime?new Date(data.invalidTime)/1000:'',
                    signTime:data.signTime?new Date(data.signTime)/1000:'',
                    type:data.type,
                    validTime:data.validTime?new Date(data.validTime)/1000:'',
                },function(res)
                {
                    if(res.code == 0)
                    {
                        parent.window.openMsg(res.message)
                        window.location.reload()
                    }
                });
            },
            /*修改司机信息*/
            updateData:function(data,val)
            {
                var _this = this;
                
                $.postApi('/management/v1/driver/contract/update',{
                    driverIndividualContractId:driverContract.dataObj.driverIndividualContractId,//
                    driverId:driverContract.dataObj.id,
                    contractPhoto:$('.contractPhoto').val(),
                    //contractPhotoBase64:driverContract.dataObj.contractPhotoBase64,
                    operator:sessionStorage.getItem('operator'),
                    contractStatus:data.contractStatus,
                    contractType:data.contractType,
                    invalidTime:data.invalidTime?new Date(data.invalidTime)/1000:'',
                    signTime:data.signTime?new Date(data.signTime)/1000:'',
                    type:data.type,
                    validTime:data.validTime?new Date(data.validTime)/1000:'',
                },function(res)
                {
                    if(res.code == 0)
                    {
                        parent.window.openMsg(res.message)

                    }
                });
            },
            /*根据id查询司机*/
            getData:function()
            {
                var _this = this;
                $.getApi('/management/v1/driver/contract/info/'+driverContract.dataObj.id,{
                },function(res)
                {
                    if(res.code == 0)
                    {
                        var formData=res.content
                        /*循环表单赋值*/
                        var inputDom=document.getElementsByClassName("form-control")
                        if(formData){
                            for(var i=0;i<inputDom.length;i++){
                                var attr=inputDom[i].getAttribute("name") 
                                if(attr=='invalidTime'||attr=='signTime'||attr=='validTime'){
                                    inputDom[i].value=new Date(formData[attr]*1000).Format('yyyy/MM/dd')
                                } else{
                                    inputDom[i].value=formData[attr]
                                }
                                
                            }
                            driverContract.dataObj.driverIndividualContractId=formData.driverIndividualContractId
                            driverContract.dataObj.type='update'  
                            if(formData.contractPhoto){
                                $.getFileUrl('driver',formData.contractPhoto,function(status,option){
                                    if(status == 'success')
                                    {
                                        $('#contractPhoto').parents("tr").find(".jsphotoshow").empty();
                                        $('#contractPhoto').attr('key',formData.contractPhoto)
                                        $('.contractPhoto').val(formData.contractPhoto)
                                        $('#contractPhoto').parents("tr").find(".jsphotoshow").append('<span urlData="'+option+'" style="cursor:pointer">预览</span>');
                                    }
                                });
                            }                          
                        }
                        form.render('select');
                        driverContract.formSub();

                    }
                });
            },
            getUrlData:function()
            {

                driverContract.dataObj.id = $.getUrlData().id;
                driverContract.dataObj.readonly = $.getUrlData().readonly;
                driverContract.eventFun.getData();
                /*判断是预览还是编辑*/
                if(driverContract.dataObj.readonly === 'readonly')
                {
                    $('input,textarea').addClass('layui-disabled').attr('readonly','readonly');
                    $('select,.real_file_btn,input[type="checkbox"]').addClass('layui-disabled').attr('disabled','disabled');
                    $('#jsSub').css('display','none');
                    $('.my_file_btn').addClass('layui-btn-disabled')                   
                }
            },
            setFileBase64:function(){
                $('#contractPhoto').change(function(){
                    if($(this).val()){
                        var reader = new FileReader();
                        reader.readAsDataURL(this.files[0]);
                        reader.onload = function(e){
                            driverContract.dataObj.contractPhotoBase64=e.target.result
                          };
                    }
                })
            },
        },
        /*提交表单*/
        formSub:function()
        {
            var _this = this;
            //获取复选框的值
            
            //新创建
            if(_this.dataObj.type == 'new')
            {
                form.on('submit(*)', function(data){
                    _this.eventFun.subData(data.field);
                    return false;
                });
            }
            //更新
            else if(_this.dataObj.type == 'update')
            {
                form.on('submit(*)', function(data){
                    _this.eventFun.updateData(data.field);
                    return false;
                });
            }

        },
        
        /*默认方法*/
        defaultEvent:function()
        {
            var _this = this;
            
            $('#jsBrandBack').click(function(){
                _this.eventFun.closeLayer();
            });
            /*日期绑定*/
            if($.getUrlData().readonly != 'readonly'){            
                
                laydate.render({
                    trigger: 'click',
                    elem: '#invalidTime',
                    format: 'yyyy/MM/dd'
                });
                laydate.render({
                    trigger: 'click',
                    elem: '#signTime',
                    format: 'yyyy/MM/dd'
                });
                laydate.render({
                    trigger: 'click',
                    elem: '#validTime',
                    format: 'yyyy/MM/dd'
                });                
            }
            /**上传控件绑定 */
            $('#contractPhoto').uploadFun('driver',function(status,key){
                if(status =='success')
                {
                    $.getFileUrl('driver',key,function(status,option){
                        if(status == 'success')
                        {
                            $('#contractPhoto').parents("tr").find(".jsphotoshow").empty();
                            $('#contractPhoto').attr('key',key)
                            $('.contractPhoto').val(key)
                            $('#contractPhoto').parents("tr").find(".jsphotoshow").append('<span urlData="'+option+'" style="cursor:pointer">预览</span>');
                        }
                    });
                }
            });

            /**预览PDF */
            $('.jsphotoshow').on('click',function(){
                parent.window.addParentLayer($(this).children().attr('urlData'));
            })
        }
    };
    //需要优先执行
    driverContract.eventFun.getUrlData();
    driverContract.defaultEvent();
    //driverContract.eventFun.setFileBase64()
    
});
