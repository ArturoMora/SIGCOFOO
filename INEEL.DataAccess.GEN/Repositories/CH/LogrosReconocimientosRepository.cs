using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CH;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class LogrosReconocimientosRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        SIGCOCHContext _ctx;
        public LogrosReconocimientosRepository()
        {
            _ctx = new SIGCOCHContext();
        }

        public async Task<IEnumerable<LogrosReconocimientos>> GetForCV(string id)
        {
            try
            {
                var result = await _ctx.dbSetLogrosReconocimientos.Where(e => e.ClavePersona.Equals(id))
                    .Where(e => e.EstadoFlujoId == 3)
                                        .Include(e => e.EstadoFlujo)
                                        .Include(e => e.Adjunto)
                                        .AsNoTracking()
                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<LogrosReconocimientos>> GetByClavePersonaANDestadoFlujo(string clavePersona, int EstadoFlujo)
        {
            try
            {
                var result = await _ctx.dbSetLogrosReconocimientos.Where(e => e.ClavePersona.Equals(clavePersona) && e.EstadoFlujoId == EstadoFlujo)
                                        .AsNoTracking()
                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<LogrosReconocimientos>> GetByClave(string clave)
        {
            try
            {
                var result = await _ctx.dbSetLogrosReconocimientos.Where(e => e.ClavePersona.Equals(clave))
                                        .Include(e => e.EstadoFlujo)
                                        .Include(e => e.Adjunto)
                                        .AsNoTracking()
                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<LogrosReconocimientos>> GetByEstado()
        {
            try
            {
                var result = await _ctx.dbSetLogrosReconocimientos.Where(e => e.EstadoFlujoId == 2)
                                                        .Include(e => e.EstadoFlujo)
                                                        .Include(e => e.Adjunto)
                                                        .AsNoTracking()
                                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<LogrosReconocimientos> GetById(int id)
        {
            try
            {
                var result = await _ctx.dbSetLogrosReconocimientos.Where(e => e.LogrosReconocimientosId == id)
                                        .Include(e => e.EstadoFlujo)
                                        .Include(e => e.Adjunto)
                                        .AsNoTracking()
                                        .FirstOrDefaultAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(LogrosReconocimientos Obj)
        {
            try
            {
                _ctx.dbSetLogrosReconocimientos.Add(Obj);
                await _ctx.SaveChangesAsync();
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
                var result = await _ctx.dbSetLogrosReconocimientos.FirstOrDefaultAsync(e => e.LogrosReconocimientosId == id);
                if (result != null)
                {
                    _ctx.dbSetLogrosReconocimientos.Remove(result);
                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(LogrosReconocimientos Obj)// UpdateSolicitud
        {
            try
            {
                var result = await _ctx.dbSetLogrosReconocimientos.FirstOrDefaultAsync(e => e.LogrosReconocimientosId == Obj.LogrosReconocimientosId);
                if (result != null)
                {
                    _ctx.Entry(result).CurrentValues.SetValues(Obj);

                    await _ctx.SaveChangesAsync();


                    PersonasRepository prep = new PersonasRepository();
                    Personas p = await prep.GetByClave(Obj.ClavePersona);
                    p.ultimaActualizacion = DateTime.Now;
                    await prep.Update(p);
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(LogrosReconocimientos Obj)
        {
            try
            {
                var result = await _ctx.dbSetLogrosReconocimientos.FirstOrDefaultAsync(e => e.LogrosReconocimientosId == Obj.LogrosReconocimientosId);
                if (result != null)
                {
                    result.EstadoFlujoId = Obj.EstadoFlujoId;

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
