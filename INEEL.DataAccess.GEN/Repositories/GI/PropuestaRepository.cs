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
    public class PropuestaRepository
    {
        private AdjuntoRepository _adjuntoRepo;
        private GI_Context dbGI;
        public PropuestaRepository()
        {
            dbGI = new GI_Context();
            _adjuntoRepo = new AdjuntoRepository();
        }
        
            public async Task<IEnumerable<Object>> GetAllCarterabyEmpleado(String claveEmpleado)
        {
            try
            {
                var entities = await dbGI.DbSetPropuesta.AsNoTracking().
                    Include(x => x.EstadoFlujo)
                    .Include(x => x.TipoAcceso)
                    .Include(x=> x.SegmentoMercado)
                    .Include(x=> x.Empresa)
                    .Where(x=> x.ClaveProponentePrincipal.Equals(claveEmpleado)
                    || x.ClavePersona.Equals(claveEmpleado))
                    .Select(x => new
                    {
                        Id = x.Id,
                        PropuestaId = x.PropuestaId,
                        IdeaInnovadoraId = x.IdeaInnovadoraId,
                        IdeaInnovadoraTitulo = x.IdeaInnovadora.NombreIdea,
                        PropuestaInterna = x.PropuestaInterna,
                        NombreTecnico = x.NombreTecnico,
                        ProductoServicio = x.ProductoServicio,
                        ClaveProponentePrincipal = x.ClaveProponentePrincipal,
                        Proponente = dbGI.DbSetPersonas
                                        .Where(p => p.ClavePersona.Equals(x.ClaveProponentePrincipal))
                                        .OrderByDescending(p => p.FechaEfectiva)
                                        .Select(p => String.Concat(p.Nombre, " ", p.ApellidoPaterno, " ", p.ApellidoMaterno)).FirstOrDefault(),
                        EmpresaPromotorClave = x.EmpresaPromotorClave,
                        EmpresaPromotorNombre = x.Empresa.NombreEmpresa,
                        UnidadOrganizacionalId = x.UnidadOrganizacionalId,
                        NombreUnidadOrganizacional = x.NombreUnidadOrganizacional,
                        SegmentoMercadoId = x.SegmentoMercadoId,
                        SegmentoMercadoNombre = x.SegmentoMercado.NomSegMerc,
                        FechaRegistro = x.FechaRegistro,
                        ClavePersona = x.ClavePersona,
                        FechaValidacion = x.FechaValidacion,
                        EstadoFlujoId = x.EstadoFlujoId,
                        EstadoFlujoNombre = x.EstadoFlujo.Descripcion,
                        TipoAcceso = x.TipoAcceso,
                        TipoAccesoNombre = x.TipoAccesoGI.Nombre
                    })
                    .ToListAsync();
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
                var entities = await dbGI.DbSetPropuesta.AsNoTracking().
                    Include(x => x.EstadoFlujo)
                    .Include(x => x.TipoAcceso)
                    .Include(x => x.SegmentoMercado)
                    .Include(x => x.Empresa)
                    .Where(x=> x.EstadoFlujoId==10)
                    .Select(x => new
                    {
                        Id = x.Id,
                        PropuestaId = x.PropuestaId,
                        IdeaInnovadoraId = x.IdeaInnovadoraId,
                        IdeaInnovadoraTitulo = x.IdeaInnovadora.NombreIdea,
                        PropuestaInterna = x.PropuestaInterna,
                        NombreTecnico = x.NombreTecnico,
                        ProductoServicio = x.ProductoServicio,
                        ClaveProponentePrincipal = x.ClaveProponentePrincipal,
                        Proponente = dbGI.DbSetPersonas
                                        .Where(p => p.ClavePersona.Equals(x.ClaveProponentePrincipal))
                                        .OrderByDescending(p => p.FechaEfectiva)
                                        .Select(p => String.Concat(p.Nombre, " ", p.ApellidoPaterno, " ", p.ApellidoMaterno)).FirstOrDefault(),
                        EmpresaPromotorClave = x.EmpresaPromotorClave,
                        EmpresaPromotorNombre = x.Empresa.NombreEmpresa,
                        UnidadOrganizacionalId = x.UnidadOrganizacionalId,
                        NombreUnidadOrganizacional = x.NombreUnidadOrganizacional,
                        SegmentoMercadoId = x.SegmentoMercadoId,
                        SegmentoMercadoNombre = x.SegmentoMercado.NomSegMerc,
                        FechaRegistro = x.FechaRegistro,
                        ClavePersona = x.ClavePersona,
                        FechaValidacion = x.FechaValidacion,
                        EstadoFlujoId = x.EstadoFlujoId,
                        EstadoFlujoNombre = x.EstadoFlujo.Descripcion,
                        TipoAcceso = x.TipoAcceso,
                        TipoAccesoNombre = x.TipoAccesoGI.Nombre
                    })
                    .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<Object>> GetConsultaCartera(Propuesta parametros)
        {
            try
            {
                var entities = dbGI.DbSetPropuesta.AsNoTracking().
                    Include(x => x.EstadoFlujo)
                    .Include(x => x.TipoAccesoGI)
                    .Include(x => x.SegmentoMercado)
                    .Include(x => x.Empresa);
                if (entities != null)
                {
                    
                    if (parametros.EstadoFlujoId != 0) //Consulta hecha por el publico en general
                    {
                        entities = entities.Where(e => e.EstadoFlujoId == 10);
                    }
                    if (!String.IsNullOrEmpty(parametros.ClavePersona)) //consulta hecha para obtener las propuestas por cada persona
                    {
                        entities = entities.Where(x => x.ClaveProponentePrincipal == parametros.ClavePersona || x.ClavePersona==parametros.ClavePersona);
                    }
                    if (!String.IsNullOrEmpty(parametros.NombreTecnico)) //busqueda por el nombre tecnico de una propuesta
                    {
                        var fkspropuestas = await GetPropuestasLikeNombreLatin1(parametros.NombreTecnico);
                        entities = entities.Where(e => fkspropuestas.Contains(e.Id));
                    }
                    if (!String.IsNullOrEmpty(parametros.ProductoServicio)) //busqueda por el nombre propuesto del producto o servicio
                    {
                        var fksproductos = await GetPropuestasByNombreProductoServicioLatin1(parametros.ProductoServicio);
                        entities = entities.Where(e => fksproductos.Contains(e.Id));
                    }
                    if (parametros.EmpresaPromotorClave != null)  //busqueda por empresa
                    {
                        entities = entities.Where(e => e.EmpresaPromotorClave == parametros.EmpresaPromotorClave);
                    }
                    if (parametros.SegmentoMercadoId != 0)  //busqueda por el segmento de mercado
                    {
                        entities = entities.Where(e => e.SegmentoMercadoId == parametros.SegmentoMercadoId);
                    }
                    if (!String.IsNullOrEmpty(parametros.NombreProponentePrincipal))  //busqueda por el proponente principal
                    {
                        PersonasRepository persona = new PersonasRepository();
                        var clavesInv = await persona.GetAllClavesByLikeNombreLatin1(parametros.NombreProponentePrincipal);
                        entities = entities.Where(e => clavesInv.Contains(e.ClaveProponentePrincipal));
                    }
                    if (!String.IsNullOrEmpty(parametros.UnidadOrganizacionalId))  //busqueda por la clave de la unidad organizacional
                    {
                        entities = entities.Where(e => e.UnidadOrganizacionalId == parametros.UnidadOrganizacionalId);
                    }
                    if (!String.IsNullOrEmpty(parametros.busquedaFecha))  //busqueda por fecha
                    {
                        entities = entities.Where(e => (DbFunctions.TruncateTime(e.FechaRegistro) >= DbFunctions.TruncateTime(parametros.fechaInicioComparacion) && DbFunctions.TruncateTime(e.FechaRegistro) <= DbFunctions.TruncateTime(parametros.fechaFinalComparacion) && e.FechaRegistro != null));
                    }

                    
                    var datos= entities.Select(x => new
                    {
                        Id = x.Id,
                        PropuestaId = x.PropuestaId,
                        IdeaInnovadoraId = x.IdeaInnovadoraId,
                        IdeaInnovadoraTitulo = x.IdeaInnovadora.NombreIdea,
                        PropuestaInterna = x.PropuestaInterna,
                        NombreTecnico = x.NombreTecnico,
                        ProductoServicio = x.ProductoServicio,
                        ClaveProponentePrincipal = x.ClaveProponentePrincipal,
                        Proponente = dbGI.DbSetPersonas
                                        .Where(p => p.ClavePersona.Equals(x.ClaveProponentePrincipal))
                                        .OrderByDescending(p => p.FechaEfectiva)
                                        .Select(p => String.Concat(p.Nombre, " ", p.ApellidoPaterno, " ", p.ApellidoMaterno)).FirstOrDefault(),
                        EmpresaPromotorClave = x.EmpresaPromotorClave,
                        EmpresaPromotorNombre = x.Empresa.NombreEmpresa,
                        UnidadOrganizacionalId = x.UnidadOrganizacionalId,
                        NombreUnidadOrganizacional = x.NombreUnidadOrganizacional,
                        SegmentoMercadoId = x.SegmentoMercadoId,
                        SegmentoMercadoNombre = x.SegmentoMercado.NomSegMerc,
                        FechaRegistro = x.FechaRegistro,
                        ClavePersona = x.ClavePersona,
                        FechaValidacion = x.FechaValidacion,
                        EstadoFlujoId = x.EstadoFlujoId,
                        EstadoFlujoNombre = x.EstadoFlujo.Descripcion,
                        TipoAcceso = x.TipoAcceso,
                        TipoAccesoNombre = x.TipoAccesoGI.Nombre,
                        //PlanNegocioEvolutivoId = (dbGI.DbSetPlanNegocioEvolutivo.Where(w=> w.PropuestaClave==x.Id ).Select(z=> z.PlanNegocioEvolutivoId).FirstOrDefault())
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


        /// <summary>
        /// Obtener todas las claves de los propuestas
        /// </summary>
        /// <returns></returns>
        public async Task<List<int>> GetPropuestasLikeNombreLatin1(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT Id FROM GI.tab_Propuesta where NombreTecnico collate Latin1_General_CI_AI LIKE ";
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
        /// Obtener todas las claves de los propuestas
        /// </summary>
        /// <returns></returns>
        public async Task<List<int>> GetPropuestasByNombreProductoServicioLatin1(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT Id FROM GI.tab_Propuesta where ProductoServicio collate Latin1_General_CI_AI LIKE ";
                foreach (var palabra in palabras)
                {
                    query = query + "'%" + palabra + "%' and ProductoServicio collate Latin1_General_CI_AI LIKE";
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
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Object> GetJustificacionSolicitudRechazada(string id){
            try{
                var solicitudId= await dbGI.DbSetSolicitudGI.AsNoTracking().Where(e=> e.InformacionId == id  && e.TipoInformacionId==29).Select(e=> e.SolicitudId).FirstOrDefaultAsync();
                var entitie= await dbGI.DbSetBitacoraSolicitudesGI
                            .Where(e=> e.SolicitudId== solicitudId && e.Descripcion.Contains("Rechazada"))
                            .OrderByDescending(e=>e.FechaMovimiento).FirstOrDefaultAsync();
                return entitie;
            }catch(Exception e){
                throw new Exception(e.Message,e);
            }
        }

        public async Task<Object> GetJustificacionSolicitudAModificar(string id){
            try{
                // var solicitudId= await dbGI.DbSetSolicitudGI.AsNoTracking().Where(e=> e.InformacionId == id).Select(e=> e.SolicitudId).FirstOrDefaultAsync();
                var entitie= await dbGI.DbSetBitacoraSolicitudesGI
                            .Where(e=> e.Descripcion.Contains("Se envió a modificación") && e.SolicitudId== 
                                (dbGI.DbSetSolicitudGI
                                    .Where(x=> x.InformacionId == id  && x.TipoInformacionId==29)
                                    .Select(x=> x.SolicitudId)
                                    .FirstOrDefault() )
                             )
                            .OrderByDescending(e=>e.FechaMovimiento).FirstOrDefaultAsync();
                return entitie;
            }catch(Exception e){
                throw new Exception(e.Message,e);
            }
        }

        public async Task<Object> GetJustificacionSolicitudAceptada(string id){
            try{
                // var solicitudId= await dbGI.DbSetSolicitudGI.AsNoTracking().Where(e=> e.InformacionId == id).Select(e=> e.SolicitudId).FirstOrDefaultAsync();
                var entitie= await dbGI.DbSetBitacoraSolicitudesGI
                            .Where(e=> e.Descripcion.Contains("Aprobada la propuesta") && e.SolicitudId == 
                                        (dbGI.DbSetSolicitudGI
                                            .Where(x=> x.InformacionId == id && x.TipoInformacionId==29)
                                            .Select(x=> x.SolicitudId)
                                            .FirstOrDefault() )
                             )
                            .OrderByDescending(e=>e.FechaMovimiento).FirstOrDefaultAsync();
                return entitie;
            }catch(Exception e){
                throw new Exception(e.Message,e);
            }
        }

        //public async Task<Object> GetJustificacionPlanAceptado(string id){
        //    try{
        //        // var solicitudId= await dbGI.DbSetSolicitudGI.AsNoTracking().Where(e=> e.InformacionId == id).Select(e=> e.SolicitudId).FirstOrDefaultAsync();
        //        var entitie= await dbGI.DbSetBitacoraSolicitudesGI
        //                    .Where(e=> e.Descripcion.Contains("Aprobado el plan de negocio evolutivo") && e.EstadoFlujoId==10 && e.SolicitudId == 
        //                                (dbGI.DbSetSolicitudGI
        //                                    .Where(x=> x.InformacionId == id  && x.TipoInformacionId==29)
        //                                    .Select(x=> x.SolicitudId)
        //                                    .FirstOrDefault() )
        //                     )
        //                    .OrderByDescending(e=>e.FechaMovimiento).FirstOrDefaultAsync();
        //        return entitie;
        //    }catch(Exception e){
        //        throw new Exception(e.Message,e);
        //    }
        //}

        
        public async Task<int> CountPropuesta()
        {
            try
            {
                var entities = await dbGI.DbSetPropuesta
                    .Where(e => e.EstadoFlujoId == 10)
                    .AsNoTracking().CountAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<Object>> GetAllForModal()
        {
            try
            {
                var entities = await dbGI.DbSetPropuesta.AsNoTracking()
                    .Select(x=> new { propuestaClave= x.Id,
                      identificadorPropuesta= x.PropuestaId,
                      nombre = x.NombreTecnico
                    })
                    .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<Propuesta>> GetAll()
        {
            try
            {
                var entities = await dbGI.DbSetPropuesta.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Boolean> EvidenciaDownload(int idRegistro, String ClavePersona)
        {
            try
            {
                var entitie = await dbGI.DbSetPropuesta.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.Id == idRegistro);
                if (entitie.TipoAcceso == 1)
                { //1: publico
                    return true;
                }
                else
                {
                    if (entitie.ClaveProponentePrincipal.Equals(ClavePersona))
                    {
                        return true;
                    }else if (entitie.ClavePersona.Equals(ClavePersona))
                    {
                        return true;
                    }else 
                    {
                        JerarquiaRepository hiper = new JerarquiaRepository();
                        Jerarquia jer = new Jerarquia(null, ClavePersona, null);
                        jer.JefeHiperonimo = ClavePersona;
                        jer.UnidadOrganizacionalId = entitie.UnidadOrganizacionalId;
                        return  await hiper.isJefeHiperonimoByUnidadOrganizacionalId(jer);
                    }
                }                
                return false;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<Propuesta> GetById(String clavePropuesta)
        {
            try
            {
                var entitie = await dbGI.DbSetPropuesta.AsNoTracking()
                     // .Include(x=> x.FK)
                     .Include(x => x.Adjunto)
                     .Include(x => x.TipoAccesoGI)
                    .Include(x => x.IdeaInnovadora)
                    .FirstOrDefaultAsync(e => e.PropuestaId == clavePropuesta);
                if (entitie != null)
                {
                    var empresa = await dbGI.DbSetEmpresa.AsNoTracking()
                   .FirstOrDefaultAsync(e => entitie.EmpresaPromotorClave == e.EmpresaId);
                    if (empresa != null)
                    {
                        entitie.EmpresaPromotorNombre = empresa.NombreEmpresa;
                    }
                    entitie.NombreProponentePrincipal = dbGI.DbSetPersonas
                                        .Where(p => p.ClavePersona.Equals(entitie.ClaveProponentePrincipal))
                                        .OrderByDescending(p => p.FechaEfectiva)
                                        .Select(p => String.Concat(p.Nombre, " ", p.ApellidoPaterno, " ", p.ApellidoMaterno)).FirstOrDefault();
                    SegmentoMercadoRepository sg = new SegmentoMercadoRepository();
                    var segmento = await sg.Get(entitie.SegmentoMercadoId);
                    if (segmento != null)
                    {
                        entitie.SegmentoMercadoNombre = segmento.NomSegMerc;
                    }
                }
                return entitie;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Propuesta> GetByIdIdentity(int id)
        {
            try
            {
                var entitie = await dbGI.DbSetPropuesta.AsNoTracking()
                    // .Include(x=> x.FK)
                    .Include(x => x.IdeaInnovadora)
                    .Include(x=>x.Adjunto)
                    .Include(x=>x.TipoAccesoGI)
                    .FirstOrDefaultAsync(e => e.Id == id);
                if (entitie != null)
                {
                    var empresa = await dbGI.DbSetEmpresa.AsNoTracking()
                   .FirstOrDefaultAsync(e => entitie.EmpresaPromotorClave == e.EmpresaId);
                    if (empresa != null)
                    {
                        entitie.EmpresaPromotorNombre = empresa.NombreEmpresa;
                    }
                    entitie.NombreProponentePrincipal = dbGI.DbSetPersonas
                                        .Where(p => p.ClavePersona.Equals(entitie.ClaveProponentePrincipal))
                                        .OrderByDescending(p => p.FechaEfectiva)
                                        .Select(p => String.Concat(p.Nombre, " ", p.ApellidoPaterno, " ", p.ApellidoMaterno)).FirstOrDefault();

                    SegmentoMercadoRepository sg = new SegmentoMercadoRepository();
                    var segmento = await sg.Get(entitie.SegmentoMercadoId);
                    if (segmento != null)
                    {
                        entitie.SegmentoMercadoNombre = segmento.NomSegMerc;
                    }
                }
                return entitie;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<object> Create(Propuesta model)
        {
            try
            {
                model.FechaRegistro = DateTime.Today;
                dbGI.DbSetPropuesta.Add(model);
                await dbGI.SaveChangesAsync();
                return model.Id;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(Propuesta model)
        {
            try
            {
                var _model = await dbGI.DbSetPropuesta.FirstOrDefaultAsync(e => e.Id == model.Id);

                if (_model.AdjuntoId != null)
                {
                    var id = _model.AdjuntoId;
                    _model.AdjuntoId = null;
                    await dbGI.SaveChangesAsync();
                    await new AdjuntoRepository().Delete(id);
                }

                if (model.Adjunto != null)
                {
                    Adjunto key = await _adjuntoRepo.CreateAd(model.Adjunto);
                    model.AdjuntoId = key.AdjuntoId;
                    model.Adjunto.AdjuntoId = key.AdjuntoId;
                }
                else
                {
                    model.AdjuntoId = null;
                }

                
                if (_model != null)
                {
                    if (model.EstadoFlujoId == 14)
                    {
                        model.FechaRegistro = DateTime.Now;
                    };
                    dbGI.Entry(_model).CurrentValues.SetValues(model);
                    await dbGI.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(Propuesta model)
        {
            try
            {
                var _model = await dbGI.DbSetPropuesta.FirstOrDefaultAsync(e => e.Id == model.Id);
                if (_model != null)
                {
                    _model.EstadoFlujoId = model.EstadoFlujoId;
                    if (model.EstadoFlujoId == 10)
                    {                       
                        _model.FechaValidacion = DateTime.Now;
                    }
                    await dbGI.SaveChangesAsync();
                    //if (model.EstadoFlujoId == 10 && model.TipoAcceso==1)
                    //{
                    //    NuevoOCRepository nuevo = new NuevoOCRepository();
                    //    await nuevo.Create(new NuevoOC("GI", "PROP", _model.NombreTecnico,
                    //        "indexGI.html#/detallesbuscarPropuestas/" + _model.Id,
                    //         _model.Id.ToString()
                    //        ));
                    //}
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Delete(String clavePropuesta)
        {
            try
            {
                var _model = await dbGI.DbSetPropuesta.FirstOrDefaultAsync(e => e.PropuestaId == clavePropuesta);
                if (_model != null)
                {
                    dbGI.DbSetPropuesta.Remove(_model);
                    await dbGI.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task DeletePropuestaConPlan(int clavePropuesta)
        {
            try
            {
                var plan = await dbGI.DbSetPlanNegocioEvolutivo.FirstOrDefaultAsync(x => x.PropuestaClave == clavePropuesta);
                if (plan != null)
                {
                    dbGI.DbSetPlanNegocioEvolutivo.Remove(plan);
                    await dbGI.SaveChangesAsync();
                }

                var _model = await dbGI.DbSetPropuesta.FirstOrDefaultAsync(e => e.Id == clavePropuesta);
                if (_model != null)
                {
                    dbGI.DbSetPropuesta.Remove(_model);
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
