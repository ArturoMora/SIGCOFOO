using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class ProductoPorProveedorRepository : IDisposable
    {

        private CR_Context _db;
        public ProductoPorProveedorRepository()
        {
            _db = new CR_Context();
        }


        public async Task<IEnumerable<ProductoPorProveedor>> GetAll()
        {
            try
            {
                var entities = await _db.ProductoPorProveedor.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<ProductoPorProveedor> Get(int id)
        {
            try
            {
                var entities = await _db.ProductoPorProveedor.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.ProductoPorProveedorId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(ProductoPorProveedor model)
        {
            try
            {

                _db.ProductoPorProveedor.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(ProductoPorProveedor model)
        {
            try
            {
                var _model = await _db.ProductoPorProveedor.FirstOrDefaultAsync(e => e.ProductoPorProveedorId == model.ProductoPorProveedorId);
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

        public async Task UpdateEstado(ProductoPorProveedor model)
        {
            try
            {
                var _model = await _db.ProductoPorProveedor.FirstOrDefaultAsync(e => e.ProductoPorProveedorId == model.ProductoPorProveedorId);
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
                var _model = await _db.ProductoPorProveedor.FirstOrDefaultAsync(e => e.ProductoPorProveedorId == id);
                if (_model != null)
                {
                    _db.ProductoPorProveedor.Remove(_model);
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

