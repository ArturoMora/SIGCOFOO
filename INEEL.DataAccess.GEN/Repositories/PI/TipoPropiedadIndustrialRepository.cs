using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Models.PI;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.PI
{
    public class TipoPropiedadIndustrialRepository : IDisposable
    {

        private PI_Context _db;

        public void Dispose()
        {
            _db.Dispose(); //ayudar al recolector de basura
        }

        public TipoPropiedadIndustrialRepository()
        {
            _db = new PI_Context();
        }

        public async Task<IEnumerable<TipoPropiedadIndustrial>> GetAll()
        {
            try
            {
                var entities = await _db.TipoPropiedadIndustrial.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<TipoPropiedadIndustrial>> GetAllActivos()
        {
            try
            {
                var entities = await _db.TipoPropiedadIndustrial
                    .Where(e => e.Estado == true)
                    .AsNoTracking()
                    .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<TipoPropiedadIndustrial> GetById(int id)
        {
            try
            {
                var entities = await _db.TipoPropiedadIndustrial.AsNoTracking()

                    .FirstOrDefaultAsync(e => e.TipoPropiedadIndustrialId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(TipoPropiedadIndustrial pin)
        {
            try
            {
                if (!pin.ExisteEn(_db.TipoPropiedadIndustrial
                    .Where(e=> e.TipoPropiedadIndustrialId != pin.TipoPropiedadIndustrialId)
                    .Select(e=> e.Descripcion).ToList()))
                {
                    pin.prioridadOrdenamiento = 9;
                    _db.TipoPropiedadIndustrial.Add(pin);
                    await _db.SaveChangesAsync();
                }
                else
                {
                    throw new ApplicationException("Ya existe un registro con ese nombre.");
                }
            }
            catch (ApplicationException e)
            {
                throw new ApplicationException(e.Message);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(TipoPropiedadIndustrial pin)
        {
            try
            {
                if (!pin.ExisteEn(_db.TipoPropiedadIndustrial
                    .Where(e => e.TipoPropiedadIndustrialId != pin.TipoPropiedadIndustrialId)
                    .Select(e => e.Descripcion).ToList()))
                {
                    var _model = await _db.TipoPropiedadIndustrial.FirstOrDefaultAsync(e => e.TipoPropiedadIndustrialId == pin.TipoPropiedadIndustrialId);
                    if (_model != null)
                    {
                        _db.Entry(_model).CurrentValues.SetValues(pin);
                        await _db.SaveChangesAsync();
                    }
                }
                else
                {
                    throw new ApplicationException("Ya existe un registro con ese nombre.");
                }
            }
            catch (ApplicationException e)
            {
                throw new ApplicationException(e.Message);
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
                var _model = await _db.TipoPropiedadIndustrial.FirstOrDefaultAsync(e => e.TipoPropiedadIndustrialId == id);
                if (_model != null)
                {
                    _db.TipoPropiedadIndustrial.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

    }
}
