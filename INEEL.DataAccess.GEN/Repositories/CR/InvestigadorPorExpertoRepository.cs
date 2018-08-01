using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CR;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class InvestigadorPorExpertoRepository : IDisposable
    {
        private CR_Context _db;
        public InvestigadorPorExpertoRepository()
        {
            _db = new CR_Context();
        }


        public async Task<IEnumerable<InvestigadorPorExperto>> GetAll()
        {
            try
            {
                var entities = await _db.InvestigadorPorExperto.AsNoTracking()
                    .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<InvestigadorPorExperto> GetById(int id)
        {
            try
            {
                var entities = await _db.InvestigadorPorExperto.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.InvestigadorExpertoId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(InvestigadorPorExperto model)
        {
            try
            {

                _db.InvestigadorPorExperto.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(InvestigadorPorExperto model)
        {
            try
            {
                var _model = await _db.InvestigadorPorExperto.FirstOrDefaultAsync(e => e.InvestigadorExpertoId == model.InvestigadorExpertoId);
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
                var _model = await _db.InvestigadorPorExperto.FirstOrDefaultAsync(e => e.InvestigadorExpertoId == id);
                if (_model != null)
                {
                    _db.InvestigadorPorExperto.Remove(_model);
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
