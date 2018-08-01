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
    public class AliadoRepository : IDisposable
    {

        private CR_Context _db;
        private GEN_Context _dbGEN;

        public AliadoRepository()
        {
            _db = new CR_Context();
            _dbGEN = new GEN_Context();
        }
        public async Task<int> countByStatus(Boolean estadoFlujo)
        {
            try
            {
                return await (from t in _db.Aliado
                               .Where(f => f.Estado == estadoFlujo)
                              select t).CountAsync();
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
                var entities = await _db.Aliado
                    .AsNoTracking()
                    .Include(e => e.Empresa)
                    .Include(e => e.Empresa.TipoOrganizacion)
                    .Select(x => new
                    {
                        AliadoId = x.AliadoId,
                        EmpresaId = x.EmpresaId,
                        EmpresaNombre = x.Empresa.NombreEmpresa,
                        TipoOrganizacionId = x.Empresa.TipoOrganizacionId,
                        TipoOrgNombre = x.Empresa.TipoOrganizacion.Nombre
                    })
                    .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<Aliado>> GetAll()
        {
            try
            {
                var entities = await _db.Aliado
                    .AsNoTracking()
                    .Include(e => e.Empresa)
                    .Include(e => e.Empresa.TipoOrganizacion)
                    .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Object> GetAllConveniosHistoricos()
        {
            try
            {
                DateTime hoy = DateTime.Now;
                //Primero se obtiene las fks de los convenios vigentes
                var fksconveniosVigentes = await (from conv in _db.Convenio.AsNoTracking()
                                            where conv.FechaTermino >= hoy || conv.Indefinido == true
                                            select conv.AliadoId).Distinct().ToListAsync();

                //Obtenemos la lista de convenios no vigentes (con ayuda de la anterior lista)
                //var fksconvenios = await (from convenio in _db.Convenio.AsNoTracking()
                //                          where convenio.FechaTermino < hoy && !fksconveniosVigentes.Contains(convenio.AliadoId)
                //                          select convenio.AliadoId).ToListAsync();

                //A partir de la lista anterior se puede obtener los aliados con convenios viejos
                var entities = await (from aliado in _db.Aliado.Include("Empresa.TipoOrganizacion").Include(e => e.Contacto)
                                      where !fksconveniosVigentes.Contains(aliado.AliadoId)
                                      select new
                                      {
                                          aliado.AliadoId,
                                          aliado.Estado,
                                          EmpresaNombre = aliado.Empresa.NombreEmpresa,
                                          EmpresaDescripcion = aliado.Empresa.Descripcion,
                                          EmpresSitio = aliado.Empresa.SitioWeb,
                                          Contacto = String.Concat(aliado.Contacto.NombreContacto, " ", aliado.Contacto.ApellidoPaterno, " ", aliado.Contacto.ApellidoMaterno),
                                          EmpresaCorreo = aliado.Contacto.Correo,
                                          EmpresaTelefono = aliado.Contacto.Telefono,
                                          EmpresaCelular = aliado.Contacto.Celular,
                                          TipoOrganizacion = aliado.Empresa.TipoOrganizacion.Nombre,

                                      }).AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Object> GetAllConveniosVigentes()
        {
            try
            {
                DateTime hoy = DateTime.Now;
                var conveniosvigentes = await (from convenio in _db.Convenio.AsNoTracking()
                                               where convenio.FechaTermino >= hoy || convenio.Indefinido == true
                                               select convenio.AliadoId).Distinct().ToListAsync();

                var entities = await (from aliado in _db.Aliado.Include("Empresa.TipoOrganizacion").Include(e => e.Contacto).AsNoTracking()
                                      where conveniosvigentes.Contains(aliado.AliadoId)
                                      select new
                                      {
                                          aliado.AliadoId,
                                          aliado.Estado,
                                          EmpresaNombre = aliado.Empresa.NombreEmpresa,
                                          EmpresaDescripcion = aliado.Empresa.Descripcion,
                                          EmpresSitio = aliado.Empresa.SitioWeb,
                                          Contacto = String.Concat(aliado.Contacto.NombreContacto, " ", aliado.Contacto.ApellidoPaterno, " ", aliado.Contacto.ApellidoMaterno),
                                          EmpresaCorreo = aliado.Contacto.Correo,
                                          EmpresaTelefono = aliado.Contacto.Telefono,
                                          EmpresaCelular = aliado.Contacto.Celular,
                                          TipoOrganizacion = aliado.Empresa.TipoOrganizacion.Nombre,

                                      }).ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Lista de empresas asociadas a la lista de fks
        /// </summary>
        /// <returns>Objeto anonimo</returns>
        public async Task<IEnumerable<Object>> GetEmpresas()
        {
            try
            {
                EmpresasRepository repo = new EmpresasRepository();
                var listaFks = await _db.Aliado.Where(e => e.Estado == true).AsNoTracking().Select(e => e.EmpresaId).ToListAsync();
                var datos = await repo.GetEmpresasByCollectionFKs(listaFks);
                return datos;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<int> CountConveniosEmpresa(int id)
        {
            try
            {
                var listaAliado = await _db.Aliado.Where(e => e.EmpresaId == id).AsNoTracking().Select(e => e.AliadoId).ToListAsync();
                if (listaAliado.Count > 0)
                {
                    var convenios = await _db.Convenio.Where(x => listaAliado.Contains(x.AliadoId) && x.Estado == true).AsNoTracking().CountAsync();
                    return convenios;
                }
                return 0;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Fks de tipos de los tipos de convenios registrados al momento
        /// </summary>
        /// <returns>Lista de fks</returns>
        public async Task<IEnumerable<Object>> GetTipoConvenios()
        {
            try
            {
                var listaFks = await _db.Convenio.AsNoTracking().Select(e => e.TipoConvenioId).ToListAsync();
                var datos = await _db.TipoConvenio.Where(e => listaFks.Contains(e.ConvenioId)).AsNoTracking()
                    .Select(x => new
                    {
                        idTipo = x.ConvenioId,
                        Nombre = x.NomTipConv
                    }).ToListAsync();
                return datos;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Consulta parametrizada de aliados
        /// </summary>
        /// <returns>Objeto anonimo</returns>
        public async Task<IEnumerable<Object>> GetConsultaParametrizadaAliados(Convenio parametros)
        {
            try
            {
                var aliados = (from aliado in _db.Convenio
                               .Include(e => e.TipoConvenio)
                               .Include(e => e.Aliado)
                               select aliado).AsNoTracking();

                if (aliados != null)
                {

                    if (!String.IsNullOrEmpty(parametros.busquedaFecha))  //busqueda por fecha
                    {
                        aliados = aliados.Where(e => (DbFunctions.TruncateTime(e.FechaTermino) >= DbFunctions.TruncateTime(parametros.fechaInicioComparacion)
                                                    && DbFunctions.TruncateTime(e.FechaTermino) <= DbFunctions.TruncateTime(parametros.fechaFinalComparacion)));
                    }
                    if (parametros.EmpresaId != 0)  //Busqueda por empresa
                    {
                        //Obtenemos la lista de aliados relacionados con la empresa buscada
                        var listaEmpresas = await _db.Aliado.Where(e => e.EmpresaId == parametros.EmpresaId).AsNoTracking()
                            .Select(e => e.AliadoId).ToListAsync();

                        //a partir de la lista recuperada se filtra la coleccion
                        aliados = aliados.Where(e => listaEmpresas.Contains(e.AliadoId));
                    }
                    if (parametros.TipoConvenioId != 0)  //Busqueda por tipo de convenio
                    {
                        aliados = aliados.Where(e => e.TipoConvenioId == parametros.TipoConvenioId);
                    }
                    if (!String.IsNullOrEmpty(parametros.ClaveUnidad)) //Busqueda por clave de unidad
                    {
                        //Lista de Fks de claves de unidades que tienen relacion con x convenio
                        var listaFKAreas = await _db.AreaConvenio.Where(e => e.ClaveUnidad == parametros.ClaveUnidad)
                            .AsNoTracking()
                            .Select(e => e.ConvenioId).ToListAsync();

                        aliados = aliados.Where(e => listaFKAreas.Contains(e.AliadoId));
                    }
                    if (!String.IsNullOrEmpty(parametros.ObjetoConvenio))  //Busqueda por objeto del convenio
                    {
                        var listaFks = await GetConveniosLikeNombreLatin1(parametros.ObjetoConvenio);
                        aliados = aliados.Where(e => listaFks.Contains(e.ConvenioId));
                    }
                    if (!String.IsNullOrEmpty(parametros.NoConvenio))  //Busqueda por el numero del convenio
                    {
                        var listaNumeros = await GetConveniosByNumeroLikeNombreLatin1(parametros.NoConvenio);
                        aliados = aliados.Where(e => listaNumeros.Contains(e.ConvenioId));
                    }
                    if (!String.IsNullOrEmpty(parametros.TipoAcceso))  //Busqueda por tipo de acceso, ya sea publico o restringido
                    {
                        aliados = aliados.Where(e => e.TipoAcceso == parametros.TipoAcceso);
                    }

                    //******Se inicia el proceso de proyeccion******
                    //Los resultados lo guardaremos en una lista de X objeto
                    List<BusquedaParamsCR> datos = aliados.Select(x => new BusquedaParamsCR //Es una clase no mapeada que contiene caracteristicas
                                                                                            //que nos permiten albergar SOLO los datos necesarios
                    {
                        ConvenioId = x.ConvenioId, //Rescatamos los parametros que se requieren para el front
                        ObjetoConvenio = x.ObjetoConvenio,
                        NoConvenio = x.NoConvenio,
                        TipoConvenio = x.TipoConvenio.NomTipConv,
                        TipoAcceso = x.TipoAcceso,
                        FechaInicio = x.FechaInicio,
                        FechaTermino = x.FechaTermino,
                        EmpresaId = x.Aliado.EmpresaId,

                    }).ToList();

                    var clavesUnidad = await (from clave in _db.AreaConvenio
                                              where (aliados.Select(e => e.ConvenioId).ToList()).Contains(clave.ConvenioId)
                                              select new
                                              {
                                                  ConvenioId = clave.ConvenioId,
                                                  ClaveUnidad = clave.ClaveUnidad
                                              }).ToListAsync();

                    foreach (var c in datos)
                    {
                        c.NombreEmpresa = await (from emp in _db.Empresa
                                                 where emp.EmpresaId == c.EmpresaId
                                                 select emp.NombreEmpresa).AsNoTracking().FirstOrDefaultAsync();

                        var claveRegistro = clavesUnidad.Where(e => e.ConvenioId == c.ConvenioId).Select(e => e.ClaveUnidad).FirstOrDefault();

                        c.ClaveUnidad = await (from uo in _dbGEN.dbSetUnidadOrganizacional
                                               where uo.ClaveUnidad == claveRegistro
                                                     && uo.FechaEfectiva ==
                                                            (_dbGEN.dbSetUnidadOrganizacional.Where(f => f.ClaveUnidad == claveRegistro &&
                                                                        f.FechaEfectiva <= DateTime.Now).Max(f => f.FechaEfectiva))
                                               select uo.NombreUnidad
                                                        ).AsNoTracking().FirstOrDefaultAsync();
                    }
                    return datos.OrderBy(e=> e.NombreEmpresa);
                }
                return null;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        /// <summary>
        /// Obtener todas las claves de los convenios buscados por su nombre
        /// </summary>
        /// <returns></returns>
        public async Task<List<int>> GetConveniosLikeNombreLatin1(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT ConvenioId FROM CR.tab_Convenio where ObjetoConvenio collate Latin1_General_CI_AI LIKE ";
                foreach (var palabra in palabras)
                {
                    query = query + "'%" + palabra + "%' and ObjetoConvenio collate Latin1_General_CI_AI LIKE";
                }
                var resultados = await _db.Database.SqlQuery<int>(query + "'%%'").ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtener todas las claves de los convenios buscados por su numero
        /// </summary>
        /// <returns></returns>
        public async Task<List<int>> GetConveniosByNumeroLikeNombreLatin1(String likeNombre)
        {
            try
            {

                var resultados = await _db.Database.SqlQuery<int>
                ("SELECT ConvenioId FROM CR.tab_Convenio where NoConvenio collate Latin1_General_CI_AI LIKE '%" + likeNombre + "%'").ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Aliado> Get(int id)
        {
            try
            {
                var entities = await _db.Aliado.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.AliadoId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task CreateConvenio(Aliado model)
        {
            try
            {
                if (model.TipoConvenio != 0 && model.ObjetoConvenio.Length >= 0)
                {
                    await insertaConvenio(model);

                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task CreateActividad(Aliado model)
        {
            try
            {
                ActividadAdicional obj = new ActividadAdicional();
                obj.AliadoId = model.AliadoId;
                obj.Descripcion = model.DescripcionActividad;
                obj.FechaActividad = model.FechaActividad;
                obj.Autor = model.Autor;
                obj.FechaRegistro = DateTime.Now;

                obj.Estado = true;

                var entities = _db.ActividadAdicional.Add(obj);
                await _db.SaveChangesAsync();
                var ActividadAdicionalId = entities.ActividadAdicionalId;

                if (model.AreasActividad.Length >= 0)
                {
                    await insertaAreasActividad(model, ActividadAdicionalId);

                }

                if (model.ClavePersonaActividad.Length >= 0)
                {
                    await insertaPersonaActividad(model, ActividadAdicionalId);

                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        private async Task insertaAreasActividad(Aliado model, int ActividadId)
        {
            try
            {

                for (int i = 0; i < model.AreasActividad.Length; i++)
                {
                    AreaActividadAdicional obj = new AreaActividadAdicional();
                    var item = model.AreasActividad[i];
                    //var item2 = model.FechasAreaActividad[i];

                    obj.ClaveUnidad = item;
                    //obj.FechaEfectiva = item2;
                    obj.ActividadAdicionalId = ActividadId;
                    obj.Autor = model.Autor;
                    obj.FechaRegistro = DateTime.Now;
                    obj.Estado = true;

                    var entities = _db.AreaActividadAdicional.Add(obj);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        private async Task insertaPersonaActividad(Aliado model, int ActividadId)
        {
            try
            {

                for (int i = 0; i < model.ClavePersonaActividad.Length; i++)
                {
                    PersonalActividadAdicional obj = new PersonalActividadAdicional();
                    var item = model.ClavePersonaActividad[i];
                    //var item2 = model.FechasAreaActividad[i];

                    obj.ClavePersona = item;
                    obj.ActividadAdicionalId = ActividadId;
                    obj.Autor = model.Autor;
                    obj.FechaRegistro = DateTime.Now;
                    obj.Estado = true;

                    var entities = _db.PersonalActividadAdicional.Add(obj);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<Aliado> ValidaAliado(int EmpresaId)
        {
            try
            {
                var entities = await _db.Aliado.AsNoTracking()
                     .FirstOrDefaultAsync(e => e.EmpresaId == EmpresaId);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        private async Task insertaConvenio(Aliado model)
        {
            try
            {
                Convenio obj = new Convenio();
                obj.AliadoId = model.AliadoId;
                obj.TipoConvenioId = model.TipoConvenio;
                obj.ObjetoConvenio = model.ObjetoConvenio;
                obj.NoConvenio = model.NoConvenio;
                obj.FechaInicio = model.FechaInicioConvenio;
                obj.FechaTermino = model.FechaTerminoConvenio;
                obj.TipoAcceso = model.TipoAccesoConvenio;
                obj.Firma = model.NomFirmaConvenio;
                obj.Autor = model.Autor;
                obj.AmbitoConvId = model.AmbitoConvenio;
                obj.FechaRegistro = DateTime.Now;
                obj.Observaciones = model.observacion;
                obj.Indefinido = model.indefinido;
                obj.Estado = true;

                if (model.indefinido)
                {
                    obj.FechaTermino = null;
                }

                var entities = _db.Convenio.Add(obj);
                await _db.SaveChangesAsync();
                var ConvenioId = entities.ConvenioId;

                if (model.AreasConvenio.Length >= 0)
                {
                    await insertaAreas(model, ConvenioId);

                }

                if (model.AdjuntosNombreConvenio.Length >= 0)
                {
                    await insertaAdjunto(model, ConvenioId);

                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        private async Task insertaAreas(Aliado model, int convenioId)
        {
            try
            {

                for (int i = 0; i < model.AreasConvenio.Length; i++)
                {
                    AreaConvenio obj = new AreaConvenio();
                    var item = model.AreasConvenio[i];
                    //var item2 = model.FechasAreaConvenio[i];

                    obj.ClaveUnidad = item;
                    //obj.FechaEfectiva = item2;
                    obj.ConvenioId = convenioId;
                    obj.Autor = model.Autor;
                    obj.FechaRegistro = DateTime.Now;
                    obj.Estado = true;

                    var entities = _db.AreaConvenio.Add(obj);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        private async Task insertaAdjunto(Aliado model, int convenioId)
        {
            try
            {

                for (int i = 0; i < model.AdjuntosNombreConvenio.Length; i++)
                {
                    Adjunto obj = new Adjunto();
                    var item2 = model.AdjuntosRutaConvenio[i];
                    var item = model.AdjuntosNombreConvenio[i];

                    obj.RutaCompleta = item2;
                    obj.nombre = item;
                    obj.ModuloId = "CR";
                    var entities = _dbGEN.dbSetAdjuntos.Add(obj);
                    await _dbGEN.SaveChangesAsync();
                    var adjuntoId = entities.AdjuntoId;
                    await insertaAdjuntoConvenio(model, adjuntoId, convenioId);
                }
            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }

        private async Task insertaAdjuntoConvenio(Aliado model, long IdAdjunto, int ConvenioId)
        {
            try
            {
                AdjuntoPorConvenio obj = new AdjuntoPorConvenio();
                obj.Autor = model.Autor;
                obj.FechaRegistro = DateTime.Now;
                obj.Estado = true;
                obj.AdjuntoId = IdAdjunto;
                obj.ConvenioId = ConvenioId;

                var entities = _db.AdjuntoPorConvenio.Add(obj);
                await _db.SaveChangesAsync();


            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }

        private async Task insertaAdjuntoFromUpdateConvenio(Convenio model, long IdAdjunto)
        {
            try
            {
                AdjuntoPorConvenio obj = new AdjuntoPorConvenio();
                obj.Autor = model.Autor;
                obj.FechaRegistro = DateTime.Now;
                obj.Estado = true;
                obj.AdjuntoId = IdAdjunto;
                obj.ConvenioId = model.ConvenioId;

                var entities = _db.AdjuntoPorConvenio.Add(obj);
                await _db.SaveChangesAsync();


            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }
        public async Task<Aliado> GetByIdFK(int id)
        {
            try
            {
                var entities = await _db.Aliado.AsNoTracking()
                    .Include(e => e.Empresa)
                    .Include(e => e.Empresa.TipoOrganizacion)
                    .Include(f => f.Contacto) ///eliminar en el proximo deploy a calidad
                    .Include("Convenio.TipoConvenio")
                    .Include(g => g.ActividadAdicional)
                    .Include("Empresa.Estados")
                    .Include("Empresa.Municipios")
                    .FirstOrDefaultAsync(e => e.AliadoId == id);

                entities.listaContactosRegistrados = await _db.ContactorPorAliados.Where(e => e.aliadoId == entities.AliadoId).Include(e => e.Contacto).AsNoTracking().ToListAsync();

                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<Convenio> GetConvByIdFK(int id)
        {
            try
            {
                var entities = await _db.Convenio.AsNoTracking()
                    .Include("AdjuntoPorConvenio.Adjunto")
                    .Include(g => g.AreaConvenio)
                    .Include(g => g.TipoConvenio)
                    .Include(g => g.AmbitoConv)
                    .Include("Aliado.Empresa")
                    .FirstOrDefaultAsync(e => e.ConvenioId == id);

                //Obtiene la lista de areas en el convenio
                var areas = new List<AreaConvenio>();
                areas = await (from auo in _db.AreaConvenio
                               where auo.ConvenioId == id
                               select auo)
                                      .AsNoTracking()
                                      .ToListAsync();

                //Obtiene la lista de uos en las areasConvenio
                List<String> uos1 = new List<string>(areas.Select(x => x.ClaveUnidad.Trim()));
                UORepository uo = new UORepository(_dbGEN);
                List<UnidadOrganizacional> uos = new List<UnidadOrganizacional>();
                uos = await uo.GetAllByCollectionCR(uos1);

                foreach (AreaConvenio ar in entities.AreaConvenio)
                {
                    var unidadId = ar.ClaveUnidad;
                    ar.UnidadOrganizacional = uos.Find(x => x.ClaveUnidad == unidadId);
                }

                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<ActividadAdicional> GetActByIdFK(int id)
        {
            try
            {
                var entities = await _db.ActividadAdicional.AsNoTracking()
                    .Include(g => g.AreaActividadAdicional)
                    .Include("Aliado.Empresa")
                    .Include(g => g.PersonalActividadAdicional)
                    .FirstOrDefaultAsync(e => e.ActividadAdicionalId == id);

                PersonasRepository per = new PersonasRepository(_dbGEN);
                foreach (PersonalActividadAdicional ppc in entities.PersonalActividadAdicional)
                {
                    var personaId = ppc.ClavePersona;
                    ppc.Personas = await per.GetById(personaId);
                }

                //Obtiene la lista de areas en el convenio
                var areas = new List<AreaActividadAdicional>();
                areas = await (from auo in _db.AreaActividadAdicional
                               where auo.ActividadAdicionalId == id
                               select auo)
                                      .AsNoTracking()
                                      .ToListAsync();

                //Obtiene la lista de uos en las areasConvenio
                List<String> uos1 = new List<string>(areas.Select(x => x.ClaveUnidad.Trim()));
                UORepository uo = new UORepository(_dbGEN);
                List<UnidadOrganizacional> uos = new List<UnidadOrganizacional>();
                uos = await uo.GetAllByCollectionCR(uos1);

                foreach (AreaActividadAdicional ar in entities.AreaActividadAdicional)
                {
                    var unidadId = ar.ClaveUnidad;
                    ar.UnidadOrganizacional = uos.Find(x => x.ClaveUnidad == unidadId);
                }

                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Convenio> GetConvById(int id)
        {
            try
            {
                var entities = await _db.Convenio.AsNoTracking()
                    .Include("AdjuntoPorConvenio.Adjunto")
                    .Include(g => g.AreaConvenio)
                    .Include(g => g.TipoConvenio)
                    .FirstOrDefaultAsync(e => e.ConvenioId == id);

                //Obtiene la lista de areas en el convenio
                var areas = new List<AreaConvenio>();
                areas = await (from auo in _db.AreaConvenio
                               where auo.ConvenioId == id
                               select auo)
                                      .AsNoTracking()
                                      .ToListAsync();

                //Obtiene la lista de uos en las areasConvenio
                List<String> uos1 = new List<string>(areas.Select(x => x.ClaveUnidad.Trim()));
                UORepository uo = new UORepository(_dbGEN);
                List<UnidadOrganizacional> uos = new List<UnidadOrganizacional>();
                uos = await uo.GetAllByCollectionCR(uos1);

                foreach (AreaConvenio ar in entities.AreaConvenio)
                {
                    var unidadId = ar.ClaveUnidad;
                    ar.UnidadOrganizacional = uos.Find(x => x.ClaveUnidad == unidadId);
                }

                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(Aliado model)
        {
            try
            {
                _db.Aliado.Add(model);
                await _db.SaveChangesAsync();
                if (model.listaContactos != null)
                {
                    ContactosPorAliados nuevoContacto = new ContactosPorAliados();
                    foreach (var c in model.listaContactos)
                    {
                        nuevoContacto.ContactoId = c.ContactoId;
                        nuevoContacto.aliadoId = model.AliadoId;
                        nuevoContacto.fechaRegistro = DateTime.Now;

                        _db.ContactorPorAliados.Add(nuevoContacto);
                        await _db.SaveChangesAsync();
                    }

                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(Aliado model)
        {
            try
            {
                var _model = await _db.Aliado.FirstOrDefaultAsync(e => e.AliadoId == model.AliadoId);
                if (_model != null)
                {
                    _db.Entry(_model).CurrentValues.SetValues(model);
                    await _db.SaveChangesAsync();
                    if (model.listaContactos != null)
                    {
                        var listaContactosViejos = await _db.ContactorPorAliados.Where(e => e.aliadoId == model.AliadoId).ToListAsync();
                        foreach (var contacto in listaContactosViejos)
                        {
                            var x = await _db.ContactorPorAliados.FirstOrDefaultAsync(e => e.id == contacto.id);
                            if (x != null)
                            {
                                _db.ContactorPorAliados.Remove(x);
                                await _db.SaveChangesAsync();
                            }
                        }

                        ContactosPorAliados nuevoContacto = new ContactosPorAliados();
                        foreach (var c in model.listaContactos)
                        {
                            nuevoContacto.aliadoId = model.AliadoId;
                            nuevoContacto.ContactoId = c.ContactoId;
                            nuevoContacto.fechaRegistro = DateTime.Now;

                            _db.ContactorPorAliados.Add(nuevoContacto);
                            await _db.SaveChangesAsync();

                        }


                    }
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task UpdateConvenio(Convenio model)
        {
            try
            {
                var _model = await _db.Convenio.FirstOrDefaultAsync(e => e.ConvenioId == model.ConvenioId);
                if (_model != null)
                {
                    _db.Entry(_model).CurrentValues.SetValues(model);
                    await _db.SaveChangesAsync();

                    //if (model.AdjuntosNombreConvenio.Length >= 0)
                    //{
                    //    await insertaAdjuntoUpdateConvenio(model);

                    //}

                    ////Adjuntos
                    //if (model.adjuntosAntDel.Length > 0)
                    //{
                    //    //Elimina los adjuntos que tenia dados de alta y elimino al actualizar
                    //    await EliminaAdjuntoAnt(model);
                    //}
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        private async Task EliminaAreaConvenioUpdate(Convenio model)
        {
            try
            {
                foreach (var item in model.AreasConvenioAntDel)
                {
                    var _model = await _db.AreaConvenio.FirstOrDefaultAsync(e => e.AreaConvenioId == item);
                    if (_model != null)
                    {
                        _db.AreaConvenio.Remove(_model);
                        await _db.SaveChangesAsync();
                    }

                }
            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }

        private async Task insertaAreasUpdateConvenio(Convenio model)
        {
            try
            {

                for (int i = 0; i < model.AreasConvenio.Length; i++)
                {
                    AreaConvenio obj = new AreaConvenio();
                    var item = model.AreasConvenio[i];
                    var item2 = model.FechasAreaConvenio[i];

                    obj.ClaveUnidad = item;
                    //obj.FechaEfectiva = item2;
                    obj.ConvenioId = model.ConvenioId;
                    obj.Autor = model.Autor;
                    obj.FechaRegistro = DateTime.Now;
                    obj.Estado = true;

                    var entities = _db.AreaConvenio.Add(obj);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        private async Task insertaAdjuntoUpdateConvenio(Convenio model)
        {
            try
            {

                for (int i = 0; i < model.AdjuntosNombreConvenio.Length; i++)
                {
                    Adjunto obj = new Adjunto();
                    var item2 = model.AdjuntosRutaConvenio[i];
                    var item = model.AdjuntosNombreConvenio[i];

                    obj.RutaCompleta = item2;
                    obj.nombre = item;
                    obj.ModuloId = "CR";
                    var entities = _dbGEN.dbSetAdjuntos.Add(obj);
                    await _dbGEN.SaveChangesAsync();
                    var adjuntoId = entities.AdjuntoId;
                    await insertaAdjuntoFromUpdateConvenio(model, adjuntoId);
                }
            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateActividad(ActividadAdicional model)
        {
            try
            {
                var _model = await _db.ActividadAdicional.FirstOrDefaultAsync(e => e.ActividadAdicionalId == model.ActividadAdicionalId);
                if (_model != null)
                {
                    _db.Entry(_model).CurrentValues.SetValues(model);
                    await _db.SaveChangesAsync();

                    //if (model.AreasActividad.Length >= 0)
                    //{
                    //    await insertaAreasUpdateActividad(model);

                    //}

                    //if (model.PersonasActividad.Length >= 0)
                    //{
                    //    await insertaPersonasUpdateActividad(model);

                    //}
                    ////Areas
                    //if (model.AreasActividadAntDel.Length > 0)
                    //{
                    //    //Elimina las areas que tenia dadas de alta y elimino al actualizar
                    //    await EliminaAreaActividadUpdate(model);
                    //}

                    ////Personas
                    //if (model.PersonasActividadAntDel.Length > 0)
                    //{
                    //    //Elimina los personas que tenia dados de alta y elimino al actualizar
                    //    await EliminaPersonaActividadUpdate(model);
                    //}
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task UpdateActividadActualizado(ActividadAdicional model)
        {
            try
            {
                var _model = await _db.ActividadAdicional.FirstOrDefaultAsync(e => e.ActividadAdicionalId == model.ActividadAdicionalId);
                if (_model != null)
                {
                    _db.Entry(_model).CurrentValues.SetValues(model);
                    await _db.SaveChangesAsync();

                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        private async Task insertaAreasUpdateActividad(ActividadAdicional model)
        {
            try
            {

                for (int i = 0; i < model.AreasActividad.Length; i++)
                {
                    AreaActividadAdicional obj = new AreaActividadAdicional();
                    var item = model.AreasActividad[i];
                    var item2 = model.FechasAreaActividad[i];

                    obj.ClaveUnidad = item;
                    //obj.FechaEfectiva = item2;
                    obj.ActividadAdicionalId = model.ActividadAdicionalId;
                    obj.Autor = model.Autor;
                    obj.FechaRegistro = DateTime.Now;
                    obj.Estado = true;

                    var entities = _db.AreaActividadAdicional.Add(obj);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        private async Task insertaPersonasUpdateActividad(ActividadAdicional model)
        {
            try
            {

                for (int i = 0; i < model.PersonasActividad.Length; i++)
                {
                    PersonalActividadAdicional obj = new PersonalActividadAdicional();
                    var item = model.PersonasActividad[i];

                    obj.ClavePersona = item;
                    obj.ActividadAdicionalId = model.ActividadAdicionalId;
                    obj.Autor = model.Autor;
                    obj.FechaRegistro = DateTime.Now;
                    obj.Estado = true;

                    var entities = _db.PersonalActividadAdicional.Add(obj);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        private async Task EliminaAreaActividadUpdate(ActividadAdicional model)
        {
            try
            {
                foreach (var item in model.AreasActividadAntDel)
                {
                    var _model = await _db.AreaActividadAdicional.FirstOrDefaultAsync(e => e.AreaActividadAdicionalId == item);
                    if (_model != null)
                    {
                        _db.AreaActividadAdicional.Remove(_model);
                        await _db.SaveChangesAsync();
                    }

                }
            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }

        private async Task EliminaPersonaActividadUpdate(ActividadAdicional model)
        {
            try
            {
                foreach (var item in model.PersonasActividadAntDel)
                {
                    var _model = await _db.PersonalActividadAdicional.FirstOrDefaultAsync(e => e.PersonalActividadAdicionalId == item);
                    if (_model != null)
                    {
                        _db.PersonalActividadAdicional.Remove(_model);
                        await _db.SaveChangesAsync();
                    }

                }
            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }
        public async Task UpdateEstado(Aliado model)
        {
            try
            {
                var _model = await _db.Aliado.FirstOrDefaultAsync(e => e.AliadoId == model.AliadoId);
                if (_model != null)
                {
                    _model.Estado = model.Estado;

                    await _db.SaveChangesAsync();
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
                var _model = await _db.Aliado.FirstOrDefaultAsync(e => e.AliadoId == id);
                if (_model != null)
                {
                    _db.Aliado.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task DeleteConvenioFromAliados(int id)
        {
            try
            {
                var _model = await _db.Convenio
                    .FirstOrDefaultAsync(e => e.ConvenioId == id);
                if (_model != null)
                {
                    //elimina las areas relacionadas en el convenio
                    var areas = await _db.AreaConvenio.Where(x => x.ConvenioId == id).ToListAsync();
                    if (areas != null)
                    {
                        _db.AreaConvenio.RemoveRange(areas);
                    }

                    //Elimina los adjuntos por Convenio
                    var adjuntos = await _db.AdjuntoPorConvenio.Where(x => x.ConvenioId == id).ToListAsync();
                    if (adjuntos != null)
                    {
                        var idadjuntos = adjuntos.Select(x => x.AdjuntoId).ToList();
                        _db.AdjuntoPorConvenio.RemoveRange(adjuntos);
                        await _db.SaveChangesAsync();

                        await new AdjuntoRepository().DeleteByCollectionIds(idadjuntos);
                    }

                    _db.Convenio.Remove(_model);
                    await _db.SaveChangesAsync();

                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        private async Task EliminaAdjuntoAnt(Convenio model)
        {
            try
            {
                foreach (var item in model.adjuntosAntDel)
                {
                    var _model = await _db.AdjuntoPorConvenio.FirstOrDefaultAsync(e => e.AdjuntoPorConvenioId == item);
                    if (_model != null)
                    {
                        _db.AdjuntoPorConvenio.Remove(_model);
                        await _db.SaveChangesAsync();
                    }

                }
                if (model.adjuntosIdAntDel.Length > 0)
                {
                    await EliminaIdAdjuntoAnt(model);
                }
            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }

        private async Task EliminaIdAdjuntoAnt(Convenio model)
        {
            try
            {
                foreach (var item in model.adjuntosIdAntDel)
                {
                    var _model = await _dbGEN.dbSetAdjuntos.FirstOrDefaultAsync(e => e.AdjuntoId == item);
                    if (_model != null)
                    {
                        _dbGEN.dbSetAdjuntos.Remove(_model);
                        await _dbGEN.SaveChangesAsync();
                    }

                }
            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }

        public async Task DeleteActividadFromAliados(int id)
        {
            try
            {
                var _model = await _db.ActividadAdicional
                    .AsNoTracking()
                     .Include(g => g.PersonalActividadAdicional)
                    .Include(f => f.AreaActividadAdicional)
                    .FirstOrDefaultAsync(e => e.ActividadAdicionalId == id);
                if (_model != null)
                {
                    //elimina las areas relacionadas en el convenio
                    foreach (AreaActividadAdicional ac in _model.AreaActividadAdicional)
                    {
                        if (ac != null)
                        {
                            var _area = await _db.AreaActividadAdicional.FirstOrDefaultAsync(e => e.AreaActividadAdicionalId == ac.AreaActividadAdicionalId);
                            if (_area != null)
                            {
                                _db.AreaActividadAdicional.Remove(_area);
                                await _db.SaveChangesAsync();
                            }
                        }
                    }
                    //Elimina personal involucrado
                    foreach (PersonalActividadAdicional adc in _model.PersonalActividadAdicional)
                    {
                        if (adc != null)
                        {
                            var _personal = await _db.PersonalActividadAdicional.FirstOrDefaultAsync(e => e.PersonalActividadAdicionalId == adc.PersonalActividadAdicionalId);
                            if (_personal != null)
                            {
                                _db.PersonalActividadAdicional.Remove(_personal);
                                await _db.SaveChangesAsync();
                            }
                        }
                    }

                    var _act = await _db.ActividadAdicional.FirstOrDefaultAsync(e => e.ActividadAdicionalId == id);
                    if (_act != null)
                    {
                        _db.ActividadAdicional.Remove(_act);
                        await _db.SaveChangesAsync();
                    }

                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public void Dispose()
        {
            _db.Dispose();
        }
    }
}
