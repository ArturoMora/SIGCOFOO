using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.MT.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.MT.ITF
{
    public class AdjuntoITFInsumoRepository : IDisposable
    {
        //----------- AYUDA:
        // AdjuntoITFInsumoRepository: nombre de clase (y tipicamente el constructor)
        // FooDbContext.- tu Contexto : DbContext
        // AdjuntoITFInsumo.- es el modelo
        // dbSetAdjuntoITFInsumos.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: dbSetAdjuntoITFInsumos =Categories                                  )
        // AdjuntoITFInsumoId.-  es el ID del modelo (ID de la tabla)


        private MT_Context _db;
        public AdjuntoITFInsumoRepository()
        {
            _db = new MT_Context();
        }

        //public async Task<IEnumerable<AdjuntoITFInsumo>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<AdjuntoITFInsumo>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetAdjuntoITFInsumos.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<AdjuntoITFInsumo> Get(int id)
        {
            try
            {
                var entities = await _db.dbSetAdjuntoITFInsumos.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.AdjuntoITFInsumoId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(AdjuntoITFInsumo model)
        {
            try
            {

                _db.dbSetAdjuntoITFInsumos.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(AdjuntoITFInsumo model)
        {
            try
            {
                var _model = await _db.dbSetAdjuntoITFInsumos.FirstOrDefaultAsync(e => e.AdjuntoITFInsumoId == model.AdjuntoITFInsumoId);
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
                var _model = await _db.dbSetAdjuntoITFInsumos.FirstOrDefaultAsync(e => e.AdjuntoITFInsumoId == id);
                if (_model != null)
                {
                    _db.dbSetAdjuntoITFInsumos.Remove(_model);
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
