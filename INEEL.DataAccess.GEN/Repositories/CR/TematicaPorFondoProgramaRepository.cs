using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;
using System.Data.Entity;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class TematicaPorFondoProgramaRepository : IDisposable
    {
        private CR_Context _db;
        public TematicaPorFondoProgramaRepository()
        {
            _db = new CR_Context();
        }


        public async Task<IEnumerable<TematicaPorFondoPrograma>> GetAll()
        {
            try
            {
                var entities = await _db.TematicaPorFondoPrograma
                    .AsNoTracking()
                    .Include(e => e.Tematica)
                    .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<TematicaPorFondoPrograma>> GetAllFKs()
        {
            try
            {
                var entities = await _db.TematicaPorFondoPrograma
                    .AsNoTracking()
                    .Include(e => e.Tematica)
                    .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<TematicaPorFondoPrograma> Get(int id)
        {
            try
            {
                var entities = await _db.TematicaPorFondoPrograma.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.TematicaPorFondoProgramaId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(TematicaPorFondoPrograma model)
        {
            try
            {

                _db.TematicaPorFondoPrograma.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(TematicaPorFondoPrograma model)
        {
            try
            {
                var _model = await _db.TematicaPorFondoPrograma.FirstOrDefaultAsync(e => e.TematicaPorFondoProgramaId == model.TematicaPorFondoProgramaId);
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

        public async Task UpdateEstado(TematicaPorFondoPrograma model)
        {
            try
            {
                var _model = await _db.TematicaPorFondoPrograma.FirstOrDefaultAsync(e => e.TematicaPorFondoProgramaId == model.TematicaPorFondoProgramaId);
                if (_model != null)
                {
                    _model.Estado = model.Estado;

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
                var _model = await _db.TematicaPorFondoPrograma.FirstOrDefaultAsync(e => e.TematicaPorFondoProgramaId == id);
                if (_model != null)
                {
                    _db.TematicaPorFondoPrograma.Remove(_model);
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
            _db.Dispose();
        }
    }
}

