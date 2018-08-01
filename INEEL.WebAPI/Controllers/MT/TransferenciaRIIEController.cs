using System.Data;
using INEEL.DataAccess.MT.Models;
using System;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using System.Data.SqlClient;
using System.Web.Script.Serialization;
using System.Collections.Generic;
using INEEL.DataAccess.GEN.Util.ModelOld;
using Newtonsoft.Json;
using INEEL.DataAccess.GEN.Repositories.MT;
using INEEL.DataAccess.MT.Models.ITF;
using INEEL.DataAccess.GEN.Repositories;
using System.Linq;
using INEEL.DataAccess.GEN.Models.MT.ITF;
using INEEL.DataAccess.GEN.Repositories.MT.ITF;
using System.IO;
using INEEL.DataAccess.GEN.Util;
using System.Configuration;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.WebAPI.Controllers.MT
{
    public class TransferenciaRIIEController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(TransferenciaRIIEController));
        static string connectionString = null;
        public TransferenciaRIIEController()
        {
            connectionString = System.Configuration.ConfigurationManager.ConnectionStrings["SIGCOEntities"].ConnectionString;
        }
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetAllOCsSIGCO2()
        {
            var max = 0;
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                //SIGCOEntities.
                //SIGCOEntities sigco = new SIGCOEntities(System.Configuration.ConfigurationManager.ConnectionStrings["SIGCOEntities"].ConnectionString);
                var queryString = "select *  FROM [SIGCO].[MT].[tOC]";
                var entities = await Task.Run(() => { return CreateCommandSIGCO2(queryString); });
                string JSONresult;
                JSONresult = JsonConvert.SerializeObject(entities);
                JavaScriptSerializer jss = new JavaScriptSerializer();
                jss.MaxJsonLength = 5000000;
                                    

                //2097152
                //3259099
                var itfv2 = jss.Deserialize<List<ItfV2>>(JSONresult);
                InformeTecnicoFinal itf = new InformeTecnicoFinal();
                List<InformeTecnicoFinal> lista = new List<InformeTecnicoFinal>();
                DateTime actual = DateTime.Now;
                DateTime actualMinus12 = actual.AddYears(-12);
                ITFgeneral gral = null;
                ProyectoRepository repProy = new ProyectoRepository();
                var proyectos = await repProy.GetAllNumerosProyectoTRIM();
                var proyectosv2 = itfv2.Select(x => x.numProyecto).ToList<String>();

                var dif = proyectosv2.Except(proyectos);

                string print = string.Join("','", proyectos.ToArray());
                TransferenciaRIIEController ctrl = new TransferenciaRIIEController();
                ctrl.Configuration = new HttpConfiguration();
                var itfv2ByProyectos = itfv2.FindAll(e => proyectos.Contains(e.numProyecto.Trim()));
                foreach (var i2 in itfv2ByProyectos)
                {
                    //if (!String.IsNullOrEmpty(i2.numProyecto))
                    //{
                    //    if (i2.numProyecto.Contains("14342"))
                    //    {
                    //        var xyz = 22;
                    //    }
                    //}

                    if (i2.estadoOC != 1 || String.IsNullOrEmpty(i2.numProyecto) || String.IsNullOrEmpty(i2.resumen))
                    {
                        continue;
                    }


                    gral = new ITFgeneral();
                    itf = new InformeTecnicoFinal();
                    try { 
                    itf.InformeTecnicoFinalId = String.Concat(i2.id, "-", i2.numProyecto.Trim(), "-", i2.idInforme).Trim();
                    itf.ClasificacionSignatura = i2.clasificacion.Trim();
                    itf.Titulo = i2.tituloOC.Trim();
                    itf.EstadoITFFlujoId = 4;
                    itf.ProyectoId = i2.numProyecto.Trim();

                    itf.idSigco2 = i2.id;
                    itf.idInformeRIIE = i2.idInforme;
                    itf.ultraConfidencial = i2.ultraConfidencial;
                    itf.FechaAutorizacion = i2.fechaRecepcion;
                    itf.FechaPublicacion = i2.fechaCaptura;
                    itf.ClaveUnidadOrganizacional = i2.idGerencia.Trim();
                    itf.ClaveUnidadPadre = i2.idDivision.Trim();

                    if (itf.FechaPublicacion != null)
                    {
                        try { 
                            itf.AnioElaboracion = itf.FechaPublicacion.Value.Year;
                        }
                        catch (Exception exY) { }
                    }
                    itf.NumInforme = i2.numInforme.Trim();

                    gral.ITFgeneralId = itf.InformeTecnicoFinalId;
                    gral.Resumen = i2.resumen.Trim();
                    gral.AccesoTipo = 2;
                    if (i2.fechaCaptura != null)
                    {
                        if (i2.fechaCaptura < actualMinus12)
                        {
                            gral.AccesoTipo = 1;
                        }
                    }

                    itf.ITFgeneral = gral;
                    }catch (Exception e) { log.Warn(new MDCSet(this.ControllerContext.RouteData)+"<for>", e); }
                    ctrl.Validate(itf);
                    if (ctrl.ModelState.IsValid)
                    {
                        lista.Add(itf);
                    }
                    else
                    {

                        log.Warn(new MDCSet(this.ControllerContext.RouteData), new Exception("!ModelState.IsValid"));
                        ctrl = new TransferenciaRIIEController();
                        ctrl.Configuration = new HttpConfiguration();
                        var foo = "";
                    }


                }
                //lista.Add(itf);
                InformeTFRepository repo = new InformeTFRepository();
                var fullsave = await repo.CreateAll(lista);
                var obj = new
                {
                    proyectosv2 = proyectosv2,
                    proyectos = proyectos,
                    dif = dif,
                    fullsave = fullsave
                };
                return Ok(obj);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                e.Source = max + "";
                return InternalServerError(e);
            }
        }
        private static DataTable CreateCommandSIGCO2(String queryString)
        {

            using (SqlConnection connection = new SqlConnection(
                       connectionString))
            {
                try { 
                    SqlCommand command = new SqlCommand();
                    command.Connection = connection;
                    command.CommandTimeout = 40;
                    command.CommandType = CommandType.Text;
                    command.CommandText = queryString;

                    connection.Open();
                    SqlDataReader reader = command.ExecuteReader();
                    DataTable dt = new DataTable();
                    dt.Load(reader);
                    return dt;
                }
                catch (Exception e) {
                    //TODO: pendiente colocar el log
                    var ms = e.Message;
                }
            }
            return null;
        }
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> SetAutores()
        { //id is FUENTE de proyecto: 'RIIE ACH'
            var max = 0;
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                //SIGCOEntities.
                //SIGCOEntities sigco = new SIGCOEntities(System.Configuration.ConfigurationManager.ConnectionStrings["SIGCOEntities"].ConnectionString);
                var queryString = "select *  FROM [SIGCO].[MT].[tAutorOC]";
                var entities = await Task.Run(() => { return CreateCommandSIGCO2(queryString); });
                string JSONresult;
                JSONresult = JsonConvert.SerializeObject(entities);
                JavaScriptSerializer jss = new JavaScriptSerializer();
                var autores = jss.Deserialize<List<TAutorOC>>(JSONresult);
                TAutorOC autor = new TAutorOC();
                InformeTFRepository itfR = new InformeTFRepository();
                var itfIds = await itfR.getAllBySinFKs();
                var a = new AutorITF();
                AutorITFRepository autR = new AutorITFRepository();

                foreach (var i in itfIds)
                {

                    int ids2 = i.idSigco2 == null ? 0 : i.idSigco2.Value;
                    var x = autores.Where(y => y.idOC == ids2.ToString()).ToList();
                    if (x != null)
                    {
                        foreach (var e in x)
                        {
                            a = new AutorITF();
                            if (e.idOC.Contains("3011"))
                            {
                                var foo = "";
                            }
                            a.AutorITFId = String.Concat(e.idOC.Trim(), "-" + e.numEmp.Trim()).Trim();
                            a.InformeTecnicoFinalId = i.InformeTecnicoFinalId.Trim();
                            a.Estado = true;
                            a.ClaveAutor = e.numEmp.Trim();
                            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                                await autR.Create(a);
                            }
                            catch (Exception ex)
                            {
                                autR = new AutorITFRepository();
                            }
                        }
                    }

                }

                return Ok("ok");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                e.Source = max + "";
                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> getFiles()
        { //id is FUENTE de proyecto: 'RIIE ACH'
            var top = 5;
            var max = 0;
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                //SIGCOEntities.
                //SIGCOEntities sigco = new SIGCOEntities(System.Configuration.ConfigurationManager.ConnectionStrings["SIGCOEntities"].ConnectionString);
                var sPath = ConfigurationManager.AppSettings["pathAdjunto"] + "ITFv2/";
                var stop = ConfigurationManager.AppSettings["top"];
                top = Convert.ToInt32(stop);
                try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                    if (!Directory.Exists(sPath))
                    {
                        Directory.CreateDirectory(sPath);
                    }
                }
                catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                    throw new Exception("No es posible CreateDirectory en el servidor", e);
                }
                InformeTFRepository itfR = new InformeTFRepository();
                var itfs = await itfR.getAllBySinFKs();
                JavaScriptSerializer jss = new JavaScriptSerializer();
                var queryString = "select [id],[numProyecto],[descriptores],[tituloOC],[numInforme],[fechaEdicion],[idTipoFormato],[distribucion],[tipoColeccion],[clasificacion],[capturista],[supervisor],[notas],[numAdquisicion],[volumen],[ejemplar],[fechaRecepcion],[fechaCaptura],[archivo],[proceso],[idTipoOC],[tipoArchivo],[nombreArchivo],[idGerencia],[idDivision],[idInforme],[estadoOC] ,[ultraConfidencial]  FROM [SIGCO].[MT].[tOC] order by id"; /* todo menos resumen*/
                var OCv2 = await Task.Run(() => { return CreateCommandSIGCO2(queryString); });
                var JSONresult = JsonConvert.SerializeObject(OCv2);
                var itfv2 = jss.Deserialize<List<ItfV2>>(JSONresult);
                int n = 0;
                List<AdjuntoITF> AdjuntoITFs = new List<AdjuntoITF>();
                AdjuntoITF AdjuntoITF = new AdjuntoITF();
                Adjunto ad = new Adjunto();
                List<String> itfSinArchivoSegunConsulta = new List<string>();
                foreach (var itf in itfs)
                {
                    n++;
                    if (itf.idSigco2 != null)
                    {
                        var idSigco2 = itf.idSigco2.Value;
                        var itfDEv2 = itfv2.Find(x => x.id == idSigco2);

                        if (itfDEv2 != null)
                        {
                            queryString = "select * FROM[SIGCO].[MT].[tOCArchivo] where id=" + idSigco2;
                            var entities = await Task.Run(() => { return CreateCommandSIGCO2(queryString); });
                            if (entities != null)
                                foreach (DataRow row in entities.Rows)
                                {
                                    foreach (DataColumn col in entities.Columns)
                                    {
                                        //Console.WriteLine(row[col]);
                                        col.AllowDBNull = col.AllowDBNull;
                                        col.Caption = col.Caption;
                                        if (col.Caption.Equals("archivo") && !String.IsNullOrEmpty(itfDEv2.nombreArchivo))
                                        {
                                            var continuar = true;
                                            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                                                //Escribe.Write(row[col].GetType());
                                                File.WriteAllBytes(sPath + itfDEv2.nombreArchivo, (byte[])row[col]);
                                            }
                                            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                                                continuar = false;
                                                itfSinArchivoSegunConsulta.Add(itf.InformeTecnicoFinalId + "@@" + e.Message);
                                            }
                                            if (continuar)
                                            {
                                                AdjuntoITF = new AdjuntoITF();
                                                AdjuntoITF.ITFgeneralId = itf.InformeTecnicoFinalId;
                                                AdjuntoITF.Procesado = false;
                                                ad = new Adjunto();
                                                ad.ModuloId = "MT";
                                                ad.nombre = itfDEv2.nombreArchivo;
                                                ad.RutaCompleta = sPath + itfDEv2.nombreArchivo;

                                                AdjuntoITF.Adjunto = ad;
                                                AdjuntoITFs.Add(AdjuntoITF);
                                            }
                                            break;
                                        }
                                        else
                                        {
                                            if (col.Caption.Equals("archivo") && String.IsNullOrEmpty(itfDEv2.nombreArchivo))
                                            {
                                                itfSinArchivoSegunConsulta.Add(itf.InformeTecnicoFinalId);
                                            }
                                        }
                                        var fooo = "";
                                    }
                                    break;
                                }
                        }
                    }
                    if (n > top)
                    {
                        break;
                    }


                }
                var saveAll = await new AdjuntoITFRepository().CreateAllSeg(AdjuntoITFs);
                var r = new { resumen = "ok " + n + " saveAll:" + saveAll, itfSinArchivoSegunConsulta = itfSinArchivoSegunConsulta };
                return Ok(r);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                e.Source = max + "";
                return InternalServerError(e);
            }
        }


    }
}
