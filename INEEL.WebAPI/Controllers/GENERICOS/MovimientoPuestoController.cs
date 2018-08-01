﻿/*using IIE.DataAccess;
using IIE.DataAccess.Repositories;*/
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories;
using System;
using System.Threading.Tasks;
using System.Web.Http;

namespace INEEL.WebAPI.Controllers.GENERICOS
{
    public class MovimientoPuestoController : ApiController
    {
        
        private MovimientoPuestoRepository _entityRepo;
        //private ProductsRepositories _productRepo;
        public MovimientoPuestoController()
        {
            _entityRepo = new MovimientoPuestoRepository();
            // _productRepo = new ProductsRepositories();
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetAll()
        {
            try
            {
                var entities = await _entityRepo.GetAll();
                /*var products = await _productRepo.GetAll();
                var obj = new {message= "resultado OK", employees = entities, products = products};
                //return Ok(obj);*/
                return Ok(entities);
            }
            catch (Exception e)
            {

                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetAllByClaveEmpleado(String Id)
        {
            try
            {
                var entity = await _entityRepo.GetAllByClaveEmpleado(Id);
                return Ok(entity);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> Get(int Id)
        {
            try
            {
                var entity = await _entityRepo.Get(Id);
                return Ok(entity);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> Create([FromBody]MovimientoPuesto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _entityRepo.Create(model);
                return Ok("Registro creado exitosamente!");
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update([FromBody]MovimientoPuesto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _entityRepo.Update(model);
                return Ok("Registro actualizado exitosamente!");
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(int Id)
        {
            try
            {
                await _entityRepo.Delete(Id);
                return Ok("Registro eliminado exitosamente!");
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }


    }
}