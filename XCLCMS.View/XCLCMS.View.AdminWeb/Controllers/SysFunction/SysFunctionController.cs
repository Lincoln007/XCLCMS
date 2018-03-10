﻿using System;
using System.Collections.Generic;
using System.Web.Mvc;

namespace XCLCMS.View.AdminWeb.Controllers.SysFunction
{
    /// <summary>
    /// 功能controller
    /// </summary>
    public class SysFunctionController : BaseController
    {
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_Set_SysFunctionView)]
        public ActionResult Index()
        {
            return View("~/Views/SysFunction/SysFunctionList.cshtml");
        }

        /// <summary>
        /// 添加与编辑页面首页
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_Set_SysFunctionAdd)]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_Set_SysFunctionEdit)]
        public ActionResult Add()
        {
            long sysFunctionID = XCLNetTools.StringHander.FormHelper.GetLong("SysFunctionID");

            XCLCMS.View.AdminWeb.Models.SysFunction.SysFunctionAddVM viewModel = new XCLCMS.View.AdminWeb.Models.SysFunction.SysFunctionAddVM();

            switch (base.CurrentHandleType)
            {
                case XCLNetTools.Enum.CommonEnum.HandleTypeEnum.ADD:
                    viewModel.SysFunction = new Data.Model.SysFunction();
                    viewModel.ParentID = sysFunctionID;
                    viewModel.SysFunctionID = -1;
                    viewModel.FormAction = Url.Action("AddSubmit", "SysFunction");
                    break;

                case XCLNetTools.Enum.CommonEnum.HandleTypeEnum.UPDATE:

                    var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<long>(base.UserToken);
                    request.Body = sysFunctionID;
                    var response = XCLCMS.Lib.WebAPI.SysFunctionAPI.Detail(request);

                    viewModel.SysFunction = response.Body;
                    viewModel.ParentID = viewModel.SysFunction.ParentID;
                    viewModel.SysFunctionID = viewModel.SysFunction.SysFunctionID;
                    viewModel.FormAction = Url.Action("UpdateSubmit", "SysFunction");
                    break;
            }

            viewModel.PathList = XCLCMS.Lib.Common.FastAPI.SysFunctionAPI_GetLayerListBySysFunctionId(base.UserToken, new Data.WebAPIEntity.RequestEntity.SysFunction.GetLayerListBySysFunctionIdEntity()
            {
                SysFunctionId = sysFunctionID
            });

            return View("~/Views/SysFunction/SysFunctionAdd.cshtml", viewModel);
        }

        /// <summary>
        /// 将表单值转为viewModel
        /// </summary>
        private XCLCMS.View.AdminWeb.Models.SysFunction.SysFunctionAddVM GetViewModel(FormCollection fm)
        {
            XCLCMS.View.AdminWeb.Models.SysFunction.SysFunctionAddVM viewModel = new XCLCMS.View.AdminWeb.Models.SysFunction.SysFunctionAddVM();
            viewModel.SysFunction = new Data.Model.SysFunction();
            viewModel.SysFunctionID = XCLNetTools.Common.DataTypeConvert.ToLong(fm["SysFunctionID"]);
            viewModel.ParentID = XCLNetTools.Common.DataTypeConvert.ToLong(fm["ParentID"]);
            viewModel.SysFunction.Code = (fm["txtCode"] ?? "").Trim();
            viewModel.SysFunction.FunctionName = (fm["txtFunctionName"] ?? "").Trim();
            viewModel.SysFunction.Remark = (fm["txtRemark"] ?? "").Trim();
            return viewModel;
        }

        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_Set_SysFunctionAdd)]
        public override ActionResult AddSubmit(FormCollection fm)
        {
            base.AddSubmit(fm);
            XCLCMS.View.AdminWeb.Models.SysFunction.SysFunctionAddVM viewModel = this.GetViewModel(fm);

            XCLCMS.Data.Model.SysFunction model = null;
            model = new Data.Model.SysFunction();
            model.ParentID = viewModel.ParentID;
            model.FunctionName = viewModel.SysFunction.FunctionName;
            model.Remark = viewModel.SysFunction.Remark;
            model.RecordState = XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.N.ToString();
            model.SysFunctionID = XCLCMS.Lib.Common.FastAPI.CommonAPI_GenerateID(base.UserToken, new Data.WebAPIEntity.RequestEntity.Common.GenerateIDEntity()
            {
                IDType = Data.CommonHelper.EnumType.IDTypeEnum.FUN.ToString()
            });
            model.Code = viewModel.SysFunction.Code;

            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.Model.SysFunction>(base.UserToken);
            request.Body = model;
            var response = XCLCMS.Lib.WebAPI.SysFunctionAPI.Add(request);

            return Json(response);
        }

        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_Set_SysFunctionEdit)]
        public override ActionResult UpdateSubmit(FormCollection fm)
        {
            base.UpdateSubmit(fm);
            XCLCMS.View.AdminWeb.Models.SysFunction.SysFunctionAddVM viewModel = this.GetViewModel(fm);
            XCLCMS.Data.Model.SysFunction model = new Data.Model.SysFunction();
            model.SysFunctionID = viewModel.SysFunctionID;
            model.FunctionName = viewModel.SysFunction.FunctionName;
            model.Remark = viewModel.SysFunction.Remark;
            model.Code = viewModel.SysFunction.Code;

            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.Model.SysFunction>(base.UserToken);
            request.Body = model;
            var response = XCLCMS.Lib.WebAPI.SysFunctionAPI.Update(request);

            return Json(response);
        }

        [HttpGet]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_Set_SysFunctionView)]
        public ActionResult GetList(long id = 0)
        {
            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<long>(base.UserToken);
            request.Body = id;
            var response = XCLCMS.Lib.WebAPI.SysFunctionAPI.GetList(request);
            return Json(response, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult GetAllJsonForEasyUITree([System.Web.Http.FromUri] XCLCMS.Data.WebAPIEntity.RequestEntity.SysFunction.GetAllJsonForEasyUITreeEntity condition)
        {
            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.WebAPIEntity.RequestEntity.SysFunction.GetAllJsonForEasyUITreeEntity>(base.UserToken);
            request.Body = condition;
            var response = XCLCMS.Lib.WebAPI.SysFunctionAPI.GetAllJsonForEasyUITree(request);
            return new ContentResult()
            {
                Content = XCLNetTools.Serialize.JSON.Serialize(response, XCLNetTools.Serialize.JSON.JsonProviderEnum.Newtonsoft),
                ContentEncoding = System.Text.Encoding.UTF8,
                ContentType = "application/json"
            };
        }

        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_Set_SysFunctionDel)]
        public override ActionResult DelByIDSubmit(List<long> ids)
        {
            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<List<long>>(base.UserToken);
            request.Body = ids;
            var response = XCLCMS.Lib.WebAPI.SysFunctionAPI.Delete(request);
            return Json(response);
        }

        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_Set_SysFunctionDel)]
        public ActionResult DelChild(long id)
        {
            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<long>(base.UserToken);
            request.Body = id;
            var response = XCLCMS.Lib.WebAPI.SysFunctionAPI.DelChild(request);
            return Json(response);
        }

        [HttpGet]
        public ActionResult IsExistFunctionNameInSameLevel([System.Web.Http.FromUri] XCLCMS.Data.WebAPIEntity.RequestEntity.SysFunction.IsExistFunctionNameInSameLevelEntity condition)
        {
            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.WebAPIEntity.RequestEntity.SysFunction.IsExistFunctionNameInSameLevelEntity>(base.UserToken);
            request.Body = condition;
            var response = XCLCMS.Lib.WebAPI.SysFunctionAPI.IsExistFunctionNameInSameLevel(request);
            return Json(response, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult IsExistCode([System.Web.Http.FromUri] XCLCMS.Data.WebAPIEntity.RequestEntity.SysFunction.IsExistCodeEntity condition)
        {
            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.WebAPIEntity.RequestEntity.SysFunction.IsExistCodeEntity>(base.UserToken);
            request.Body = condition;
            var response = XCLCMS.Lib.WebAPI.SysFunctionAPI.IsExistCode(request);
            return Json(response, JsonRequestBehavior.AllowGet);
        }
    }
}