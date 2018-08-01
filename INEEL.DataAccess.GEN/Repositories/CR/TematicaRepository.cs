using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;
using System.Linq;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class TematicaRepository : IDisposable
    {
        private CR_Context _db;
        public TematicaRepository()
        {
            _db = new CR_Context();
        }

        public async Task<IEnumerable<Tematica>> GetAll()
        {
            try
            {
                var entities = await _db.Tematica.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Tematica> Get(int id)
        {
            try
            {
                var entities = await _db.Tematica.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.TematicaId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Obtener todas las tematicas con estado Activo (1)
        public async Task<IEnumerable<Tematica>> GetAllByEstado()
        {
            try
            {
                var entities = await _db.Tematica.AsNoTracking().ToListAsync();
                return entities.Where(e => e.Estado == true);
                
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Obtener todas las tematicas con estado Activo (1)
        public async Task<IEnumerable<Tematica>> GetAllByEstadoE()
        {
            try
            {
                var entities = await _db.Tematica.AsNoTracking().ToListAsync();
                return entities.Where(e => e.Estado == true );

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Obtener todas las tematicas con estado Activo (1)
        public async Task<IEnumerable<Tematica>> GetAllFKByEstado()
        {
            try
            {
                var entities = await _db.Tematica
                    .AsNoTracking()
                    .Include(e => e.TematicaPorFondoPrograma)
                    .ToListAsync();
                return entities.Where(e => e.Estado == true);

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(Tematica model)
        {
            try
            {

                _db.Tematica.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(Tematica model)
        {
            try
            {
                var _model = await _db.Tematica.FirstOrDefaultAsync(e => e.TematicaId == model.TematicaId);
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
                var _model = await _db.Tematica.FirstOrDefaultAsync(e => e.TematicaId == id);
                if (_model != null)
                {
                    _db.Tematica.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(Tematica model)
        {
            try
            {
                var _model = await _db.Tematica.FirstOrDefaultAsync(e => e.TematicaId == model.TematicaId);
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

        public void Dispose()
        {
            _db.Dispose();
        }
    }
}