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
    public class ExperienciaDocenteRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        SIGCOCHContext _ctx;
        public ExperienciaDocenteRepository()
        {
            _ctx = new SIGCOCHContext();
        }
        public ExperienciaDocenteRepository(SIGCOCHContext context)
        {
            _ctx = context;
        }

        public async Task<IEnumerable<ExperienciaDocente>> GetByClaveEmpEstadoFlujo(string clave, /*DateTime yearsBack,*/ List<int> estados)
        {
            try
            {
                var result = await _ctx.ExperienciaDocente.Where(e => e.ClavePersona.Equals(clave) && estados.Contains(e.EstadoFlujoId) /*&& e.FechaInicio > yearsBack*/)
                                         .Include(e => e.EstadoFlujo)
                                        .Include(e => e.GradoAcademico)
                                        .Include(e => e.Institucion)
                                        .Include(e => e.Adjunto)
                                        .OrderByDescending(e => e.FechaInicio)
                                        .AsNoTracking()
                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<ExperienciaDocente>> GetForCV(string id)
        {
            try
            {
                var result = await _ctx.ExperienciaDocente.Where(e => e.ClavePersona.Equals(id))
                    .Where(e => e.EstadoFlujoId == 3)
                                        .Include(e => e.EstadoFlujo)
                                        .Include(e => e.GradoAcademico)
                                        .Include(e => e.Institucion)
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
        
        
        public async Task<IEnumerable<ExperienciaDocente>> GetByClave(string clave)
        {
            try
            {
                var result = await _ctx.ExperienciaDocente.Where(e => e.ClavePersona.Equals(clave))
                                         .Include(e => e.EstadoFlujo)
                                        .Include(e => e.GradoAcademico)
                                        .Include(e => e.Institucion)
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

        public async Task<IEnumerable<ExperienciaDocente>> GetByEstado()
        {
            try
            {
                var result = await _ctx.ExperienciaDocente.Where(e => e.EstadoFlujoId == 2)
                                                        .Include(e => e.EstadoFlujo)
                                                        .Include(e => e.GradoAcademico)
                                                        .Include(e => e.Institucion)
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

        public async Task<ExperienciaDocente> GetById(int id)
        {
            try
            {
                var result = await _ctx.ExperienciaDocente.Where(e => e.ExperienciaDocenteId == id)
                                        .Include(e => e.EstadoFlujo)
                                        .Include(e => e.GradoAcademico)
                                        .Include(e => e.Institucion)
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

        public async Task Create(ExperienciaDocente Obj)
        {
            try
            {
                _ctx.ExperienciaDocente.Add(Obj);
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
                var result = await _ctx.ExperienciaDocente.FirstOrDefaultAsync(e => e.ExperienciaDocenteId == id);
                if (result != null)
                {
                    _ctx.ExperienciaDocente.Remove(result);
                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(ExperienciaDocente Obj)// UpdateSolicitud
        {
            try
            {
                var result = await _ctx.ExperienciaDocente.FirstOrDefaultAsync(e => e.ExperienciaDocenteId == Obj.ExperienciaDocenteId);
                if (result != null)
                {

                    if (Obj.Adjunto != null)
                    {
                        //Elimar archivo
                        if (Obj.Adjunto.nombre == "eliminar")
                        {
                            int id = Convert.ToInt32(Obj.Adjunto.AdjuntoId);
                            Obj.AdjuntoId = null;
                            result.AdjuntoId = null;
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

        public async Task UpdateEstado(ExperienciaDocente Obj)
        {
            try
            {
                var result = await _ctx.ExperienciaDocente.FirstOrDefaultAsync(e => e.ExperienciaDocenteId == Obj.ExperienciaDocenteId);
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

        /// <summary>
        /// Valida que no existan registros de experiencia docente
        /// </summary>
        /// <param name="model"><ExperienciaDocente>model</param>
        /// <returns>Boolean</returns>
        //public async Task<Boolean> ValidarDuplicados(ExperienciaDocente model)
        //{
        //    try
        //    {
        //        var registros = await _ctx.ExperienciaDocente.Where(e => e.ClavePersona == model.ClavePersona 
        //                 && e.NumeroBecario == model.NumeroBecario).AsNoTracking().CountAsync();
        //        if (registros > 0)
        //        {
        //            return true;
        //        }
        //        return false;

        //    }
        //    catch (Exception e)
        //    {
        //        throw new Exception(e.Message);
        //    }
        //}

    }
}
