﻿/// <reference path="common.d.ts" />

import common from "./Common";
import userControl from "./UserControl";

/**
 * 友情链接管理
 * @type type
 */
let app: IAnyPropObject = {};

/**
 * 友情链接列表
 * @type type
 */
app.FriendLinksList = {
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
     * 打开友情链接【修改】页面
     */
    Update: function () {
        var $btn = $("#btnUpdate"), ids = this.GetSelectValue();
        if (ids && ids.length === 1) {
            var query = {
                handletype: "update",
                FriendLinkID: ids[0]
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
     * 删除友情链接
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
                    url: XCLCMSPageGlobalConfig.RootURL + "FriendLinks/DelByIDSubmit",
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
 * 友情链接添加与修改页
 */
app.FriendLinksAdd = {
    /**
    * 输入元素
    */
    Elements: {
        Init: function () {
        }
    },
    Init: function () {
        var _this = this;
        _this.Elements.Init();
        _this.InitValidator();

        //商户号下拉框初始化
        userControl.MerchantSelect.Init({
            merchantIDObj: $("#txtMerchantID"),
            merchantAppIDObj: $("#txtMerchantAppID")
        });
    },
    /**
     * 表单验证初始化
     */
    InitValidator: function () {
        var validator = $("form:first").validate({
            rules: {
                txtTitle: {
                    required: true,
                    XCLCustomRemote: function () {
                        return {
                            url: XCLCMSPageGlobalConfig.RootURL + "FriendLinks/IsExistTitle",
                            data: function () {
                                return {
                                    Title: $("input[name='txtTitle']").val(),
                                    FriendLinkID: $("input[name='FriendLinkID']").val(),
                                    MerchantID: $("input[name='txtMerchantID']").val(),
                                    MerchantAppID: $("input[name='txtMerchantAppID']").val()
                                };
                            }
                        };
                    }
                },
                txtEmail: "email"
            }
        });
        common.BindLinkButtonEvent("click", $("#btnSave"), function () {
            if (!common.CommonFormValid(validator)) {
                return false;
            }
            $.XGoAjax({ target: $("#btnSave")[0] });
        });
    }
}
export default app;