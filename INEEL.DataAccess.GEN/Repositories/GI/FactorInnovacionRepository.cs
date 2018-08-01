using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GI;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Linq;
using System;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.GEN.Repositories.GI
{
    public class FactorInnovacionRepository
    {

        private GI_Context dbGI;
        public FactorInnovacionRepository()
        {
            dbGI = new GI_Context();
        }

        public async Task<IEnumerable<FactorInnovacion>> GetAll()
        {
            try
            {
                var entities = await dbGI.DbSetFactorInnovacion.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<FactorInnovacion> GetById(int id)
        {
            try
            {
                var entities = await dbGI.DbSetFactorInnovacion.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.Id == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(FactorInnovacion model)
        {
            try
            {

                dbGI.DbSetFactorInnovacion.Add(model);
                await dbGI.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(FactorInnovacion model)
        {
            try
            {
                var _model = await dbGI.DbSetFactorInnovacion.FirstOrDefaultAsync(e => e.Id == model.Id);
                if (_model != null)
                {
                    if (!model.ExisteEn(dbGI.DbSetFactorInnovacion.Where(e => e.Id != model.Id).Select(e => e.Descripcion).ToList()))
                    {
                        dbGI.Entry(_model).CurrentValues.SetValues(model);
                        await dbGI.SaveChangesAsync();
                    }
                    else
                    {
                        throw new ApplicationException("Ya existe un registro con ese nombre.");
                    }
                }

            }
            catch (ApplicationException e)
            {
                throw new ApplicationException(e.Message, e);
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
                var _model = await dbGI.DbSetFactorInnovacion.FirstOrDefaultAsync(e => e.Id == id);
                if (_model != null)
                {
                    dbGI.DbSetFactorInnovacion.Remove(_model);
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
