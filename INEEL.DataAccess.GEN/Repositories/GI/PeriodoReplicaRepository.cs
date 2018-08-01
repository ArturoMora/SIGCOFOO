using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GI;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Linq;
using System;

namespace INEEL.DataAccess.GEN.Repositories.GI
{
    public class PeriodoReplicaRepository
    {

        private GI_Context dbGI;
        public PeriodoReplicaRepository()
        {
            dbGI = new GI_Context();
        }
        public async Task<PeriodoReplica> GetByIdPeriodoFI(int PeriodoFIId)
        {
            try
            {
                var entities = await dbGI.DbSetPeriodoReplica.AsNoTracking()
                    .Where(x => x.PeriodoFIId == PeriodoFIId)
                    .FirstOrDefaultAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<Boolean> GetInPeriodoReplicaByActivo()
        {

            try
            {

                    var periodoReplica = await dbGI.DbSetPeriodoReplica.AsNoTracking()
                .Include(x => x.PeriodoFI)
                .Where(x => x.PeriodoFI.Estado == true && x.PeriodoFIId == x.PeriodoFI.PeriodoFIId)
                
                .FirstOrDefaultAsync();
                    if (periodoReplica != null)
                    {
                        var fecha = DateTime.Now;
                        if (periodoReplica.FechaInicioReal <= fecha && fecha <= periodoReplica.FechaTerminoReal)
                        {
                            return true;
                        }
                    }
                
                return false;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<PeriodoReplica>> GetAll()
        {
            try
            {
                var entities = await dbGI.DbSetPeriodoReplica.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<PeriodoReplica> GetById(int id)
        {
            try
            {
                var entities = await dbGI.DbSetPeriodoReplica.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.PeriodoReplicaId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(PeriodoReplica model)
        {
            try
            {

                dbGI.DbSetPeriodoReplica.Add(model);
                await dbGI.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(PeriodoReplica model)
        {
            try
            {
                var _model = await dbGI.DbSetPeriodoReplica.FirstOrDefaultAsync(e => e.PeriodoReplicaId == model.PeriodoReplicaId);
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
                var _model = await dbGI.DbSetPeriodoReplica.FirstOrDefaultAsync(e => e.PeriodoReplicaId == id);
                if (_model != null)
                {
                    dbGI.DbSetPeriodoReplica.Remove(_model);
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
