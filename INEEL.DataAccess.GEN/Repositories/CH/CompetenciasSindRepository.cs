using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CH;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class CompetenciasSindRepository : IDisposable
    {
        private SIGCOCHContext _db;
        public CompetenciasSindRepository()
        {
            _db = new SIGCOCHContext();
        }

        //public async Task<IEnumerable<EstadoEvaluacion>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<CompetenciasSind>> GetAll()
        {
            try
            {
                var entities = await _db.competenciasSind.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<CompetenciasSind> Get(int id)
        {
            try
            {
                var entities = await _db.competenciasSind.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.CompetenciaId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(CompetenciasSind model)
        {
            try
            {

                _db.competenciasSind.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(CompetenciasSind model)
        {
            try
            {
                var _model = await _db.competenciasSind.FirstOrDefaultAsync(e => e.CompetenciaId == model.CompetenciaId);
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
                var _model = await _db.competenciasSind.FirstOrDefaultAsync(e => e.CompetenciaId == id);
                if (_model != null)
                {
                    _db.competenciasSind.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task UpdateEstado(CompetenciasSind obj)
        {
            try
            {
                var _obj = await _db.competenciasSind.FirstOrDefaultAsync(e => e.CompetenciaId == obj.CompetenciaId);
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
