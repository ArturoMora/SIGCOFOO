using INEEL.DataAccess.CR.Models;
using INEEL.DataAccess.GEN.Contexts;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Models.GEN;
using System.Linq.Dynamic;
using INEEL.DataAccess.GEN.Util;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class ContactosRepository : IDisposable
    {
        public void Dispose() { _db.Dispose(); }
        GEN_Context _dbGen;
        CR_Context _db;

        public ContactosRepository()
        {
            _db = new CR_Context();
            _dbGen = new GEN_Context();
        }

        public ContactosRepository(CR_Context cr)
        {
            _db = cr;
        }


        //Obtener "todos"  con ServerSide by ACH
        public async Task<IEnumerable<Contacto>> getData(DataServerSide ss)
        {
            try
            {
                var v = (from a in
                             _db.Contacto.Include(e => e.Empresa)
                             .Include(f => f.Adjunto)
                             .Include(g => g.TituloPersona)
                         select a);

                ss.recordsTotal = v.Count();
                //search         
                if (!string.IsNullOrEmpty(ss.searchValue))
                {
                    var idsContactos = await GetContactosByCollateLatin(ss.searchValue);
                    var contactoestado = await GetEstadoContactoByCollateLatin(ss.searchValue);
                    var empresasContactos = await GetEmpresasContactosByCollateLatin(ss.searchValue);
                    v = v.Where(e =>
                    e.Empresa.NombreEmpresa.Contains(ss.searchValue)
                    || idsContactos.Contains(e.ContactoId)
                    || e.Puesto.ToString().Contains(ss.searchValue)
                    || contactoestado.Contains(e.ContactoId)
                    || empresasContactos.Contains(e.ContactoId)
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

                foreach(var contact in entities)
                {
                    contact.empresas = await _db.ContactoPuestoHistorico
                                            .Include(e => e.Empresa)
                                            .Where(x => x.ContactoId == contact.ContactoId)
                                            .Select(x=> x.Empresa.NombreEmpresa)
                                            .Distinct()
                                            .AsNoTracking().ToListAsync();
                }

                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        /// <summary>
        /// PENDIENTE
        /// </summary>
        /// <returns></returns>
        public async Task<List<int>> GetEmpresasContactosByCollateLatin(String nombres)
        {
            try
            {

                var palabras = nombres.Split(' ');
                var query = "Select distinct (ContactoId) FROM [CR].[tab_ContactosPuesto] where EmpresaId in (";
                query += "Select EmpresaId from [CR].[cat_Empresas] where NombreEmpresa collate Latin1_General_CI_AI LIKE '%";
                foreach (var palabra in palabras)
                {
                    query += palabra + "%' and NombreEmpresa collate Latin1_General_CI_AI LIKE '%";
                }
                query = query.Substring(0, query.Length - 54);
                query += ")";
                var resultados = await _db.Database.SqlQuery<int>(query).ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtener todos las ids de contacto que coincidan con la busqueda
        /// </summary>
        /// <returns></returns>
        public async Task<List<int>> GetContactosByCollateLatin(String likeNombre)
        {
            try
            {

                var resultados = await _db.Database.SqlQuery<int>
                ("SELECT ContactoId FROM CR.cat_Contactos where CONCAT(NombreContacto,' ', ApellidoPaterno,' ', ApellidoMaterno) collate  Latin1_General_CI_AI LIKE '%" + likeNombre + "%'").ToListAsync();
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
        public async Task<List<int>> GetEstadoContactoByCollateLatin(String likeNombre)
        {
            try
            {

                var resultados = await _db.Database.SqlQuery<int>
                ("SELECT ContactoId FROM CR.cat_Contactos where EstadoContacto collate  Latin1_General_CI_AI LIKE '%" + likeNombre + "%' ").ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtiene todos los contactos de una empresa determinada
        /// </summary>
        /// <returns>object</returns>
        public async Task<object> GetAllByEmpresa(int id)
        {
            try
            {
                var contactos = await _db.Contacto.AsNoTracking().Where(e => e.EmpresaId == id).Include(e => e.ContactoPuestoHistorico)
                                            .Select(x => new
                                            {
                                                x.ContactoId,
                                                x.NombreContacto,
                                                x.ApellidoPaterno,
                                                x.ApellidoMaterno,
                                                x.EstadoContacto,
                                                x.Correo,
                                                x.Puesto
                                            }).ToListAsync();

                return contactos;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<Contacto>> GetContactos(HashSet<int> clavesEmpleado)
        {
            try
            {
                var _contactos = await _db.Contacto
                    .Where(e => clavesEmpleado.Contains(e.ContactoId))
                    .Include(f => f.Adjunto)
                    .Include(e => e.Empresa)
                    .AsNoTracking().ToListAsync();
                return _contactos;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<Contacto>> GetContactosCP(HashSet<int> clavesEmpleado)
        {
            try
            {
                var _contactos = await _db.Contacto
                    .Where(e => clavesEmpleado.Contains(e.ContactoId))
                    .Include(f => f.Adjunto)
                    .AsNoTracking().ToListAsync();
                return _contactos;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<Contacto> GetContactosRegistradoCP(int claveEmpleado)
        {
            try
            {
                var _contactos = await _db.Contacto
                    .Where(e => e.ContactoId == claveEmpleado)
                    .Include(f => f.Adjunto)
                    .AsNoTracking().FirstOrDefaultAsync();
                return _contactos;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<Contacto>> getDataByTrue(DataServerSide ss)
        {
            try
            {
                var v = (from a in
                             _db.Contacto.Include(e => e.Empresa)
                             .Include(f => f.Adjunto)
                             .Where(c => c.Estado == true)
                         select a);
                var listapaisesid = v.ToList().Select(e => e.PaisOrigenId);
                var listapaises = _dbGen.dbSetPais.Where(e => listapaisesid.Contains(e.PaisId)).ToList();


                ss.recordsTotal = v.Count();
                //search         
                if (!string.IsNullOrEmpty(ss.searchValue))
                {
                    var idsContactos = await GetContactosByCollateLatin(ss.searchValue);
                    var contactoestado = await GetEstadoContactoByCollateLatin(ss.searchValue);
                    v = v.Where(e =>
                    e.Empresa.NombreEmpresa.Contains(ss.searchValue)
                    || idsContactos.Contains(e.ContactoId)
                    || e.Puesto.ToString().Contains(ss.searchValue)
                    || contactoestado.Contains(e.ContactoId));

                }

                //sort
                if (!(string.IsNullOrEmpty(ss.sortColumn) && string.IsNullOrEmpty(ss.sortColumnDir)))
                {
                    //for make sort simpler we will add Syste.Linq.Dynamic reference                                             
                    v = v.OrderBy(ss.sortColumn + " " + ss.sortColumnDir);
                }

                ss.recordsFiltered = v.Count();
                var entities = await v.Skip(ss.skip).Take(ss.pageSize).AsNoTracking().ToListAsync();
                foreach (var contacto in entities)
                {
                    contacto.PaisOrigen = listapaises.Find(e => e.PaisId == contacto.PaisOrigenId);
                }
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Contacto>> getContactosUnidad(DataServerSide ss)
        {
            try
            {
                var v = (from a in
                             _db.Contacto.Include(e => e.Empresa)
                             .Include(f => f.Adjunto)
                             .Include(u => u.UnidadOrganizacionalEmpresas)
                             .Where(u => u.ClaveUnidad == ss.ClaveUnidad)
                         select a);

                ss.recordsTotal = v.Count();

                //sort
                if (!(string.IsNullOrEmpty(ss.sortColumn) && string.IsNullOrEmpty(ss.sortColumnDir)))
                {
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

        public async Task<IEnumerable<Contacto>> GetContactos()
        {
            try
            {
                var _contactos = await _db.Contacto
                    .Include(e => e.Empresa)
                    .Include(f => f.Adjunto)
                    .AsNoTracking().ToListAsync();
                return _contactos;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<Contacto>> GetContactosRaw()
        {
            try
            {
                var _empresasFks = await _db.Empresa.Where(e => e.Estado == true).AsNoTracking().Select(x => x.EmpresaId).ToListAsync();
                var _contactos = await _db.Contacto.Where(e => e.Estado == true && _empresasFks.Contains(e.EmpresaId))
                    .AsNoTracking().ToListAsync();
                return _contactos;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<ContactoExposed>> GetContactosExposed()
        {
            try
            {
                var _contactos = await this.GetContactosRaw();
                List<ContactoExposed> contactos = new List<ContactoExposed>();
                foreach (var c in _contactos)
                {
                    ContactoExposed ce = new ContactoExposed();
                    ce.Celular = c.Celular;
                    ce.ClaveUnidad = c.ClaveUnidad;
                    ce.ContactoId = c.ContactoId;
                    ce.Correo = c.Correo;
                    ce.Direccion = c.Direccion;
                    ce.EmpresaId = c.EmpresaId;
                    ce.Extension = c.Extension;
                    ce.NombreCompleto = c.NombreCompleto;
                    ce.Puesto = c.Puesto;
                    ce.Telefono = c.Telefono;

                    contactos.Add(ce);
                }

                return contactos;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Contacto> GetContacto(int Id)
        {
            try
            {
                var _contacto = await _db.Contacto
                    .Include(e => e.Empresa)
                    .Include(u => u.UnidadOrganizacionalEmpresas)
                    .Include(f => f.Adjunto)
                    .Include(p => p.Paises)
                    .Include(e => e.Estados)
                    .Include(m => m.Municipios)
                    .Include(t => t.TituloPersona)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(p => p.ContactoId == Id);
                if (_contacto != null)
                {
                    _contacto.PaisOrigen = await _dbGen.dbSetPais
                        .Where(e => e.PaisId == _contacto.PaisOrigenId).AsNoTracking().FirstOrDefaultAsync();
                }

                return _contacto;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Contacto> CreateContacto(Contacto contacto)
        {
            try
            {
                Contacto contactoRegistrado = new Contacto();

                _db.Contacto.Add(contacto);
                await _db.SaveChangesAsync();
                //Dispose();

                contactoRegistrado = contacto;

                return contactoRegistrado;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Contacto>> GetContactosModal(int id, String nombreCompleto)
        {
            try
            {
                if (id != 0)
                {
                    var entities = await _db.Contacto.AsNoTracking()
                    .Include(e => e.Empresa)
                    .Include(p => p.Paises)
                    .Include(f => f.Estados)
                    .Include(m => m.Municipios)
                    .Where(x => x.ContactoId == id)
                    .Where(x => x.Estado == true)
                    .Where(x => x.EstadoContacto == "Revisado")
                    .ToListAsync();
                    return entities;
                }
                else if (!String.IsNullOrEmpty(nombreCompleto))
                {
                    nombreCompleto = nombreCompleto.ToLower();
                    var entities = await _db.Contacto.AsNoTracking()
                    .Include(e => e.Empresa)
                    .Include(p => p.Paises)
                    .Include(f => f.Estados)
                    .Include(m => m.Municipios)
                    .Where(x => String.Concat(x.NombreContacto, " ", x.ApellidoPaterno, " ", x.ApellidoMaterno).ToLower()
                                .Contains(nombreCompleto))
                    .Where(x => x.Estado == true)
                    .Where(x => x.EstadoContacto == "Revisado")
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

        public async Task UpdateContacto(Contacto contacto)
        {
            try
            {
                var _model = await _db.Contacto
                    .Include(x => x.Adjunto)
                    .FirstOrDefaultAsync(e => e.ContactoId == contacto.ContactoId);
                if (_model != null)
                {
                    var empresaAnterior = _model.EmpresaId;
                    var unidadAnterior = _model.ClaveUnidad;
                    var puesto = _model.Puesto;

                    //Actualizacion de adjuntos
                    if (contacto.Adjunto != null)
                    {
                        if (_model.Adjunto != null && _model.Adjunto.AdjuntoId > 0)
                            contacto.Adjunto.AdjuntoId = _model.Adjunto.AdjuntoId;

                        if (contacto.Adjunto.AdjuntoId < 1)//nuevo adjunto
                        {
                            try
                            {
                                _dbGen.dbSetAdjuntos.Add(contacto.Adjunto);
                                await _dbGen.SaveChangesAsync();
                                contacto.AdjuntoId = contacto.Adjunto.AdjuntoId;
                            }
                            catch (Exception e)
                            {
                                throw new Exception(e.Message, e);
                            }
                        }
                        else
                        { //actualizar adjunto
                            var anteriorAdjunto = await _dbGen.dbSetAdjuntos.FirstOrDefaultAsync(e => e.AdjuntoId == contacto.Adjunto.AdjuntoId);
                            if (anteriorAdjunto != null)
                            {
                                _dbGen.Entry(anteriorAdjunto).CurrentValues.SetValues(contacto.Adjunto);
                                await _dbGen.SaveChangesAsync();
                            }
                        }
                    }

                    //En caso de que haya un cambio de puesto en el contacto ....
                    if (empresaAnterior!=contacto.EmpresaId || unidadAnterior!=contacto.ClaveUnidad || puesto!=contacto.Puesto)
                    {

                        

                        //Actualiza el ultimo puesto del contacto
                        await new ContactoPuestoHistoricoRepository().ActualizaUltimoPuestoContacto(Convert.ToInt32(_model.ContactoId), _model.EmpresaId);

                        //Crea un nuevo puesto en su historial
                        //ContactoPuestoHistorico nuevoPuesto = new ContactoPuestoHistorico();
                        //nuevoPuesto.ContactoId = Convert.ToInt32(_model.ContactoId);
                        //nuevoPuesto.EmpresaId = contacto.EmpresaId;
                        //nuevoPuesto.Puesto = contacto.Puesto;
                        //nuevoPuesto.FechaInicio = DateTime.Today;
                        //nuevoPuesto.ClaveUnidad = contacto.ClaveUnidad;

                        await new ContactoPuestoHistoricoRepository().ModificaPuestoContacto(Convert.ToInt32(_model.ContactoId), contacto.EmpresaId, contacto.ClaveUnidad, contacto.Puesto, "agregar");

                        //await new ContactoPuestoHistoricoRepository().Create(nuevoPuesto);
                    }

                    _db.Entry(_model).CurrentValues.SetValues(contacto);
                    await _db.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(Contacto contacto)
        {
            try
            {
                var _contacto = await _db.Contacto.FirstOrDefaultAsync(e => e.ContactoId == contacto.ContactoId);
                if (_contacto != null)
                {
                    _contacto.Estado = contacto.Estado;
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task DeleteContacto(int Id)
        {
            try
            {
                var _contacto = await _db.Contacto.FirstOrDefaultAsync(p => p.ContactoId == Id);
                if (_contacto != null)
                {
                    _db.Contacto.Remove(_contacto);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task BorrarContacto(int id)
        {
            try
            {
                var contacto = await _db.Contacto.FirstOrDefaultAsync(e => e.ContactoId == id);
                if (contacto != null)
                {
                    var aliado = await _db.Aliado.AsNoTracking().Where(e => e.ContactoId == contacto.ContactoId).CountAsync();
                    var fuente = await _db.FuenteFinanciamiento.AsNoTracking().Where(e => e.ContactoId == contacto.ContactoId).CountAsync();
                    var grupo = await _db.GrupoColegiadoPartInt.AsNoTracking().Where(e => e.ContactoId == contacto.ContactoId).CountAsync();
                    var parte = await _db.PersonaPartInt.AsNoTracking().Where(e => e.ContactoId == contacto.ContactoId).CountAsync();
                    var oportunidad = await _db.OportunidadNegocio.AsNoTracking().Where(e => e.ContactoId == contacto.ContactoId).CountAsync();
                    var convocatoria = await _db.ContactoPorConvocatoria.AsNoTracking().Where(x => x.ContactoId == contacto.ContactoId).CountAsync();
                    var titular = await _db.Empresa.AsNoTracking().Where(x => x.ContactoId == id).CountAsync();
                    if (aliado > 0 || fuente > 0 || grupo > 0 || parte > 0 || oportunidad > 0 || titular > 0)
                    {
                        var message = "El contacto tiene relaciones con";
                        if (aliado > 0)
                        {
                            message += " aliados,";
                        }
                        if (fuente > 0)
                        {
                            message += " fuentes,";
                        }
                        if(grupo > 0)
                        {
                            message += " partes interesadas,";
                        }
                        if(parte > 0)
                        {
                            message += " oportunidades de negocio,";
                        }
                        if (convocatoria > 0)
                        {
                            message += " convocatorias,";
                        }
                        if (titular > 0)
                        {
                            message += " empresas,";
                        }

                        message = message.Substring(0, message.Length - 1);
                        throw new Exception(message);
                    }
                    else
                    {
                        var puesto = await _db.ContactoPuestoHistorico.Where(e => e.ContactoId == id).ToListAsync();
                        _db.ContactoPuestoHistorico.RemoveRange(puesto);
                        _db.Contacto.Remove(contacto);
                        await _db.SaveChangesAsync();
                    }

                }
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
                var _contactos = await _db.Contacto.AsNoTracking()
                    .Where(x => x.NombreContacto.ToLower().Contains(search.Cadena))
                    .OrderBy(x => x.NombreContacto)
                    .Select(x => new SelectModel { Clave = x.ContactoId.ToString(), Nombre = x.NombreContacto + " " + x.ApellidoPaterno + " " + x.ApellidoMaterno })
                    .ToListAsync();
                return _contactos;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
    }
}
