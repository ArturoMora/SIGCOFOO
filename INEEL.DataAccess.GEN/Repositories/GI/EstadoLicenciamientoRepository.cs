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
    public class EstadoLicenciamientoRepository
    {

        private GI_Context dbGI;
        public EstadoLicenciamientoRepository()
        {
            dbGI = new GI_Context();
        }
        public async Task<IEnumerable<EstadoLicenciamiento>> GetAll()
        {
            try
            {
                var entities = await dbGI.DbSetEstadoLicenciamiento.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<EstadoLicenciamiento> GetById(int id)
        {
            try
            {
                var entities = await dbGI.DbSetEstadoLicenciamiento.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.Id == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(EstadoLicenciamiento model)
        {
            try
            {

                dbGI.DbSetEstadoLicenciamiento.Add(model);
                await dbGI.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(EstadoLicenciamiento model)
        {
            try
            {
                var _model = await dbGI.DbSetEstadoLicenciamiento.FirstOrDefaultAsync(e => e.Id == model.Id);
                if (_model != null)
                {
                    if (!model.ExisteEn(dbGI.DbSetEstadoLicenciamiento.Where(e => e.Id != model.Id).Select(e => e.Descripcion).ToList()))
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
                var _model = await dbGI.DbSetEstadoLicenciamiento.FirstOrDefaultAsync(e => e.Id == id);
                if (_model != null)
                {
                    dbGI.DbSetEstadoLicenciamiento.Remove(_model);
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
