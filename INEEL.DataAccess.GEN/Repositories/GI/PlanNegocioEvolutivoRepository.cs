using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GI;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Linq;
using System;
using Newtonsoft.Json;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.GEN.Repositories.GI
{
    public class PlanNegocioEvolutivoRepository
    {

        private GI_Context dbGI;
        public PlanNegocioEvolutivoRepository()
        {
            dbGI = new GI_Context();
        }

        public async Task<int> CountPlanNegocioEvolutivo()
        {
            try
            {
                var entities = await dbGI.DbSetPlanNegocioEvolutivo

                    .AsNoTracking().CountAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<PlanNegocioEvolutivo>> GetAll()
        {
            try
            {
                var entities = await dbGI.DbSetPlanNegocioEvolutivo
                    .AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<PlanNegocioEvolutivo> GetByIdCollections(int id)
        {
            try
            {
                var entities = await dbGI.DbSetPlanNegocioEvolutivo.AsNoTracking()
                    .Include(x=> x.PlanNegocioEvolArchivos)
                    .Include(x=> x.PlanNegocioEvolAutores)
                    .Include(x=> x.PlanNegocioEvolGerencias)
                    .FirstOrDefaultAsync(e => e.PlanNegocioEvolutivoId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        //retorna verdadero si la ClavePersona coinside con ClavePersona del registro, alguno de los autores o hiperjefes de los autores
        public async Task<Boolean> EvidenciaDownload(int idRegistro, String ClavePersona)
        {
            try
            {
                var entitie = await dbGI.DbSetPlanNegocioEvolutivo.AsNoTracking()
                    .Include(x=> x.PlanNegocioEvolAutores)
                    .FirstOrDefaultAsync(e => e.PlanNegocioEvolutivoId == idRegistro);
                if (entitie.TipoAcceso == 1)
                { //1: publico
                    return true;
                }
                else
                {
                    if (entitie.ClavePersona.Equals(ClavePersona))
                    {
                        return true;
                    }
                    if(entitie!=null && entitie.PlanNegocioEvolAutores != null)
                    {
                        var autor= entitie.PlanNegocioEvolAutores.FirstOrDefault(x => x.ClavePersona.Equals(ClavePersona));
                        if (autor != null) { return true; }
                    }
                    else
                    {
                        JerarquiaRepository hiper = new JerarquiaRepository();
                        Jerarquia jer = new Jerarquia(null, ClavePersona, null);
                        jer.JefeHiperonimo = ClavePersona;
                        var autores= entitie.PlanNegocioEvolAutores.Select(x => x.ClavePersona).ToList();
                        PersonasRepository dbPers = new PersonasRepository();
                        var personas = await dbPers.GetAllCollectionWithoutStatus(autores);
                        var unidadesClave= personas.Select(x => x.ClaveUnidad).ToList();

                        if (unidadesClave != null)
                        {
                            foreach (var u in unidadesClave)
                            {
                                jer.UnidadOrganizacionalId = u;
                                if(await hiper.isJefeHiperonimoByUnidadOrganizacionalId(jer))
                                {
                                    return true;
                                }

                            }
                        }


                    }
                }
                return false;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Object>> GetAllCartera()
        {
            try
            {
                var fechaActual = DateTime.Now;
                var entities = await dbGI.DbSetPlanNegocioEvolutivo
                    .Where(e=>e.EstadoFlujoId==10)
                    .AsNoTracking()
                    .Include(x => x.PlanNegocioEvolGerencias)
                    .Include(x => x.PlanNegocioEvolAutores)
                    .Include(x => x.Propuesta)
                    .Include(x => x.Proyecto)
                    .Include(x => x.TipoAccesoGI)
                    .Select(x => new {
                        PlanNegocioEvolutivoId = x.PlanNegocioEvolutivoId,
                        Titulo = x.Titulo,
                        propuesta = x.Propuesta.NombreTecnico,
                        ProyectoId = x.ProyectoId,
                        Proyecto = x.Proyecto.Nombre,
                        Tema = x.Tema,
                        OfertaDeValor = x.OfertaDeValor,
                        TipoAcceso = x.TipoAcceso,
                        AccesoPublico = x.TipoAcceso==1?true:false,
                        TipoAccesoGI = x.TipoAccesoGI.Nombre,
                        FechaRegistro = x.FechaRegistro,
                        PlanNegocioEvolAutores = x.PlanNegocioEvolAutores.Select(aut => aut.Nombre).ToList(),
                        PlanNegocioEvolGerencias =
                        (from unidad in dbGI.DbSetUnidadOrganizacional
                         where x.PlanNegocioEvolGerencias.Select(g => g.ClaveUnidad).ToList().Contains(unidad.ClaveUnidad)
                                  && unidad.FechaEfectiva == dbGI.DbSetUnidadOrganizacional.Where(
                                                    p => p.FechaEfectiva <= fechaActual
                                                    && p.ClaveUnidad == unidad.ClaveUnidad
                                                    ).Max(e => e.FechaEfectiva)
                         select unidad.NombreUnidad).ToList()
                    })
                    .ToListAsync();



                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<Object>> GetAllCartera2()
        {
            try
            {
                var fechaActual = DateTime.Now;
                var entities = await dbGI.DbSetPlanNegocioEvolutivo
                    .Where(e => e.EstadoFlujoId == 10)
                    .AsNoTracking()
                    .Include(x => x.PlanNegocioEvolGerencias)
                    .Include(x => x.PlanNegocioEvolAutores)
                    .Include(x => x.PlanNegocioEvolCveAutores)
                    .Include(x => x.Propuesta)
                    .Include(x => x.Proyecto)
                    .Include(x => x.TipoAccesoGI)
                    .Select(x => new {
                        PlanNegocioEvolutivoId = x.PlanNegocioEvolutivoId,
                        Titulo = x.Titulo,
                        propuesta = x.Propuesta.NombreTecnico,
                        ProyectoId = x.ProyectoId,
                        Proyecto = x.Proyecto.Nombre,
                        Tema = x.Tema,
                        OfertaDeValor = x.OfertaDeValor,
                        TipoAcceso = x.TipoAcceso,
                        AccesoPublico = x.TipoAcceso == 1 ? true : false,
                        TipoAccesoGI = x.TipoAccesoGI.Nombre,
                        FechaRegistro = x.FechaRegistro,
                        PlanNegocioEvolAutores = x.PlanNegocioEvolAutores.Select( aut => aut.ClavePersona+" "+ aut.Nombre).ToList(),
                        PlanNegocioEvolGerencias =
                        (from unidad in dbGI.DbSetUnidadOrganizacional
                         where x.PlanNegocioEvolGerencias.Select(g => g.ClaveUnidad).ToList().Contains(unidad.ClaveUnidad)
                                  && unidad.FechaEfectiva == dbGI.DbSetUnidadOrganizacional.Where(
                                                    p => p.FechaEfectiva <= fechaActual
                                                    && p.ClaveUnidad == unidad.ClaveUnidad
                                                    ).Max(e => e.FechaEfectiva)
                         select unidad.NombreUnidad).ToList()
                    })
                    .ToListAsync();



                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<IEnumerable<Object>> GetAllByEmpleado(String clavePersona)
        {
            try
            {
                var fechaActual = DateTime.Now;
                var entities = await dbGI.DbSetPlanNegocioEvolutivo.AsNoTracking()
                    .Include(x => x.PlanNegocioEvolGerencias)
                    .Include(x => x.PlanNegocioEvolAutores)
                    .Include(x => x.Propuesta)
                    .Include(x => x.Proyecto)
                    .Include(x => x.TipoAccesoGI)
                    .Include(x=>x.EstadoFlujo)
                    .Where(x => x.ClavePersona.Equals(clavePersona))
                    .Where(x=>x.EstadoFlujoId==10)
                    .Select(x => new {
                        PlanNegocioEvolutivoId = x.PlanNegocioEvolutivoId,
                        Titulo = x.Titulo,
                        propuesta = x.Propuesta.NombreTecnico,
                        ProyectoId = x.ProyectoId,
                        Proyecto = x.Proyecto.Nombre,
                        Tema = x.Tema,
                        OfertaDeValor = x.OfertaDeValor,
                        TipoAcceso = x.TipoAcceso,
                        TipoAccesoGI = x.TipoAccesoGI.Nombre,
                        FechaRegistro = x.FechaRegistro,
                        PlanNegocioEvolAutores = x.PlanNegocioEvolAutores.Select(aut=> aut.Nombre).ToList(),
                        PlanNegocioEvolGerencias =
                        (from unidad in dbGI.DbSetUnidadOrganizacional
                         where x.PlanNegocioEvolGerencias.Select(g => g.ClaveUnidad).ToList().Contains(unidad.ClaveUnidad)
                                  && unidad.FechaEfectiva == dbGI.DbSetUnidadOrganizacional.Where(
                                                    p => p.FechaEfectiva <= fechaActual
                                                    && p.ClaveUnidad == unidad.ClaveUnidad
                                                    ).Max(e => e.FechaEfectiva)
                         select unidad.NombreUnidad).ToList(),
                         estadoflujo=x.EstadoFlujo.Descripcion
            })
                    .ToListAsync();



                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<Object>> GetAllByEmpleado2(String clavePersona)
        {
            try
            {
                var fechaActual = DateTime.Now;
                var entities = await dbGI.DbSetPlanNegocioEvolutivo.AsNoTracking()
                    .Include(x => x.PlanNegocioEvolGerencias)
                    .Include(x => x.PlanNegocioEvolAutores)
                    .Include(x => x.Propuesta)
                    .Include(x => x.Proyecto)
                    .Include(x => x.TipoAccesoGI)
                    .Include(x => x.EstadoFlujo)
                    .Where(x => x.ClavePersona.Equals(clavePersona))
                    .Where(x => x.EstadoFlujoId == 10)
                    .Select(x => new {
                        PlanNegocioEvolutivoId = x.PlanNegocioEvolutivoId,
                        Titulo = x.Titulo,
                        propuesta = x.Propuesta.NombreTecnico,
                        ProyectoId = x.ProyectoId,
                        Proyecto = x.Proyecto.Nombre,
                        Tema = x.Tema,
                        OfertaDeValor = x.OfertaDeValor,
                        TipoAcceso = x.TipoAcceso,
                        TipoAccesoGI = x.TipoAccesoGI.Nombre,
                        FechaRegistro = x.FechaRegistro,
                        PlanNegocioEvolAutores = x.PlanNegocioEvolAutores.Select(aut => aut.ClavePersona+" "+aut.Nombre).ToList(),
                        PlanNegocioEvolGerencias =
                        (from unidad in dbGI.DbSetUnidadOrganizacional
                         where x.PlanNegocioEvolGerencias.Select(g => g.ClaveUnidad).ToList().Contains(unidad.ClaveUnidad)
                                  && unidad.FechaEfectiva == dbGI.DbSetUnidadOrganizacional.Where(
                                                    p => p.FechaEfectiva <= fechaActual
                                                    && p.ClaveUnidad == unidad.ClaveUnidad
                                                    ).Max(e => e.FechaEfectiva)
                         select unidad.NombreUnidad).ToList(),
                        estadoflujo = x.EstadoFlujo.Descripcion
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
        /// Obtener todos las planes de negocio de acuerdo a los parametros ingresados por el usuario
        /// </summary>
        /// <returns><IEnumerable<Object>></returns>
        public async Task<IEnumerable<Object>> GetConsultaCartera(PlanNegocioEvolutivo parametros)
        {
            try
            {
                var fechaActual = DateTime.Now;
                var entities = dbGI.DbSetPlanNegocioEvolutivo
                    .Where(e => e.EstadoFlujoId == 10)
                    .AsNoTracking()
                    .Include(x => x.PlanNegocioEvolAutores)
                    .Include(x => x.Propuesta)
                    .Include(x => x.Proyecto)
                    .Include(x => x.EstadoFlujo)
                    .Include(x => x.TipoAccesoGI);

                if (entities != null)
                {
                    if (!String.IsNullOrEmpty(parametros.ClavePersona))  //busqueda por los planes de negocio de la persona logueada en el sigco (seccion "mis planes de negocio")
                    {
                        entities = entities.Where(e => e.ClavePersona == parametros.ClavePersona);
                    }
                    if (!String.IsNullOrEmpty(parametros.Titulo)) //busqueda por plan de negocio evolutivo
                    {
                        var fksplanes = await GetPlanesLikeNombreLatin1(parametros.Titulo);
                        entities = entities.Where(e => fksplanes.Contains(e.PlanNegocioEvolutivoId));
                    }
                    if (!String.IsNullOrEmpty(parametros.NombreProyecto)) //busqueda por nombre de la propuesta asociada
                    {
                        var fkspropuestas = await GetPropuestasLikeNombreLatin1(parametros.NombreProyecto);
                        entities = entities.Where(e => fkspropuestas.Contains(e.PropuestaClave)); //*******verificar
                    }
                    if (!String.IsNullOrEmpty(parametros.ProyectoId)) //busqueda por numero de proyecto
                    {
                        entities = entities.Where(e => e.ProyectoId != null && e.ProyectoId == parametros.ProyectoId);
                    }
                    if (!String.IsNullOrEmpty(parametros.OfertaDeValor)) //busqueda por oferta de valor
                    {
                        var fksplanes = await GetPlanesByOferLikeNombreLatin1(parametros.OfertaDeValor);
                        entities = entities.Where(e => fksplanes.Contains(e.PlanNegocioEvolutivoId));
                    }
                    if (!String.IsNullOrEmpty(parametros.NombrePersona))  //busqueda por autores del plan de negocio
                    {
                      PersonasRepository p= new PersonasRepository();
                    //   var fksautores= await p.GetAllClavesByLikeNombreLatin1(parametros.NombrePersona);
                    //   entities= entities.Where(e=> fksautores.Contains(e.ClavePersona));
                        var fksautores = await GetPlanesByAutorLikeNombreLatin1(parametros.NombrePersona);
                        entities = entities.Where(e => fksautores.Contains(e.PlanNegocioEvolutivoId));
                    }
                    if (!String.IsNullOrEmpty(parametros.ClaveUnidad))  //busqueda por plan de negocio evolutivo
                    {
                        var fksunidades = await dbGI.DbSetPlanNegocioEvolGerencias.AsNoTracking().Where(e => e.ClaveUnidad == parametros.ClaveUnidad).Select(x => x.PlanNegocioEvolutivoId).ToListAsync();
                        entities = entities.Where(e => fksunidades.Contains(e.PlanNegocioEvolutivoId));
                    }
                    if (parametros.TipoAcceso != 0)  //busqueda por tipo de acceso
                    {
                        entities = entities.Where(e => e.TipoAcceso == parametros.TipoAcceso);
                    }

                    var datos = entities.Select(x => new
                    {
                        PlanNegocioEvolutivoId = x.PlanNegocioEvolutivoId,
                        Titulo = x.Titulo,
                        propuesta = x.Propuesta.NombreTecnico,
                        ProyectoId = x.ProyectoId,
                        Proyecto = x.Proyecto.Nombre,
                        Tema = x.Tema,
                        OfertaDeValor = x.OfertaDeValor,
                        TipoAcceso = x.TipoAcceso,
                        AccesoPublico = x.TipoAcceso == 1 ? true : false,
                        TipoAccesoGI = x.TipoAccesoGI.Nombre,
                        FechaRegistro = x.FechaRegistro,
                        PlanNegocioEvolAutores = x.PlanNegocioEvolAutores.Select(aut => aut.ClavePersona + " " + aut.Nombre).ToList(),
                        estadoflujo = x.EstadoFlujo.Descripcion,
                        PlanNegocioEvolGerencias =
                         (from unidad in dbGI.DbSetUnidadOrganizacional
                          where x.PlanNegocioEvolGerencias.Select(g => g.ClaveUnidad).ToList().Contains(unidad.ClaveUnidad)
                                   && unidad.FechaEfectiva == dbGI.DbSetUnidadOrganizacional.Where(
                                                     p => p.FechaEfectiva <= fechaActual
                                                     && p.ClaveUnidad == unidad.ClaveUnidad
                                                     ).Max(e => e.FechaEfectiva)
                          select unidad.NombreUnidad).ToList()
                    }).ToList();

                    return datos;
                }

                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        /// <summary>
        /// Obtiene todos los planes de negocio por persona
        /// </summary>
        /// <returns>Object</returns>
        public async Task<IEnumerable<Object>> GetMisPlanesAnualesConsulta(PlanNegocioEvolutivo parametros)
        {
            try
            {
                var fechaActual = DateTime.Now;
                var entities = await dbGI.DbSetPlanNegocioEvolutivo
                    .Where(e => (e.EstadoFlujoId == 10 || e.EstadoFlujoId==6) && e.ClavePersona == parametros.ClavePersona)
                    .AsNoTracking()
                    .Include(x => x.PlanNegocioEvolAutores)
                    .Include(x => x.Propuesta)
                    .Include(x => x.Proyecto)
                    .Include(x => x.EstadoFlujo)
                    .Include(x => x.TipoAccesoGI)
                    .Select(x => new
                    {
                        x.PlanNegocioEvolutivoId,
                        x.Titulo,
                        propuesta = x.Propuesta.NombreTecnico,
                        x.ProyectoId,
                        Proyecto = x.Proyecto.Nombre,
                        x.Tema,
                        x.OfertaDeValor,
                        x.TipoAcceso,
                        AccesoPublico = x.TipoAcceso == 1 ? true : false,
                        TipoAccesoGI = x.TipoAccesoGI.Nombre,
                        x.FechaRegistro,
                        PlanNegocioEvolAutores = x.PlanNegocioEvolAutores.Select(aut => aut.ClavePersona + " " + aut.Nombre).ToList(),
                        estadoflujo = x.EstadoFlujo.Descripcion,
                        PlanNegocioEvolGerencias =
                         (from unidad in dbGI.DbSetUnidadOrganizacional
                          where x.PlanNegocioEvolGerencias.Select(g => g.ClaveUnidad).ToList().Contains(unidad.ClaveUnidad)
                                   && unidad.FechaEfectiva == dbGI.DbSetUnidadOrganizacional.Where(
                                                     p => p.FechaEfectiva <= fechaActual
                                                     && p.ClaveUnidad == unidad.ClaveUnidad
                                                     ).Max(e => e.FechaEfectiva)
                          select unidad.NombreUnidad).ToList()
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
        /// Obtener todos las claves de planes de negocio evolutivo
        /// </summary>
        /// <returns></returns>
        public async Task<List<int>> GetPlanesLikeNombreLatin1(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT PlanNegocioEvolutivoId FROM GI.tab_PlanNegocioEvolutivo where Titulo collate  Latin1_General_CI_AI LIKE ";
                //foreach (var palabra in palabras)
                //{
                    query = query + "'%" + likeNombre + "%' ";
                //}
                var resultados = await dbGI.Database.SqlQuery<int>(query).ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        /// <summary>
        /// Obtener todas las claves de propuestas relacionadas a un plan de negocio evolutivo
        /// </summary>
        /// <returns></returns>
        public async Task<List<int>> GetPropuestasLikeNombreLatin1(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT Id FROM GI.tab_Propuesta where NombreTecnico collate  Latin1_General_CI_AI LIKE ";
                //foreach (var palabra in palabras)
                //{
                    query = query + "'%" + likeNombre + "%' ";
                //}
                var resultados = await dbGI.Database.SqlQuery<int>(query).ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtener todas las claves de planes de negocio que contenga la oferta de valor buscada
        /// </summary>
        /// <returns></returns>
        public async Task<List<int>> GetPlanesByOferLikeNombreLatin1(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT PlanNegocioEvolutivoId FROM GI.tab_PlanNegocioEvolutivo where OfertaDeValor collate  Latin1_General_CI_AI LIKE '%" + likeNombre + "%' ";
                var resultados = await dbGI.Database.SqlQuery<int>(query).ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtener todas las claves de planes de negocio que esten asociadas con el autor buscado
        /// </summary>
        /// <returns></returns>
        public async Task<List<int>> GetPlanesByAutorLikeNombreLatin1(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT PlanNegocioEvolutivoId FROM GI.tab_PlanNegocioEvolAutores where Nombre collate  Latin1_General_CI_AI LIKE ";
                //foreach (var palabra in palabras)
                //{
                query = query + "'%" + likeNombre + "%' ";
                //}
                var resultados = await dbGI.Database.SqlQuery<int>(query).ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<PlanNegocioEvolutivo> GetById(int id)
        {
            try
            {
                var entities = await dbGI.DbSetPlanNegocioEvolutivo.AsNoTracking()
                    .Include(x => x.PlanNegocioEvolArchivos)
                    .Include("PlanNegocioEvolArchivos.Adjunto")
                    .Include(x => x.PlanNegocioEvolGerencias)
                    .Include(x => x.PlanNegocioEvolAutores)
                    .Include(x => x.Propuesta)
                    .Include(x => x.Proyecto)
                    .Include(x => x.TipoAccesoGI)
                    .FirstOrDefaultAsync(e => e.PlanNegocioEvolutivoId == id);
                if (entities != null && entities.PlanNegocioEvolGerencias!=null)
                {
                    UORepository uo = new UORepository();
                    var unidades= await uo.GetAllByCollectionCR( entities.PlanNegocioEvolGerencias.Select(x=>x.ClaveUnidad).ToList() );
                    foreach (var u in entities.PlanNegocioEvolGerencias)
                    {
                        var unidad= unidades.Find(x => x.ClaveUnidad.Equals(u.ClaveUnidad));
                        if (unidad != null)
                        {
                            u.NombreUnidad = unidad.NombreUnidad;
                        }

                    }
                }

                if(entities.ClavePersona!=null)
                {
                    PersonasRepository p= new PersonasRepository();
                    var persona= await p.GetByClaveFechaEfectiva(entities.ClavePersona);
                    entities.NombrePersona= persona.NombreCompleto;
                }

                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Devuelve los comentarios realizados por un mando medio al momento de evaluar un plan de negocio de manera INDIVIDUAL
        /// </summary>
        /// <param name="id">id del plan de negocio a buscar</param>
        /// <returns>Object</returns>
        public async Task<Object> GetComentariosSolicitudIndividualPlan(string id){
            try{
                var entitie= await dbGI.DbSetBitacoraSolicitudesGI
                            .Where(e=> e.Descripcion.Contains("plan de negocio evolutivo") && e.SolicitudId == 
                                        (dbGI.DbSetSolicitudGI
                                            .Where(x=> x.InformacionId == id && x.TipoInformacionId==31)  //31 es plan de negocio
                                            .Select(x=> x.SolicitudId)
                                            .FirstOrDefault() )
                             )
                            .OrderByDescending(e=>e.FechaMovimiento).FirstOrDefaultAsync();
                return entitie;
            }catch(Exception e){
                throw new Exception(e.Message,e);
            }
        }

        public async Task<Object> GetJustificacionPlanAceptado(string id)
        {
            try
            {
                // var solicitudId= await dbGI.DbSetSolicitudGI.AsNoTracking().Where(e=> e.InformacionId == id).Select(e=> e.SolicitudId).FirstOrDefaultAsync();
                var entitie = await dbGI.DbSetBitacoraSolicitudesGI
                            .Where(e => e.Descripcion.Contains("Aprobado el plan de negocio evolutivo") && e.EstadoFlujoId == 10 && e.SolicitudId ==
                                        (dbGI.DbSetSolicitudGI
                                            .Where(x => x.InformacionId == id && x.TipoInformacionId == 29)
                                            .Select(x => x.SolicitudId)
                                            .FirstOrDefault())
                             )
                            .OrderByDescending(e => e.FechaMovimiento).FirstOrDefaultAsync();
                return entitie;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Object> GetSolicitud(string id){
            try{
                var entitie= await dbGI.DbSetSolicitudGI.Where(x=> x.InformacionId == id && x.TipoInformacionId==31)
                                            .OrderByDescending(e=>e.FechaSolicitud)
                                            .FirstOrDefaultAsync();
                return entitie;
            }catch(Exception e){
                throw new Exception(e.Message,e);
            }
        }

        public async Task<PlanNegocioEvolutivo> getbyidPropuesta(int id)
        {
            try
            {
                var entities = await dbGI.DbSetPlanNegocioEvolutivo.AsNoTracking()
                    .Include(x => x.PlanNegocioEvolArchivos)
                    .Include("PlanNegocioEvolArchivos.Adjunto")
                    .Include(x => x.PlanNegocioEvolGerencias)
                    .Include(x => x.PlanNegocioEvolAutores)
                    .Include(x => x.Propuesta)
                    .Include(x => x.Proyecto)
                    .Include(x => x.TipoAccesoGI)
                    .FirstOrDefaultAsync(e => e.PropuestaClave == id);
                if (entities != null && entities.PlanNegocioEvolGerencias != null)
                {
                    UORepository uo = new UORepository();
                    var unidades = await uo.GetAllByCollectionCR(entities.PlanNegocioEvolGerencias.Select(x => x.ClaveUnidad).ToList());
                    foreach (var u in entities.PlanNegocioEvolGerencias)
                    {
                        var unidad = unidades.Find(x => x.ClaveUnidad.Equals(u.ClaveUnidad));
                        if (unidad != null)
                        {
                            u.NombreUnidad = unidad.NombreUnidad;
                        }

                    }
                }
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(PlanNegocioEvolutivo model, String clavePersona, String nombrePersona)
        {
            try
            {
                var fecha = DateTime.Now;
                if (model != null && model.PlanNegocioEvolArchivos!=null && model.PlanNegocioEvolArchivos.Count() > 0)
                {

                    foreach (var a in model.PlanNegocioEvolArchivos)
                    {
                        a.Fecha = fecha;
                    }
                }

                dbGI.DbSetPlanNegocioEvolutivo.Add(model);
                await dbGI.SaveChangesAsync();
                await this.AddBitacoraMovimiento(model, clavePersona, nombrePersona, "Creación del registro");
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task UpdateTipoAcceso(PlanNegocioEvolutivo model, String clavePersona, String nombrePersona)
        {
            try
            {
                var _model = await dbGI.DbSetPlanNegocioEvolutivo.FirstOrDefaultAsync(e => e.PlanNegocioEvolutivoId == model.PlanNegocioEvolutivoId);
                if (_model != null)
                {
                    _model.TipoAcceso = model.TipoAcceso;
                    _model.TipoAccesoGI = null;
                    //if(model.TipoAcceso==1 && model.EstadoFlujoId == 10){
                    //    NuevoOCRepository nuevo = new NuevoOCRepository();
                    //    await nuevo.Create(new NuevoOC("GI", "II", _model.Titulo,
                    //    "indexGI.html#/buscarIdeaInnovadoraDetalles/" + _model.PlanNegocioEvolutivoId,
                    //     _model.PlanNegocioEvolutivoId.ToString()
                    //    ));
                    //}
                    await dbGI.SaveChangesAsync();
                    await this.AddBitacoraMovimiento(model, clavePersona, nombrePersona, "Se cambia el tipo de acceso (" + model.TipoAcceso + ")");
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task Update(PlanNegocioEvolutivo model, String clavePersona, String nombrePersona)
        {
            try
            {
                var _model = await dbGI.DbSetPlanNegocioEvolutivo.FirstOrDefaultAsync(e => e.PlanNegocioEvolutivoId == model.PlanNegocioEvolutivoId);
                if (_model != null)
                {
                    var fecha = DateTime.Now;
                    dbGI.Entry(_model).CurrentValues.SetValues(model);
                    await dbGI.SaveChangesAsync();

                    await this.UpdateArchivos(model);
                    await this.UpdateGerencias(model);
                    await this.UpdateAutores(model);

                    await this.AddBitacoraMovimiento(model, clavePersona, nombrePersona, "Actualización del registro");
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        private async Task AddBitacoraMovimiento(PlanNegocioEvolutivo model,
            String clavePersona, String nombrePersona, String movimiento)
        {
            try
            {
                if (model != null)
                {
                    var fecha = DateTime.Now;

                    BitacoraMovimientosGI bita = new BitacoraMovimientosGI();
                    bita.Fecha = fecha;
                    bita.ClavePersona = clavePersona;
                    bita.Movimiento = movimiento;
                    bita.OcsId = "PNE";
                    bita.RegistroId = model.PlanNegocioEvolutivoId;
                    dbGI.DbSetBitacoraMovimientosGI.Add(bita);
                    await dbGI.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        private async Task UpdateGerencias(PlanNegocioEvolutivo model)
        {
            try
            {
                var _model = await dbGI.DbSetPlanNegocioEvolutivo
                    .Include(x=>x.PlanNegocioEvolGerencias)
                    .FirstOrDefaultAsync(e => e.PlanNegocioEvolutivoId == model.PlanNegocioEvolutivoId);
                if (_model != null)
                {
                    if (model.PlanNegocioEvolGerencias != null && model.PlanNegocioEvolGerencias.Count() > 0)
                    {


                        PlanNegocioEvolGerenciasRepository gerDB = new PlanNegocioEvolGerenciasRepository(dbGI);
                        foreach (var g in model.PlanNegocioEvolGerencias)
                        {
                            if (g.Id < 1)//nuevo
                            {
                                await gerDB.Create(g);
                            }
                            else
                            {
                                if (g.ClaveUnidad.Equals("eliminar"))
                                {
                                    await gerDB.Delete(g.Id);
                                }
                                else
                                { //await gerDB.Update(g);
                                }

                                }

                        }
                    }
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        private async Task UpdateAutores(PlanNegocioEvolutivo model)
        {
            try
            {
                var _model = await dbGI.DbSetPlanNegocioEvolutivo
                    .Include(x => x.PlanNegocioEvolAutores)
                    .FirstOrDefaultAsync(e => e.PlanNegocioEvolutivoId == model.PlanNegocioEvolutivoId);
                if (_model != null)
                {
                    if (model.PlanNegocioEvolAutores != null && model.PlanNegocioEvolAutores.Count() > 0)
                    {

                        PlanNegocioEvolAutoresRepository gerDB = new PlanNegocioEvolAutoresRepository(dbGI);
                        foreach (var e in model.PlanNegocioEvolAutores)
                        {
                            if (e.Id < 1)//nuevo
                            {
                                await gerDB.Create(e);
                            }
                            else
                            {
                                if (e.Nombre==null)
                                {
                                    ////

                                }else
                                {
                                    if (e.Nombre.Equals("eliminar") || e.ClavePersona.Equals("eliminar"))
                                    {
                                        await gerDB.Delete(e.Id);
                                    }
                                    else
                                    {//await gerDB.Update(e);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        private async Task UpdateArchivos(PlanNegocioEvolutivo model)
        {
            try
            {
                var _model = await dbGI.DbSetPlanNegocioEvolutivo
                    .Where(e => e.PlanNegocioEvolutivoId == model.PlanNegocioEvolutivoId)
                    .Include(x => x.PlanNegocioEvolArchivos)
                    .FirstOrDefaultAsync();
                if (_model != null)
                {
                    if (model.PlanNegocioEvolArchivos != null && model.PlanNegocioEvolArchivos.Count() > 0)
                    {

                        //string regNew = JsonConvert.SerializeObject(model.PlanNegocioEvolArchivos);
                        //string regAnt = JsonConvert.SerializeObject(_model.PlanNegocioEvolArchivos);
                        //if (regAnt.Equals(regNew))
                        //{
                        //    return;
                        //}

                        PlanNegocioEvolArchivosRepository gerDB = new PlanNegocioEvolArchivosRepository(dbGI);
                        var fecha = DateTime.Now;
                        foreach (var e in model.PlanNegocioEvolArchivos)
                        {
                            if (e.Id < 1)//nuevo
                            {
                                e.Fecha = fecha;
                                e.PlanNegocioEvolutivoId = model.PlanNegocioEvolutivoId;
                                await gerDB.Create(e);
                            }
                            else
                            {
                                if (e.Adjunto!=null && e.Adjunto.nombre.Equals("eliminar"))
                                {
                                 await gerDB.Delete(e.Id);
                                }
                                //else
                                //    //await gerDB.Update(e);
                            }

                        }
                    }
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
                var _model = await dbGI.DbSetPlanNegocioEvolutivo.FirstOrDefaultAsync(e => e.PlanNegocioEvolutivoId == id);
                if (_model != null)
                {
                    dbGI.DbSetPlanNegocioEvolutivo.Remove(_model);
                    await dbGI.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task UpdateEstado(PlanNegocioEvolutivo model)
        {
            try
            {
                var _model = await dbGI.DbSetPlanNegocioEvolutivo.FirstOrDefaultAsync(e => e.PlanNegocioEvolutivoId == model.PlanNegocioEvolutivoId);
                if (_model != null)
                {
                    _model.EstadoFlujoId = model.EstadoFlujoId;
                    await dbGI.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public void Dispose()
        {
            dbGI.Dispose(); //ayudar al recolector de basura
        }

    }
}
