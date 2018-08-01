using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GI;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Linq;
using System;
using INEEL.DataAccess.GEN.Util;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.GEN.Repositories.GI
{
    public class TecnologiaLicenciadaRepository
    {

        private GI_Context dbGI;
        private PI_Context dbPI;
        private GEN_Context dbGEN;
        public TecnologiaLicenciadaRepository()
        {
            dbGI = new GI_Context();
            dbGI.Database.Log = Escribe.Write;
            dbPI = new PI_Context();
            dbGEN = new GEN_Context();
        }
        public async Task<int> CountSTL()
        {
            try
            {
                var entities = await dbGI.DbSetTecnologiaLicenciada
                    .AsNoTracking()
                    .Where(x => x.EstadoLicenciamientoId != 0)
                    .CountAsync();

                return entities;

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
                var entities = await dbGI.DbSetTecnologiaLicenciada
                    .Include(x => x.EstadoLicenciamiento)
                    .Include(x => x.Gerencias)
                    .Where(x => x.EstadoLicenciamientoId != 0)
                    .AsNoTracking()
                    .Select(x => new
                    {
                        TecnologiaLicenciadaId = x.TecnologiaLicenciadaId,
                        Numero = x.Numero,
                        NombreTecnologiaLic = x.NombreTecnologiaLic,
                        EstadoLicenciamientoId = x.EstadoLicenciamientoId,
                        EstadoLicenciamiento = x.EstadoLicenciamiento.Descripcion,
                        NombreReceptor = x.NombreReceptor,
                        tipoPI = "pendiente",
                        GerenciasNombre = (from unidad in dbGI.DbSetUnidadOrganizacional
                                           where x.Gerencias.Select(g => g.ClaveUnidad).ToList().Contains(unidad.ClaveUnidad)
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
        public async Task<IEnumerable<Object>> GetAll()
        {
            try
            {
                var fechaActual = DateTime.Now;
                var entities = await dbGI.DbSetTecnologiaLicenciada
                    .Include(x => x.EstadoLicenciamiento)
                    .Include(x => x.Gerencias)
                    .AsNoTracking()
                    .Select(x => new
                    {
                        TecnologiaLicenciadaId = x.TecnologiaLicenciadaId,
                        Numero = x.Numero,
                        NombreTecnologiaLic = x.NombreTecnologiaLic,
                        EstadoLicenciamientoId = x.EstadoLicenciamientoId,
                        EstadoLicenciamiento = x.EstadoLicenciamiento.Descripcion,
                        NombreReceptor = x.NombreReceptor,
                        tipoPI = "pendiente",
                        GerenciasNombre = (from unidad in dbGI.DbSetUnidadOrganizacional
                                           where x.Gerencias.Select(g => g.ClaveUnidad).ToList().Contains(unidad.ClaveUnidad)
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


        public async Task<IEnumerable<Object>> ListaTipoPropiedadIndustrial()
        {
            try
            {
                var res = await dbPI.TipoPropiedadIndustrial.Where(e => e.Estado == true).AsNoTracking().Select(e => new
                {
                    id = e.TipoPropiedadIndustrialId,
                    nombre = e.DescripcionCorta
                }).ToListAsync();

                return res;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<Object>> ListaEstadoLicenciamiento()
        {
            try
            {
                var res = await dbGI.DbSetEstadoLicenciamiento.AsNoTracking().Select(e => new
                {
                    id = e.Id,
                    nombre = e.Descripcion
                }).ToListAsync();

                return res;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Object>> GetAllConsultaParametrizadaTecnologia(TecnologiaLicenciada parametros)
        {
            try
            {
                var fechaActual = DateTime.Now;
                var entities = dbGI.DbSetTecnologiaLicenciada
                    .Include(x => x.EstadoLicenciamiento)
                    .Include(x => x.Gerencias)
                    .Include(x => x.TecnologiaLicenciadaPIPIndustrial)
                    .AsNoTracking();

                //lista de los tipos de propiedad industrial
                var listaTipoPI = await dbPI.TipoPropiedadIndustrial.Where(e => e.Estado == true).Select(x => new
                {
                    idTipo = x.TipoPropiedadIndustrialId,
                    nombre = x.DescripcionCorta
                }).AsNoTracking().ToListAsync();

                if (entities != null)
                {
                    if (!String.IsNullOrEmpty(parametros.NombreTecnologiaLic)) //busqueda por nombre de la tecnologia licenciada
                    {
                        var listaFK = await GetTecnologiasLikeNombreLatin1(parametros.NombreTecnologiaLic);
                        entities = entities.Where(e => listaFK.Contains(e.TecnologiaLicenciadaId));
                    }
                    if (!String.IsNullOrEmpty(parametros.NombreReceptor))  //busqueda por el nombre del receptor
                    {
                        var listaFK = await GetReceptoresTecnologiaLikeNombreLatin1(parametros.NombreReceptor);
                        entities = entities.Where(e => listaFK.Contains(e.TecnologiaLicenciadaId));
                    }
                    if (!String.IsNullOrEmpty(parametros.ClaveUnidad))  //busqueda por clave de unidad
                    {
                        var fks = await (from pi in dbGI.DbSetTecnologiaLicenciadaGerencia.AsNoTracking()
                                         where pi.ClaveUnidad == parametros.ClaveUnidad
                                         select pi.TecnologiaLicenciadaId).ToListAsync();

                        entities = entities.Where(e => fks.Contains(e.TecnologiaLicenciadaId));
                    }
                    if (!String.IsNullOrEmpty(parametros.estado))  //busqueda por estado del licenciamiento
                    {
                        var id = Convert.ToInt32(parametros.estado);
                        entities = entities.Where(e => e.EstadoLicenciamientoId == id);
                    }
                    if (!string.IsNullOrEmpty(parametros.Busqueda))
                    {
                        entities = entities.Where(e => e.EstadoLicenciamientoId != 0);
                    }
                    if (parametros.TipoPropiedadIndustrialId != 0 && parametros.TipoPropiedadIndustrialId != 9999) //busqueda por tipo de propiedad industrial
                    {
                        //Entity framework no soporta joins entre diferentes contextos de aplicacion, por eso la consulta se hace de la siguiente forma

                        //propiedad industrial que sea del tipo pi buscado
                        var fksPI = await (from pi in dbPI.PropiedadIndustrial.AsNoTracking()
                                           where pi.EsPropiedadInstituto == true
                                                && pi.TipoPropiedadIndustrialId == parametros.TipoPropiedadIndustrialId
                                           select pi.PropiedadIndustrialId).ToListAsync();


                        var registros = await (from gi in dbGI.DbSetTecnologiaLicenciadaPIPIndustrial.AsNoTracking()
                                               where fksPI.Contains(gi.PropiedadIndustrialId)
                                               select gi.TecnologiaLicenciadaId).ToListAsync();

                        entities = entities.Where(e => registros.Contains(e.TecnologiaLicenciadaId));

                    }
                    if (parametros.TipoPropiedadIndustrialId == 9999)  //busqueda por derechos de autor
                    {
                        var clavesDA = await (from da in dbGI.DbSetTecnologiaLicenciadaPIDA.AsNoTracking()
                                              select da.TecnologiaLicenciadaId).ToListAsync();
                        entities = entities.Where(e => clavesDA.Contains(e.TecnologiaLicenciadaId));
                    }

                    List<BusquedaTecnologiaLicenciada> datos = entities.Select(x => new BusquedaTecnologiaLicenciada
                    {
                        TecnologiaLicenciadaId = x.TecnologiaLicenciadaId,
                        NombreTecnologiaLic = x.NombreTecnologiaLic,
                        Numero = x.Numero + "",
                        EstadoLicenciamientoId = x.EstadoLicenciamientoId,
                        EstadoLicenciamiento = x.EstadoLicenciamiento.Descripcion,
                        NombreReceptor = x.NombreReceptor,
                        GerenciasNombre = (from unidad in dbGI.DbSetUnidadOrganizacional
                                           where x.Gerencias.Select(g => g.ClaveUnidad).ToList().Contains(unidad.ClaveUnidad)
                                                    && unidad.FechaEfectiva == dbGI.DbSetUnidadOrganizacional.Where(
                                                                      p => p.FechaEfectiva <= fechaActual
                                                                      && p.ClaveUnidad == unidad.ClaveUnidad
                                                                      ).Max(e => e.FechaEfectiva)
                                           select unidad.NombreUnidad).ToList()
                    }).ToList();


                    //propiedad industrial que sea del tipo pi buscado

                    foreach (var c in datos)
                    {
                        //lista de propiedad industrial relacionada a tecnologia licenciada
                        var listaFKPITecnologia = await (from g in dbGI.DbSetTecnologiaLicenciadaPIPIndustrial.AsNoTracking() where g.TecnologiaLicenciadaId == c.TecnologiaLicenciadaId select g.PropiedadIndustrialId).ToListAsync();
                        if (listaFKPITecnologia.Count() > 0)
                        {
                            var listaPI = await (from p in dbPI.PropiedadIndustrial.AsNoTracking() where listaFKPITecnologia.Contains(p.PropiedadIndustrialId) select p.TipoPropiedadIndustrialId).ToListAsync();
                            c.TipoPi = listaTipoPI.Where(e => listaPI.Contains(e.idTipo)).Select(e => e.nombre).ToList();
                        }
                        var listaFKDATecnologia = await (from d in dbGI.DbSetTecnologiaLicenciadaPIDA.AsNoTracking() where d.TecnologiaLicenciadaId == c.TecnologiaLicenciadaId select d.DerechosAutorId).ToListAsync();
                        if (listaFKDATecnologia.Count() > 0)
                        {
                            if (c.TipoPi != null)
                            {
                                c.TipoPi.Add("Derechos de autor");
                            }
                            else
                            {
                                List<string> lista = new List<string>();
                                lista.Add("Derechos de autor");
                                c.TipoPi = lista;
                            }

                        }

                    }

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
        /// Obtener todas las claves de las tecnologias buscadas mediante una colacion
        /// </summary>
        /// <returns>List<int></returns>
        public async Task<List<int>> GetTecnologiasLikeNombreLatin1(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT TecnologiaLicenciadaId FROM GI.tab_TecnologiaLicenciada where NombreTecnologiaLic collate Latin1_General_CI_AI LIKE ";
                foreach (var palabra in palabras)
                {
                    query = query + "'%" + palabra + "%' and NombreTecnologiaLic collate Latin1_General_CI_AI LIKE";
                }
                var resultados = await dbGI.Database.SqlQuery<int>(query + "'%%'").ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        /// <summary>
        /// Obtener todas las claves de las tecnologias buscadas mediante una colacion
        /// </summary>
        /// <returns>List<int></returns>
        public async Task<List<int>> GetReceptoresTecnologiaLikeNombreLatin1(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT TecnologiaLicenciadaId FROM GI.tab_TecnologiaLicenciada where NombreReceptor collate Latin1_General_CI_AI LIKE ";
                foreach (var palabra in palabras)
                {
                    query = query + "'%" + palabra + "%' and NombreReceptor collate Latin1_General_CI_AI LIKE";
                }
                var resultados = await dbGI.Database.SqlQuery<int>(query + "'%%'").ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Retorna los registros donde el empleado es jefe de proyecto de los prooyectos asociados a los registros
        /// o es gerente dada la unidad organizacional de los proyectos
        /// </summary>
        /// <param name="claveEmpleado"></param>
        /// <param name="unidadOrganizacionalId"></param>
        /// <returns></returns>
        public async Task<IEnumerable<Object>> GetAllByEmpleado(String claveEmpleado, String unidadOrganizacionalId)
        {
            try
            {

                var fechaActual = DateTime.Now;
                var unidadeComoGerente = await dbGI.DbSetUnidadOrganizacional.AsNoTracking()
                  .Where(x => x.ClaveResponsable.Equals(claveEmpleado)
                                  && x.FechaEfectiva == dbGI.DbSetUnidadOrganizacional
                                                                  .Where(f => f.FechaEfectiva <= fechaActual
                                                                  && f.ClaveUnidad == x.ClaveUnidad)
                                                                  .Max(f => f.FechaEfectiva)
                                    )
                   .Select(x => x.ClaveUnidad)
                  .ToListAsync();
                var unidadesId = new List<String>();
                var STLIDs = new List<int>();

                if (unidadeComoGerente != null && unidadeComoGerente.Count() > 0)
                {
                    unidadesId = unidadeComoGerente;


                }
                var entities = await dbGI.DbSetTecnologiaLicenciada
                    .Include(x => x.EstadoLicenciamiento)
                    .Include(x => x.Gerencias)
                    .Include(x => x.Proyecto)
                    .AsNoTracking()
                    .Where(x => x.Proyecto.NumjefeProyecto.Equals(claveEmpleado)
                                || x.TecnologiaLicenciadaId ==
                                dbGI.DbSetTecnologiaLicenciadaGerencia.Where(g =>
                                    unidadesId.Contains(g.ClaveUnidad) && g.TecnologiaLicenciadaId == x.TecnologiaLicenciadaId)
                                    .Select(s => s.TecnologiaLicenciadaId).FirstOrDefault()
                                || unidadesId.Contains(x.Proyecto.UnidadOrganizacionalId)
                                )
                    .Select(x => new
                    {
                        TecnologiaLicenciadaId = x.TecnologiaLicenciadaId,
                        Numero = x.Numero,
                        NombreTecnologiaLic = x.NombreTecnologiaLic,
                        EstadoLicenciamientoId = x.EstadoLicenciamientoId,
                        EstadoLicenciamiento = x.EstadoLicenciamiento.Descripcion,
                        NombreReceptor = x.NombreReceptor,
                        tipoPI = "pendiente",
                        GerenciasNombre = (from unidad in dbGI.DbSetUnidadOrganizacional
                                           where x.Gerencias.Select(g => g.ClaveUnidad).ToList().Contains(unidad.ClaveUnidad)
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
        /// Retorna los registros donde el empleado es jefe de proyecto de los prooyectos asociados a los registros
        /// o es gerente dada la unidad organizacional de los proyectos
        /// </summary>
        /// <param name="claveEmpleado"></param>
        /// <param name="unidadOrganizacionalId"></param>
        /// <returns></returns>
        public async Task<IEnumerable<Object>> GetConsultaByEmpleado(TecnologiaLicenciada parametros)
        {
            try
            {
                var fechaActual = DateTime.Now;
                //Unidades como gerente
                var unidadeComoGerente = await dbGI.DbSetUnidadOrganizacional.AsNoTracking()
                  .Where(x => x.ClaveResponsable.Equals(parametros.claveEmpleado)
                                  && x.FechaEfectiva == dbGI.DbSetUnidadOrganizacional
                                                                  .Where(f => f.FechaEfectiva <= fechaActual
                                                                  && f.ClaveUnidad == x.ClaveUnidad)
                                                                  .Max(f => f.FechaEfectiva)
                                    )
                   .Select(x => x.ClaveUnidad)
                  .ToListAsync();

                var unidadesId = new List<String>();
                var STLIDs = new List<int>();

                if (unidadeComoGerente != null && unidadeComoGerente.Count() > 0)
                {
                    unidadesId = unidadeComoGerente;
                }

                //Tipos de pi
                var listaTipoPI = await dbPI.TipoPropiedadIndustrial.Where(e => e.Estado == true).Select(x => new
                {
                    idTipo = x.TipoPropiedadIndustrialId,
                    nombre = x.DescripcionCorta
                }).AsNoTracking().ToListAsync();

                var entities = dbGI.DbSetTecnologiaLicenciada
                    .Include(x => x.EstadoLicenciamiento)
                    .Include(x => x.Gerencias)
                    .Include(x => x.Proyecto)
                    .Where(x => x.Proyecto.NumjefeProyecto.Equals(parametros.claveEmpleado)
                                || x.TecnologiaLicenciadaId ==
                                dbGI.DbSetTecnologiaLicenciadaGerencia.Where(g =>
                                    unidadesId.Contains(g.ClaveUnidad) && g.TecnologiaLicenciadaId == x.TecnologiaLicenciadaId)
                                    .Select(s => s.TecnologiaLicenciadaId).FirstOrDefault()
                                || unidadesId.Contains(x.Proyecto.UnidadOrganizacionalId)
                                )
                     .AsNoTracking();

                if (entities != null)
                {
                    if (!String.IsNullOrEmpty(parametros.NombreTecnologiaLic)) //busqueda por nombre de la tecnologia licenciada
                    {
                        var listaFK = await GetTecnologiasLikeNombreLatin1(parametros.NombreTecnologiaLic);
                        entities = entities.Where(e => listaFK.Contains(e.TecnologiaLicenciadaId));
                    }
                    if (!String.IsNullOrEmpty(parametros.NombreReceptor))  //busqueda por el nombre del receptor
                    {
                        var listaFK = await GetReceptoresTecnologiaLikeNombreLatin1(parametros.NombreReceptor);
                        entities = entities.Where(e => listaFK.Contains(e.TecnologiaLicenciadaId));
                    }
                    if (!String.IsNullOrEmpty(parametros.ClaveUnidad))  //busqueda por clave de unidad
                    {
                        var fks = await (from pi in dbGI.DbSetTecnologiaLicenciadaGerencia.AsNoTracking()
                                         where pi.ClaveUnidad == parametros.ClaveUnidad
                                         select pi.TecnologiaLicenciadaId).ToListAsync();

                        entities = entities.Where(e => fks.Contains(e.TecnologiaLicenciadaId));
                    }
                    if (!String.IsNullOrEmpty(parametros.estado))  //busqueda por estado del licenciamiento
                    {
                        var id = Convert.ToInt32(parametros.estado);
                        entities = entities.Where(e => e.EstadoLicenciamientoId == id);
                    }
                    if (parametros.TipoPropiedadIndustrialId != 0 && parametros.TipoPropiedadIndustrialId != 9999) //busqueda por tipo de propiedad industrial
                    {
                        //Entity framework no soporta joins entre diferentes contextos de aplicacion, por eso la consulta se hace de la siguiente forma

                        //propiedad industrial que sea del tipo pi buscado
                        var fksPI = await (from pi in dbPI.PropiedadIndustrial.AsNoTracking()
                                           where pi.EsPropiedadInstituto == true
                                                && pi.TipoPropiedadIndustrialId == parametros.TipoPropiedadIndustrialId
                                           select pi.PropiedadIndustrialId).ToListAsync();


                        var registros = await (from gi in dbGI.DbSetTecnologiaLicenciadaPIPIndustrial.AsNoTracking()
                                               where fksPI.Contains(gi.PropiedadIndustrialId)
                                               select gi.TecnologiaLicenciadaId).ToListAsync();

                        entities = entities.Where(e => registros.Contains(e.TecnologiaLicenciadaId));

                    }
                    if (parametros.TipoPropiedadIndustrialId == 9999)  //busqueda por derechos de autor
                    {
                        var clavesDA = await (from da in dbGI.DbSetTecnologiaLicenciadaPIDA.AsNoTracking()
                                              select da.TecnologiaLicenciadaId).ToListAsync();
                        entities = entities.Where(e => clavesDA.Contains(e.TecnologiaLicenciadaId));
                    }

                    List<BusquedaTecnologiaLicenciada> datos = entities.Select(x => new BusquedaTecnologiaLicenciada
                    {
                        TecnologiaLicenciadaId = x.TecnologiaLicenciadaId,
                        NombreTecnologiaLic = x.NombreTecnologiaLic,
                        Numero = x.Numero + "",
                        EstadoLicenciamientoId = x.EstadoLicenciamientoId,
                        EstadoLicenciamiento = x.EstadoLicenciamiento.Descripcion,
                        NombreReceptor = x.NombreReceptor,
                        GerenciasNombre = (from unidad in dbGI.DbSetUnidadOrganizacional
                                           where x.Gerencias.Select(g => g.ClaveUnidad).ToList().Contains(unidad.ClaveUnidad)
                                                    && unidad.FechaEfectiva == dbGI.DbSetUnidadOrganizacional.Where(
                                                                      p => p.FechaEfectiva <= fechaActual
                                                                      && p.ClaveUnidad == unidad.ClaveUnidad
                                                                      ).Max(e => e.FechaEfectiva)
                                           select unidad.NombreUnidad).ToList()
                    }).ToList();


                    //propiedad industrial que sea del tipo pi buscado

                    foreach (var c in datos)
                    {
                        //lista de propiedad industrial relacionada a tecnologia licenciada
                        var listaFKPITecnologia = await (from g in dbGI.DbSetTecnologiaLicenciadaPIPIndustrial.AsNoTracking() where g.TecnologiaLicenciadaId == c.TecnologiaLicenciadaId select g.PropiedadIndustrialId).ToListAsync();
                        if (listaFKPITecnologia.Count() > 0)
                        {
                            var listaPI = await (from p in dbPI.PropiedadIndustrial.AsNoTracking() where listaFKPITecnologia.Contains(p.PropiedadIndustrialId) select p.TipoPropiedadIndustrialId).ToListAsync();
                            c.TipoPi = listaTipoPI.Where(e => listaPI.Contains(e.idTipo)).Select(e => e.nombre).ToList();
                        }
                        var listaFKDATecnologia = await (from d in dbGI.DbSetTecnologiaLicenciadaPIDA.AsNoTracking() where d.TecnologiaLicenciadaId == c.TecnologiaLicenciadaId select d.DerechosAutorId).ToListAsync();
                        if (listaFKDATecnologia.Count() > 0)
                        {
                            if (c.TipoPi != null)
                            {
                                c.TipoPi.Add("Derechos de autor");
                            }
                            else
                            {
                                List<string> lista = new List<string>();
                                lista.Add("Derechos de autor");
                                c.TipoPi = lista;
                            }

                        }

                    }

                    return datos;

                }
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<TecnologiaLicenciada> GetById(int id)
        {
            try
            {
                var entities = await dbGI.DbSetTecnologiaLicenciada.AsNoTracking()
                    .Include(x => x.Aliado)
                    .Include(x => x.EstadoLicenciamiento)
                    .Include(x => x.ProductoGI)
                    .Include(x => x.Proyecto)
                    .Include(x => x.Gerencias)
                    .Include(x => x.Convenio)
                    .Include("TecnologiaLicenciadaPIDA.DerechosAutor")
                    .Include("TecnologiaLicenciadaPIPIndustrial.PropiedadIndustrial.TipoPropiedadIndustrial")
                    .Include("TecnologiaLicenciadaPIDA.DerechosAutor.Rama")

                    .Include("Pagos.TipoPagos")

                    .Include(x => x.Lecciones)

                    .FirstOrDefaultAsync(e => e.TecnologiaLicenciadaId == id);
                if (entities != null)
                {
                    UORepository uniDB = new UORepository();
                    var unidadesId = entities.Gerencias.Select(x => x.ClaveUnidad).ToList();
                    var unidades = await uniDB.GetAllByCollectionCR(unidadesId);
                    foreach (var uG in entities.Gerencias)
                    {
                        var unidad = unidades.Find(x => x.ClaveUnidad.Equals(uG.ClaveUnidad));
                        if (unidad != null)
                            uG.NombreUnidad = unidad.NombreUnidad;
                    }
                }


                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(TecnologiaLicenciada model, string clavePersona, string nombrePersona)
        {
            try
            {
                dbGI.DbSetTecnologiaLicenciada.Add(model);
                await dbGI.SaveChangesAsync();
                await this.AddBitacoraMovimiento(model, clavePersona, nombrePersona, "Creación del registro");

                if (model.EstadoLicenciamientoId == 1) //En caso de estar vigente la tecnologia se crea una notificacion de nuevo OC
                {
                    NuevoOCRepository nuevo = new NuevoOCRepository();
                    await nuevo.Create(new NuevoOC("GI", "STL", model.NombreTecnologiaLic,
                   "indexGI.html#/detallestecnologiaLicenciada/" + model.TecnologiaLicenciadaId,
                  model.TecnologiaLicenciadaId.ToString()
                   ));
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        private async Task AddBitacoraMovimiento(TecnologiaLicenciada model,
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
                    bita.OcsId = "STL";
                    bita.RegistroId = model.TecnologiaLicenciadaId;
                    dbGI.DbSetBitacoraMovimientosGI.Add(bita);
                    await dbGI.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task UpdateProyecto(TecnologiaLicenciada model, String clavePersona, String nombrePersona)
        {
            try
            {
                var _model = await dbGI.DbSetTecnologiaLicenciada.FirstOrDefaultAsync(e => e.TecnologiaLicenciadaId == model.TecnologiaLicenciadaId);
                if (_model != null)
                {
                    _model.ProyectoId = model.ProyectoId;
                    _model.Proyecto = null;
                    await dbGI.SaveChangesAsync();
                    await this.AddBitacoraMovimiento(model, clavePersona, nombrePersona, "Actualización del proyecto");
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task Update(TecnologiaLicenciada model, String clavePersona, String nombrePersona)
        {
            try
            {
                var _model = await dbGI.DbSetTecnologiaLicenciada.FirstOrDefaultAsync(e => e.TecnologiaLicenciadaId == model.TecnologiaLicenciadaId);
                if (_model != null)
                {
                    if (model.Gerencias.Count > 0)
                    { //Se remueven las viejas gerencias
                        var oldGerencias = await dbGI.DbSetTecnologiaLicenciadaGerencia.Where(e => e.TecnologiaLicenciadaId == model.TecnologiaLicenciadaId).ToListAsync();
                        if (oldGerencias.Count > 0)
                        {
                            dbGI.DbSetTecnologiaLicenciadaGerencia.RemoveRange(oldGerencias);
                        }
                        dbGI.DbSetTecnologiaLicenciadaGerencia.AddRange(model.Gerencias);
                    }

                    //Verificamos la existencia de una notificacion como nuevo OC
                    var infoAgregada = await dbGEN.dbSetNuevoOC.Where(e => e.descripcion.Equals(_model.NombreTecnologiaLic)).FirstOrDefaultAsync();
                    if(infoAgregada!=null && model.EstadoLicenciamientoId!=1){
                        NuevoOCRepository repo= new NuevoOCRepository();
                        await repo.Delete(infoAgregada.NuevoOCId);
                    }
                    if (infoAgregada == null && model.EstadoLicenciamientoId == 1)  //En caso de estar vigente la tecnologia se crea una notificacion de nuevo OC
                    {
                        NuevoOCRepository nuevo = new NuevoOCRepository();
                        await nuevo.Create(new NuevoOC("GI", "STL", model.NombreTecnologiaLic,
                       "indexGI.html#/detallestecnologiaLicenciada/" + model.TecnologiaLicenciadaId,
                      model.TecnologiaLicenciadaId.ToString()
                       ));
                    }
                    
                    dbGI.Entry(_model).CurrentValues.SetValues(model);
                    await dbGI.SaveChangesAsync();
                    await this.AddBitacoraMovimiento(model, clavePersona, nombrePersona, "Actualización de STL");
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
                var _model = await dbGI.DbSetTecnologiaLicenciada.FirstOrDefaultAsync(e => e.TecnologiaLicenciadaId == id);
                if (_model != null)
                {
                    dbGI.DbSetTecnologiaLicenciada.Remove(_model);
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
