var app={};app.FileInfo={},app.FileInfo.List={Init:function(){$.XCheck()}},app.LogicFile={},app.LogicFile.List={Init:function(){var e=this;$.XCheck(),$("#btnBatchDel").on("click",function(){return e.DelSubmit($(":checkbox.xcheckValue").val()),!1}),$("#btnSelectFiles").on("click",function(){return e.SelectFiles($(":checkbox.xcheckValue").val(),$(this).attr("callback")),!1})},DelSubmit:function(e){if(!e)return art.dialog.tips("请指定要删除的记录！"),!1;art.dialog.confirm("您确定要删除此信息吗？",function(){$.XGoAjax({ajax:[{data:{attachmentIDs:e},url:AppConfig.RootUrl+"LogicFile/DelSubmit",type:"POST"}]})},function(){})},SelectFiles:function(e,t){if(!e||!t)return art.dialog.tips("请先选择文件再操作！"),!1;art.dialog.opener[t].call(null,e);var i=art.dialog.open.api;i&&i.close()}},app.LogicFile.Update={Init:function(){var e=this;$("#btnSave").on("click",function(){return e.SaveSubmit(),!1})},SaveSubmit:function(){$.XGoAjax({isExclusive:!0,id:"btnSave"})}},angular.module("ngFileInfo",[]).controller("fileInfoList",["$scope",function(e){e.data=[],e.initList=function(){$.XGoAjax({isExclusive:!0,id:"getFileList",ajax:{url:AppConfig.RootUrl+"FileInfo/GetFileList"},success:function(t,i){e.data=i.CustomObject||[],e.$apply()}})},e.initList(),e.delSubmit=function(t){if(!t)return art.dialog.tips("请指定要删除的文件！"),!1;art.dialog.confirm("您确定要删除此文件吗？",function(){$.XGoAjax({ajax:[{data:{paths:t},url:AppConfig.RootUrl+"FileInfo/DelSubmit",type:"POST"}],complete:function(){e.initList()}})},function(){})},e.delBatchSubmit=function(){e.delSubmit($(":checkbox.xcheckValue").val())}}]).filter("encodeURIComponent",function(){return window.encodeURIComponent}),angular.module("ngUpload",[]).controller("fileUpload",["$scope",function(e){var t=$("#tabFileUpload"),i=function(){this.Width=0,this.Height=0};e.FileModelList=[],e.IsCanAddFile=!0,e.IsCanUploadFile=!0,e.IsCanOperateFileItem=!0,e.CurrentFileModel=null;var l=null,n=null,o=function(t){var i=null;return e.FileModelList&&$.each(e.FileModelList,function(e,l){if(l.Id==t)return i=l,!1}),i},r=function(t){t?(l.disableBrowse(!1),e.IsCanAddFile=!0,e.IsCanUploadFile=!0,e.IsCanOperateFileItem=!0):(l.disableBrowse(!0),e.IsCanAddFile=!1,e.IsCanUploadFile=!1,e.IsCanOperateFileItem=!1,e.CurrentFileModel=null)};e.startUpload=function(){l&&l.start()},e.clearFunction=function(){$("#fileUploaderProgress").progressbar("setValue",0),e.FileModelList=[],e.CurrentFileModel=null,l.splice(0,l.files.length),l.refresh(),r(!0)},e.fileEditFunction=function(l){if(t.tabs("select","文件设置"),e.CurrentFileModel&&l==e.CurrentFileModel.Id)return!1;n&&n.destroy(),e.CurrentFileModel=o(l),null!=e.CurrentFileModel.ThumbImgSettings&&0!=e.CurrentFileModel.ThumbImgSettings.length||(e.CurrentFileModel.ThumbImgSettings=[new i])},e.fileDetailFunction=function(i){if(t.tabs("select","文件详情"),e.CurrentFileModel&&i==e.CurrentFileModel.Id)return!1;n&&n.destroy(),e.CurrentFileModel=o(i)},e.fileDelFunction=function(t){l.removeFile(t),function(t){e.FileModelList&&(e.FileModelList=$.map(e.FileModelList,function(e){return e.Id==t?null:e})),e.CurrentFileModel&&t===e.CurrentFileModel.Id&&(e.CurrentFileModel=null)}(t)};var a=function(t){e.CurrentFileModel.X1=t.x,e.CurrentFileModel.X2=t.x2,e.CurrentFileModel.Y1=t.y,e.CurrentFileModel.Y2=t.y2,e.CurrentFileModel.W=t.w,e.CurrentFileModel.H=t.h,e.CurrentFileModel.ImgX1=parseInt(t.x/e.CurrentFileModel.ImgPreviewRatio),e.CurrentFileModel.ImgX2=parseInt(t.x2/e.CurrentFileModel.ImgPreviewRatio),e.CurrentFileModel.ImgY1=parseInt(t.y/e.CurrentFileModel.ImgPreviewRatio),e.CurrentFileModel.ImgY2=parseInt(t.y2/e.CurrentFileModel.ImgPreviewRatio),e.CurrentFileModel.ImgCropWidth=parseInt(t.w/e.CurrentFileModel.ImgPreviewRatio),e.CurrentFileModel.ImgCropHeight=parseInt(t.h/e.CurrentFileModel.ImgPreviewRatio)};e.showSourceImg=function(){$("#formShowImg").submit()},e.thumbImgSettingAdd=function(){e.CurrentFileModel.ThumbImgSettings.push(new i)},e.thumbImgSettingDel=function(t){e.CurrentFileModel.ThumbImgSettings.splice(t,1)};var s=function(t){t.Width?t.Height=XJ.Data.GetInt(t.Width*e.CurrentFileModel.ImgCropHeight/e.CurrentFileModel.ImgCropWidth):t.Width=XJ.Data.GetInt(t.Height*e.CurrentFileModel.ImgCropWidth/e.CurrentFileModel.ImgCropHeight)};e.setEqualRatio=function(t){t?s.call(this,t):$.each(e.CurrentFileModel.ThumbImgSettings,function(e,t){s.call(this,t)})},e.initImgCrop=function(){$("img#ImgToEdit").removeAttr("style").hide().Jcrop({onSelect:function(){a.apply(this,arguments),e.$apply()},onChange:function(){a.apply(this,arguments),e.$apply()},onRelease:function(){0==e.CurrentFileModel.ImgCropWidth||0==e.CurrentFileModel.ImgCropWidth?this.setSelect([0,0,e.CurrentFileModel.ImgPreviewWidth,e.CurrentFileModel.ImgPreviewHeight]):this.setSelect([e.CurrentFileModel.X1,e.CurrentFileModel.Y1,e.CurrentFileModel.X2,e.CurrentFileModel.Y2])}},function(){n=this,this.release.call(this)})},e.$watch("CurrentFileModel",function(i){try{i?(t.tabs("enableTab","文件详情"),t.tabs("enableTab","文件设置")):(t.tabs("select","选择文件"),t.tabs("disableTab","文件详情"),t.tabs("disableTab","文件设置"))}catch(e){}i&&e.setEqualRatio()},!0),e.init=function(){(l=new plupload.Uploader({browse_button:"btnAddFile",url:AppConfig.RootUrl+"Upload/UploadSubmit",file_data_name:"FileInfo",filters:{mime_types:[{title:"选择文件",extensions:window.AppConfig.AllowUploadExtInfo}],prevent_duplicates:!0},flash_swf_url:AppConfig.RootUrl+"Resources/src/js/plupload/Moxie.swf",silverlight_xap_url:AppConfig.RootUrl+"Resources/src/js/plupload/Moxie.xap"})).init(),l.bind("FilesAdded",function(t,i){var l=[];plupload.each(i,function(e){var t=new function(){this.IsImage=!1,this.Path="",this.ImgSmallPath="",this.ImgBigPath="",this.Id="",this.Size="",this.Format="",this.Name="",this.ImgWidth=0,this.ImgHeight=0,this.ImgPreviewWidth=0,this.ImgPreviewHeight=0,this.ImgPreviewRatio=0,this.X1=0,this.Y1=0,this.X2=0,this.Y2=0,this.W=0,this.H=0,this.ImgX1=0,this.ImgY1=0,this.ImgX2=0,this.ImgY2=0,this.ImgCropWidth=0,this.ImgCropHeight=0,this.ThumbImgSettings=[],this.Title="",this.ViewType="NOR",this.DownloadCount=0,this.ViewCount=0,this.Description="",this.IsUploadSuccess=!1,this.UploadMsg=""};t.Id=e.id,t.Name=e.name,t.Size=plupload.formatSize(e.size),t.IsImage=XJ.ContentType.IsImage(e.type)&&!XJ.ContentType.IsGif(e.type),t.Format=e.name.slice(e.name.lastIndexOf(".")+1),function(e){if(e.file&&XJ.ContentType.IsImage(e.file.type)&&!XJ.ContentType.IsGif(e.file.type))if(XJ.ContentType.IsGif(e.file.type)){var t=new mOxie.FileReader;t.onload=function(){e.callback(t.result),t.destroy(),t=null},t.readAsDataURL(e.file.getSource())}else{var i=new mOxie.Image;i.onload=function(){e.callback&&e.callback(i),i.destroy(),i=null},i.load(e.file.getSource())}}({file:e,callback:function(i){t.ImgWidth=i.width,t.ImgHeight=i.height,t.Path=i.getAsDataURL(),i.downsize(180,180),t.ImgSmallPath=i.getAsDataURL();var l=new mOxie.Image;l.onload=function(){l.downsize(600,600),t.ImgBigPath=l.getAsDataURL(),t.ImgPreviewWidth=l.width,t.ImgPreviewHeight=l.height,t.ImgPreviewRatio=t.ImgPreviewWidth/t.ImgWidth,i.destroy(),i=null},l.load(e.getSource()),$("img#"+e.id).attr({src:t.ImgSmallPath})}}),l.push(t)}),e.FileModelList=XJ.Array.Concat(e.FileModelList,l),e.$apply()}),l.bind("BeforeUpload",function(t,i){r(!1);var l=$.map(e.FileModelList,function(e){return i.id==e.Id?e:null});l&&l.length>0&&(l[0].ImgSmallPath="",l[0].ImgBigPath="",l[0].Path=""),t.settings.multipart_params={FileSetting:JSON.stringify(l[0])}}),l.bind("UploadProgress",function(e,t){$("#fileUploaderProgress").progressbar("setValue",e.total.percent)}),l.bind("FileUploaded",function(t,i,l){var n=JSON.parse(l.response),r=o(i.id);r.UploadMsg=n.Message,r.IsUploadSuccess=n.IsSuccess,e.$apply()}),l.bind("UploadComplete",function(e,t){0==t.length&&art.dialog({icon:"face-smile",content:"当前没有待上传的文件！",ok:!0})})},e.init()}]),$(function(){var e=$("#tabFileUpload");e.tabs("disableTab","文件详情"),e.tabs("disableTab","文件设置")});
//# sourceMappingURL=app.js.map
