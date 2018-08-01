using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Contexts;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Util;
using INEEL.DataAccess.GEN.Models.GEN;
using System.Linq.Dynamic;
using INEEL.DataAccess.GEN.Models.CH;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class BecarioExternoINEELRepository : IDisposable
    {
        SIGCOCHContext _dbch;
        GEN_Context _dbgen;

        public BecarioExternoINEELRepository()
        {
            _dbch = new SIGCOCHContext();
            _dbgen = new GEN_Context();

        }

        public async Task<Object> getData(DataServerSide ss)
        {
            try
            {
                var dat = (from p in _dbch.BecarioExternoINEEL.AsNoTracking().Include(e=>e.TipoBeca).Include(e=> e.Institucion).Include(e=> e.EstadoFlujo)
                           select new
                           {
                               p.BecarioId,
                               p.NombreBecario,
                               p.ClaveBecario,
                               p.NombreAsesor,
                               p.ClaveAsesor,
                               p.InstitucionId,
                               Institucion=p.Institucion.Descripcion,
                               p.TituloEstancia,
                               p.FechaInicio,
                               p.FechaTermino,
                               p.FechaValidacion,
                               p.TipoBecaId,
                               p.EstadoFlujoId,
                               Estado=p.EstadoFlujo.Descripcion,
                               TipoBeca=p.TipoBeca.Descripcion,
                               p.ClavePersona,
                               p.PersonalIneel,
                               p.ProyectoId
                           });

                if (!String.IsNullOrEmpty(ss.esEmpleado)) //busqueda solamente por registros de empleados
                {
                    dat = dat.Where(x => x.ClavePersona== null);

                }

                if (!String.IsNullOrEmpty(ss.Tipo)) //busqueda solamente por registros de empleados
                {
                    dat = dat.Where(x => x.EstadoFlujoId == 3);

                }

                //Si los registros se cuentan antes dara un dato erroneo al usuario
                ss.recordsTotal = dat.ToList().Count();

                if (!String.IsNullOrEmpty(ss.Becario)) //busqueda por nombre del becario
                {
                    var idsBecarios = await GetBecariosPorNombreBusquedaColacion(ss.Becario);
                    dat = dat.Where(x => idsBecarios.Contains(x.BecarioId));

                }


                if (!String.IsNullOrEmpty(ss.estancia)) //busqueda por estancia del becario
                {
                    var idsBecarios = await GetBecariosPorEstanciaBusquedaColacion(ss.estancia);
                    dat = dat.Where(x => idsBecarios.Contains(x.BecarioId));

                }

                if (!String.IsNullOrEmpty(ss.Autor)) //busqueda por asesor
                {
                    dat = dat.Where(x => x.ClaveAsesor== ss.Autor);
                }

                if (!String.IsNullOrEmpty(ss.Institucion)) //busqueda por institucion
                {
                    var institucionId = Convert.ToInt32(ss.Institucion);
                    dat = dat.Where(x => x.InstitucionId== institucionId);
                }

                if (ss.TipoBeca!=0) //busqueda por tipo beca
                {
                    dat = dat.Where(x => x.TipoBecaId== ss.TipoBeca);
                }

                if(ss.proyectoId!=null){ //busqueda por proyecto
                    dat=dat.Where(x=> x.ProyectoId== ss.proyectoId);
                }

                if(!String.IsNullOrEmpty(ss.palabras)){
                    var ids = await GetBecariosPorNombreEstanciaBusquedaColacion(ss.palabras);
                    dat=dat.Where(x=> ids.Contains(x.BecarioId));
                }

                if (!String.IsNullOrEmpty(ss.busquedaFecha))  //busqueda por fecha
                {
                    //var fechaInicio = new DateTime(1975, 10, 25);
                    //var fechaFin = DateTime.Now;
                    //if (!String.IsNullOrEmpty(ss.NuevaFechaInicio))
                    //{
                    //    fechaInicio = DateTime.Parse(ss.NuevaFechaInicio);
                    //}
                    //if (!String.IsNullOrEmpty(ss.NuevaFechaTermino))
                    //{
                    //    fechaFin = DateTime.Parse(ss.NuevaFechaTermino);
                    //}
                    var fechaInicio = Convert.ToDateTime(ss.NuevaFechaInicio);
                    var fechaFin = Convert.ToDateTime(ss.NuevaFechaTermino);

                    dat = dat.Where(e => (DbFunctions.TruncateTime(e.FechaInicio) >= DbFunctions.TruncateTime(fechaInicio)
                                                    && DbFunctions.TruncateTime(e.FechaTermino) <= DbFunctions.TruncateTime(fechaFin)));
                }

                if (!String.IsNullOrEmpty(ss.searchValue)) //busqueda por la caja de filtro
                {
                    var idsBecarios = await GetBecariosPorNombreBusquedaColacion(ss.searchValue);
                    var idsInstituciones = await GetInstitucionesPorNombreBusquedaColacion(ss.searchValue);
                    var idsTiposBecas = await GetTiposBecaPorNombreBusquedaColacion(ss.searchValue);
                    var idsAsesores = await GetUsuariosPorNombreBusquedaColacion(ss.searchValue);
                    var estados = await GetPorEstadoRegistroBusquedaColacion(ss.searchValue);

                    dat = dat.Where(x => idsBecarios.Contains(x.BecarioId) ||
                                    x.FechaInicio.ToString().Contains(ss.searchValue) ||
                                    x.FechaTermino.ToString().Contains(ss.searchValue) ||
                                    idsInstituciones.Contains(x.InstitucionId) ||
                                    idsTiposBecas.Contains(x.TipoBecaId) ||
                                    idsAsesores.Contains(x.BecarioId) ||
                                    x.ClaveBecario.Contains(ss.searchValue) ||
                                    x.TituloEstancia.Contains(ss.searchValue) ||
                                    estados.Contains(x.EstadoFlujoId));
                }

                if (!(string.IsNullOrEmpty(ss.sortColumn) && string.IsNullOrEmpty(ss.sortColumnDir))) //ordenamiento
                {
                    dat = dat.OrderBy(ss.sortColumn + " " + ss.sortColumnDir);
                }


                ss.recordsFiltered = dat.Count();
                var entidades = dat.ToList().Skip(ss.skip).Take(ss.pageSize);
                return entidades;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtiene los ids de becarios que coincidan con el estado buscado [usando collate]
        /// </summary>
        /// <param name="likeNombre">Estado del registro</param>
        /// <returns>List<int></returns>
        public async Task<List<int>> GetPorEstadoRegistroBusquedaColacion(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT EstadoFlujoId FROM GEN.cat_EstadoFlujo where Descripcion collate Latin1_General_CI_AI LIKE '%";
                foreach (var palabra in palabras)
                {
                    query += palabra + "%' and Descripcion collate Latin1_General_CI_AI LIKE '%";
                }
                query = query.Substring(0, query.Length - 53);
                var resultados = await _dbch.Database.SqlQuery<int>(query).ToListAsync();
                return resultados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtiene los ids de becarios que coincidan con el nombre de estancia buscada [usando collate]
        /// </summary>
        /// <param name="likeNombre">nombre de la estancia a buscar</param>
        /// <returns>List<int></returns>
        public async Task<List<int>> GetBecariosPorNombreEstanciaBusquedaColacion(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT BecarioId FROM CH.tab_BecarioExternoINEEL where TituloEstancia collate Latin1_General_CI_AI LIKE '%";
                foreach (var palabra in palabras)
                {
                    query += palabra + "%' and TituloEstancia collate Latin1_General_CI_AI LIKE '%";
                }
                query = query.Substring(0, query.Length - 55);
                var resultados = await _dbch.Database.SqlQuery<int>(query).ToListAsync();
                return resultados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtiene los ids de becarios que coincidan con una busqueda determinada [usando collate]
        /// </summary>
        /// <param name="likeNombre">nombre del becario a buscar</param>
        /// <returns>List<int></returns>
        public async Task<List<int>> GetBecariosPorNombreBusquedaColacion(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT BecarioId FROM CH.tab_BecarioExternoINEEL where NombreBecario collate Latin1_General_CI_AI LIKE '%";
                foreach (var palabra in palabras)
                {
                    query += palabra + "%' and NombreBecario collate Latin1_General_CI_AI LIKE '%";
                }
                query = query.Substring(0, query.Length - 55);
                var resultados = await _dbch.Database.SqlQuery<int>(query).ToListAsync();
                return resultados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        /// <summary>
        /// Obtiene los ids de becarios que coincidan con una busqueda determinada [usando collate]
        /// </summary>
        /// <param name="likeNombre">estancia del becario a buscar</param>
        /// <returns>List<int></returns>
        public async Task<List<int>> GetBecariosPorEstanciaBusquedaColacion(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT BecarioId FROM CH.tab_BecarioExternoINEEL where TituloEstancia collate Latin1_General_CI_AI LIKE '%";
                foreach (var palabra in palabras)
                {
                    query += palabra + "%' and TituloEstancia collate Latin1_General_CI_AI LIKE '%";
                }
                query = query.Substring(0, query.Length - 55);
                var resultados = await _dbch.Database.SqlQuery<int>(query).ToListAsync();
                return resultados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        /// <summary>
        /// Obtiene los ids de becarios que coincidan con el asesor buscado [usando collate]
        /// </summary>
        /// <param name="likeNombre">nombre del becario a buscar</param>
        /// <returns>List<int></returns>
        public async Task<List<int>> GetUsuariosPorNombreBusquedaColacion(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT BecarioId FROM CH.tab_BecarioExternoINEEL where NombreAsesor collate Latin1_General_CI_AI LIKE '%";
                foreach (var palabra in palabras)
                {
                    query += palabra + "%' and NombreAsesor collate Latin1_General_CI_AI LIKE '%";
                }
                query = query.Substring(0, query.Length - 54);
                var resultados = await _dbch.Database.SqlQuery<int>(query).ToListAsync();
                return resultados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtiene los ids de instituciones que coincidan con una busqueda determinada [usando collate]
        /// </summary>
        /// <param name="likeNombre">institucion a buscar</param>
        /// <returns>List<int></returns>
        public async Task<List<int>> GetInstitucionesPorNombreBusquedaColacion(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT InstitucionID FROM CH.cat_Instituciones where Descripcion collate Latin1_General_CI_AI LIKE '%";
                foreach (var palabra in palabras)
                {
                    query += palabra + "%' and Descripcion collate Latin1_General_CI_AI LIKE '%";
                }
                query = query.Substring(0, query.Length - 53);
                var resultados = await _dbch.Database.SqlQuery<int>(query).ToListAsync();
                return resultados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        /// <summary>
        /// Obtiene los tipos de becas buscadas
        /// </summary>
        /// <param name="likeNombre"></param>
        /// <returns></returns>
        public async Task<List<int>> GetTiposBecaPorNombreBusquedaColacion(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT TipoBecaId FROM CH.cat_TipoBecas where Descripcion collate Latin1_General_CI_AI LIKE '%";
                foreach (var palabra in palabras)
                {
                    query += palabra + "%' and Descripcion collate Latin1_General_CI_AI LIKE '%";
                }
                query = query.Substring(0, query.Length - 53);
                var resultados = await _dbch.Database.SqlQuery<int>(query).ToListAsync();
                return resultados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtiene todos los becarios sin importar el estado de validez o el tipo de becario
        /// </summary>
        /// <returns>IEnumerable<object></returns>
        public async Task<IEnumerable<object>> GetAll()
        {
            try
            {
                var entities = await _dbch.BecarioExternoINEEL.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtiene todos los registros de becarios a cargo que ha tenido un investigador
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<object>> GetBecariosDeInvestigadores(string clave)
        {
            try
            {
                var entities = await _dbch.BecarioExternoINEEL.AsNoTracking()
                    .Where(e => e.ClaveAsesor==clave && e.EstadoFlujoId==3)
                    .Include(e=> e.TipoBeca)
                    .Include(e=>e.Institucion)
                    .Include(e=> e.EstadoFlujo)
                    .Select(x => new
                    {
                        x.BecarioId,
                        x.TituloEstancia,
                        x.FechaInicio,
                        x.FechaTermino,
                        x.FechaValidacion,
                        x.ClaveBecario,
                        x.NombreBecario,
                        Institucion=x.Institucion.Descripcion,
                        EstadoFlujo=x.EstadoFlujo.Descripcion,
                        TipoBeca=x.TipoBeca.Descripcion
                    })
                    .OrderByDescending(e=> e.FechaInicio)
                    .ToListAsync();

                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtiene los registros de becarios que aun no son investigadores
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<object>> GetEstanciasDeInvestigadoresEnInstituto(string clave)
        {
            try
            {
                var entities = await _dbch.BecarioExternoINEEL.AsNoTracking()
                    .Where(e=> e.ClavePersona== clave)
                    .Include(e => e.TipoBeca)
                    .Include(e=> e.Proyecto)
                    .Include(e=> e.TipoBeca)
                    .Select(x => new
                    {
                        x.BecarioId,
                        x.TituloEstancia,
                        x.FechaInicio,
                        x.ClaveAsesor,
                        x.NombreAsesor,
                        x.Proyecto,
                        EstadoFlujo=x.EstadoFlujo.Descripcion,
                        TipoBeca=x.TipoBeca.Descripcion
                    }).ToListAsync();

                return entities;

            }catch(Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Asocia el registro de un becario con un investigador
        /// </summary>
        /// <returns></returns>
        public async Task ActualizaRegistroBecaEmpleado(int id, string clave)
        {
            try
            {
                var _model = await _dbch.BecarioExternoINEEL
                    .FirstOrDefaultAsync(e => e.BecarioId == id);
                if(_model!=null){
                    var notificacion= await _dbgen.dbSetNuevoOC.Where(e=> e.OcsId.Equals("BecarioExterno") && e.IdExterno== _model.BecarioId+"").AsNoTracking().FirstOrDefaultAsync();;
                    if (clave == "null") { //La clave sera nula cuando el registro sea desasociado al empleado
                        clave = null; 
                    }
                    if(notificacion==null){
                        NuevoOCRepository repo= new NuevoOCRepository();
                        await repo.Create("CH", "BecarioExterno", _model.NombreBecario, "indexCH.html#/InformeBecarioDetails/" + _model.BecarioId, Convert.ToString(_model.BecarioId) );
                    }
                    if (notificacion!=null && clave==null){
                        NuevoOCRepository repo= new NuevoOCRepository();
                        await repo.Delete(notificacion.NuevoOCId);
                    }
                    
                    _model.ClavePersona=clave;
                    await _dbch.SaveChangesAsync();
                }else{
                    throw new ApplicationException("Error al asociar el registro con el empleado");   
                }

                if (clave != null)
                {
                    PersonasRepository prep = new PersonasRepository();
                    Personas p = await prep.GetByClave(clave);
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
        /// Obtiene un registro por un id
        /// </summary>
        /// <param name="id">id del registro a buscar</param>
        /// <returns></returns>
        public async Task<object> GetById(int id)
        {
            try
            {
                var entities = await _dbch.BecarioExternoINEEL
                                        .AsNoTracking()
                                        .Include(e=> e.Proyecto)
                                        .Include(e=> e.TipoBeca)
                                        .Include(e=> e.Institucion)
                                        .Include(e=> e.Adjunto)
                    .FirstOrDefaultAsync(e => e.BecarioId == id);

                if (entities.ClavePersona != null)
                {
                    PersonasRepository personarepo = new PersonasRepository();
                    var persona = await personarepo.GetByClaveFechaEfectiva(entities.ClavePersona);
                    entities.Persona = persona;
                }
                var unidad = await _dbgen.dbSetUnidadOrganizacional.AsNoTracking()
                    .FirstOrDefaultAsync(x => x.ClaveUnidad == entities.ClaveUnidad
                                    && x.FechaEfectiva == _dbgen.dbSetUnidadOrganizacional
                                                                    .Where(f => f.FechaEfectiva <= DateTime.Now
                                                                    && f.ClaveUnidad == x.ClaveUnidad)
                                                                    .Max(f => f.FechaEfectiva)
                                      );
                entities.Gerencia = unidad;

                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtiene los registros de becarios dirigidos para mostrarse en el CV del empleado
        /// </summary>
        /// <param name="id">clave del empleado a buscar</param>
        /// <returns>IEnumerable<object></returns>
        public async Task<IEnumerable<Object>> GetBecariosDirigidosForCurriculum(string id)
        {
            try
            {
                var result = await _dbch.BecarioExternoINEEL.AsNoTracking()
                                .Where(e => e.ClaveAsesor.Equals(id) && e.EstadoFlujoId==3)
                                        .Include(e => e.TipoBeca)
                                        .Include(e => e.Proyecto)
                                        .ToListAsync();

                List<String> claveUniddes = new List<string>(result.Select(x => x.ClaveUnidad));
                var unidades = await _dbgen.dbSetUnidadOrganizacional
                         .Where(x=> claveUniddes.Contains(x.ClaveUnidad))
                         .AsNoTracking().ToListAsync();

                foreach (var item in result)
                {
                    item.NombreGerencia = unidades.Where(x => x.ClaveUnidad == item.ClaveUnidad && x.FechaEfectiva == _dbgen.dbSetUnidadOrganizacional
                                                                    .Where(f => f.FechaEfectiva <= DateTime.Now
                                                                    && f.ClaveUnidad == x.ClaveUnidad)
                                                                    .Max(f => f.FechaEfectiva)
                                      ).Select(x=> x.NombreUnidad).FirstOrDefault();
                }

                var entities = result.Select(x => new {
                    x.ClaveBecario,
                    x.NombreBecario,
                    TipoBeca = x.TipoBeca.Descripcion,
                    Gerencia = x.NombreGerencia != null ? x.NombreGerencia : "No disponible",
                    x.TituloEstancia,
                    Proyecto=x.Proyecto==null? "No disponible" : x.Proyecto.Nombre
                });

                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtiene los registros de becarios externos para mostrarse en el CV del empleado
        /// </summary>
        /// <param name="id">clave del empleado a buscar</param>
        /// <returns>IEnumerable<object></returns>
        public async Task<IEnumerable<Object>> GetBecariosExternosForCurriculum(string id)
        {
            try
            {
                var entities = await _dbch.BecarioExternoINEEL.AsNoTracking().Where(e => e.ClavePersona.Equals(id) && e.EstadoFlujoId==3)
                                                        .Include(e => e.Institucion)
                                                        .Include(e => e.Proyecto)
                                                        .Select(x=> new{
                                                            x.ClaveBecario,
                                                            x.ClavePersona,
                                                            x.TituloEstancia,
                                                            Proyecto=x.Proyecto.Nombre,
                                                            Institucion=x.Institucion.Descripcion
                                                        })
                                                        .ToListAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        

        /// <summary>
        /// Crear un becario 
        /// </summary>
        /// <param name="model">modelo a crear</param>
        /// <returns></returns>
        public async Task Create(BecarioExternoINEEL model)
        {
            try
            {
                if(await ValidarDuplicados(model))
                {
                    throw new ApplicationException("Ya existe un registro con ese nombre.");
                }
                _dbch.BecarioExternoINEEL.Add(model);
                await _dbch.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Valida que no existan registros duplicados de becarios
        /// </summary>
        /// <param name="model"><BecarioExternoINEEL>model</param>
        /// <returns>Boolean</returns>
        public async Task<Boolean> ValidarDuplicados(BecarioExternoINEEL model)
        {
            try
            {
                var registros = await _dbch.BecarioExternoINEEL.Where(e => e.ClaveBecario == model.ClaveBecario && e.TipoBecaId == model.TipoBecaId
                         && DbFunctions.TruncateTime(e.FechaInicio) == DbFunctions.TruncateTime(model.FechaInicio)
                         && DbFunctions.TruncateTime(e.FechaTermino) == DbFunctions.TruncateTime(model.FechaTermino)
                         && e.BecarioId != model.BecarioId)
                         .AsNoTracking().CountAsync();
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

        /// <summary>
        /// Actualiza un becario
        /// </summary>
        /// <param name="model">becario con los nuevos valores</param>
        /// <returns></returns>
        public async Task Update(BecarioExternoINEEL model)
        {
            try
            {
                var _model = await _dbch.BecarioExternoINEEL
                    .FirstOrDefaultAsync(e => e.BecarioId == model.BecarioId);
                if (_model != null)
                {
                    if (model.Adjunto != null)
                    {
                        Adjunto key = await new AdjuntoRepository().CreateAd(model.Adjunto);
                        model.AdjuntoId = key.AdjuntoId;
                    }

                    if(model.EstadoFlujoId==3){
                        NuevoOCRepository repo= new NuevoOCRepository();
                        await repo.Create("CH", "BecarioDirigido", _model.NombreBecario, "indexCH.html#/InformeBecarioDetails/" + _model.BecarioId, Convert.ToString(_model.BecarioId) );
                    }else{
                        var notificacion= await _dbgen.dbSetNuevoOC.Where(e=> e.OcsId.Equals("BecarioDirigido") && e.IdExterno== _model.BecarioId+"").AsNoTracking().FirstOrDefaultAsync();;
                        if(notificacion!=null){
                            NuevoOCRepository repo= new NuevoOCRepository();
                            await repo.DeleteId("BecarioDirigido", _model.BecarioId+"");
                        }
                        
                    }
                    
                    _dbch.Entry(_model).CurrentValues.SetValues(model);
                    await _dbch.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Elimina a un becario por un id
        /// </summary>
        /// <param name="id">id del becario a eliminar</param>
        /// <returns></returns>
        public async Task Delete(int id)
        {
            try
            {
                var entitie = await _dbch.BecarioExternoINEEL
                    .FirstOrDefaultAsync(e => e.BecarioId == id);

                if (entitie != null)
                {
                    var infoAgregada = await _dbgen.dbSetNuevoOC.Where(e => e.descripcion.Equals(entitie.NombreBecario)).FirstOrDefaultAsync();
                    if(infoAgregada!=null){
                        NuevoOCRepository repo= new NuevoOCRepository();
                        await repo.Delete(infoAgregada.NuevoOCId);
                    }
                    _dbch.BecarioExternoINEEL.Remove(entitie);
                    await _dbch.SaveChangesAsync();
                }

                
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// Valida que no existan registros de becarios externos
        /// </summary>
        /// <param name="model"><BecarioExterno>model</param>
        /// <returns>Boolean</returns>
        public async Task<Boolean> ValidarDuplicados(BecarioExterno model)
        {
            try
            {
                var registros = await _dbch.BecarioExterno.Where(e => e.Becario_ClavePersona == model.Becario_ClavePersona && e.TipoBecaId == model.TipoBecaId
                         && DbFunctions.TruncateTime(e.FechaInicio) == DbFunctions.TruncateTime(model.FechaInicio)
                         && DbFunctions.TruncateTime(e.FechaTermino) == DbFunctions.TruncateTime(model.FechaTermino)
                         && e.BecarioExternoId != model.BecarioExternoId)
                         .AsNoTracking().CountAsync();
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

        public void Dispose()
        {
            _dbch.Dispose(); //ayudar al recolector de basura
            _dbgen.Dispose();
        }

    }
}
