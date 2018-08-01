using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GI;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Linq;
using System;

namespace INEEL.DataAccess.GEN.Repositories.GI
{
    public class PeriodoRecepcionRepository
    {

        private GI_Context dbGI;
        public PeriodoRecepcionRepository()
        {
            dbGI = new GI_Context();
        }
        public async Task<Boolean> GetInPeriodoRecepcionByActivo()
        {

            try
            {

               
                    var periodoRecepcion = await dbGI.DbSetPeriodoRecepcion.AsNoTracking()
                .Include(x => x.PeriodoFI)
                .Where(x => x.PeriodoFI.Estado == true && x.PeriodoFIId == x.PeriodoFI.PeriodoFIId)
                .FirstOrDefaultAsync();
                    if (periodoRecepcion != null) { 
                        var fecha = DateTime.Now;
                        if (periodoRecepcion.FechaInicioReal <= fecha && fecha <= periodoRecepcion.FechaTerminoReal)
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
        public async Task<IEnumerable<PeriodoRecepcion>> GetAll()
        {
            try
            {
                var entities = await dbGI.DbSetPeriodoRecepcion.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        
         public async Task<PeriodoRecepcion> GetByIdPeriodoFI(int PeriodoFIId)
        {
            try
            {
                var entities = await dbGI.DbSetPeriodoRecepcion.AsNoTracking()
                    .Where(x=> x.PeriodoFIId== PeriodoFIId)
                    .FirstOrDefaultAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<PeriodoRecepcion> GetById(int id)
        {
            try
            {
                var entities = await dbGI.DbSetPeriodoRecepcion.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.PeriodoRecepcionId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(PeriodoRecepcion model)
        {
            try
            {

                dbGI.DbSetPeriodoRecepcion.Add(model);
                await dbGI.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(PeriodoRecepcion model)
        {
            try
            {
                var _model = await dbGI.DbSetPeriodoRecepcion.FirstOrDefaultAsync(e => e.PeriodoRecepcionId == model.PeriodoRecepcionId);
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
                var _model = await dbGI.DbSetPeriodoRecepcion.FirstOrDefaultAsync(e => e.PeriodoRecepcionId == id);
                if (_model != null)
                {
                    dbGI.DbSetPeriodoRecepcion.Remove(_model);
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
