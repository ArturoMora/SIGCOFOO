using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.MT.Models.ITF.catalogos;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.MT.ITF
{
    public class CalificacionClienteRepository : IDisposable
    {
        //----------- AYUDA:
        // CalificacionClienteRepository: nombre de clase (y tipicamente el constructor)
        // MT_Context.- tu Contexto : DbContext
        // CalificacionCliente.- es el modelo
        // dbSetCAT_CalificacionCliente.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: dbSetCAT_CalificacionCliente =Categories                                  )
        // CalificacionClienteId.-  es el ID del modelo (ID de la tabla)


        private MT_Context _db;
        public CalificacionClienteRepository()
        {
            _db = new MT_Context();
        }

        //public async Task<IEnumerable<CalificacionCliente>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<CalificacionCliente>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetCAT_CalificacionCliente.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<CalificacionCliente> GetById(int id)
        {
            try
            {
                var entities = await _db.dbSetCAT_CalificacionCliente.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.CalificacionClienteId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(CalificacionCliente model)
        {
            try
            {

                _db.dbSetCAT_CalificacionCliente.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(CalificacionCliente model)
        {
            try
            {
                var _model = await _db.dbSetCAT_CalificacionCliente.FirstOrDefaultAsync(e => e.CalificacionClienteId == model.CalificacionClienteId);
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
        public async Task UpdateEstado(CalificacionCliente model)
        {
            try
            {
                var _model = await _db.dbSetCAT_CalificacionCliente.FirstOrDefaultAsync(e => e.CalificacionClienteId == model.CalificacionClienteId);
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
                var _model = await _db.dbSetCAT_CalificacionCliente.FirstOrDefaultAsync(e => e.CalificacionClienteId == id);
                if (_model != null)
                {
                    _db.dbSetCAT_CalificacionCliente.Remove(_model);
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
