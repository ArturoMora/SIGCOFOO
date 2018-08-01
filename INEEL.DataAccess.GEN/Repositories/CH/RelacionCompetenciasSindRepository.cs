using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CH;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
     public class RelacionCompetenciasSindRepository : IDisposable
    {

        private SIGCOCHContext _db;
        public RelacionCompetenciasSindRepository()
        {
            _db = new SIGCOCHContext();
        }

        //public async Task<IEnumerable<EstadoEvaluacion>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<RelacionCompetenciasNivelesSind>> GetAll()
        {
            try
            {
                var entities = await _db.relacionCompetenciasSind.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<RelacionCompetenciasNivelesSind> Get(int id)
        {
            try
            {
                var entities = await _db.relacionCompetenciasSind.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.id == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        
        public async Task Create(RelacionCompetenciasNivelesSind model)
        {
            try
            {

                _db.relacionCompetenciasSind.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(RelacionCompetenciasNivelesSind model)
        {
            try
            {
                var _model = await _db.relacionCompetenciasSind.FirstOrDefaultAsync(e => e.id == model.id);
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
                var _model = await _db.relacionCompetenciasSind.FirstOrDefaultAsync(e => e.id == id);
                if (_model != null)
                {
                    _db.relacionCompetenciasSind.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task UpdateEstado(RelacionCompetenciasNivelesSind obj)
        {
            try
            {
                var _obj = await _db.relacionCompetenciasSind.FirstOrDefaultAsync(e => e.estado == obj.estado);
                if (_obj != null)
                {
                    _obj.estado = obj.estado;
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
