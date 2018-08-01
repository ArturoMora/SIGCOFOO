using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CP;

namespace INEEL.DataAccess.GEN.Repositories.CP
{
    public class PreguntasRepository : IDisposable
    {

        private CP_Context _db;
        public PreguntasRepository()
        {
            _db = new CP_Context();
        }


        public async Task<Object[]> GetAll()
        {
            try
            {
                var entities = await _db.DbSetPreguntas
                    .Include(e=>e.Miembros)
                    .AsNoTracking().ToListAsync();
                Object [] lista=new Object[entities.Count];  
                foreach (var obj in entities)
                {
                    lista[entities.IndexOf(obj)] = new {obj.PreguntaId
                                                        ,obj.Pregunta
                                                        ,obj.Respuesta
                                                        ,obj.idMiembroCP
                                                        ,obj.FechaRegistro
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
                var entities = await _db.DbSetPreguntas
                    .AsNoTracking()
                    .FirstOrDefaultAsync(e => e.PreguntaId  == id);
                Object resultado = new Object();
                resultado = new {entities.idMiembroCP
                                                        ,entities.Pregunta
                                                        ,entities.Respuesta
                                                        ,entities.FechaRegistro
                    };
                
                return resultado;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<Object[]> GetByComunidad(int id)
        {
            try
            {
                var entities = await _db.DbSetPreguntas
                    .Include(e=>e.Miembros)
                    .Where(e=>e.idCP==id)
                    .AsNoTracking().ToListAsync();
                Object [] lista=new Object[entities.Count];  
                foreach (var obj in entities)
                {
                    var nombre = "Administrador CP";
                    if (obj.idMiembroCP != null)
                    {
                        nombre = obj.Miembros.nombrePersona;
                    }
                    lista[entities.IndexOf(obj)] = new {obj.PreguntaId
                                                        ,obj.Pregunta
                                                        ,obj.Respuesta
                                                        ,obj.idMiembroCP
                                                        ,obj.FechaRegistro
                                                        ,nombrePersona=nombre
                                                        ,obj.idCP
                                                        
                    };
                }
                return lista;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<Object[]> GetByComunidad2(int id)
        {
            try
            {
                var entities = await _db.DbSetPreguntas
                    .Include(e => e.Miembros)
                    .Where(e => e.idCP == id)
                    .AsNoTracking().ToListAsync();
                Object[] lista = new Object[entities.Count];
                foreach (var obj in entities)
                {
                    var nombre = "Administrador CP";
                    if (obj.idMiembroCP != null)
                    {
                        nombre = obj.Miembros.idPersonas+" "+obj.Miembros.nombrePersona;
                    }
                    lista[entities.IndexOf(obj)] = new
                    {
                        obj.PreguntaId
                                                        ,
                        obj.Pregunta
                                                        ,
                        obj.Respuesta
                                                        ,
                        obj.idMiembroCP
                                                        ,
                        obj.FechaRegistro
                                                        ,
                        nombrePersona = nombre
                                                        ,
                        obj.idCP

                    };
                }
                return lista;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task Create(Preguntas model)
        {
            try
            {

                _db.DbSetPreguntas.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(Preguntas model)
        {
            try
            {
                var _model = await _db.DbSetPreguntas.FirstOrDefaultAsync(e => e.PreguntaId  == model.PreguntaId );
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
                var _model = await _db.DbSetPreguntas.FirstOrDefaultAsync(e => e.PreguntaId  == id);
                if (_model != null)
                {
                    _db.DbSetPreguntas.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task DeleteMiembro(int id)
        {
            try
            {
                var _model = await _db.DbSetPreguntas.FirstOrDefaultAsync(e => e.idMiembroCP == id);
                if (_model != null)
                {
                    _db.DbSetPreguntas.Remove(_model);
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
