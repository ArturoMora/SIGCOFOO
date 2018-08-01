using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CH;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class CertificacionesObtenidasRepository : IDisposable { public void Dispose(){_ctx.Dispose();}

        SIGCOCHContext _ctx;
        public CertificacionesObtenidasRepository()
        {
            _ctx = new SIGCOCHContext();
        }

        public async Task<IEnumerable<CertificacionesObtenidas>> GetForCV(string id)
        {
            try
            {
                var result = await _ctx.CertificacionesObtenidas.Where(e => e.ClavePersona.Equals(id))
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
        public async Task<IEnumerable<CertificacionesObtenidas>> GetByClavePersonaANDestadoFlujo(string clave, int estado)
        {
            try
            {
                var result = await _ctx.CertificacionesObtenidas.Where(e => e.ClavePersona.Equals(clave) && e.EstadoFlujoId==estado)                                         
                                        .AsNoTracking()
                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<CertificacionesObtenidas>> GetByClave(string clave)
        {
            try
            {
                var result = await _ctx.CertificacionesObtenidas.Where(e => e.ClavePersona.Equals(clave))
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

        public async Task<IEnumerable<CertificacionesObtenidas>> GetByEstado()
        {
            try
            {
                var result = await _ctx.CertificacionesObtenidas.Where(e => e.EstadoFlujoId == 2)
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

        public async Task<CertificacionesObtenidas> GetById(int id)
        {
            try
            {
                var result = await _ctx.CertificacionesObtenidas.Where(e => e.CertificacionesObtenidasId == id)
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

        public async Task Create(CertificacionesObtenidas Obj)
        {
            try
            {
                _ctx.CertificacionesObtenidas.Add(Obj);
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
                var result = await _ctx.CertificacionesObtenidas.FirstOrDefaultAsync(e => e.CertificacionesObtenidasId == id);
                if (result != null)
                {
                    _ctx.CertificacionesObtenidas.Remove(result);
                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(CertificacionesObtenidas Obj)// UpdateSolicitud
        {
            try
            {
                var result = await _ctx.CertificacionesObtenidas.FirstOrDefaultAsync(e => e.CertificacionesObtenidasId == Obj.CertificacionesObtenidasId);
                if (result != null)
                {

                    if (Obj.Adjunto != null)
                    {
                        AdjuntoRepository _adjuntoRepo = new AdjuntoRepository();
                        //Elimar archivo
                        if (Obj.Adjunto.nombre == "eliminar")
                        {
                            int id = Convert.ToInt32(Obj.Adjunto.AdjuntoId);
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

        public async Task UpdateEstado(CertificacionesObtenidas Obj)
        {
            try
            {
                var result = await _ctx.CertificacionesObtenidas.FirstOrDefaultAsync(e => e.CertificacionesObtenidasId == Obj.CertificacionesObtenidasId);
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
