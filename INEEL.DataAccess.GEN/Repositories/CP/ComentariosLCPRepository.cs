using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CP;

namespace INEEL.DataAccess.GEN.Repositories.CP
{
    public class ComentariosLCPRepository : IDisposable
    {


        private CP_Context _db;
        public ComentariosLCPRepository()
        {
            _db = new CP_Context();
        }


        public async Task<Object[]> GetAll()
        {
            try
            {
                var entities = await _db.DbSetComentariosLCP
                    .Include(e=>e.Miembros)
                    .AsNoTracking().ToListAsync();
                Object [] lista=new Object[entities.Count];  
                foreach (var obj in entities)
                {
                    lista[entities.IndexOf(obj)] = new {obj.Comentario
                                                        ,obj.idMiembro
                                                        ,nombreMimebro=obj.Miembros.nombrePersona
                                                        ,obj.Miembros.Aceptacion
                                                        ,obj.Miembros.Comunidad.Descripcion
                                                        ,obj.FechaRegistro
                                                        ,obj.ComentarioId
                                                        ,obj.idLineamiento
                    };
                }
                return lista;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

         public async Task<Object[]> GetByLineamiento(int id)
        {
            try
            {
                var entities = await _db.DbSetComentariosLCP
                    .Include(e => e.Miembros).Where(e=>e.idLineamiento==id)
                    .AsNoTracking().ToListAsync();
                Object[] resultado = new Object[entities.Count];
                if (entities != null)
                {
                    foreach (var obj in entities)
                    {
                          resultado[entities.IndexOf(obj)] =  new {obj.Comentario
                                                        ,obj.idMiembro
                                                        ,obj.Miembros.nombrePersona
                                                        ,obj.Miembros.Aceptacion
                                                        ,obj.FechaRegistro
                                                        ,obj.ComentarioId
                                                        ,obj.idLineamiento
                           };
                    
                   }
                return resultado;    
                }
                return null;
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
                var entities = await _db.DbSetComentariosLCP
                    .Include(e => e.Miembros)
                    .AsNoTracking().FirstOrDefaultAsync(e => e.ComentarioId == id);
                Object resultado = new Object();
                resultado = new {entities.Comentario
                                                        ,entities.idMiembro
                                                        ,nombreMiembro=entities.Miembros.nombrePersona
                                                        ,entities.Miembros.Aceptacion
                                                        ,entities.FechaRegistro
                                                        ,entities.ComentarioId
                                                        ,entities.idLineamiento
                    };
                
                return resultado;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(ComentariosLCP model)
        {
            try
            {

                _db.DbSetComentariosLCP.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(ComentariosLCP model)
        {
            try
            {
                var _model = await _db.DbSetComentariosLCP.FirstOrDefaultAsync(e => e.ComentarioId == model.ComentarioId);
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
                var _model = await _db.DbSetComentariosLCP.FirstOrDefaultAsync(e => e.ComentarioId == id);
                if (_model != null)
                {
                    _db.DbSetComentariosLCP.Remove(_model);
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
            _db.Dispose(); //ayudar al recolector de basura
        }
    }
}
