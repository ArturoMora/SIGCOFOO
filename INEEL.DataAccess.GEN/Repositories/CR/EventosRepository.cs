using INEEL.DataAccess.CR.Models;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CR;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class EventosRepository : IDisposable { public void Dispose(){_db.Dispose();}
        CR_Context _db;

        public EventosRepository()
        {
            _db = new CR_Context();
        }


        public async Task<IEnumerable<TipoEventoON>> getTipoEventos()
        {
            try
            {
                var _tipoEventos = await _db.TiposEventos
                    .AsNoTracking()
                    .Where(t => t.Estado == true).ToListAsync();
               //Dispose();

                return _tipoEventos;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Eventos>> getAll()
        {
            try
            {
                var _eventos = await _db.Eventos
                    .AsNoTracking()
                    .Include(t => t.TipoEvento)
                    .ToListAsync();
               //Dispose();

                return _eventos;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Eventos> getById(int Id)
        {
            try
            {
                var _evento = await _db.Eventos
                    .Include(t => t.TipoEvento)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(t => t.EventoId == Id);
               //Dispose();

                return _evento;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task create(Eventos evento)
        {
            try
            {
                _db.Eventos.Add(evento);
                await _db.SaveChangesAsync();
               //Dispose();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task update(Eventos evento)
        {
            try
            {
                var _evento = await _db.Eventos
                    .FirstOrDefaultAsync(t => t.EventoId == evento.EventoId);

                if (_evento != null)
                {
                    _db.Entry(_evento).CurrentValues.SetValues(evento);
                    await _db.SaveChangesAsync();
                   //Dispose();
                }
                else
                {
                   //Dispose();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task delete(int Id)
        {
            try
            {
                var _evento = await _db.Eventos
                    .FirstOrDefaultAsync(t => t.EventoId == Id);
                if (_evento != null)
                {
                    _db.Eventos.Remove(_evento);
                    await _db.SaveChangesAsync();
                   //Dispose();
                }
                else
                {
                   //Dispose();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(Eventos model)
        {
            try
            {
                var _model = await _db.Eventos.FirstOrDefaultAsync(e => e.EventoId == model.EventoId);
                if (model != null)
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


        public async Task deleteLogic(Eventos evento)
        {
            try
            {
                var _evento = await _db.Eventos
                   .FirstOrDefaultAsync(e=>e.EventoId == evento.EventoId);

                if (_evento != null)
                {
                    _db.Entry(_evento).CurrentValues.SetValues(evento);
                    await _db.SaveChangesAsync();
                   //Dispose();
                }
                else
                {
                   //Dispose();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
    }
}
