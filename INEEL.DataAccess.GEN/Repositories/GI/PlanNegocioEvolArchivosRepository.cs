using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GI;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Linq;
using System;

namespace INEEL.DataAccess.GEN.Repositories.GI
{
    public class PlanNegocioEvolArchivosRepository
    {

        private GI_Context dbGI;
        public PlanNegocioEvolArchivosRepository()
        {
            dbGI = new GI_Context();
        }
        public PlanNegocioEvolArchivosRepository(GI_Context db)
        {
            dbGI = db;
        }
        public async Task<IEnumerable<PlanNegocioEvolArchivos>> GetAll()
        {
            try
            {
                var entities = await dbGI.DbSetPlanNegocioEvolArchivos.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<PlanNegocioEvolArchivos> GetById(int id)
        {
            try
            {
                var entities = await dbGI.DbSetPlanNegocioEvolArchivos.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.Id == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(PlanNegocioEvolArchivos model)
        {
            try
            {

                dbGI.DbSetPlanNegocioEvolArchivos.Add(model);
                await dbGI.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(PlanNegocioEvolArchivos model)
        {
            try
            {
                var _model = await dbGI.DbSetPlanNegocioEvolArchivos.FirstOrDefaultAsync(e => e.Id == model.Id);
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
                var _model = await dbGI.DbSetPlanNegocioEvolArchivos.FirstOrDefaultAsync(e => e.Id == id);
                if (_model != null)
                {
                    var adjuntoid = _model.AdjuntoId;
                    dbGI.DbSetPlanNegocioEvolArchivos.Remove(_model);
                    await dbGI.SaveChangesAsync();
                    await new AdjuntoRepository().Delete(adjuntoid);
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
