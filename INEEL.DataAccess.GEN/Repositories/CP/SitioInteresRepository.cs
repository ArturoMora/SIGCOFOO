using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CP;

namespace INEEL.DataAccess.GEN.Repositories.CP
{
    public class SitioInteresRepository : IDisposable
    {

        private CP_Context _db;
        public SitioInteresRepository()
        {
            _db = new CP_Context();
        }


        public async Task<Object[]> GetAll()
        {
            try
            {
                var entities = await _db.DbSetSitioInteres
                    .Include(e=>e.Miembros)
                    .Include(e=>e.CategoriaSitio)
                    .AsNoTracking().ToListAsync();
                Object [] lista=new Object[entities.Count];  
                foreach (var obj in entities)
                {
                    lista[entities.IndexOf(obj)] = new {obj.SitioId
                                                        ,obj.Titulo
                                                        ,obj.Descripcion
                                                        ,obj.FechaRegistro
                                                        ,obj.Miembros.nombrePersona
                                                        ,obj.idCategoria
                                                        ,obj.CategoriaSitio.NombreCategoria
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
                var entities = await _db.DbSetSitioInteres
                    .Include(e=>e.Miembros)
                    .Include(e=>e.CategoriaSitio)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(e => e.SitioId  == id);
                Object resultado = new Object();
                resultado = new {entities.SitioId
                                                        ,entities.Titulo
                                                        ,entities.Descripcion
                                                        ,entities.FechaRegistro
                                                        ,entities.Miembros.nombrePersona
                                                        ,entities.idCategoria
                                                        ,entities.CategoriaSitio.NombreCategoria
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
                var entities = await _db.DbSetSitioInteres
                    .Include(e=>e.Miembros)
                    .Include(e => e.CategoriaSitio)
                    .Where(e=>e.idCP==id)
                    .AsNoTracking().ToListAsync();
                Object[] lista = new Object[entities.Count];
                foreach (var obj in entities)
                {
                    var nombre = "Administrador CP";
                    if (obj.idMiembroCP != null)
                    {
                        nombre = obj.Miembros.nombrePersona;
                        obj.idPersona = obj.Miembros.idPersonas;
                    }

                    lista[entities.IndexOf(obj)] = new {obj.SitioId
                                                        ,obj.Titulo
                                                        ,obj.Descripcion
                                                        ,obj.FechaRegistro
                                                        ,nombrePersona=nombre
                                                        ,obj.idCategoria
                                                        ,obj.CategoriaSitio.NombreCategoria
                                                        ,obj.Liga
                                                        ,obj.idPersona
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



        public async Task Create(SitioInteres model)
        {
            try
            {
                model.FechaRegistro = DateTime.Now;
                _db.DbSetSitioInteres.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(SitioInteres model)
        {
            try
            {
                var _model = await _db.DbSetSitioInteres.FirstOrDefaultAsync(e => e.SitioId  == model.SitioId );
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
                var _model = await _db.DbSetSitioInteres.FirstOrDefaultAsync(e => e.SitioId  == id);
                if (_model != null)
                {
                    _db.DbSetSitioInteres.Remove(_model);
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
               
                var entities = await _db.DbSetSitioInteres.Where(e => e.idMiembroCP == id).AsNoTracking().ToListAsync();

                foreach (var obj in entities) {
                    _db.DbSetSitioInteres.Remove(obj);
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
