using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories.CR;
using INEEL.DataAccess.GEN.Util;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Dynamic;
using System.Text;
using System.Threading.Tasks;
using log4net.Util;
using INEEL.DataAccess.CR.Models;

namespace INEEL.DataAccess.GEN.Repositories
{

    /// <summary>
    /// Clase ProyectoRepository, repositorio para el catalogo de proyectos.
    /// </summary>
    public class ProyectoRepository : IDisposable
    {
        /// <summary>
        /// contexto para la conexión de CH. 
        /// </summary>
        GEN_Context _ctx;
        SubprogramaProyectosVentas subprogramas;

        /// <summary>
        /// Contrucctor de la clase ProyectoRepository
        /// </summary>
        public ProyectoRepository()
        {
            _ctx = new GEN_Context();
            _ctx.Database.Log = Escribe.Write;
            subprogramas = new SubprogramaProyectosVentas();
        }

        //Uso exclusivo para el modal de proyectos [el cual es generico]
        public async Task<Object> getData(DataServerSide ss)
        {
            try
            {
                var dat = (from p in _ctx.dbSetProyectoGEN.AsNoTracking()
                           where ss.ListaSubprogramas.Contains(p.SubPrograma)
                           select new
                           {
                               ProyectoId = p.ProyectoId,
                               Nombre = p.Nombre,
                               ClaveUnidad = p.UnidadOrganizacionalId,
                               NumjefeProyecto = p.NumjefeProyecto,
                               SubPrograma = p.SubPrograma,
                               p.EmpresaId
                           });


                //Prefiltros: son especificos por cada modulo, al momento solo CR aplica
                if (!String.IsNullOrEmpty(ss.moduloBusqueda) && ss.moduloBusqueda.Equals("CR"))
                {
                    dat = dat.Where(e => e.EmpresaId != null && e.EmpresaId!=57); //Proyectos que no sean del INEEL
                }

                //Total de registros filtrados
                ss.recordsTotal = dat.ToList().Count();

                if (!String.IsNullOrEmpty(ss.proyectoId)) //busqueda por numero de proyecto
                {
                    var id = ss.proyectoId.ToUpper();
                    dat = dat.Where(x => x.ProyectoId.Contains(id));

                }

                if (!String.IsNullOrEmpty(ss.NombreProyecto)) //busqueda por nombre de proyecto
                {
                    var idProyectos = await GetAllProyectsByLikeNombreLatin1(ss.NombreProyecto);
                    dat = dat.Where(x => idProyectos.Contains(x.ProyectoId));
                }

                if (!String.IsNullOrEmpty(ss.searchValue)) //busqueda por la caja de filtro
                {
                    var idProyectos = await GetAllProyectsByLikeNombreLatin1(ss.searchValue);
                    var clavesProyectos = await GetAllProyectsByClaveProyecto(ss.searchValue);
                    dat = dat.Where(x => idProyectos.Contains(x.ProyectoId) || clavesProyectos.Contains(x.ProyectoId));
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

        public async Task<Object> busquedaProyectos(DataServerSide ss)
        {
            try
            {
                var dat = (from p in _ctx.dbSetProyectoGEN.Include(e => e.Empresa).AsNoTracking()
                           where ss.ListaSubprogramas.Contains(p.SubPrograma)
                           select new
                           {
                               p.ProyectoId,
                               p.Nombre,
                               ClaveUnidad = p.UnidadOrganizacionalId,
                               p.NumjefeProyecto,
                               p.SubPrograma,
                               p.EmpresaId,
                               NombreEmpresa = p.Empresa.NombreEmpresa,
                               p.UnidadOrganizacionalId,
                               NombreUnidad = (_ctx.dbSetUnidadOrganizacional.Where(x => x.ClaveUnidad == p.UnidadOrganizacionalId
                                    && x.FechaEfectiva == _ctx.dbSetUnidadOrganizacional
                                                                    .Where(f => f.FechaEfectiva <= DateTime.Now
                                                                    && f.ClaveUnidad == x.ClaveUnidad)
                                                                    .Max(f => f.FechaEfectiva)
                                      ).Select(x => x.NombreUnidad).FirstOrDefault())
                           });

                ss.recordsTotal = dat.ToList().Count();

                if (!String.IsNullOrEmpty(ss.proyectoId)) //busqueda por numero de proyecto
                {
                    var id = ss.proyectoId.ToUpper();
                    dat = dat.Where(x => x.ProyectoId == id);

                }

                if (!String.IsNullOrEmpty(ss.NombreProyecto)) //busqueda por nombre de proyecto
                {
                    var idProyectos = await GetAllProyectsByLikeNombreLatin1(ss.NombreProyecto);
                    dat = dat.Where(x => idProyectos.Contains(x.ProyectoId));
                }

                if (!String.IsNullOrEmpty(ss.searchValue)) //busqueda por la caja de filtro
                {
                    var idProyectos = await GetAllProyectsByLikeNombreLatin1(ss.searchValue);
                    var clavesProyectos = await GetAllProyectsByClaveProyecto(ss.searchValue);
                    dat = dat.Where(x => idProyectos.Contains(x.ProyectoId)
                                        || clavesProyectos.Contains(x.ProyectoId)
                                        || x.NombreEmpresa.Contains(ss.searchValue)
                                        || x.NombreUnidad.Contains(ss.searchValue));
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

        /***Busca por la clave del proyecto, utilizando una colacion insensible a acentos y mayusculas */
        public async Task<List<String>> GetAllProyectsByClaveProyecto(String likeNombre)
        {
            try
            {
                var resultados = await _ctx.Database.SqlQuery<String>
                ("SELECT DISTINCT ProyectoId FROM GEN.Proyectos where ProyectoId collate Latin1_General_CI_AI LIKE '%" + likeNombre + "%'").ToListAsync(); //WHERE ClavePersona like '%"+likeNombre+"%'"
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /***Busca por la clave del proyecto, utilizando una colacion insensible a acentos y mayusculas */
        public async Task<List<String>> GetAllProyectsByLikeNombreLatin1(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT ProyectoId FROM (Select REPLACE(Nombre, ' ', '') as Nombre, ProyectoId from[GEN].[Proyectos]) t1 where Nombre collate Latin1_General_CI_AI LIKE '%";
                foreach (var palabra in palabras)
                {
                    query += palabra + "%' and Nombre collate Latin1_General_CI_AI LIKE '%";
                }
                query = query.Substring(0, query.Length - 47);
                var resultados = await _ctx.Database.SqlQuery<String>(query).ToListAsync();
                return resultados;
                // var resultados = await _ctx.Database.SqlQuery<String>
                //("SELECT DISTINCT ProyectoId FROM GEN.Proyectos where Nombre collate  Latin1_General_CI_AI LIKE '%" + likeNombre + "%'").ToListAsync(); //WHERE ClavePersona like '%"+likeNombre+"%'"
                // return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtiene la lista de los numero de proyecto registrados en la base de datos.
        /// </summary>
        /// <returns></returns>
        public async Task<List<String>> GetAllNumerosProyecto()
        {
            try
            {
                var proyectos = await _ctx.dbSetProyectoGEN.AsNoTracking()
                    .Select(x => x.ProyectoId)
                    .ToListAsync();
                return proyectos;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        /// <summary>
        /// Obtiene la lista de los numero de proyecto registrados en la base de datos. Aplicando trim a cada elemento
        /// </summary>
        /// <returns></returns>
        public async Task<List<String>> GetAllNumerosProyectoTRIM()
        {
            try
            {
                var proyectos = await _ctx.dbSetProyectoGEN.AsNoTracking()
                    .Select(x => x.ProyectoId.Trim())
                    .ToListAsync();
                return proyectos;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<Object> GetProyectosForDetailsBusqueda(busquedaAv parametro)
        {
            try
            {
                var listaPreliminar = parametro.FieldD.Trim().Split(',').ToList();
                listaPreliminar.Remove("");

                var proyectos = await _ctx.dbSetProyectoGEN.Where(x => listaPreliminar.Contains(x.ProyectoId)).AsNoTracking()
                .Select(x => new
                {
                    id = x.ProyectoId,
                    Nombre = x.Nombre,
                })
                .ToListAsync();

                return proyectos;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<int> countClientesUnidades()
        {
            try
            {

                var proyectos = await _ctx.dbSetProyectoGEN.Where(e => subprogramas.subprogramas.Contains(e.SubPrograma) && e.Estado == true
                                                                 && e.EmpresaId != 57 && e.EmpresaId != null).Select(e => e.ClaveUnidadEmpresa).Distinct().AsNoTracking().CountAsync();
                //var proyectos = await (from proyecto in _ctx.dbSetProyectoGEN.AsNoTracking()
                //                       where subprogramas.subprogramas.Contains(proyecto.SubPrograma)
                //                            && proyecto.Estado == true && proyecto.EmpresaId != 57 && proyecto.EmpresaId != null
                //                            && proyecto.ClaveUnidadEmpresa != null
                //                       select proyecto
                //                       }).CountAsync();
                return proyectos;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<int> countDistinctEmpresaOfProyecto(Boolean estadoFlujo)
        {
            try
            {
                return await (from t in _ctx.dbSetProyectoGEN
                                  .Where(f => f.EmpresaId != null)
                                  //.Where(f => f.Estado == estadoFlujo)
                              select t.EmpresaId).Distinct().CountAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        /// <summary>
        /// Facturación planeada por gerencia
        /// de acuerdo a datos de proyectos
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<Object>> FacturacionPlaneadaGroupByUnidad(int year)
        {
            try
            {
                var proyectos = await _ctx.dbSetProyectoGEN.AsNoTracking()
                    .ToListAsync();
                var fechaActual = DateTime.Now;
                var joinproyectoUnidadReal = from p in _ctx.dbSetProyectoGEN
                                             from u in _ctx.dbSetUnidadOrganizacional
                                             where u.FechaEfectiva == _ctx.dbSetUnidadOrganizacional.Where(
                                                                           p => p.FechaEfectiva <= fechaActual
                                                                           && p.ClaveUnidad == u.ClaveUnidad
                                                                           ).Max(e => e.FechaEfectiva)
                                             where p.UnidadOrganizacionalId.Equals(u.ClaveUnidad)
                                             && p.FechaFin.Year == year
                                             select new
                                             {
                                                 UnidadOrganizacionalId = p.UnidadOrganizacionalId,
                                                 NombreUnidad = u.NombreUnidad,
                                                 FacturacionPlaneada = p.FacturacionPlaneada
                                             };

                var result = await joinproyectoUnidadReal
                    .GroupBy(p => p.UnidadOrganizacionalId)
                    .Select(cl => new
                    {
                        Name = cl.FirstOrDefault().NombreUnidad,
                        Quantity = cl.Count().ToString(),
                        Total = cl.Sum(c => c.FacturacionPlaneada) == null ? 0 : cl.Sum(c => c.FacturacionPlaneada),
                    }).ToListAsync();

                return result;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Facturación real por gerencia
        /// de acuerdo a datos de proyectos
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<Object>> FacturacionRealGroupByUnidad(int year)
        {
            try
            {
                var proyectos = await _ctx.dbSetProyectoGEN.AsNoTracking()
                    .ToListAsync();
                var fechaActual = DateTime.Now;
                var joinproyectoUnidadReal = from p in _ctx.dbSetProyectoGEN
                                             from u in _ctx.dbSetUnidadOrganizacional
                                             where u.FechaEfectiva == _ctx.dbSetUnidadOrganizacional.Where(
                                                                           p => p.FechaEfectiva <= fechaActual
                                                                           && p.ClaveUnidad == u.ClaveUnidad
                                                                           ).Max(e => e.FechaEfectiva)
                                             where p.UnidadOrganizacionalId.Equals(u.ClaveUnidad)
                                             && p.FechaFin.Year == year
                                             select new
                                             {
                                                 UnidadOrganizacionalId = p.UnidadOrganizacionalId,
                                                 NombreUnidad = u.NombreUnidad,
                                                 FacturacionReal = p.FacturacionReal
                                             };

                var result = await joinproyectoUnidadReal
                    .GroupBy(p => p.UnidadOrganizacionalId)
                    .Select(cl => new
                    {
                        Name = cl.FirstOrDefault().NombreUnidad,
                        Quantity = cl.Count().ToString(),
                        Total = cl.Sum(c => c.FacturacionReal) == null ? 0 : cl.Sum(c => c.FacturacionReal),
                    }).ToListAsync();
                //.OrderByDescending(x => x.Total);
                //var result = query.ToList();


                return result;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        /// <summary>
        /// Agrupa los proyectos por gerencia
        /// y los cuenta, de acuerdo al año especificado
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<CountModel>> countGroupByUnidad(int year)
        {
            try
            {
                var proyectos = await _ctx.dbSetProyectoGEN.AsNoTracking()
                    .ToListAsync();
                var fechaActual = DateTime.Now;
                var joinproyectoUnidad = from p in _ctx.dbSetProyectoGEN
                                         from u in _ctx.dbSetUnidadOrganizacional
                                         where u.FechaEfectiva == _ctx.dbSetUnidadOrganizacional.Where(
                                                                       p => p.FechaEfectiva <= fechaActual
                                                                       && p.ClaveUnidad == u.ClaveUnidad
                                                                       ).Max(e => e.FechaEfectiva)
                                         where p.UnidadOrganizacionalId.Equals(u.ClaveUnidad)
                                         && p.FechaFin.Year == year
                                         select new { p, u, NombreUnidad = u.NombreUnidad };

                var queryCount = _ctx.dbSetProyectoGEN.AsNoTracking()
                    .Where(x => x.FechaInicio.Year == year)
               .GroupBy(p => p.UnidadOrganizacionalId)
               .Select(g => new { UnidadOrganizacionalId = g.Key, count = g.Count() });

                var query = from pu in joinproyectoUnidad
                            from uCount in queryCount
                            where pu.p.UnidadOrganizacionalId.Equals(uCount.UnidadOrganizacionalId)
                            select new { Name = pu.u.NombreUnidad, Count = uCount.count, Id = pu.p.UnidadOrganizacionalId };


                var queryFinal = from conteo in query
                                 from u in _ctx.dbSetUnidadOrganizacional
                                 where u.FechaEfectiva == _ctx.dbSetUnidadOrganizacional.Where(
                                                               p => p.FechaEfectiva <= fechaActual
                                                               && p.ClaveUnidad == u.ClaveUnidad
                                                               ).Max(e => e.FechaEfectiva)

                                 where u.ClaveUnidad.Equals(conteo.Id)
                                 orderby conteo.Count descending
                                 select new CountModel { Name = u.NombreUnidad, Id = u.ClaveUnidad, Count = conteo.Count };



                var result = await queryFinal.AsNoTracking().ToListAsync();
                result = result.Distinct(new ComparerCountModel()).ToList();
                return result;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        /// <summary>
        /// Obtiene la lista de los proyectos registrados en la base de datos.
        /// Catalogo de proyectos CH
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<Proyecto>> GetAll()
        {
            try
            {
                var proyectos = await _ctx.dbSetProyectoGEN.AsNoTracking().ToListAsync();
                return proyectos;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        //TODO: de ejemplo:
        public async Task<IEnumerable<Proyecto>> GetAllLikeNombre(String likeNombre)
        {
            try
            {
                var proyectos = await _ctx.dbSetProyectoGEN.AsNoTracking()
                    .Where(x => x.Nombre.Contains(likeNombre))
                    .ToListAsync();
                return proyectos;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        /// <summary>
        /// Obtiene la lista de los proyectos registrados en la base de datos con el numJefe especifico.
        /// Catalogo de proyectos CH
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<Proyecto>> GetByNumJefe(string numJefe)
        {
            try
            {
                var proyectos = await _ctx.dbSetProyectoGEN.Where(e => e.NumjefeProyecto == numJefe).Select(x => x).AsNoTracking().ToListAsync();
                return proyectos;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Proyecto> GetByIdFKs(string proyectoId)
        {
            try
            {
                var proyecto = await _ctx.dbSetProyectoGEN.AsNoTracking()
                    .Include(x => x.Contacto)
                    .Include(x => x.Empresa)
                    .FirstOrDefaultAsync(e => e.ProyectoId == proyectoId);
                return proyecto;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        /// <summary>
        /// Obtiene un proyecto en especifico, el filtro es el id del proyecto requerido. 
        ///  Catalogo de proyectos CH
        /// </summary>
        /// <param name="proyectoId"> Id del proyecto requerido</param>
        /// <returns>Proyecto</returns>
        public async Task<Proyecto> GetById(string proyectoId)
        {
            try
            {
                var proyecto = await _ctx.dbSetProyectoGEN.AsNoTracking().FirstOrDefaultAsync(e => e.ProyectoId == proyectoId);
                return proyecto;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Proyecto> GetDatosProyectoForModal(string proyectoId)
        {
            try
            {
                var proyect = await _ctx.dbSetProyectoGEN
                    .Include(e => e.Empresa)
                    .AsNoTracking().FirstOrDefaultAsync(e => e.ProyectoId == proyectoId);

                UORepository uo = new UORepository();
                proyect.UnidadOrganizacional = await uo.GetByIdWithFather(proyect.UnidadOrganizacionalId);

                return proyect;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Agrega un objeto tipo proyecto al catalogo de Proyectos. 
        /// Catalogo de proyectos CH
        /// </summary>
        /// <param name="proyecto">Objeto tipo Proyecto</param>
        /// <returns></returns>
        public async Task Create(Proyecto proyecto)
        {
            try
            {
                _ctx.dbSetProyectoGEN.Add(proyecto);
                await _ctx.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /*
        /// <summary>
        /// Actualiza la información del objeto proyecto. 
        /// Catalogo de proyectos CH
        /// </summary>
        /// <param name="proyecto"></param>
        /// <returns></returns>
        /// 
        public async Task Update(Proyecto proyecto)
        {
            try
            {
                var _proyecto = await _ctx.dbSetProyectoGEN.FirstOrDefaultAsync(e => e.ProyectoId == proyecto.ProyectoId);
                if (_proyecto != null)
                {
                    //_ctx.Entry(_proyecto).CurrentValues.SetValues(proyecto);

                    _proyecto.Nombre = proyecto.Nombre;
                    _proyecto.NumjefeProyecto = proyecto.NumjefeProyecto;
                    _proyecto.NombreJefeProyecto = proyecto.NombreJefeProyecto;
                    _proyecto.FechaInicio = proyecto.FechaInicio;
                    _proyecto.FechaFin = proyecto.FechaFin;
                    _proyecto.Gerencia = proyecto.Gerencia;
                    _proyecto.SubPrograma = proyecto.SubPrograma;
                    _proyecto.Estado = proyecto.Estado;

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }*/

        /// <summary>
        /// Elimina un registro del catalogo de proyectos. 
        /// Catalogo de poyectos CH
        /// </summary>
        /// <param name="proyectoId">filtro par eliminar el registro</param>
        /// <returns></returns>
        public async Task Delete(string proyectoId)
        {
            try
            {
                var _proyecto = await _ctx.dbSetProyectoGEN.FirstOrDefaultAsync(e => e.ProyectoId == proyectoId);
                if (_proyecto != null)
                {
                    _ctx.dbSetProyectoGEN.Remove(_proyecto);
                    await _ctx.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Object>> GetProyectos(List<String> subProgramas, String id, String nombre)
        {
            try
            {
                if (!String.IsNullOrEmpty(id))
                {
                    id = id.ToLower();
                    var entities = await _ctx.dbSetProyectoGEN.AsNoTracking()
                    .Where(x => subProgramas.Contains(x.SubPrograma))
                    //.Where(x => x.ProyectoId.ToLower() == id)
                    .Where(x => x.ProyectoId.Contains(id))
                    .Select(x => new
                    {
                        ProyectoId = x.ProyectoId,
                        Nombre = x.Nombre,
                        ClaveUnidad = x.UnidadOrganizacionalId,
                        NumjefeProyecto = x.NumjefeProyecto
                    })
                    //.Where(x => x.Estado == true)
                    .ToListAsync();
                    return entities;
                }
                else if (!String.IsNullOrEmpty(nombre))
                {
                    var idProyectos = await GetAllProyectsByLikeNombreLatin1(nombre);
                    nombre = nombre.ToLower();
                    var entities = await _ctx.dbSetProyectoGEN.AsNoTracking()
                    .Where(x => subProgramas.Contains(x.SubPrograma) && idProyectos.Contains(x.ProyectoId)
                  /*  && x.Estado == true*/)
                   .Select(x => new
                   {
                       ProyectoId = x.ProyectoId,
                       Nombre = x.Nombre,
                       ClaveUnidad = x.UnidadOrganizacionalId,
                       NumjefeProyecto = x.NumjefeProyecto
                   })
                    .ToListAsync();
                    return entities;
                }
                else
                {
                    var entities = await _ctx.dbSetProyectoGEN.AsNoTracking()
                    .Where(x => subProgramas.Contains(x.SubPrograma))
                   .Select(x => new
                   {
                       ProyectoId = x.ProyectoId,
                       Nombre = x.Nombre,
                       ClaveUnidad = x.UnidadOrganizacionalId,
                       NumjefeProyecto = x.NumjefeProyecto
                   })
                    .ToListAsync();
                    return entities;
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<List<String>> GetAllProyectsByLikeNombreLatin2(String likeNombre, String param2)
        {
            try
            {
                var resultados = await _ctx.Database.SqlQuery<String>
               ("SELECT DISTINCT ProyectoId FROM GEN.Proyectos where Nombre collate  Latin1_General_CI_AI LIKE '%" + likeNombre + "%' AND  Nombre collate  Latin1_General_CI_AI LIKE '%" + param2 + "%' ").ToListAsync(); //WHERE ClavePersona like '%"+likeNombre+"%'"
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Object>> GetProyectos(List<String> subProgramas, String like)
        {
            try
            {
                if (!String.IsNullOrEmpty(like))
                {
                    var idProyectos = await GetAllProyectsByLikeNombreLatin1(like);
                    var entities = await _ctx.dbSetProyectoGEN
                    .Where(x => subProgramas.Contains(x.SubPrograma) && (x.ProyectoId.ToLower().Contains(like) || idProyectos.Contains(x.ProyectoId) /*x.Nombre.ToLower().Contains(like)*/))
                    .OrderBy(x => x.ProyectoId)
                    .Select(x => new { ProyectoId = x.ProyectoId, Nombre = x.Nombre })
                    .Skip(0).Take(20)
                    .AsNoTracking()
                    .ToListAsync();
                    return entities;
                }
                else return null;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public void Dispose()
        {
            ((IDisposable)_ctx).Dispose();
        }
    }
}
