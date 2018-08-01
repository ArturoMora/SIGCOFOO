using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CH;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class PeriodoEvaluacionRepository : IDisposable
    {
        //----------- AYUDA:
        // PeriodoEvaluacionRepository: nombre de clase (y tipicamente el constructor)
        // FooDbContext.- tu Contexto : DbContext
        // PeriodoEvaluacion.- es el modelo
        // periodoEvaluacion.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: periodoEvaluacion =Categories                                  )
        // FooID.-  es el ID del modelo (ID de la tabla)


        private SIGCOCHContext _db;
        public PeriodoEvaluacionRepository()
        {
            _db = new SIGCOCHContext();
        }

        //public async Task<IEnumerable<PeriodoEvaluacion>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<PeriodoEvaluacion>> GetAll()
        {
            try
            {
                var entities = await _db.periodoEvaluacion
                     .Where(e => e.Estado == 1)
                     .AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<PeriodoEvaluacion>> GetAllSort()
        {
            try
            {
                var entities = await _db.periodoEvaluacion
                     .Where(e => e.Estado == 1)
                     .OrderByDescending(e=>e.Periodo)
                     .AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<PeriodoEvaluacion>> GetAllTecnicas()
        {
            try
            {
                var entities = await _db.periodoEvaluacion
                     .Where(e => e.Estado == 1 && e.Periodo != "2010" && e.Periodo != "2011" && e.Periodo != "2012" )
                     .OrderBy(e => e.Periodo)
                     .AsNoTracking().ToListAsync();
                               
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<PeriodoEvaluacion> Get(int id)
        {
            try
            {
                var entities = await _db.periodoEvaluacion.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.PeriodoEvaluaionId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<PeriodoEvaluacion> GetPeriodoDescripcion(string id)
        {
            try
            {
                var entities = await _db.periodoEvaluacion.AsNoTracking()
                   .FirstOrDefaultAsync(e => e.Periodo == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(PeriodoEvaluacion model)
        {
            try
            {

                _db.periodoEvaluacion.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(PeriodoEvaluacion model)
        {
            try
            {
                var _model = await _db.periodoEvaluacion.FirstOrDefaultAsync(e => e.PeriodoEvaluaionId == model.PeriodoEvaluaionId);
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
                var _model = await _db.periodoEvaluacion.FirstOrDefaultAsync(e => e.PeriodoEvaluaionId == id);
                if (_model != null)
                {
                    _db.periodoEvaluacion.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task UpdateEstado(PeriodoEvaluacion obj)
        {
            try
            {
                var _obj = await _db.periodoEvaluacion.FirstOrDefaultAsync(e => e.PeriodoEvaluaionId == obj.PeriodoEvaluaionId);
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
