using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class ProveedorRepository : IDisposable
    {

        private CR_Context _db;
        public ProveedorRepository()
        {
            _db = new CR_Context();
        }


        public async Task<IEnumerable<Proveedor>> GetAll()
        {
            try
            {
                var entities = await _db.Proveedor.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Proveedor> Get(int id)
        {
            try
            {
                var entities = await _db.Proveedor.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.ProveedorId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(Proveedor model)
        {
            try
            {

                _db.Proveedor.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(Proveedor model)
        {
            try
            {
                var _model = await _db.Proveedor.FirstOrDefaultAsync(e => e.ProveedorId == model.ProveedorId);
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

        public async Task UpdateEstado(Proveedor model)
        {
            try
            {
                var _model = await _db.Proveedor.FirstOrDefaultAsync(e => e.ProveedorId == model.ProveedorId);
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
                var _model = await _db.Proveedor.FirstOrDefaultAsync(e => e.ProveedorId == id);
                if (_model != null)
                {
                    _db.Proveedor.Remove(_model);
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

