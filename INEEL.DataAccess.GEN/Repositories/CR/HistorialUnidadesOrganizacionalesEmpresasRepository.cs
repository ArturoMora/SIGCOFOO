using INEEL.DataAccess.CR.Models;
using INEEL.DataAccess.GEN.Contexts;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class HistorialUnidadesOrganizacionalesEmpresasRepository : IDisposable
    {
        private CR_Context _db;
        public HistorialUnidadesOrganizacionalesEmpresasRepository()
        {
            _db = new CR_Context();
        }

        public async Task<HistorialUnidadesOrganizacionalesEmpresas> Create(HistorialUnidadesOrganizacionalesEmpresas model)
        {
            try
            {

                _db.HistorialUnidadesOrganizacionalesEmpresas.Add(model);
                await _db.SaveChangesAsync();
                return model;
            }catch(Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        
        public async Task CrearHistorial(UnidadOrganizacionalEmpresas _param, UnidadOrganizacionalEmpresas _valueToCompare)
        {
            try
            {
                
                if (_valueToCompare != null)
                {
                    if ( (_valueToCompare.NombreUnidad != _param.NombreUnidad)  || (_valueToCompare.padre != _param.padre)  || (_valueToCompare.ContactoId!= _param.ContactoId) )
                    {
                        var accion = "";
                        if ((_valueToCompare.NombreUnidad != _param.NombreUnidad)) { accion += "Cambio de nombre de unidad, ";
                        } else {
                            if (!String.IsNullOrEmpty(_param.comentarios))
                            {
                                _param.oldValueUnidad = _param.comentarios;
                            }
                            else
                            {
                                _param.oldValueUnidad = null;
                            }
                            
                        }

                        if ((_valueToCompare.padre != _param.padre)) { accion += "Cambio de padre, ";  } 
                        if ((_valueToCompare.ContactoId != _param.ContactoId)) { accion += "Cambio de titular, "; }
                        accion = accion.Substring(0, accion.Length - 2);
                        await Create(_param, accion);
                    }
                    
                }
                else
                {
                    await Create(_param, "Se crea una nueva unidad");
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Crea un registro en el historial de cambios de unidades organizacionales de empresas
        /// </summary>
        /// <param name="_param">La unidad a la cual se le va a crear el registro</param>
        /// <param name="_accion">La accion que origina la actualizacion de la informacion</param>
        /// <returns></returns>
        public async Task Create(UnidadOrganizacionalEmpresas _param, string _accion)
        {
            try
            {
                HistorialUnidadesOrganizacionalesEmpresas model = new HistorialUnidadesOrganizacionalesEmpresas
                {
                    nombreActualUnidad = _param.NombreUnidad,
                    nombreAnteriorUnidad = _param.oldValueUnidad,
                    nombreAnteriorUnidadPadre = _param.nombrePadre,
                    autor = _param.autor,
                    contactoId = _param.ContactoId,
                    empresaId = _param.EmpresaId,
                    claveUnidad = _param.ClaveUnidad,
                    accion = _accion,
                    claveUnidadPadre = _param.padre,
                    comentarios= _param.comentarios,
                    fecha = DateTime.Now
                };

                _db.HistorialUnidadesOrganizacionalesEmpresas.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<object>> GetAll()
        {
            try
            {

                var entities= await _db.HistorialUnidadesOrganizacionalesEmpresas.Include(e=> e.Empresa).AsNoTracking().ToListAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<object>> GetAllByEmpresa(int empresaId)
        {
            try
            {

                var entities = await _db.HistorialUnidadesOrganizacionalesEmpresas.Where(x=> x.empresaId== empresaId).AsNoTracking().ToListAsync();
                if (entities != null)
                {
                    foreach(var item in entities)
                    {
                        if (item.contactoId != null)
                        {
                            var id = Convert.ToInt32(item.contactoId);
                            item.contacto = await _db.Contacto.Where(c => c.ContactoId == id).AsNoTracking().FirstAsync();
                        }

                    }

                    var lista = entities.Select(x => new
                    {
                        x.historialId,
                        x.contactoId,
                        nombreContacto = x.contactoId != null ? x.contacto.NombreCompleto : null,
                        x.empresaId,
                        x.claveUnidad,
                        nombreUnidad = x.nombreActualUnidad,
                        x.claveUnidadPadre,
                        nombreUnidadPadre = x.nombreAnteriorUnidadPadre!=null? x.nombreAnteriorUnidadPadre : null,
                        x.fecha,
                        x.nombreAnteriorUnidad,
                        x.accion

                    }).ToList();

                    return lista;

                }

                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<object>> GetAllByUnidad(string unidadId)
        {
            try
            {

                var entities = await _db.HistorialUnidadesOrganizacionalesEmpresas.Where(x => x.claveUnidad == unidadId).AsNoTracking().ToListAsync();
                if (entities != null)
                {
                    foreach (var item in entities)
                    {
                        if (item.contactoId != null)
                        {
                            var idcontact = Convert.ToInt32(item.contactoId);
                            item.contacto = await _db.Contacto.Where(c => c.ContactoId == idcontact).AsNoTracking().FirstAsync();
                        }
                    }

                    var lista = entities.Select(x => new
                    {
                        x.historialId,
                        x.contactoId,
                        nombreContacto = x.contactoId != null ? x.contacto.NombreCompleto : null,
                        x.empresaId,
                        x.claveUnidad,
                        nombreUnidad = x.nombreActualUnidad,
                        x.claveUnidadPadre,
                        nombreUnidadPadre = x.nombreAnteriorUnidadPadre != null ? x.nombreAnteriorUnidadPadre : null,
                        x.fecha,
                        x.nombreAnteriorUnidad,
                        x.accion

                    }).ToList();

                    return lista;
                }
                
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<object> GetById(int id)
        {
            try
            {

                var entity = await _db.HistorialUnidadesOrganizacionalesEmpresas.Where(x => x.historialId == id).AsNoTracking().FirstOrDefaultAsync();
                if (entity != null)
                {
                    if (entity.contactoId != null)
                    {
                        var idcontacto = Convert.ToInt32(entity.contactoId);
                        entity.contacto = await _db.Contacto.Where(c => c.ContactoId == idcontacto).AsNoTracking().FirstAsync();
                    }
                }

                return entity;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(HistorialUnidadesOrganizacionalesEmpresas model)
        {
            try
            {

                var entity = await _db.HistorialUnidadesOrganizacionalesEmpresas.Where(x => x.historialId == model.historialId).FirstOrDefaultAsync();
                if (entity != null)
                {
                    _db.Entry(entity).CurrentValues.SetValues(model);
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
                var entity = await _db.HistorialUnidadesOrganizacionalesEmpresas.Where(x => x.historialId == id).FirstOrDefaultAsync();
                if (entity != null)
                {
                    _db.HistorialUnidadesOrganizacionalesEmpresas.Remove(entity);
                    await _db.SaveChangesAsync();
                }

            }catch(Exception e)
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
