using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class ProyectoPorFondoRepository : IDisposable
    {
        private CR_Context _db;
        public ProyectoPorFondoRepository()
        {
            _db = new CR_Context();
        }


        public async Task<IEnumerable<ProyectoPorFondo>> GetAll()
        {
            try
            {
                var entities = await _db.ProyectoPorFondo.AsNoTracking().Include(e =>e.FondoPrograma).Include(e =>e.Proyecto).ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<ProyectoPorFondo> Get(int id)
        {
            try
            {
                var entities = await _db.ProyectoPorFondo.AsNoTracking().Include(e => e.FondoPrograma).Include(e => e.Proyecto)
                    .FirstOrDefaultAsync(e => e.ProyectoPorFondoId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(ProyectoPorFondo model)
        {
            try
            {
                //if (model.proyectosE!=null && model.proyectosE.Length > 0)
                if(model.proyectosE.Length>0)
                {
                    foreach (var item in model.proyectosE)
                    {
                        model.ProyectoId = item;
                        _db.ProyectoPorFondo.Add(model);
                        await _db.SaveChangesAsync();
                    }
                }
                


            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(ProyectoPorFondo model)
        {
            try
            {
                var _model = await _db.ProyectoPorFondo.FirstOrDefaultAsync(e => e.ProyectoPorFondoId == model.ProyectoPorFondoId);
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

        public async Task Delete(int id)
        {
            try
            {
                var _model = await _db.ProyectoPorFondo.FirstOrDefaultAsync(e => e.ProyectoPorFondoId == id);
                if (_model != null)
                {
                    _db.ProyectoPorFondo.Remove(_model);
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
