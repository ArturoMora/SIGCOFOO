using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;
using System.Linq;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class ProductoPorCompetidorRepository : IDisposable
    {

        private CR_Context _db;
        public ProductoPorCompetidorRepository()
        {
            _db = new CR_Context();
        }


        public async Task<IEnumerable<ProductoPorCompetidor>> GetAll()
        {
            try
            {
                var entities = await _db.ProductoPorCompetidor.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<ProductoPorCompetidor>> GetAllByEstado()
        {
            try
            {
                var entities = await _db.ProductoPorCompetidor.AsNoTracking().ToListAsync();
                return entities.Where(e => e.Estado == true);

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<ProductoPorCompetidor> Get(int id)
        {
            try
            {
                var entities = await _db.ProductoPorCompetidor.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.ProductoPorCompetidorId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(ProductoPorCompetidor model)
        {
            try
            {

                _db.ProductoPorCompetidor.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(ProductoPorCompetidor model)
        {
            try
            {
                var _model = await _db.ProductoPorCompetidor.FirstOrDefaultAsync(e => e.ProductoPorCompetidorId == model.ProductoPorCompetidorId);
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

        public async Task UpdateEstado(ProductoPorCompetidor model)
        {
            try
            {
                var _model = await _db.ProductoPorCompetidor.FirstOrDefaultAsync(e => e.ProductoPorCompetidorId == model.ProductoPorCompetidorId);
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
                var _model = await _db.ProductoPorCompetidor.FirstOrDefaultAsync(e => e.ProductoPorCompetidorId == id);
                if (_model != null)
                {
                    _db.ProductoPorCompetidor.Remove(_model);
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

