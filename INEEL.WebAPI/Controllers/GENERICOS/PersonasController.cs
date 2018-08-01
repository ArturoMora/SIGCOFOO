using System;
using System.Threading.Tasks;
using System.Web.Http;
using log4net;
using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories;
using System.Configuration;
using System.IO;

namespace INEEL.WebAPI.Controllers.GENERICOS
{

    public class PersonasController : ApiController
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(PersonasController));

        PersonasRepository _repository;

        public PersonasController()
        {
            _repository = new PersonasRepository();
        }
        [AllowAnonymous]
        [HttpPost]
        public async Task<Object> GetDataFirst(DataServerSide ss)
        {
            try
            {

                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var entities = await _repository.GetDataFirst(ss);
                var result = new
                {
                    //draw = ss.draw,
                    //recordsFiltered = ss.recordsFiltered,
                    recordsTotal = ss.recordsTotal,
                    data = entities
                };
                return Ok(result);
            }
            catch (Exception e)
            {

                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }
        [AllowAnonymous]
        [HttpPost]
        public async Task<IHttpActionResult> getData([FromBody]DataServerSide ss)//DataTableParameters parameters)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                //var draw2 = HttpContext.Current.Request.Form["search[value]"];
                var entities = await _repository.getData(ss);

                var result = new
                {
                    draw = ss.draw,
                    recordsFiltered = ss.recordsFiltered,
                    recordsTotal = ss.recordsTotal,
                    data = entities
                };

                return Ok(result);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetDataByAptitudes(String id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var personas = await _repository.GetDataByAptitudes(id);
                return Ok(personas);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetFullRolByID(int id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                int rolbase = Convert.ToInt32(ConfigurationManager.AppSettings["RolBase"]);
                var personas = await _repository.GetFullRolByID(id, "CH", rolbase);
                return Ok(personas);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetFuncionesRolADMByID(int id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                int rolbase = Convert.ToInt32(ConfigurationManager.AppSettings["RolBase"]);
                var personas = await _repository.GetFullRolByID(id, "ADM", rolbase);
                return Ok(personas);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetFuncionesRolCHByID(int id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                int rolbase = Convert.ToInt32(ConfigurationManager.AppSettings["RolBase"]);
                var personas = await _repository.GetFullRolByID(id, "CH", rolbase);
                return Ok(personas);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetFuncionesRolCRByID(int id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                int rolbase = Convert.ToInt32(ConfigurationManager.AppSettings["RolBase"]);
                var personas = await _repository.GetFullRolByID(id, "CR", rolbase);
                return Ok(personas);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetFuncionesRolMTByID(int id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                int rolbase = Convert.ToInt32(ConfigurationManager.AppSettings["RolBase"]);
                var personas = await _repository.GetFullRolByID(id, "MT", rolbase);
                return Ok(personas);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetFuncionesRolCPByID(int id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                int rolbase = Convert.ToInt32(ConfigurationManager.AppSettings["RolBase"]);
                var personas = await _repository.GetFullRolByID(id, "CP", rolbase);
                return Ok(personas);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetFuncionesRolGIByID(int id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                int rolbase = Convert.ToInt32(ConfigurationManager.AppSettings["RolBase"]);
                var personas = await _repository.GetFullRolByID(id, "GI", rolbase);
                return Ok(personas);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                //<<<<<<< HEAD
                return InternalServerError(e);
            }
        }
        //=======
        [HttpGet]
        public async Task<IHttpActionResult> GetFuncionesRolPIByID(int id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                int rolbase = Convert.ToInt32(ConfigurationManager.AppSettings["RolBase"]);
                var personas = await _repository.GetFullRolByID(id, "PI", rolbase);
                return Ok(personas);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //>>>>>>> refs/remotes/origin/desarrollo/todos

        [HttpGet]
        public async Task<IHttpActionResult> GetUsersByClaveUnidad(string id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var personas = await _repository.GetUsersByClaveUnidad(id);
                return Ok(personas);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetUsersByClaveUnidadPadre(string id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var personas = await _repository.GetUsersByClaveUnidadPadre(id);
                return Ok(personas);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetAllUsersEjecutivo()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var personas = await _repository.GetAllUsersEjecutivo();
                return Ok(personas);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetAll()
        {
            try
            {
                var personas = await _repository.GetAll();
                return Ok(personas);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetAllIdByLikeFullNameLatin1(String id)
        {
            var likeName = id;
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var personas = await _repository.GetAllClavesByLikeNombreLatin1(likeName);
                return Ok(personas);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetByArea(string clavearea)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var campo = await _repository.GetByArea(clavearea);
                return Ok(campo);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }


        [HttpGet]
        public async Task<IHttpActionResult> GetAllForModal()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var personas = await _repository.GetAllForModal();
                return Ok(personas);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetAllForModalActivos()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var personas = await _repository.GetAllForModalActivos();
                return Ok(personas);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }


        [HttpPost]
        public async Task<IHttpActionResult> GetPersonas([FromBody]Personas persona)
        {
            String id = null;
            String nombreCompleto = null;
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                if (persona != null)
                {
                    id = persona.ClavePersona;
                    nombreCompleto = persona.Nombre;
                    if (persona.esPersonaActiva)
                    {
                        var personas = await _repository.GetPersonasActivas(id, nombreCompleto);
                        return Ok(personas);
                    }
                    else
                    {
                        var personas = await _repository.GetPersonas(id, nombreCompleto);
                        return Ok(personas);
                    }
                }

                return null;

            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetPersonasByComercializacion()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                string unidad = ConfigurationManager.AppSettings["unidadComercializacion"];
                string especialista = ConfigurationManager.AppSettings["rolEspecialista"];

                int x = Convert.ToInt32(especialista);
                var personas = await _repository.GetPersonasEspecialista(unidad, x);
                return Ok(personas);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetByRU(string Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                int rolbase = Convert.ToInt32(ConfigurationManager.AppSettings["RolBase"]);
                var persona = await _repository.GetByRU(Id, rolbase);
                return Ok(persona);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetById(string Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var persona = await _repository.GetById(Id);
                return Ok(persona);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetByIdFichaPersonal(string Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var persona = await _repository.GetByIdFichaPersonal(Id);
                return Ok(persona);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetByClave(string Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var persona = await _repository.GetByClave(Id);
                return Ok(persona);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetByClaveFechaEfectiva(string Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var persona = await _repository.GetByClaveFechaEfectiva(Id);
                return Ok(persona);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }


        [HttpPost]
        [Authorize]
        public async Task<IHttpActionResult> Create(Personas obj)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _repository.Create(obj);
                return Ok("Registro creado correctamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpPut]
        public async Task<IHttpActionResult> Update(Personas obj)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _repository.Update(obj);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }


        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> ObtenerFotobyIdAdjunto(long id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var foto = await _repository.ObtenerFotobyIdAdjunto(id);
                return Ok(foto);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> ObtenerFoto(string id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var persona = await _repository.ObtenerFotobyclavepersona(id);
                return Ok(persona);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpPut]
        public async Task<IHttpActionResult> GuardaFoto(Personas obj)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var persona = await _repository.GuardarFoto(obj);
                return Ok(persona);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpPut]
        public async Task<IHttpActionResult> EliminaFoto(Personas obj)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var persona = await _repository.EliminaFoto(obj);
                return Ok(persona);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpDelete]
        public async Task<IHttpActionResult> Delete(string Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _repository.Delete(Id);
                return Ok("Registro eliminado correctamente!");

            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }


        [Authorize]
        [HttpPut]
        public async Task<IHttpActionResult> UpdateEstado(Personas obj)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _repository.UpdateEstado(obj);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpPut]
        public async Task<IHttpActionResult> updateUserExperience(Personas obj)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _repository.updateUserExperience(obj);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }


        [HttpGet]
        public async Task<IHttpActionResult> GetResponsableByClaveUnidadWithoutStatus(string id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var persona = await _repository.GetResponsableByClaveUnidadWithoutStatus(id);
                return Ok(persona);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        
        [HttpGet]
        public async Task<IHttpActionResult> GetByClaveGestionFicha(string Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var persona = await _repository.GetByClaveGestionFicha(Id);
                return Ok(persona);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetByClaveGestionFichaPersonalInvestigador(string Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var persona = await _repository.GetByClaveGestionFichaPersonalInvestigador(Id);
                return Ok(persona);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        } 

        [HttpGet]
        public async Task<IHttpActionResult> GetByClaveGestionFichaPersonalSindicalizado(string Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var persona = await _repository.GetByClaveGestionFichaPersonalSindicalizado(Id);
                return Ok(persona);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        } 
        
        [HttpGet]
        public async Task<IHttpActionResult> GetByNombreGestionFicha(string Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var persona = await _repository.GetByNombreGestionFicha(Id);
                return Ok(persona);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetByNombreGestionFichaPersonalInvestigador(string Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var persona = await _repository.GetByNombreGestionFichaPersonalInvestigador(Id);
                return Ok(persona);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetByNombreGestionFichaPersonalSindicalizado(string Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var persona = await _repository.GetByNombreGestionFichaPersonalSindicalizado(Id);
                return Ok(persona);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetAllGestionFicha()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var persona = await _repository.GetAllGestionFicha();
                return Ok(persona);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetByClaveGestionFichaUno(string Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var persona = await _repository.GetByClaveGestionFichaUno(Id);
                return Ok(persona);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> getImageByIdAdjunto(long id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var path = await _repository.getImagePathByIdAdjunto(id);
                String file = null;
                try
                {
                    Byte[] bytes = File.ReadAllBytes(path);
                    file = Convert.ToBase64String(bytes);
                }
                catch (Exception e)
                {
                    file = null;
                }
                return Ok(file);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> MovimientosPersonal(MovimientosPersonal modelo)
        {
            try
            {
                var result = await _repository.MovimientosPersonal(modelo);
                return Ok(result);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> busquedaAvanzada(busquedaAv modelo)
        {
            try
            {
                var result = await _repository.busqueda_avanzada(modelo);
                return Ok(result);
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
                var result = await _repository.GetGerenteByClaveUnidad(id);
                return Ok(result);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }


    }
}