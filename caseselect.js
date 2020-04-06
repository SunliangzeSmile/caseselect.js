/*
 * @Descripttion: 级联下拉框
 * @Version: 0.0.1
 * @Author: sunliangzesmile
 * @Date: 2020-04-06 04:11:02
 * @LastEditors: sunliangzesmile
 * @LastEditTime: 2020-04-06 13:03:08
 */
;
(function(window, document) {
    /**
     * @name: 数组移除方法
     * @param {type} 
     * @return: 
     */
    Array.prototype.remove = function(value) {
        let index = -1;
        if (Array.isArray(value)) {
            for (let i = 0; i < value.length; i++) {
                this.remove(value[i]);
            }
        } else {
            index = this.indexOf(value);
            this.splice(index, 1);
        }
    }
    let caseSelect = function(options) {
        let _that = this;
        if (!options || !options.elem) return;
        if (!(this instanceof caseSelect)) return new caseSelect(options);
        _that.initPlugin(options);
        return _that;
    }
    caseSelect.prototype = {
        options: {},
        /**
         * @name: 获取默认参数
         * @return: 
         */
        getDefaultOptions: function() {
            return {
                /*渲染容器id */
                elem: '',
                /*是否支持多选*/
                multiple: false,
                /*下拉框深度*/
                deepin: 1,
                /*下拉框顶级初始值*/
                top_value: -1,
                /*下拉框父字段*/
                parent_field: 'pid',
                /*下拉框value字段*/
                value_field: 'id',
                /*下拉框text字段*/
                text_field: 'name',
                /*下拉框数据集{"1":[],"2":[],"3":[],"4":[]}*/
                data: {},
                /*下拉框值*/
                value: [],
                /*构建前回调*/
                onBuildBefore: function(options) {},
                /*渲染下拉框回调*/
                onRenderSelect: function(options, level) {},
                /*构建后回调*/
                onBuildAfter: function(options) {},
                /*构建完成回调*/
                onBuildCompleted: function(options) {},
                /*下拉框选择回调*/
                onSelected: function(elem, value) {},

            }
        },
        /**
         * @name:控件初始化 
         * @param {*} options 
         * @return: 
         */
        initPlugin: function(options) {
            let _that = this,
                defaultOptions = _that.getDefaultOptions();
            _that.options = $.extend(defaultOptions, options);
            _that.initData();
            if (!_that.options.value || _that.options.value.length !== 0) {
                _that.initValue();
            }
            //构建前
            _that.options.onBuildBefore &&
                _that.options.onBuildBefore(_that.options);
            //开始构建
            _that.buildCaseSelect();
            //构建后
            _that.options.onBuildAfter &&
                _that.options.onBuildAfter(_that.options);
            //构建完成
            _that.buildCaseSelectComplete();
            _that.options.onBuildCompleted &&
                _that.options.onBuildCompleted(_that.options);

        },
        /**
         * @name: 初始化数据
         * @return: 
         */
        initData: function() {
            let _that = this,
                data = {};
            /**递归构造数据
             * @name: 
             * @param {type} 
             * @return: 
             */
            function buildData(pushdata, deepin, value) {
                _that.options.deepin = deepin;
                let slist = _that.options.data.filter(function(e) {
                    return e[_that.options.parent_field] === value;
                });
                if (pushdata[deepin] === undefined && slist.length > 0) {
                    pushdata[deepin] = [];
                }
                if (pushdata[deepin] !== undefined) {
                    pushdata[deepin] = pushdata[deepin].concat(slist);
                    $.each(slist, function(_, item) {
                        buildData(pushdata, deepin + 1, item.id);
                    });
                }
            }
            if (typeof(_that.options.data) === "function") {
                _that.options.data = this.options.data();
            }
            if (Array.isArray(_that.options.data)) {
                buildData(data, _that.options.deepin, _that.options.top_value);
                _that.options.data = data;
            }
        },
        /**
         * @name: 初始化值
         * @return: 
         */
        initValue: function() {
            let _that = this;
            if (!Array.isArray(_that.options.value)) return;
            let level,
                selectValue,
                evalue, res = false,
                value;
            for (let index = _that.options.value.length; index > 0; index--) {
                level = index - 1;
                selectValue = _that.options.value[level - 1];
                _that.options.data[index].filter(function(item) {
                    evalue = item[_that.options.parent_field].toString();
                    value = item[_that.options.value_field].toString();
                    if (_that.options.multiple &&
                        Array.isArray(_that.options.value[level])) {
                        res = false;
                        $.each(_that.options.value[level], function(_, val) {
                            if (value === val &&
                                $.inArray(val, selectValue) === -1 && level > 0) {
                                _that.options.value[level - 1].push(evalue);
                            }
                            res = res || evalue === val;
                        });
                        return res;
                    } else {
                        if (value === _that.options.value[level].toString()) {
                            if (index > 1) {
                                _that.options.value[level - 1] = evalue;
                            }
                        }
                    }
                });
            }
        },
        /**
         * @name: 渲染option
         * @param {type} elem
         * @param {type} list
         * @return: 
         */
        renderUnitSelect: function(elem, list) {
            let _that = this,
                selectElem = $(elem).is("SELECT") ? elem : $(elem).find("select"),
                option = document.createElement("option"),
                level = parseInt($(selectElem).attr("level")),
                selectValue = _that.options.value[level - 1],
                value, selected = false;
            $(selectElem).empty();
            $(option).val("");
            $(option).text("请选择");
            $(selectElem).append(option);
            $.each(list, function(_, item) {
                option = document.createElement("option");
                value = item[_that.options.value_field];
                $(option).val(value);
                $(option).text(item[_that.options.text_field]);
                if (_that.multiple && _Array.isArray(selectValue)) {
                    selected = $.inArray(value, selectValue) > -1;
                } else {
                    selected = selectValue.toString() === value.toString();
                }
                $(option).attr("selected", selected);
                $.each(item, function(index, e) {
                    $(option).attr("data-" + index, e);
                });
                $(selectElem).append(option);
            });
            $(selectElem).val(selectValue);
        },
        /**
         * @name: 构建下拉框元素
         * @param {type} level
         * @return: 
         */
        buildCaseSelectElem: function(level) {
            let _that = this,
                multiple = _that.options.multiple,
                select = _that.options.onRenderSelect &&
                _that.options.onRenderSelect(_that.options, level);
            if (select === undefined) {
                select = document.createElement("select");
                $(select).attr("level", level);
                $(select).attr("multiple", multiple);
            } else {
                $(select).find("select").attr("level", level);
                $(select).find("select").attr("multiple", multiple);
            }
            return select;
        },
        /**
         * @name: 获取下拉框的下拉数据
         * @param {type} level
         * @param {type} value
         * @return: 
         */
        getSelectRenderList: function(level, pvalue) {
            let _that = this,
                evalue, list = [],
                res = false;
            if (pvalue === null || pvalue === undefined) {
                list = _that.options.data[level];
            } else {
                list = _that.options.data[level].filter(function(e) {
                    evalue = e[_that.options.parent_field].toString();
                    if (_that.options.multiple && Array.isArray(pvalue)) {
                        res = false;
                        $.each(pvalue, function(_, item) {
                            res = res || evalue === item;
                        });
                        return res;
                    } else {
                        return evalue === pvalue.toString();
                    }
                });
            }
            return list;
        },
        /**
         * @name: 绑定下拉框change事件
         * @param {type} elem
         * @return: 
         */
        bindSelectChangeEvent: function(elem) {
            let _that = this,
                currentLevel,
                level, nextLevel, selectElemValue,
                defaultValue = _that.options.multiple ? [] : "";
            selectElem = $(elem).is("SELECT") ? elem : $(elem).find("select");
            $(selectElem).bind("change", function(e) {
                level = parseInt($(this).attr("level"));
                nextLevel = level + 1;
                selectElemValue = $(this).val();
                _that.options.value[level - 1] = selectElemValue;
                $.each($(_that.options.elem).find("select[level]"), function() {
                    currentLevel = parseInt($(this).attr("level"));
                    if (currentLevel === nextLevel) {
                        $(this).val(defaultValue);
                        _that.options.value[currentLevel - 1] = defaultValue;
                        _that.renderUnitSelect(this,
                            _that.getSelectRenderList(nextLevel, selectElemValue));
                    } else if (currentLevel > nextLevel) {
                        $(this).val(defaultValue);
                        _that.options.value[currentLevel - 1] = defaultValue;
                        _that.renderUnitSelect(this, []);
                    }
                });
                _that.options.onSelected &&
                    _that.options.onSelected(this, _that.options.value);
            });

        },
        /**
         * @name: 构建下拉框
         * @return: 
         */
        buildCaseSelect: function() {
            let _that = this,
                level, select,
                defaultValue = _that.options.multiple ? [] : "";
            $.each(_that.options.data, function(index, item) {
                level = parseInt(index) - 1;
                select = _that.buildCaseSelectElem(level + 1);
                _that.options.value[level] =
                    _that.options.value[level] !== undefined ?
                    _that.options.value[level] : defaultValue;
                _that.renderUnitSelect(select, level === 0 ? item : []);
                _that.bindSelectChangeEvent(select);
                $(_that.options.elem).append(select);
            });
        },
        /**
         * @name: 构建完成 
         * @return: 
         */
        /** */
        buildCaseSelectComplete: function() {
            let _that = this,
                level,
                value;
            $.each($(_that.options.elem).find("select[level]"), function() {
                level = parseInt($(this).attr("level"));
                value = level === 1 ? undefined : _that.options.value[level - 2];
                _that.renderUnitSelect(this,
                    _that.getSelectRenderList(level, value));
            });

        },
        /**
         * @name: 设置值
         * @param {type} value
         * @return: 
         */
        setValue: function(value) {
            let _that = this;
            _that.options.value = value;
            _that.initValue();
            _that.buildCaseSelectComplete();
        },
        /**
         * @name: 取值
         * @return: 
         */
        getValue: function() {
            let _that = this,
                level, value,
                defaultValue = _that.options.multiple ? [] : "";
            $.each($(_that.options.elem).find("select[level]"), function() {
                level = parseInt($(this).attr("level")) - 1;
                value = $(this).val();
                _that.options.value[level] =
                    (value === undefined || value === null) ?
                    defaultValue : value;
            });
            return _that.options.value;
        },
    };
    //注册接口
    window.caseSelect = function(options) {
        return new caseSelect(options);
    };
    $.prototype.caseSelect = $.fn.caseSelect = function(options) {
        let _that = this;
        return new caseSelect($.extend({ elem: _that }, options));
    };
})(window, document);