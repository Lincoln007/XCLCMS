﻿using System.Threading.Tasks;
using System.Web.Http;
using XCLCMS.Data.WebAPIEntity;

namespace XCLCMS.WebAPI.Controllers
{
    /// <summary>
    /// 开放的API
    /// </summary>
    public class OpenController : BaseAPIController
    {
        private readonly XCLCMS.Data.BLL.UserInfo userInfoBLL = new XCLCMS.Data.BLL.UserInfo();
        private readonly XCLCMS.Data.BLL.Merchant merchantBLL = new XCLCMS.Data.BLL.Merchant();
        private readonly XCLCMS.Data.BLL.MerchantApp merchantAppBLL = new XCLCMS.Data.BLL.MerchantApp();

        /// <summary>
        /// 登录
        /// </summary>
        [HttpPost]
        [XCLCMS.WebAPI.Filters.APIOpenPermissionFilter]
        public async Task<APIResponseEntity<XCLCMS.Data.Model.Custom.UserInfoDetailModel>> LogonCheck([FromBody] APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.Open.LogonCheckEntity> request)
        {
            return await Task.Run(() =>
            {
                var response = new APIResponseEntity<XCLCMS.Data.Model.Custom.UserInfoDetailModel>();
                XCLCMS.Data.Model.UserInfo userModel = null;
                if (string.IsNullOrWhiteSpace(request.Body.UserToken))
                {
                    //用户名和密码登录
                    userModel = userInfoBLL.GetModel(request.Body.UserName, XCLCMS.Data.CommonHelper.EncryptHelper.EncryptStringMD5(request.Body.Pwd));
                }
                else
                {
                    //token登录
                    userModel = XCLCMS.WebAPI.Library.Common.GetUserInfoByUserToken(request.Body.UserToken);
                }

                if (null == userModel)
                {
                    response.Message = "用户名或密码不正确！";
                    response.IsSuccess = false;
                }
                else if (!string.Equals(userModel.UserState, XCLCMS.Data.CommonHelper.EnumType.UserStateEnum.N.ToString()))
                {
                    response.Message = string.Format("用户名{0}已被禁用！", request.Body.UserName);
                    response.IsSuccess = false;
                }
                else
                {
                    response.IsSuccess = true;
                    response.Body = new Data.Model.Custom.UserInfoDetailModel();
                    //用户基本信息
                    response.Body.UserInfo = userModel;
                    //登录令牌
                    response.Body.Token = XCLCMS.Data.CommonHelper.EncryptHelper.CreateToken(new Data.Model.Custom.UserNamePwd()
                    {
                        UserName = userModel.UserName,
                        Pwd = userModel.Pwd
                    });
                    //所在商户
                    response.Body.Merchant = this.merchantBLL.GetModel(userModel.FK_MerchantID);
                    //所在商户应用
                    response.Body.MerchantApp = this.merchantAppBLL.GetModel(userModel.FK_MerchantAppID);
                }

                return response;
            });
        }
    }
}