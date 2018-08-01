using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Util;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories
{
    public class MovimientoUnidadOrgRepository : IDisposable
    {

        private GEN_Context _db;
        public MovimientoUnidadOrgRepository()
        {
            _db = new GEN_Context();
            _db.Database.Log = Escribe.Write; 
        }

        //public async Task<IEnumerable<MovimientoUnidadOrg>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<MovimientoUnidadOrg>> GetAll()
        {
            try
            {
                var entities = await _db.bdSetMovimientoUnidadOrg.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<MovimientoUnidadOrg>> GetAllByClaveEmpleado(String claveEmpleado)
        {
            try
            {
                var entities = await _db.bdSetMovimientoUnidadOrg.AsNoTracking()
                    .Where(x=>x.ClavePersona.Equals(claveEmpleado))
                    .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<Object>> GetAllByClaveEmpleadoUONew(String claveEmpleado)
        {
            try
            {
                var fecha = DateTime.Now;
                var obj = from m in _db.bdSetMovimientoUnidadOrg
                          from u in _db.dbSetUnidadOrganizacional
                          where u.FechaEfectiva == _db.dbSetUnidadOrganizacional.Where(
                                                        p => p.FechaEfectiva <= fecha
                                                        && p.ClaveUnidad == u.ClaveUnidad
                                                        ).Max(e => e.FechaEfectiva)
                          where m.ClavePersona.Equals(claveEmpleado)
                            && m.ClaveUnidad.Equals(u.ClaveUnidad)
                          select new { m, nombreUnidad = u.NombreUnidad };
                var result = await obj.AsNoTracking().ToListAsync();


                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Object>> GetAllByClaveEmpleadoUO(String claveEmpleado)
        {
            try
            {
                var obj = from m in _db.bdSetMovimientoUnidadOrg
                          from u in _db.dbSetUnidadOrganizacional
                          where u.FechaEfectiva == _db.dbSetUnidadOrganizacional.Where(
                                                        p => p.FechaEfectiva <= m.Fecha
                                                        && p.ClaveUnidad == u.ClaveUnidad
                                                        ).Max(e => e.FechaEfectiva)
                          where m.ClavePersona.Equals(claveEmpleado)
                            && m.ClaveUnidad.Equals(u.ClaveUnidad)
                          select new { m, nombreUnidad= u.NombreUnidad };
                var result=await  obj.AsNoTracking().ToListAsync();


                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<MovimientoUnidadOrg> Get(int id)
        {
            try
            {
                var entities = await _db.bdSetMovimientoUnidadOrg.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.Id == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(MovimientoUnidadOrg model)
        {
            try
            {

                _db.bdSetMovimientoUnidadOrg.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(MovimientoUnidadOrg model)
        {
            try
            {
                var _model = await _db.bdSetMovimientoUnidadOrg.FirstOrDefaultAsync(e => e.Id == model.Id);
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
                var _model = await _db.bdSetMovimientoUnidadOrg.FirstOrDefaultAsync(e => e.Id == id);
                if (_model != null)
                {
                    _db.bdSetMovimientoUnidadOrg.Remove(_model);
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
