<!--
 * @Descripttion: 
 * @Version: 
 * @Author: sunliangzesmile
 * @Date: 2020-04-06 12:16:51
 * @LastEditors: sunliangzesmile
 * @LastEditTime: 2020-04-06 13:23:54
 -->
# caseselect.js
级联下拉框

## 支持

1、支持多级下拉框级联
2、支持多级下拉框单选、复选

## 使用说明

1.插件需引用JQuery支持
2.插件无任何样式,样式需自定义


## 案例
[案例地址](https://sunliangzesmile.github.io/caseselect.js/example/index.html "案例")
案例一：
```
<script type="text/javascript" src="./data.js"></script>
<script type="text/javascript" src="../caseselect.js"></script>
<script type="text/javascript">
 let caseInstance = $("#caseSelect1").caseSelect(options1 = {
    data: function() {
        return data;
    },
    onBuildBefore: function() {
        console.log("start build");
    },
    onRenderSelect: function() {
        let div = document.createElement("div");
        return $(div).append(document.createElement("select"));
    },
    onBuildAfter: function() {
        console.log("end build");
    },
    onBuildCompleted: function() {
        console.log("complete build");
    },
    onSelected: function(elem, value) {
        console.log(caseInstance.getValue());
    },
});
caseInstance.setValue(["1185", "", "1251"]);
</script>
```
案例二:
```
<script type="text/javascript" src="./data.js"></script>
<script type="text/javascript" src="../caseselect.js"></script>
<script type="text/javascript">
 let caseInstance2 = caseSelect({
    elem: "#caseSelect2",
    value: ["1185", "", "1489"],
    data: function() {
        return data;
    },
    onBuildBefore: function() {
        console.log("start build");
    },
    onBuildAfter: function() {
        console.log("end build");
    },
    onBuildCompleted: function() {
        console.log("complete build");
    },
    onSelected: function(elem, value) {
        console.log(value);
    },
});
console.log(caseInstance2.getValue());
</script>
```

案例三:
```
<script type="text/javascript" src="./data.js"></script>
<script type="text/javascript" src="../caseselect.js"></script>
<script type="text/javascript">
 let caseInstance3 = $("#caseSelect3").caseSelect({
    data: function() {
        return data;
    },
    multiple: true,
    value: [
        ["825"],
        [],
        ["766", "148"]
    ],
    onBuildBefore: function() {
        console.log("start build");
    },
    onBuildAfter: function() {
        console.log("end build");
    },
    onBuildCompleted: function() {
        console.log("complete build");
    },
    onSelected: function(elem, value) {
        console.log(caseInstance.getValue());
    },
 });
</script>
```


## 参数配置
```
{
    elem: '',/*渲染容器id */
    multiple: false,/*是否支持多选*/
    deepin: 1,/*下拉框深度*/
    top_value: -1,/*下拉框顶级初始值*/
    parent_field: 'pid',/*下拉框父字段*/
    value_field: 'id',/*下拉框value字段*/
    text_field: 'name',/*下拉框text字段*/
    data: {},/*下拉框数据集{"1":[],"2":[],"3":[],"4":[]}*/
    value: [],/*下拉框值*/
    onBuildBefore: function(options) {},/*构建前回调*/
    onRenderSelect: function(options, level) {},/*渲染下拉框回调*/
    onBuildAfter: function(options) {}, /*构建后回调*/
    onBuildCompleted: function(options) {},/*构建完成回调*/
    onSelected: function(elem, value) {},/*下拉框选择回调*/
}
```

## 当前版本
v0.0.1（update at 2020-04-06）