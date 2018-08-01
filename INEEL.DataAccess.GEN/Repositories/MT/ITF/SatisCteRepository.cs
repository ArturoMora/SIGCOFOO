using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.MT.Models.ITF;

namespace INEEL.DataAccess.GEN.Repositories.MT.ITF
{
    public class SatisCteRepository : IDisposable
    {
        //----------- AYUDA:
        // SatisCteRepository: nombre de clase (y tipicamente el constructor)
        // MT_Context.- tu Contexto : DbContext
        // SatisCte.- es el modelo
        // dbSetSatisCtes.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: dbSetSatisCtes =Categories                                  )
        // SatisCteId.-  es el ID del modelo (ID de la tabla)


        private MT_Context _db;
        public SatisCteRepository()
        {
            _db = new MT_Context();
        }

        //public async Task<IEnumerable<SatisCte>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<SatisCte>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetSatisCtes.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<SatisCte> Get(int id)
        {
            try
            {
                var entities = await _db.dbSetSatisCtes.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.SatisCteId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(SatisCte model)
        {
            try
            {

                _db.dbSetSatisCtes.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(SatisCte model)
        {
            try
            {
                var _model = await _db.dbSetSatisCtes.FirstOrDefaultAsync(e => e.SatisCteId == model.SatisCteId);
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
                var _model = await _db.dbSetSatisCtes.FirstOrDefaultAsync(e => e.SatisCteId == id);
                if (_model != null)
                {
                    _db.dbSetSatisCtes.Remove(_model);
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
