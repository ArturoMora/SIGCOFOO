using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Contexts;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class EventoRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        SIGCOCHContext _ctx;
        public EventoRepository()
        {
            _ctx = new SIGCOCHContext();
        }

        //Obtener todos los eventos
        public async Task<IEnumerable<Evento>> GetAll()
        {
            try
            {
                var Eventos = await _ctx.Evento.Where(e=>e.Estado==1).AsNoTracking().ToListAsync();
                return Eventos;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<Evento>> GetAllAdmin()
        {
            try
            {
                var Eventos = await _ctx.Evento.AsNoTracking().ToListAsync();
                return Eventos;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        //Obtener evento por Id
        public async Task<Evento> GetById(int EventoId)
        {
            try
            {
                var Evento = await _ctx.Evento.Where(e => e.EventoId == EventoId).AsNoTracking().FirstOrDefaultAsync();
                return Evento;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Crear evento
        public async Task Create(Evento Evento)
        {
            try
            {
                _ctx.Evento.Add(Evento);
                await _ctx.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Actualizar evento
        public async Task Update(Evento Evento)
        {
            try
            {
                var _Evento = await _ctx.Evento.FirstOrDefaultAsync(e => e.EventoId == Evento.EventoId);
                if (_Evento != null)
                {
                    _Evento.Descripcion = Evento.Descripcion;
                    _Evento.DescripcionCorta = Evento.DescripcionCorta;

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Actualizar evento
        public async Task UpdateEstado(Evento Evento)
        {
            try
            {
                var _Evento = await _ctx.Evento.FirstOrDefaultAsync(e => e.EventoId == Evento.EventoId);
                if (_Evento != null)
                {
                    _Evento.Estado = Evento.Estado;


                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Eliminar evento
        public async Task Delete(int EventoId)
        {
            try
            {
                var _Evento = await _ctx.Evento.FirstOrDefaultAsync(e => e.EventoId == EventoId);
                if (_Evento != null)
                {
                    _ctx.Evento.Remove(_Evento);
                    await _ctx.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
    }
}
