using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories 
{
    public class CategoriasRepository : IDisposable
    {

        private GEN_Context _db;

        public CategoriasRepository()
        {
            _db = new GEN_Context();
        }

        public async Task<IEnumerable<Categoria>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetCategoria.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }      

        public async Task<Categoria> GetById(string id)
        {
            try
            {
                var entities = await _db.dbSetCategoria.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.CategoriaId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(Categoria model)
        {
            try
            {

                _db.dbSetCategoria.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(Categoria model)
        {
            try
            {
                var _model = await _db.dbSetCategoria.FirstOrDefaultAsync(e => e.CategoriaId == model.CategoriaId);
                if (_model != null)
                {
                    _db.Entry(_model).CurrentValues.SetValues(model);
                    await _db.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Delete(string id)
        {
            try
            {
                var _model = await _db.dbSetCategoria.FirstOrDefaultAsync(e => e.CategoriaId == id);
                if (_model != null)
                {
                    _db.dbSetCategoria.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task UpdateEstado(Categoria obj)
        {
            try
            {
                var _obj= await _db.dbSetCategoria.FirstOrDefaultAsync(e => e.CategoriaId == obj.CategoriaId);
                if (_obj != null)
                {
                    _obj.Estado = obj.Estado;

                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public void Dispose()
        {
            _db.Dispose(); //ayudar al recolector de basura
        }


    }
}
