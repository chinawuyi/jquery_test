layui.use(['common','table', 'layer', 'permission','form','laydate'], function() {
  var common = layui.common;
  var layer = layui.layer;
  var permission = layui.permission;
  var table = layui.table;
  var form = layui.form;
  var laydate = layui.laydate;

  var soundList = {
      tableObj:null,
      orderStatusList:{},
      statusRefundList:{},
      sound:{},
      eventFun:{
          editLayer:function(url,options)
          {
              var action = url;
              if(options)
              {
                  action = $.addUrlPro(action,options);
              }
              layer.open({
                type: 1,
                title: '行程录音',
                content: $('#addLayer').html(),
                area: ['800px', '500px'],
                maxmin: true
              })
          },
          getSound:function(id)
          {
            $.getBucketFileUrl('order-record',id,function(status,option){
                if(status == 'success')
                {
                    console.log(option)
                    var html=''
                    if(option){
                        option.forEach(item=>{
                            html+='span'
                        })
                    }
                }
            });
          }
      },
      funDownload:function (filePath,filename){
        fetch(filePath).then(res => res.blob()).then(blob => {
            const a = document.createElement('a');
            document.body.appendChild(a)
            a.style.display = 'none'
            // 使用获取到的blob对象创建的url
            const url = window.URL.createObjectURL(blob);
            a.href = url;
            // 指定下载的文件名
            a.download =filename;
            a.click();
            document.body.removeChild(a)
            // 移除blob对象的url
            window.URL.revokeObjectURL(url);
          });

    },
      defaultEvent:function()
      {
        var _this = this;
        $('#resetform').click(function(){
            soundList.getData();
        });
        /*日期控件*/
        laydate.render({
        trigger: 'click',
        elem: '#time',
        type: 'datetime',
        range: true
        });
      },
      formatParams:function(object){
          let tmpObject = {};
          for(let o in object) {
              if(object[o]!='') {
              tmpObject[o] = $.trim(object[o]);
              }
          }
          return tmpObject;
      },
      searchEvent:function()
      {
          let _this=this
          form.on('submit(searchLog)', function(data){
              _this.tableObj.reload({
                  where:_this.formatParams(data.field),
                  page: {
                      curr: 1
                    }
              });
              return false;
            });
      },
      getPlay:function(){
        var audios = document.getElementsByTagName("audio");
        console.log(audios)
        for (var i = 0; i < audios.length; i++) {
            // console.log("audios "+i+"  SRC:" + audios[i].currentSrc);
            audios[i].addEventListener('ended', function() {
                // nextSibling 属性返回指定节点之后紧跟的节点，在相同的树层级中。
                var nextAudio = this.nextSibling.nextSibling;
                // tagName 属性返回元素的标签名。(大写)
                if (nextAudio.tagName == "AUDIO") {
                    nextAudio.play();
                }
            }, false);
        }
      },
      getData:function()
      {
          var _this=this
          this.tableObj = table.render({
              elem: '#soundList',
              height: 522,
              url: '/management/v1/orderinfo/queryListByFilter',
              method:'post',
              contentType:"application/json",
              page: true,
              request: {
                  pageName: 'pageIndex',
                  limitName: 'pageSize'
              },
              parseData: function(res){
                  return {
                      "code": res.code,
                      "msg": res.message,
                      "count": res.content.total,
                      "data": res.content.data 
                  };
              },
              cols: [[
                  {field:'orderId', title: '订单号', align: 'center', sort: true},
                  {field:'userInfo', title: '乘车人信息',align: 'center',templet:function(d){
                    return '<span>'+d.userName+d.userPhone+'</span>'
                  }},
                  {field:'driverInfo', title: '司机信息', align: 'right',templet:function(d){
                    return '<span>'+d.driverName+d.driverPhone+'</span>'
                  }},
                  {field:'createTime', title: '订单时间', sort: true, align: 'right',templet:function(d){
                    if(d.timeStart){
                        return new Date(d.timeStart*1000).Format('yyyy-MM-dd hh:mm:ss');
                    }else{
                        return ""
                    }
                    
                  }},
                  {field:'startLoc', title: '上车地址',templet:function(d){
                      return '<span>'+d.startCityName+d.startPosition+'</span>'
                  }},
                  {field:'endLoc', title: '下车地址', align: 'center',templet:function(d){
                      return '<span>'+d.endCityName+d.endPosition+'</span>'
                  }},
                  {field:'sound', title: '分段录音', align: 'center',templet:function(d){
                      return '<span class="soundInfo"></span>'
                  }},
                  {field: '', title: '操作', width:'100', sort: false,templet: function(d){
                      return '<button class="layui-btn layui-btn-xs"   lay-event="ele_load"  ><i class="layui-icon">&#xe601;</i> 下载</button>';

                  }}
              ]],
              toolbar: '#toolbarDemo',
              done:function(res){
                $.each(res.data,function(key,val){
                    $.getBucketFileUrl('order-record',res.data[key].orderId,function(status,option){
                        if(status == 'success')
                        {
                            console.log(option)
                            var html=''
                            if(option){
                                option.forEach((item,index)=>{
                                    var i=index+1
                                    html+='<span class="soundaaa" lay-event="ele_open">录音'+i+' </span>'
                                })
                                $('tr[data-index=' + key + '] .soundInfo').html(html);
                                $('tr[data-index=' + key + '] .soundInfo').attr("data-url",option);
                            }
                        }
                    });
                }) 
              }
          });
      },
      toolBar:function()
      {
          var _this = this;
          table.on('tool(test)', function(obj){
              console.log($(obj.tr.selector+" .soundInfo").attr("data-url"))
              var list=$(obj.tr.selector+" .soundInfo").attr("data-url").split(",")
                // var url=obj.event.split(' ')[1]
                // var type=obj.event.split(' ')[0]
              if(obj.event =='ele_open')
              {
                    _this.eventFun.editLayer({
                    });
                    var html='';
                    list.forEach((item,index)=>{
                        if(index==0){
                            html+=`<audio controls="controls" autoplay="autoplay">
                                <source src=${item} type="audio/mpeg">
                            </audio>`
                        }
                        else{
                            html+=`<audio controls="controls">
                                <source src=${item} type="audio/mpeg">
                            </audio>`
                        }
                    })
                    $("#soundUrl").html(html)
                    var audios = document.getElementsByTagName("audio");
                    console.log(audios)
                    for (var i = 0; i < audios.length; i++) {
                        // console.log("audios "+i+"  SRC:" + audios[i].currentSrc);
                        audios[i].addEventListener('ended', function() {
                            // nextSibling 属性返回指定节点之后紧跟的节点，在相同的树层级中。
                            var nextAudio = this.nextSibling;
                            // tagName 属性返回元素的标签名。(大写)
                            if (nextAudio.tagName == "AUDIO") {
                                nextAudio.play();
                            }
                        }, false);
                    }
              }else if(obj.event =='ele_load'){
                  if(list.length<1){
                      return false;
                  }
                  $(list).each(function(k,v){
                    var fileUrl  = v;
                    var filename = obj.data.orderId+'_'+(k+1)+'.mp3';  //文件名为订单名称
                    _this.funDownload(fileUrl,filename)
                  })
              }
              
          });
      }
  };
  
  /*表格工具栏*/
  soundList.toolBar();
  /*搜索*/
  soundList.searchEvent();
  soundList.defaultEvent();
  /*下拉菜单数据*/
  soundList.getData();
  soundList.getPlay();
});