using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;
using System.Linq;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class TipoOrganizacionRepository : IDisposable
    {

        private CR_Context _db;
        public TipoOrganizacionRepository()
        {
            _db = new CR_Context();
        }


        public async Task<IEnumerable<TipoOrganizacion>> GetAll()
        {
            try
            {
                var entities = await _db.TipoOrganizacion.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<TipoOrganizacion>> GetByTrue()
        {
            try
            {
                var _tipos = await _db.TipoOrganizacion
                    .AsNoTracking()
                    .Where(t =>t.Estado == true)
                    .ToListAsync();
                return _tipos;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<TipoOrganizacion> Get(int id)
        {
            try
            {
                var entities = await _db.TipoOrganizacion.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.TipoOrganizacionId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(TipoOrganizacion model)
        {
            try
            {

                _db.TipoOrganizacion.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(TipoOrganizacion model)
        {
            try
            {
                var _model = await _db.TipoOrganizacion.FirstOrDefaultAsync(e => e.TipoOrganizacionId == model.TipoOrganizacionId);
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

        public async Task UpdateEstado(TipoOrganizacion model)
        {
            try
            {
                var _model = await _db.TipoOrganizacion.FirstOrDefaultAsync(e => e.TipoOrganizacionId == model.TipoOrganizacionId);
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
                var _model = await _db.TipoOrganizacion.FirstOrDefaultAsync(e => e.TipoOrganizacionId == id);
                if (_model != null)
                {
                    _db.TipoOrganizacion.Remove(_model);
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

