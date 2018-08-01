using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Contexts;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Models.GEN.CH.Entities;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class FormacionAcademicaRepository : IDisposable
    {
        public void Dispose() { _ctx.Dispose(); }
        /// <summary>
        /// contexto para la conexión de CH. 
        /// </summary>
        SIGCOCHContext _ctx;

        /// <summary>
        /// Contrucctor de la clase FormacionAcademicaRepository
        /// </summary>
        public FormacionAcademicaRepository()
        {
            _ctx = new SIGCOCHContext();
        }

        public FormacionAcademicaRepository(SIGCOCHContext context)
        {
            _ctx = context;
        }

        /// <summary>
        /// Obtiene la lista de los registros de formacion academica.
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<FormacionAcademica>> GetAll()
        {
            try
            {
                var fa = await _ctx.FormacionAcademica.AsNoTracking()
                                                        .Include(e => e.EstadoFlujo)
                                                        .Include(e => e.GradoAcademico)
                                                        .Include(e => e.Carrera)
                                                        .Include(e => e.Institucion)
                                                        .Include(e => e.Institucion.Pais)
                                                        .ToListAsync();
                return fa;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<FormacionAcademica>> GetByClaveEmpEstadoFlujo(string clave, /*DateTime yearsBack,*/ List<int> estados)
        {
            try
            {
                var fa = await _ctx.FormacionAcademica.Where(e => e.ClavePersona.Equals(clave))
                                                        //.Include(e => e.EstadoFlujo)
                                                        .Include(e => e.GradoAcademico)
                                                        .Include(e => e.Carrera)
                                                        .Include(e => e.Institucion)
                                                        .Include(e => e.Institucion.Pais)
                                                        .Where(e => estados.Contains(e.EstadoFlujoId)
                                                        //&& (e.FechaInicio > yearsBack
                                                        //    || e.FechaInicio < new DateTime(1900,1,2)
                                                        //)
                                                        )
                                                        .OrderByDescending(e => e.FechaInicio)
                                                        .AsNoTracking()
                                                        .ToListAsync();
                return fa;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Object> GetFormacionForDetailsBusqueda(busquedaAv parametro)
        {
            try
            {
                List<int> listaIds = new List<int>();
                var listaPreliminar = parametro.FieldD.Split(',').ToList();
                listaPreliminar.Remove("");
                listaIds = listaPreliminar.Select(int.Parse).ToList();

                var resultados = await _ctx.FormacionAcademica.Where(e => listaIds.Contains(e.FormacionAcademicaId)).AsNoTracking()
                                                             .Include(f => f.GradoAcademico)
                                                             .Include(f => f.Carrera)
                                                             .Include(f => f.Institucion)
                                                             .Select(x => new {
                                                                 id = x.FormacionAcademicaId,
                                                                 Nombre = x.Institucion.Descripcion + " - " + x.GradoAcademico.Descripcion + ", " + x.Carrera.Descripcion
                                                             }).ToListAsync();
                return resultados;
            }
            catch(Exception e)
            {
                throw new Exception(e.Message, e);
            }
            
        }

        public async Task<IEnumerable<FormacionAcademica>> GetByClaveEmpleado(string clave)
        {
            try
            {
                var fa = await _ctx.FormacionAcademica.Where(e => e.ClavePersona.Equals(clave))
                                                        .Include(e => e.EstadoFlujo)
                                                        .Include(e => e.GradoAcademico)
                                                        .Include(e => e.Carrera)
                                                        .Include(e => e.Institucion)
                                                        .Include(e => e.Institucion.Pais)
                                                        .OrderBy(e => e.GradoAcademicoId)
                                                        .AsNoTracking()
                                                        .ToListAsync();
                foreach (var item in fa)
                {
                    if (item.EstadoFlujoId == 2)
                    {
                        item.EstadoFlujo.Descripcion += " Admin CH";
                    }
                }
                return fa;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<FormacionAcademica>> GetForCV(string id)
        {
            try
            {
                var Obj = await _ctx.FormacionAcademica.Where(e => e.ClavePersona.Equals(id))
                                                        .Where(e => e.EstadoFlujoId == 3)
                                                        .Include(e => e.EstadoFlujo)
                                                        .Include(e => e.GradoAcademico)
                                                        .Include(e => e.Carrera)
                                                        .Include(e => e.Institucion)
                                                        .Include(e => e.Institucion.Pais)
                                                        .AsNoTracking()
                                                        .ToListAsync();
                return Obj;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<FormacionAcademica>> GetByEstado()
        {
            try
            {
                var fa = await _ctx.FormacionAcademica.Where(e => e.EstadoFlujoId == 2)
                                                        .AsNoTracking()
                                                        .ToListAsync();
                return fa;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtiene un registro de Formacio academica por Id.
        /// </summary>
        /// <param name="formacionacademicaId"> Id del campo requerido</param>
        /// <returns></returns>
        public async Task<FormacionAcademica> GetById(int formacionacademicaId)
        {
            try
            {
                var fa = await _ctx.FormacionAcademica.Where(e => e.FormacionAcademicaId == formacionacademicaId)
                                                        .Include(e => e.EstadoFlujo)
                                                        .Include(e => e.GradoAcademico)
                                                        .Include(e => e.Carrera)
                                                        .Include(e => e.Institucion)
                                                        .Include(e => e.Institucion.Pais)
                                                        .Include(e => e.Adjunto)
                                                        .AsNoTracking()
                                                        .FirstOrDefaultAsync();
                return fa;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Agrega un objeto tipo formacion academica. 
        /// </summary>
        /// <param name="campo">Objeto tipo formacion academica</param>
        /// <returns></returns>
        public async Task Create(FormacionAcademica formacionAcademica)
        {
            try
            {
                _ctx.FormacionAcademica.Add(formacionAcademica);
                await _ctx.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        /// <summary>
        /// Actualiza la información del objeto formacion academica. 
        /// </summary>
        /// <param name="formacionAcademica">objeto con los datos para actualizar</param>
        /// <returns></returns>
        public async Task Update(FormacionAcademica formacionAcademica)
        {
            try
            {
                var _fa = await _ctx.FormacionAcademica.FirstOrDefaultAsync(e => e.FormacionAcademicaId == formacionAcademica.FormacionAcademicaId);
                if (_fa != null)
                {
                    if (formacionAcademica.Adjunto != null)
                    {
                        if (formacionAcademica.Adjunto.nombre == "eliminar")
                        {
                            int id = Convert.ToInt32(formacionAcademica.Adjunto.AdjuntoId);
                            _fa.AdjuntoId = null;
                            await _ctx.SaveChangesAsync();
                            await new AdjuntoRepository().Delete(id);
                            
                        }
                        ///Agregar archivo al editar
                        if (formacionAcademica.Adjunto.AdjuntoId == 0)
                        {
                            if (_fa.AdjuntoId != null)
                            {
                                var id = _fa.AdjuntoId;
                                _fa.AdjuntoId = null;
                                await _ctx.SaveChangesAsync();
                                await new AdjuntoRepository().Delete(id);
                            }
                            Adjunto key = await new AdjuntoRepository().CreateAd(formacionAcademica.Adjunto);
                            formacionAcademica.AdjuntoId = key.AdjuntoId;
                            
                        }
                    }
                    _ctx.Entry(_fa).CurrentValues.SetValues(formacionAcademica);
                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateSolicitud(FormacionAcademica formacionAcademica)
        {
            try
            {
                var _fa = await _ctx.FormacionAcademica.FirstOrDefaultAsync(e => e.FormacionAcademicaId == formacionAcademica.FormacionAcademicaId);
                if (_fa != null)
                {
                    //_fa.EstadoFlujoId = formacionAcademica.EstadoFlujoId;
                    //_fa.GradoAcademicoId = formacionAcademica.GradoAcademicoId;
                    //_fa.CarreraId = formacionAcademica.CarreraId;
                    //_fa.Especialidad = formacionAcademica.Especialidad;
                    //_fa.Cedula = formacionAcademica.Cedula;
                    //_fa.InstitucionID = formacionAcademica.InstitucionID;
                    //_fa.PaisID = formacionAcademica.PaisID;
                    //_fa.FechaInicio = formacionAcademica.FechaInicio;
                    //_fa.FechaTermino = formacionAcademica.FechaTermino;
                    //_fa.IdArchivo = formacionAcademica.IdArchivo;
                    //_fa.EstaTitulado = formacionAcademica.EstaTitulado;
                    //_fa.FechaValidacion = formacionAcademica.FechaValidacion;
                    _ctx.Entry(_fa).CurrentValues.SetValues(formacionAcademica);
                    await _ctx.SaveChangesAsync();

                    PersonasRepository prep = new PersonasRepository();
                    Personas p = await prep.GetByClave(formacionAcademica.ClavePersona);
                    p.ultimaActualizacion = DateTime.Now;
                    await prep.Update(p);
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Elimina un registro de la tabla de formacion academica.
        /// </summary>
        /// <param name="formacionacademicaId">filtro par eliminar el registro</param>
        /// <returns></returns>
        public async Task Delete(int formacionacademicaId)
        {
            try
            {
                var _fa = await _ctx.FormacionAcademica.FirstOrDefaultAsync(e => e.FormacionAcademicaId == formacionacademicaId);
                if (_fa != null)
                {
                    _ctx.FormacionAcademica.Remove(_fa);
                    await _ctx.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(FormacionAcademica FormacionAcademica)
        {
            try
            {
                var _FormacionAcademica = await _ctx.FormacionAcademica.FirstOrDefaultAsync(e => e.FormacionAcademicaId == FormacionAcademica.FormacionAcademicaId);
                if (_FormacionAcademica != null)
                {
                    _FormacionAcademica.EstadoFlujoId = FormacionAcademica.EstadoFlujoId;

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<FormacionAcademica> ObtenerAlmaMater(string clavepersona)
        {
            try
            {
                var _formacionacademica = await _ctx.FormacionAcademica
                    .Where(e => e.ClavePersona == clavepersona
                    && e.GradoAcademicoId == 1)
                    .Include(e => e.Institucion.Pais)
                    .Include(e => e.GradoAcademico)
                    .FirstOrDefaultAsync();
                return _formacionacademica;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        /// <summary>
        /// Valida que no existan registros de formacion academica repetidos
        /// </summary>
        /// <param name="model"><FormacionAcademica>model</param>
        /// <returns>Boolean</returns>
        public async Task<Boolean> ValidarDuplicados(FormacionAcademica model)
        {
            try
            {
                // var data= await GetDALikeTituloNuevo(model.TituloPublicacion);
                var registros = await _ctx.FormacionAcademica.Where(e => e.ClavePersona == model.ClavePersona && e.GradoAcademicoId== model.GradoAcademicoId
                         && DbFunctions.TruncateTime(e.FechaInicio) == DbFunctions.TruncateTime(model.FechaInicio) 
                         && DbFunctions.TruncateTime(e.FechaTermino) == DbFunctions.TruncateTime(model.FechaTermino)
                         && e.FormacionAcademicaId!= model.FormacionAcademicaId).AsNoTracking().CountAsync();
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
