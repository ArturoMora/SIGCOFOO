using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.MT.Models.ITF.catalogos;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.MT.ITF
{
    public class CalificacionPersonalRepository : IDisposable
    {
        //----------- AYUDA:
        // CalificacionPersonalRepository: nombre de clase (y tipicamente el constructor)
        // MT_Context.- tu Contexto : DbContext
        // CalificacionPersonal.- es el modelo
        // dbSetCAT_CalificacionPersonal.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: dbSetCAT_CalificacionPersonal =Categories                                  )
        // CalificacionPersonalId.-  es el ID del modelo (ID de la tabla)


        private MT_Context _db;
        public CalificacionPersonalRepository()
        {
            _db = new MT_Context();
        }

        //public async Task<IEnumerable<CalificacionPersonal>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<CalificacionPersonal>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetCAT_CalificacionPersonal.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<CalificacionPersonal> Get(int id)
        {
            try
            {
                var entities = await _db.dbSetCAT_CalificacionPersonal.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.CalificacionPersonalId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(CalificacionPersonal model)
        {
            try
            {

                _db.dbSetCAT_CalificacionPersonal.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(CalificacionPersonal model)
        {
            try
            {
                var _model = await _db.dbSetCAT_CalificacionPersonal.FirstOrDefaultAsync(e => e.CalificacionPersonalId == model.CalificacionPersonalId);
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
        public async Task UpdateEstado(CalificacionPersonal model)
        {
            try
            {
                var _model = await _db.dbSetCAT_CalificacionPersonal.FirstOrDefaultAsync(e => e.CalificacionPersonalId == model.CalificacionPersonalId);
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
                var _model = await _db.dbSetCAT_CalificacionPersonal.FirstOrDefaultAsync(e => e.CalificacionPersonalId == id);
                if (_model != null)
                {
                    _db.dbSetCAT_CalificacionPersonal.Remove(_model);
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
