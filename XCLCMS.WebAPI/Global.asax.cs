﻿using Autofac;
using Autofac.Integration.WebApi;
using System;
using System.Reflection;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;

namespace XCLCMS.WebAPI
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            RouteConfig.RegisterRoutes(RouteTable.Routes);

            //autofac配置
            var webApiBaseType = typeof(XCLCMS.IService.WebAPI.IBaseInfoService);
            var builder = new ContainerBuilder();
            var config = GlobalConfiguration.Configuration;
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly());
            builder.RegisterWebApiFilterProvider(config);
            //web api服务注册
            builder.RegisterAssemblyTypes(Assembly.Load("XCLCMS.Service.WebAPI")).Where(k => webApiBaseType.IsAssignableFrom(k) && k != webApiBaseType).AsImplementedInterfaces().InstancePerLifetimeScope();
            var container = builder.Build();
            config.DependencyResolver = new AutofacWebApiDependencyResolver(container);
        }
    }
}