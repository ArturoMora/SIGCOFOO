using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.MT.Models.ITF;

namespace INEEL.DataAccess.GEN.Repositories.MT.ITF
{
    public class EvaluacionesRepository : IDisposable
    {
        //----------- AYUDA:
        // EvaluacionesRepository: nombre de clase (y tipicamente el constructor)
        // MT_Context.- tu Contexto : DbContext
        // Evaluaciones.- es el modelo
        // dbSetEvaluaciones.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: dbSetEvaluaciones =Categories                                  )
        // EvaluacionesId.-  es el ID del modelo (ID de la tabla)


        private MT_Context _db;
        public EvaluacionesRepository()
        {
            _db = new MT_Context();
        }

        //public async Task<IEnumerable<Evaluaciones>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<Evaluaciones>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetEvaluaciones.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Evaluaciones> Get(int id)
        {
            try
            {
                var entities = await _db.dbSetEvaluaciones.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.EvaluacionesId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(Evaluaciones model)
        {
            try
            {

                _db.dbSetEvaluaciones.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(Evaluaciones model)
        {
            try
            {
                var _model = await _db.dbSetEvaluaciones.FirstOrDefaultAsync(e => e.EvaluacionesId == model.EvaluacionesId);
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
                var _model = await _db.dbSetEvaluaciones.FirstOrDefaultAsync(e => e.EvaluacionesId == id);
                if (_model != null)
                {
                    _db.dbSetEvaluaciones.Remove(_model);
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
