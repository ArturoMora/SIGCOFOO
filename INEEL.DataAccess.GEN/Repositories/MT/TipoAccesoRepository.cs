using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.MT.Models.ITF;
using INEEL.DataAccess.GEN.Models.MT.ITF;
using System.Linq;
using INEEL.DataAccess.MT.Models.ITF.catalogos;

namespace INEEL.DataAccess.GEN.Repositories.MT.ITF
{
    public class TipoAccesoRepository : IDisposable
    {


        private MT_Context _db;
        public TipoAccesoRepository()
        {
            _db = new MT_Context();
        }
        public TipoAccesoRepository(MT_Context db)
        {
            _db = db;
        }

        //public async Task<IEnumerable<TipoAcceso>> OtrosMetodos(){ ... }
        
            public async Task<IEnumerable<TipoAcceso>> GetAllByEstado(Boolean estado)
        {
            try
            {
                var entities = await _db.dbSetCAT_TipoAcceso.AsNoTracking()
                    .Where(x=>x.EstadoDisponible== estado)
                    .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<TipoAcceso>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetCAT_TipoAcceso.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<TipoAcceso> Get(int id)
        {
            try
            {
                var entities = await _db.dbSetCAT_TipoAcceso.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.TipoAccesoId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(TipoAcceso model)
        {
            try
            {

                _db.dbSetCAT_TipoAcceso.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(TipoAcceso model)
        {
            try
            {
                var _model = await _db.dbSetCAT_TipoAcceso.FirstOrDefaultAsync(e => e.TipoAccesoId == model.TipoAccesoId);
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
                var _model = await _db.dbSetCAT_TipoAcceso.FirstOrDefaultAsync(e => e.TipoAccesoId == id);
                if (_model != null)
                {
                    _db.dbSetCAT_TipoAcceso.Remove(_model);
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
