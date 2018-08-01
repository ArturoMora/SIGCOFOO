using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GI;

namespace INEEL.DataAccess.GEN.Repositories.GI
{
    public class EvaluadorIdeaRepository
    {
        private GI_Context dbGI;
        public EvaluadorIdeaRepository()
        {
            dbGI = new GI_Context();
        }

        public async Task<IEnumerable<EvaluadoresIdea>> GetById(int id)
        {
            try
            {
                var entities = await dbGI.DbSetEvaluadoresIdea.AsNoTracking()
                    .Where(x => x.IdeaInnovadoraId == id).ToListAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task UpdateComentarios(EvaluadoresIdea model)
        {
            var _obj = await dbGI.DbSetEvaluadoresIdea.FirstOrDefaultAsync(e => e.IdeaInnovadoraId == model.IdeaInnovadoraId && e.Comentarios==null);
            if (_obj != null)
            {
                _obj.Comentarios = model.Comentarios;

                await dbGI.SaveChangesAsync();
            }
        }
        public async Task<ProductoGIEvaluadores> GetByIdExistFI(int ProductoGIId)
        {
            try
            {
                var entities = await dbGI.DbSetProductoGIEvaluadores.AsNoTracking()
                    .Where(x => x.ProductoGIId == ProductoGIId).FirstOrDefaultAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<EvaluadoresIdea> GetByIdExist(int id)
        {
            try
            {
                var entities = await dbGI.DbSetEvaluadoresIdea.AsNoTracking()
                    .Where(x => x.IdeaInnovadoraId == id).FirstOrDefaultAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        
        public async Task CreateFI(List<ProductoGIEvaluadores> Obj)
        {
            try
            {
                foreach (var item in Obj)
                {
                    var result = dbGI.DbSetProductoGIEvaluadores.Add(item);
                    await dbGI.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task Create(List<EvaluadoresIdea> Obj)
        {
            try
            {
                foreach (var item in Obj)
                {
                    var result = dbGI.DbSetEvaluadoresIdea.Add(item);
                    await dbGI.SaveChangesAsync();
                }
                
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateFI(List<ProductoGIEvaluadores> productoGIEvaluadores)
        {
            try
            {
                foreach (var item in productoGIEvaluadores)
                {
                    var _obj = await dbGI.DbSetProductoGIEvaluadores.FirstOrDefaultAsync(e => e.ProductoGIId == item.ProductoGIId);
                    if (_obj != null)
                    {
                        _obj.MiembrosGI = null;
                        _obj.MiembrosGIId = item.MiembrosGIId;
                        _obj.ClavePersona = item.ClavePersona;

                        await dbGI.SaveChangesAsync();
                    }
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task Update(List<EvaluadoresIdea> evaluadoresIdea)
        {
            try
            {
                foreach (var item in evaluadoresIdea)
                {
                    var _obj = await dbGI.DbSetEvaluadoresIdea.FirstOrDefaultAsync(e => e.IdeaInnovadoraId == item.IdeaInnovadoraId);
                    if (_obj != null)
                    {
                        _obj.ClavePersona = item.ClavePersona;

                        await dbGI.SaveChangesAsync();
                    }
                }
               
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<EvaluadoresIdea>> GetByClave(string clave)
        {
            try
            {
                var entities = await dbGI.DbSetEvaluadoresIdea.AsNoTracking()
                    .Where(x=>x.Comentarios==null)
                    .Where(x => x.ClavePersona==clave).ToListAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<EvaluadoresIdea>> GetByComentario()
        {
            try
            {
                var entities = await dbGI.DbSetEvaluadoresIdea.AsNoTracking()
                    .Where(x => x.Comentarios == null)
                    .ToListAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<EvaluadoresIdea> GetComentarios(int id)
        {
            try
            {
                var entities = await dbGI.DbSetEvaluadoresIdea.AsNoTracking()
                    .Where(x => x.IdeaInnovadoraId == id)
                    .Where(x => x.Comentarios != null).FirstOrDefaultAsync();
                if(entities!=null){
                    PersonasRepository p = new PersonasRepository();
                    var evaluador = await p.GetByClave(entities.ClavePersona);
                    entities.nombrePersona=evaluador.NombreCompleto;
                }
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
    }
}
