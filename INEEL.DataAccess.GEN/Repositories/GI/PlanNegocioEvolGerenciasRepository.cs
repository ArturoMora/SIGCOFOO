using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GI;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Linq;
using System;

namespace INEEL.DataAccess.GEN.Repositories.GI
{
    public class PlanNegocioEvolGerenciasRepository
    {

        private GI_Context dbGI;
        public PlanNegocioEvolGerenciasRepository()
        {
            dbGI = new GI_Context();
        }
        public PlanNegocioEvolGerenciasRepository(GI_Context db)
        {
            dbGI = db;
        }
        public async Task<IEnumerable<PlanNegocioEvolGerencias>> GetAll()
        {
            try
            {
                var entities = await dbGI.DbSetPlanNegocioEvolGerencias.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<PlanNegocioEvolGerencias> GetById(int id)
        {
            try
            {
                var entities = await dbGI.DbSetPlanNegocioEvolGerencias.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.Id == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(PlanNegocioEvolGerencias model)
        {
            try
            {

                dbGI.DbSetPlanNegocioEvolGerencias.Add(model);
                await dbGI.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(PlanNegocioEvolGerencias model)
        {
            try
            {
                var _model = await dbGI.DbSetPlanNegocioEvolGerencias.FirstOrDefaultAsync(e => e.Id == model.Id);
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
                var _model = await dbGI.DbSetPlanNegocioEvolGerencias.FirstOrDefaultAsync(e => e.Id == id);
                if (_model != null)
                {
                    dbGI.DbSetPlanNegocioEvolGerencias.Remove(_model);
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
