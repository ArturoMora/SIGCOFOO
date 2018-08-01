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
    public class CapacitacionYcertificacionRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        SIGCOCHContext _ctx;
        public CapacitacionYcertificacionRepository()
        {
            _ctx = new SIGCOCHContext();
        }

        public async Task<IEnumerable<CapacitacionYcertificacion>> GetForCV(string id)
        {
            try
            {
                var result = await _ctx.dbSetCapacitacionYcertificacion.Where(e => e.ClavePersona.Equals(id))
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

        public async Task<IEnumerable<CapacitacionYcertificacion>> GetByClavePersonaANDestadoFlujo(string clavePersona, int EstadoFlujo)
        {
            try
            {
                var result = await _ctx.dbSetCapacitacionYcertificacion.Where(e => e.ClavePersona.Equals(clavePersona) && e.EstadoFlujoId== EstadoFlujo)
                                        .AsNoTracking()
                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<CapacitacionYcertificacion>> GetByClave(string clave)
        {
            try
            {
                var result = await _ctx.dbSetCapacitacionYcertificacion.Where(e => e.ClavePersona.Equals(clave))
                                        .Include(e => e.EstadoFlujo)
                                        .Include(e => e.Adjunto)
                                        .AsNoTracking()
                                        .ToListAsync();

                foreach (var item in result)
                {
                    if (item.EstadoFlujoId == 2)
                    {
                        item.EstadoFlujo.Descripcion += " Admin CH";
                    }
                }

                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<CapacitacionYcertificacion>> GetByEstado()
        {
            try
            {
                var result = await _ctx.dbSetCapacitacionYcertificacion.Where(e => e.EstadoFlujoId == 2)
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

        public async Task<CapacitacionYcertificacion> GetById(int id)
        {
            try
            {
                var result = await _ctx.dbSetCapacitacionYcertificacion.Where(e => e.CapacitacionYcertificacionId == id)
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

        public async Task Create(CapacitacionYcertificacion Obj)
        {
            try
            {
                _ctx.dbSetCapacitacionYcertificacion.Add(Obj);
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
                var result = await _ctx.dbSetCapacitacionYcertificacion.FirstOrDefaultAsync(e => e.CapacitacionYcertificacionId == id);
                if (result != null)
                {
                    _ctx.dbSetCapacitacionYcertificacion.Remove(result);
                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(CapacitacionYcertificacion Obj)// UpdateSolicitud
        {
            try
            {
                var result = await _ctx.dbSetCapacitacionYcertificacion.FirstOrDefaultAsync(e => e.CapacitacionYcertificacionId == Obj.CapacitacionYcertificacionId);
                if (result != null)
                {

                    if (Obj.Adjunto != null)
                    {
                        AdjuntoRepository _adjuntoRepo = new AdjuntoRepository();
                        //Elimar archivo
                        if (Obj.Adjunto.nombre == "eliminar")
                        {
                            int id = Convert.ToInt32(Obj.AdjuntoId);
                            result.AdjuntoId = null;
                            Obj.AdjuntoId = null;
                            await _ctx.SaveChangesAsync();
                            await _adjuntoRepo.Delete(id);
                        }
                        ///Agregar archivo al editar
                        if (Obj.Adjunto.AdjuntoId == 0)
                        {
                            if (result.AdjuntoId != null)
                            {
                                var id = result.AdjuntoId;
                                result.AdjuntoId = null;
                                await _ctx.SaveChangesAsync();

                                await _adjuntoRepo.Delete(id);
                            }
                            Adjunto key = await _adjuntoRepo.CreateAd(Obj.Adjunto);
                            Obj.AdjuntoId = key.AdjuntoId;
                            
                        }
                    }

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

        public async Task UpdateEstado(CapacitacionYcertificacion Obj)
        {
            try
            {
                var result = await _ctx.dbSetCapacitacionYcertificacion.FirstOrDefaultAsync(e => e.CapacitacionYcertificacionId == Obj.CapacitacionYcertificacionId);
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
