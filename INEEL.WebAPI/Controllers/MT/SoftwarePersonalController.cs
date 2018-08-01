using INEEL.DataAccess.MT.Models;
using INEEL.DataAccess.GEN.Repositories.MT;
using System;
using System.Threading.Tasks;
using System.Web.Http;
using log4net;
using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Repositories;
using INEEL.DataAccess.GEN.Models.GEN;
using System.Diagnostics;
using INEEL.DataAccess.GEN.Models;

namespace INEEL.WebAPI.Controllers.MT
{
    public class SoftwarePersonalController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(SoftwarePersonalController));

        //EntityController1.- Nombre de clase y tipicament constructor
        //SoftwarePersonalRepository.- La implementación CRUD del Modelo:Entity con el patrón de diseño Repository
        //_entityRepo.-      varible de tipo SoftwarePersonalRepository
        // entities.-        resultado de tipo Task<IEnumerable<Entity>>
        // entity.-         resultado de tipo Task<Entity>
        // SoftwarePersonal.-         Modelo
        private SoftwarePersonalRepository _repositoryMt;
        
        ProyectoRepository _proyectosRepo;
        public SoftwarePersonalController()
        {
            _proyectosRepo = new ProyectoRepository();
            _repositoryMt = new SoftwarePersonalRepository();
        }
        [AllowAnonymous]
        [HttpGet]	public async Task<IHttpActionResult> countByStatus(int id){	try {
                var cant = await _repositoryMt.countByStatus(id);//id is estadoFlujo
                return Ok(cant);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }                 

        [HttpPost] public async Task<IHttpActionResult> getData([FromBody]DataServerSide ss){try {
                var entities = await _repositoryMt.getData(ss);

                var result = new
                {
                    draw = ss.draw,
                    recordsFiltered = ss.recordsFiltered,
                    recordsTotal = ss.recordsTotal,
                    data = entities
                };

                return Ok(result);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetProyecto(String id)
        {
            //ANY proyect
            #region
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                if (String.IsNullOrEmpty(id))
                {
                    throw new Exception("Numero de proyecto Nulo o vacio");
                }

                var campos = await _proyectosRepo.GetById(id);
                return Ok(campos);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
            #endregion
        }

       [HttpGet] public async Task<IHttpActionResult> GetAll(){try { 
                var entities = await _repositoryMt.GetAll();
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
        public async Task<IHttpActionResult> GetAllByUsurio(String id) //Autores
        {
            try
            {
                var entities = await _repositoryMt.GetAllByUsurio(id);
                return Ok(entities);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        

        [HttpGet]
        public async Task<IHttpActionResult> GetAllByStado(Boolean id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var entities = await _repositoryMt.GetAllByStado(id);
                return Ok(entities);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetByIdDetails(long Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                              
                var entity = await _repositoryMt.GetByIdDetails(Id);
                
                return Ok(entity);
            }
            catch (Exception e) {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e); // ex||error||e||etc|| new Exception("Custom description Error")
                return InternalServerError(e);
            }
        }
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetByIdDetails1(long Id)
        {
            Stopwatch stopWatch = new Stopwatch();
            stopWatch.Start();
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));

                var entity = await _repositoryMt.GetByIdDetails(Id);
                stopWatch.Stop();
                // Get the elapsed time as a TimeSpan value.
                TimeSpan ts = stopWatch.Elapsed;

                // Format and display the TimeSpan value.
                string elapsedTime = String.Format("{0:00}:{1:00}:{2:00}.{3:00}",
                    ts.Hours, ts.Minutes, ts.Seconds,
                    ts.Milliseconds);
                return Ok(elapsedTime);
                //return Ok(entity);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e); // ex||error||e||etc|| new Exception("Custom description Error")
                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetByIdDetails2(long Id)
        {
            Stopwatch stopWatch = new Stopwatch();
            stopWatch.Start();
            try
            {
                //log.Info(new MDCSet(this.ControllerContext.RouteData));

                var entity = await _repositoryMt.GetByIdDetails(Id);
                stopWatch.Stop();
                // Get the elapsed time as a TimeSpan value.
                TimeSpan ts = stopWatch.Elapsed;

                // Format and display the TimeSpan value.
                string elapsedTime = String.Format("{0:00}:{1:00}:{2:00}.{3:00}",
                    ts.Hours, ts.Minutes, ts.Seconds,
                    ts.Milliseconds);
                return Ok(elapsedTime);
                //return Ok(entity);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e); // ex||error||e||etc|| new Exception("Custom description Error")
                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetByIdDetails3(long Id)
        {
            Stopwatch stopWatch = new Stopwatch();
            stopWatch.Start();
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                LogBitacoraRepository logBita = new LogBitacoraRepository();
                LogBitacora newLog = new LogBitacora();
                newLog.Date =  DateTime.Now;
                newLog.Thread = "100"; //se coloca uno fijo de momento
                newLog.Level = "INFO"; //se coloca fijo de momento
                newLog.Logger = "INEEL.WebAPI.Controllers.MT.SoftwarePersonalController";
                newLog.Action = "GET-SoftwarePersonal-GetByIdDetails3TIME";
                newLog.User = "FooUser";
                newLog.Ip = "192.168.0.1"; //nos estamos ahorrando tiempo en obtener la ip real
                await logBita.Create(newLog);
                var entity = await _repositoryMt.GetByIdDetails(Id);

                stopWatch.Stop();
                // Get the elapsed time as a TimeSpan value.
                TimeSpan ts = stopWatch.Elapsed;

                // Format and display the TimeSpan value.
                string elapsedTime = String.Format("{0:00}:{1:00}:{2:00}.{3:00}",
                    ts.Hours, ts.Minutes, ts.Seconds,
                    ts.Milliseconds);
                return Ok(elapsedTime);
                //return Ok(entity);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e); // ex||error||e||etc|| new Exception("Custom description Error")
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetById(long Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var entity = await _repositoryMt.GetById(Id);
                return Ok(entity);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        
        [HttpPost]
        public async Task<IHttpActionResult> DeleteAutor(long id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                await _repositoryMt.DeleteAutor(id);
                return Ok("Autor eliminado exitosamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> Create([FromBody]SoftwarePersonal model)
        {
            if (model != null)
            {
                //model.ManualTecnico.Replace("\"", "");
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _repositoryMt.Create(model);
                return Ok("Registro creado exitosamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update([FromBody]SoftwarePersonal model)
        {
            //if (!ModelState.IsValid)
            //{
            //    return BadRequest(ModelState);
            //}

            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                model.Proyecto = null;
                await _repositoryMt.Update(model);
                return Ok("Registro actualizado exitosamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(long Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _repositoryMt.Delete(Id);
                return Ok("Registro eliminado exitosamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        //favor de llamar al metodo de DescargaController ********************************
        //[HttpGet]
        //public HttpResponseMessage GetFile(int id)
        //{                        
        //    var key = id;
        //    var entity =  _repositoryMt.Get_(key);

        //    //var localFilePath = fetchFile.path + fetchFile.name;
        //    var localFilePath = entity.ManualTecnico;
        //    localFilePath = localFilePath.Replace("\"", "");
        //    UtileriasArchivo util = new UtileriasArchivo();
        //    return util.GetFile(localFilePath, Request);
        //}

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> UpdateEstado(SoftwarePersonal Obj)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _repositoryMt.UpdateEstado(Obj);
                if (Obj.EstadoFlujoId == 3)
                {
                    await new NuevoOCRepository().Create(
                           new NuevoOC("MT",
                                      "SOFTWARE",
                           Obj.Nombre,
                           "IndexMT.html#/SoftwarePersonalDetails/" + Obj.SoftwarePersonalId ,
                           Obj.SoftwarePersonalId + ""
                           ));
                }
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
    }
}