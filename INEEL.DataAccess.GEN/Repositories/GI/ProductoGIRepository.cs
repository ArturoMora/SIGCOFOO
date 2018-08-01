using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GI;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Linq;
using System;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories.CR;

namespace INEEL.DataAccess.GEN.Repositories.GI
{
    public class ProductoGIRepository
    {

        private GI_Context dbGI;
        private GEN_Context GEN_Context;

        public ProductoGIRepository()
        {
            dbGI = new GI_Context();
            GEN_Context = new GEN_Context();
        }
        public ProductoGIRepository(GI_Context db)
        {
            dbGI = db;
            GEN_Context = new GEN_Context();
        }
        public async Task<IEnumerable<object>> GetAllRevisarComite()
        {
            try
            {
                var fechaActual = DateTime.Now;
                var entities = await dbGI.DbSetProductoGI.AsNoTracking()
                    .Include(x => x.ProductoAutores)
                    .Include(x => x.SegmentoMercado)
                    .Include(x => x.FactorInnovacion)
                    .Include(x => x.EstadoFlujo)
                    .Include(x => x.Proyecto)
                    .Include(x => x.TipoAccesoGI)
                    .Include("ProductoGIEvaluadores.MiembrosGI")                    
                    .Where(x => x.EstadoFlujoId == 3 && (x.EstadoFlujoComite == 16 || x.EstadoFlujoComite == 17))
                    .Select(x => new {
                        ProductoId = x.ProductoId,
                        ClavePersona = x.ClavePersona,
                        Descripcion = x.Descripcion,
                        ComiteFlujo = x.ComiteFlujo.Descripcion,
                        ComiteFlujoId = x.EstadoFlujoComite,
                        EstadoFlujo = x.EstadoFlujo.Descripcion,
                        EstadoFlujoId = x.EstadoFlujoId,
                        FactorInnovacion = x.FactorInnovacion.Descripcion,
                        FechaValidacion = x.FechaValidacion,
                        NombreTecnico = x.NombreTecnico,
                        ProyectoId = x.ProyectoId,
                        Proyecto = x.Proyecto.Nombre,
                        TipoAcceso = x.TipoAcceso,
                        TipoAccesoGI = x.TipoAccesoGI.Nombre,
                        FechaRegistro = x.FechaRegistro,
                        ProductoAutores = x.ProductoAutores.Select(aut => aut.Nombre).ToList(),
                        Evaluadores= x.ProductoGIEvaluadores.Select(xEv=> xEv.MiembrosGI.NombrePersona).ToList(),
                        UnidadOrganizacionalId = x.UnidadOrganizacionalId,
                        UnidadOrganizacional =
                        (from unidad in dbGI.DbSetUnidadOrganizacional
                         where x.UnidadOrganizacionalId.Equals(unidad.ClaveUnidad)
                                  && unidad.FechaEfectiva == dbGI.DbSetUnidadOrganizacional.Where(
                                                    p => p.FechaEfectiva <= fechaActual
                                                    && p.ClaveUnidad == unidad.ClaveUnidad
                                                    ).Max(e => e.FechaEfectiva)
                         select unidad.NombreUnidad).FirstOrDefault()
                    })
                    .ToListAsync();



                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<object>> GetAllRevisarComite2()
        {
            try
            {
                var fechaActual = DateTime.Now;
                var entities = await dbGI.DbSetProductoGI.AsNoTracking()
                    .Include(x => x.ProductoAutores)
                    .Include(x => x.SegmentoMercado)
                    .Include(x => x.FactorInnovacion)
                    .Include(x => x.EstadoFlujo)
                    .Include(x => x.Proyecto)
                    .Include(x => x.TipoAccesoGI)
                    .Include("ProductoGIEvaluadores.MiembrosGI")
                    .Where(x => x.EstadoFlujoId == 3 && (x.EstadoFlujoComite == 16 || x.EstadoFlujoComite == 17))
                    .Select(x => new {
                        ProductoId = x.ProductoId,
                        ClavePersona = x.ClavePersona,
                        Descripcion = x.Descripcion,
                        ComiteFlujo = x.ComiteFlujo.Descripcion,
                        ComiteFlujoId = x.EstadoFlujoComite,
                        EstadoFlujo = x.EstadoFlujo.Descripcion,
                        EstadoFlujoId = x.EstadoFlujoId,
                        FactorInnovacion = x.FactorInnovacion.Descripcion,
                        FechaValidacion = x.FechaValidacion,
                        NombreTecnico = x.NombreTecnico,
                        ProyectoId = x.ProyectoId,
                        Proyecto = x.Proyecto.Nombre,
                        TipoAcceso = x.TipoAcceso,
                        TipoAccesoGI = x.TipoAccesoGI.Nombre,
                        FechaRegistro = x.FechaRegistro,
                        ProductoAutores = x.ProductoAutores.Select(aut => aut.ClavePersona+" "+aut.Nombre).ToList(),
                        Evaluadores = x.ProductoGIEvaluadores.Select(xEv => xEv.MiembrosGI.NombrePersona).ToList(),
                        UnidadOrganizacionalId = x.UnidadOrganizacionalId,
                        UnidadOrganizacional =
                        (from unidad in dbGI.DbSetUnidadOrganizacional
                         where x.UnidadOrganizacionalId.Equals(unidad.ClaveUnidad)
                                  && unidad.FechaEfectiva == dbGI.DbSetUnidadOrganizacional.Where(
                                                    p => p.FechaEfectiva <= fechaActual
                                                    && p.ClaveUnidad == unidad.ClaveUnidad
                                                    ).Max(e => e.FechaEfectiva)
                         select unidad.NombreUnidad).FirstOrDefault()
                    })
                    .ToListAsync();



                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        //NOTA
        //Este metodo funciona para 2 vistas, para solicitudes FI(buscar y mis solicitudes) y la seccion de buscar productos innovadores
        //como comparten casi el 99% de los mismos datos se utilizó este método, el performance no se verá afectado
        /// <summary>
        /// A partir de parametros permite al usuario obtener datos sobre productos innovadores
        /// </summary>
        /// <returns>List<object></returns>
        public async Task<IEnumerable<object>> GetConsultaRevisarComite(ProductoGI parametros)
        {
            try
            {
                var fechaActual = DateTime.Now;
                var entities = dbGI.DbSetProductoGI
                    .Include(x => x.ProductoAutores)
                    .Include(x => x.SegmentoMercado)
                    .Include(x => x.FactorInnovacion)
                    .Include(x => x.EstadoFlujo)
                    .Include(x => x.Proyecto)
                    .Include(x => x.TipoAccesoGI)
                    .Include(x=>x.ComiteFlujo)
                    .Include("ProductoGIEvaluadores.MiembrosGI")
                    .Where(x => x.EstadoFlujoId == 3)
                    .AsNoTracking();
                //var miembrosGI= await dbGI.DbSetMiembrosGI
                if (entities != null)
                {
                    if (!String.IsNullOrEmpty(parametros.ClavePersona)) // trae los registros por evaluadores
                    {
                        var productoSolicitudes = await dbGI.DbSetProductoGIEvaluadores.AsNoTracking()
                        .Include(x => x.MiembrosGI)
                        .Where(e => e.MiembrosGI.ClavePersona == parametros.ClavePersona) //& estadoflujo==16
                        .Select(x => x.ProductoGIId)
                        .ToListAsync();

                        entities = entities.Where(e => productoSolicitudes.Contains(e.ProductoId) && e.EstadoFlujoComite == 16 );

                    }
                    if (!String.IsNullOrEmpty(parametros.NombreTecnico))  //busqueda por el nombre tecnico
                    {
                        var fksproductos = await GetProductosLikeNombreLatin1(parametros.NombreTecnico);
                        entities = entities.Where(e => fksproductos.Contains(e.ProductoId));
                    }
                    if (!String.IsNullOrEmpty(parametros.ProyectoId)) //busqueda por proyectos
                    {
                        entities = entities.Where(e => e.ProyectoId == parametros.ProyectoId);
                    }
                    if (!String.IsNullOrEmpty(parametros.Evaluador))  //busqueda por el nombre del evaluador
                    {
                        PersonasRepository p = new PersonasRepository();
                        var claves = await p.GetAllClavesByLikeNombreLatin1(parametros.Evaluador);
                        var listafks = await dbGI.DbSetProductoGIEvaluadores.Where(e => claves.Contains(e.ClavePersona)).AsNoTracking().Select(e=>e.ProductoGIId).ToListAsync();
                        entities = entities.Where(c => listafks.Contains(c.ProductoId));
                    }
                    if (!String.IsNullOrEmpty(parametros.Autor))  //busqueda por nombre del autor
                    {
                        PersonasRepository persona = new PersonasRepository();
                        var clavesInv = await persona.GetAllClavesByLikeNombreLatin1(parametros.Autor);
                        var newfks = await dbGI.DbSetProductoAutores.Where(e => clavesInv.Contains(e.ClavePersona)).AsNoTracking().Select(e=>e.ProductoId).ToListAsync();
                        entities = entities.Where(c => newfks.Contains(c.ProductoId));
                    }
                    if (!String.IsNullOrEmpty(parametros.UnidadOrganizacionalId))  //busqueda por unidad organizacional
                    {
                        entities = entities.Where(e => e.UnidadOrganizacionalId == parametros.UnidadOrganizacionalId);
                    }
                    if (parametros.EstadoFlujoComite != null)  //busqueda por estado del comite
                    {
                        entities = entities.Where(e => e.EstadoFlujoComite == parametros.EstadoFlujoComite);
                    }

                    var datos = entities.Select(x => new
                    {
                        ProductoId = x.ProductoId,
                        ClavePersona = x.ClavePersona,
                        Descripcion = x.Descripcion,
                        ComiteFlujo = x.ComiteFlujo.Descripcion,
                        ComiteFlujoId = x.EstadoFlujoComite,
                        EstadoFlujo = x.EstadoFlujo.Descripcion,
                        EstadoFlujoId = x.EstadoFlujoId,
                        FactorInnovacion = x.FactorInnovacion.Descripcion,
                        FechaValidacion = x.FechaValidacion,
                        NombreTecnico = x.NombreTecnico,
                        ProyectoId = x.ProyectoId,
                        Proyecto = x.Proyecto.Nombre,
                        TipoAcceso = x.TipoAcceso,
                        TipoAccesoGI = x.TipoAccesoGI.Nombre,
                        FechaRegistro = x.FechaRegistro,
                        ProductoAutores = x.ProductoAutores.Select(aut => aut.ClavePersona + " " + aut.Nombre).ToList(),
                        Evaluadores = x.ProductoGIEvaluadores.Select(xEv => xEv.MiembrosGI.NombrePersona).ToList(),
                        UnidadOrganizacionalId = x.UnidadOrganizacionalId,
                        UnidadOrganizacional =
                          (from unidad in dbGI.DbSetUnidadOrganizacional
                           where x.UnidadOrganizacionalId.Equals(unidad.ClaveUnidad)
                                    && unidad.FechaEfectiva == dbGI.DbSetUnidadOrganizacional.Where(
                                                      p => p.FechaEfectiva <= fechaActual
                                                      && p.ClaveUnidad == unidad.ClaveUnidad
                                                      ).Max(e => e.FechaEfectiva)
                           select unidad.NombreUnidad).FirstOrDefault()
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


        public async Task<IEnumerable<object>> GetConsultaSolicitudesFI(ProductoGI parametros)
        {
            try
            {
                var fechaActual = DateTime.Now;
                var entities = dbGI.DbSetProductoGI
                    .Include(x => x.ProductoAutores)
                    .Include(x => x.SegmentoMercado)
                    .Include(x => x.FactorInnovacion)
                    .Include(x => x.EstadoFlujo)
                    .Include(x => x.Proyecto)
                    .Include(x => x.TipoAccesoGI)
                    .Include(x => x.ComiteFlujo)
                    .Include("ProductoGIEvaluadores.MiembrosGI")
                    .Where(x => x.EstadoFlujoId == 3 && x.EstadoFlujoComite!=null) //falta modificar
                    .AsNoTracking();
                
                if (entities != null)
                {
                    if (!String.IsNullOrEmpty(parametros.ClavePersona)) // trae los registros por evaluadores
                    {
                        var productoSolicitudes = await dbGI.DbSetProductoGIEvaluadores.AsNoTracking()
                        .Include(x => x.MiembrosGI)
                        .Where(e => e.MiembrosGI.ClavePersona == parametros.ClavePersona) //& estadoflujo==16
                        .Select(x => x.ProductoGIId)
                        .ToListAsync();

                        entities = entities.Where(e => productoSolicitudes.Contains(e.ProductoId) && e.EstadoFlujoComite == 16);

                    }
                    if (!String.IsNullOrEmpty(parametros.NombreTecnico))  //busqueda por el nombre tecnico
                    {
                        var fksproductos = await GetProductosLikeNombreLatin1(parametros.NombreTecnico);
                        entities = entities.Where(e => fksproductos.Contains(e.ProductoId));
                    }
                    if (!String.IsNullOrEmpty(parametros.ProyectoId)) //busqueda por proyectos
                    {
                        entities = entities.Where(e => e.ProyectoId == parametros.ProyectoId);
                    }
                    if (!String.IsNullOrEmpty(parametros.Evaluador))  //busqueda por el nombre del evaluador
                    {
                        PersonasRepository p = new PersonasRepository();
                        var claves = await p.GetAllClavesByLikeNombreLatin1(parametros.Evaluador);
                        var listafks = await dbGI.DbSetProductoGIEvaluadores.Where(e => claves.Contains(e.ClavePersona)).AsNoTracking().Select(e => e.ProductoGIId).ToListAsync();
                        entities = entities.Where(c => listafks.Contains(c.ProductoId));
                    }
                    if (!String.IsNullOrEmpty(parametros.Autor))  //busqueda por nombre del autor
                    {
                        PersonasRepository persona = new PersonasRepository();
                        var clavesInv = await persona.GetAllClavesByLikeNombreLatin1(parametros.Autor);
                        var newfks = await dbGI.DbSetProductoAutores.Where(e => clavesInv.Contains(e.ClavePersona)).AsNoTracking().Select(e => e.ProductoId).ToListAsync();
                        entities = entities.Where(c => newfks.Contains(c.ProductoId));
                    }
                    if (!String.IsNullOrEmpty(parametros.UnidadOrganizacionalId))  //busqueda por unidad organizacional
                    {
                        entities = entities.Where(e => e.UnidadOrganizacionalId == parametros.UnidadOrganizacionalId);
                    }
                    if (parametros.EstadoFlujoComite != null)  //busqueda por estado del comite
                    {
                        entities = entities.Where(e => e.EstadoFlujoComite == parametros.EstadoFlujoComite);
                    }
                    
                    // PersonasRepository pers = new PersonasRepository();
                    var datos = entities.Select(x => new
                    {
                        ProductoId = x.ProductoId,
                        ClavePersona = x.ClavePersona,
                        // DatosPersona= pers.GetByClave(x.ClavePersona),
                        Descripcion = x.Descripcion,
                        ComiteFlujo = x.ComiteFlujo.Descripcion,
                        ComiteFlujoId = x.EstadoFlujoComite,
                        EstadoFlujo = x.EstadoFlujo.Descripcion,
                        EstadoFlujoId = x.EstadoFlujoId,
                        FactorInnovacion = x.FactorInnovacion.Descripcion,
                        FechaValidacion = x.FechaValidacion,
                        NombreTecnico = x.NombreTecnico,
                        ProyectoId = x.ProyectoId,
                        Proyecto = x.Proyecto.Nombre,
                        TipoAcceso = x.TipoAcceso,
                        TipoAccesoGI = x.TipoAccesoGI.Nombre,
                        FechaRegistro = x.FechaRegistro,
                        ProductoAutores = x.ProductoAutores.Select(aut => aut.ClavePersona + " " + aut.Nombre).ToList(),
                        Evaluadores = x.ProductoGIEvaluadores.Select(xEv => xEv.MiembrosGI.NombrePersona).ToList(),
                        UnidadOrganizacionalId = x.UnidadOrganizacionalId,
                        UnidadOrganizacional =
                          (from unidad in dbGI.DbSetUnidadOrganizacional
                           where x.UnidadOrganizacionalId.Equals(unidad.ClaveUnidad)
                                    && unidad.FechaEfectiva == dbGI.DbSetUnidadOrganizacional.Where(
                                                      p => p.FechaEfectiva <= fechaActual
                                                      && p.ClaveUnidad == unidad.ClaveUnidad
                                                      ).Max(e => e.FechaEfectiva)
                           select unidad.NombreUnidad).FirstOrDefault()
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
        /// A partir de parametros permite al usuario obtener datos sobre productos innovadores
        /// </summary>
        /// <returns>List<object></returns>
        public async Task<IEnumerable<object>> GetConsultaMisProductos(ProductoGI parametros)
        {
            try
            {
                var fechaActual = DateTime.Now;
                var entities = dbGI.DbSetProductoGI
                    .Include(x => x.ProductoAutores)
                    .Include(x => x.SegmentoMercado)
                    .Include(x => x.FactorInnovacion)
                    .Include(x => x.EstadoFlujo)
                    .Include(x => x.Proyecto)
                    .Include(x => x.TipoAccesoGI)
                    .Include(x => x.ComiteFlujo)
                    .Include("ProductoGIEvaluadores.MiembrosGI")
                    .AsNoTracking();

                if (entities != null)
                {
                    if (!String.IsNullOrEmpty(parametros.ClavePersona)) // trae los registros por la seccion "mis productos innovadores"
                    {
                        var autoresproductos = await dbGI.DbSetProductoAutores.Where(pa => pa.ClavePersona == parametros.ClavePersona).Select(pa => pa.ProductoId).ToListAsync();
                        entities = entities.Where(e => autoresproductos.Contains(e.ProductoId) || e.ClavePersona== parametros.ClavePersona);
                    }
                    if (!String.IsNullOrEmpty(parametros.Autor))  //busqueda por nombre del autor
                    {
                        PersonasRepository persona = new PersonasRepository();
                        var clavesInv = await persona.GetAllClavesByLikeNombreLatin1(parametros.Autor);
                        var newfks = await dbGI.DbSetProductoAutores.Where(e => clavesInv.Contains(e.ClavePersona)).AsNoTracking().Select(e => e.ProductoId).ToListAsync();
                        entities = entities.Where(c => newfks.Contains(c.ProductoId));
                    }
                    if (!String.IsNullOrEmpty(parametros.NombreTecnico))  //busqueda por el nombre tecnico
                    {
                        var fksproductos = await GetProductosLikeNombreLatin1(parametros.NombreTecnico);
                        entities = entities.Where(e => fksproductos.Contains(e.ProductoId));
                    }
                    if (!String.IsNullOrEmpty(parametros.ProyectoId)) //busqueda por proyectos
                    {
                        entities = entities.Where(e => e.ProyectoId == parametros.ProyectoId);
                    }
                    if (!String.IsNullOrEmpty(parametros.UnidadOrganizacionalId))  //busqueda por unidad organizacional
                    {
                        entities = entities.Where(e => e.UnidadOrganizacionalId == parametros.UnidadOrganizacionalId);
                    }

                    var datos = entities.Select(x => new
                    {
                        ProductoId = x.ProductoId,
                        ClavePersona = x.ClavePersona,
                        Descripcion = x.Descripcion,
                        ComiteFlujo = x.ComiteFlujo.Descripcion,
                        ComiteFlujoId = x.EstadoFlujoComite,
                        EstadoFlujo = x.EstadoFlujo.Descripcion,
                        EstadoFlujoId = x.EstadoFlujoId,
                        FactorInnovacion = x.FactorInnovacion.Descripcion,
                        FechaValidacion = x.FechaValidacion,
                        NombreTecnico = x.NombreTecnico,
                        ProyectoId = x.ProyectoId,
                        Proyecto = x.Proyecto.Nombre,
                        TipoAcceso = x.TipoAcceso,
                        TipoAccesoGI = x.TipoAccesoGI.Nombre,
                        FechaRegistro = x.FechaRegistro,
                        ProductoAutores = x.ProductoAutores.Select(aut => aut.ClavePersona + " " + aut.Nombre).ToList(),
                        Evaluadores = x.ProductoGIEvaluadores.Select(xEv => xEv.MiembrosGI.NombrePersona).ToList(),
                        UnidadOrganizacionalId = x.UnidadOrganizacionalId,
                        UnidadOrganizacional =
                          (from unidad in dbGI.DbSetUnidadOrganizacional
                           where x.UnidadOrganizacionalId.Equals(unidad.ClaveUnidad)
                                    && unidad.FechaEfectiva == dbGI.DbSetUnidadOrganizacional.Where(
                                                      p => p.FechaEfectiva <= fechaActual
                                                      && p.ClaveUnidad == unidad.ClaveUnidad
                                                      ).Max(e => e.FechaEfectiva)
                           select unidad.NombreUnidad).FirstOrDefault()
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
        /// Obtener todas las claves de los productos relacionados a la busqueda
        /// </summary>
        /// <returns>List<int></returns>
        public async Task<List<int>> GetProductosLikeNombreLatin1(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT ProductoId FROM GI.tab_Producto where NombreTecnico collate Latin1_General_CI_AI LIKE ";
                foreach (var palabra in palabras)
                {
                    query = query + "'%" + palabra + "%' and NombreTecnico collate Latin1_General_CI_AI LIKE";
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
        /// Obtiene un listado de segmentos de mercado para utilizarse en un drop downlist
        /// </summary>
        /// <returns>IEnumerable<Object></returns>
        public async Task<IEnumerable<Object>> GetSegmentosMercado()
        {
            try
            {
                SegmentoMercadoRepository repo = new SegmentoMercadoRepository();
                var resultados = await repo.GetSegmentosForSelect();
                return resultados;
            }
            catch(Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Object>> GetAllForModal()
        {
            try
            {
                var entities = await dbGI.DbSetProductoGI.AsNoTracking()
                    .Include(x=>x.Proyecto)
                    .Select(x=> new {
                        ProductoId = x.ProductoId,
                        NombreTecnico = x.NombreTecnico,
                        ProyectoId = x.ProyectoId,
                        Proyecto = x.Proyecto.Nombre
                    })
                    .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<ProductoGI>> GetAll()
        {
            try
            {
                var entities = await dbGI.DbSetProductoGI.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<ProductoGI> GetById(int id)
        {
            try
            {
                var entitie = await dbGI.DbSetProductoGI.AsNoTracking()
                    .Include(x=> x.Proyecto)
                    .Include(x=> x.FactorInnovacion)
                    .Include("ProductoAutores.ContribucionAutor")
                    .Include(x=> x.SegmentoMercado)
                    .FirstOrDefaultAsync(e => e.ProductoId == id);

                var fechaActual = DateTime.Now;
                if (entitie != null)
                {
                    var unidad = await GEN_Context.dbSetUnidadOrganizacional.AsNoTracking()//esto se puede traer al final, es parte de la logica de pi
                    .Where(x => entitie.UnidadOrganizacionalId == x.ClaveUnidad
                                    && x.FechaEfectiva == GEN_Context.dbSetUnidadOrganizacional
                                                                    .Where(f => f.FechaEfectiva <= DateTime.Now
                                                                    && f.ClaveUnidad == x.ClaveUnidad)
                                                                    .Max(f => f.FechaEfectiva)).FirstOrDefaultAsync();


                    entitie.Unidad = unidad;
                }
                return entitie;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<int> CountProductosGI()
        {
            try
            {

                var entities = await dbGI.DbSetProductoGI.AsNoTracking()
                    .Where(x => x.EstadoFlujoId == 3)
                    .CountAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Object>> GetByProyectos(string id)
        {
            try
            {

                var entities = await dbGI.DbSetProductoGI.AsNoTracking()
                    .Where(x => x.EstadoFlujoId == 3 && x.ProyectoId == id)
                    .Include(e => e.SegmentoMercado)
                    .Include(e => e.FactorInnovacion)
                    .Select(x => new
                    {
                        ProductoId= x.ProductoId,
                        NombreTecnico=x.NombreTecnico,
                        NombreComercial=x.NombreComercial,
                        SegmentoMercado=x.SegmentoMercado.NomSegMerc,
                        FactorInnovacion=x.FactorInnovacion.Descripcion,
                        Descripcion=x.Descripcion
                    }).AsNoTracking().ToListAsync();
                    
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
                var entities = await dbGI.DbSetProductoGI.AsNoTracking()
                    .Include(x => x.ProductoAutores)
                    .Include(x => x.SegmentoMercado)
                    .Include(x => x.FactorInnovacion)
                    .Include(x => x.EstadoFlujo)
                    .Include(x => x.Proyecto)
                    .Include(x => x.TipoAccesoGI)
                    .Where(x => x.EstadoFlujoId == 3)
                    .Select(x => new {
                        ProductoId = x.ProductoId,
                        ClavePersona = x.ClavePersona,
                        Descripcion = x.Descripcion,
                        ComiteFlujo = x.ComiteFlujo.Descripcion,
                        ComiteFlujoId = x.EstadoFlujoComite,
                        EstadoFlujo = x.EstadoFlujo.Descripcion,
                        EstadoFlujoId = x.EstadoFlujoId,
                        FactorInnovacion = x.FactorInnovacion.Descripcion,
                        FechaValidacion = x.FechaValidacion,
                        NombreTecnico = x.NombreTecnico,
                        ProyectoId = x.ProyectoId,
                        Proyecto = x.Proyecto.Nombre,
                        TipoAcceso = x.TipoAcceso,
                        TipoAccesoGI = x.TipoAccesoGI.Nombre,
                        FechaRegistro = x.FechaRegistro,
                        ProductoAutores = x.ProductoAutores.Select(aut => aut.Nombre).ToList(),
                        UnidadOrganizacionalId = x.UnidadOrganizacionalId,
                        UnidadOrganizacional =
                        (from unidad in dbGI.DbSetUnidadOrganizacional
                         where x.UnidadOrganizacionalId.Equals(unidad.ClaveUnidad)
                                  && unidad.FechaEfectiva == dbGI.DbSetUnidadOrganizacional.Where(
                                                    p => p.FechaEfectiva <= fechaActual
                                                    && p.ClaveUnidad == unidad.ClaveUnidad
                                                    ).Max(e => e.FechaEfectiva)
                         select unidad.NombreUnidad).FirstOrDefault()
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
                var entities = await dbGI.DbSetProductoGI.AsNoTracking()
                    .Include(x => x.ProductoAutores)
                    .Include(x => x.SegmentoMercado)
                    .Include(x => x.FactorInnovacion)
                    .Include(x => x.EstadoFlujo)
                    .Include(x => x.Proyecto)
                    .Include(x => x.TipoAccesoGI)
                    .Where(x => x.EstadoFlujoId == 3)
                    .Select(x => new {
                        ProductoId = x.ProductoId,
                        ClavePersona = x.ClavePersona,
                        Descripcion = x.Descripcion,
                        ComiteFlujo = x.ComiteFlujo.Descripcion,
                        ComiteFlujoId = x.EstadoFlujoComite,
                        EstadoFlujo = x.EstadoFlujo.Descripcion,
                        EstadoFlujoId = x.EstadoFlujoId,
                        FactorInnovacion = x.FactorInnovacion.Descripcion,
                        FechaValidacion = x.FechaValidacion,
                        NombreTecnico = x.NombreTecnico,
                        ProyectoId = x.ProyectoId,
                        Proyecto = x.Proyecto.Nombre,
                        TipoAcceso = x.TipoAcceso,
                        TipoAccesoGI = x.TipoAccesoGI.Nombre,
                        FechaRegistro = x.FechaRegistro,
                        ProductoAutores = x.ProductoAutores.Select(aut => aut.ClavePersona+" "+aut.Nombre).ToList(),
                        UnidadOrganizacionalId = x.UnidadOrganizacionalId,
                        UnidadOrganizacional =
                        (from unidad in dbGI.DbSetUnidadOrganizacional
                         where x.UnidadOrganizacionalId.Equals(unidad.ClaveUnidad)
                                  && unidad.FechaEfectiva == dbGI.DbSetUnidadOrganizacional.Where(
                                                    p => p.FechaEfectiva <= fechaActual
                                                    && p.ClaveUnidad == unidad.ClaveUnidad
                                                    ).Max(e => e.FechaEfectiva)
                         select unidad.NombreUnidad).FirstOrDefault()
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
                var entities = await dbGI.DbSetProductoGI.AsNoTracking()
                    .Include(x => x.ProductoAutores)
                    .Include(x => x.SegmentoMercado)
                    .Include(x => x.FactorInnovacion)
                    .Include(x => x.EstadoFlujo)
                    .Include(x => x.Proyecto)
                    .Include(x => x.TipoAccesoGI)
                    .Where(x => x.ClavePersona.Equals(clavePersona)
                       || dbGI.DbSetProductoAutores.Where(pa=> pa.ClavePersona.Equals(clavePersona) && x.ProductoId ==pa.ProductoId).Select(pa=> pa.ProductoId).ToList().Contains(x.ProductoId)
                    )
                    .Select(x => new {
                        VoBoDuenio = x.VoBoDuenio,
                        ProductoId=x.ProductoId,
                        ClavePersona = x.ClavePersona,
                        ClavePersonaAutor= dbGI.DbSetProductoAutores.Where(pa => x.ProductoId == pa.ProductoId && pa.ContribucionId == 0).Select(pa => pa.ClavePersona).FirstOrDefault(),
                        Descripcion = x.Descripcion,
                        ComiteFlujo = x.ComiteFlujo.Descripcion,
                        ComiteFlujoId = x.EstadoFlujoComite,
                        EstadoFlujo = x.EstadoFlujo.Descripcion,
                        EstadoFlujoId= x.EstadoFlujoId,
                        FactorInnovacion = x.FactorInnovacion.Descripcion,
                        FechaValidacion = x.FechaValidacion,
                        NombreTecnico = x.NombreTecnico,
                        ProyectoId = x.ProyectoId,
                        Proyecto = x.Proyecto.Nombre,
                        TipoAcceso = x.TipoAcceso,
                        TipoAccesoGI = x.TipoAccesoGI.Nombre,
                        FechaRegistro = x.FechaRegistro,
                        ProductoAutores = x.ProductoAutores.Select(aut => aut.Nombre).ToList(),
                        UnidadOrganizacionalId= x.UnidadOrganizacionalId,
                        UnidadOrganizacional =
                        (from unidad in dbGI.DbSetUnidadOrganizacional
                         where x.UnidadOrganizacionalId.Equals(unidad.ClaveUnidad)
                                  && unidad.FechaEfectiva == dbGI.DbSetUnidadOrganizacional.Where(
                                                    p => p.FechaEfectiva <= fechaActual
                                                    && p.ClaveUnidad == unidad.ClaveUnidad
                                                    ).Max(e => e.FechaEfectiva)
                         select unidad.NombreUnidad).FirstOrDefault()

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
                var entities = await dbGI.DbSetProductoGI.AsNoTracking()
                    .Include(x => x.ProductoAutores)
                    .Include(x => x.SegmentoMercado)
                    .Include(x => x.FactorInnovacion)
                    .Include(x => x.EstadoFlujo)
                    .Include(x => x.Proyecto)
                    .Include(x => x.TipoAccesoGI)
                    .Where(x => x.ClavePersona.Equals(clavePersona)
                       || dbGI.DbSetProductoAutores.Where(pa => pa.ClavePersona.Equals(clavePersona) && x.ProductoId == pa.ProductoId).Select(pa => pa.ProductoId).ToList().Contains(x.ProductoId)
                    )
                    .Select(x => new {
                        VoBoDuenio = x.VoBoDuenio,
                        ProductoId = x.ProductoId,
                        ClavePersona = x.ClavePersona,
                        ClavePersonaAutor = dbGI.DbSetProductoAutores.Where(pa => x.ProductoId == pa.ProductoId && pa.ContribucionId == 0).Select(pa => pa.ClavePersona).FirstOrDefault(),
                        Descripcion = x.Descripcion,
                        ComiteFlujo = x.ComiteFlujo.Descripcion,
                        ComiteFlujoId = x.EstadoFlujoComite,
                        EstadoFlujo = x.EstadoFlujo.Descripcion,
                        EstadoFlujoId = x.EstadoFlujoId,
                        FactorInnovacion = x.FactorInnovacion.Descripcion,
                        FechaValidacion = x.FechaValidacion,
                        NombreTecnico = x.NombreTecnico,
                        ProyectoId = x.ProyectoId,
                        Proyecto = x.Proyecto.Nombre,
                        TipoAcceso = x.TipoAcceso,
                        TipoAccesoGI = x.TipoAccesoGI.Nombre,
                        FechaRegistro = x.FechaRegistro,
                        ProductoAutores = x.ProductoAutores.Select(aut => aut.ClavePersona+" "+aut.Nombre).ToList(),
                        UnidadOrganizacionalId = x.UnidadOrganizacionalId,
                        UnidadOrganizacional =
                        (from unidad in dbGI.DbSetUnidadOrganizacional
                         where x.UnidadOrganizacionalId.Equals(unidad.ClaveUnidad)
                                  && unidad.FechaEfectiva == dbGI.DbSetUnidadOrganizacional.Where(
                                                    p => p.FechaEfectiva <= fechaActual
                                                    && p.ClaveUnidad == unidad.ClaveUnidad
                                                    ).Max(e => e.FechaEfectiva)
                         select unidad.NombreUnidad).FirstOrDefault()

                    })
                    .ToListAsync();



                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        private async Task AddBitacoraMovimiento(ProductoGI model,
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
                    bita.OcsId = "PROS";
                    bita.RegistroId = model.ProductoId;
                    dbGI.DbSetBitacoraMovimientosGI.Add(bita);
                    await dbGI.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task Create(ProductoGI model, String clavePersona, String nombrePersona)
        {
            try
            {
                model.FechaRegistro=DateTime.Today;
                dbGI.DbSetProductoGI.Add(model);
                await dbGI.SaveChangesAsync();
                await this.AddBitacoraMovimiento(model, clavePersona, nombrePersona, "Creación del registro");
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        
        public async Task RegistrarMovimiento(ProductoGI model, String clavePersona, String nombrePersona)
        {
            try
            {
                var _model = await dbGI.DbSetProductoGI.FirstOrDefaultAsync(e => e.ProductoId == model.ProductoId);
                if (_model != null)
                {
                    
                    if (!String.IsNullOrEmpty(model.Movimiento))
                    {
                        await this.AddBitacoraMovimiento(model, clavePersona, nombrePersona, model.Movimiento);
                    }
                    

                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task UpdateEstadoComite(ProductoGI model, int EstadoFlujoComite)
        {
            try
            {
                var _model = await dbGI.DbSetProductoGI.FirstOrDefaultAsync(e => e.ProductoId == model.ProductoId);
                if (_model != null)
                {
                    _model.EstadoFlujoComite = EstadoFlujoComite;//16 Solicitud (FI)
                    await dbGI.SaveChangesAsync();
                    
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        /// <summary>
        /// Actualiza el FactorInnovacionId y el EstadoFlujoComite dado el modelo ProductoGI 
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task UpdateFI(ProductoGI model, String clavePersona, String nombrePersona)
        {
            try
            {
                var _model = await dbGI.DbSetProductoGI.FirstOrDefaultAsync(e => e.ProductoId == model.ProductoId);
                if (_model != null)
                {
                    _model.FactorInnovacion = null;
                    _model.FactorInnovacionId = model.FactorInnovacionId;
                    if(model.EstadoFlujoComite!=null && model.EstadoFlujoComite > 0)
                    {
                        _model.ComiteFlujo = null;
                        _model.EstadoFlujoComite = model.EstadoFlujoComite;
                        
                    }
                    await dbGI.SaveChangesAsync();
                    var movimientoX = "Actualización del FI :" + model.EstadoFlujoComite;
                    if (!String.IsNullOrEmpty(model.Movimiento))
                    {
                        movimientoX = model.Movimiento;
                    }
                    await this.AddBitacoraMovimiento(model, clavePersona, nombrePersona, movimientoX);
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task UpdateVoBo(ProductoGI model, String clavePersona, String nombrePersona)
        {
            try
            {
                var _model = await dbGI.DbSetProductoGI.FirstOrDefaultAsync(e => e.ProductoId == model.ProductoId);
                if (_model != null)
                {
                    
                    _model.VoBoDuenio = model.VoBoDuenio;
                    String aceptacion = "si";
                    if (model.VoBoDuenio!=null && model.VoBoDuenio == false)
                    {
                        _model.ComiteFlujo = null;
                        _model.EstadoFlujoComite = model.EstadoFlujoComite;//de momento se debe recibir null en EstadoFlujoComite
                        aceptacion = "no";
                    }

                    await dbGI.SaveChangesAsync();
                    var movimientoX = "Aceptación de FI asignado :" + aceptacion;
                    if (!String.IsNullOrEmpty(model.Movimiento))
                    {
                        movimientoX = model.Movimiento;
                    }
                    await this.AddBitacoraMovimiento(model, clavePersona, nombrePersona, movimientoX);
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }//UpdateVoBo
        }
        public async Task Update(ProductoGI model, String clavePersona, String nombrePersona)
        {
            try
            {
                var nuevaAprobacion = false;
                var _model = await dbGI.DbSetProductoGI.FirstOrDefaultAsync(e => e.ProductoId == model.ProductoId);
                if (_model != null)
                {
                    if (model.EstadoFlujoId == 3 && model.FechaValidacion==null)
                    {                        
                        if (model.FechaValidacion == null)
                        {
                            nuevaAprobacion = true;
                        }
                        model.FechaValidacion = DateTime.Now;
                    }
                    dbGI.Entry(_model).CurrentValues.SetValues(model);
                    await dbGI.SaveChangesAsync();
                    if (nuevaAprobacion)
                    {
                        NuevoOCRepository nuevo = new NuevoOCRepository();
                        await nuevo.Create(new NuevoOC("GI", "PROS", _model.NombreTecnico,
                            "indexGI.html#/detalleProductoInnovador/" + _model.ProductoId,
                             _model.ProductoId.ToString()
                            ));
                    }
                    await this.UpdateAutores(model);
                    var movimientoX = "Actualización del registro";
                    if (!String.IsNullOrEmpty(model.Movimiento))
                    {
                        movimientoX = model.Movimiento;
                    }
                    await this.AddBitacoraMovimiento(model, clavePersona, nombrePersona, movimientoX);
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        private async Task UpdateAutores(ProductoGI model)
        {
            try
            {
                var _model = await dbGI.DbSetProductoGI
                    .Include(x => x.ProductoAutores)
                    .FirstOrDefaultAsync(e => e.ProductoId == model.ProductoId);
                if (_model != null)
                {
                    if (model.ProductoAutores != null && model.ProductoAutores.Count() > 0)
                    {

                        ProductoAutoresRepository gerDB = new ProductoAutoresRepository(dbGI);
                        foreach (var e in model.ProductoAutores)
                        {
                            e.ProductoId = model.ProductoId;
                            if (e.Id < 1)//nuevo
                            {
                                await gerDB.Create(e);
                            }
                            else
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
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var _model = await dbGI.DbSetProductoGI.FirstOrDefaultAsync(e => e.ProductoId == id);
                if (_model != null)
                {
                    dbGI.DbSetProductoGI.Remove(_model);
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
