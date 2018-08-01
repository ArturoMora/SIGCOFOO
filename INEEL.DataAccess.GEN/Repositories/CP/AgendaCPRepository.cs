using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CP;
using System.Linq.Dynamic;
using System.Linq;

namespace INEEL.DataAccess.GEN.Repositories.CP
{
    public class AgendaCPRepository : IDisposable
    {

        /// <summary>
        /// contexto para la conexión de CP 
        /// </summary>
        private CP_Context _db;
        public AgendaCPRepository()
        {
            _db = new CP_Context();
        }


        public async Task<Object[]> GetAll()
        {
            try
            {
                var entities = await _db.DbSetAgenda.AsNoTracking().ToListAsync();
                Object[] lista = new Object[entities.Count];
                foreach (var obj in entities)
                {
                    lista[entities.IndexOf(obj)] = new
                    {
                        asunto = obj.Asunto,
                        lugar = obj.Lugar,
                        notificado = obj.NotificacionEnviada,
                        agendaId = obj.AgendaId,
                        comunidadId = obj.idComunidad,
                        fecha = obj.FechaReunion,
                        hora = obj.HoraReunion,
                        estado = obj.Estado,
                    };
                }
                return lista;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Object[]> GetByComunidad(int id)
        {
            try
            {
                var entities = await _db.DbSetAgenda
                    .Where (e => e.idComunidad == id && e.FechaReunion >= DateTime.Now).OrderBy(e=>e.FechaReunion)
                    .AsNoTracking()
                    .ToListAsync();

                Object[] lista = new Object[entities.Count];
                foreach (var obj in entities)
                {
                    lista[entities.IndexOf(obj)] = new
                    {
                        Asunto = obj.Asunto,
                        Lugar = obj.Lugar,
                        NotificacionEnviada = obj.NotificacionEnviada,
                        AgendaId = obj.AgendaId,
                        idComunidad = obj.idComunidad,
                        FechaReunion = obj.FechaReunion,
                        HoraReunion = obj.HoraReunion,
                        FechaRegistro = obj.FechaRegistro,
                        Estado = obj.Estado,
                        Autor = obj.Autor
                    };
                }
                return lista;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<Object> GetById(int id)
        {
            try
            {
                var obj = await _db.DbSetAgenda.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.AgendaId == id);
                Object lista = new Object();
                lista = new
                {
                    asunto = obj.Asunto,
                    lugar = obj.Lugar,
                    notificado = obj.NotificacionEnviada,
                    agendaId = obj.AgendaId,
                    comunidadId = obj.idComunidad,
                    fecha = obj.FechaReunion,
                    hora = obj.HoraReunion,
                    estado = obj.Estado,
                };

                return lista;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
                
        public async Task Create(Agenda model)
        {
            try
            {

                _db.DbSetAgenda.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Agenda> RegistraYRecuperaObjeto(Agenda model)
        {
            try
            {

                var obj =  _db.DbSetAgenda.Add(model);
                await _db.SaveChangesAsync();
                return obj;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(Agenda model)
        {
            try
            {
                var _model = await _db.DbSetAgenda.FirstOrDefaultAsync(e => e.AgendaId == model.AgendaId);
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

        public async Task UpdateEstado(Agenda model)
        {
            try
            {
                var _model = await _db.DbSetAgenda.FirstOrDefaultAsync(e => e.AgendaId== model.AgendaId);
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
                var _model = await _db.DbSetAgenda.FirstOrDefaultAsync(e => e.AgendaId == id);
                if (_model != null)
                {
                    _db.DbSetAgenda.Remove(_model);
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
