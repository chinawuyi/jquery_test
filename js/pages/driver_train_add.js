layui.use(['common','form', 'layer','laydate', 'dict', 'permission'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission;
    var form = layui.form;
    var laydate = layui.laydate;
    var driverTrainAdd = {
        photo:'',
        dataObj:{
            'id':'',
            'type':'new',
            'readonly':''
        },
        eventFun:{
            closeLayer:function()
            {
                var index = parent.layer.getFrameIndex(window.name);
                parent.layer.close(index);
            },
            /*创建司机培训信息*/
            subData:function(data,val)
            {
                var _this = this;
                $.postApi('/management/v1/driver/cource/create',{
                    courseDate:new Date(data.courseDate).getTime()/1000,
                    courseName:data.courseName,
                    driverId:$.getUrlData().id,
                    duration:new Date(data.stopTime).getTime()/1000-new Date(data.startTime).getTime()/1000,
                    operator:sessionStorage.getItem('operator'),
                    type:data.type,
                    startTime:new Date(data.startTime).getTime()/1000,
                    stopTime:new Date(data.stopTime).getTime()/1000,
                    trainingAccountInfo:$('.trainingAccountInfo').val(),
                    trainerName:data.trainerName
                },function(res)
                {
                    if(res.code == 0)
                    {
                        layer.msg(res.message);
                        window.setTimeout(function(){
                            _this.closeLayer();
                            parent.window.getTrainInfo()
                        },1000);

                    }
                });
            },
        },
        /*获取下拉菜单数据*/
        getSelectData:function(){
            // 培训类型
			$.postApi('/management/v1/dictcommon/getDictCommonsByCategoryCode', {
				'categoryCode': "TRAINING_TYPE",
			}, function (res) {
				if (res.code == 0) {
					$.appendSelect('type', res.content, 'value', 'name')
					form.render('select')
				}
            })
        },
        /*提交表单*/
        formSub:function()
        {
            var _this = this;
            
            form.on('submit(*)', function(data){
                _this.eventFun.subData(data.field);
                return false;
            });

        },
        /*默认方法*/
        defaultEvent:function()
        {
            var _this = this;
            
            $('#jsBrandBack').click(function(){
                _this.eventFun.closeLayer();
            });

            /*培训时间*/
            laydate.render({
                elem: '#courseDate',
                trigger: 'click',
                format: 'yyyy/MM/dd'
            });
            laydate.render({
                elem: '#startTime',
                type:'datetime',
                trigger: 'click',
                format: 'yyyy/MM/dd HH:mm'
            });
            laydate.render({
                elem: '#stopTime',
                type:'datetime',
                trigger: 'click',
                format: 'yyyy/MM/dd HH:mm'
            });
            $('#trainingAccountInfo').uploadFun('driver',function(status,key){
                if(status =='success')
                {
                    $.getFileUrl('driver',key,function(status,option){
                        if(status == 'success')
                        {
                            console.log(option)
                            $('#trainingAccountInfo').parents("tr").find(".jsphotoshow").empty();
                            $('#trainingAccountInfo').attr('key',key)
                            $('.trainingAccountInfo').val(key)
                            $('#trainingAccountInfo').parents("tr").find(".jsphotoshow").append('<img src="'+option+'" class="enlarge"/>');
                        }
                    });
                }
            });
        }
    };
    //需要优先执行
    driverTrainAdd.defaultEvent();
    driverTrainAdd.formSub();
    driverTrainAdd.getSelectData();
});
