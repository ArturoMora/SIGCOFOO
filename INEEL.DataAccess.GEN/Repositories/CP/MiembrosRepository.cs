using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CP;
using INEEL.DataAccess.GEN.Repositories;
using INEEL.DataAccess.GEN.Models.GEN;
using System.Linq.Dynamic;
using System.Linq;
using INEEL.DataAccess.GEN.Models.CH;
using INEEL.DataAccess.GEN.Util;

namespace INEEL.DataAccess.GEN.Repositories.CP
{
    public class MiembrosRepository : IDisposable
    {

        private CP_Context _db;
        public MiembrosRepository()
        {
            _db = new CP_Context();
        }


        public async Task<Object[]> GetAll()
        {
            try
            {
                var entities = await _db.DbSetMiembros
                    .Where(e => e.estado == true)
                    .Include(e => e.RolesCP)
                    .Include(e => e.Comunidad)
                    .AsNoTracking().ToListAsync();
                PersonasRepository personas=new PersonasRepository();
                Object [] lista=new Object[entities.Count];  
                foreach (var obj in entities)
                {
                    var datosPersona = await personas.GetByClave(obj.idPersonas);
                    lista[entities.IndexOf(obj)] = new {nombre=datosPersona.NombreCompleto
                                                        ,roles=new {rolId=obj.RolesCP.RolId, nombre=obj.RolesCP.Nombre}
                                                        ,comunidades = new {nombreComunidad=obj.Comunidad.Descripcion,categoria=obj.Comunidad.CategoriaCP}
                                                        ,obj.idCP
                                                        ,obj.idPersonas
                                                        ,obj.MiembroId
                                                        ,obj.FechaAlta
                                                        ,obj.FechaBaja
                                                        ,obj.Aceptacion
                                                        ,obj.FechaAceptacion
                    };
                }
                return lista;

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
                var entities = await _db.DbSetMiembros
                    .Include(e=>e.RolesCP)
                    .Include(e=>e.Comunidad)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(e => e.MiembroId  == id);
                PersonasRepository personas = new PersonasRepository();
                Object resultado = new Object();
                var datosPersona = await personas.GetByClave(entities.idPersonas);
                resultado = new {nombre=datosPersona.NombreCompleto
                                                        ,roles=new {rolId=entities.RolesCP.RolId, nombre=entities.RolesCP.Nombre}
                                                        ,comunidades = new {nombreComunidad= entities.Comunidad.Descripcion,categoria= entities.Comunidad.CategoriaCP}
                                                        ,entities.idCP
                                                        ,entities.idPersonas
                                                        ,entities.MiembroId
                                                        ,entities.FechaAlta
                                                        ,entities.FechaBaja
                                                        ,entities.Aceptacion
                                                        ,entities.FechaAceptacion
                    };
                
                return resultado;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Object> GetByUsuarioComunidad(BusquedaNivel obj)
        {
            try
            {
                var entities = await _db.DbSetMiembros
                    .Where(e => e.idCP == obj.id && e.idPersonas == obj.claveEmpleado)
                    .Include(e => e.RolesCP)
                    .AsNoTracking().FirstOrDefaultAsync();
                if (entities != null)
                {
                    Object resultado = new Object();
                    resultado = new {
                                                        roles=new {rolId=entities.RolesCP.RolId, nombre=entities.RolesCP.Nombre}
                                                        ,entities.idCP
                                                        ,entities.idPersonas
                                                        ,entities.MiembroId
                                                        ,entities.FechaAlta
                                                        ,entities.Aceptacion
                                                        ,entities.FechaAceptacion
                    };
                
                return resultado;    
                }
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

         public async Task<Object> GetMiembroByComunidad(int id)
        {
            try
            {
                var entities = await _db.DbSetMiembros
                    .Where(e => e.idCP == id && e.estado == true)
                    .Include(e => e.RolesCP)
                    .AsNoTracking().FirstOrDefaultAsync();
                if (entities != null)
                {
                    Object resultado = new Object();
                    resultado = new {
                                                        roles=new {rolId=entities.RolesCP.RolId, nombre=entities.RolesCP.Nombre}
                                                        ,entities.idCP
                                                        ,entities.idPersonas
                                                        ,entities.MiembroId
                                                        ,entities.FechaAlta
                                                        ,entities.Aceptacion
                                                        ,entities.FechaAceptacion
                                                        ,entities.nombrePersona
                    };
                
                return resultado;    
                }
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<Object> GetMiembroByComunidadAdministra(int id)
        {
            try
            {
                var entities = await _db.DbSetMiembros
                    .Where(e => e.idCP == id && e.estado == true)
                    .AsNoTracking().ToListAsync();

                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Object> GetFirstMiembroByClavePersona(BusquedaNivel obj)
        {
            try
            {
                var miembro =await  _db.DbSetMiembros.Include(e => e.RolesCP).AsNoTracking().FirstOrDefaultAsync(e => e.idPersonas == obj.claveEmpleado);
                if (miembro != null)
                {
                    Object resultado = new Object();
                    resultado = new {                       miembro.nombrePersona
                                                        ,miembro.MiembroId
                                                        ,miembro.FechaAlta
                                                        ,roles=new {rolId= miembro.RolesCP.RolId, nombreRol= miembro.RolesCP.Nombre}
                    };
                    return resultado;
                }
                
                return miembro;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Object> GetByComunidad(int id)
        {
            try
            {
                var entities = await _db.DbSetMiembros
                    .Where(e => e.idCP == id && e.estado == true)
                    .Include(e => e.RolesCP)
                    .AsNoTracking()
                    .ToListAsync();


                PersonasRepository personas = new PersonasRepository();
                
               

                foreach (var item in entities)
                {
                    var datosPersona = await personas.GetByClave(item.idPersonas);
                    item.correo = datosPersona.Correo;
                }


                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<Object> EnviaNotificaciones(Correo correo )
        {
            try
            {
                string correosMiembros = "";
                string mensaje = "";

                var entities = await _db.DbSetMiembros
                    .Where(e => e.idCP == correo.id)
                    .Include(e => e.RolesCP)
                    .AsNoTracking()
                    .ToListAsync();


                AgendaCPRepository agendaCP = new AgendaCPRepository();
                PersonasRepository personas = new PersonasRepository();

                foreach (var item in entities)
                {
                    var datosPersona = await personas.GetByClave(item.idPersonas);
                    correosMiembros = correosMiembros +  datosPersona.Correo + ",";
                }


                getCorreoConfig conf = new getCorreoConfig();
                SendCorreo send = new SendCorreo();

                if (await send.SendMails(correo, correosMiembros, conf))
                {
                    mensaje = "enviado";
                    Agenda ag = new Agenda();
                    ag = correo.agenda;
                    ag.NotificacionEnviada = true;
                   
                    await agendaCP.Update(ag);
                }
                else {
                    mensaje = "falla";
                }

               

                return mensaje;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<Object> GetMiembrosByComunidad(int id)
        {
            try
            {

                PersonasRepository persona = new PersonasRepository();

                var entities = await _db.DbSetMiembros
                    .Where(e => e.idCP == id && e.estado == true)
                    .Include(e => e.RolesCP)
                    .OrderByDescending(e=>e.rolId)
                    .AsNoTracking()
                    .ToListAsync();


                foreach (var item in entities) {
                    item.foto = await persona.ObtenerFotobyclavepersona(item.idPersonas);
                }

                persona = null;

                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<Object> GetMiembrosByComunidadInactivos(int id)
        {
            try
            {

                PersonasRepository persona = new PersonasRepository();

                var entities = await _db.DbSetMiembros
                    .Where(e => e.idCP == id && e.estado == false)
                    .AsNoTracking()
                    .ToListAsync();


                foreach (var item in entities)
                {
                    item.foto = await persona.ObtenerFotobyclavepersona(item.idPersonas);
                }

                persona = null;

                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<Object> GetByComunidadLider(int id)
        {
            try
            {
                var entities = await _db.DbSetMiembros
                    .AsNoTracking()
                    .FirstOrDefaultAsync(e => e.idCP == id && e.rolId == 3);

                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Object> GetByComunidadSecretario(int id)
        {
            try
            {
                var entities = await _db.DbSetMiembros
                    .AsNoTracking()
                    .FirstOrDefaultAsync(e => e.idCP == id && e.rolId == 4);

                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task Create(Miembros model)
        {
            try
            {

                _db.DbSetMiembros.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Miembros> RegistraMiembro(Miembros model)
        {
            try
            {
                PersonasRepository persona = new PersonasRepository();
                string foto = await persona.ObtenerFotobyclavepersona(model.idPersonas);
                
                var obj =  _db.DbSetMiembros.Add(model);
                await _db.SaveChangesAsync();

                obj.foto = foto;

                return obj;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(Miembros model)
        {
            try
            {
                var _model = await _db.DbSetMiembros.FirstOrDefaultAsync(e => e.MiembroId  == model.MiembroId );
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

        public async Task UpdateAceptacionLineamientos(Miembros model)
        {
            try
            {
                var _model = await _db.DbSetMiembros.FirstOrDefaultAsync(e => e.MiembroId == model.MiembroId);
                if (_model != null)
                {
                    var modelo = _model;
                    modelo.FechaAceptacion = model.FechaAceptacion;
                    modelo.Aceptacion = model.Aceptacion;
                    _db.Entry(_model).CurrentValues.SetValues(modelo);
                    await _db.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public  async Task<string> verificaDatosMiembro(int id)
        {
            string informacionRegistrada = "";
            
            try
            {
                var sitio = await _db.DbSetSitioInteres.FirstOrDefaultAsync(x => x.idMiembroCP == id);
                var preguntas = await _db.DbSetPreguntas.FirstOrDefaultAsync(x => x.idMiembroCP == id);
                var posts = await _db.DbSetPost.FirstOrDefaultAsync(x => x.idMiembroCP == id);

                var documentos = await _db.DbSetDocumentos.FirstOrDefaultAsync(x => x.idMiembroCP == id);
                var comentarios = await _db.DbSetComentarios.FirstOrDefaultAsync(x => x.idMiembroCP == id);
                var comentarioscp = await _db.DbSetComentariosLCP.FirstOrDefaultAsync(x => x.idMiembro == id);

                if (sitio != null || preguntas != null || posts != null || documentos != null || comentarios != null || comentarioscp != null) {

                    informacionRegistrada = "Datos";
                }

                return informacionRegistrada;
            }
            catch (Exception e)
            {
                return informacionRegistrada;
            }                     
        }


        //public async Task<string> verificaDatosMiembroExperto(BusquedaNivel obj)
        //{
        //    string informacionRegistrada = "";

        //    try
        //    {
        //        var sitio = await _db.DbSetSitioInteres.FirstOrDefaultAsync(x => x.idCP == obj.id);
        //        var preguntas = await _db.DbSetPreguntas.FirstOrDefaultAsync(x => x.idCP == obj.id);
        //        var posts = await _db.DbSetPost.FirstOrDefaultAsync(x => x.idComunidad == obj.id);

        //        var documentos = await _db.DbSetDocumentos.FirstOrDefaultAsync(x => x.idComunidadCP == obj.id);
        //        //var comentarios = await _db.DbSetComentarios.FirstOrDefaultAsync(x => x.I == id);
        //        //var comentarioscp = await _db.DbSetComentariosLCP.FirstOrDefaultAsync(x => x.idMiembro == id);

        //        if (sitio != null || preguntas != null || posts != null || documentos != null )
        //        {

        //            informacionRegistrada = "Datos";
        //        }

        //        return informacionRegistrada;
        //    }
        //    catch (Exception e)
        //    {
        //        return informacionRegistrada;
        //    }
        //}


        public void eliminaInfoMiembro(int id)
        {

            try
            {


                Task[] tasks = new Task[6];

                tasks[0] = Task.Run(() =>
                {
                    var preguntas = (from p in _db.DbSetPreguntas where p.idMiembroCP == id select p);

                    if (preguntas != null)
                    {
                        foreach (var item in preguntas)
                        {
                            _db.DbSetPreguntas.Remove(item);
                        }

                    }
                });

                tasks[1] = Task.Run(() =>
                {
                    var posts = (from p in _db.DbSetPost where p.idMiembroCP == id select p);

                    if (posts != null)
                    {
                        foreach (var item in posts)
                        {
                            _db.DbSetPost.Remove(item);
                        }

                    }
                });

                tasks[2] = Task.Run(() =>
                {
                    var documentosMiembro = (from p in _db.DbSetDocumentos where p.idMiembroCP == id select p);

                    if (documentosMiembro != null)
                    {
                        foreach (var item in documentosMiembro)
                        {
                            _db.DbSetDocumentos.Remove(item);
                        }

                    }
                });

                tasks[3] = Task.Run(() =>
                {
                    var comentariosMiembro = (from p in _db.DbSetComentarios where p.idMiembroCP == id select p);

                    if (comentariosMiembro != null)
                    {
                        foreach (var item in comentariosMiembro)
                        {
                            _db.DbSetComentarios.Remove(item);
                        }

                    }
                });

                tasks[4] = Task.Run(() =>
                {
                    var comentariosCP = (from p in _db.DbSetComentariosLCP where p.idMiembro == id select p);

                    if (comentariosCP != null)
                    {
                        foreach (var item in comentariosCP)
                        {
                            _db.DbSetComentariosLCP.Remove(item);
                        }

                    }

                });

                tasks[5] = Task.Run(() =>
                {
                    var sitios = (from p in _db.DbSetSitioInteres where p.idMiembroCP == id select p);

                    if (sitios != null)
                    {
                        foreach (var item in sitios)
                        {
                            _db.DbSetSitioInteres.Remove(item);
                        }

                    }
                });


                // Output results so far.
                Task.WaitAll(tasks);

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

              
                var _model = await _db.DbSetMiembros.FirstOrDefaultAsync(e => e.MiembroId  == id);
                if (_model != null)
                {
                    _db.DbSetMiembros.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task UpdateEstado(Miembros model)
        {
            try
            {
                var _model = await _db.DbSetMiembros.FirstOrDefaultAsync(e => e.MiembroId == model.MiembroId);
                if (_model != null)
                {
                    _model.estado = model.estado;
                    await _db.SaveChangesAsync();
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
