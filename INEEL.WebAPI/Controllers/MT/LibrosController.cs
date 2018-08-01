/*using IIE.DataAccess;
using IIE.DataAccess.Repositories;*/
using INEEL.DataAccess.GEN.Models.MT;
using INEEL.DataAccess.GEN.Repositories.MT;
using INEEL.DataAccess.GEN.Util;
using INEEL.WebAPI.Utilidades;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using System.Web.Script.Serialization;

namespace INEEL.WebAPI.Controllers.MT
{
    public class LibrosController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(LibrosController));
        // AYUDA:
        //LibrosController.- Nombre de clase y tipicament constructor
        //LibrosRepository.- La implementación CRUD del Modelo:Libros con el patrón de diseño Repository
        //_entityRepo.-      varible de tipo LibrosRepository
        // entities.-        resultado de tipo Task<IEnumerable<Libros>>
        // entity.-         resultado de tipo Task<Libros>
        // Libros.-         Modelo
        private LibrosRepository _entityRepo;
        //private ProductsRepositories _productRepo;
        public LibrosController()
        {
            _entityRepo = new LibrosRepository();
            // _productRepo = new ProductsRepositories();
        }
        
        [HttpGet]
        public async Task<IHttpActionResult> GetAllFull()
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var entities = await _entityRepo.GetAllFull();
                return Ok(entities);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
       [HttpGet] public async Task<IHttpActionResult> GetAll(){try { 
                var entities = await _entityRepo.GetAll();
                /*var products = await _productRepo.GetAll();
                var obj = new {message= "resultado OK", employees = entities, products = products};
                //return Ok(obj);*/
                return Ok(entities);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> Get(string Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var entity = await _entityRepo.Get(Id);
                return Ok(entity);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [HttpPost]
        public async Task<IHttpActionResult> getUrl([FromBody]Body model)
        {

            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                string html = string.Empty;
                html = await getExternalResource(model.Cadena);
                List<Libros>  libs = new List<Libros>();
                try { log.Info(new MDCSet(this.ControllerContext.RouteData));

                   html= GetTextFromHtml(html);
                    if (html.IndexOf("</head><body>")>0)
                    {
                        var lines = Regex.Split(html, "</head><body>");
                        lines = Regex.Split(lines[1], "</body><");
                        html = lines[0];
                    }

                    libs = new JavaScriptSerializer().Deserialize<List<Libros>>(html);

                }
                catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e); }
                
                return Ok(libs);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
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

        [HttpPost]
        public async Task<IHttpActionResult> pruebas([FromBody]Libros model)
        {

            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _entityRepo.Get(model.LibrosId);
                return Ok("Registro creado exitosamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> Create([FromBody]Libros model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _entityRepo.Create(model);
                return Ok("Registro creado exitosamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update([FromBody]Libros model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _entityRepo.Update(model);
                return Ok("Registro actualizado exitosamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(string Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _entityRepo.Delete(Id);
                return Ok("Registro eliminado exitosamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }


    }
}
