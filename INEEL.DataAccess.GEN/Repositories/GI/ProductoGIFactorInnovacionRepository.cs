using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GI;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Linq;
using System;

namespace INEEL.DataAccess.GEN.Repositories.GI
{
    public class ProductoGIFactorInnovacionRepository
    {

        private GI_Context dbGI;
        public ProductoGIFactorInnovacionRepository()
        {
            dbGI = new GI_Context();
        }
        public async Task<IEnumerable<ProductoGIFactorInnovacion>> GetAll()
        {
            try
            {
                var entities = await dbGI.DbSetProductoGIFactorInnovacion.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<ProductoGIFactorInnovacion> GetById(int id)
        {
            try
            {
                var entities = await dbGI.DbSetProductoGIFactorInnovacion.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.Id == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(ProductoGIFactorInnovacion model)
        {
            try
            {

                dbGI.DbSetProductoGIFactorInnovacion.Add(model);
                await dbGI.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(ProductoGIFactorInnovacion model)
        {
            try
            {
                var _model = await dbGI.DbSetProductoGIFactorInnovacion.FirstOrDefaultAsync(e => e.Id == model.Id);
                if (_model != null)
                {
                    dbGI.Entry(_model).CurrentValues.SetValues(model);
                    await dbGI.SaveChangesAsync();
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
                var _model = await dbGI.DbSetProductoGIFactorInnovacion.FirstOrDefaultAsync(e => e.Id == id);
                if (_model != null)
                {
                    dbGI.DbSetProductoGIFactorInnovacion.Remove(_model);
                    await dbGI.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public void Dispose()
        {
            dbGI.Dispose(); //ayudar al recolector de basura
        }

    }
}
