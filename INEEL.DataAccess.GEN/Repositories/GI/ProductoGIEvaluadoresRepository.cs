using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GI;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Linq;
using System;

namespace INEEL.DataAccess.GEN.Repositories.GI
{
    public class ProductoGIEvaluadoresRepository
    {

        private GI_Context dbGI;
        public ProductoGIEvaluadoresRepository()
        {
            dbGI = new GI_Context();
        }
        public async Task<IEnumerable<ProductoGIEvaluadores>> GetAll()
        {
            try
            {
                var entities = await dbGI.DbSetProductoGIEvaluadores.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<ProductoGIEvaluadores> GetById(int id)
        {
            try
            {
                var entities = await dbGI.DbSetProductoGIEvaluadores.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.Id == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(ProductoGIEvaluadores model)
        {
            try
            {

                dbGI.DbSetProductoGIEvaluadores.Add(model);
                await dbGI.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(ProductoGIEvaluadores model)
        {
            try
            {
                var _model = await dbGI.DbSetProductoGIEvaluadores.FirstOrDefaultAsync(e => e.Id == model.Id);
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
                var _model = await dbGI.DbSetProductoGIEvaluadores.FirstOrDefaultAsync(e => e.Id == id);
                if (_model != null)
                {
                    dbGI.DbSetProductoGIEvaluadores.Remove(_model);
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
