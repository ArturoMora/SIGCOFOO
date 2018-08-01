using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CH;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Dynamic;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class RegistroEvaluacionSindRepository: IDisposable
    {

        private SIGCOCHContext _db;
        public RegistroEvaluacionSindRepository()
        {
            _db = new SIGCOCHContext();
        }

        //public async Task<IEnumerable<EstadoEvaluacion>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<RegistroEvaluacionesSind>> GetAll()
        {
            try
            {
                var entities = await _db.registroEvaluacionSind.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<RegistroEvaluacionesSind> Get(int id)
        {
            try
            {
                var entities = await _db.registroEvaluacionSind.AsNoTracking()
                    .Include(x=>x.matrizSind)
                    .FirstOrDefaultAsync(e => e.idEvaluacionSin == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<RegistroEvaluacionesSind>> CompetenciasEvaluadas(int id)
        {
            try
            {
                var entities = await _db.registroEvaluacionSind
                     .Include(x => x.matrizSind)
                     .Include(x => x.matrizSind.relaciones.competenciasSind)
                     .Include(x => x.matrizSind.relaciones.relacioncomportamiento.comportamientos)
                     .Where(x => x.idEvaluacionSin == id)
                     .AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task Create(RegistroEvaluacionesSind model)
        {
            try
            {

                _db.registroEvaluacionSind.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(RegistroEvaluacionesSind model)
        {
            try
            {
                var _model = await _db.registroEvaluacionSind.FirstOrDefaultAsync(e => e.id == model.id);
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
                var _model = await _db.registroEvaluacionSind.FirstOrDefaultAsync(e => e.id == id);
                if (_model != null)
                {
                    _db.registroEvaluacionSind.Remove(_model);
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
