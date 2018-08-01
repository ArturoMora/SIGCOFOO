using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Threading.Tasks;
using System.Linq;
using System.Web.ModelBinding;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CP;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories.CR;
using INEEL.DataAccess.GEN.Util;

namespace INEEL.DataAccess.GEN.Repositories.CP
{
    public class ComunidadesRepository : IDisposable
    {
        AdjuntoRepository _adjuntoRepo;
        private CP_Context _db;
        CR_Context _cr;
        GEN_Context _genContext;

        public ComunidadesRepository()
        {
            _db = new CP_Context();
            _adjuntoRepo = new AdjuntoRepository();
            _cr = new CR_Context();
            _genContext= new GEN_Context();
            _db.Database.Log = Escribe.Write;
        }

        
       public async Task<IEnumerable<Object>> GetAllForModal()
        {
            try
            {
                var entities = await _db.DbSetComunidades
                    .Include(e => e.CategoriaCP)
                    .AsNoTracking()
                    .Select(x=> new {
                        ComunidadId= x.ComunidadId,
                        Descripcion=x.Descripcion,
                        Categoria = x.CategoriaCP.Nombre
                    })
                    .ToListAsync();
                return entities;


            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<int> GetTotalComunidadesActivas()
        {
            try
            {
                var total = await _db.DbSetComunidades.Where(e => e.Estado == true).CountAsync();
                return total;
            }catch(Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<int> GetTotalComunidades()
        {
            try
            {
                var total = await _db.DbSetComunidades.CountAsync();
                return total;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Object> GetTotalMisComunidades(string clave)
        {
            try
            {

                List<int> listComunidad = await _db.DbSetMiembros.Where(e => e.idPersonas == clave).Select(e => e.idCP).ToListAsync();
                var entities = await _db.DbSetComunidades.Where(e => listComunidad.Contains(e.ComunidadId) && e.Estado == true).CountAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Object> GetAll()
        {

            try
            {
                ExpertosRepository _expertoRepo = new ExpertosRepository();
                List<object> informacion = new List<object>();

                var entities = await _db.DbSetComunidades
                    .Include(e => e.CategoriaCP)
                    .Include(e => e.Adjunto)
                    .AsNoTracking().ToListAsync();


                foreach (var item in entities)
                {
                    Comunidad com = new Comunidad();

                    if (item.Adjunto == null) { com.Adjunto64 = null; }
                    else
                    {
                        String file = string.Empty;
                        var archivo = item.Adjunto.RutaCompleta;
                        try
                        {
                            Byte[] bytes = File.ReadAllBytes(archivo);
                            file = Convert.ToBase64String(bytes);
                            com.Adjunto64 = file;
                        }
                        catch (Exception e)
                        {
                            com.Adjunto64 = null;
                        }
                    }


                    com.Descripcion = item.Descripcion;
                    com.Mision = item.Mision;
                    com.Estado = item.Estado;
                    com.ComunidadId = item.ComunidadId;
                    com.TipoAcceso = item.TipoAcceso;
                    com.FechaRegistro = item.FechaRegistro;

                    int numMiembros = _db.DbSetMiembros.Count(x => x.idCP == item.ComunidadId && x.estado == true);
                    int expertos = _cr.Expertos.Count(x => x.ComunidadId == item.ComunidadId);
                    int numDocs = _db.DbSetDocumentos.Count(x => x.idComunidadCP == item.ComunidadId);
                    int numSitios = _db.DbSetSitioInteres.Count(x => x.idCP == item.ComunidadId);
                    var resultado = new { comunidad = com, noMiembros = numMiembros, noExpertos = expertos, noDocumentos = numDocs, noSitios = numSitios };

                    informacion.Add(resultado);

                }
                return informacion;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<int> CountComunidadesActivas()
        {
            try
            {
                var entities = await _db.DbSetComunidades
                    .Where(e => e.Estado == true)
                    .Include(e => e.Adjunto)
                    .AsNoTracking().CountAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<Object> GetComunidadesActivas()
        {
            try
            {
                ExpertosRepository _expertoRepo = new ExpertosRepository();
                List<object> informacion = new List<object>();
                
                var entities = await _db.DbSetComunidades
                    .Where(e=>e.Estado==true)
                    .Include(e => e.Adjunto)
                    .AsNoTracking().ToListAsync();
               

                foreach (var item in entities)
                {
                    Comunidad com = new Comunidad();

                    if (item.Adjunto == null) { com.Adjunto64 = null; }
                    else
                    {
                        String file = string.Empty;
                        var archivo = item.Adjunto.RutaCompleta;
                        try
                        {
                            Byte[] bytes = File.ReadAllBytes(archivo);
                            file = Convert.ToBase64String(bytes);
                            com.Adjunto64 = file;
                        }
                        catch (Exception e)
                        {
                            com.Adjunto64 = null;
                        }
                    }

                    com.Descripcion = item.Descripcion;
                    com.Mision = item.Mision;
                    com.Estado = item.Estado;
                    com.ComunidadId = item.ComunidadId;
                    com.TipoAcceso = item.TipoAcceso;
                    com.FechaRegistro = item.FechaRegistro;

                    int numMiembros = _db.DbSetMiembros.Count(x => x.idCP == item.ComunidadId && x.estado == true);
                    int expertos = _cr.Expertos.Count(x => x.ComunidadId == item.ComunidadId);
                    int numDocs = _db.DbSetDocumentos.Count(x => x.idComunidadCP == item.ComunidadId);
                    int numSitios = _db.DbSetSitioInteres.Count(x => x.idCP == item.ComunidadId);

                    var resultado = new { comunidad = com, noMiembros = numMiembros, noExpertos = expertos, noDocumentos = numDocs, noSitios = numSitios };

                    informacion.Add(resultado);

                }
                return informacion;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
       public async Task<Object> GetInformes()
        {

            ExpertosRepository _expertoRepo = new ExpertosRepository();

            List<object> informacion = new List<object>();
            List<object> listaMiembros;

            try
            {
                var entities = await _db.DbSetComunidades.Where(e => e.Estado == true).Include(e => e.CategoriaCP).AsNoTracking().ToListAsync();

                var resultado = new Object();

                string soloNombres = "";

                foreach (var item in entities)
                {

                    listaMiembros = new List<object>();

                    //var expertos = await _expertoRepo.expertosEnComunidad(item.ComunidadId);
                    int expertos = _cr.Expertos.Count(x => x.ComunidadId == item.ComunidadId);
                    int numDocs = _db.DbSetDocumentos.Count(x => x.idComunidadCP == item.ComunidadId);
                    int numSitios = _db.DbSetSitioInteres.Count(x => x.idCP == item.ComunidadId);
                    int preguntas = _db.DbSetPreguntas.Count(x => x.idCP == item.ComunidadId);
                    int posts = _db.DbSetPost.Count(x => x.idComunidad == item.ComunidadId);

                    var miembros = await _db.DbSetMiembros.Where(m => m.idCP == item.ComunidadId && m.estado == true).AsNoTracking().ToListAsync();

                    var lider = miembros.Where(t => t.rolId == 3).DefaultIfEmpty();
                    var secretario = miembros.Where(t => t.rolId == 4).DefaultIfEmpty();
                    var solomiembros = miembros.Where(t => t.rolId == 2 && t.estado == true).ToList();

                    foreach (var m in solomiembros) {
                        listaMiembros.Add(m.nombrePersona);
                        soloNombres = soloNombres + m.nombrePersona + ",";
                    }




                    var resultados = await _db.DbSetAvance.Include("Resultado.Metas").Include(e => e.AvanceMiembros).Where(e => e.Resultado.Metas.idCP == item.ComunidadId).AsNoTracking().ToListAsync();
                    AvanceMiembrosRepository avance = new AvanceMiembrosRepository();
                    Object[] lista = new Object[resultados.Count];

                    int contadorCompromisos = 0;
                    int contadorTerminados = 0;

                    foreach (var obj in resultados)
                    {
                        lista[resultados.IndexOf(obj)] = new
                        {
                            obj.Descripcion,
                            resultado = new { obj.Resultado.ResultadoEsperado, obj.Resultado.FechaEsperada },
                            obj.Comentario,                        
                            obj.Resultado.Metas.Meta
                        };


                        if (obj.Descripcion == "100") {
                            contadorTerminados = contadorTerminados + 1;
                        }

                        contadorCompromisos++;
                    }


                    resultado = new { comunidad = item.Descripcion, mision = item.Mision, fecha = item.FechaRegistro, categoria = item.CategoriaCP.Nombre,
                        noMiembros = miembros.Count, noExpertos = expertos, noDocumentos = numDocs, noSitios = numSitios, noPreguntas = preguntas, noPosts = posts,
                        lider = lider, secretario = secretario, soloMiembros = listaMiembros, soloNombres = soloNombres, idCategoria = item.idCategoria, avance = lista,
                        noCompromisos = contadorCompromisos, comTerminados = contadorTerminados
                    };

                    informacion.Add(resultado);

                    listaMiembros = null;
                    soloNombres = "";

                }


                return informacion;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<Object> GetInformes2()
        {

            ExpertosRepository _expertoRepo = new ExpertosRepository();

            List<object> informacion = new List<object>();
            List<object> listaMiembros;

            try
            {
                var entities = await _db.DbSetComunidades.Where(e => e.Estado == true).Include(e => e.CategoriaCP).AsNoTracking().ToListAsync();

                var resultado = new Object();

                string soloNombres = "";

                foreach (var item in entities)
                {

                    listaMiembros = new List<object>();

                    //var expertos = await _expertoRepo.expertosEnComunidad(item.ComunidadId);
                    int expertos = _cr.Expertos.Count(x => x.ComunidadId == item.ComunidadId);
                    int numDocs = _db.DbSetDocumentos.Count(x => x.idComunidadCP == item.ComunidadId);
                    int numSitios = _db.DbSetSitioInteres.Count(x => x.idCP == item.ComunidadId);
                    int preguntas = _db.DbSetPreguntas.Count(x => x.idCP == item.ComunidadId);
                    int posts = _db.DbSetPost.Count(x => x.idComunidad == item.ComunidadId);

                    var miembros = await _db.DbSetMiembros.Where(m => m.idCP == item.ComunidadId && m.estado == true).AsNoTracking().ToListAsync();

                    var lider = miembros.Where(t => t.rolId == 3).DefaultIfEmpty();
                    var secretario = miembros.Where(t => t.rolId == 4).DefaultIfEmpty();
                    var solomiembros = miembros.Where(t => t.rolId == 2 && t.estado == true).ToList();

                    foreach (var m in solomiembros)
                    {
                        listaMiembros.Add(m.idPersonas+" "+m.nombrePersona);
                        soloNombres = soloNombres + m.nombrePersona + ",";
                    }




                    var resultados = await _db.DbSetAvance.Include("Resultado.Metas").Include(e => e.AvanceMiembros).Where(e => e.Resultado.Metas.idCP == item.ComunidadId).AsNoTracking().ToListAsync();
                    AvanceMiembrosRepository avance = new AvanceMiembrosRepository();
                    Object[] lista = new Object[resultados.Count];

                    int contadorCompromisos = 0;
                    int contadorTerminados = 0;

                    foreach (var obj in resultados)
                    {
                        lista[resultados.IndexOf(obj)] = new
                        {
                            obj.Descripcion,
                            resultado = new { obj.Resultado.ResultadoEsperado, obj.Resultado.FechaEsperada },
                            obj.Comentario,
                            obj.Resultado.Metas.Meta
                        };


                        if (obj.Descripcion == "100")
                        {
                            contadorTerminados = contadorTerminados + 1;
                        }

                        contadorCompromisos++;
                    }


                    resultado = new
                    {
                        comunidad = item.Descripcion,
                        mision = item.Mision,
                        fecha = item.FechaRegistro,
                        categoria = item.CategoriaCP.Nombre,
                        noMiembros = miembros.Count,
                        noExpertos = expertos,
                        noDocumentos = numDocs,
                        noSitios = numSitios,
                        noPreguntas = preguntas,
                        noPosts = posts,
                        lider = lider,
                        secretario = secretario,
                        soloMiembros = listaMiembros,
                        soloNombres = soloNombres,
                        idCategoria = item.idCategoria,
                        avance = lista,
                        noCompromisos = contadorCompromisos,
                        comTerminados = contadorTerminados
                    };

                    informacion.Add(resultado);

                    listaMiembros = null;
                    soloNombres = "";

                }


                return informacion;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        /// <summary>
        /// Obtener todas las claves de las comunidades que coincidan con la colacion
        /// </summary>
        /// <returns></returns>

        public async Task<List<int>> GetPKComunidadesByCollateLatin1(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT ComunidadId FROM CP.tab_Comunidades where Descripcion collate  Latin1_General_CI_AI LIKE ";
                foreach (var palabra in palabras)
                {
                    query = query + "'%" + palabra + "%' and Descripcion collate Latin1_General_CI_AI LIKE";
                }
                var resultados = await _db.Database.SqlQuery<int>(query + "'%%'").ToListAsync();
                return resultados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Object> GetMisComunidades(string clave)
        {
            try
            {
                //int numDocumentosCargados = _db.DbSetDocumentos.Count();
                //if (numDocumentosCargados == 0)
                //{
                //    CargaDatosSIGCOE2 documentos = new CargaDatosSIGCOE2();
                //    await documentos.cargaDocumentos();
                //}
                

                ExpertosRepository _expertoRepo = new ExpertosRepository();

                List<int> listComunidad = await _db.DbSetMiembros.Where(e => e.idPersonas == clave).Select(e=>e.idCP).ToListAsync();
                var entities = await _db.DbSetComunidades.Where(e => listComunidad.Contains(e.ComunidadId) && e.Estado==true).Include(e => e.Adjunto).AsNoTracking().ToListAsync();

                List<object> lista = new List<object>();

                foreach (var item in entities)
                {
                    Comunidad com = new Comunidad();
                    if (item.Adjunto == null) {
                        com.Adjunto64 = null;
                    }
                    else
                    {
                        String file = string.Empty;
                        var archivo = item.Adjunto.RutaCompleta;
                        try
                        {
                            Byte[] bytes = File.ReadAllBytes(archivo);
                            file = Convert.ToBase64String(bytes);
                            com.Adjunto64 = file;
                        }
                        catch (Exception e)
                        {
                            com.Adjunto64 = null;
                        }
                    }

                        com.Descripcion = item.Descripcion;
                        com.Mision = item.Mision;
                        com.Estado = item.Estado;
                        com.ComunidadId = item.ComunidadId;
                        com.TipoAcceso = item.TipoAcceso;
                        com.FechaRegistro = item.FechaRegistro;

                        int numMiembros = _db.DbSetMiembros.Count(x => x.idCP == item.ComunidadId && x.estado == true);
                    //var expertos = await _expertoRepo.expertosEnComunidad(item.ComunidadId);
                        int expertos = _cr.Expertos.Count(x => x.ComunidadId == item.ComunidadId);
                        int numDocs = _db.DbSetDocumentos.Count(x => x.idComunidadCP == item.ComunidadId);
                        int numSitios = _db.DbSetSitioInteres.Count(x => x.idCP == item.ComunidadId);

                        var resultado = new { comunidad = com,   noMiembros = numMiembros, noExpertos = expertos, noDocumentos = numDocs, noSitios = numSitios };

                        lista.Add(resultado);
                        
                }
                
                return lista;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<Object>> GetAllToExpertos()
        {
            try
            {
                var comunidades = await (from comunidad in _db.DbSetComunidades
                                         where comunidad.Estado == true
                                         select new
                                         {
                                             ComunidadId = comunidad.ComunidadId,
                                             Descripcion = comunidad.Descripcion
                                         }).AsNoTracking().ToListAsync();
                return comunidades;
            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }

        public async Task<Object> GetById(int id)
        {
            try
            {
                var entities = await _db.DbSetComunidades
                    .Include(e=>e.Adjunto)   
                    .AsNoTracking()
                    .FirstOrDefaultAsync(e => e.ComunidadId == id);
                Object resultado = new Object();
                try
                {
                    var archivo = entities.Adjunto.RutaCompleta;
                    Byte[] bytes = File.ReadAllBytes(archivo);
                    String file = Convert.ToBase64String(bytes);
                    entities.Adjunto64 = file;
                }
                catch (Exception e)
                {
                    entities.Adjunto64 = null;
                }
                 resultado = new {entities.ComunidadId
                                                        ,entities.Adjunto
                                                        ,entities.Adjunto64
                                                        ,entities.idAjunto
                                                        ,entities.Descripcion
                                                        ,entities.Estado
                                                        ,entities.Mision
                                                        ,entities.claveLider
                                                        ,entities.nombreLider
                                                        ,entities.claveRolLider
                                                        ,entities.claveSecretario
                                                        ,entities.nombreSecretario
                                                        ,entities.claveRolSecretario
                                                        ,entities.TipoAcceso
                                                        
                    };
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(Comunidad model)
        {
            try
            {

                var entities =  _db.DbSetComunidades.Add(model);
                await _db.SaveChangesAsync();

                var id = entities.ComunidadId;
                
                NuevoOCRepository oc = new NuevoOCRepository();
                //Los parametros son modulo, id del oc, descripcion, liga del detalle del oc
                NuevoOC nuevoOC = new NuevoOC("CP", "CP",model.Descripcion, "indexCP.html#/homeComunidad/"+model.ComunidadId);
                await oc.Create(nuevoOC);

                Miembros lider = new Miembros();
                lider.Aceptacion = false;
                lider.FechaAlta = DateTime.Now;
                lider.FechaAceptacion = DateTime.Now;
                lider.idPersonas = model.claveLider;
                lider.rolId = model.claveRolLider;
                lider.idCP = id;
                lider.nombrePersona = model.nombreLider;
                lider.estado = true;


                _db.DbSetMiembros.Add(lider);
                await _db.SaveChangesAsync();


                Miembros secretario = new Miembros();
                secretario.Aceptacion = false;
                secretario.FechaAlta = DateTime.Now;
                secretario.FechaAceptacion = DateTime.Now;
                secretario.idPersonas = model.claveSecretario;
                secretario.rolId = model.claveRolSecretario;
                secretario.idCP = id;
                secretario.nombrePersona = model.nombreSecretario;
                secretario.estado = true;

                _db.DbSetMiembros.Add(secretario);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Comunidad> Update(Comunidad model)
        {
            try
            {
                var _model = await _db.DbSetComunidades.FirstOrDefaultAsync(e => e.ComunidadId == model.ComunidadId);
                if (_model != null)
                {
                    //Cuando se elimina el adjunto en modo edicion
                    if (model.idAjunto!=null)
                    {
                        int id = Convert.ToInt32(model.idAjunto);
                        model.idAjunto = null;
                        _db.Entry(_model).CurrentValues.SetValues(model);
                        await _db.SaveChangesAsync();
                        await _adjuntoRepo.Delete(id);
                    }
                    if (model.Adjunto != null && model.idAjunto==null)
                    {
                        Adjunto key = await _adjuntoRepo.CreateAd(model.Adjunto);
                        model.idAjunto = key.AdjuntoId;
                        model.Adjunto.AdjuntoId = key.AdjuntoId;
                        String file = string.Empty;
                        var archivo = model.Adjunto.RutaCompleta;
                        try
                        {
                            Byte[] bytes = File.ReadAllBytes(archivo);
                            file = Convert.ToBase64String(bytes);
                            model.Adjunto64 = file;
                        }
                        catch (Exception e)
                        {
                            model.Adjunto64 = null;
                        }
                    }
                    _db.Entry(_model).CurrentValues.SetValues(model);
                    await _db.SaveChangesAsync();
                }
                return model;
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
                var _model = await _db.DbSetComunidades.FirstOrDefaultAsync(e => e.ComunidadId == id);
                if (_model != null)
                {
                    _db.DbSetComunidades.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task UpdateEstado(Comunidad model)
        {
            try
            {
                var _model = await _db.DbSetComunidades.FirstOrDefaultAsync(e => e.ComunidadId == model.ComunidadId);
                if (_model != null)
                {
                    _model.Estado = model.Estado;
                    var infoAgregada= await _genContext.dbSetNuevoOC.Where(e=> e.descripcion.Equals(model.Descripcion)).FirstOrDefaultAsync();
                    if(infoAgregada!=null){
                        infoAgregada.nuevo=!infoAgregada.nuevo;
                        await _genContext.SaveChangesAsync();
                    }
                    await _db.SaveChangesAsync();
                    await CambiaEstadoObjetosConocimientoComunidad(_model.ComunidadId);
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task CambiaEstadoObjetosConocimientoComunidad(int id){
            try{
                //Se obtienen los ocs asociados a la comunidad buscada y se procede a cambiar el estado de cada nuevo OC
                var listaTemasInnovacion= await _db.DbSetTemasInnovacion.Where(e=> e.idCP== id && e.Estado.Equals("Aprobado")).AsNoTracking().Select(x=> x.TemaId).ToListAsync();
                List<string> idsTemas= listaTemasInnovacion.Select(x=> Convert.ToString(x)).ToList();
                await CambiaEstado(idsTemas, "TemasInnovacion");

                var listaPlanesAnuales= await _db.DbSetPlanAnual.Where(e=> e.idCP==id && e.Estado.Equals("Aprobado")).AsNoTracking().Select(x=> x.PlanId).ToListAsync();
                List<string> idsPlanes= listaPlanesAnuales.Select(x=> Convert.ToString(x)).ToList();
                await CambiaEstado(idsPlanes, "PlanesAnuales");

                var listaMapas = await _db.DbSetMapasRutas.Where(e=> e.idCP==id && e.Estatus.Equals("Aprobado")).AsNoTracking().Select(x=> x.MapaId).ToListAsync();
                List<string> idsMapas= listaMapas.Select(x=> Convert.ToString(x)).ToList();
                await CambiaEstado(idsMapas, "MapasRuta");

                var listaInformes = await _db.DbSetInformeAnual.Where(e=> e.idCP==id && e.Estado.Equals("Aprobado")).AsNoTracking().Select(x=> x.InformeId).ToListAsync();
                List<string> idsInformes= listaInformes.Select(x=> Convert.ToString(x)).ToList();
                await CambiaEstado(idsInformes, "InformesAnuales");

                var listaEstudios = await _db.DbSetEstudios.Where(e=> e.idCP==id && e.Estado.Equals("Aprobado")).AsNoTracking().Select(x=> x.EstudiosId).ToListAsync();
                List<string> idsEstudios= listaEstudios.Select(x=> Convert.ToString(x)).ToList();
                await CambiaEstado(idsEstudios, "EstudiosEspecializados");

                var listaEstadoArte = await _db.DbSetEstadoArte.Where(e=> e.idCP==id && e.Estado.Equals("Aprobado")).AsNoTracking().Select(x=> x.EstadoArteId).ToListAsync();
                List<string> idsEstadoArte= listaEstadoArte.Select(x=> Convert.ToString(x)).ToList();
                await CambiaEstado(idsEstadoArte, "EstadoArte");


            }catch(Exception e){
                throw new Exception(e.Message,e);
            }
        }

        public async Task CambiaEstado(List<string> ids, string nombreOC){
            try{

                var resultados= await _genContext.dbSetNuevoOC.Where(e=> ids.Contains(e.IdExterno) && e.OcsId.Equals(nombreOC)).ToListAsync();
                if(resultados!=null){
                    resultados.ForEach(x=> x.nuevo=!x.nuevo);
                }
                await _genContext.SaveChangesAsync();

            }catch(Exception e){
                throw new Exception(e.Message, e);
            }
        }


        public void Dispose()
        {
            _db.Dispose();
        }
    }
}
