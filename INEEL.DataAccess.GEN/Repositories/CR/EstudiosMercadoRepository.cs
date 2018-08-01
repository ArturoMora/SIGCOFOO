using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CR;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Models.GEN.CH.Entities;
using INEEL.DataAccess.CR.Models;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class EstudiosMercadoRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        CR_Context _ctx;
        GEN_Context _ctxGen;

        public EstudiosMercadoRepository()
        {
            _ctx = new CR_Context();
            _ctxGen = new GEN_Context();
        }
        public async Task<int> countByStatus(Boolean estadoFlujo)
        {
            try
            {
                return await (from t in _ctx.EstudiosMercado
                               //.Where(f => f.Estado == estadoFlujo)
                              select t).CountAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<EstudiosMercado>> GetAll()
        {
            try
            {
                var result = await _ctx.EstudiosMercado.OrderByDescending(f => f.Fecha)
                                        .AsNoTracking()
                                        .ToListAsync();

                if (result!= null)
                {

                    List<String> UnidadId = new List<string>(result.Select(x => x.ClaveUnidad));
                    List<String> proyectosId = new List<string>(result.Select(x => x.ProyectoId));

                    List<UnidadOrganizacional> Unidades= await _ctxGen.dbSetUnidadOrganizacional
                        .Where(x => UnidadId.Contains(x.ClaveUnidad))
                        .OrderByDescending(x=>x.FechaEfectiva)
                        .AsNoTracking().ToListAsync();

                    List<Proyecto> Proyectos = await _ctxGen.dbSetProyectoGEN
                        .Where(x => proyectosId.Contains(x.ProyectoId)).AsNoTracking().ToListAsync();
                    foreach (var item in result)
                    {
                        item.Proyecto= Proyectos.Find(x => x.ProyectoId == item.ProyectoId);
                        item.UnidadOrganizacional= Unidades.Find(x => x.ClaveUnidad == item.ClaveUnidad);
                        var nombres = _ctx.AutoresEstudioMercado
                            .Where(x => x.EstudiosMercadoId == item.EstudiosMercadoId)
                            .OrderBy(x=>x.NombrePersona)
                           .AsNoTracking().ToList();
                        // 1.
                        string s1 = "";
                        for (int i = 0; i < nombres.Count(); i++)
                        {
                            if (i+1 != nombres.Count())
                            {
                                s1 = string.Concat(s1, nombres[i].NombrePersona + ", ");
                            }else
                            {
                                s1 = string.Concat(s1, nombres[i].NombrePersona + "");
                            }
                        }
                        //foreach (var autor in nombres)
                        //{
                        //    // 2.
                        //    s1 = string.Concat(autor.NombrePersona+ "\r\n", s1);
                        //}
                        item.Autores = s1;

                    }
                }
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Object>> GetConsultaParametrizadaEstudios(EstudiosMercado parametros)
        {
            try{
                var estudios = _ctx.EstudiosMercado.Select(e=>e);
                if (estudios != null)
                {
                    if (!String.IsNullOrEmpty(parametros.busquedaFecha))  //busqueda por fecha
                    {
                        estudios = estudios.Where(e => ( DbFunctions.TruncateTime(e.Fecha) >= DbFunctions.TruncateTime(parametros.fechaInicioComparacion )
                                                        && DbFunctions.TruncateTime(e.Fecha) <= DbFunctions.TruncateTime(parametros.fechaFinalComparacion)));
                    }
                    if (!String.IsNullOrEmpty(parametros.Tema)) //busqueda por nombre del estudio de mercado
                    {
                        var listaNombres = await GetEstudiosLikeNombreLatin1(parametros.Tema);
                        estudios = estudios.Where(e => listaNombres.Contains(e.EstudiosMercadoId));
                    }
                    if (!String.IsNullOrEmpty(parametros.Autores)) //Busqueda por autores
                    {
                        var listaClaves = await GetEstudiosByAutoresLikeNombreLatin1(parametros.Autores);
                        estudios = estudios.Where(e => listaClaves.Contains(e.EstudiosMercadoId));
                    }
                    if (!String.IsNullOrEmpty(parametros.proposito)) //Busqueda por proposito del estudio mercado
                    {
                        var listaPropositos = await GetPropositoEstudiosLikeNombreLatin1(parametros.proposito);
                        estudios = estudios.Where(e => listaPropositos.Contains(e.EstudiosMercadoId));
                    }
                    if (!String.IsNullOrEmpty(parametros.ProyectoId)) //Busqueda por proyecto
                    {
                        estudios = estudios.Where(e => e.ProyectoId== parametros.ProyectoId);
                    }
                    if (!String.IsNullOrEmpty(parametros.ClaveUnidad)) //Busqueda por ClaveUnidad
                    {
                        estudios = estudios.Where(e => e.ClaveUnidad == parametros.ClaveUnidad);
                    }

                    //******Se inicia el proceso de proyeccion******
                    //Los resultados lo guardaremos en una lista de X objeto
                    List<BusquedaParamsCR> datos = estudios.Select(x => new BusquedaParamsCR //Es una clase no mapeada que contiene caracteristicas
                                                                                           //que nos permiten albergar SOLO los datos necesarios
                    {
                        EstudiosMercadoId = x.EstudiosMercadoId, //Rescatamos los parametros que se requieren para el front
                        Tema = x.Tema,
                        Fecha = x.Fecha,
                        Proposito=x.proposito,
                        ProyectoId=x.ProyectoId,
                        ClaveUnidad=x.ClaveUnidad
                    }).ToList();


                    //Recuperamos las claves de unidad
                    GEN_Context _gen = new GEN_Context();

                    var unidadesId = await (_ctx.EstudiosMercado
                        .Where(e => e.ClaveUnidad != "")
                        .Select(e => e.ClaveUnidad))
                        .AsNoTracking().ToListAsync();

                    var unidades = await _gen.dbSetUnidadOrganizacional.AsNoTracking()
                        .Where(x => unidadesId.Contains(x.ClaveUnidad) //)
                                        && x.FechaEfectiva == _gen.dbSetUnidadOrganizacional
                                                                        .Where(f => f.FechaEfectiva <= DateTime.Now
                                                                        && f.ClaveUnidad == x.ClaveUnidad)
                                                                        .Max(f => f.FechaEfectiva)
                                          ).Select(x=> new
                                          {
                                              ClaveUnidad=x.ClaveUnidad,
                                              NombreUnidad=x.NombreUnidad
                                          })
                        .ToListAsync();

                    foreach (var c in datos)
                    {
                       var listaAutores = await _ctx.AutoresEstudioMercado.Where(e => e.EstudiosMercadoId == c.EstudiosMercadoId).Select(e => new { clavePersona = e.ClavePersona, e.NombrePersona }).ToListAsync();

                        List<Contacto> contacts = new List<Contacto>();
                        foreach ( var dato in listaAutores) {
                            Contacto contact = new Contacto();
                            contact.NombreContacto = dato.NombrePersona;
                            contact.ClaveUnidad = dato.clavePersona;
                            contacts.Add(contact);
                        }

                        c.listaDeInfo = contacts;

                        if (c.ClaveUnidad != null)
                        {
                            c.NombreUnidad = unidades.Where(e => e.ClaveUnidad == c.ClaveUnidad).Select(e => e.NombreUnidad).FirstOrDefault();
                        }
                        if (c.ProyectoId != null)
                        {
                            c.NombreProyecto= await (from proyecto in _gen.dbSetProyectoGEN
                                                     where proyecto.ProyectoId == c.ProyectoId
                                                     select proyecto.Nombre)
                                                   .FirstOrDefaultAsync();
                        }

                    }

                    return datos;
                }
                return null;
            }catch(Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtener todas las claves de los estudios de mercado
        /// </summary>
        /// <returns></returns>
        public async Task<List<int>> GetEstudiosLikeNombreLatin1(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT EstudiosMercadoId FROM CR.tab_EstudiosMercado where Tema collate  Latin1_General_CI_AI LIKE ";
                foreach (var palabra in palabras)
                {
                    query = query + "'%" + palabra + "%' and Tema collate Latin1_General_CI_AI LIKE";
                }
                var resultados = await _ctx.Database.SqlQuery<int>(query + "'%%'").ToListAsync();
                return resultados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtener todas las claves de los estudios de mercado con relacion al autor(es) buscado
        /// </summary>
        /// <returns></returns>
        public async Task<List<int>> GetEstudiosByAutoresLikeNombreLatin1(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT EstudiosMercadoId FROM CR.tab_AutoresEstudioMercado where NombrePersona collate Latin1_General_CI_AI LIKE ";
                //foreach (var palabra in palabras)
                //{
                    query = query + "'%" + likeNombre + "%' ";
                //}
                var resultados = await _ctx.Database.SqlQuery<int>(query ).ToListAsync();
                return resultados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtener todas las claves de los estudios de mercado relacionados al proposito buscado
        /// </summary>
        /// <returns></returns>
        public async Task<List<int>> GetPropositoEstudiosLikeNombreLatin1(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT EstudiosMercadoId FROM CR.tab_EstudiosMercado where proposito collate  Latin1_General_CI_AI LIKE ";
                foreach (var palabra in palabras)
                {
                    query = query + "'%" + palabra + "%' and proposito collate Latin1_General_CI_AI LIKE";
                }
                var resultados = await _ctx.Database.SqlQuery<int>(query + "'%%'").ToListAsync();
                return resultados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<int> Create(EstudiosMercado Obj)
        {
            try
            {
                _ctx.EstudiosMercado.Add(Obj);
                await _ctx.SaveChangesAsync();
                if (Obj.listaAdjuntos != null)
                {
                    AdjuntoRepository adjuntorepo = new AdjuntoRepository();
                    foreach (var archivo in Obj.listaAdjuntos)
                    {
                        await adjuntorepo.Create(archivo);
                        AdjuntosEstudiosMercado nuevoAdjunto = new AdjuntosEstudiosMercado();
                        nuevoAdjunto.AdjuntoId = archivo.AdjuntoId;
                        nuevoAdjunto.EstudiosMercadoId = Obj.EstudiosMercadoId;
                        _ctx.AdjuntosEstudiosMercado.Add(nuevoAdjunto);
                        await _ctx.SaveChangesAsync();
                    }
                }
                return Obj.EstudiosMercadoId;
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
                var result = await _ctx.EstudiosMercado.FirstOrDefaultAsync(e => e.EstudiosMercadoId == id);
                if (result != null)
                {
                    var listaAdjuntos = await _ctx.AdjuntosEstudiosMercado.Where(x => x.EstudiosMercadoId == id).ToListAsync();
                    if (listaAdjuntos != null)
                    {
                        var idsadjuntos = listaAdjuntos.Select(x => x.AdjuntoId).ToList();
                        _ctx.AdjuntosEstudiosMercado.RemoveRange(listaAdjuntos);
                        await _ctx.SaveChangesAsync();

                        await new AdjuntoRepository().DeleteByCollectionIds(idsadjuntos);
                    }

                    var autores = await _ctx.AutoresEstudioMercado.Where(x=>x.EstudiosMercadoId==id).ToListAsync();
                    if (autores.Count() > 0 )
                    {
                        _ctx.AutoresEstudioMercado.RemoveRange(autores);
                    }

                    _ctx.EstudiosMercado.Remove(result);
                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<EstudiosMercado> GetById(int id)
        {
            try
            {
                var result = await _ctx.EstudiosMercado.Where(e => e.EstudiosMercadoId == id)
                    .Include(x=>x.Adjunto)
                    .AsNoTracking().FirstOrDefaultAsync();

                result.UnidadOrganizacional = await _ctxGen.dbSetUnidadOrganizacional
                    .Where(x => x.ClaveUnidad == result.ClaveUnidad)
                    .OrderByDescending(x => x.FechaEfectiva)
                    .AsNoTracking().FirstOrDefaultAsync();

                result.Proyecto = await _ctxGen.dbSetProyectoGEN.Where(x => x.ProyectoId == result.ProyectoId)
                    .AsNoTracking().FirstOrDefaultAsync();

                var fksadjuntos = await _ctx.AdjuntosEstudiosMercado.Where(e => e.EstudiosMercadoId == id).AsNoTracking().Select(x=>x.AdjuntoId).ToListAsync();
                if(fksadjuntos.Count>0){
                    result.listaAdjuntos= await _ctxGen.dbSetAdjuntos.Where(e=> fksadjuntos.Contains(e.AdjuntoId)).AsNoTracking().ToListAsync();
                }
                // foreach(var c in result.adjuntosEstudioMercado)
                // {
                //     var nom= await _ctxGen.dbSetAdjuntos.Where(e => e.AdjuntoId == c.AdjuntoId).Select(e => e.nombre).AsNoTracking().FirstAsync();
                //     c.nombre = Convert.ToString(nom);
                // }

                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(EstudiosMercado Obj)// UpdateSolicitud
        {
            try
            {
                var result = await _ctx.EstudiosMercado.FirstOrDefaultAsync(e => e.EstudiosMercadoId == Obj.EstudiosMercadoId);
                if (result != null)
                {
                    _ctx.Entry(result).CurrentValues.SetValues(Obj);
                    await _ctx.SaveChangesAsync();
                    var listaArchivosViejos = await _ctx.AdjuntosEstudiosMercado.Where(e => e.EstudiosMercadoId == Obj.EstudiosMercadoId).ToListAsync();
                    if (listaArchivosViejos.Count() > 0)
                    {
                        var adjuntos = listaArchivosViejos.Select(x => x.AdjuntoId).ToList();

                        _ctx.AdjuntosEstudiosMercado.RemoveRange(listaArchivosViejos);
                        await _ctx.SaveChangesAsync();


                        foreach (var c in adjuntos)
                        {
                            await new AdjuntoRepository().Delete(c);
                        }

                    }


                    AdjuntoRepository adjuntorepo = new AdjuntoRepository();
                    if (Obj.listaAdjuntos != null)
                    {
                        foreach (var c in Obj.listaAdjuntos)
                        {
                            await adjuntorepo.Create(c);
                            AdjuntosEstudiosMercado nuevoAdjunto = new AdjuntosEstudiosMercado();
                            nuevoAdjunto.EstudiosMercadoId = Obj.EstudiosMercadoId;
                            nuevoAdjunto.AdjuntoId = c.AdjuntoId;

                            _ctx.AdjuntosEstudiosMercado.Add(nuevoAdjunto);
                            await _ctx.SaveChangesAsync();
                        }
                    }

                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<int> AccesoArchivo(AccesoArchivo id)
        {
            try
            {
                var result = await _ctxGen.dbSetSolicitudAcceso
                    .Where(e => e.ClavePersonaSolicitante == id.clavePersonaSolicitante
                    && e.TipoInformacionId==id.tipoInformacionId
                    && e.InformacionOCId== id.informacionOCId
                    && e.ModuloId== id.moduloId
                    && e.idAdicional== id.tipoArchivo)
                    .OrderByDescending(x=>x.FechaSolicitud)
                    .AsNoTracking().FirstOrDefaultAsync();

                if (result==null || result.EstadoFlujoId==9)
                {
                    return 0;
                }else
                {
                    if(result.EstadoFlujoId==8)
                    {
                        return 2;
                    }
                    if (result.EstadoFlujoId == 10)
                    {
                        return 1;
                    }
                }
                return 0;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<Object> GetEstudiosVigentesHOT()
        {
            try
            {
                DateTime hoy = DateTime.Now;

                List<string> etiquetas    = new List<string>();
                List<object> resultados   = new List<object>();
                List<object> datos        = new List<object>();
                List<object> leyendas     = new List<object>();

                List<UnidadOrganizacional> Unidades = await _ctxGen.dbSetUnidadOrganizacional.OrderByDescending(x => x.FechaEfectiva).AsNoTracking().ToListAsync();

                var unidadesOrg = await (from e in _ctx.EstudiosMercado
                                         orderby e.ClaveUnidad
                                         group e by new { e.ClaveUnidad } into valores
                                         select new
                                         {
                                             Clave = valores.Key.ClaveUnidad,
                                         }
                                        ).AsNoTracking().ToListAsync();

                    resultados = new List<object>();
                    foreach (var item in unidadesOrg)
                    {
                        var cuenta = (from fe in _ctx.EstudiosMercado where fe.ClaveUnidad == item.Clave select fe.ClaveUnidad).Count();

                        UnidadOrganizacional un = Unidades.FirstOrDefault(x => x.ClaveUnidad == item.Clave.ToString());
                        etiquetas.Add(un.NombreUnidad.ToString());

                        datos.Add(cuenta);
                    }

                    var barra = new { name = "No. estudios", type = "bar", data = datos };
                    var resultado = new {numConvenios =barra,  etiqetas = etiquetas};

                    return resultado;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



    }
}
