using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Models.GI;

namespace INEEL.DataAccess.GEN.Repositories.GI
{
    public class ComiteRepository
    {
        private GI_Context dbGI;

        public ComiteRepository()
        {
            dbGI = new GI_Context();
        }
        public async Task Update(ComiteGI model)
        {
            try
            {
                var _model = await dbGI.DbSetComiteGI.FirstOrDefaultAsync(e => e.comiteId == model.comiteId);
                if (_model != null)
                {

                    if (!model.ExisteEn(dbGI.DbSetComiteGI.Where(e => e.comiteId != model.comiteId).Select(e => e.Nombre).ToList(), "Nombre"))
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

        public async Task Create(ComiteGI model)
        {
            try
            {

                if (!model.ExisteEn(dbGI.DbSetComiteGI.Select(e => e.Nombre).ToList(), "Nombre"))
                {
                    dbGI.DbSetComiteGI.Add(model);
                    await dbGI.SaveChangesAsync();
                }
                else
                {
                    throw new ApplicationException("Ya existe un registro con ese nombre.");
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

        public async Task<ComiteGI> GetById(int id)
        {
            try
            {
                var entities = await dbGI.DbSetComiteGI.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.comiteId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<ComiteGI>> GetAll()
        {
            try
            {
                var entities = await dbGI.DbSetComiteGI.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
    }
}
