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
    public class EstadoDelProcesoRepository : IDisposable
    {
        private PI_Context _db;
        public EstadoDelProcesoRepository()
        {
            _db = new PI_Context();
        }
        public void Dispose()
        {
            _db.Dispose();
        }

        public async Task<IEnumerable<EstadoDelProceso>> GetAll()
        {
            try
            {
                var entities = await _db.EstadoDelProceso.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);

            }
        }

        public async Task<IEnumerable<EstadoDelProceso>> GetAllActivos()
        {
            try
            {
                var entities = await _db.EstadoDelProceso
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

        public async Task<EstadoDelProceso> GetById(int id)
        {
            try
            {
                var entities = await _db.EstadoDelProceso.AsNoTracking()

                    .FirstOrDefaultAsync(e => e.EstadoDelProcesoId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(EstadoDelProceso estadoproceso)
        {
            try
            {
                if (!estadoproceso.ExisteEn(_db.EstadoDelProceso.Where(e => e.EstadoDelProcesoId != estadoproceso.EstadoDelProcesoId)
                    .Select(e => e.Descripcion).ToList()))
                {
                    _db.EstadoDelProceso.Add(estadoproceso);
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

        public async Task Update(EstadoDelProceso estadoproceso)
        {
            try
            {
                if (!estadoproceso.ExisteEn(_db.EstadoDelProceso.Where(e => e.EstadoDelProcesoId != estadoproceso.EstadoDelProcesoId).Select(e => e.Descripcion).ToList()))
                {
                    var _model = await _db.EstadoDelProceso.FirstOrDefaultAsync(e => e.EstadoDelProcesoId == estadoproceso.EstadoDelProcesoId);
                    if (_model != null)
                    {
                        _db.Entry(_model).CurrentValues.SetValues(estadoproceso);
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
                var _model = await _db.EstadoDelProceso.FirstOrDefaultAsync(e => e.EstadoDelProcesoId == id);
                if (_model != null)
                {
                    _db.EstadoDelProceso.Remove(_model);
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
