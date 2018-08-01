using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Models.CH;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories;
using INEEL.DataAccess.GEN.Repositories.CH;
using System.IO;
using INEEL.DataAccess.GEN.Util;
using System.Text.RegularExpressions;

namespace INEEL.WebAPI.Controllers.GENERICOS
{
    
    public class DescargaController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(DescargaController));
        
        AdjuntoRepository adjuntoRepo;
        
        public DescargaController()
        {
            adjuntoRepo = new AdjuntoRepository();
            
        }
        [HttpPost]
        public async Task<IHttpActionResult>  GetDatos(long id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                Adjunto fil = await adjuntoRepo.GetAsync(id);
                var mime= UtilMime.GetMimeMapping(fil.nombre);
                var obj = new {
                    nombre= fil.nombre,
                    mime= mime
                };
                return Ok(obj);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        public String GetTextFromHtml(string html)
        {
            const string tagWhiteSpace = @"(>|$)(\W|\n|\r)+<";//matches one or more (white space or line breaks) between '>' and '<'
            const string stripFormatting = @"<[^>]*(>|$)";//match any character between '<' and '>', even when end tag is missing
            const string lineBreak = @"<(br|BR)\s{0,1}\/{0,1}>";//matches: <br>,<br/>,<br />,<BR>,<BR/>,<BR />
            var lineBreakRegex = new Regex(lineBreak, RegexOptions.Multiline);
            var stripFormattingRegex = new Regex(stripFormatting, RegexOptions.Multiline);
            var tagWhiteSpaceRegex = new Regex(tagWhiteSpace, RegexOptions.Multiline);

            var text = html;
            //Decode html specific characters
            text = System.Net.WebUtility.HtmlDecode(text);
            //Remove tag whitespace/line breaks
            //text = tagWhiteSpaceRegex.Replace(text, "><");
            //Replace <br /> with line breaks
            text = lineBreakRegex.Replace(text, "");
            //Environment.NewLine
            ////Strip formatting
            //text = stripFormattingRegex.Replace(text, string.Empty);

            return text;

        }
        private async Task<String> getExternalResource(String urlExternal)
        {
            string html = string.Empty;
            await Task.Run(() =>
            {

                string url = urlExternal;

                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
                request.AutomaticDecompression = DecompressionMethods.GZip;

                using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
                using (Stream stream = response.GetResponseStream())
                using (StreamReader reader = new StreamReader(stream))
                {
                    html = reader.ReadToEnd();
                }
            });
            return html;
        }
        [HttpPost]
        public async Task<IHttpActionResult> getUrl([FromBody]Body model)
        {

            try { 
                string html = string.Empty;
                html = await getExternalResource(model.Cadena);
                try { 

                    html = GetTextFromHtml(html);
                  
                }
                catch (Exception e) { log.Warn(new MDCSet(this.ControllerContext.RouteData), e); }

                return Ok(html);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [HttpPost]
        public HttpResponseMessage GetFile(long id) //id del Adjunto
        {
            var localFilePath = "";
            var nombre = "download";
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                Adjunto fil = adjuntoRepo.Get(id);
                localFilePath = fil.RutaCompleta;
                nombre = fil.nombre;
            

            UtileriasArchivo util = new UtileriasArchivo();
            return util.GetFile(localFilePath, nombre, Request);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, e.Message + " ("+nombre+")");
            }
        }

        [HttpPost]
        public HttpResponseMessage GetFileCurso(long id) //id del Adjunto
        {
            var localFilePath = "";
            var nombre = "download";
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                AdjuntoCursosRepository _adjunto;
                _adjunto = new AdjuntoCursosRepository();
                AdjuntoCursos fil = _adjunto.Get(id);
                localFilePath = fil.RutaCompleta;
                nombre = fil.nombre;
            

            UtileriasArchivo util = new UtileriasArchivo();
            return util.GetFile(localFilePath, nombre, Request);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, e.Message + " (" + nombre + ")");
            }
        }
        [HttpPost]
        public async Task<IHttpActionResult> GetDatosCursos(long id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                  AdjuntoCursosRepository _adjunto;
                _adjunto = new AdjuntoCursosRepository();
                var fil = await _adjunto.GetAsync(id);
                var mime = UtilMime.GetMimeMapping(fil.nombre);
                var obj = new
                {
                    nombre = fil.nombre,
                    mime = mime
                };
                return Ok(obj);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

    }
}
