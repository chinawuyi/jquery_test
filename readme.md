# 广汽出行控制台前端

## 开发环境配置
### 前端开发环境
> 所有命令均在`fe`目录下执行

* [安装node](https://nodejs.org/en/)
* 安装依赖包
```
npm install
```
* 安装chrome跨域解决扩展，[点击安装](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi)

### java端开发环境（可选）
* 本地mysql安装及数据库导入
    - IP/Port：127.0.0.1/3306
    - 数据库名：gac_management
    - 数据库用户：gac_travel_dev/gac@6666
    - sql地址：/文档和sql/travel_management.sql
* redis服务启动
    - IP/Port：127.0.0.1/6379
    - 连接密码：root
* 安装maven,[mac参考](https://www.jianshu.com/p/191685a33786)
    - 替换maven [settings.xml](venders/settings.xml)
* 安装consul

## 本地开发步骤
### java端服务启动（可选）
> 所有命令均在项目根目录执行

* `consul agent -dev`
* 连接VPN(连本地数据库可不用连接)
* 修改java运行时环境

```
# src/main/resources/bootstrap.yml
profiles:
  active: local
```

* `./build.sh`
* `./start.sh`
* 访问http://localhost:19000

### 前端开发
> 所有命令均在`fe`目录下执行

* 监控文件变动并构建静态资源

```
npm run watch
```
* 修改`package.json`中的`proxy`配置

```
// 不使用本地java服务
"target": "http://111.230.118.77"
// 不使用本地java服务
"target": "http://127.0.0.1:19000"
```
* 启动静态服务

```
npm run start
```

## 页面列表
> 加粗部分为老版系统对应模块

* 订单系统
    - 总览（pages/order/order_dashboard.html）
    - 订单管理（pages/order/order_list.html）- **订单管理/订单查询**
    - 结算调整
    - 一键报警（pages/order/call_police_list.html）- **订单管理/一键报警**
* 车务系统
    - 总览（pages/vehicle/vehicle_dashboard.html）
    - 车辆管理（pages/vehicle/vehicle_list.html）- **车辆管理/车辆管理**
    - 车型管理（pages/vehicle/vehicle_model.html）- **车辆管理/车型信息**
    - 车系管理（pages/vehicle/vehicle_series.html）- **车辆管理/车系管理**
    - 车辆租赁公司管理（pages/vehicle/vehicle_rent.html）
* 司管系统
    - 总览（pages/driver/driver_dashboard.html）
    - 司机管理（pages/driver/driver_list.html）- **司机管理/司机信息**
    - 司机劳务公司管理（pages/driver/driver_labor.html）
* 定价系统
    - 总览（pages/charge/charge_dashboard.html）
    - 标准计价（pages/charge/charge_list.html）- **价格管理/标准计价包**
* 会员系统
    - 总览（pages/passenger/passenger_dashboard.html）
    - 会员管理（pages/passenger/passenger_list.html）- **会员管理**
* 营销系统（pages/marketing/marketDashboard.html）
* 运营中心（pages/operate/operateDashboard.html）
* 风控系统（pages/user/user_list.html）
* 派单系统（pages/orderdispatch/orderDispatchDashboard.html）
* 配置系统（pages/config/configDashboard.html）
* 客服系统（pages/customer/serviceDashboard.html）
* 用户反馈（pages/feedback/feedbackDashboard.html）
* 系统管理
    - 用户（pages/user/user_list.html）
    - 菜单（pages/menu/menu_list.html）
    - 角色（pages/role/role_list.html）

## 接口文档
http://localhost:19000/swagger-ui.html

## 注意
* 登出功能不是异步接口的形式，本地开发模式中点击会有问题，但是这一块的功能是通的
* 页面交互可参考老版。http://134.175.126.46/adminWeb/a User/Soft1234

## 开发相关
### 使用发布/订阅模式

```
// 发布
$.publish('permission:check', {
  name: 'rolelist'
})

// 订阅
$.subscribe('permission:check', function(e, payload){
  permission.checkDom(payload.name)
})
```

### 操作按钮的权限控制
支持button/a标签，class上添加`hide`，permission为控制操作的权限
```
<button class='layui-btn layui-btn-xs hide' permission='sys:role:add' title='编辑' lay-event='edit'><i class='layui-icon'>&#xe642;</i></button>
```

## @TODO
* 待联调接口
    * /dicts：接口404
    * /management/v1/users：get方法分页有重复数据；put方法403；搜索返回结果为空
    * /management/v1/roles：添加(post方法)第二条数据，get方法才能拉到上一条添加的数据；put方法未实现；get方法分页不对；搜索返回结果为空
    * /management/v1/permissions：put方法不生效

## 参考
* layui文档 https://www.layui.com/doc/
* swig文档 http://node-swig.github.io/swig-templates/docs/


