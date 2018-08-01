using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GI;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Linq;
using System;
using INEEL.DataAccess.GEN.Util;

namespace INEEL.DataAccess.GEN.Repositories.GI
{
    public class ProductoGISolicitudRepository
    {

        private GI_Context dbGI;
        public ProductoGISolicitudRepository()
        {
            dbGI = new GI_Context();
            dbGI.Database.Log = Escribe.Write;
        }
        public ProductoGISolicitudRepository(GI_Context db)
        {
            dbGI = db;
            dbGI.Database.Log = Escribe.Write;
        }
        public async Task<int> CountProductoGISolicitud()
        {
            try
            {
                var entities = await dbGI.DbSetProductoGI.AsNoTracking().CountAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<Object>> GetAllCompendio()
        {
            try
            {
                var fechaActual = DateTime.Now;
                
                var entities = await dbGI.DbSetProductoGI
                    .Where(e=>e.EstadoFlujoComite==18)
                    .Where(e=>e.VoBoDuenio==true)
                    .AsNoTracking()
                    .Include(x => x.ProductoAutores)
                    .Include(x => x.FactorInnovacion)
                    .Include(x => x.EstadoFlujo)
                    .Include(x => x.Proyecto)
                    .Include(x => x.TipoAccesoGI)
                    .Select(x => new {
                        ProductoId = x.ProductoId,
                        ClavePersona = x.ClavePersona,
                        
                        ComiteFlujo = x.ComiteFlujo.Descripcion,
                        ComiteFlujoId = x.EstadoFlujoComite,
                        EstadoFlujo = x.EstadoFlujo.Descripcion,
                        EstadoFlujoId = x.EstadoFlujoId,
                        FactorInnovacion = x.FactorInnovacion.Descripcion,
                        FechaRegistro = dbGI.DbSetProductoGISolicitud.Where(ps=>ps.ProductoId== x.ProductoId).Select(ps=>ps.FechaRegistro).FirstOrDefault(),
                        NombreTecnico = x.NombreTecnico,
                        ProyectoId = x.ProyectoId,
                        Proyecto = x.Proyecto.Nombre,
                        JefeProyecto = x.Proyecto.NombreJefeProyecto,
                        TipoAcceso = x.TipoAcceso,
                        TipoAccesoGI = x.TipoAccesoGI.Nombre,

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


        public async Task<IEnumerable<Object>> GetAllCompendio2()
        {
            try
            {
                var fechaActual = DateTime.Now;

                var entities = await dbGI.DbSetProductoGI
                    .Where(e => e.EstadoFlujoComite == 18)
                    .Where(e => e.VoBoDuenio == true)
                    .AsNoTracking()
                    .Include(x => x.ProductoAutores)
                    .Include(x => x.FactorInnovacion)
                    .Include(x => x.EstadoFlujo)
                    .Include(x => x.Proyecto)
                    .Include(x => x.TipoAccesoGI)
                    .Select(x => new {
                        ProductoId = x.ProductoId,
                        ClavePersona = x.ClavePersona,

                        ComiteFlujo = x.ComiteFlujo.Descripcion,
                        ComiteFlujoId = x.EstadoFlujoComite,
                        EstadoFlujo = x.EstadoFlujo.Descripcion,
                        EstadoFlujoId = x.EstadoFlujoId,
                        FactorInnovacion = x.FactorInnovacion.Descripcion,
                        FechaRegistro = dbGI.DbSetProductoGISolicitud.Where(ps => ps.ProductoId == x.ProductoId).Select(ps => ps.FechaRegistro).FirstOrDefault(),
                        NombreTecnico = x.NombreTecnico,
                        ProyectoId = x.ProyectoId,
                        Proyecto = x.Proyecto.Nombre,
                        JefeProyecto = x.Proyecto.NombreJefeProyecto,
                        CveJefeProyecto=x.Proyecto.NumjefeProyecto,
                        TipoAcceso = x.TipoAcceso,
                        TipoAccesoGI = x.TipoAccesoGI.Nombre,

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


        public async Task<IEnumerable<Object>> GetConsultaCompendio(ProductoGI parametros)
        {
            try
            {
                var fechaActual = DateTime.Now;

                var entities = dbGI.DbSetProductoGI
                    .Where(e => e.EstadoFlujoComite == 18)
                    .Where(e => e.VoBoDuenio == true)
                    .AsNoTracking()
                    .Include(x => x.FactorInnovacion)
                    .Include(x => x.Proyecto);

                if (entities != null)
                {
                    if(!String.IsNullOrEmpty(parametros.JefeProyecto))    //busqueda por jefe de proyecto
                    {
                        PersonasRepository persona = new PersonasRepository();
                        var fkspersonas = await persona.GetAllClavesByLikeNombreLatin1(parametros.JefeProyecto);
                        entities = entities.Where(e => fkspersonas.Contains(e.Proyecto.NumjefeProyecto));  ////<====== Revisar

                    }
                    if (!String.IsNullOrEmpty(parametros.ProyectoId))  //busqueda por numero de proyecto
                    {
                        entities = entities.Where(e => e.ProyectoId == parametros.ProyectoId);
                    }
                    if (!String.IsNullOrEmpty(parametros.UnidadOrganizacionalId))  //busqueda por gerencia
                    {
                        entities = entities.Where(e => e.UnidadOrganizacionalId == parametros.UnidadOrganizacionalId);
                    }
                    if (!String.IsNullOrEmpty(parametros.ClaveFactorInnovacion))  //busqueda por clave de factor de innovacion
                    {
                        var id = Convert.ToInt32(parametros.ClaveFactorInnovacion);
                        entities = entities.Where(e => e.FactorInnovacionId == id);
                    }
                    if (parametros.Periodo != 0)  //busqueda por periodo 
                    {
                        var fechaMinComparacion = new DateTime(parametros.Periodo, 1, 1);
                        var fechaMaxComparacion = new DateTime(parametros.Periodo, 12, 31);
                        var fksproductos = await dbGI.DbSetProductoGISolicitud.Where(e=> DbFunctions.TruncateTime(e.FechaRegistro) >= DbFunctions.TruncateTime(fechaMinComparacion) 
                                                                                    && DbFunctions.TruncateTime(e.FechaRegistro) <= DbFunctions.TruncateTime(fechaMaxComparacion))                                                    
                                                                                .AsNoTracking().Select(x=> x.ProductoId).ToListAsync();

                        entities = entities.Where(e => fksproductos.Contains(e.ProductoId));
                    }

                    var datos= entities.Select(x => new {
                        ProductoId = x.ProductoId,
                        ClavePersona = x.ClavePersona,
                        FactorInnovacion = x.FactorInnovacion.Descripcion,
                        FechaRegistro = dbGI.DbSetProductoGISolicitud.Where(ps => ps.ProductoId == x.ProductoId).Select(ps => ps.FechaRegistro).FirstOrDefault(),
                        NombreTecnico = x.NombreTecnico,
                        ProyectoId = x.ProyectoId,
                        Proyecto = x.Proyecto.Nombre,
                        JefeProyecto = x.Proyecto.NombreJefeProyecto,
                        CveJefeProyecto = x.Proyecto.NumjefeProyecto,

                        UnidadOrganizacional =
                        (from unidad in dbGI.DbSetUnidadOrganizacional
                         where x.UnidadOrganizacionalId.Equals(unidad.ClaveUnidad)
                                  && unidad.FechaEfectiva == dbGI.DbSetUnidadOrganizacional.Where(
                                                    p => p.FechaEfectiva <= fechaActual
                                                    && p.ClaveUnidad == unidad.ClaveUnidad
                                                    ).Max(e => e.FechaEfectiva)
                         select unidad.NombreUnidad).FirstOrDefault()
                    })
                    .ToList();

                    return datos;

                }
                    
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<Object>> GetFactoresInnovacion()
        {
            var factores = await dbGI.DbSetFactorInnovacion.AsNoTracking()
                            .Select(x=> new {
                                id= x.Id,
                                nombre= x.Descripcion
                                })
                .ToListAsync();

            return factores;
            
        }


        public async Task<IEnumerable<object/*ProductoGISolicitud*/>> GetAllByEvaluadorFI(String clavePersona)
        {
            try
            {
                List<int> productosGIId = await dbGI.DbSetProductoGIEvaluadores.AsNoTracking()
                    .Include(x=>x.MiembrosGI)
                    .Include(x=>x.ProductoGI)
                    .Where(x => x.MiembrosGI.ClavePersona == clavePersona && x.ProductoGI.EstadoFlujoComite==16)
                    .Select(x=> x.ProductoGIId)
                    .ToListAsync();
                var fechaActual = DateTime.Now;
                var entities = await dbGI.DbSetProductoGISolicitud.AsNoTracking()
                    .Include(x=> x.ProductoGI.EstadoFlujo)
                    .Include(x=> x.ProductoGI.ComiteFlujo)
                    .Include(x=> x.ProductoGI.Proyecto)
                    .Where(x=> productosGIId.Contains(x.ProductoId))
                                        .Select(x => new {
                                            ProductoId = x.ProductoId,
                                            ClavePersona = x.ProductoGI.ClavePersona,
                                            Descripcion = x.ProductoGI.Descripcion,
                                            ComiteFlujo = x.ProductoGI.ComiteFlujo.Descripcion,
                                            ComiteFlujoId = x.ProductoGI.EstadoFlujoComite,
                                            EstadoFlujo = x.ProductoGI.EstadoFlujo.Descripcion,
                                            EstadoFlujoId = x.ProductoGI.EstadoFlujoId,
                                            FactorInnovacion = x.ProductoGI.FactorInnovacion.Descripcion,
                                            FechaValidacion = x.ProductoGI.FechaValidacion,
                                            NombreTecnico = x.ProductoGI.NombreTecnico,
                                            ProyectoId = x.ProductoGI.ProyectoId,
                                            Proyecto = x.ProductoGI.Proyecto.Nombre,
                                            TipoAcceso = x.ProductoGI.TipoAcceso,
                                            TipoAccesoGI = x.ProductoGI.TipoAccesoGI.Nombre,
                                            FechaRegistro = x.ProductoGI.FechaRegistro,
                                            ProductoAutores = x.ProductoGI.ProductoAutores.Select(aut => aut.Nombre).ToList(),
                                            UnidadOrganizacionalId = x.ProductoGI.UnidadOrganizacionalId,
                                            UnidadOrganizacional =
                        (from unidad in dbGI.DbSetUnidadOrganizacional
                         where x.ProductoGI.UnidadOrganizacionalId.Equals(unidad.ClaveUnidad)
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
        public async Task<IEnumerable<ProductoGISolicitud>> GetAll()
        {
            try
            {
                var entities = await dbGI.DbSetProductoGISolicitud.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        
        public async Task<ProductoGISolicitud> GetByProductoId(int ProductoId)
        {
            try
            {
                var entities = await dbGI.DbSetProductoGISolicitud.AsNoTracking()
                    .Include("ProductoGISolicitudArchivosFase.Adjunto")
                    .Include("ProductoGISolicitudArchivosInnovacion.Adjunto")
                    .Include("ProductoGISolicitudArchivosSuperior.Adjunto")                    
                    .Where(x=>x.ProductoId== ProductoId)
                    .FirstOrDefaultAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<ProductoGISolicitud> GetById(int id)
        {
            try
            {
                var entities = await dbGI.DbSetProductoGISolicitud.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.Id == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(ProductoGISolicitud model)
        {
            try
            {
                if (model.ProductoId < 1)
                {
                    throw new Exception("No se recuperó ProductoId");
                }

                var fecha = DateTime.Now;
                if (model != null && model.ProductoGISolicitudArchivosInnovacion != null && model.ProductoGISolicitudArchivosInnovacion.Count() > 0)
                {

                    foreach (var a in model.ProductoGISolicitudArchivosInnovacion)
                    {
                        a.Fecha = fecha;
                    }
                }

                if (model != null && model.ProductoGISolicitudArchivosFase != null && model.ProductoGISolicitudArchivosFase.Count() > 0)
                {

                    foreach (var a in model.ProductoGISolicitudArchivosFase)
                    {
                        a.Fecha = fecha;
                    }
                }

                if (model != null && model.ProductoGISolicitudArchivosSuperior != null && model.ProductoGISolicitudArchivosSuperior.Count() > 0)
                {

                    foreach (var a in model.ProductoGISolicitudArchivosSuperior)
                    {
                        a.Fecha = fecha;
                    }
                }
                model.FechaRegistro = fecha;
                dbGI.DbSetProductoGISolicitud.Add(model);
                await dbGI.SaveChangesAsync();
                ProductoGIRepository repoProducto = new ProductoGIRepository(dbGI);
                var producto= await repoProducto.GetById(model.ProductoId);
                if (producto != null)
                {
                    await repoProducto.UpdateEstadoComite(producto, 16);
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(ProductoGISolicitud model)
        {
            try
            {
                var _model = await dbGI.DbSetProductoGISolicitud.FirstOrDefaultAsync(e => e.Id == model.Id);
                if (_model != null)
                {
                    dbGI.Entry(_model).CurrentValues.SetValues(model);
                    await dbGI.SaveChangesAsync();
                    await this.UpdateArchivosSuperior(model);
                    await this.UpdateArchivosFase(model);
                    await this.UpdateArchivosInnovacion(model);
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        private async Task UpdateArchivosSuperior(ProductoGISolicitud model)
        {
            try
            {
                var _model = await dbGI.DbSetProductoGISolicitud
                    .Where(e => e.Id == model.Id)
                    .Include(x => x.ProductoGISolicitudArchivosSuperior)
                    .FirstOrDefaultAsync();
                if (_model != null)
                {
                    if (model.ProductoGISolicitudArchivosSuperior != null && model.ProductoGISolicitudArchivosSuperior.Count() > 0)
                    {

                        ProductoGISolicitudArchivosSuperiorRepository gerDB = new ProductoGISolicitudArchivosSuperiorRepository(dbGI);
                        var fecha = DateTime.Now;
                        foreach (var e in model.ProductoGISolicitudArchivosSuperior)
                        {
                            if (e.Id < 1)//nuevo
                            {
                                e.Fecha = fecha;
                                e.ProductoGISolicitudId = model.Id;
                                await gerDB.Create(e);
                            }
                            else
                            {
                                if (e.Adjunto != null && e.Adjunto.nombre.Equals("eliminar"))
                                {
                                    await gerDB.Delete(e.Id);
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
        private async Task UpdateArchivosFase(ProductoGISolicitud model)
        {
            try
            {
                var _model = await dbGI.DbSetProductoGISolicitud
                    .Where(e => e.Id == model.Id)
                    .Include(x => x.ProductoGISolicitudArchivosFase)
                    .FirstOrDefaultAsync();
                if (_model != null)
                {
                    if (model.ProductoGISolicitudArchivosFase != null && model.ProductoGISolicitudArchivosFase.Count() > 0)
                    {

                        ProductoGISolicitudArchivosFaseRepository gerDB = new ProductoGISolicitudArchivosFaseRepository(dbGI);
                        var fecha = DateTime.Now;
                        foreach (var e in model.ProductoGISolicitudArchivosFase)
                        {
                            if (e.Id < 1)//nuevo
                            {
                                e.Fecha = fecha;
                                e.ProductoGISolicitudId = model.Id;
                                await gerDB.Create(e);
                            }
                            else
                            {
                                if (e.Adjunto != null && e.Adjunto.nombre.Equals("eliminar"))
                                {
                                    await gerDB.Delete(e.Id);
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
        private async Task UpdateArchivosInnovacion(ProductoGISolicitud model)
        {
            try
            {
                var _model = await dbGI.DbSetProductoGISolicitud
                    .Where(e => e.Id == model.Id)
                    .Include(x => x.ProductoGISolicitudArchivosInnovacion)
                    .FirstOrDefaultAsync();
                if (_model != null)
                {
                    if (model.ProductoGISolicitudArchivosInnovacion != null && model.ProductoGISolicitudArchivosInnovacion.Count() > 0)
                    {

                        ProductoGISolicitudArchivosInnovacionRepository gerDB = new ProductoGISolicitudArchivosInnovacionRepository(dbGI);
                        var fecha = DateTime.Now;
                        foreach (var e in model.ProductoGISolicitudArchivosInnovacion)
                        {
                            if (e.Id < 1)//nuevo
                            {
                                e.Fecha = fecha;
                                e.ProductoGISolicitudId = model.Id;
                                await gerDB.Create(e);
                            }
                            else
                            {
                                if (e.Adjunto != null && e.Adjunto.nombre.Equals("eliminar"))
                                {
                                    await gerDB.Delete(e.Id);
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
                var _model = await dbGI.DbSetProductoGISolicitud.FirstOrDefaultAsync(e => e.Id == id);
                if (_model != null)
                {
                    dbGI.DbSetProductoGISolicitud.Remove(_model);
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
