using INEEL.DataAccess.GEN.Models.GI;
using INEEL.DataAccess.GEN.Repositories.GI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace INEEL.WebAPI.Controllers.GI
{
    public class ProductoHistorialFIController : ApiController
    {
        private ProductoHistorialFIRepository _repo;

        public ProductoHistorialFIController()
        {
            _repo = new ProductoHistorialFIRepository();
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
        public async Task<IHttpActionResult> GetHistorialByProducto(int id)
        {
            try
            {
                var entities = await _repo.GetHistorialByProducto(id);
                return Ok(entities);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetHistorialBySolicitud(int id)
        {
            try
            {
                var entities = await _repo.GetHistorialBySolicitud(id);
                return Ok(entities);

            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> Create(ProductoHistorialFI model)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                await _repo.Create(model);
                return Ok("Registros creado exitosamente!");
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpPut]
        public async Task<IHttpActionResult> Update(ProductoHistorialFI model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                await _repo.Update(model);
                return Ok("Registro actualizado exitosamente!");
            }catch(Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpPut]
        public async Task<IHttpActionResult> AddComentario(ProductoHistorialFI model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                await _repo.AddComentario(model);
                return Ok("Registro actualizado exitosamente!");
            }catch(Exception e)
            {
                return InternalServerError(e);
            }
        }
        
        [HttpDelete]
        public async Task<IHttpActionResult> Delete( int id)
        {
            try
            {
                await _repo.Delete(id);
                return Ok("Registro eliminado exitosamente!");
            }catch(Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetJustificacionSolicitudRechazada( int id)
        {
            try
            {
                var entity=await _repo.GetJustificacionSolicitudRechazada(id);
                return Ok(entity);
            }catch(Exception e)
            {
                return InternalServerError(e);
            }
        }


    }
}