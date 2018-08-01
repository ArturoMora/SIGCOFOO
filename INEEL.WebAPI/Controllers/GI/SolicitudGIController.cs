using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Models.GI;
using INEEL.DataAccess.GEN.Repositories;
using INEEL.DataAccess.GEN.Repositories.GI;
using INEEL.WebAPI.Controllers.GENERICOS;
using INEEL.WebAPI.Utilidades.Data;
using log4net;
using INEEL.DataAccess.GEN.Models.GI.util;

namespace INEEL.WebAPI.Controllers.GI
{
    public class SolicitudGIController : ApiController
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(SolicitudGIController));

        MiembrosGERepository _miembrosRepository;
        SolicitudGIRepository _solicitudGIRepository;
        PersonasRepository _PersonasRepository;
        CorreoController correoController;
        EvaluadorIdeaRepository _evaluadorRepo;

        public SolicitudGIController()
        {
            _solicitudGIRepository = new SolicitudGIRepository();
            _PersonasRepository = new PersonasRepository();
            _miembrosRepository = new MiembrosGERepository();
            correoController = new CorreoController();
            _evaluadorRepo = new EvaluadorIdeaRepository();
        }


        [HttpPost]
        [Authorize]
        public async Task<IHttpActionResult> Create(SolicitudGI Solicitud)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                //Verificar que no exista
                var existe = await _solicitudGIRepository.existe(Solicitud.TipoInformacionId, Solicitud.InformacionId);
                ////////////
                if (existe != null)
                {
                    existe.EstadoFlujoId = Solicitud.EstadoFlujoId;
                    var result = await _solicitudGIRepository.UpdateEstadoActualizacion(existe);
                    return Ok(result.SolicitudId);
                }
                else
                {
                    var result = await _solicitudGIRepository.Create(Solicitud);
                    return Ok(result.SolicitudId);
                }

            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetAllGerente(String id)
        {
            try
            {

                var lista = await _solicitudGIRepository.GetAllGerente(id);
 
                //var Solicitud = await _solicitudGIRepository.getAllPendientesAdministradorGI();
                if (lista != null && lista.Count() > 0)
                {
                    var personasID = lista.Select(x => x.ClavePersona).ToList();
                    var personas = await _PersonasRepository.GetAllCollectionWithoutStatus(personasID);
                    if (personas != null && personas.Count() > 0)
                        foreach (var soli in lista)
                        {
                            var p = personas.Find(x => x.ClavePersona.Equals(soli.ClavePersona));
                            if (p != null)
                                soli.NombreCompleto = p.NombreCompleto;
                        }
                }
                return Ok(lista);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> getAllAceptadasGerenteGI(String id)
        {
            try
            {
                var lista = await _solicitudGIRepository.getAllAceptadasGerenteGI(id);

                if (lista != null && lista.Count() > 0)
                {
                    var personasID = lista.Select(x => x.ClavePersona).ToList();
                    var personas = await _PersonasRepository.GetAllCollectionWithoutStatus(personasID);
                    if (personas != null && personas.Count() > 0)
                        foreach (var soli in lista)
                        {
                            var p = personas.Find(x => x.ClavePersona.Equals(soli.ClavePersona));
                            if (p != null)
                                soli.NombreCompleto = p.NombreCompleto;
                        }
                }
                return Ok(lista);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> getAllRechazadasGerenteGI(String id)
        {
            try
            {
                var lista = await _solicitudGIRepository.getAllRechazadasGerenteGI(id);
                if (lista != null && lista.Count() > 0)
                {
                    var personasID = lista.Select(x => x.ClavePersona).ToList();
                    var personas = await _PersonasRepository.GetAllCollectionWithoutStatus(personasID);
                    if (personas != null && personas.Count() > 0)
                        foreach (var soli in lista)
                        {
                            var p = personas.Find(x => x.ClavePersona.Equals(soli.ClavePersona));
                            if (p != null)
                                soli.NombreCompleto = p.NombreCompleto;
                        }
                }
                return Ok(lista);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        /// <summary>
        /// getAllSolicitudesGerenteGI
        /// </summary>
        /// <param name="id">claveUnidad</param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> getAllSolicitudesGerenteGI(String id)
        {
            try
            {
                var lista = await _solicitudGIRepository.getAllSolicitudesGerenteGI(id);

                if (lista != null && lista.Count() > 0)
                {
                    var personasID = lista.Select(x => x.ClavePersona).ToList();
                    var personas = await _PersonasRepository.GetAllCollectionWithoutStatus(personasID);
                    if (personas != null && personas.Count() > 0)
                        foreach (var soli in lista)
                        {
                            var p = personas.Find(x => x.ClavePersona.Equals(soli.ClavePersona));
                            if (p != null)
                                soli.NombreCompleto = p.NombreCompleto;
                        }
                }
                return Ok(lista);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        
        [HttpGet]
        public async Task<IHttpActionResult> getAllPendientesAdministradorGI()
        {
            try
            {
                List<SolicitudGI> lista = new List<SolicitudGI>();
                    var solpend = await _evaluadorRepo.GetByComentario();
                    List<string> ids = solpend.Select(x => Convert.ToString(x.IdeaInnovadoraId)).ToList();
                    var Solicitud = await _solicitudGIRepository.getAllPendientesAdministradorGI();
                    foreach (var item in Solicitud)
                    {
                        if (ids.Contains(Convert.ToString(item.InformacionId)))
                        {
                            item.AsignadaEval = true;
                        }
                        lista.Add(item);
                    }
                


                //var Solicitud = await _solicitudGIRepository.getAllPendientesAdministradorGI();
                if (lista != null && lista.Count() > 0)
                {
                    var personasID = lista.Select(x => x.ClavePersona).ToList();
                    var personas = await _PersonasRepository.GetAllCollectionWithoutStatus(personasID);
                    if (personas != null && personas.Count() > 0)
                        foreach (var soli in lista)
                        {
                            var p = personas.Find(x => x.ClavePersona.Equals(soli.ClavePersona));
                            if (p != null)
                                soli.NombreCompleto = p.NombreCompleto;
                        }
                }
                return Ok(lista);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> getAllAceptadasAdministradorGI()
        {
            try
            {
                var Solicitud = await _solicitudGIRepository.getAllAceptadasAdministradorGI();
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
        }//

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> getAllRechazadasAdministradorGI()
        {
            try
            {
                var Solicitud = await _solicitudGIRepository.getAllRechazadasAdministradorGI();
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






        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> getAllPendientesEvaluadoresGI(string id)
        {
            try
            {

                var solpend = await _evaluadorRepo.GetByClave(id);
               List<string> ids = solpend.Select(x =>Convert.ToString( x.IdeaInnovadoraId)).ToList();


                var Solicitud = await _solicitudGIRepository.getAllPendientesEvaluadoresGI(ids);
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


        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> getAllSolicitudesAdministradorGI(int id, string clave)
        {
            try
            {
                List<SolicitudGI> lista = new List<SolicitudGI>();
                if(id== 1028)
                {
                    var solpend = await _evaluadorRepo.GetByComentario();
                    List<string> ids = solpend.Select(x => Convert.ToString(x.IdeaInnovadoraId)).ToList();
                    var Solicitud = await _solicitudGIRepository.getAllPendientesAdministradorGI();
                    foreach (var item in Solicitud){
                        if (ids.Contains(Convert.ToString(item.InformacionId))){
                            item.AsignadaEval = true;
                        }
                        lista.Add(item);
                    }
                }
                if(id== 1029)
                {
                    var solpend = await _evaluadorRepo.GetByClave(clave);
                    List<string> ids = solpend.Select(x => Convert.ToString(x.IdeaInnovadoraId)).ToList();


                    var SolicitudEval = await _solicitudGIRepository.getAllPendientesEvaluadoresGI(ids);
                    foreach (var item in SolicitudEval) { lista.Add(item); }
                }

                var SolicitudAcep = await _solicitudGIRepository.getAllAceptadasAdministradorGI();
                foreach (var item in SolicitudAcep) { lista.Add(item); }

                var SolicitudRech = await _solicitudGIRepository.getAllRechazadasAdministradorGI();
                foreach (var item in SolicitudRech) { lista.Add(item); }




                if (lista != null && lista.Count() > 0)
                {
                    var personasID = lista.Select(x => x.ClavePersona).ToList();
                    var personas = await _PersonasRepository.GetAllCollectionWithoutStatus(personasID);
                    if (personas != null && personas.Count() > 0)
                        foreach (var soli in lista)
                        {
                            var p = personas.Find(x => x.ClavePersona.Equals(soli.ClavePersona));
                            if (p != null)
                                soli.NombreCompleto = p.NombreCompleto;
                        }
                }
                return Ok(lista);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<IHttpActionResult> notificar(MiembrosNotificar notificacion)
        {
            try
            {
                List<MiembrosGI> miembros = notificacion.ListaMiembros;
                int id = notificacion.Id;
                await _miembrosRepository.agregarevaluadores(miembros,id);
                Correo correo = new Correo();
                correo.Modulo = "Gestión de la Innovación";
                correo.Seccion = "Idea Innovadora";
                correo.TipoCorreo = "NotificacionEvaluadoresIdeaInnovadora";

                var c = miembros.Select(x => x.ClavePersona);
                var lista = await _PersonasRepository.GetAllCollectionMAX(new HashSet<string>(c));
                var corrs = new HashSet<String>(lista.Select(x => x.Correo));
                correo.Descripcion1 = string.Join(", ", corrs.ToArray());

                
                try
                {
                    await correoController.SendNotificacion(correo);
                }
                catch (Exception err) { }
                return Ok("");

            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }


        [HttpPost]
        public async Task<IHttpActionResult> GetPermisoEdicion(SolicitudGI Solicitud)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var result= await _solicitudGIRepository.GetPermisoEdicion(Solicitud);
                return Ok(result);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }


        [Authorize]
        [HttpPut]
        public async Task<IHttpActionResult> UpdateEstado(SolicitudGI Solicitud)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _solicitudGIRepository.UpdateEstado(Solicitud);
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
