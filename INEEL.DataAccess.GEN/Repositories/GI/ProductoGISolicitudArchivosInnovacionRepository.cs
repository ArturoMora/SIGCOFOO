using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GI;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Linq;
using System;

namespace INEEL.DataAccess.GEN.Repositories.GI
{
    public class ProductoGISolicitudArchivosInnovacionRepository
    {

        private GI_Context dbGI;
        public ProductoGISolicitudArchivosInnovacionRepository()
        {
            dbGI = new GI_Context();
        }
        public ProductoGISolicitudArchivosInnovacionRepository(GI_Context db )
        {
            dbGI = db;
        }
        public async Task<IEnumerable<ProductoGISolicitudArchivosInnovacion>> GetAll()
        {
            try
            {
                var entities = await dbGI.DbSetProductoGISolicitudArchivosInnovacion.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<ProductoGISolicitudArchivosInnovacion> GetById(int id)
        {
            try
            {
                var entities = await dbGI.DbSetProductoGISolicitudArchivosInnovacion.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.Id == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(ProductoGISolicitudArchivosInnovacion model)
        {
            try
            {

                dbGI.DbSetProductoGISolicitudArchivosInnovacion.Add(model);
                await dbGI.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(ProductoGISolicitudArchivosInnovacion model)
        {
            try
            {
                var _model = await dbGI.DbSetProductoGISolicitudArchivosInnovacion.FirstOrDefaultAsync(e => e.Id == model.Id);
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
                var _model = await dbGI.DbSetProductoGISolicitudArchivosInnovacion.FirstOrDefaultAsync(e => e.Id == id);
                if (_model != null)
                {
                    dbGI.DbSetProductoGISolicitudArchivosInnovacion.Remove(_model);
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
