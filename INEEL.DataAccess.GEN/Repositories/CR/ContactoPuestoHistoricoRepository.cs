using INEEL.DataAccess.CR.Models;
using INEEL.DataAccess.GEN.Contexts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class ContactoPuestoHistoricoRepository : IDisposable { public void Dispose(){ _db.Dispose();}
        CR_Context _db;

        public ContactoPuestoHistoricoRepository()
        {
            _db = new CR_Context();
        }



        public async Task<IEnumerable<ContactoPuestoHistorico>> Get(int Id)
        {
            try
            {
                var _contactoPuesto = await _db.ContactoPuestoHistorico
                    .Include(e => e.Empresa)
                    .AsNoTracking().Where(x => x.ContactoId == Id)
                    .ToListAsync();

                foreach(var puesto in _contactoPuesto)
                {
                    if (puesto.ClaveUnidad != null)
                    {
                        puesto.Unidad = await _db.UnidadOrganizacionalEmpresas.AsNoTracking().FirstOrDefaultAsync(x => x.ClaveUnidad == puesto.ClaveUnidad);
                    }
                }

                return _contactoPuesto;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<ContactoPuestoHistorico> GetPuestoContacto(int id)
        {
            try
            {
                var _puestoContacto = await _db.ContactoPuestoHistorico
                    .Include(e => e.Empresa)
                    .AsNoTracking().FirstOrDefaultAsync(p => p.ContactoPuestoHistoricoId == id);

                if (_puestoContacto.ClaveUnidad != null)
                {
                    _puestoContacto.Unidad = await _db.UnidadOrganizacionalEmpresas.AsNoTracking().FirstOrDefaultAsync(x => x.ClaveUnidad == _puestoContacto.ClaveUnidad);
                }

                return _puestoContacto;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(ContactoPuestoHistorico contactoPuesto)
        {
            try
            {
                _db.ContactoPuestoHistorico.Add(contactoPuesto);
                await _db.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Crea un nuevo puesto del contacto
        /// </summary>
        /// <param name="contactoId"></param>
        /// <param name="empresaId"></param>
        /// <param name="claveEmpresaId"></param>
        /// <param name="puesto"></param>
        /// <returns></returns>
        public async Task ModificaPuestoContacto(int contactoId, int empresaId, string claveEmpresaId, string puesto, string accion)
        {
            try
            {
                var contacto = await _db.Contacto.Where(x => x.ContactoId == contactoId).FirstOrDefaultAsync();
                if (contacto != null)
                {
                    if (!accion.Equals("actualizar"))
                    {
                        contacto.EmpresaId = empresaId;
                    }
                    contacto.ClaveUnidad = claveEmpresaId;
                    contacto.Puesto = puesto;

                    await _db.SaveChangesAsync();

                    if (accion.Equals("agregar"))
                    {
                        ContactoPuestoHistorico nuevoPuesto = new ContactoPuestoHistorico();
                        nuevoPuesto.ContactoId = contacto.ContactoId;
                        nuevoPuesto.EmpresaId = contacto.EmpresaId;
                        nuevoPuesto.Puesto = contacto.Puesto;
                        nuevoPuesto.FechaInicio = DateTime.Now;
                        nuevoPuesto.ClaveUnidad = contacto.ClaveUnidad;

                        await Create(nuevoPuesto);
                    }

                    if (accion.Equals("actualizar"))
                    {
                        var ultimopuesto = await _db.ContactoPuestoHistorico.Where(x => x.ContactoId == contactoId && x.EmpresaId == empresaId).OrderByDescending(x => x.FechaInicio).FirstOrDefaultAsync();
                        if (ultimopuesto != null)
                        {
                            ultimopuesto.FechaFinal = DateTime.Now;
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

        /// <summary>
        /// Actualiza el perfil de un contacto, de acuerdo a una empresa en especifico
        /// </summary>
        /// <param name="idcontacto">id del contacto</param>
        /// <param name="idempresa">id de la empresa</param>
        /// <returns></returns>
        public async Task ActualizaUltimoPuestoContacto(int idcontacto, int idempresa)
        {
            try
            {
                var ultimopuesto = await _db.ContactoPuestoHistorico.Where(x => x.ContactoId == idcontacto && x.EmpresaId== idempresa).OrderByDescending(x => x.FechaInicio).FirstOrDefaultAsync();
                if (ultimopuesto != null)
                {
                    ultimopuesto.FechaFinal = DateTime.Now;
                    await _db.SaveChangesAsync();
                }
            }
            catch(Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(ContactoPuestoHistorico contactoPuesto)
        {
            try
            {
                var _contactoPuesto = await _db.ContactoPuestoHistorico
                    .FirstOrDefaultAsync(c => c.ContactoPuestoHistoricoId == contactoPuesto.ContactoPuestoHistoricoId);
                if (_contactoPuesto != null)
                {
                    _db.Entry(_contactoPuesto).CurrentValues.SetValues(contactoPuesto);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Delete(int Id)
        {
            try
            {
                var _contactoPuesto = await _db.ContactoPuestoHistorico.FirstOrDefaultAsync(c => c.ContactoPuestoHistoricoId == Id);
                if (_contactoPuesto != null)
                {
                    _db.ContactoPuestoHistorico.Remove(_contactoPuesto);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
    }
}
