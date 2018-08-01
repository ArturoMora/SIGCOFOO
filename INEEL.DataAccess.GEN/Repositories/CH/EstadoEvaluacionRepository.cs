using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CH;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class EstadoEvaluacionRepository : IDisposable
    {
        //----------- AYUDA:
        // EstadoEvaluacionRepository: nombre de clase (y tipicamente el constructor)
        // FooDbContext.- tu Contexto : DbContext
        // EstadoEvaluacion.- es el modelo
        // estadoEvaluacion.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: estadoEvaluacion =Categories                                  )
        // FooID.-  es el ID del modelo (ID de la tabla)


        private SIGCOCHContext _db;
        public EstadoEvaluacionRepository()
        {
            _db = new SIGCOCHContext();
        }

        //public async Task<IEnumerable<EstadoEvaluacion>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<EstadoEvaluacion>> GetAll()
        {
            try
            {
                var entities = await _db.estadoEvaluacion.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<EstadoEvaluacion> Get(int id)
        {
            try
            {
                var entities = await _db.estadoEvaluacion.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.EstadoEvaluacionId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(EstadoEvaluacion model)
        {
            try
            {

                _db.estadoEvaluacion.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(EstadoEvaluacion model)
        {
            try
            {
                var _model = await _db.estadoEvaluacion.FirstOrDefaultAsync(e => e.EstadoEvaluacionId == model.EstadoEvaluacionId);
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
                var _model = await _db.estadoEvaluacion.FirstOrDefaultAsync(e => e.EstadoEvaluacionId == id);
                if (_model != null)
                {
                    _db.estadoEvaluacion.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task UpdateEstado(EstadoEvaluacion obj)
        {
            try
            {
                var _obj = await _db.estadoEvaluacion.FirstOrDefaultAsync(e => e.EstadoEvaluacionId == obj.EstadoEvaluacionId);
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
