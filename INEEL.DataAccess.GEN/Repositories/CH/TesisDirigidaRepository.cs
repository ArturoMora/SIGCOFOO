using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CH.Models;
using System.Data.Entity;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class TesisDirigidaRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        SIGCOCHContext _ctx;
        public TesisDirigidaRepository()
        {
            _ctx = new SIGCOCHContext();
        }
        public TesisDirigidaRepository(SIGCOCHContext context)
        {
            _ctx = context;
        }

        public async Task<IEnumerable<TesisDirigida>> GetForCV(string id)
        {
            try
            {
                var result = await _ctx.TesisDirigida.Where(e => e.ClavePersona.Equals(id))
                    .Where(e => e.EstadoFlujoId == 3)
                                        .Include(e => e.EstadoFlujo)
                                        .Include(e => e.GradoAcademico)
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

        public async Task<IEnumerable<TesisDirigida>> GetByClave(string clave)
        {
            try
            {
                var result = await _ctx.TesisDirigida.Where(e => e.ClavePersona.Equals(clave))
                                        .Include(e => e.EstadoFlujo)
                                        .Include(e => e.GradoAcademico)
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

        public async Task<IEnumerable<TesisDirigida>> GetByEstado()
        {
            try
            {
                var result = await _ctx.TesisDirigida.Where(e => e.EstadoFlujoId == 2)
                                                        .Include(e => e.EstadoFlujo)
                                                        .Include(e => e.GradoAcademico)
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

        public async Task<TesisDirigida> GetById(int id)
        {
            try
            {
                var result = await _ctx.TesisDirigida.Where(e => e.TesisDirigidaId == id)
                                        .Include(e => e.EstadoFlujo)
                                        .Include(e => e.GradoAcademico)
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

        public async Task Create(TesisDirigida TD)
        {
            try
            {
                _ctx.TesisDirigida.Add(TD);
                await _ctx.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<int> CreateByBecarioDirigido(TesisDirigida TD)
        {
            try
            {
                TesisDirigida obj = _ctx.TesisDirigida.Add(TD);
                await _ctx.SaveChangesAsync();
                return obj.TesisDirigidaId;
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
                var result = await _ctx.TesisDirigida.FirstOrDefaultAsync(e => e.TesisDirigidaId == id);
                if (result != null)
                {
                    if (result.BecarioDirigidoId!=null)
                    {
                        var resultB = await _ctx.BecarioDirigido.FirstOrDefaultAsync(e => e.BecarioDirigidoId == result.BecarioDirigidoId);
                        _ctx.BecarioDirigido.Remove(resultB);
                        await _ctx.SaveChangesAsync();
                    }
                    _ctx.TesisDirigida.Remove(result);
                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(TesisDirigida TD)// UpdateSolicitud
        {
            try
            {
                if (TD.EstadoFlujoId == 1 && TD.BecarioDirigidoId != null)
                {
                        var becario = await _ctx.BecarioDirigido.FirstOrDefaultAsync(e => e.BecarioDirigidoId == TD.BecarioDirigidoId);
                        if (becario != null)
                        {
                        becario.EstadoFlujoId = 2;
                            await _ctx.SaveChangesAsync();
                        }
                }
                if(TD.EstadoFlujoId==3 && TD.BecarioDirigidoId != null)
                {
                    var becario = await _ctx.BecarioDirigido.FirstOrDefaultAsync(e => e.BecarioDirigidoId == TD.BecarioDirigidoId);
                    if (becario != null)
                    {
                        becario.EstadoFlujoId = 3;
                        becario.AdjuntoId = TD.AdjuntoId;
                        becario.NombreBecario = TD.Autor;
                        becario.TesisDirigidaId = TD.TesisDirigidaId;
                        becario.ClavePersona = TD.ClavePersona;
                        becario.FechaInicio = TD.FechaInicio;
                        becario.FechaTermino = TD.FechaTermino;
                        //becario.FechaTermino = TD.FechaTermino;
                        becario.TipoBecaId = TD.GradoAcademicoId;
                        becario.NombreEstancia = TD.Titulo;
                        becario.FechaValidacion = TD.FechaValidacion;
                        await _ctx.SaveChangesAsync();
                    }
                }

                ////Agregar a OC
                if (TD.EstadoFlujoId==3)
                {
                    await new NuevoOCRepository().Create(
                           new NuevoOC("CH",
                                      "TesisDirigida",
                           TD.Titulo,
                           "IndexCH.html#/detallestesisdirigida/" + TD.TesisDirigidaId+"/",
                           TD.TesisDirigidaId+""
                           ));
                }
                /////////////////

                var result = await _ctx.TesisDirigida.FirstOrDefaultAsync(e => e.TesisDirigidaId == TD.TesisDirigidaId);
                if (TD.EstadoFlujoId == 1 && result.EstadoFlujoId == 3)
                {
                    await new NuevoOCRepository().DeleteId("TesisDirigida", TD.TesisDirigidaId + "");
                }
                if (result != null)
                {
                    if (TD.Adjunto != null)
                    {
                        //Eliminar archivo
                        AdjuntoRepository adjuntoRepo = new AdjuntoRepository();
                        if (TD.Adjunto.nombre == "eliminar")
                        {
                            int id = Convert.ToInt32(TD.Adjunto.AdjuntoId);
                            result.AdjuntoId = null;
                            await _ctx.SaveChangesAsync();
                            await adjuntoRepo.Delete(id);
                        }
                        ///Agregar archivo al editar
                        if (TD.Adjunto.AdjuntoId == 0)
                        {
                            if (result.AdjuntoId!=null)
                            {
                                var id = result.AdjuntoId;
                                result.AdjuntoId = null;
                                await _ctx.SaveChangesAsync();
                                await adjuntoRepo.Delete(id);
                            }
                            Adjunto key = await adjuntoRepo.CreateAd(TD.Adjunto);
                            TD.AdjuntoId = key.AdjuntoId;
                            TD.Adjunto.AdjuntoId = key.AdjuntoId;
                            
                        }
                    }
                    _ctx.Entry(result).CurrentValues.SetValues(TD);

                    await _ctx.SaveChangesAsync();
                }

                PersonasRepository prep = new PersonasRepository();
                Personas p = await prep.GetByClave(TD.ClavePersona);
                p.ultimaActualizacion = DateTime.Now;
                await prep.Update(p);

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(TesisDirigida TD)
        {
            try
            {
                var result = await _ctx.TesisDirigida.FirstOrDefaultAsync(e => e.TesisDirigidaId == TD.TesisDirigidaId);
                if (result != null)
                {
                    result.EstadoFlujoId = TD.EstadoFlujoId;

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        internal async Task Delete(int? tesisDirigidaId)
        {
            try
            {
                var result = await _ctx.TesisDirigida.FirstOrDefaultAsync(e => e.TesisDirigidaId == tesisDirigidaId);
                if (result != null)
                {
                    _ctx.TesisDirigida.Remove(result);
                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        internal async Task UpdateEstadoByBecario(int? id, int estado)
        {
            try
            {
                var result = await _ctx.TesisDirigida.FirstOrDefaultAsync(e => e.TesisDirigidaId == id);
                if (result != null)
                {
                    result.EstadoFlujoId = estado;

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        internal async Task UpdateByBecario(BecarioDirigido Obj, int estado)
        {
            try
            {
                var td = await _ctx.TesisDirigida.FirstOrDefaultAsync(e => e.TesisDirigidaId == Obj.TesisDirigidaId);
                if (td != null)
                {
                    td.EstadoFlujoId = estado;
                    td.AdjuntoId = Obj.AdjuntoId;
                    td.Autor = Obj.NombreBecario;
                    td.BecarioDirigidoId = Obj.BecarioDirigidoId;
                    td.ClavePersona = Obj.ClavePersona;
                    td.EstadoFlujoId = 3;
                    td.FechaInicio = Obj.FechaInicio;
                    td.FechaTermino = Obj.FechaTermino;
                    td.GradoAcademicoId = Obj.TipoBecaId;
                    td.Titulo = Obj.NombreEstancia;
                    td.FechaValidacion = Obj.FechaValidacion;
                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Valida que no existan registros de tesis dirigidas
        /// </summary>
        /// <param name="model"><TesisDirigida>model</param>
        /// <returns>Boolean</returns>
        public async Task<Boolean> ValidarDuplicados(TesisDirigida model)
        {
            try
            {
                var registros = await _ctx.TesisDirigida.Where(e => e.ClavePersona == model.ClavePersona 
                         && e.GradoAcademicoId == model.GradoAcademicoId
                         && DbFunctions.TruncateTime(e.FechaInicio) == DbFunctions.TruncateTime(model.FechaInicio)
                         && DbFunctions.TruncateTime(e.FechaTermino) == DbFunctions.TruncateTime(model.FechaTermino)
                         && e.TesisDirigidaId!=model.TesisDirigidaId).AsNoTracking().CountAsync();
                if (registros > 0)
                {
                    return true;
                }
                return false;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

    }
}
