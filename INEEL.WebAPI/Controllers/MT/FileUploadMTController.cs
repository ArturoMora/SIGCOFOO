using System;
using System.Linq;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using System.IO;
using System.Web;
using System.Configuration;
using System.Text;

namespace INEEL.WebAPI.Controllers.MT
{
    public class FileUploadMTController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(FileUploadMTController));
        [HttpPost()]
        public String UploadFiles(long id)
        {
            int iUploadedCnt = 0;
            StringBuilder result = new StringBuilder();
            // DEFINE THE PATH WHERE WE WANT TO SAVE THE FILES.
            string sPath = "";
            //sPath = System.Web.Hosting.HostingEnvironment.MapPath("~/locker/");
            sPath = ConfigurationManager.AppSettings["pathAdjunto"];
            System.Web.HttpFileCollection hfc = HttpContext.Current.Request.Files;
            string size = "";
            string lastModified = "";
            try { log.Info(new MDCSet(this.ControllerContext.RouteData)); 
                size = HttpContext.Current.Request.Form["size"];
                lastModified = HttpContext.Current.Request.Form["lastModified"];
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e); }
            string name = HttpContext.Current.Request.Form["name"];
            String nameFull = lastModified + "_" + size + "_" + name;

            if (hfc == null || hfc.Count < 1)
            {
                return "No fue posible recuperar adjuntos, favor de verificar el envío de datos al servidor";
            }
            try { 
                if (!Directory.Exists(sPath))
                {
                    Directory.CreateDirectory(sPath);
                }
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return "No es posible almacenar archivos en el servidor";
            }

            String fileNew = "";
            String fullPath = "";
            String ip = null;// GetIP();
            ip = String.IsNullOrEmpty(ip) ? "" : ip;
            // CHECK THE FILE COUNT.
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                for (int iCnt = 0; iCnt <= hfc.Count - 1; iCnt++)
                {
                    System.Web.HttpPostedFile hpf = hfc[iCnt];

                    if (hpf.ContentLength > 0)
                    {
                        String full = sPath + nameFull;
                        if (File.Exists(full) && nameFull.Length>1)
                        {
                            File.Delete(full);
                        }

                        if (!File.Exists(full))
                        {
                            // SAVE THE FILES IN THE FOLDER.
                            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                                hpf.SaveAs(full);
                            }
                            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                                return "Permisos insuficientes para almacenar archivos en el servidor";
                            }
                            iUploadedCnt = iUploadedCnt + 1;
                            fileNew = name;
                            fullPath = full;
                        }
                    }
                }
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                try { log.Info(new MDCSet(this.ControllerContext.RouteData));                    
                    result.Append(" message:");
                    result.Append(e.Message);
                    result.Append(e.InnerException.Message);
                }
                catch (Exception ein) { }
            }         

            // RETURN A MESSAGE (OPTIONAL).
            if (iUploadedCnt > 0)
            {
                //var json =new{fileNew, fullPath};
                return fullPath;
            }
            else {
                return "Error al adjuntar documento :" + result.ToString();
            }
        }
        
    }
}
//http://www.encodedna.com/angularjs/tutorial/angularjs-multiple-file-upload-example-with-webapi.htm