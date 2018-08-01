using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Models.PI;
using INEEL.DataAccess.PI.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.PI
{
    public class RamaRepository : IDisposable
    {



        private PI_Context _db;
        public RamaRepository()
        {
            _db = new PI_Context();
        }



        public async Task<IEnumerable<Rama>> GetAll()
        {
            try
            {
                var entities = await _db.Rama.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Rama>> GetAllActivas()
        {
            try
            {
                var entities = await _db.Rama
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

        public async Task<Rama> GetById(int id)
        {
            try
            {
                var entities = await _db.Rama.AsNoTracking()

                    .FirstOrDefaultAsync(e => e.RamaId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(Rama rama)
        {
            try
            {

                if (!rama.ExisteEn(_db.Rama.Where(e => e.RamaId != rama.RamaId).Select(e => e.Descripcion).ToList()))
                {
                    _db.Rama.Add(rama);
                    await _db.SaveChangesAsync();
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


        public async Task Update(Rama rama)
        {
            try
            {
                var _model = await _db.Rama.FirstOrDefaultAsync(e => e.RamaId == rama.RamaId);
                if (_model != null)
                {
                    if (! rama.ExisteEn(_db.Rama.Where(e=> e.RamaId != rama.RamaId).Select(e=>e.Descripcion).ToList()))
                    {
                        _db.Entry(_model).CurrentValues.SetValues(rama);
                        await _db.SaveChangesAsync();
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
                var _model = await _db.Rama.FirstOrDefaultAsync(e => e.RamaId == id);
                if (_model != null)
                {
                    _db.Rama.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public void Dispose()
        {
            _db.Dispose(); //ayudar al recolector de basura
        }
    }
}
