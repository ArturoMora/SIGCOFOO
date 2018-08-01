using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class ServicioPorProveedorRepository : IDisposable
    {

        private CR_Context _db;
        public ServicioPorProveedorRepository()
        {
            _db = new CR_Context();
        }


        public async Task<IEnumerable<ServicioPorProveedor>> GetAll()
        {
            try
            {
                var entities = await _db.ServicioPorProveedor.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<ServicioPorProveedor> Get(int id)
        {
            try
            {
                var entities = await _db.ServicioPorProveedor.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.ServicioPorProveedorId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(ServicioPorProveedor model)
        {
            try
            {

                _db.ServicioPorProveedor.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(ServicioPorProveedor model)
        {
            try
            {
                var _model = await _db.ServicioPorProveedor.FirstOrDefaultAsync(e => e.ServicioPorProveedorId == model.ServicioPorProveedorId);
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

        public async Task UpdateEstado(ServicioPorProveedor model)
        {
            try
            {
                var _model = await _db.ServicioPorProveedor.FirstOrDefaultAsync(e => e.ServicioPorProveedorId == model.ServicioPorProveedorId);
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
                var _model = await _db.ServicioPorProveedor.FirstOrDefaultAsync(e => e.ServicioPorProveedorId == id);
                if (_model != null)
                {
                    _db.ServicioPorProveedor.Remove(_model);
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

