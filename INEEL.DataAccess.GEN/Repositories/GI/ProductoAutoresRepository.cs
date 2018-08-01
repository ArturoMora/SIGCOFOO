using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GI;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Linq;
using System;

namespace INEEL.DataAccess.GEN.Repositories.GI
{
    public class ProductoAutoresRepository
    {

        private GI_Context dbGI;
        public ProductoAutoresRepository()
        {
            dbGI = new GI_Context();
        }
        public ProductoAutoresRepository(GI_Context db)
        {
            dbGI =db;
        }
        public async Task<IEnumerable<ProductoAutores>> GetAll()
        {
            try
            {
                var entities = await dbGI.DbSetProductoAutores.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<ProductoGIEvaluadores> GetByIdExistFI(int ProductoGIId)
        {
            try
            {
                var entities = await dbGI.DbSetProductoGIEvaluadores.AsNoTracking()
                    .Where(x => x.ProductoGIId == ProductoGIId).FirstOrDefaultAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<ProductoAutores> GetById(int id)
        {
            try
            {
                var entities = await dbGI.DbSetProductoAutores.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.Id == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(ProductoAutores model)
        {
            try
            {

                dbGI.DbSetProductoAutores.Add(model);
                await dbGI.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(ProductoAutores model)
        {
            try
            {
                var _model = await dbGI.DbSetProductoAutores.FirstOrDefaultAsync(e => e.Id == model.Id);
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
                var _model = await dbGI.DbSetProductoAutores.FirstOrDefaultAsync(e => e.Id == id);
                if (_model != null)
                {
                    dbGI.DbSetProductoAutores.Remove(_model);
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
