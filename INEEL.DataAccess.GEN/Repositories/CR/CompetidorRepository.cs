using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;
using INEEL.DataAccess.GEN.Models.GEN;
using System.Linq;



namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class CompetidorRepository : IDisposable
    {

        private CR_Context _dbComp;
        private GEN_Context _dbGEN;

        public CompetidorRepository()
        {
            _dbComp = new CR_Context();
            _dbGEN = new GEN_Context();
        }
        public async Task<int> countByStatus(Boolean estadoFlujo)
        {
            try
            {
                return await (from t in _dbComp.Competidor
                               .Where(f => f.Estado == estadoFlujo)
                              select t).CountAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Competidor>> GetAll()
        {
            try
            {
                var entities = await _dbComp.Competidor
                    .AsNoTracking()
                    .Include(e => e.Empresa)
                    .Include(e => e.SegmentoMercado)
                    .Include(e => e.LineaDesarrolloTecnologico)
                    .ToListAsync();

                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Competidor>> GetCompetidoresActivos()
        {
            try
            {
                var entities = await _dbComp.Competidor
                    .AsNoTracking()
                    .Include(e => e.Empresa)
                    .Include(e => e.SegmentoMercado)
                    .Include(e => e.LineaDesarrolloTecnologico)
                    .Where(e => e.Estado == true)
                    .ToListAsync();

                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<Object>> GetCompetidorGroupByLineaInvHot()
        {
            try
            {

                var vCompetidores = await (from competidor in (from competidorActual in _dbComp.Competidor.Include(e => e.LineaDesarrolloTecnologico)
                                                               select competidorActual)
                                           group competidor by new { competidor.LineaDesarrolloTecnologico.NomLinDesTec } into group1
                                           select new
                                           {
                                               competidorLinea = group1.Key.NomLinDesTec == null ? "No definido" : group1.Key.NomLinDesTec,
                                               Numero = group1.Count()
                                           }).ToListAsync();


                return vCompetidores;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<Competidor> Get(int id)
        {
            try
            {
                var entities = await _dbComp.Competidor
                    .AsNoTracking()
                    .Include(e => e.Empresa)
                    .Include(e => e.SegmentoMercado)
                    .Include(e => e.LineaDesarrolloTecnologico)
                    .Include(e => e.TamanoEmpresa)
                    .Include("AdjuntoPorCompetidor.Adjunto")
                    .Include("ServicioPorCompetidor.Servicio")
                    .Include("ProductoPorCompetidor.Producto")
                    .FirstOrDefaultAsync(e => e.CompetidorId == id);

                UORepository uo = new UORepository(_dbGEN);

                var unidadId = entities.ClaveUnidad;
                entities.UnidadOrganizacional = await uo.UnidadActualWithoutStatus(unidadId);

                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtiene listado de empresas registradas como competidor
        /// </summary>
        /// <returns>IEnumerable<Object></returns>
        public async Task<IEnumerable<Object>> GetEmpresasCompetidoras()
        {
            var listaFKEmpresas = await _dbComp.Competidor.AsNoTracking().Select(e => e.EmpresaId).ToListAsync();
            EmpresasRepository repo = new EmpresasRepository();
            var resultados = await repo.GetEmpresasByCollectionFKs(listaFKEmpresas);
            return resultados;
        }

        /// <summary>
        /// Obtiene los segmentos de competidores registrados
        /// </summary>
        /// <returns>IEnumerable<Object></returns>
        public async Task<IEnumerable<Object>> GetSegmentosCompetidores()
        {
            var listaFKCompetidores = await _dbComp.Competidor.Where(e => e.SegmentoMercadoId != null).AsNoTracking().Select(e => e.SegmentoMercadoId).ToListAsync();
            var resultados = await _dbComp.SegmentoMercado.Where(e => listaFKCompetidores.Contains(e.SegmentoMercadoId)).AsNoTracking()
                .Select(x => new
                {
                    idSegmento = x.SegmentoMercadoId,
                    nombre = x.NomSegMerc
                }).ToListAsync();

            return resultados;
        }

        /// <summary>
        /// Obtiene los productos por competidor registrado
        /// </summary>
        /// <returns>IEnumerable<Object></returns>
        public async Task<IEnumerable<Object>> GetProductosCompetidores()
        {
            var fks = await _dbComp.ProductoPorCompetidor.AsNoTracking().Select(e => e.ProductoId).ToListAsync();
            var resultados = await _dbComp.Producto.Where(e => fks.Contains(e.ProductoId)).AsNoTracking().
                Select(x => new
                {
                    productoId = x.ProductoId,
                    nombre = x.NomProd
                }).ToListAsync();

            return resultados;
        }

        /// <summary>
        /// Obtiene los servicios por competidor registrado
        /// </summary>
        /// <returns>IEnumerable<Object></returns>
        public async Task<IEnumerable<Object>> GetServiciosCompetidores()
        {
            var fks = await _dbComp.ServicioPorCompetidor.AsNoTracking().Select(e => e.ServicioId).ToListAsync();
            var resultados = await _dbComp.Servicio.Where(e => fks.Contains(e.ServicioId)).AsNoTracking().
                Select(x => new
                {
                    servicioId = x.ServicioId,
                    nombre = x.NomServ
                }).ToListAsync();

            return resultados;
        }

        /// <summary>
        /// Obtiene competidores acorde los parametros de busqueda por el usuario
        /// </summary>
        /// <returns>IEnumerable<Object></returns>
        public async Task<IEnumerable<Object>> GetConsultaParametrizadaCompetidores(Competidor parametros)
        {
            try
            {
                var competidores = (from cp in _dbComp.Competidor
                                    .Include(e => e.Empresa)
                                    .Include(e => e.SegmentoMercado)
                                    .Include(e=> e.LineaDesarrolloTecnologico)
                                    select cp).AsNoTracking();

                var listaProductos = await (from p in _dbComp.ProductoPorCompetidor.AsNoTracking()
                                            select new
                                            {
                                                p.ProductoId,
                                                p.CompetidorId
                                            }).ToListAsync();

                var listaServicios = await (from s in _dbComp.ServicioPorCompetidor.AsNoTracking()
                                            select new
                                            {
                                                s.ServicioId,
                                                s.CompetidorId
                                            }).ToListAsync();

                if (competidores != null)
                {
                    if (parametros.EmpresaId != 0) //Busqueda por empresa
                    {
                        competidores = competidores.Where(e => e.EmpresaId == parametros.EmpresaId);
                    }
                    if (!String.IsNullOrEmpty(parametros.TipoCompetidor))  //Busqueda por tipo competidor
                    {
                        competidores = competidores.Where(e => e.TipoCompetidor != null && e.TipoCompetidor == parametros.TipoCompetidor);
                    }
                    if(parametros.LineaDesarrolloTecnologicoId!=null)
                    {
                        if (parametros.LineaDesarrolloTecnologicoId == 0)
                        {
                            competidores = competidores.Where(x => x.LineaDesarrolloTecnologicoId == null);
                        }
                        else
                        {
                            competidores = competidores.Where(x => x.LineaDesarrolloTecnologicoId == parametros.LineaDesarrolloTecnologicoId);
                        }
                        
                    }
                    if (parametros.SegmentoMercadoId != 0 && parametros.SegmentoMercadoId != null) //Busqueda por segmento de mercado
                    {
                        competidores = competidores.Where(e => e.SegmentoMercadoId != null && e.SegmentoMercadoId == parametros.SegmentoMercadoId);
                    }
                    if (parametros.idProducto != 0)
                    {
                        var tempLista = listaProductos.Where(e => e.ProductoId == parametros.idProducto).Select(x => x.CompetidorId);
                        if (tempLista.Count() > 0)
                        {
                            competidores = competidores.Where(e => tempLista.Contains(e.CompetidorId));
                        }

                    }
                    if (parametros.idServicio != 0)
                    {
                        var tempListaServ = listaServicios.Where(e => e.ServicioId == parametros.idServicio).Select(x => x.CompetidorId);
                        if (tempListaServ.Count() > 0)
                        {
                            competidores = competidores.Where(e => tempListaServ.Contains(e.CompetidorId));
                        }

                    }

                    //******Se inicia el proceso de proyeccion******
                    //Los resultados lo guardaremos en una lista de X objeto
                    List<BusquedaParamsCR> datos = competidores.Select(x => new BusquedaParamsCR //Es una clase no mapeada que contiene caracteristicas 
                                                                                                 //que nos permiten albergar SOLO los datos necesarios
                    {
                        CompetidorId = x.CompetidorId, //Rescatamos los parametros que se requieren para el front
                        TipoCompetidor = x.TipoCompetidor,
                        SegmentoMercado = x.SegmentoMercado.NomSegMerc,
                        NombreEmpresa = x.Empresa.NombreEmpresa,
                        Estado = x.Estado,
                        LineaInvestigacion= x.LineaDesarrolloTecnologico.NomLinDesTec
                    }).ToList();

                    foreach (var d in datos)
                    {
                        var FKProductos = listaProductos.Where(e => e.CompetidorId == d.CompetidorId).Select(e => e.ProductoId).ToList();
                        d.listaProductos = await (from prod in _dbComp.Producto
                                                  where FKProductos.Contains(prod.ProductoId)
                                                  select prod.NomProd).AsNoTracking().ToListAsync();

                        var FKServicios = listaServicios.Where(e => e.CompetidorId == d.CompetidorId).Select(e => e.ServicioId).ToList();
                        d.listaServicios = await (from serv in _dbComp.Servicio
                                                  where FKServicios.Contains(serv.ServicioId)
                                                  select serv.NomServ).AsNoTracking().ToListAsync();
                    }

                    return datos;
                }
                return null;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Competidor> ValidaCompetidor(int EmpresaId)
        {
            try
            {
                var entities = await _dbComp.Competidor.AsNoTracking()
                     .FirstOrDefaultAsync(e => e.EmpresaId == EmpresaId);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<ProductoPorCompetidor> ValidaProductoCompetidor(Competidor model)
        {
            try
            {
                if (model.ParamCompetidor.Count > 0)
                {
                    var producto = model.ParamCompetidor[0].Prod;
                    var comp = model.ParamCompetidor[0].Competidor;

                    var entities = await _dbComp.ProductoPorCompetidor.AsNoTracking()
                     .FirstOrDefaultAsync(e => e.ProductoId == producto && e.CompetidorId == comp);
                    return entities;
                }

                var entities1 = await _dbComp.ProductoPorCompetidor.AsNoTracking()
                     .FirstOrDefaultAsync(e => e.ProductoId == 0);
                return entities1;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<ServicioPorCompetidor> ValidaServicioCompetidor(Competidor model)
        {
            try

            {
                if (model.ParamCompetidor.Count > 0)
                {
                    var servicio = model.ParamCompetidor[0].Serv;
                    var comp = model.ParamCompetidor[0].Competidor;

                    var entities = await _dbComp.ServicioPorCompetidor.AsNoTracking()
                     .FirstOrDefaultAsync(e => e.ServicioId == servicio && e.CompetidorId == comp);
                    return entities;
                }

                var entities1 = await _dbComp.ServicioPorCompetidor.AsNoTracking()
                     .FirstOrDefaultAsync(e => e.ServicioId == 0);
                return entities1;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(Competidor model)
        {
            try
            {

                _dbComp.Competidor.Add(model);
                await _dbComp.SaveChangesAsync();

                if (model.AdjuntosParam != null)  //Lista de adjuntos a agregar
                {
                    if (model.AdjuntosParam.Count > 0)
                    {
                        await insertaAdjunto(model);

                    }
                }

                if (model.ProductoId.Length > 0)  //Lista de ids de nuevos productos
                {
                    await insertaProducto(model);

                }
                if (model.ServicioId.Length > 0) //Lista de ids de nuevos servicios
                {
                    await insertaServicio(model);

                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        private async Task insertaServicio(Competidor model)
        {
            try
            {
                for (int i = 0; i < model.ServicioId.Length; i++)
                {
                    var Serv = model.ServicioId[i];

                    ServicioPorCompetidor obj = new ServicioPorCompetidor();
                    obj.Autor = model.Autor;
                    obj.FechaRegistro = model.FechaRegistro;
                    obj.Estado = true;
                    obj.ServicioId = Serv;
                    obj.CompetidorId = model.CompetidorId;
                    var entities = _dbComp.ServicioPorCompetidor.Add(obj);
                    await _dbComp.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }

        private async Task insertaProducto(Competidor model)
        {
            try
            {
                for (int i = 0; i < model.ProductoId.Length; i++)
                {
                    var Prod = model.ProductoId[i];

                    ProductoPorCompetidor obj = new ProductoPorCompetidor();
                    obj.Autor = model.Autor;
                    obj.FechaRegistro = model.FechaRegistro;
                    obj.Estado = true;
                    obj.ProductoId = Prod;
                    obj.CompetidorId = model.CompetidorId;
                    var entities = _dbComp.ProductoPorCompetidor.Add(obj);
                    await _dbComp.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }
        private async Task insertaAdjunto(Competidor model)
        {
            try
            {
                for (int i = 0; i < model.AdjuntosParam.Count; i++)
                {
                    var nombre = model.AdjuntosParam[i].adjuntosNuevosNombre;
                    var ruta = model.AdjuntosParam[i].adjuntosNuevosRuta.ToString();
                    var tipo = model.AdjuntosParam[i].tipo.ToString();

                    Adjunto obj = new Adjunto();
                    obj.RutaCompleta = ruta;
                    obj.nombre = nombre;
                    obj.ModuloId = "CR";
                    var entities = _dbGEN.dbSetAdjuntos.Add(obj);
                    await _dbGEN.SaveChangesAsync();
                    var adjuntoId = entities.AdjuntoId;
                    await insertaAdjuntosCompetidor(model, adjuntoId, tipo);
                }
            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }
        private async Task insertaAdjuntosCompetidor(Competidor model, long IdAdjunto, string tipo)
        {
            try
            {
                AdjuntoPorCompetidor obj = new AdjuntoPorCompetidor();
                obj.Autor = model.Autor;
                obj.FechaRegistro = model.FechaRegistro;
                obj.Estado = true;
                obj.AdjuntoId = IdAdjunto;
                obj.CompetidorId = model.CompetidorId;
                if (tipo.ToLower() == "tarifa")
                {
                    obj.Tarifa = true;
                }
                if (tipo.ToLower() == "vtc")
                {
                    obj.VTC = true;
                }

                var entities = _dbComp.AdjuntoPorCompetidor.Add(obj);
                await _dbComp.SaveChangesAsync();


            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }


        private async Task insertaAdjuntosCompetidor(string autor, long IdAdjunto, string tipo, int idcompetidor)
        {
            try
            {
                AdjuntoPorCompetidor obj = new AdjuntoPorCompetidor();
                obj.Autor = autor;
                obj.FechaRegistro = DateTime.Now;
                obj.Estado = true;
                obj.AdjuntoId = IdAdjunto;
                obj.CompetidorId = idcompetidor;
                if (tipo.ToLower() == "tarifa")
                {
                    obj.Tarifa = true;
                }
                if (tipo.ToLower() == "vtc")
                {
                    obj.VTC = true;
                }

                var entities = _dbComp.AdjuntoPorCompetidor.Add(obj);
                await _dbComp.SaveChangesAsync();


            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(Competidor model)
        {
            try
            {
                var _model = await _dbComp.Competidor.FirstOrDefaultAsync(e => e.CompetidorId == model.CompetidorId);
                if (_model != null)
                {
                    _dbComp.Entry(_model).CurrentValues.SetValues(model);
                    await _dbComp.SaveChangesAsync();

                    //Se eliminan los adjuntos anteriores del registro, esto evita tener multiples listas de adjuntos (nuevos, viejos) por cada adjunto que agregue/elimine el usuario
                    var fksAdjuntos = await _dbComp.AdjuntoPorCompetidor.Where(e => e.CompetidorId == model.CompetidorId).ToListAsync();
                    if (fksAdjuntos.Count() > 0)
                    {
                        var listaAdjuntos = fksAdjuntos.Select(x => x.AdjuntoId).ToList();
                        _dbComp.AdjuntoPorCompetidor.RemoveRange(fksAdjuntos);
                        await _dbComp.SaveChangesAsync();

                        await new AdjuntoRepository().DeleteByCollectionIds(listaAdjuntos);
                    }

                    //Se registran los  adjuntos de nuevo
                    if (model.AdjuntoPorCompetidor.Count > 0)
                    {
                        foreach (var item in model.AdjuntoPorCompetidor)
                        {
                            Adjunto obj = new Adjunto();
                            obj.RutaCompleta = item.Adjunto.RutaCompleta;
                            obj.nombre = item.Adjunto.nombre;
                            obj.ModuloId = "CR";
                            var entities = _dbGEN.dbSetAdjuntos.Add(obj);
                            await _dbGEN.SaveChangesAsync();

                            await insertaAdjuntosCompetidor(item.Autor, obj.AdjuntoId, item.tipo, model.CompetidorId);//string autor, long IdAdjunto, string tipo, int idcompetidor
                        }

                        // await insertaAdjunto(model);

                    }


                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        private async Task EliminaTarifa(Competidor model)
        {
            try
            {
                var adjuntoId = model.tarAdjuntoIdAntDel;
                var adjuntoCompId = model.tarAdjuntoCompAntDel;

                var _model = await _dbGEN.dbSetAdjuntos.FirstOrDefaultAsync(e => e.AdjuntoId == adjuntoId);
                if (_model != null)
                {
                    _dbGEN.dbSetAdjuntos.Remove(_model);
                    await _dbComp.SaveChangesAsync();
                }

                var _modelComp = await _dbComp.AdjuntoPorCompetidor.FirstOrDefaultAsync(e => e.AdjuntoId == adjuntoId);
                if (_model != null)
                {
                    _dbComp.AdjuntoPorCompetidor.Remove(_modelComp);
                    await _dbComp.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }
        private async Task EliminaVTC(Competidor model)
        {
            try
            {
                var adjuntoId = model.vtcAdjuntoIdAntDel;
                var adjuntoCompId = model.vtcAdjuntoCompAntDel;

                var _model = await _dbGEN.dbSetAdjuntos.FirstOrDefaultAsync(e => e.AdjuntoId == adjuntoId);
                if (_model != null)
                {
                    _dbGEN.dbSetAdjuntos.Remove(_model);
                    await _dbComp.SaveChangesAsync();
                }

                var _modelComp = await _dbComp.AdjuntoPorCompetidor.FirstOrDefaultAsync(e => e.AdjuntoId == adjuntoId);
                if (_model != null)
                {
                    _dbComp.AdjuntoPorCompetidor.Remove(_modelComp);
                    await _dbComp.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }
        public async Task<ProductoPorCompetidor> InsertaProductoUpdate(ProductoPorCompetidor model)
        {
            try
            {
                var entities = _dbComp.ProductoPorCompetidor.Add(model);
                await _dbComp.SaveChangesAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<ServicioPorCompetidor> InsertaServicioUpdate(ServicioPorCompetidor model)
        {
            try
            {
                var entities = _dbComp.ServicioPorCompetidor.Add(model);
                await _dbComp.SaveChangesAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        private async Task EliminaProducto(Competidor model)
        {
            try
            {
                foreach (var item in model.ProductoAntDel)
                {
                    var _model = await _dbComp.ProductoPorCompetidor.FirstOrDefaultAsync(e => e.ProductoId == item);
                    if (_model != null)
                    {
                        _dbComp.ProductoPorCompetidor.Remove(_model);
                        await _dbComp.SaveChangesAsync();
                    }

                }
            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }

        private async Task EliminaServicio(Competidor model)
        {
            try
            {
                foreach (var item in model.ServicioAntDel)
                {
                    var _model = await _dbComp.ServicioPorCompetidor.FirstOrDefaultAsync(e => e.ServicioId == item);
                    if (_model != null)
                    {
                        _dbComp.ServicioPorCompetidor.Remove(_model);
                        await _dbComp.SaveChangesAsync();
                    }

                }
            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(Competidor model)
        {
            try
            {
                var _model = await _dbComp.Competidor.FirstOrDefaultAsync(e => e.CompetidorId == model.CompetidorId);
                if (_model != null)
                {
                    _model.Estado = model.Estado;

                    await _dbComp.SaveChangesAsync();
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
                var _model = await _dbComp.Competidor.FirstOrDefaultAsync(e => e.CompetidorId == id);
                if (_model != null)
                {
                    _dbComp.Competidor.Remove(_model);
                    await _dbComp.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task DeleteCompetidor(int id)
        {
            try
            {
                var _model = await _dbComp.Competidor
                    .FirstOrDefaultAsync(e => e.CompetidorId == id);
                if (_model != null)
                {
                    //elimina los productos asociados al competidor
                    var productos = await _dbComp.ProductoPorCompetidor.Where(x => x.CompetidorId == id).ToListAsync();
                    if(productos.Count() > 0)
                    {
                        _dbComp.ProductoPorCompetidor.RemoveRange(productos);
                    }
                    
                    //elimina los servicios asociados al competidor
                    var servicios = await _dbComp.ServicioPorCompetidor.Where(x => x.CompetidorId == id).ToListAsync();
                    if(servicios.Count() >0)
                    {
                        _dbComp.ServicioPorCompetidor.RemoveRange(servicios);
                    }
                    
                    //Elimina los adjuntos por Convenio
                    var adjuntos = await _dbComp.AdjuntoPorCompetidor.Where(x => x.CompetidorId == id).ToListAsync();
                    if(adjuntos.Count() > 0)
                    {
                        var idsadjuntos = adjuntos.Select(x => x.AdjuntoId).ToList();
                        _dbComp.AdjuntoPorCompetidor.RemoveRange(adjuntos);
                        await _dbComp.SaveChangesAsync();

                        await new AdjuntoRepository().DeleteByCollectionIds(idsadjuntos);
                    }
                    
                    _dbComp.Competidor.Remove(_model);
                    await _dbComp.SaveChangesAsync();

                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Object> verificaGerenteComercializacion(string clave){
            try
            {
                var result = await _dbGEN.dbSetUnidadOrganizacional.Where(e => e.ClaveUnidad == "55" && e.ClaveResponsable == clave).AsNoTracking()
                                                        .OrderByDescending(e => e.FechaEfectiva)
                                                        .FirstOrDefaultAsync();
                return result;
            }catch(Exception e)
            {
                throw new Exception(e.Message, e);
            }
            
        }

        public void Dispose()
        {
            _dbComp.Dispose();
            _dbGEN.Dispose();
        }
    }
}

