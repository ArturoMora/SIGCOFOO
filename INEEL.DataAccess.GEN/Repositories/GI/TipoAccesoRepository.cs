using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GI;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Linq;
using System;
using INEEL.DataAccess.GEN.Util;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.GEN.Repositories.GI
{
    public class TipoAccesoRepository
    {
        private GI_Context dbGI;
        public TipoAccesoRepository()
        {
            dbGI = new GI_Context();
        }
        public async Task<TipoAccesoGI> GetByID(int id)
        {
            try
            {
                var entities = await dbGI.DbSetTipoAccesoGI.AsNoTracking()
                    .Where(x => x.Id == id)
                    .FirstOrDefaultAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<TipoAccesoGI>> GetAll()
        {
            try
            {
                var entities = await dbGI.DbSetTipoAccesoGI.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task Update(TipoAccesoGI model)
        {
            try
            {
                var _model = await dbGI.DbSetTipoAccesoGI.FirstOrDefaultAsync(e => e.Id == model.Id);
                if (_model != null)
                {
                    if (!model.ExisteEn(dbGI.DbSetTipoAccesoGI.Where(e => e.Id != model.Id).Select(e => e.Nombre).ToList(), "Nombre"))
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
    }
}
