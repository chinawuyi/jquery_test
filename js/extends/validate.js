layui.define(['form'],function(exports){
    var form = layui.form;
	var Verification = {
        verify:function()
            {
                form.verify({
                    driverCertNoCheck: function(value, item){ 
                        if(!/^.{0,64}$/.test(value)){
                            return '不能大于64位数值';
                            }
                        },
                    licenseNumberCheck: function(value, item){ 
                        if(!/^.{0,32}$/.test(value)){
                            return '不能大于32位数值';
                        }
                    },
                    userNameCheck:function(value,item){
                        if(!/^[\u4e00-\u9fa5a-zA-Z0-9]{1,20}$/.test(value)){
                            return '只能为1-20位英文/汉字/数字';
                        }
                    },
                    nickNameCheck:function(value,item){
                        if(!/^[a-zA-Z0-9]{1,20}$/.test(value)){
                            return '只能为1-20位英文/数字';
                        }
                    },
                    checkDiscount:function(value, item){
                        console.log(value)
                        if(Number(value)>10.1){
                            return '请输入小于10以内的折扣';
                        }else if(value.split(".")[1]&&value.split(".")[1].length>1){
                            return '折扣小数位不能大于2位';
                        }else if(Number(value)<0){
                            return '折扣不能位负数';
                        }
                    },
                    checkInter: function(value, item){ 
                        if(Number(value)>20000000){ 
                          return '输入值不能大于20000000';
                        }
                      },
                });
            },
        
	}

	exports('validate', Verification)
})

