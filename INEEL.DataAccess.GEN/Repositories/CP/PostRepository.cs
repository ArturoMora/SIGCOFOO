using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Dynamic;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CP;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.GEN.Repositories.CP
{
    public class PostRepository : IDisposable
    {
        AdjuntoRepository _adjuntoRepo;
        private CP_Context _db;
        public PostRepository()
        {
            _db = new CP_Context();
            _adjuntoRepo=new AdjuntoRepository();
        }


        public async Task<Object[]> GetAll()
        {
            try
            {

                var entities = await _db.DbSetPost
                    .Include(e => e.Adjunto)
                    .Include(e=>e.Comunidad)
                    .Include(e=>e.Miembros)
                    .AsNoTracking().ToListAsync();
                Object [] lista=new Object[entities.Count];  
                foreach (var obj in entities)
                {
                    lista[entities.IndexOf(obj)] = new {obj.PostId
                                                        ,obj.Tema
                                                        ,obj.Descripcion
                                                        ,comunidad=new { obj.Comunidad.Descripcion, obj.Comunidad.ComunidadId} 
                                                        ,obj.FechaRegistro
                                                        ,miembro= new { obj.Miembros.nombrePersona, obj.Miembros.MiembroId,obj.Miembros.idPersonas} 
                                                        ,obj.adjuntoId
                                                        ,obj.Adjunto
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
                
                var entities = await _db.DbSetPost
                    .Include(e=>e.Adjunto)
                    .Include(e=>e.Comunidad)
                    .Include(e=>e.Miembros)
                    .AsNoTracking().FirstOrDefaultAsync(e=>e.PostId==id);
                Object lista = new Object();
                lista = new {entities.PostId
                                                        ,entities.Tema
                                                        ,entities.Descripcion
                                                        ,comunidad=new { entities.Comunidad.Descripcion, entities.Comunidad.ComunidadId} 
                                                        ,entities.FechaRegistro
                                                        ,miembro= new { entities.Miembros.nombrePersona, entities.Miembros.MiembroId, entities.Miembros.idPersonas} 
                                                        ,entities.adjuntoId
                                                        ,entities.Adjunto
                    };
                return lista;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Object[]> GetPublicosByComunidad(int id)
        {
            try
            {
                //var resultado = await (from p in _db.DbSetPost
                //                   where p.idComunidad == id
                //                   select new
                //                   {
                //                       PostId = p.PostId,
                //                       Tema = p.Tema,
                //                       Descripcion = p.Descripcion,
                //                       adjuntoId = p.adjuntoId,
                //                       comunidad = (from c in _db.DbSetComunidades
                //                                    where c.ComunidadId == id
                //                                    select new
                //                                    {
                //                                        Descripcion = c.Descripcion,
                //                                        ComunidadId = c.ComunidadId
                //                                    }).FirstOrDefault(),
                //                       miembro = (from m in _db.DbSetMiembros
                //                                  where m.MiembroId == p.idMiembroCP
                //                                  select new
                //                                  {
                //                                      nombrePersona = m.nombrePersona,
                //                                      MiembroId = m.MiembroId,
                //                                      idPersonas = m.idPersonas
                //                                  }).FirstOrDefault(),
                //                   }).AsNoTracking().ToListAsync();
                var entities = await _db.DbSetPost
                    .Where(e => e.idComunidad == id && e.publico==true)
                    .Include(e => e.Adjunto)
                    .Include(e => e.Comunidad)
                    .Include(e => e.Miembros)
                    .OrderBy(e=>e.FechaRegistro)
                    .AsNoTracking()
                    .ToListAsync();
                Object [] lista=new Object[entities.Count];  
                ComentariosRepository c= new ComentariosRepository();
                foreach (var obj in entities)
                {
                    lista[entities.IndexOf(obj)] = new {obj.PostId
                                                        ,obj.Tema
                                                        ,obj.Descripcion
                                                        ,comunidad=new { obj.Comunidad.Descripcion, obj.Comunidad.ComunidadId} 
                                                        ,obj.FechaRegistro
                                                        ,miembro= new { obj.Miembros.nombrePersona, obj.Miembros.MiembroId,obj.Miembros.idPersonas} 
                                                        ,obj.adjuntoId
                                                        ,obj.Adjunto
                                                        ,comentarios= await c.GetByPost(obj.PostId)
                    };
                }
                return lista;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Object[]> GetByComunidad(Post model)
        {
            try
            {
                var entities = await _db.DbSetPost
                    .Where(e => e.idComunidad == model.idComunidad)
                    .Include(e => e.Miembros)
                    .OrderByDescending(e=>e.FechaRegistro)
                    .AsNoTracking()
                    .ToListAsync();
               
                Object [] lista=new Object[entities.Count];  
                ComentariosRepository c= new ComentariosRepository();
                PersonasRepository personas = new PersonasRepository();
                
                foreach (var obj in entities)
                {

                    if (obj.idMiembroCP == null)
                    {
                        Miembros m = new Miembros();
                        obj.Miembros = m;
                        var datosPersona = await personas.GetByClave(obj.idPersona);
                        obj.Miembros.nombrePersona = datosPersona.NombreCompleto;
                        obj.Miembros.idPersonas = datosPersona.ClavePersona;
                    }
                    lista[entities.IndexOf(obj)] = new {obj.PostId
                                                        ,obj.Tema
                                                        ,obj.Descripcion
                                                        ,obj.publico
                                                        ,obj.accesoGeneral
                                                        ,obj.FechaRegistro
                                                        ,miembro= new { obj.Miembros.nombrePersona,  obj.Miembros.idPersonas }
                                                        ,obj.adjuntoId
                                                        ,comentarios= await c.GetByPost(obj.PostId)
                                                        
                    };
                }
                return lista;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<Object[]> GetByComunidadSinComentarios(Post model)
        {
            try
            {
                var entities = await _db.DbSetPost
                    .Where(e => e.idComunidad == model.idComunidad)
                    .Include(e => e.Miembros)
                    .OrderByDescending(e => e.FechaRegistro)
                    .AsNoTracking()
                    .ToListAsync();

                Object[] lista = new Object[entities.Count];
                PersonasRepository personas = new PersonasRepository();
                foreach (var obj in entities)
                {

                    if (obj.idMiembroCP == null)
                    {
                        Miembros m = new Miembros();
                        obj.Miembros = m;
                        var datosPersona = await personas.GetByClaveFechaEfectiva(obj.idPersona);
                        obj.Miembros.nombrePersona = datosPersona.NombreCompleto;
                        obj.Miembros.idPersonas = datosPersona.ClavePersona;
                        obj.adjunto64 = await personas.ObtenerFotobyclavepersona(obj.idPersona);
                    }
                    else
                    {
                        var p = await _db.DbSetMiembros.AsNoTracking().FirstOrDefaultAsync(e => e.MiembroId == obj.idMiembroCP);
                        obj.adjunto64 = await personas.ObtenerFotobyclavepersona(p.idPersonas);
                    }
                    int numeroComentarios = _db.DbSetComentarios.Count(e => e.PostId == obj.PostId);
                    lista[entities.IndexOf(obj)] = new
                    {                                   obj.PostId
                                                        ,obj.Tema
                                                        ,obj.Descripcion
                                                        ,obj.publico
                                                        ,obj.accesoGeneral
                                                        ,obj.FechaRegistro
                                                        ,miembro = new { obj.Miembros.nombrePersona, obj.Miembros.idPersonas }
                                                        ,obj.adjunto64
                                                        ,numeroComentarios
                                                        
                        

                    };
                }
                return lista;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<int> GetTotalPostComunidad(int id)
        {
            try
            {
                int numObjetos = _db.DbSetPost.Count(e=>e.idComunidad==id);
                return numObjetos;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message,e);
            }
        }

        public async Task Create(Post model)
        {
            try
            {
                model.FechaRegistro=DateTime.Now;
                _db.DbSetPost.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(Post model)
        {
            try
            {
                var _model = await _db.DbSetPost.FirstOrDefaultAsync(e => e.PostId == model.PostId);
                if (_model != null)
                {
                    if (model.Adjunto != null && model.Adjunto.AdjuntoId == 0)
                    {

                        Adjunto key = await _adjuntoRepo.CreateAd(model.Adjunto);
                        model.adjuntoId = key.AdjuntoId;
                        model.Adjunto.AdjuntoId = key.AdjuntoId;

                    }
                    _db.Entry(_model).CurrentValues.SetValues(model);
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
                var _model = await _db.DbSetPost.FirstOrDefaultAsync(e => e.PostId == id);
                if (_model != null)
                {
                    _db.DbSetPost.Remove(_model);
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
