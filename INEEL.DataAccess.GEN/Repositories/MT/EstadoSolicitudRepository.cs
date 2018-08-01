using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.MT.Models.ITF.catalogos;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Threading.Tasks;

namespace INEEL.DataAccess.MT.Models
{
    public class EstadoSolicitudRepository : IDisposable
    {
        //----------- AYUDA:
        // EstadoSolicitudRepository: nombre de clase (y tipicamente el constructor)
        // MT_Context.- tu Contexto : DbContext
        // EstadoSolicitud.- es el modelo
        // dbSetCAT_EstadoSolicitud.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: dbSetCAT_EstadoSolicitud =Categories                                  )
        // EstadoSolicitudId.-  es el ID del modelo (ID de la tabla)


        private MT_Context _db;
        public EstadoSolicitudRepository()
        {
            _db = new MT_Context();
        }

        //public async Task<IEnumerable<EstadoSolicitud>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<EstadoSolicitud>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetCAT_EstadoSolicitud.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<EstadoSolicitud> Get(int id)
        {
            try
            {
                var entities = await _db.dbSetCAT_EstadoSolicitud.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.EstadoSolicitudId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(EstadoSolicitud model)
        {
            try
            {

                _db.dbSetCAT_EstadoSolicitud.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(EstadoSolicitud model)
        {
            try
            {
                var _model = await _db.dbSetCAT_EstadoSolicitud.FirstOrDefaultAsync(e => e.EstadoSolicitudId == model.EstadoSolicitudId);
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

        public async Task UpdateEstado(EstadoSolicitud model)
        {
            try
            {
                var _model = await _db.dbSetCAT_EstadoSolicitud.FirstOrDefaultAsync(e => e.EstadoSolicitudId == model.EstadoSolicitudId);
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
                var _model = await _db.dbSetCAT_EstadoSolicitud.FirstOrDefaultAsync(e => e.EstadoSolicitudId == id);
                if (_model != null)
                {
                    _db.dbSetCAT_EstadoSolicitud.Remove(_model);
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
