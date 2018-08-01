using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories
{
    public class MovimientoCategoriaRepository : IDisposable
    {

        private GEN_Context _db;
        public MovimientoCategoriaRepository()
        {
            _db = new GEN_Context();
        }

        //public async Task<IEnumerable<MovimientoCategoria>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<MovimientoCategoria>> GetAll()
        {
            try
            {
                var entities = await _db.bdSetMovimientoCategoria.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<MovimientoCategoria>> GetAllByClaveEmpleado(String claveEmpleado)
        {
            try
            {
                var entities = await _db.bdSetMovimientoCategoria.AsNoTracking()
                    .Where(x => x.ClavePersona.Equals(claveEmpleado))
                    .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<MovimientoCategoria> Get(int id)
        {
            try
            {
                var entities = await _db.bdSetMovimientoCategoria.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.Id == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(MovimientoCategoria model)
        {
            try
            {

                _db.bdSetMovimientoCategoria.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(MovimientoCategoria model)
        {
            try
            {
                var _model = await _db.bdSetMovimientoCategoria.FirstOrDefaultAsync(e => e.Id == model.Id);
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
                var _model = await _db.bdSetMovimientoCategoria.FirstOrDefaultAsync(e => e.Id == id);
                if (_model != null)
                {
                    _db.bdSetMovimientoCategoria.Remove(_model);
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
