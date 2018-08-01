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
    public class TipoPagosRepository
    {

        private GI_Context dbGI;
        public TipoPagosRepository()
        {
            dbGI = new GI_Context();
        }
        public async Task<IEnumerable<TipoPagos>> GetAll()
        {
            try
            {
                var entities = await dbGI.DbSetTipoPagos.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<TipoPagos> GetById(int id)
        {
            try
            {
                var entities = await dbGI.DbSetTipoPagos.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.TipoPagosId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(TipoPagos model)
        {
            try
            {
                if (!model.ExisteEn(dbGI.DbSetTipoPagos.Where(e => e.TipoPagosId != model.TipoPagosId).Select(e => e.Descripcion).ToList()))
                {
                    dbGI.DbSetTipoPagos.Add(model);
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

        public async Task Update(TipoPagos model)
        {
            try
            {
                var _model = await dbGI.DbSetTipoPagos.FirstOrDefaultAsync(e => e.TipoPagosId == model.TipoPagosId);
                if (_model != null)
                {
                    if (!model.ExisteEn(dbGI.DbSetTipoPagos.Where(e => e.TipoPagosId != model.TipoPagosId).Select(e => e.Descripcion).ToList()))
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

        //public async Task Delete(int id)
        //{
        //    try
        //    {
        //        var _model = await dbGI.DbSetTipoPagos.FirstOrDefaultAsync(e => e.TipoPagosId == id);
        //        if (_model != null)
        //        {
        //            dbGI.DbSetTipoPagos.Remove(_model);
        //            await dbGI.SaveChangesAsync();
        //        }
        //    }
        //    catch (Exception e)
        //    {
        //        throw new Exception(e.Message, e);
        //    }
        //}

        public void Dispose()
        {
            dbGI.Dispose(); //ayudar al recolector de basura
        }

    }
}
