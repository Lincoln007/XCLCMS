﻿/// <reference path="common.d.ts" />

import common from "./Common";
import userControl from "./UserControl";

/**
 * 商户管理
 * @type type
 */
let app: IAnyPropObject = {};

/**
 * 商户信息列表
 * @type type
 */
app.MerchantList = {
    Init: function () {
        var _this = this;
        $("#btnUpdate").on("click", function () {
            return _this.Update();
        });
        $("#btnDel").on("click", function () {
            return _this.Del();
        })
    },
    /**
     * 返回已选择的value数组
     */
    GetSelectValue: function () {
        var selectVal = $(".XCLTableCheckAll").val();
        var ids = selectVal.split(',');
        if (selectVal && selectVal !== "" && ids.length > 0) {
            return ids;
        } else {
            return null;
        }
    },
    /**
     * 打开商户信息【修改】页面
     */
    Update: function () {
        var $btn = $("#btnUpdate"), ids = this.GetSelectValue();
        if (ids && ids.length === 1) {
            var query = {
                handletype: "update",
                MerchantID: ids[0]
            }

            var url = XJ.Url.UpdateParam($btn.attr("href"), query);
            $btn.attr("href", url);
            return true;
        } else {
            art.dialog.tips("请选择一条记录进行修改操作！");
            return false;
        }
    },
    /**
     * 删除商户信息
     */
    Del: function () {
        var ids = this.GetSelectValue();
        if (!ids || ids.length == 0) {
            art.dialog.tips("请至少选择一条记录进行操作！");
            return false;
        }

        art.dialog.confirm("您确定要删除此信息吗？", function () {
            $.XGoAjax({
                target: $("#btnDel")[0],
                ajax: {
                    url: XCLCMSPageGlobalConfig.RootURL + "Merchant/DelByIDSubmit",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
                    type: "POST"
                }
            });
        }, function () {
        });

        return false;
    }
};

/**
 * 商户信息添加与修改页
 */
app.MerchantAdd = {
    Init: function () {
        var _this = this;
        _this.InitValidator();

        $("#txtRegisterTime").on("click", function () {
            WdatePicker({ dateFmt: 'yyyy-MM-dd' });
            return false;
        });
    },
    /**
     * 表单验证初始化
     */
    InitValidator: function () {
        var validator = $("form:first").validate({
            rules: {
                txtMerchantName: {
                    required: true,
                    XCLCustomRemote: function () {
                        return {
                            url: XCLCMSPageGlobalConfig.RootURL + "Merchant/IsExistMerchantName",
                            data: {
                                MerchantName: $("#txtMerchantName").val(),
                                MerchantID: $("#MerchantID").val()
                            }
                        };
                    }
                },
                txtEmail: "email",
                selMerchantState: { required: true }
            }
        });
        common.BindLinkButtonEvent("click", $("#btnSave"), function () {
            if (!common.CommonFormValid(validator)) {
                return false;
            }
            $.XGoAjax({ target: $("#btnSave")[0] });
        });
    }
};

/**
* 商户应用信息列表
*/
app.MerchantAppList = {
    Init: function () {
        var _this = this;
        $("#btnUpdate").on("click", function () {
            return _this.Update();
        });
        $("#btnDel").on("click", function () {
            return _this.Del();
        })
    },
    /**
     * 返回已选择的value数组
     */
    GetSelectValue: function () {
        var selectVal = $(".XCLTableCheckAll").val();
        var ids = selectVal.split(',');
        if (selectVal && selectVal !== "" && ids.length > 0) {
            return ids;
        } else {
            return null;
        }
    },
    /**
     * 打开商户应用信息【修改】页面
     */
    Update: function () {
        var $btn = $("#btnUpdate"), ids = this.GetSelectValue();
        if (ids && ids.length === 1) {
            var query = {
                handletype: "update",
                MerchantAppID: ids[0]
            }

            var url = XJ.Url.UpdateParam($btn.attr("href"), query);
            $btn.attr("href", url);
            return true;
        } else {
            art.dialog.tips("请选择一条记录进行修改操作！");
            return false;
        }
    },
    /**
     * 删除商户应用信息
     */
    Del: function () {
        var ids = this.GetSelectValue();
        if (!ids || ids.length == 0) {
            art.dialog.tips("请至少选择一条记录进行操作！");
            return false;
        }

        art.dialog.confirm("您确定要删除此信息吗？", function () {
            $.XGoAjax({
                target: $("#btnDel")[0],
                ajax: {
                    url: XCLCMSPageGlobalConfig.RootURL + "MerchantApp/DelByIDSubmit",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
                    type: "POST"
                }
            });
        }, function () {
        });

        return false;
    }
};
app.MerchantAppAdd = {
    Init: function () {
        var _this = this;
        _this.InitValidator();

        //商户号下拉框初始化
        userControl.MerchantSelect.Init({
            merchantIDObj: $("#txtMerchantID")
        });
    },
    /**
     * 表单验证初始化
     */
    InitValidator: function () {
        var validator = $("form:first").validate({
            rules: {
                txtMerchantAppName: {
                    required: true,
                    XCLCustomRemote: function () {
                        return {
                            url: XCLCMSPageGlobalConfig.RootURL + "MerchantApp/IsExistMerchantAppName",
                            data: {
                                MerchantAppName: $("#txtMerchantAppName").val(),
                                MerchantAppID: $("#MerchantAppID").val()
                            }
                        };
                    }
                },
                txtAppKey: {
                    required: true
                }
            }
        });
        common.BindLinkButtonEvent("click", $("#btnSave"), function () {
            if (!common.CommonFormValid(validator)) {
                return false;
            }
            $.XGoAjax({ target: $("#btnSave")[0] });
        });
    }
};

export default app;