using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class ExperienciaExternaRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        SIGCOCHContext _ctx;
        public ExperienciaExternaRepository()
        {
            _ctx = new SIGCOCHContext();
        }
        public ExperienciaExternaRepository(SIGCOCHContext context)
        {
            _ctx = context;
        }


        public async Task<IEnumerable<ExperienciaExterna>> GetForCV(string id)
        {
            try
            {
                var result = await _ctx.ExperienciaExterna.Where(e => e.ClavePersona.Equals(id))
                    .Where(e=>e.EstadoFlujoId==3)
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

        public async Task<IEnumerable<ExperienciaExterna>> GetByClave(string clave)
        {
            try
            {
                var result = await _ctx.ExperienciaExterna.Where(e => e.ClavePersona.Equals(clave))
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

        public async Task<IEnumerable<ExperienciaExterna>> GetByEstado()
        {
            try
            {
                var result = await _ctx.ExperienciaExterna.Where(e => e.EstadoFlujoId == 2)
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

        public async Task<ExperienciaExterna> GetById(int id)
        {
            try
            {
                var result = await _ctx.ExperienciaExterna.Where(e => e.ExperienciaExternaId == id)
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

        public async Task Create(ExperienciaExterna Obj)
        {
            try
            {
                _ctx.ExperienciaExterna.Add(Obj);
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
                var result = await _ctx.ExperienciaExterna.FirstOrDefaultAsync(e => e.ExperienciaExternaId == id);
                if (result != null)
                {
                    _ctx.ExperienciaExterna.Remove(result);
                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        

        public async Task Update(ExperienciaExterna Obj)// UpdateSolicitud
        {
            try
            {
                var result = await _ctx.ExperienciaExterna.FirstOrDefaultAsync(e => e.ExperienciaExternaId == Obj.ExperienciaExternaId);
                if (result != null)
                {
                    if (Obj.Adjunto != null)
                    {
                        //Eliminar archivo
                        if (Obj.Adjunto.nombre == "eliminar")
                        {
                            int id = Convert.ToInt32(Obj.Adjunto.AdjuntoId);
                            result.AdjuntoId = null;
                            Obj.AdjuntoId = null;
                            await _ctx.SaveChangesAsync();

                            await new AdjuntoRepository().Delete(id);
                            
                        }
                        ///Agregar archivo al editar
                        if (Obj.Adjunto.AdjuntoId == 0)
                        {
                            if (result.AdjuntoId != null)
                            {
                                var id = result.AdjuntoId;
                                result.AdjuntoId = null;
                                await _ctx.SaveChangesAsync();

                                await new AdjuntoRepository().Delete(id);
                            }
                            Adjunto key = await new AdjuntoRepository().CreateAd(Obj.Adjunto);
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

        public async Task UpdateEstado(ExperienciaExterna Obj)
        {
            try
            {
                var result = await _ctx.ExperienciaExterna.FirstOrDefaultAsync(e => e.ExperienciaExternaId == Obj.ExperienciaExternaId);
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
