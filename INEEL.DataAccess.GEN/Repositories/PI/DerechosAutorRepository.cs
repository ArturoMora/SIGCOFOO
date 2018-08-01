using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories.CH;
using INEEL.DataAccess.GEN.Util;
using INEEL.DataAccess.PI.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.PI
{
    public class DerechosAutorRepository : IDisposable
    {
        public void Dispose()
        {
            _pictx.Dispose();
        }

        PI_Context _pictx;

        public DerechosAutorRepository()
        {
            _pictx = new PI_Context();
        }

        //Obtener todos los derechos de autor
        public async Task<IEnumerable<DerechosAutor>> GetAll()
        {
            try
            {
                var derechosautor = await _pictx.DerechosAutor
                    .AsNoTracking()
                    .ToListAsync();
                return derechosautor;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<DerechosAutor>> GetForCV(string id)
        {
            try
            {
                var result = await _pictx.AutoresDA.Where(e => e.ClavePersona.Equals(id))
                                        .AsNoTracking()
                                        .ToListAsync();
                List<int> lista = result.Select(x => x.DerechosAutorId).ToList();

                var result2 = await _pictx.DerechosAutor.Where(e => lista.Contains(e.DerechosAutorId))
                    .Where(e => e.EstadoFlujoId == 3)
                    .Include(e => e.Rama)
                    .AsNoTracking().ToListAsync();

                return result2;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<Object> GetDerechosAutorForDetailsBusqueda(busquedaAv parametro)
        {
            try
            {
                List<int> listaIds = new List<int>();
                var listaPreliminar = parametro.FieldD.Split(',').ToList();
                listaPreliminar.Remove("");
                listaIds = listaPreliminar.Select(int.Parse).ToList();

                var resultados = await _pictx.DerechosAutor.Where(e => listaIds.Contains(e.DerechosAutorId)).AsNoTracking()
                .Select(x => new {
                    id = x.DerechosAutorId,
                    Nombre = x.Titulo,
                }).ToListAsync();

                return resultados;
            }catch(Exception e)
            {
                throw new Exception(e.Message, e);
            }
            
        }
        public async Task<Int32> GetAllPropiedadInstitutoCount()
        {
            try
            {
                var derechosautor = await (from da in _pictx.DerechosAutor
                                           where da.EspropiedadInstituto == true
                                           select da)
                                           .AsNoTracking()
                                           .CountAsync();

                return derechosautor;
            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }
        /// <summary>
        /// Obtener todos los derechos de autor (del instituto) para modal
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<Object>> GetAllPropiedadInstitutoModal()
        {
            try
            {
                var derechosautor = await (from da in _pictx.DerechosAutor
                                           where da.EspropiedadInstituto == true
                                           select da)
                                           .Include(e => e.Rama)
                                           .AsNoTracking()
                                           .ToListAsync();

                return derechosautor;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        //Obtener todos los derechos de autor
        public async Task<IEnumerable<Object>> GetAllPropiedadInstituto()
        {
            try
            {
                GEN_Context _gen = new GEN_Context();

                var unidadesId = await (_pictx.DerechosAutor
                    .Where(e => e.ClaveUnidad != "")
                    .Select(e => e.ClaveUnidad))
                    .AsNoTracking().ToListAsync();

                var unidades = await _gen.dbSetUnidadOrganizacional.AsNoTracking()
                    .Where(x => unidadesId.Contains(x.ClaveUnidad) //)
                                    && x.FechaEfectiva == _gen.dbSetUnidadOrganizacional
                                                                    .Where(f => f.FechaEfectiva <= DateTime.Now
                                                                    && f.ClaveUnidad == x.ClaveUnidad)
                                                                    .Max(f => f.FechaEfectiva)
                                      )
                    .ToListAsync();
                var derechosautor = await (from da in _pictx.DerechosAutor
                                           where da.EspropiedadInstituto == true
                                           orderby da.FechaExpedicion descending
                                           select da)
                                           .Include(e => e.Rama)
                                           .Include(e => e.Autores)
                                           .AsNoTracking()
                                           .ToListAsync();
                if (derechosautor != null)
                {

                    foreach (var autor in derechosautor)
                    {
                        if (autor != null && autor.ClaveUnidad != null)
                        {
                            autor.UnidadOrganizacional = (from unidad in unidades
                                                          where unidad.ClaveUnidad == autor.ClaveUnidad
                                                          select unidad).FirstOrDefault();
                        }
                    }

                }

                return derechosautor;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtener todos los derechos de autor (del instituto) para reporte
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<Object>> GetAllPropiedadInstitutoReporte(DerechosAutor parametros)
        {
            try
            {
                GEN_Context _gen = new GEN_Context();

                var unidadesId = await (_pictx.DerechosAutor  //esto se puede traer al final, es parte de la logica de pi
                    .Where(e => e.ClaveUnidad != "")
                    .Select(e => e.ClaveUnidad))
                    .AsNoTracking().ToListAsync();

                var unidades = await _gen.dbSetUnidadOrganizacional.AsNoTracking()//esto se puede traer al final, es parte de la logica de pi
                    .Where(x => unidadesId.Contains(x.ClaveUnidad)
                                    && x.FechaEfectiva == _gen.dbSetUnidadOrganizacional
                                                                    .Where(f => f.FechaEfectiva <= DateTime.Now
                                                                    && f.ClaveUnidad == x.ClaveUnidad)
                                                                    .Max(f => f.FechaEfectiva)
                                      )
                    .ToListAsync();

                //Desde aqui empieza el proceso de busquedas en PI
                var derechosautor = (from da in _pictx.DerechosAutor.AsNoTracking() //Se inicia con una busqueda normal, al final del metodo se convierte en objeto caliente (El nombre correcto es "Objeto anonimo")
                                           .Include(e => e.Rama) //hacemos include de lo que necesitemos
                                           .Include(e => e.Autores)
                                           .Where(e => e.EspropiedadInstituto == true)
                                     select da);

                ///Si la coleccion esta vacia retornaremos null
                if (derechosautor != null)
                {

                    if (!String.IsNullOrEmpty(parametros.busquedaFecha))  //busqueda por fecha
                    {
                        derechosautor = derechosautor.Where(e => (DbFunctions.TruncateTime(e.FechaExpedicion) >= DbFunctions.TruncateTime(parametros.fechaInicioComparacion)
                                                                 && DbFunctions.TruncateTime(e.FechaExpedicion) <= DbFunctions.TruncateTime(parametros.fechaFinalComparacion))
                                                                 || e.FechaExpedicion == null);
                    }
                    if (!String.IsNullOrEmpty(parametros.Titulo)) //busqueda por titulo
                    {
                        var listaDA = await GetDALikeNombreLatin1(parametros.Titulo);
                        derechosautor = derechosautor.Where(e => listaDA.Contains(e.DerechosAutorId));
                    }

                    if (!String.IsNullOrEmpty(parametros.Sintesis)) //busqueda por titulo
                    {
                        var listaDA = await GetDALikeSintesisLatin1(parametros.Sintesis);
                        derechosautor = derechosautor.Where(e => listaDA.Contains(e.DerechosAutorId));
                    }

                    if (parametros.RamaId != 0)
                    {
                        derechosautor = derechosautor.Where(e => e.RamaId == parametros.RamaId);
                    } //busqueda por rama

                    if (!String.IsNullOrEmpty(parametros.nombrePersona))
                    {
                        var listaPersonas = await GetAutoresByDALikeNombreLatin1(parametros.nombrePersona);
                        List<int> ids = listaPersonas.Select(x => Convert.ToInt32(x)).ToList();
                        derechosautor = derechosautor.Where(e => listaPersonas.Contains(e.DerechosAutorId));
                    } //busqueda por autores

                    if (!String.IsNullOrEmpty(parametros.Certificado))
                    {
                        derechosautor = derechosautor.Where(e => e.Certificado.Contains(parametros.Certificado));
                    } //busqueda por certificado

                    if (!String.IsNullOrEmpty(parametros.ClaveUnidad))
                    {
                        derechosautor = derechosautor.Where(e => e.ClaveUnidad == parametros.ClaveUnidad);
                    } //busqueda por unidad organizacional


                    //******Se inicia el proceso de proyeccion******
                    //Los resultados lo guardaremos en una lista de X objeto
                    List<BusquedaParams> datos = derechosautor.Select(x => new BusquedaParams //Es una clase no mapeada que contiene caracteristicas 
                                                                                              //que nos permiten albergar SOLO los datos necesarios
                    {
                        DerechosAutorId = x.DerechosAutorId, //Rescatamos los parametros que se requieren para el front
                        ConsecutivoInterno = x.ConsecutivoInterno,
                        Titulo = x.Titulo,
                        ramita = x.Rama.Descripcion,
                        Certificado = x.Certificado,
                        Autores = x.Autores,
                        ClaveUnidad = x.ClaveUnidad,
                        NumeroProyecto = x.NumeroProyecto,
                        FechaExpedicion = x.FechaExpedicion,
                        FechaSolicitud = x.FechaSolicitud,

                    }).ToList();

                    foreach (var autor in datos) //Opcional, como estos valores pueden o no ir en la coleccion se hace el proceso aparte
                    {//Se hace en un foreach porque cada registro puede que tenga o no los siguientes valores

                        if (autor != null && autor.ClaveUnidad != null) //si hay una clave de unidad agregamos de la lista de unidades (previamente creada antes)
                        {
                            autor.UnidadOrganizacional = (from unidad in unidades
                                                          where unidad.ClaveUnidad == autor.ClaveUnidad
                                                          select unidad).FirstOrDefault();
                            if (autor.UnidadOrganizacional != null)  //Si es diferente de null recuperamos en este caso la division
                            {
                                autor.UnidadPadre = (from u in unidades
                                                     where u.ClaveUnidad == autor.UnidadOrganizacional.padre.ToString()
                                                     select u.NombreUnidad).FirstOrDefault();
                            }

                        }

                        if (autor != null && autor.NumeroProyecto != null) //Se necesitan proyectos, asi que evaluamos si el registro contiene la clave de proyecto o no
                        {
                            autor.Proyecto = await (from proyecto in _gen.dbSetProyectoGEN.AsNoTracking()  //si tenemos el numero de proyecto recuperamos el nombre
                                                    where proyecto.ProyectoId == autor.NumeroProyecto
                                                    select proyecto.Nombre)
                                                   .FirstOrDefaultAsync();
                        }
                    }
                    return datos.OrderByDescending(e => e.ConsecutivoInterno); //retornamos los datos, y al hacer esto ya no pasamos por el siguiente return (el de abajo)
                }

                return null; //por default, en caso de que no tengamos datos desde el inicio retornamos null

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtener todos las claves de autores (del instituto) para reporte
        /// </summary>
        /// <returns></returns>
        public async Task<List<int>> GetAutoresByDALikeNombreLatin1(String likeNombre)
        {
            try
            {

                var resultados = await _pictx.Database.SqlQuery<int>
                ("SELECT DerechosAutorId FROM PI.tab_AutoresDA where Nombre collate  Latin1_General_CI_AI LIKE '%" + likeNombre + "%'").ToListAsync();


                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }




        /// <summary>
        /// Obtener todos las claves de autores (del instituto) para reporte
        /// </summary>
        /// <returns></returns>
        public async Task<List<int>> GetDALikeNombreLatin1(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT DerechosAutorId FROM PI.tab_DerechosAutor where Titulo collate  Latin1_General_CI_AI LIKE ";
                foreach (var palabra in palabras)
                {
                    query = query + "'%" + palabra + "%' and Titulo collate Latin1_General_CI_AI LIKE";
                }
                var resultados = await _pictx.Database.SqlQuery<int>(query + "'%%'").ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        /// <summary>
        /// Obtener todos las claves de autores (del instituto) para reporte
        /// </summary>
        /// <returns></returns>
        public async Task<List<int>> GetDALikeSintesisLatin1(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT DerechosAutorId FROM PI.tab_DerechosAutor where sintesis collate  Latin1_General_CI_AI LIKE ";
                foreach (var palabra in palabras)
                {
                    query = query + "'%" + palabra + "%' and sintesis collate Latin1_General_CI_AI LIKE";
                }
                var resultados = await _pictx.Database.SqlQuery<int>(query + "'%%'").ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        /// <summary>
        /// Obtener todos los derechos de autor por proyecto
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<Object>> GetByProyecto(string id)
        {
            try
            {
                var derechos = await _pictx.DerechosAutor.Where(e => e.EspropiedadInstituto == true && e.NumeroProyecto == id)
                    .Include(e => e.Rama)
                    .Select(x => new
                    {
                        DerechosAutorId = x.DerechosAutorId,
                        Titulo = x.Titulo,
                        NombreRama = x.Rama.Descripcion,
                        FechaExpedicion = x.FechaExpedicion,
                        Sintesis = x.Sintesis,
                        Certificado = x.Certificado
                    }).AsNoTracking().ToListAsync();


                return derechos;
            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }

        //Obtener DA por id 
        public async Task<DerechosAutor> GetById(int derechoautorid)
        {
            try
            {

                var derechoautor = await (from da in _pictx.DerechosAutor
                                          where da.DerechosAutorId == derechoautorid
                                          select da).Include(e => e.Autores)
                                          .Include(e => e.Rama)
                                          .AsNoTracking()
                                          .FirstOrDefaultAsync();
                GEN_Context _gen = new GEN_Context();
                if (derechoautor != null && derechoautor.ClaveUnidad != null)
                {
                    derechoautor.UnidadOrganizacional = (from unidad in _gen.dbSetUnidadOrganizacional
                                                         where unidad.ClaveUnidad == derechoautor.ClaveUnidad
                                                         && unidad.FechaEfectiva == (from uni in _gen.dbSetUnidadOrganizacional
                                                                                     where uni.ClaveUnidad == unidad.ClaveUnidad
                                                                                     select uni)
                                                                                     .Max(e => e.FechaEfectiva)
                                                         select unidad
                                                               ).FirstOrDefault();
                }

                if (derechoautor != null && derechoautor.NumeroProyecto != null)
                {
                    derechoautor.Proyecto = await (from proyecto in _gen.dbSetProyectoGEN
                                                   where proyecto.ProyectoId == derechoautor.NumeroProyecto
                                                   select proyecto)
                                           .FirstOrDefaultAsync();
                }
                return derechoautor;
            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }


        //Obtener DA por clave de persona 
        public async Task<Object> GetByClavePersona(string clavepersona)
        {
            try
            {
                var das = await (from da in _pictx.AutoresDA
                                 where da.ClavePersona.Equals(clavepersona)  
                                 select new
                                 {
                                     DerechoAutorId = da.DerechosAutorId,
                                     Titulo = da.DerechoAutor.Titulo,
                                     Rama = da.DerechoAutor.Rama,
                                     EstadoFlujo = da.DerechoAutor.EstadoFlujo,
                                     FechaValidacion = da.DerechoAutor.FechaValidacion,
                                     SeEdita = !da.DerechoAutor.EspropiedadInstituto,
                                     ClavePersona=da.DerechoAutor.ClavePersona
                                 })
                                  .AsNoTracking()
                                  .ToListAsync();

                foreach (var item in das)
                {
                    if (item.EstadoFlujo.EstadoFlujoId == 2)
                    {
                        item.EstadoFlujo.Descripcion += " Admin CH";
                    }
                }

                return das;
            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }

        public async Task<Object> GetByClaveAutorWithCoAutores(string clave)
        {
            try
            {
                //Primero obtenemos la lista de capitulos registrados por el usuario buscado
                List<DerechosAutor> lista= new List<DerechosAutor>();
                var registros= await _pictx.DerechosAutor.Where(e=> e.ClavePersona==clave)
                                        .Include(e => e.EstadoFlujo)
                                        .Include(e=> e.Rama)
                                        .AsNoTracking().ToListAsync();
                lista.AddRange(registros);

                //Despues obtenemos la lista de capitulos registrados por el usuario como CO-AUTOR
                var primaryKeys= registros.Select(x=> x.DerechosAutorId);
                var listaCoAutores= await _pictx.AutoresDA.AsNoTracking().Where(e=> e.ClavePersona==clave && !primaryKeys.Contains(e.DerechosAutorId)).Select(x=> x.DerechosAutorId).ToListAsync();
                var registrosCoautores= await _pictx.DerechosAutor.Where(e=> listaCoAutores.Contains(e.DerechosAutorId) && (e.EstadoFlujoId==3  || e.EstadoFlujoId==2) )
                                            .Include(e => e.EstadoFlujo)
                                            .Include(e=> e.Rama)
                                            .AsNoTracking().ToListAsync();
                lista.AddRange(registrosCoautores);

                foreach (var item in lista)
                {
                    if (item.EstadoFlujo.EstadoFlujoId == 2)
                    {
                        item.EstadoFlujo.Descripcion += " Admin CH";
                    }
                }

                return lista;
            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }




        public async Task<Object> GetPorClavePersona(string clavepersona)
        {
            try
            {
                var das = await (from da in _pictx.AutoresDA
                                 where da.ClavePersona.Equals(clavepersona)
                                 select new
                                 {
                                     DerechoAutorId = da.DerechosAutorId,
                                     Titulo = da.DerechoAutor.Titulo,
                                     Rama = da.DerechoAutor.Rama,
                                     EstadoFlujo = da.DerechoAutor.EstadoFlujo,
                                     FechaValidacion = da.DerechoAutor.FechaValidacion,
                                     SeEdita = da.DerechoAutor.EspropiedadInstituto,
                                     certificado = da.DerechoAutor.Certificado,
                                     fechaExpedicion = da.DerechoAutor.FechaExpedicion,
                                     esInstituto = da.DerechoAutor.EspropiedadInstituto
                                 })
                                  .AsNoTracking()
                                  .ToListAsync();

                return das;
            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }



        public async Task<DerechosAutor> Update(DerechosAutor derechoautor)
        {
            try
            {
                var _derechoautor = await _pictx.DerechosAutor.FirstOrDefaultAsync(e => e.DerechosAutorId == derechoautor.DerechosAutorId);
                if (_derechoautor.AdjuntoId != null && _derechoautor != null && (!String.IsNullOrEmpty(derechoautor.accion) && derechoautor.accion == "elimina" ))
                {
                    var id = _derechoautor.AdjuntoId; //Se procede a eliminar el adjunto anterior en estos pasos
                    _derechoautor.AdjuntoId = null;
                    await _pictx.SaveChangesAsync();
                    await new AdjuntoRepository().Delete(id);
                }
                if (derechoautor.Adjunto != null)
                {
                    if (derechoautor.Adjunto.AdjuntoId == 0)
                    {
                        Adjunto key = await new AdjuntoRepository().CreateAd(derechoautor.Adjunto);
                        derechoautor.AdjuntoId = key.AdjuntoId;
                        derechoautor.Adjunto.AdjuntoId = key.AdjuntoId;
                    }
                }
                var autores = await _pictx.AutoresDA.Where(e => e.DerechosAutorId == derechoautor.DerechosAutorId).ToListAsync();
                if (autores.Count > 0)
                {
                    _pictx.AutoresDA.RemoveRange(autores);
                    await _pictx.SaveChangesAsync();
                }
                if (derechoautor.Autores.Count > 0)
                {
                    foreach (var autor in derechoautor.Autores)
                    {
                        autor.DerechosAutorId = derechoautor.DerechosAutorId;
                    }
                    _pictx.AutoresDA.AddRange(derechoautor.Autores);
                    await _pictx.SaveChangesAsync();
                }

                
                if (_derechoautor != null)
                {
                    _pictx.Entry(_derechoautor).State = EntityState.Modified;
                    _pictx.Entry(_derechoautor).CurrentValues.SetValues(derechoautor);

                    await _pictx.SaveChangesAsync();
                }

                if (_derechoautor.EstadoFlujoId == 2)
                {
                    var nuevasolicitud = await this.GeneraSolicitud(_derechoautor);

                    if (nuevasolicitud != null && nuevasolicitud.SolicitudId > 0)
                    {
                        //crear registro bitacora 
                        var bitacora = RegistraBitacora(nuevasolicitud.SolicitudId, nuevasolicitud.ClavePersona);
                    }
                    if(!String.IsNullOrEmpty(derechoautor.listacoautores)){
                        _derechoautor.listacoautores=derechoautor.listacoautores;
                    }

                    await EnviarNotificacion(nuevasolicitud.ClavePersona, _derechoautor);

                }
                if (_derechoautor.EstadoFlujoId == 3)
                {
                    await new NuevoOCRepository().Create(
                           new NuevoOC("CH",
                                      "DA",
                           _derechoautor.Titulo,
                           "IndexCH.html#/detallesdaexterno/" + _derechoautor.DerechosAutorId + "/",
                           _derechoautor.DerechosAutorId + ""
                           ));
                }

                PersonasRepository prep = new PersonasRepository();
                if (derechoautor.ClavePersona != null)
                {
                    Personas p = await prep.GetByClave(derechoautor.ClavePersona);
                    p.ultimaActualizacion = DateTime.Now;
                    await prep.Update(p);
                }
                
                return derechoautor;
            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }

        private async Task<Solicitud> GeneraSolicitud(DerechosAutor da)
        {

            try
            {
                DateTime hoy = DateTime.Now;
                Solicitud solicitud = new Solicitud()
                {
                    ClavePersona = da.ClavePersona,
                    TipoInformacionId = 15,
                    InformacionId = da.DerechosAutorId.ToString(),
                    FechaSolicitud = hoy,
                    EstadoFlujoId = da.EstadoFlujoId
                };
                SolicitudRepository sol = new SolicitudRepository();
                var existe = await sol.existe(solicitud.TipoInformacionId, solicitud.InformacionId);
                if (existe == null)
                {
                    solicitud = await sol.Create(solicitud);
                }
                else
                {
                    existe.EstadoFlujoId = 2;
                    solicitud = await sol.UpdateEstadoActualizacion(existe);
                }

                return solicitud;
            }
            catch (Exception e)
            {

                throw new Exception(e.Message);
            }
        }

        private async Task RegistraBitacora(int solicitudId, string clavepersona)
        {
            try
            {
                DateTime hoy = DateTime.Now;
                BitacoraSolicitudes bitacora = new BitacoraSolicitudes()
                {
                    SolicitudId = solicitudId,
                    FechaMovimiento = hoy,
                    ClavePersona = clavepersona,
                    Descripcion = "Se envió la solicitud",
                    EstadoFlujoId = 1
                };
                using (BitacoraSolicitudesRepository _bitacora = new BitacoraSolicitudesRepository())
                {
                    var regbitacora = await _bitacora.Create(bitacora);
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        private async Task EnviarNotificacion(string clavepersona)
        {
            try
            {
                DateTime hoy = DateTime.Now;
                Correo correo = new Correo()
                {
                    Modulo = "Capital Humano",
                    ClavePersona = clavepersona,
                    TipoCorreo = "1",
                    Seccion = "Derechos de Autor"
                };
                getCorreoConfig conf = new getCorreoConfig();
                SendCorreo send = new SendCorreo();
                var result = await send.Send(correo, conf);
                if (!result)
                {
                    throw new Exception("No se pudo enviar el correo!");
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        private async Task EnviarNotificacion(string clavepersona, DerechosAutor derechosautor)
        {
            try
            {
                DateTime hoy = DateTime.Now;
                Correo correo = new Correo()
                {
                    Modulo = "Capital Humano",
                    ClavePersona = clavepersona,
                    TipoCorreo = "1",
                    Seccion = "Derechos de Autor",
                    coautores=derechosautor.listacoautores
                };
                getCorreoConfig conf = new getCorreoConfig();
                SendCorreo send = new SendCorreo();
                var result = await send.Coautores(correo, conf);
                if (!result)
                {
                    throw new Exception("No se pudo enviar el correo!");
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(DerechosAutor derechosautor)
        {
            try
            {
                derechosautor.EspropiedadInstituto = true;
                derechosautor.EstadoFlujoId = 3;
                _pictx.DerechosAutor.Add(derechosautor);
                await _pictx.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task CreateCH(DerechosAutor derechosautor)
        {
            try
            {
                derechosautor.EspropiedadInstituto = false;
                derechosautor.EstadoFlujoId = 1;
                _pictx.DerechosAutor.Add(derechosautor);
                await _pictx.SaveChangesAsync();
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
                var _model = await _pictx.DerechosAutor.FirstOrDefaultAsync(e => e.DerechosAutorId == id);
                if (_model != null)
                {
                    _pictx.DerechosAutor.Remove(_model);
                    await _pictx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public object GetDerechosAutorPorAnio()
        {
            try
            {

                var derechosPorAnio = _pictx.DerechosAutor.GroupBy(e => e.FechaExpedicion.Year).Select(y => new
                {
                    NumeroDA = y.Count().ToString(),
                    Anio = y.Key.ToString()
                }).ToList();
                return derechosPorAnio.OrderBy(e => e.Anio);

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }

        }



    }
}
