using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Models.GEN;
using System.Linq.Dynamic;
using System.Runtime.Remoting.Metadata.W3cXsd2001;
using INEEL.DataAccess.GEN.Util;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class EmpresasRepository : IDisposable
    {
        CR_Context _db;
        GEN_Context _dbGen;

        public EmpresasRepository()
        {
            _db = new CR_Context();
            _dbGen = new GEN_Context();
        }

        public EmpresasRepository(CR_Context crcontext)
        {
            _db = crcontext;
        }

        public void Dispose()
        {
            _db.Dispose();

            try { _dbGen.Dispose(); } catch (Exception e) { }
        }
        public async Task<Empresa> GetEmpresaRaw(int Id)
        {
            try
            {

                var empresa = await _db.Empresa
                    .AsNoTracking()
                    .FirstOrDefaultAsync(p => p.EmpresaId == Id);
                return empresa;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<UnidadOrganizacionalEmpresas> GetUnidadOrganizacionalEmpresasById(String id)
        {
            try
            {

                UnidadOrganizacionalEmpresasRepository uoe = new UnidadOrganizacionalEmpresasRepository(_db);
                return await uoe.GetById(id);

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<Empresa>> getDataComun(DataServerSide ss)
        {
            try
            {
                var v = (from a in
                             _db.Empresa
                         select a);

                ss.recordsTotal = v.Count();
                //search         
                if (!string.IsNullOrEmpty(ss.searchValue))
                {
                    v = v.Where(e =>
                    e.NombreEmpresa.Contains(ss.searchValue)
                    || e.NombreTitular.ToString().Contains(ss.searchValue)
                    || e.RazonSocial.ToString().Contains(ss.searchValue));
                }

                //sort
                if (!(string.IsNullOrEmpty(ss.sortColumn) && string.IsNullOrEmpty(ss.sortColumnDir)))
                {
                    //for make sort simpler we will add Syste.Linq.Dynamic reference                                             
                    v = v.OrderBy(ss.sortColumn + " " + ss.sortColumnDir);
                }

                ss.recordsFiltered = v.Count();
                var entities = await v.Skip(ss.skip).Take(ss.pageSize).AsNoTracking().ToListAsync();

                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<Empresa>> getData(DataServerSide ss)
        {
            try
            {
                var v = (from a in
                             _db.Empresa.Include(f => f.Adjunto)
                         select a);

                ss.recordsTotal = v.Count();
                //search         
                if (!string.IsNullOrEmpty(ss.searchValue))
                {
                    v = v.Where(e =>
                    e.NombreEmpresa.Contains(ss.searchValue)
                    || e.NombreTitular.ToString().Contains(ss.searchValue)
                    || e.RazonSocial.ToString().Contains(ss.searchValue)
                    );
                }

                //sort
                if (!(string.IsNullOrEmpty(ss.sortColumn) && string.IsNullOrEmpty(ss.sortColumnDir)))
                {
                    //for make sort simpler we will add Syste.Linq.Dynamic reference                                             
                    v = v.OrderBy(ss.sortColumn + " " + ss.sortColumnDir);
                }

                ss.recordsFiltered = v.Count();
                var entities = await v.Skip(ss.skip).Take(ss.pageSize).AsNoTracking().ToListAsync();

                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Empresa>> getDataForModal(DataServerSide ss)
        {
            try
            {
                var v = (from a in
                             _db.Empresa
                         where a.Estado==true
                         select a);

                ss.recordsTotal = v.Count();
                //search         
                if (!string.IsNullOrEmpty(ss.searchValue))
                {
                    v = v.Where(e =>
                    e.NombreEmpresa.Contains(ss.searchValue)
                    || e.NombreTitular.ToString().Contains(ss.searchValue)
                    || e.RazonSocial.ToString().Contains(ss.searchValue));
                }

                //sort
                if (!(string.IsNullOrEmpty(ss.sortColumn) && string.IsNullOrEmpty(ss.sortColumnDir)))
                {
                    //for make sort simpler we will add Syste.Linq.Dynamic reference                                             
                    v = v.OrderBy(ss.sortColumn + " " + ss.sortColumnDir);
                }

                ss.recordsFiltered = v.Count();
                var entities = await v.Skip(ss.skip).Take(ss.pageSize).AsNoTracking().ToListAsync();

                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<SelectModel>> GetAllForSelect(Body search)
        {
            try
            {
                var _empresas = await _db.Empresa.AsNoTracking()
                    .Where(x => x.NombreEmpresa.ToLower().Contains(search.Cadena))
                    .OrderBy(x => x.NombreEmpresa)
                    .Select(x => new SelectModel { Clave = x.EmpresaId.ToString(), Nombre = x.NombreEmpresa })
                    .Skip(0).Take(search.Numero).ToListAsync();
                return _empresas;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Object> GetDatosForModalEmpresa(int id)
        {
            try
            {
                var empresa = await _db.Empresa.Where(e => e.EmpresaId == id)
                                                .Include(e => e.TipoOrganizacion)
                                                .Include(e => e.Paises)
                                                .Include(e => e.Estados)
                                                .Include(e => e.Municipios)
                                                .Select(x => new
                                                {
                                                    x.EmpresaId,
                                                    x.NombreEmpresa,
                                                    x.Descripcion,
                                                    x.NombreTitular,
                                                    x.Puesto,
                                                    x.Telefono,
                                                    x.Ext,
                                                    x.Correo,
                                                    x.SitioWeb,
                                                    x.TipoOrganizacion.Nombre,
                                                    x.Calle,
                                                    x.Colonia,
                                                    x.CP,
                                                    x.Paises.NombrePais,
                                                    x.Estados.NombreEstado,
                                                    x.Municipios.NombreMunicipio
                                                })
                                                .AsNoTracking().FirstOrDefaultAsync();
                return empresa;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Empresa>> GetEmpresas()
        {
            try
            {
                var _empresas = await _db.Empresa.AsNoTracking().ToListAsync();
                return _empresas;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Devuelve los nombre de empresas que tienen alguna relacion con un fondo o programa
        public async Task<IEnumerable<Object>> GetNombresEmpresa()
        {
            try
            {
                //lista de empresas asociadas a los fondos
                var listaFksEmpresas = await (from fp in _db.FondoPrograma select fp.EmpresaId).ToListAsync();

                var empresas = await (from em in _db.Empresa
                                      where em.Estado == true && listaFksEmpresas.Contains(em.EmpresaId)
                                      select new
                                      {
                                          nombreEmpresa = em.NombreEmpresa,
                                          idEmpresa = em.EmpresaId
                                      }).AsNoTracking().ToListAsync();
                return empresas;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Devuelve los nombre de empresas que tienen alguna relacion con las fks de la lista
        /// </summary>
        /// <returns>List<int></returns>
        public async Task<IEnumerable<Object>> GetEmpresasByCollectionFKs(List<int> lista)
        {
            try
            {
                var empresas = await (from em in _db.Empresa
                                      where em.Estado == true && lista.Contains(em.EmpresaId)
                                      select new
                                      {
                                          nombreEmpresa = em.NombreEmpresa,
                                          idEmpresa = em.EmpresaId
                                      }).AsNoTracking().ToListAsync();
                return empresas;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Devuelve los nombre de empresas que tienen alguna relacion con las fks de la lista
        /// </summary>
        /// <returns>List<int?></returns>
        public async Task<IEnumerable<Object>> GetEmpresasByCollectionFKs(List<int?> lista)
        {
            try
            {
                var empresas = await (from em in _db.Empresa
                                      where em.Estado == true && lista.Contains(em.EmpresaId)
                                      select new
                                      {
                                          nombreEmpresa = em.NombreEmpresa,
                                          idEmpresa = em.EmpresaId
                                      }).AsNoTracking().ToListAsync();
                return empresas;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<List<Empresa>> GetAllCollection(List<int> list)
        {
            try
            {
                var _empresas = await _db.Empresa.AsNoTracking()
                    .Where(x => list.Contains(x.EmpresaId))
                    .ToListAsync();
                return _empresas;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Object> GetEmpresasForAliados()
        {
            try
            {
                var listaAliados = await _db.Aliado.Select(e => e.EmpresaId).ToListAsync();
                var listaEmpresas = await _db.Empresa.Where(e => e.Estado == true && !listaAliados.Contains(e.EmpresaId)).Include(e => e.TipoOrganizacion).AsNoTracking().ToListAsync();

                return listaEmpresas;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<EmpresaSigProy>> GetEmpresasValidadas()
        {
            try
            {
                var _empresas = await _db.Empresa

                    .Where(e => e.Estado == true)
                    .Include(e => e.Paises)
                    .Include(e => e.Estados)
                    .Include(e => e.Municipios)
                    .OrderBy(e => e.NombreEmpresa)
                    .Select(x => new EmpresaSigProy
                    {
                        NombreEmpresa = x.NombreEmpresa,
                        NombreTitular = x.NombreTitular,
                        Puesto = x.Puesto,
                        Telefono = x.Telefono,
                        Correo = x.Correo,
                        Direccion = String.Concat(
                             String.IsNullOrEmpty(x.Calle) ? "" : x.Calle + ",",
                             String.IsNullOrEmpty(x.Colonia) ? "" : " " + x.Colonia + ",",
                             String.IsNullOrEmpty(x.Localidad) ? "" : " " + x.Localidad + ",",
                             String.IsNullOrEmpty(x.Municipios.NombreMunicipio) ? "" : " " + x.Municipios.NombreMunicipio + ",",
                             String.IsNullOrEmpty(x.Estados.NombreEstado) ? "" : " " + x.Estados.NombreEstado + ",",
                             String.IsNullOrEmpty(x.CP) ? "" : " " + x.CP + ",",
                             String.IsNullOrEmpty(x.Paises.NombrePais) ? "" : " " + x.Paises.NombrePais
                             ).Trim(),
                        Fecha = x.FechaRegistro,
                        ClaveEmpresa = x.ClaveEmpresa,
                        EmpresaId = x.EmpresaId
                    })
                    .AsNoTracking()
                    .ToListAsync();

                return _empresas;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<List<Paises>> GetPaises(List<int?> paises)
        {
            var result = await _dbGen.dbSetPais.AsNoTracking()
                .Where(x => paises.Contains(x.PaisId))
                .ToListAsync();
            return result;
        }
        public async Task<List<Estados>> GetEstados(List<int?> estados)
        {
            var result = await _dbGen.dbSetEstado.AsNoTracking()
                .Where(x => estados.Contains(x.EstadoId))
                .ToListAsync();
            return result;
        }
        public async Task<List<Municipios>> GetMunicipios(List<int?> municipios)
        {
            var result = await _dbGen.dbSetMunicipio.AsNoTracking()
                .Where(x => municipios.Contains(x.MunicipioId))
                .ToListAsync();
            return result;
        }

        public async Task<Object> GetEmpresasForModalCompetidores()
        {
            try
            {
                var competidores = await _db.Competidor.AsNoTracking().Select(e => e.EmpresaId).ToListAsync();
                var empresas = await _db.Empresa.Where(e => !competidores.Contains(e.EmpresaId)).AsNoTracking()
                .Select(x => new
                {
                    x.EmpresaId,
                    x.NombreEmpresa,
                    x.NombreTitular
                }).ToListAsync();

                return empresas;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        //Exposed
        public async Task<Object> GetEmpresasUnidades()  //DEPRECATED
        {
            //UnidadOrganizacionalEmpresas tiene Empresa
            //    Empresa
            //    Contacto tiene empresa y UnidadOrganizacionalEmpresas
            var contactos = await _db.Contacto.AsNoTracking()

                .Where(x => x.Empresa.Estado == true)
                .ToListAsync();


            var empresas = await this.GetEmpresasValidadas();

            List<int> empresasID = empresas.Select(x => x.EmpresaId).ToList<int>();


            var fechaActual = DateTime.Now;


            var unidades = (from uni in _db.UnidadOrganizacionalEmpresas
                            where (empresasID.Contains(uni.EmpresaId) && uni.FechaEfectiva == _db.UnidadOrganizacionalEmpresas.Where(
                                                                        p => p.FechaEfectiva <= fechaActual
                                                                        && p.ClaveUnidad == uni.ClaveUnidad
                                                                        ).Max(e => e.FechaEfectiva))
                            select new UnidadOrganizacionalEmpresasExposed
                            {
                                Calle = uni.Calle,
                                ClaveUnidad = uni.ClaveUnidad
                            ,
                                Colonia = uni.Colonia,
                                CP = uni.CP,
                                EmpresaId = uni.EmpresaId,
                                EstadoRegistro = uni.Estado
                            ,
                                EstadoId = uni.EstadoId,
                                EstadoNombre = uni.Edo,
                                FechaEfectiva = uni.FechaEfectiva,
                                MunicipioNombre = uni.Munipio,
                                MunipioId = uni.MunicipioId,
                                NombreTitular = uni.NombreTitular
                            ,
                                NombreUnidad = uni.NombreUnidad,
                                padre = uni.padre,
                                PaisId = uni.PaisId,
                                Telefono = uni.Telefono
                            }
                                                                              ).ToList();


            var paises = await this.GetPaises(unidades.Select(x => x.PaisId).ToList());
            var estados = await this.GetEstados(unidades.Select(x => x.EstadoId).ToList());
            var municipios = await this.GetMunicipios(unidades.Select(x => x.MunipioId).ToList());

            foreach (var r in empresas)
            {
                r.unidadesExposed = unidades.FindAll(x => x.EmpresaId == r.EmpresaId);
                if (r.unidadesExposed != null)
                {

                    foreach (var u in r.unidadesExposed)
                    {
                        var pais = paises.Find(x => x.PaisId == intNullable2int(u.PaisId));
                        if (pais != null)
                        {
                            u.PaisNombre = pais.NombrePais;
                            if (intNullable2int(u.PaisId) == 16) //16 is mexico
                            {

                                var estado = estados.Find(x => x.EstadoId == intNullable2int(u.EstadoId));
                                if (estado != null)
                                {
                                    u.EstadoNombre = estado.NombreEstado;
                                }

                                ///
                                var municipio = municipios.Find(x => x.MunicipioId == intNullable2int(u.MunipioId));
                                if (municipio != null)
                                {
                                    u.MunicipioNombre = municipio.NombreMunicipio;
                                }
                                //

                            }
                        }
                    }

                }
            }

            return empresas;
        }

        //Servicio de solo consulta por SIGPROY
        public async Task<Object> ExposedEmpresasUnidades()
        {
            var empresas = await GetEmpresasValidadas();
            var idEmpresas = empresas.Select(x => x.EmpresaId).ToList();

            var unidades = await (from uni in _db.UnidadOrganizacionalEmpresas
                                  where idEmpresas.Contains(uni.EmpresaId) && uni.Estado == 1
                                  select new UnidadOrganizacionalEmpresasExposed
                                  {
                                      Calle = uni.Calle,
                                      ClaveUnidad = uni.ClaveUnidad
                                  ,
                                      Colonia = uni.Colonia,
                                      CP = uni.CP,
                                      EmpresaId = uni.EmpresaId,
                                      EstadoRegistro = uni.Estado
                                  ,
                                      EstadoId = uni.EstadoId,
                                      EstadoNombre = uni.Edo,
                                      FechaEfectiva = uni.FechaEfectiva,
                                      MunicipioNombre = uni.Munipio,
                                      MunipioId = uni.MunicipioId,
                                      NombreTitular = uni.NombreTitular
                                  ,
                                      NombreUnidad = uni.NombreUnidad,
                                      padre = uni.padre,
                                      PaisId = uni.PaisId,
                                      Telefono = uni.Telefono
                                  }).AsNoTracking().ToListAsync();

            var paises = await this.GetPaises(unidades.Select(x => x.PaisId).ToList());
            var estados = await this.GetEstados(unidades.Select(x => x.EstadoId).ToList());
            var municipios = await this.GetMunicipios(unidades.Select(x => x.MunipioId).ToList());

            foreach (var objempresa in empresas)
            {
                objempresa.unidadesExposed = unidades.Where(e => e.EmpresaId == objempresa.EmpresaId).ToList();
                if (objempresa.unidadesExposed != null)
                {

                    foreach (var unid in objempresa.unidadesExposed)
                    {
                        var pais = paises.Find(x => x.PaisId == intNullable2int(unid.PaisId));
                        if (pais != null)
                        {
                            unid.PaisNombre = pais.NombrePais;
                            if (intNullable2int(unid.PaisId) == 16) //16 es mexico
                            {

                                var estado = estados.Find(x => x.EstadoId == intNullable2int(unid.EstadoId));
                                if (estado != null)
                                {
                                    unid.EstadoNombre = estado.NombreEstado;
                                }

                                ///
                                var municipio = municipios.Find(x => x.MunicipioId == intNullable2int(unid.MunipioId));
                                if (municipio != null)
                                {
                                    unid.MunicipioNombre = municipio.NombreMunicipio;
                                }
                                //

                            }
                        }
                    }

                }
            }

            return empresas;
        }


        private int intNullable2int(int? n)
        {
            int result = 0;
            try
            {
                result = n.Value;
            }
            catch (Exception e) { }
            return result;
        }


        public async Task<IEnumerable<Empresa>> GetEmpresasByTrue()
        {
            try
            {
                var _empresas = await _db.Empresa
                    .AsNoTracking()
                    .Where(e => e.Estado == true)
                    .OrderBy(e => e.NombreEmpresa)
                    .ToListAsync();
                return _empresas;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Empresa>> GetEmpresasModal(int id, String nombreCompleto)
        {
            try
            {
                if (id != 0)
                {
                    var entities = await _db.Empresa
                    .Include(e => e.Estados)
                    .Include(m => m.Municipios)
                    .Include(o => o.TipoOrganizacion)
                    .AsNoTracking()
                    .Where(x => x.EmpresaId == id)
                    .Where(x => x.Estado == true)
                    .ToListAsync();
                    return entities;
                }
                else if (!String.IsNullOrEmpty(nombreCompleto))
                {
                    nombreCompleto = nombreCompleto.ToLower();
                    var entities = await _db.Empresa
                         .Include(o => o.TipoOrganizacion)
                    .Include(e => e.Estados)
                    .Include(m => m.Municipios)
                    .AsNoTracking()
                    .Where(x => x.NombreEmpresa.ToLower()
                                .Contains(nombreCompleto))
                    .Where(x => x.Estado == true)
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

        /// <summary>
        /// Retorna los datos de la empresa solicitada (junto con todas sus llaves foraneas)
        /// </summary>
        /// <param name="Id">id de la empresa a buscar</param>
        /// <returns></returns>
        public async Task<Empresa> GetEmpresa(int Id)
        {
            try
            {
                var empresa = await _db.Empresa
                    .Include(f => f.Adjunto)
                    .Include(p => p.Paises)
                    .Include(e => e.Estados)
                    .Include(m => m.Municipios)
                    .Include(pr => pr.PaisesRS)
                    .Include(er => er.EstadosRS)
                    .Include(mr => mr.MunicipiosRS)
                    .Include(t => t.TipoOrganizacion)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(p => p.EmpresaId == Id);
                if (empresa.ContactoId != null)
                {
                    empresa.contacto = await new ContactosRepository().GetContacto(Convert.ToInt32(empresa.ContactoId));
                }

                return empresa;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Empresa> CreateEmpresa(Empresa empresa)
        {
            try
            {
                if (!empresa.ExisteEn(_db.Empresa.Select(e => e.NombreEmpresa).ToList(), "NombreEmpresa"))
                {
                    Empresa empresaRegistrada = new Empresa();
                    _db.Empresa.Add(empresa);
                    await _db.SaveChangesAsync();

                    empresaRegistrada = empresa;
                    return empresaRegistrada;
                }
                else
                {
                    throw new ApplicationException("Ya existe un registro con ese nombre.");
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEmpresa(Empresa empresa)
        {
            try
            {
                var _model = await _db.Empresa
                .Include(x => x.Adjunto)
                .FirstOrDefaultAsync(e => e.EmpresaId == empresa.EmpresaId);

                if (_model != null)
                {
                    string viejoNombre = _model.NombreEmpresa;
                    var contactoId = _model.ContactoId;
                    if (empresa.Adjunto != null)
                    {
                        if (_model.Adjunto != null && _model.Adjunto.AdjuntoId > 0)
                            empresa.Adjunto.AdjuntoId = _model.Adjunto.AdjuntoId;

                        if (empresa.Adjunto.AdjuntoId < 1)//nuevo adjunto
                        {
                            try
                            {
                                _dbGen.dbSetAdjuntos.Add(empresa.Adjunto);
                                await _dbGen.SaveChangesAsync();
                                empresa.AdjuntoId = empresa.Adjunto.AdjuntoId;
                            }
                            catch (Exception e)
                            {
                                throw new Exception(e.Message, e);
                            }
                        }
                        else
                        { //actualizar adjunto
                            var anteriorAdjunto = await _dbGen.dbSetAdjuntos.FirstOrDefaultAsync(e => e.AdjuntoId == empresa.Adjunto.AdjuntoId);

                            if (anteriorAdjunto != null)
                            {
                                _dbGen.Entry(anteriorAdjunto).CurrentValues.SetValues(empresa.Adjunto);
                                await _dbGen.SaveChangesAsync();
                            }
                        }
                    }

                    _db.Entry(_model).CurrentValues.SetValues(empresa);
                    await _db.SaveChangesAsync();

                    if (!viejoNombre.Equals(_model.NombreEmpresa))  //Actualizamos la miga de pan de sus unidades organizacionales asociadas
                    {
                        var unidadesOrganizacionales = await _db.UnidadOrganizacionalEmpresas.Where(x => x.EmpresaId == empresa.EmpresaId && x.padre == null).AsNoTracking().ToListAsync();
                        if (unidadesOrganizacionales.Count > 0)
                        {
                            foreach (var unidad in unidadesOrganizacionales)
                            {
                                new UnidadOrganizacionalEmpresasRepository().ActualizaMigasDePanRamas(unidad.ClaveUnidad.Trim(), _model.NombreEmpresa, unidad.CampoAgrupador);
                            }
                        }
                    }

                    if (contactoId != empresa.ContactoId)  //En caso de que se agreguen o se eliminen contactos como titulares
                    {
                        await ActualizaPuestosContactos(contactoId, empresa);
                    }

                }
                else
                {
                    throw new ApplicationException("Ya existe un registro con ese nombre.");
                }


            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }

        }

        public async Task ActualizaPuestosContactos(int? idcontacto, Empresa empresa)
        {
            try
            {

                var contactoNuevo = await _db.Contacto.Where(x => x.ContactoId == empresa.ContactoId).FirstOrDefaultAsync();
                if (contactoNuevo != null)
                {
                    //Al nuevo contacto se le modifica la fecha de termino de su ultimo puesto 
                    await new ContactoPuestoHistoricoRepository().ActualizaUltimoPuestoContacto(Convert.ToInt32(contactoNuevo.ContactoId), empresa.EmpresaId);

                    //Se actualiza la referencia del puesto al contacto (en la tab de empresas se tiene referencia a este contacto)
                    contactoNuevo.EmpresaId = empresa.EmpresaId;
                    contactoNuevo.ClaveUnidad = null;
                    contactoNuevo.Puesto = empresa.Puesto;
                    await _db.SaveChangesAsync();

                    //Crea un nuevo puesto en su historial
                    ContactoPuestoHistorico puesto = new ContactoPuestoHistorico();
                    puesto.ContactoId = Convert.ToInt32(contactoNuevo.ContactoId);
                    puesto.EmpresaId = empresa.EmpresaId;
                    puesto.Puesto = contactoNuevo.Puesto;
                    puesto.FechaInicio = DateTime.Today;

                    await new ContactoPuestoHistoricoRepository().Create(puesto);
                }
                if (idcontacto != null)  //Al contacto anterior se le modifica la fecha de su ultimo puesto
                {
                    var contactoViejo = await _db.Contacto.Where(x => x.ContactoId == idcontacto).FirstOrDefaultAsync();  //Se le quita el puesto que tenia de la tabla de empresas
                    if (contactoViejo != null)
                    {
                        contactoViejo.Puesto = null;
                        await _db.SaveChangesAsync();
                    }
                    await new ContactoPuestoHistoricoRepository().ActualizaUltimoPuestoContacto(Convert.ToInt32(idcontacto), empresa.EmpresaId);
                }


            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task UpdateEstado(Empresa empresa)
        {
            try
            {
                var _empresa = await _db.Empresa.FirstOrDefaultAsync(e => e.EmpresaId == empresa.EmpresaId);
                if (_empresa != null)
                {
                    _empresa.Estado = empresa.Estado;
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task DeleteEmpresa(int Id)
        {
            try
            {
                var _empresa = await _db.Empresa.FirstOrDefaultAsync(p => p.EmpresaId == Id);
                if (_empresa != null)
                {
                    _db.Empresa.Remove(_empresa);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Empresa> GetEmpresaWithImagen(int id)
        {
            try
            {
                var empresa = await _db.Empresa
                    .Include(e => e.Adjunto)
                    .Include(e => e.Paises)
                    .Include(e => e.Estados)
                    .Include(e => e.Municipios)
                    .Include(e => e.TipoOrganizacion)
                    .FirstOrDefaultAsync(e => e.EmpresaId == id);
                try
                {
                    var archivo = empresa.Adjunto.RutaCompleta;
                    Byte[] bytes = File.ReadAllBytes(archivo);
                    String file = Convert.ToBase64String(bytes);
                    empresa.Adjunto64 = file;
                }
                catch (Exception e)
                {
                    empresa.Adjunto64 = null;
                }
                return empresa;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Empresa> GetEmpresa(string Id)
        {
            try
            {
                var empresa = await _db.Empresa
                    .AsNoTracking()
                    .FirstOrDefaultAsync(p => p.NombreEmpresa.Contains(Id));
                return empresa;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<List<int>> GetClavesByLikeNombre(string nameLike)
        {
            try
            {
                var entities = await _db.Empresa.AsNoTracking()
                    .Where(e => e.NombreEmpresa.Contains(nameLike))
                    .Select(e => e.EmpresaId)
                    .ToListAsync();

                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
    }
}
