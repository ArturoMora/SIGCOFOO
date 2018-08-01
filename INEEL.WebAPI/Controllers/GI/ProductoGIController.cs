using INEEL.DataAccess.GEN.Models.GI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Repositories.GI;
using INEEL.DataAccess.GEN.Util;

namespace INEEL.WebAPI.Controllers.GI
{
    public class ProductoGIController : ApiController
    {

        private ProductoGIRepository _repo;

        public ProductoGIController()
        {
            _repo = new ProductoGIRepository();
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetGrupoEvaluadoExistFI(int id)
        {//id: ProductoGIId
            try
            {
               var  _evalRepo = new ProductoAutoresRepository();
                var obj = await _evalRepo.GetByIdExistFI(id);
                return Ok(obj);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
        
        [HttpGet]
        public async Task<IHttpActionResult> GetAllForModal()
        {
            try
            {
                var entities = await _repo.GetAllForModal();
                return Ok(entities);
            }
            catch (Exception e)
            {

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetByProyectos(string id)
        {
            try
            {
                var entities = await _repo.GetByProyectos(id);
                return Ok(entities);
            }
            catch (Exception e)
            {

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetAll()
        {
            try
            {
                var entities = await _repo.GetAll();
                return Ok(entities);
            }
            catch (Exception e)
            {

                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetAllRevisarComite()
        {
            try
            {
                var entities = await _repo.GetAllRevisarComite();
                return Ok(entities);
            }
            catch (Exception e)
            {

                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetAllRevisarComite2()
        {
            try
            {
                var entities = await _repo.GetAllRevisarComite2();
                return Ok(entities);
            }
            catch (Exception e)
            {

                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetById(int Id)
        {
            try
            {
                var ProductoGI = await _repo.GetById(Id);
                return Ok(ProductoGI);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
        
        [HttpGet]
        public async Task<IHttpActionResult> CountProductosGI()
        {
            try
            {
                var entities = await _repo.CountProductosGI();
                return Ok(entities);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> GetConsultaRevisarComite(ProductoGI p)
        {
            try
            {
                var entities = await _repo.GetConsultaRevisarComite(p);
                return Ok(entities);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> GetConsultaSolicitudesFI(ProductoGI p)
        {
            try
            {
                var entities = await _repo.GetConsultaSolicitudesFI(p);
                return Ok(entities);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }


        [HttpPost]
        public async Task<IHttpActionResult> GetConsultaMisProductos(ProductoGI p)
        {
            try
            {
                var entities = await _repo.GetConsultaMisProductos(p);
                return Ok(entities);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpGet]
        public async Task<IHttpActionResult> GetAllCartera()
        {
            try
            {
                var entities = await _repo.GetAllCartera();
                return Ok(entities);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }


        [Authorize]
        [HttpGet]
        public async Task<IHttpActionResult> GetAllCartera2()
        {
            try
            {
                var entities = await _repo.GetAllCartera2();
                return Ok(entities);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }


        [Authorize]
        [HttpGet]
        public async Task<IHttpActionResult> GetAllByEmpleado(String id)
        {
            try
            {
                var entities = await _repo.GetAllByEmpleado(id);
                return Ok(entities);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }


        [Authorize]
        [HttpGet]
        public async Task<IHttpActionResult> GetAllByEmpleado2(String id)
        {
            try
            {
                var entities = await _repo.GetAllByEmpleado2(id);
                return Ok(entities);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }


        [HttpPost]
        public async Task<IHttpActionResult> Create([FromBody]ProductoGI model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var clavePersona = SimpleSessionPersister.PersonaId;
                var nombrePersona = SimpleSessionPersister.nombreUsuario;
                if (String.IsNullOrEmpty(clavePersona) || String.IsNullOrEmpty(nombrePersona))
                {
                    throw new Exception("No se identifica al usuario");
                }
                await _repo.Create(model, clavePersona, nombrePersona);
                return Ok("Registro creado exitosamente!");
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
        [HttpPost]
        public async Task<IHttpActionResult> RegistrarMovimiento([FromBody]ProductoGI model)
        {


            try
            {
                var clavePersona = SimpleSessionPersister.PersonaId;
                var nombrePersona = SimpleSessionPersister.nombreUsuario;
                if (String.IsNullOrEmpty(clavePersona) || String.IsNullOrEmpty(nombrePersona))
                {
                    throw new Exception("No se identifica al usuario");
                }
                if (String.IsNullOrEmpty(model.Movimiento))
                {
                    throw new Exception("No se especificó el movimiento");
                }
                await _repo.RegistrarMovimiento(model, clavePersona, nombrePersona);
                return Ok("Factor de innovación actualizado exitosamente!");
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
        [HttpPut]
        public async Task<IHttpActionResult> UpdateFI([FromBody]ProductoGI model)
        {


            try
            {
                var clavePersona = SimpleSessionPersister.PersonaId;
                var nombrePersona = SimpleSessionPersister.nombreUsuario;
                if (String.IsNullOrEmpty(clavePersona) || String.IsNullOrEmpty(nombrePersona))
                {
                    throw new Exception("No se identifica al usuario");
                }
                await _repo.UpdateFI(model, clavePersona, nombrePersona);
                return Ok("Factor de innovación actualizado exitosamente!");
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
        [HttpPut]
        public async Task<IHttpActionResult> UpdateVoBo([FromBody]ProductoGI model)
        {


            try
            {
                var clavePersona = SimpleSessionPersister.PersonaId;
                var nombrePersona = SimpleSessionPersister.nombreUsuario;
                if (String.IsNullOrEmpty(clavePersona) || String.IsNullOrEmpty(nombrePersona))
                {
                    throw new Exception("No se identifica al usuario");
                }
                await _repo.UpdateVoBo(model, clavePersona, nombrePersona);
                return Ok("Factor de innovación actualizado exitosamente!");
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpPut]
        public async Task<IHttpActionResult> Update([FromBody]ProductoGI model)
        {
  

            try
            {
                var clavePersona = SimpleSessionPersister.PersonaId;
                var nombrePersona = SimpleSessionPersister.nombreUsuario;
                if (String.IsNullOrEmpty(clavePersona) || String.IsNullOrEmpty(nombrePersona))
                {
                    throw new Exception("No se identifica al usuario");
                }
                await _repo.Update(model, clavePersona, nombrePersona);
                return Ok("Registro actualizado exitosamente!");
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }


        [HttpDelete]
        public async Task<IHttpActionResult> Delete(int Id)
        {
            try
            {
                await _repo.Delete(Id);
                return Ok("Registro eliminado exitosamente!");
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

    }
}
