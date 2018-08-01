/*using IIE.DataAccess;
using IIE.DataAccess.Repositories;*/
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories;
using System;
using System.Threading.Tasks;
using System.Web.Http;

namespace INEEL.WebAPI.Controllers.GENERICOS
{
    public class LikesLinkedController : ApiController
    {
        // AYUDA:
        //LikesLinkedController.- Nombre de clase y tipicament constructor
        //LikesLinkedRepository.- La implementación CRUD del Modelo:LikesLinked con el patrón de diseño Repository
        //_entityRepo.-      varible de tipo LikesLinkedRepository
        // entities.-        resultado de tipo Task<IEnumerable<LikesLinked>>
        // entity.-         resultado de tipo Task<LikesLinked>
        // LikesLinked.-         Modelo
        private LikesLinkedRepository _entityRepo;
        //private ProductsRepositories _productRepo;
        public LikesLinkedController()
        {
            _entityRepo = new LikesLinkedRepository();
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
        public async Task<IHttpActionResult> GetAllById_Empleado(String id, String clave)
        {
            try
            {
                var entities = await _entityRepo.GetAllById_Empleado(id, clave);
                return Ok(entities);
            }
            catch (Exception e)
            {

                return InternalServerError(e);
            }
        }
        
        [HttpGet]
        public async Task<IHttpActionResult> Get(long Id)
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
        public async Task<IHttpActionResult> UpdateStadoOrCreate([FromBody]LikesLinked model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _entityRepo.UpdateStadoOrCreate(model);
                return Ok("solicitud exitosa!");
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update([FromBody]LikesLinked model)
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
        public async Task<IHttpActionResult> Delete(long Id)
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
