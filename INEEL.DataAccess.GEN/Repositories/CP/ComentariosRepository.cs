using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CP;

namespace INEEL.DataAccess.GEN.Repositories.CP
{
    public class ComentariosRepository : IDisposable
    {

        private CP_Context _db;
        public ComentariosRepository()
        {
            _db = new CP_Context();
        }


        public async Task<Object[]> GetAll()
        {
            try
            {
                var entities = await _db.DbSetComentarios
                    .Include(e=>e.Miembros)
                    .Include(e=>e.Post)
                    .AsNoTracking().ToListAsync();
                Object [] lista=new Object[entities.Count];  
                foreach (var obj in entities)
                {
                    lista[entities.IndexOf(obj)] = new {obj.PostId
                                                        ,obj.ComentarioId
                                                        ,obj.Comentario
                                                        ,obj.FechaRegistro
                                                        ,miembro= new { obj.Miembros.nombrePersona, obj.Miembros.MiembroId,obj.Miembros.idPersonas} 
                                                        ,post= new { obj.Post.Descripcion, obj.Post.Tema} 
                                                        
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
                var entities = await _db.DbSetComentarios
                    .Include(e => e.Miembros)
                    .Include(e => e.Post)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(e => e.ComentarioId == id);
                Object lista = new Object();
                lista = new {entities.PostId
                                                        ,entities.ComentarioId
                                                        ,entities.Comentario
                                                        ,entities.FechaRegistro
                };
                                                        
                return lista;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<Object[]> GetByPost(int id)
        {
            try
            {
                var entities = await _db.DbSetComentarios
                    .Where(e=>e.PostId==id)
                    .Include(e=>e.Miembros)
                    .AsNoTracking()
                    .ToListAsync();
                Object [] lista=new Object[entities.Count];
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
                        var person = await _db.DbSetMiembros.AsNoTracking().FirstOrDefaultAsync(e => e.MiembroId == obj.idMiembroCP);
                        obj.adjunto64 = await personas.ObtenerFotobyclavepersona(person.idPersonas);
                    }
                    
                    lista[entities.IndexOf(obj)] = new {obj.PostId
                                                        ,obj.ComentarioId
                                                        ,obj.Comentario
                                                        ,obj.FechaRegistro
                                                        ,obj.Miembros.nombrePersona
                                                        ,obj.Miembros.idPersonas
                                                        ,obj.adjunto64
                    };
                }
                return lista;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(Comentarios model)
        {
            try
            {
                model.FechaRegistro = DateTime.Now;
                _db.DbSetComentarios.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(Comentarios model)
        {
            try
            {
                var _model = await _db.DbSetComentarios.FirstOrDefaultAsync(e => e.ComentarioId == model.ComentarioId);
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

        public async Task Delete(int id)
        {
            try
            {
                var _model = await _db.DbSetComentarios.FirstOrDefaultAsync(e => e.ComentarioId == id);
                if (_model != null)
                {
                    _db.DbSetComentarios.Remove(_model);
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
