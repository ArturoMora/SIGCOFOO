using System;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Util;
using System.Collections.Generic;
using System.Configuration;

namespace INEEL.WebAPI.Controllers.CH
{
    public class UploadController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(UploadController));/*
        [System.Web.Http.HttpPost]
        public void UploadFile()
        {
            if (HttpContext.Current.Request.Files.AllKeys.Any())
            {
                var httpPostedFile = HttpContext.Current.Request.Files["file"];
                bool folderExists = Directory.Exists(HttpContext.Current.Server.MapPath("~/UploadedDocuments"));
                if (!folderExists)
                    Directory.CreateDirectory(HttpContext.Current.Server.MapPath("~/UploadedDocuments"));
                var fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath("~/UploadedDocuments"), httpPostedFile.FileName);
                httpPostedFile.SaveAs(fileSavePath);

                if (File.Exists(fileSavePath))
                {
                    StreamReader testTxt = new StreamReader(fileSavePath);
                    string allRead = testTxt.ReadToEnd();
                    testTxt.Close();
                    //using (SftpClient sftpClient = new SftpClient(AppConfig.SftpServerIp, Convert.ToInt32(AppConfig.SftpServerPort), AppConfig.SftpServerUserName, AppConfig.SftpServerPassword))
                    //{
                    //    sftpClient.Connect();
                    //    if (!sftpClient.Exists(AppConfig.SftpPath + "UserID"))
                    //    {
                    //        sftpClient.CreateDirectory(AppConfig.SftpPath + "UserID");
                    //    }

                    //    Stream fin = File.OpenRead(fileSavePath);
                    //    sftpClient.UploadFile(fin, AppConfig.SftpPath + "/" + httpPostedFile.FileName, true);
                    //    fin.Close();
                    //    sftpClient.Disconnect();
                    //}
                }
            }
        }
        fin de codigo de ALAN*/

        [AllowAnonymous]
        [HttpGet]
        public IHttpActionResult listaBanners()
        {

            InformacionArchivo objInfoArchivo = new InformacionArchivo();
            List<InformacionArchivo> nombreArchivos = new List<InformacionArchivo>();
            //string myPath = HttpContext.Current.Server.MapPath("\\Resources\\Banners");
            //myPath = myPath.Replace("WebApi", "WebSite");
            string myPath = ConfigurationManager.AppSettings["banners"];
            DirectoryInfo di = new DirectoryInfo(myPath);

            var lista = di.GetFiles();
            var count = 0;
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                foreach (var file in lista)
                {
                    nombreArchivos.Add(new InformacionArchivo()
                    {
                        nombre = file.Name,
                        tamano = file.Length,
                        fullPath = file.FullName,
                        originalPath = "/Resources/Banners/" + file.Name,
                        posicion = count
                    });
                    count++;
                }
                return Ok(nombreArchivos);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return BadRequest(e.Message);
            }

        }
    }
}
