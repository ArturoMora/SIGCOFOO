using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories;
using System.IO;
using INEEL.WebAPI.Utilidades;
using System.Text;
using System.Text.RegularExpressions;
using System.Diagnostics;
using System.Configuration;
using INEEL.DataAccess.GEN.Repositories.MT.ITF;

namespace INEEL.WebAPI.Controllers.GENERICOS
{
    [Authorize]
    public class UtilAdjuntosController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(UtilAdjuntosController));
        AdjuntoRepository adjuntoRepo;
        VocabularioRepository dbVoca;
        private string exts = "";
        public UtilAdjuntosController()
        {
            dbVoca = new VocabularioRepository();
            adjuntoRepo = new AdjuntoRepository();
            exts = ConfigurationManager.AppSettings["extensiones2Text"];// ".pdf;.docx;.doc;.rtf;.pptx;.ppt;.ppsx;.pps;.xlsx;.xls;.pub;.html;.txt";
            
        }
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> adjuntoITFToTextAll()
        {
            AdjuntoITFRepository adj = new AdjuntoITFRepository();
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                Stopwatch tiempo = Stopwatch.StartNew();
                IEnumerable<int> adjuntosITFId = new List<int>();
                var nuevosAdjuntos=await adj.GetAllUnprocesing();
                if (nuevosAdjuntos==null || nuevosAdjuntos.Count()<1)
                {
                    return Ok("sin nuevos adjuntos de ITF por procesar");
                }
                var entities = nuevosAdjuntos.Select(x => x.Adjunto);
                adjuntosITFId = nuevosAdjuntos.Select(x=>x.AdjuntoITFId);
                HashSet<string> tiempos = new HashSet<string>();
                if (entities != null && entities.Count() > 0)
                {
                    var items = exts.Split(';');
                    HashSet<string> extensiones = new HashSet<string>(items);

                    foreach (var adjunto in entities)
                    {
                        try { 
                            Stopwatch tiempo3 = Stopwatch.StartNew();
                            await adjuntoToText(extensiones, adjunto);
                            var lapso3 = tiempo3.Elapsed.Milliseconds.ToString();
                            tiempos.Add(adjunto.nombre + ": " + lapso3);
                        }
                        catch (Exception e) {}
                    }

                }
                var tiempo2 = tiempo.Elapsed.Milliseconds.ToString();
                tiempos.Add(tiempo2);
                await adj.UpdateSetProcesado(adjuntosITFId);

                return Ok(tiempos);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }


        [HttpGet]
        public async Task<IHttpActionResult> adjuntoToTextAll() //id del Adjunto
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                Stopwatch tiempo = Stopwatch.StartNew();
                var entities = await adjuntoRepo.GetAll();
                HashSet<string> tiempos = new HashSet<string>();
                if (entities!=null && entities.Count() > 0)
                {
                    var items = exts.Split(';');
                    HashSet<string> extensiones = new HashSet<string>(items);
                    
                    foreach (var adjunto in entities)
                    {
                        try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                            Stopwatch tiempo3 = Stopwatch.StartNew();
                            await adjuntoToText(extensiones, adjunto);
                            var lapso3 = tiempo3.Elapsed.Milliseconds.ToString();
                            tiempos.Add(adjunto.nombre+": "+ lapso3);
                        }
                        catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e); }
                    }

                }
                var tiempo2 = tiempo.Elapsed.Milliseconds.ToString();
                tiempos.Add(tiempo2);
                return Ok(tiempos);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetFile(long id) //id del Adjunto
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                
                var items = exts.Split(';');
                HashSet <string> extensiones= new HashSet<string>(items);
                var result =await  adjuntoToText(extensiones,id);
                return Ok(result);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        
        public async Task<HashSet<string>>  adjuntoToText(HashSet<string> exts,long id) //id del Adjunto
        {
            StringBuilder result = null;
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var extension = "";
                Adjunto fil = await adjuntoRepo.GetAsync(id);
                var localFilePath = fil.RutaCompleta;
                
                
                
                HashSet<string> hash = null;
                if (!File.Exists(localFilePath))
                {
                    return null;
                }
                else
                {
                    extension = Path.GetExtension(localFilePath);
                    if (!exts.Contains(extension)){
                        throw new Exception("documento no soportado, se esperaba alguna de las siguientes extensiones: "+ string.Join(",", exts.ToArray()));
                    }

                }
                //extension = Path.GetExtension(localFilePath);
                ToPlainText toText = new ToPlainText();
                try { log.Info(new MDCSet(this.ControllerContext.RouteData)); 
                    result = toText.GetText(localFilePath, extension);
                    result = Texts.DeleteSpecialCharacteres(result);
                    string[] items = Regex.Split(result.ToString(), @"\s+");
                    hash = new HashSet<string>(items);
                    hash = Texts.getDiferencia(hash, Texts.getStopWords());
                    await this.setVocabulario(hash, dbVoca, fil);//guardar nuevo vocabulario en la BD
                }
                catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                    return null;
                }
                return hash;
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message);
            }
            
            //UtileriasArchivo util = new UtileriasArchivo();
            
        }
        public async Task<HashSet<string>> adjuntoToText(HashSet<string> exts, Adjunto adjunto) //id del Adjunto
        {
            StringBuilder result = null;
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var extension = "";
                Adjunto fil = adjunto;// await adjuntoRepo.GetAsync(id);
                var localFilePath = fil.RutaCompleta;



                HashSet<string> hash = null;
                if (!File.Exists(localFilePath))
                {
                    return null;
                }
                else
                {
                    extension = Path.GetExtension(localFilePath);
                    if (!exts.Contains(extension))
                    {
                        throw new Exception("documento no soportado, se esperaba alguna de las siguientes extensiones: " + string.Join(",", exts.ToArray()));
                    }

                }
                extension = Path.GetExtension(localFilePath);
                ToPlainText toText = new ToPlainText();
                try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                    result = toText.GetText(localFilePath, extension);
                    result = Texts.DeleteSpecialCharacteres(result);
                    string[] items = Regex.Split(result.ToString(), @"\s+");
                    hash = new HashSet<string>(items);
                    hash = Texts.getDiferencia(hash, Texts.getStopWords());
                    await this.setVocabulario(hash, dbVoca, adjunto);//guardar nuevo vocabulario en la BD
                }
                catch (Exception e) { 
                    return null;
                }
                return hash;
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message);
            }

            //UtileriasArchivo util = new UtileriasArchivo();

        }
        private async Task setVocabulario(HashSet<string> lista, VocabularioRepository dao, Adjunto adjunto)
        {
            
            var inBD= await dao.GetVocabularioIdByCollection(lista);
            var nuevos=lista.Except(inBD);
            log.Info(new MDCSet(this.ControllerContext.RouteData));
            foreach (string item in nuevos)
            {
                try { 

                    //var word = await dao.GetIdAsync(item);
                    //if (word == null)
                    //{
                    try
                    {

                   
                        await dao.Create(new Vocabulario(item));
                    }
                    catch (Exception)
                    {

                        //sin error
                    }
                    // }

                    //var vd = await dao.GetVocabulariroDocumento(item, adjunto.AdjuntoId);
                    //if (vd == null)
                    //{
                    await dao.CreateVocabularioDocumento(new VocabularioDocumento(item, adjunto.AdjuntoId));
                    //}
                    
                    
                }
                catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                    dao = new VocabularioRepository();
                }
            }
            //dao.commitCmd();
        }

    }
}
