﻿/// <reference path="common.d.ts" />

import common from "./Common";
import userControl from "./UserControl";

/**
 * 广告位列表
 */
class AdsList {
    /**
     * 初始化
     */
    Init(): void {
        let _this = this;
        $("#btnUpdate").on("click", function () {
            return _this.Update();
        });
        $("#btnDel").on("click", function () {
            return _this.Del();
        });
    };
    /**
     * 返回已选择的value数组
     */
    GetSelectValue(): Array<string> | null {
        let selectVal = $(".XCLTableCheckAll").val();
        let ids = selectVal.split(',');
        if (selectVal && selectVal !== "" && ids.length > 0) {
            return ids;
        } else {
            return null;
        }
    };
    /**
     * 打开广告位【修改】页面
     */
    Update(): boolean {
        let $btn = $("#btnUpdate"), ids = this.GetSelectValue();
        if (ids && ids.length === 1) {
            let query = {
                handletype: "update",
                AdsID: ids[0]
            }

            let url = XJ.Url.UpdateParam($btn.attr("href"), query);
            $btn.attr("href", url);
            return true;
        } else {
            art.dialog.tips("请选择一条记录进行修改操作！");
            return false;
        }
    };
    /**
     * 删除广告位
     */
    Del(): boolean {
        let ids = this.GetSelectValue();
        if (!ids || ids.length == 0) {
            art.dialog.tips("请至少选择一条记录进行操作！");
            return false;
        }

        art.dialog.confirm("您确定要删除此信息吗？", function () {
            $.XGoAjax({
                target: $("#btnDel")[0],
                ajax: {
                    url: XCLCMSPageGlobalConfig.RootURL + "Ads/DelByIDSubmit",
                    data: JSON.stringify(ids),
                    contentType: "application/json",
                    type: "POST"
                }
            });
        }, function () {
        });

        return false;
    }
}

/**
 * 广告位添加与修改页
 */
class AdsAdd {
    /**
* 输入元素
*/
    Elements: any = {
        Init: function () {
        }
    }
    /**
     * 初始化
     */
    Init(): void {
        let _this = this;
        _this.Elements.Init();
        _this.InitValidator();

        //商户号下拉框初始化
        userControl.MerchantSelect.Init({
            merchantIDObj: $("#txtMerchantID"),
            merchantAppIDObj: $("#txtMerchantAppID")
        });
    }
    /**
 * 表单验证初始化
 */
    InitValidator(): void {
        let validator = $("form:first").validate({
            rules: {
                txtTitle: {
                    required: true
                },
                txtCode: {
                    required: true,
                    XCLCustomRemote: function () {
                        return {
                            url: XCLCMSPageGlobalConfig.RootURL + "Ads/IsExistCodeSubmit",
                            data: function () {
                                return {
                                    Code: $("input[name='txtCode']").val(),
                                    AdsID: $("input[name='AdsID']").val()
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

class App {
    constructor() {
        this.AdsAdd = new AdsAdd();
        this.AdsList = new AdsList();
    }
    AdsList: AdsList;
    AdsAdd: AdsAdd;
}

export default new App();