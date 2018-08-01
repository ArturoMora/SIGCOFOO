using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;
using System.Linq;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class TipoFuenteFinanciamientoRepository : IDisposable
    {
        private CR_Context _db;
        public TipoFuenteFinanciamientoRepository()
        {
            _db = new CR_Context();
        }

        public async Task<IEnumerable<TipoFuenteFinanciamiento>> GetAll()
        {
            try
            {
                var entities = await _db.TipoFuenteFinanciamiento.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<TipoFuenteFinanciamiento>> GetAllByEstado()
        {
            try
            {
                var entities = await _db.TipoFuenteFinanciamiento
                    .OrderBy(p => p.Nombre)
                    .AsNoTracking()
                    .ToListAsync();
                return entities.Where(e => e.Estado == true);

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<TipoFuenteFinanciamiento> Get(int id)
        {
            try
            {
                var entities = await _db.TipoFuenteFinanciamiento.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.TipoFuenteFinanciamientoId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(TipoFuenteFinanciamiento model)
        {
            try
            {

                _db.TipoFuenteFinanciamiento.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(TipoFuenteFinanciamiento model)
        {
            try
            {
                var _model = await _db.TipoFuenteFinanciamiento.FirstOrDefaultAsync(e => e.TipoFuenteFinanciamientoId == model.TipoFuenteFinanciamientoId);
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
                var _model = await _db.TipoFuenteFinanciamiento.FirstOrDefaultAsync(e => e.TipoFuenteFinanciamientoId == id);
                if (_model != null)
                {
                    _db.TipoFuenteFinanciamiento.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(TipoFuenteFinanciamiento model)
        {
            try
            {
                var _model = await _db.TipoFuenteFinanciamiento.FirstOrDefaultAsync(e => e.TipoFuenteFinanciamientoId == model.TipoFuenteFinanciamientoId);
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