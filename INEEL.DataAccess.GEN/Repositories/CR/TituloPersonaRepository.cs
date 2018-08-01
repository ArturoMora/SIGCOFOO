using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.UI.WebControls;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class TituloPersonaRepository : IDisposable
    {
        private CR_Context _db;

        public TituloPersonaRepository()
        {
            _db = new CR_Context();
        }

        public async Task<IEnumerable<TituloPersona>> GetAll()
        {
            try
            {
                var entities = await _db.TituloPersona.AsNoTracking().ToListAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<TituloPersona>> GetAllActivos()
        {
            try
            {
                var entities = await _db.TituloPersona
                    .Where(e => e.Estado == true)
                    .AsNoTracking().ToListAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<TituloPersona> GetById(int id)
        {
            try
            {
                var entities = await _db.TituloPersona.AsNoTracking().FirstOrDefaultAsync(e => e.TituloId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(TituloPersona model)
        {
            try
            {
                _db.TituloPersona.Add(model);
                await _db.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(TituloPersona model)
        {
            try
            {
                var _model = await _db.TituloPersona.FirstOrDefaultAsync(e => e.TituloId == model.TituloId);
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
                var _model = await _db.TituloPersona.FirstOrDefaultAsync(e => e.TituloId == id);
                if (_model != null)
                {
                    _db.TituloPersona.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(TituloPersona model)
        {
            try
            {
                var _model = await _db.TituloPersona.FirstOrDefaultAsync(e => e.TituloId == model.TituloId);
                if (model != null)
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
