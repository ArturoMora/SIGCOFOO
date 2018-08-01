using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Repositories.CH;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using log4net;
using INEEL.WebAPI.Utilidades.Data;
using System.Collections;
using INEEL.DataAccess.GEN.Repositories;

namespace INEEL.WebAPI.Controllers.CH
{
    public class SolicitudController : ApiController
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(SolicitudController));
        BitacoraSolicitudesRepository _bita;
        SolicitudRepository _SolicitudRepository;
        PersonasRepository _PersonasRepository;
        RolPersonaRepository _rolpersonaRepo;

        public SolicitudController()
        {
            _bita = new BitacoraSolicitudesRepository();
            _rolpersonaRepo = new RolPersonaRepository();
            _SolicitudRepository = new SolicitudRepository();
            _PersonasRepository = new PersonasRepository();
        }

        [HttpPost]
        public async Task<IHttpActionResult> GetBySolicitudAttrs([FromBody]Solicitud model)
        {
            try
            {
                var Solicitud = await _SolicitudRepository.GetSolicitudByAttrs(model.EstadoFlujoId, model.TipoInformacionId, model.InformacionId);

                return Ok(Solicitud);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetAllsolicitudesITF()
        {
            try
            {
                var Solicitud = await _SolicitudRepository.getAllsolicitudesITF();
                if (Solicitud != null && Solicitud.Count() > 0)
                {
                    List<String> clavesPersonas = Solicitud.Select(x => x.ClavePersona).ToList();
                    if (clavesPersonas != null && clavesPersonas.Count() > 0)
                    {
                        var personas = await _PersonasRepository.GetAllCollectionWithoutStatus(new HashSet<String>(clavesPersonas));
                        foreach (var soli in Solicitud)
                        {
                            var p = personas.Find(x => x.ClavePersona.Equals(soli.ClavePersona));
                            if (p != null)
                                soli.NombreCompleto = p.NombreCompleto;
                        }
                    }
                }
                return Ok(Solicitud);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        //Obtener todos los registros

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetAll()
        {
            try
            {
                var Solicitud = await _SolicitudRepository.GetAll();
                if (Solicitud != null && Solicitud.Count() > 0)
                {
                    var personasID = Solicitud.Select(x => x.ClavePersona).ToList();
                    var personas = await _PersonasRepository.GetAllCollectionWithoutStatus(personasID);
                    if (personas != null && personas.Count() > 0)
                        foreach (var soli in Solicitud)
                        {
                            var p = personas.Find(x => x.ClavePersona.Equals(soli.ClavePersona));
                            //await _PersonasRepository.GetByClave(soli.ClavePersona);
                            if (p != null)
                                soli.NombreCompleto = p.NombreCompleto;
                        }
                }
                return Ok(Solicitud);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        /// <summary>
        /// Solicitudes pendientes admin CH
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IHttpActionResult> GetPendientesAdministradorCH()
        {
            try
            {
                var Solicitud = await _SolicitudRepository.GetPendientesAdministradorCH();
                if (Solicitud != null && Solicitud.Count() > 0)
                {
                    var personasID = Solicitud.Select(x => x.ClavePersona).ToList();
                    var personas = await _PersonasRepository.GetAllCollectionWithoutStatus(personasID);
                    if (personas != null && personas.Count() > 0)
                        foreach (var soli in Solicitud)
                        {
                            var p = personas.Find(x => x.ClavePersona.Equals(soli.ClavePersona));
                            
                            if (p != null)
                                soli.NombreCompleto = p.NombreCompleto;
                        }
                }
                return Ok(Solicitud);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }


        /// <summary>
        /// Solicitudes pendientes admin sindicalizados
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IHttpActionResult> GetPendientesAdministradorSindicalizados()
        {
            try
            {
                var Solicitud = await _SolicitudRepository.GetPendientesAdministradorSindicalizados();
                if (Solicitud != null && Solicitud.Count() > 0)
                {
                    var personasID = Solicitud.Select(x => x.ClavePersona).ToList();
                    var personas = await _PersonasRepository.GetAllCollectionWithoutStatus(personasID);
                    if (personas != null && personas.Count() > 0)
                        foreach (var soli in Solicitud)
                        {
                            var p = personas.Find(x => x.ClavePersona.Equals(soli.ClavePersona));
                            
                            if (p != null)
                                soli.NombreCompleto = p.NombreCompleto;
                        }
                }
                return Ok(Solicitud);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        /// <summary>
        /// Solicitudes aceptadas por rol
        /// </summary>
        /// <param name="id"> rol del usuario</param>
        /// <param name="clave">clave de la gerencia</param>
        /// <returns>ICollection<></returns>
        [HttpGet]
        public async Task<IHttpActionResult> GetAllAceptadas(int id, string clave)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                //0)AdminCH 1
                //1)Gerente 4
                //2)Admin CP 19
                var claveUnidad = clave;
                List<Solicitud> ListaSol = new List<Solicitud>();
                if (id == 0)  //ADMINISTRADORES
                {
                    if (claveUnidad != null)  //La clave se utiliza para saber que tipo de administrador hizo la solicitud
                    {
                        var resultadosBitacoras = await _bita.GetByRol(1);
                        var Solicitudes = await _SolicitudRepository.getbyId(resultadosBitacoras, claveUnidad);  //Clave de unidad funge como el rol del tipo de administrador
                        ListaSol.AddRange(Solicitudes);
                    }
                    else
                    {
                        var resultadosBitacoras = await _bita.GetByRol(1);
                        var Solicitudes = await _SolicitudRepository.getbyId(resultadosBitacoras);
                        ListaSol.AddRange(Solicitudes);
                    }
                    
                    foreach (var soli in ListaSol)
                    {
                        var p = await _PersonasRepository.GetByClave(soli.ClavePersona);
                        soli.NombreCompleto = p.NombreCompleto;
                    }

                }
                if (id == 1) //GERENTES
                {
                    var resultadosBitacoras = await _bita.GetByRolGerente(4);
                    var Solicitudes = await _SolicitudRepository.getbyIdUnidad(resultadosBitacoras, claveUnidad);
                    ListaSol.AddRange(Solicitudes);
                    
                    foreach (var soli in ListaSol)
                    {
                        var p = await _PersonasRepository.GetByClave(soli.ClavePersona);
                        soli.NombreCompleto = p.NombreCompleto;
                    }
                }
                if (id == 2) ////ADMINISTRADOR CENTRO POSGRADO
                {
                    var resultadosBitacoras = await _bita.GetByRol(19);
                    var Solicitudes = await _SolicitudRepository.getbyId(resultadosBitacoras);
                    ListaSol.AddRange(Solicitudes);

                    foreach (var soli in ListaSol)
                    {
                        var p = await _PersonasRepository.GetByClave(soli.ClavePersona);
                        soli.NombreCompleto = p.NombreCompleto;
                    }
                }

                return Ok(ListaSol);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        /// <summary>
        /// Solicitudes rechazadas por rol
        /// </summary>
        /// <param name="id"></param>
        /// <param name="clave"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IHttpActionResult> GetAllRechazadas(int id, string clave)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                //0)AdminCH 1
                //1)Gerente 4
                //2)Admin CP 19
                var claveUnidad = clave;
                List<Solicitud> ListaSol = new List<Solicitud>();
                if (id == 0)  //ADMINISTRADORES
                {
                    if (clave != null)
                    {
                        var resultadosBitacoras = await _bita.GetByRolRechazadas(1);
                        var Solicitudes = await _SolicitudRepository.getbyId(resultadosBitacoras, clave, 3);
                        ListaSol.AddRange(Solicitudes);
                    }
                    else
                    {
                        var resultadosBitacoras = await _bita.GetByRolRechazadas(1);
                        var Solicitudes = await _SolicitudRepository.getbyId(resultadosBitacoras);
                        ListaSol.AddRange(Solicitudes);
                    }
                    

                    foreach (var soli in ListaSol)
                    {
                        var p = await _PersonasRepository.GetByClave(soli.ClavePersona);
                        soli.NombreCompleto = p.NombreCompleto;
                    }
                }
                if (id == 1) //GERENTES
                {
                    var resultadosBitacoras = await _bita.GetByRolRechazadasGerente(4);
                    var Solicitudes = await _SolicitudRepository.getRechazadasbyIdUnidad(resultadosBitacoras, claveUnidad);
                    ListaSol.AddRange(Solicitudes);

                    foreach (var soli in Solicitudes)
                    {
                        var p = await _PersonasRepository.GetByClave(soli.ClavePersona);
                        soli.NombreCompleto = p.NombreCompleto;
                    }
                }
                if (id == 2) ////ADMINISTRADOR CENTRO POSGRADO
                {
                    var resultadosBitacoras = await _bita.GetByRolRechazadas(19);
                    var Solicitudes = await _SolicitudRepository.getbyId(resultadosBitacoras, 3); //3 es el estado flujo por el que queremos filtrar, en este caso no queremos las del flujo 3
                    
                    ListaSol.AddRange(Solicitudes);

                    foreach (var soli in ListaSol)
                    {
                        var p = await _PersonasRepository.GetByClave(soli.ClavePersona);
                        soli.NombreCompleto = p.NombreCompleto;
                    }
                }


                return Ok(ListaSol);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        /// <summary>
        /// Total de solicitudes por rol
        /// </summary>
        /// <param name="id"></param>
        /// <param name="clave"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IHttpActionResult> GetAllTodas(int id, string clave)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                //0)AdminCH 1
                //1)Gerente 4
                //2)Admin CP 19
                var claveUnidad = clave;
                List<Solicitud> ListaSol = new List<Solicitud>();
                if (id == 0)  //ADMINISTRADORES
                {
                    /**PENDIENTES**/
                    //Dependiendo del rol del administrador seran las solicitudes pendientes a cargar
                    if (claveUnidad != null)
                    {
                        if (claveUnidad == "1")  //Admin CH
                        {
                            var registros = await _SolicitudRepository.GetPendientesAdministradorCH();
                            ListaSol.AddRange(registros);
                        }
                        if (claveUnidad == "1026") //Admin sindicalizado
                        {
                            var registros = await _SolicitudRepository.GetPendientesAdministradorSindicalizados();
                            ListaSol.AddRange(registros);
                        }
                    }
                    else //Caso default, para no afectar el funcionamiento de este metodo, ya que como lleva bastante tiempo es dificil ver que otros metodos hacen referencia a el
                    {
                        var registros = await _SolicitudRepository.GetAll();
                        ListaSol.AddRange(registros);
                    }
                    
                    /**ACEPTADAS**/
                    var resultadosBitacorasAcpetadas = await _bita.GetByRol(1);
                    var SolicitudesAceptadas = await _SolicitudRepository.getbyId(resultadosBitacorasAcpetadas ,clave);
                    ListaSol.AddRange(SolicitudesAceptadas);

                    /**RECHAZADAS**/
                    var resultadosBitacoras = await _bita.GetByRolRechazadas(1);
                    var Solicitudes = await _SolicitudRepository.getbyId(resultadosBitacoras, clave, 3);
                    
                    ListaSol.AddRange(Solicitudes);

                    foreach (var soli in ListaSol)
                    {
                        var p = await _PersonasRepository.GetByClave(soli.ClavePersona);
                        soli.NombreCompleto = p.NombreCompleto;
                    }
                }
                if (id == 1)  //GERENTES
                {
                    /**PENDIENTES*/
                    var SolicitudPen = await _SolicitudRepository.GetAllGerenteByClave(claveUnidad);
                    ListaSol.AddRange(SolicitudPen);
                    
                    /**ACEPTADAS*/
                    var resultadosBitacorasAceptadas = await _bita.GetByRolGerente(4);
                    var SolicitudesAceptadasGerente = await _SolicitudRepository.getbyIdUnidad(resultadosBitacorasAceptadas, claveUnidad);
                    ListaSol.AddRange(SolicitudesAceptadasGerente);

                    /**RECHAZADAS*/
                    var resultadosBitacoras = await _bita.GetByRolRechazadasGerente(4);
                    var Solicitudes = await _SolicitudRepository.getRechazadasbyIdUnidad(resultadosBitacoras, claveUnidad);
                    ListaSol.AddRange(Solicitudes);
                    //var ValidarEstado = await _SolicitudRepository.validarEstadoRechazadas(Solicitudes);
                    
                    foreach (var soli in ListaSol)
                    {
                        var p = await _PersonasRepository.GetByClave(soli.ClavePersona);
                        soli.NombreCompleto = p.NombreCompleto;
                    }
                }
                if (id == 2)  //ADMIN CENTRO POSGRADO
                {
                    /**PENDIENTES*/
                    var SolicitudPen = await _SolicitudRepository.GetAllCursosCP();
                    ListaSol.AddRange(SolicitudPen);

                    /**ACEPTADAS*/
                    var resultadosBitacorasAcep = await _bita.GetByRol(19);
                    var SolicitudesAcept = await _SolicitudRepository.getbyId(resultadosBitacorasAcep);
                    ListaSol.AddRange(SolicitudesAcept);

                    /**RECHAZADAS*/
                    var resultadosBitacoras = await _bita.GetByRolRechazadas(19);
                    var Solicitudes = await _SolicitudRepository.getbyId(resultadosBitacoras, 3);
                    
                    ListaSol.AddRange(Solicitudes);

                    foreach (var soli in ListaSol)
                    {
                        var p = await _PersonasRepository.GetByClave(soli.ClavePersona);
                        soli.NombreCompleto = p.NombreCompleto;
                    }
                }


                return Ok(ListaSol);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetAllCursosCP()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var Solicitud = await _SolicitudRepository.GetAllCursosCP();

                foreach (var soli in Solicitud)
                {
                    var p = await _PersonasRepository.GetByClave(soli.ClavePersona);
                    soli.NombreCompleto = p.NombreCompleto;
                }
                return Ok(Solicitud);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetAllGerente()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var Solicitud = await _SolicitudRepository.GetAllGerente();

                foreach (var soli in Solicitud)
                {
                    var p = await _PersonasRepository.GetByClave(soli.ClavePersona);
                    soli.NombreCompleto = p.NombreCompleto;
                }
                return Ok(Solicitud);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        //Solicitudes pendientes por gerente de X unidad
        [HttpGet]
        public async Task<IHttpActionResult> getAllGerentebyClaveunidad(string id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var Solicitud = await _SolicitudRepository.GetAllGerenteByClave(id);

                foreach (var soli in Solicitud)
                {
                    var p = await _PersonasRepository.GetByClave(soli.ClavePersona);
                    soli.NombreCompleto = p.NombreCompleto;
                }
                return Ok(Solicitud);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetGerente()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var SolicitarGerente = await _rolpersonaRepo.GetByRolForsolicitud(1);
                var claveUnidad = await _PersonasRepository.GetByClave(SolicitarGerente.ClavePersona);
                var result = await _PersonasRepository.GetResponsableByClaveUnidadWithoutStatus(claveUnidad.ClaveUnidad);
                return Ok(result.ClavePersona);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetGerenteByClaveUnidad(string id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                //var SolicitarGerente = await _rolpersonaRepo.GetByRolForsolicitud(1);
                //var claveUnidad = await _PersonasRepository.GetByClave(id2);
                var result = await _PersonasRepository.GetResponsableByClaveUnidadWithoutStatus(id);
                return Ok(result.ClavePersona);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }


        //Update Country
        [Authorize]
        [HttpPut]
        public async Task<IHttpActionResult> UpdateEstado(Solicitud Solicitud)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _SolicitudRepository.UpdateEstado(Solicitud);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<IHttpActionResult> Create(Solicitud Solicitud)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                //Verificar que no exista
                var existe = await _SolicitudRepository.existe(Solicitud.TipoInformacionId, Solicitud.InformacionId);
                ////////////
                if (existe != null)
                {
                    existe.titulo = Solicitud.titulo;
                    existe.EstadoFlujoId = Solicitud.EstadoFlujoId;
                    var result = await _SolicitudRepository.UpdateEstadoActualizacion(existe);
                    return Ok(result.SolicitudId);
                }
                else
                {
                    var result = await _SolicitudRepository.Create(Solicitud);
                    return Ok(result.SolicitudId);
                }

            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }


        [HttpPost]
        public async Task<IHttpActionResult> UpdateCreate(Solicitud Solicitud)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var result = await _SolicitudRepository.UpdateCreate(Solicitud);
                return Ok("Registrado correctamente, " + result.SolicitudId);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> ValidarRechazoAdminPublicacion(string id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                int res = 0;

                var solicitudResult = await _SolicitudRepository.getpublicacion(id);
                if (solicitudResult != null)
                {
                    var bitacorasolicitud = await _bita.validarRechazoAdmin(solicitudResult);
                    return Ok(bitacorasolicitud);
                }
                return Ok(res);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> ValidarRechazoAdminPonencia(string id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                int res = 0;

                var solicitudResult = await _SolicitudRepository.getponencia(id);
                if (solicitudResult != null)
                {
                    var bitacorasolicitud = await _bita.validarRechazoAdmin(solicitudResult);
                    return Ok(bitacorasolicitud);
                }
                return Ok(res);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> ValidarRechazoAdminCapitulo(string id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                int res = 0;

                var solicitudResult = await _SolicitudRepository.getcapitulo(id);
                if (solicitudResult != null)
                {
                    var bitacorasolicitud = await _bita.validarRechazoAdmin(solicitudResult);
                    return Ok(bitacorasolicitud);
                }
                return Ok(res);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [HttpPost]
        public async Task<IHttpActionResult> GetPermiso(Solicitud Solicitud)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var entity = await _SolicitudRepository.GetPermiso(Solicitud);
                return Ok(entity);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetById(int id)
        {
            try
            {
                var entity = await _SolicitudRepository.GetById(id);
                return Ok(entity);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

    }
}
