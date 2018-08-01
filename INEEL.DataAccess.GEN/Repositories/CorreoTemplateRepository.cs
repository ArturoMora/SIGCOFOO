using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GI;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Linq;
using System;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.GEN.Repositories
{
    public class CorreoTemplateRepository
    {

        private GEN_Context dbGEN;
        public CorreoTemplateRepository()
        {
            dbGEN = new GEN_Context();
        }
        public CorreoTemplateRepository(GEN_Context db)
        {
            dbGEN = db;
        }
        public async Task<IEnumerable<CorreoTemplate>> GetAll()
        {
            try
            {
                var entities = await dbGEN.bdSetCorreoTemplate.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<CorreoTemplate> GetById(String id)
        {
            try
            {
                var entities = await dbGEN.bdSetCorreoTemplate.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.Id == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        //public async Task Create(CorreoTemplate model)
        //{
        //    try
        //    {

        //        dbGEN.bdSetCorreoTemplate.Add(model);
        //        await dbGEN.SaveChangesAsync();

        //    }
        //    catch (Exception e)
        //    {
        //        throw new Exception(e.Message, e);
        //    }
        //}

        public async Task Update(CorreoTemplate model)
        {
            try
            {
                var _model = await dbGEN.bdSetCorreoTemplate.FirstOrDefaultAsync(e => e.Id == model.Id);
                if (_model != null)
                {
                    dbGEN.Entry(_model).CurrentValues.SetValues(model);
                    await dbGEN.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //public async Task Delete(String id)
        //{
        //    try
        //    {
        //        var _model = await dbGEN.bdSetCorreoTemplate.FirstOrDefaultAsync(e => e.Id == id);
        //        if (_model != null)
        //        {
        //            dbGEN.bdSetCorreoTemplate.Remove(_model);
        //            await dbGEN.SaveChangesAsync();
        //        }
        //    }
        //    catch (Exception e)
        //    {
        //        throw new Exception(e.Message, e);
        //    }
        //}

        public void Dispose()
        {
            dbGEN.Dispose(); //ayudar al recolector de basura
        }

    }
}
