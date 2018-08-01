using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CR;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class TipoEventosRepository : IDisposable { public void Dispose(){_db.Dispose();}
        CR_Context _db;

        public TipoEventosRepository()
        {
            _db = new CR_Context();
        }


        public async Task<IEnumerable<TipoEventoON>> getAll()
        {
            try
            {
                var _tipoEventos = await _db.TiposEventos.AsNoTracking().ToListAsync();//Dispose();

                return _tipoEventos;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<TipoEventoON> getById(int Id)
        {
            try
            {
                var _tipoEvento = await _db.TiposEventos
                    .AsNoTracking()
                    .FirstOrDefaultAsync(t => t.TipoEventoONId == Id);//Dispose();

                return _tipoEvento;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task create(TipoEventoON tipoEvento)
        {
            try
            {
                _db.TiposEventos.Add(tipoEvento);
                await _db.SaveChangesAsync();//Dispose();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task update(TipoEventoON tipoEvento)
        {
            try
            {
                var _tipoEvento = await _db.TiposEventos
                    .FirstOrDefaultAsync(t => t.TipoEventoONId == tipoEvento.TipoEventoONId);

                if(_tipoEvento != null)
                {
                    _db.Entry(_tipoEvento).CurrentValues.SetValues(tipoEvento);
                    await _db.SaveChangesAsync();//Dispose();
                }
                else
                {//Dispose();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task deleteLogic(TipoEventoON tipoEvento)
        {
            try
            {
                var _tipoEvento = await _db.TiposEventos
                   .FirstOrDefaultAsync(t => t.TipoEventoONId == tipoEvento.TipoEventoONId);

                if (_tipoEvento != null)
                {
                    _db.Entry(_tipoEvento).CurrentValues.SetValues(tipoEvento);
                    await _db.SaveChangesAsync();//Dispose();
                }
                else
                {//Dispose();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


    }
}
