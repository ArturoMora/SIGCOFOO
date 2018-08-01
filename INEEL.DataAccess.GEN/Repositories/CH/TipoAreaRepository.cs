using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CH;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class TipoAreaRepository : IDisposable
    {
        //----------- AYUDA:
        // TipoAreaRepository: nombre de clase (y tipicamente el constructor)
        // FooDbContext.- tu Contexto : DbContext
        // TipoArea.- es el modelo
        // tipoArea.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: tipoArea =Categories                                  )
        // FooID.-  es el ID del modelo (ID de la tabla)


        private SIGCOCHContext _db;
        public TipoAreaRepository()
        {
            _db = new SIGCOCHContext();
        }

        //public async Task<IEnumerable<TipoArea>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<TipoArea>> GetAll()
        {
            try
            {
                var entities = await _db.tipoArea.Where(e => e.Estado == 1).AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<TipoArea>> GetAllSinFiltro()
        {
            try
            {
                var entities = await _db.tipoArea.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<TipoArea> Get(int id)
        {
            try
            {
                var entities = await _db.tipoArea.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.TipoAreaId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(TipoArea model)
        {
            try
            {

                _db.tipoArea.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(TipoArea model)
        {
            try
            {
                var _model = await _db.tipoArea.FirstOrDefaultAsync(e => e.TipoAreaId == model.TipoAreaId);
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

        public async Task Delete(int id)
        {
            try
            {
                var _model = await _db.tipoArea.FirstOrDefaultAsync(e => e.TipoAreaId == id);
                if (_model != null)
                {
                    _db.tipoArea.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(TipoArea obj)
        {
            try
            {
                var _obj = await _db.tipoArea.FirstOrDefaultAsync(e => e.TipoAreaId == obj.TipoAreaId);
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
