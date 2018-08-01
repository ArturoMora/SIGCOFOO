using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.MT.Models.ITF.catalogos;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.MT.ITF
{
    public class TipoSoftwareRepository : IDisposable
    {
        //----------- AYUDA:
        // TipoSoftwareRepository: nombre de clase (y tipicamente el constructor)
        // MT_Context.- tu Contexto : DbContext
        // TipoSoftware.- es el modelo
        // dbSetCAT_TipoSoftware.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: dbSetCAT_TipoSoftware =Categories                                  )
        // TipoSoftwareId.-  es el ID del modelo (ID de la tabla)


        private MT_Context _db;
        public TipoSoftwareRepository()
        {
            _db = new MT_Context();
        }

        //public async Task<IEnumerable<TipoSoftware>> OtrosMetodos(){ ... }
        
        public async Task<IEnumerable<TipoSoftware>> getAllOrder()
        {
            try
            {
                var entities = await _db.dbSetCAT_TipoSoftware.AsNoTracking()
                    .OrderBy(x=>x.Nombre)
                    .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<TipoSoftware>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetCAT_TipoSoftware.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<TipoSoftware> Get(int id)
        {
            try
            {
                var entities = await _db.dbSetCAT_TipoSoftware.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.TipoSoftwareId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(TipoSoftware model)
        {
            try
            {

                _db.dbSetCAT_TipoSoftware.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(TipoSoftware model)
        {
            try
            {
                var _model = await _db.dbSetCAT_TipoSoftware.FirstOrDefaultAsync(e => e.TipoSoftwareId == model.TipoSoftwareId);
                if (_model != null)
                {
                    _model.Nombre = model.Nombre;
                    _model.Descripcion = model.Descripcion;
                    await _db.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(TipoSoftware model)
        {
            try
            {
                var _model = await _db.dbSetCAT_TipoSoftware.FirstOrDefaultAsync(e => e.TipoSoftwareId == model.TipoSoftwareId);
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
                var _model = await _db.dbSetCAT_TipoSoftware.FirstOrDefaultAsync(e => e.TipoSoftwareId == id);
                if (_model != null)
                {
                    _db.dbSetCAT_TipoSoftware.Remove(_model);
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
