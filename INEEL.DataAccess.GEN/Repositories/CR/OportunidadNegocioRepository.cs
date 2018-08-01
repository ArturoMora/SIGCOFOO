using INEEL.DataAccess.CR.Models;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CR;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Util;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class OportunidadNegocioRepository : IDisposable { public void Dispose(){ _db.Dispose();}
        private CR_Context _db;
        private GEN_Context _dbGEN;

        public OportunidadNegocioRepository()
        {
            _db = new CR_Context();
            _dbGEN = new GEN_Context();

        }


        public async Task<int> countByStatus(int EstadoFlujoONId, int EstadoONId)
        {
            try
            {

                return await (from t in _db.OportunidadNegocio
                               .Where(f => f.EstadoONId == EstadoONId && f.EstadoFlujoONId== EstadoFlujoONId)
                              select t).CountAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<EstadoON>> getEstadosON()
        {
            try
            {
                var _estados = await _db.EstadoON
                    .AsNoTracking()
                    .Where(s => s.Estado == true)
                    .ToListAsync();
//Dispose();
                return _estados;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<EstadoON>> getEstadosONById(int Id)
        {
            try
            {
                var _estados = await _db.EstadoON
                    .AsNoTracking()
                    .Where(s => s.Estado == true)
                    .Where(id => id.EstadoONId == Id)
                    .ToListAsync();
//Dispose();
                return _estados;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<OportunidadNegocio>> getOportunidadesAsociados(int Id)
        {
            try
            {
                var _oportunidadesAsociadas = await _db.OportunidadNegocio
                    .AsNoTracking()
                    .Include(c => c.Contacto)
                    .Where(p => p.empresaId == Id)
                    .ToListAsync();

                return _oportunidadesAsociadas;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<TipoEventoON>> getTipoEventos()
        {
            try
            {
                var _tipoEventos = await _db.TiposEventos
                    .AsNoTracking()
                    .Where(t => t.Estado == true)
                    .ToListAsync();
//Dispose();

                return _tipoEventos;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Eventos>> getEventos(int Id)
        {
            try
            {
                var _eventos = await _db.Eventos
                    .AsNoTracking()
                    .Where(e => e.Estado == true)
                    .Where(on => on.TipoEventoONId == Id)
                    .ToListAsync();
//Dispose();

                return _eventos;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<OportunidadNegocio>> getAll()
        {
            try
            {
                var _oportunidadNegocios = await _db.OportunidadNegocio
                    .Include(c => c.Contacto)
                    .Include(f => f.Contacto.Adjunto)
                    .Include(e => e.Evento)
                    .Include(em => em.Empresa)
                    .Include(s=> s.EstadoFlujoON)
                    .Include(S=> S.EstadoON)
                    .AsNoTracking().ToListAsync();
//Dispose();
                return _oportunidadNegocios;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<OportunidadNegocio>> getBySeguimiento(string Id)
        {
            try
            {
                List<int> idFlujo = new List<int>();
                idFlujo.Add(1);
                idFlujo.Add(2);
                idFlujo.Add(3);
                idFlujo.Add(4);

                var _oportunidadNegocios = await _db.OportunidadNegocio
                    .Include(e => e.EstadoFlujoON)
                    .Include(eo => eo.EstadoON)
                    .Where(eo => eo.Investigador == Id && eo.EstadoFlujoONId != 7 && idFlujo.Contains(eo.EstadoONId.Value))
                    //.Where(eo => eo.ClaveEmpleado == Id && eo.EstadoFlujoONId != 7 && idFlujo.Contains(eo.EstadoONId.Value))
                    .AsNoTracking().ToListAsync();
//Dispose();
                return _oportunidadNegocios;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<OportunidadNegocio>> getOportunidadesPorAsignarAInvestigador(string claveUnidad) //Cuando el gerente o director divisional tiene Ons por asignar
        {
            try
            {
                var _oportunidadNegocios = await _db.OportunidadNegocio
          //      .Include(c => c.Contacto)
          //      .Include(f => f.Contacto.Adjunto)
          //      .Include(e => e.Evento)
                .Include(em => em.Empresa)
                .Include(s => s.EstadoFlujoON)
                .Where(a => a.ClaveUnidad == claveUnidad && (a.EstadoFlujoONId == 5|| a.EstadoFlujoONId == 11))

                .AsNoTracking().ToListAsync();
//Dispose();
                return _oportunidadNegocios;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<OportunidadNegocio>> getOportunidadesPorAsignar(string asignadoA)  //Cuando el administrador va a asignar una ON a un especialista
        {
            try
            {
                var _oportunidadNegocios = await _db.OportunidadNegocio
                //.Include(c => c.Contacto)
                //.Include(f => f.Contacto.Adjunto)
                //.Include(e => e.Evento)
                .Include(em => em.Empresa)
                .Include(s => s.EstadoFlujoON)
                .Where(o=> o.EstadoFlujoONId == 4 || o.EstadoFlujoONId == 13)
                .Where(a => a.Investigador == null && a.Especialista == null && a.Responsable == null)

                .AsNoTracking().ToListAsync();
//Dispose();
                return _oportunidadNegocios;               
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<OportunidadNegocio>> getMisOportunidadesRegistradas(string cveEmpleado)
        {
            try
            {
                var _oportunidadNegocios = await _db.OportunidadNegocio
               // .Include(c => c.Contacto)
               // .Include(f => f.Contacto.Adjunto)
               // .Include(e => e.Evento)
                .Include(em => em.Empresa)
                .Include(x=> x.Contacto)
                .Include(s => s.EstadoFlujoON)
                .Where(a => a.ClaveEmpleado == cveEmpleado)
                .AsNoTracking().ToListAsync();
//Dispose();
                return _oportunidadNegocios;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<OportunidadNegocio>> getMisOportunidadesAsignadas(string asignadoA) //Lista de ONs asignadas por un director o gerente
        {
            try
            {
                List<EstadoFlujoON> estados = new List<EstadoFlujoON>();
                //List<int> ids = new List<int>();
                //ids.Add(1);
                //ids.Add(2);
                //ids.Add(3);
                //ids.Add(4);
                //ids.Add(5);
                //ids.Add(6);
                //ids.Add(7);
                //ids.Add(10);
                //ids.Add(11);
                //ids.Add(12);
                //ids.Add(13);

                var _oportunidadNegocios = await _db.OportunidadNegocio
              //  .Include(c => c.Contacto)
              //  .Include(f => f.Contacto.Adjunto)
              //  .Include(e => e.Evento)
                .Include(em => em.Empresa)
                .Include(s => s.EstadoFlujoON)
                //.Where(a => a.EstadoFlujoONId != 8  && (( a.Especialista == asignadoA && a.EstadoFlujoONId == 3 || a.EstadoFlujoONId == 12 || a.Investigador == asignadoA && a.EstadoFlujoONId != 3)))
                .Where(a => (a.EstadoFlujoONId == 7 ) && a.Investigador == asignadoA)
                .AsNoTracking().ToListAsync();
//Dispose();
                return _oportunidadNegocios;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<OportunidadNegocio>> getMisOportunidadesAsignadasEspecialista(string asignadoA)
        {
            try
            {
                List<EstadoFlujoON> estados = new List<EstadoFlujoON>();
                

                var _oportunidadNegocios = await _db.OportunidadNegocio
             //   .Include(c => c.Contacto)
             //   .Include(f => f.Contacto.Adjunto)
             //   .Include(e => e.Evento)
                .Include(em => em.Empresa)
                .Include(s => s.EstadoFlujoON)
                .Where(a => (a.EstadoFlujoONId == 3 || a.EstadoFlujoONId == 12 || a.EstadoFlujoONId == 10) && a.Especialista  == asignadoA  )
                .AsNoTracking().ToListAsync();
                //Dispose();
                return _oportunidadNegocios;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<OportunidadNegocio>> getMisOportunidadesAsignadasGerente(string claveUnidad)
        {
            try
            {
                var _oportunidadNegocios = await _db.OportunidadNegocio
           //     .Include(c => c.Contacto)
           //     .Include(f => f.Contacto.Adjunto)
           //     .Include(e => e.Evento)
                .Include(em => em.Empresa)
                .Include(s => s.EstadoFlujoON)
                .Where(a => a.ClaveUnidad == claveUnidad)

                .AsNoTracking().ToListAsync();
//Dispose();
                return _oportunidadNegocios;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<BitacoraOportunidadNegocio>> getOportunidadesHistorico(int Id)
        {
            try
            {

                var _oportunidadNegociosHis = await _db.BitacoraOportunidadNegocio
                .Include(s => s.EstadoFlujoON)
                .Where(o => o.OportunidadNegocioId == Id)
                .OrderByDescending(o => o.FechaRegistro)
                .AsNoTracking().ToListAsync();
                

                List<String> unidades = new List<String>(
                        _oportunidadNegociosHis.Select(e => e.ClaveUnidad));
                UORepository claveUnidad = new UORepository(_dbGEN);
                var unidadeslista = await claveUnidad.GetUnidades(unidades);

                foreach (var unidad in _oportunidadNegociosHis)
                {
                    unidad.UnidadOrganizacional = unidadeslista
                                                .Where(e => e.ClaveUnidad == unidad.ClaveUnidad
                                                &&  e.FechaEfectiva == unidadeslista
                                                                        .Where(f=> f.ClaveUnidad == unidad.ClaveUnidad)
                                                                        .Max(g => g.FechaEfectiva)
                                                )
                                                
                                                .FirstOrDefault();
                }
//Dispose();
                return _oportunidadNegociosHis;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<BitacoraOportunidadNegocio>> getOportunidadesHistorico2(int Id)
        {
            try
            {

                var _oportunidadNegociosHis = await _db.BitacoraOportunidadNegocio
                .Include(s => s.EstadoFlujoON)
                .Where(o => o.OportunidadNegocioId == Id)
                .OrderByDescending(o => o.FechaRegistro)
                .AsNoTracking().ToListAsync();
                

                List<String> unidades = new List<String>(
                        _oportunidadNegociosHis.Select(e => e.ClaveUnidad));
                UORepository claveUnidad = new UORepository(_dbGEN);
                var unidadeslista = await claveUnidad.GetUnidades(unidades);

                foreach (var unidad in _oportunidadNegociosHis)
                {
                    unidad.UnidadOrganizacional = unidadeslista
                                                .Where(e => e.ClaveUnidad == unidad.ClaveUnidad
                                                && e.FechaEfectiva == unidadeslista
                                                                        .Where(f => f.ClaveUnidad == unidad.ClaveUnidad)
                                                                        .Max(g => g.FechaEfectiva)
                                                )

                                                .FirstOrDefault();
                }
                foreach (var on in _oportunidadNegociosHis)
                {
                    if (on.Especialista != null)
                    {
                        var entities = await _dbGEN.dbSetPersonas.AsNoTracking()
                    .Where(x => String.Concat(x.ApellidoPaterno, " ", x.ApellidoMaterno, " ", x.Nombre).Contains(on.Especialista))
                    .Select(x => x.ClavePersona)
                   .ToListAsync();
                        if (entities[0] != null)
                        {
                            on.Especialista = entities[0]+" - "+on.Especialista;
                        }
                    }
                    if (on.Investigador != null)
                    {
                        var entities = await _dbGEN.dbSetPersonas.AsNoTracking()
                    .Where(x => String.Concat(x.Nombre, " ", x.ApellidoPaterno, " ", x.ApellidoMaterno).Contains(on.Investigador))
                    .Select(x => x.ClavePersona)
                   .ToListAsync();
                        if (entities[0] != null)
                        {
                            on.Investigador = entities[0] + " - " +on.Investigador;
                        }
                    }
                }

                return _oportunidadNegociosHis;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<OportunidadNegocio> getById(int Id)
        {
            try
            {
                var _oportunidadNegocio = await _db.OportunidadNegocio
                    .Include("AdjuntoPorOportunidad.Adjunto")
                    .Include(t => t.TipoEvento)
                    .Include(c => c.Contacto)
                    .Include(a => a.Contacto.Adjunto)
                    .Include(e => e.Empresa)
                    .Include(s => s.EstadoFlujoON)
                    .Include(f => f.EstadoON)
                    .Include(ev => ev.Evento)
                    .Include(et => et.TipoEvento)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(on => on.OportunidadNegocioId == Id);
//Dispose();

                return _oportunidadNegocio;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Personas> getByResponsable(string Id) //Cuando el especialista asigna una ON a una div o gerencia
        {
            try
            {
                var _responsableUnidad = await _dbGEN.dbSetPersonas
                    .AsNoTracking()
                    .FirstOrDefaultAsync(p=> p.ClavePersona == Id);
//Dispose();

                return _responsableUnidad;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task create(OportunidadNegocio on)
        {
            try
            {
                on.EstadoFlujoONId = 4;
                on.EstadoONId = 1;
                on.FechaRegistro = DateTime.Now.Date;

                _db.OportunidadNegocio.Add(on);
                await _db.SaveChangesAsync();
                await InsertHistorico(on);

                if(on.Notificar == true)
                {
                    var _oportunidadInsert = await getById(on.OportunidadNegocioId);
                    Correo mail = new Correo();

                    mail.Modulo = "Capital Relacional";
                    mail.Empleado = on.Autor;
                    mail.Descripcion1 = on.NombreOportunidad;
                    mail.Seccion = "Oportunidad de Negocios";
                    mail.ClavePersona = on.ClaveEmpleado;
                    mail.TipoCorreo = "OportunidadNegocioNotificarme";
                    mail.tituloON = " - Nueva oportunidad de negocio registrada";

                    getCorreoConfig conf = new getCorreoConfig();
                    SendCorreo send = new SendCorreo();
                    var result = await send.Send(mail, conf);
                }

                NuevoOCRepository oc = new NuevoOCRepository();
                NuevoOC nuevoOC = new NuevoOC("CR", "ON", on.NombreOportunidad, "IndexCR.html#/oportunidadHistorico/" + on.OportunidadNegocioId);
                await oc.Create(nuevoOC);
                //Dispose();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task update(OportunidadNegocio on)
        {
            try
            {
                var _oportunidadNegocio = await _db.OportunidadNegocio
                    .FirstOrDefaultAsync(t => t.OportunidadNegocioId == on.OportunidadNegocioId);

                if (_oportunidadNegocio != null)
                {
                    _db.Entry(_oportunidadNegocio).CurrentValues.SetValues(on);
                    await _db.SaveChangesAsync();
                    await InsertHistorico(on);
//Dispose();
                }
                else
                {
//Dispose();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task updateONEstado(OportunidadNegocio on)
        {
            try
            {
                var _oportunidadNegocio = await _db.OportunidadNegocio
                    .FirstOrDefaultAsync(t => t.OportunidadNegocioId == on.OportunidadNegocioId);

                if (_oportunidadNegocio != null)
                {
                    _db.Entry(_oportunidadNegocio).CurrentValues.SetValues(on);
                    await _db.SaveChangesAsync();
                    if (on.EstadoONId != 1)
                    {
                        await InsertHistorico(on);
                    }
//Dispose();
                }
                else
                {
//Dispose();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task rechazar(OportunidadNegocio on)
        {
            try
            {
                var _oportunidadNegocio = await _db.OportunidadNegocio
                    .FirstOrDefaultAsync(t => t.OportunidadNegocioId == on.OportunidadNegocioId);

                if (_oportunidadNegocio != null)
                {

                    
                   on.Responsable = null;
                   on.ClaveUnidad = null;
                  

                    await InsertHistorico(on);

                    _db.Entry(_oportunidadNegocio).CurrentValues.SetValues(on);
                    await _db.SaveChangesAsync();
//Dispose();
                }
                else
                {
//Dispose();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        // REVISAR FLUJO PARA REGISTRAR BIEN LOS ESTADOS 
        public async Task rechazarInvestigador(OportunidadNegocio on)
        {
            try
            {
                var _oportunidadNegocio = await _db.OportunidadNegocio
                    .FirstOrDefaultAsync(t => t.OportunidadNegocioId == on.OportunidadNegocioId);


                if (_oportunidadNegocio != null)
                {
                   
                    await InsertHistorico(on);
                   

                    _db.Entry(_oportunidadNegocio).CurrentValues.SetValues(on);
                    await _db.SaveChangesAsync();
//Dispose();
                }
                else
                {
//Dispose();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task aceptarOportunidad(OportunidadNegocio on)
        {
            try
            {
                var _oportunidadNegocio = await _db.OportunidadNegocio
                    .FirstOrDefaultAsync(t => t.OportunidadNegocioId == on.OportunidadNegocioId);

                if (_oportunidadNegocio != null)
                {
                    on.EstadoFlujoONId = 8;
                    await InsertHistorico(on);

                    _db.Entry(_oportunidadNegocio).CurrentValues.SetValues(on);
                    await _db.SaveChangesAsync();
//Dispose();
                }
                else
                {
//Dispose();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task asignarInvestigador(OportunidadNegocio on) //Para el caso de que un gerente quieran asignar una ON a un investigador
        {
            try
            {
                var _oportunidadNegocio = await _db.OportunidadNegocio
                    .FirstOrDefaultAsync(t => t.OportunidadNegocioId == on.OportunidadNegocioId);

                if (_oportunidadNegocio != null && on.AsignarGerente==false)
                {
                    on.EstadoFlujoONId = 7;
                    await InsertHistorico(on);

                    _db.Entry(_oportunidadNegocio).CurrentValues.SetValues(on);
                    await _db.SaveChangesAsync();
                }
                if(_oportunidadNegocio != null && on.AsignarGerente)
                {
                    on.EstadoFlujoONId = 5;
                    //await InsertHistorico(on);

                    _db.Entry(_oportunidadNegocio).CurrentValues.SetValues(on);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateOportunidadEspecialista(OportunidadNegocio on)
        {
            try
            {
                var adjuntos = on.AdjuntoPorOportunidad.Count();
                var adjuntoDelete = on.AdjuntosDelete.Count();

                if (adjuntoDelete > 0)
                {
                    await deleteFile(on);
                }

                if (adjuntos > 0)
                {
                    await insertaAdjunto(on);
                }

                var _oportunidadNegocio = await _db.OportunidadNegocio
                    .FirstOrDefaultAsync(t => t.OportunidadNegocioId == on.OportunidadNegocioId);

                if (_oportunidadNegocio != null)
                {
                    _db.Entry(_oportunidadNegocio).CurrentValues.SetValues(on);
                    await _db.SaveChangesAsync();
//Dispose();
                }
                else
                {
//Dispose();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        private async Task deleteFile(OportunidadNegocio on)
        {
            try
            { 
                foreach (var item in on.AdjuntosDelete)
                {
                    int idFile = Convert.ToInt32(item);

                    var _file = await _dbGEN.dbSetAdjuntos
                        .FirstOrDefaultAsync(a => a.AdjuntoId == idFile);

                    if (_file != null)
                    {
                        _dbGEN.dbSetAdjuntos.Remove(_file);
                        await _dbGEN.SaveChangesAsync();
                    }
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }

        }

        public async Task delete(int Id)
        {
            try
            {
                var _oportunidadNegocio = await _db.OportunidadNegocio
                    .FirstOrDefaultAsync(on => on.OportunidadNegocioId == Id);
                if (_oportunidadNegocio != null)
                {
                    _db.OportunidadNegocio.Remove(_oportunidadNegocio);
                    await _db.SaveChangesAsync();
//Dispose();
                }
                else
                {
//Dispose();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task deleteLogic(OportunidadNegocio on)
        {
            try
            {
                var _oportunidadNegocio = await _db.OportunidadNegocio
                   .FirstOrDefaultAsync(o => o.OportunidadNegocioId == on.OportunidadNegocioId);

                if (_oportunidadNegocio != null)
                {
                    _db.Entry(_oportunidadNegocio).CurrentValues.SetValues(on);
                    await _db.SaveChangesAsync();
//Dispose();
                }
                else
                {
//Dispose();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task InsertHistorico(OportunidadNegocio on)
        {
            try
            {
                BitacoraOportunidadNegocio bitcora = new BitacoraOportunidadNegocio();

                bitcora.Comentarios = on.Comentarios;

                if (on.PorQueCancela != null)
                {
                    bitcora.Comentarios = on.PorQueCancela;
                }
                if (on.PorQueSuspende != null)
                {
                    bitcora.Comentarios = on.PorQueSuspende;
                }
                

                bitcora.EstadoFlujoONId = on.EstadoFlujoONId;
                bitcora.OportunidadNegocioId = on.OportunidadNegocioId;
                bitcora.ClaveUnidad = on.ClaveUnidad;
                bitcora.Investigador = on.NombreInvestigador;
               
                bitcora.Especialista = on.NombreEspecialista;
         
                bitcora.FechaRegistro = DateTime.Now;

                _db.BitacoraOportunidadNegocio.Add(bitcora);
                await _db.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        private async Task insertaAdjunto(OportunidadNegocio on)
        {
            try
            {
                foreach (var item in on.AdjuntoPorOportunidad)
                {
                    Adjunto obj = new Adjunto();

                    obj.ModuloId = "CR";
                    obj.RutaCompleta = item.Adjunto.RutaCompleta;
                    obj.nombre = item.Adjunto.nombre;

                    var entities = _dbGEN.dbSetAdjuntos.Add(obj);
                    await _dbGEN.SaveChangesAsync();

                    AdjuntoPorOportunidad objAdjON = new AdjuntoPorOportunidad();

                    objAdjON.Autor = on.Autor;
                    objAdjON.FechaRegistro = DateTime.Now;
                    objAdjON.Estado = true;
                    objAdjON.AdjuntoId = entities.AdjuntoId;
                    objAdjON.OportunidadNegocioId = on.OportunidadNegocioId;

                    var entities2 = _db.AdjuntoPorOportunidad.Add(objAdjON);
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