using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories
{
    public class LogBitacoraRepository : IDisposable
    {
        //----------- AYUDA:
        // LogBitacoraRepository: nombre de clase (y tipicamente el constructor)
        // FooDbContext.- tu Contexto : DbContext
        // LogBitacora.- es el modelo
        // bdSetLogBitacora.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: bdSetLogBitacora =Categories                                  )
        // Id.-  es el ID del modelo (ID de la tabla)


        private GEN_Context _db;
        public LogBitacoraRepository()
        {
            _db = new GEN_Context();
        }

        //public async Task<IEnumerable<LogBitacora>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<LogBitacora>> GetAll()
        {
            try
            {
                var entities = await _db.bdSetLogBitacora.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<LogBitacora> Get(long id)
        {
            try
            {
                var entities = await _db.bdSetLogBitacora.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.Id == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(LogBitacora model)
        {
            try
            {

                _db.bdSetLogBitacora.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(LogBitacora model)
        {
            try
            {
                var _model = await _db.bdSetLogBitacora.FirstOrDefaultAsync(e => e.Id == model.Id);
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

        public async Task Delete(long id)
        {
            try
            {
                var _model = await _db.bdSetLogBitacora.FirstOrDefaultAsync(e => e.Id == id);
                if (_model != null)
                {
                    _db.bdSetLogBitacora.Remove(_model);
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
