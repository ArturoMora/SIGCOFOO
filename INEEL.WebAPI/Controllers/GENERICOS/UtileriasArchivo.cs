using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;

namespace INEEL.WebAPI.Controllers.GENERICOS
{
    public class UtileriasArchivo : HttpResponseMessage
    {
        /// <summary>
        /// Recupera cualquier tipo de archivo del servidor.
        /// </summary>
        public HttpResponseMessage GetFile(String localFilePath, String nombre, HttpRequestMessage Request)
        {
            localFilePath = localFilePath.Replace("\"", "");
            HttpResponseMessage response = null;
            String nameFile = "error.aldescargar";
            if (!System.IO.File.Exists(localFilePath))
            {
                //response = Request.CreateResponse(HttpStatusCode.Gone);
                response = new HttpResponseMessage();
                response.Content = new StringContent(
"<html><head></head><body>No se encuetra el elemento solicitado <input type=\"button\" value=\"Cerrar Ventana\" onclick=\"window.close()\" /></body></html>");
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("text/html");
                response = new HttpResponseMessage(HttpStatusCode.NoContent);
                throw new Exception("No es posible recuperar el archivo");
                return response;
            }
            else {
                nameFile = nombre; // Path.GetFileName(localFilePath);
                response = new HttpResponseMessage(HttpStatusCode.OK);
                var stream = new System.IO.FileStream(localFilePath, System.IO.FileMode.Open);
                response.Content = new StreamContent(stream);
                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/octet-stream");
                //response.Content.Headers.
                response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
                {
                    FileName = nameFile
                };
                response.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
                response.Content.Headers.ContentDisposition.FileName = "SampleImg";
                return response;
            }

        }
    }
}