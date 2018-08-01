using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class PropuestaPorFondoRepository : IDisposable
    {

        private CR_Context _db;
        public PropuestaPorFondoRepository()
        {
            _db = new CR_Context();
        }


        public async Task<IEnumerable<PropuestaPorFondo>> GetAll()
        {
            try
            {
                var entities = await _db.PropuestaPorFondo.AsNoTracking().Include(e =>e.FondoPrograma).Include(e=>e.Propuestas)
                    .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<PropuestaPorFondo> Get(int id)
        {
            try
            {
                var entities = await _db.PropuestaPorFondo.AsNoTracking().Include(e=>e.FondoPrograma).Include(e=>e.Propuestas)
                    .FirstOrDefaultAsync(e => e.PropuestaPorFondoId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<PropuestaPorFondo> ValidaFondo(int id)
        {
            try
            {
                var entities = await _db.PropuestaPorFondo.AsNoTracking()
                     .FirstOrDefaultAsync(e => e.PropuestaPorFondoId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(PropuestaPorFondo model)
        {
            try
            {
                //if(model.propuestasE!=null && model.propuestasE.Length > 0) 
                if(model.propuestasE.Length>0)
                {
                    foreach (var item in model.propuestasE)
                    {
                        model.PropuestaId = item;
                        _db.PropuestaPorFondo.Add(model);
                        await _db.SaveChangesAsync();
                    }
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(PropuestaPorFondo model)
        {
            try
            {
                var _model = await _db.PropuestaPorFondo.FirstOrDefaultAsync(e => e.PropuestaPorFondoId == model.PropuestaPorFondoId);
                if (_model != null)
                {
                    _db.Entry(_model).CurrentValues.SetValues(model);
                    await _db.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(PropuestaPorFondo model)
        {
            try
            {
                var _model = await _db.PropuestaPorFondo.FirstOrDefaultAsync(e => e.PropuestaPorFondoId == model.PropuestaPorFondoId);
                if (_model != null)
                {
                    _model.Estado = model.Estado;

                    await _db.SaveChangesAsync();
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
                var _model = await _db.PropuestaPorFondo.FirstOrDefaultAsync(e => e.PropuestaPorFondoId == id);
                if (_model != null)
                {
                    _db.PropuestaPorFondo.Remove(_model);
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
            _db.Dispose(); 
        }
    }
}
