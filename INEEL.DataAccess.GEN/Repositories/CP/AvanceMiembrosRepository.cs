using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CP;

namespace INEEL.DataAccess.GEN.Repositories.CP
{
    public class AvanceMiembrosRepository : IDisposable
    {

        private CP_Context _db;
        public AvanceMiembrosRepository()
        {
            _db = new CP_Context();
        }


        public async Task<IEnumerable<AvanceMiembros>> GetAll()
        {
            try
            {
                var entities = await _db.DbSetAvanceMiembros.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<AvanceMiembros> GetById(int id)
        {
            try
            {
                var entities = await _db.DbSetAvanceMiembros.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.AvanceMiembroId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Object[]> GetByAvance(int id)
        {
            try
            {
                var entities = await _db.DbSetAvanceMiembros.Where(e => e.AvanceId == id).Include(e=>e.Miembros).OrderByDescending(e=>e.FechaRegistro).AsNoTracking().ToListAsync();
                Object[] lista = new Object[entities.Count];
                foreach (var obj in entities)
                {
                    lista[entities.IndexOf(obj)] = new {obj.AvanceId
                                                        ,obj.idMiembro
                                                        ,Miembro=new { obj.Miembros.nombrePersona, obj.Miembros.idPersonas} 
                                                        ,obj.Participacion
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

        public async Task Create(AvanceMiembros model)
        {
            try
            {
                _db.DbSetAvanceMiembros.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(AvanceMiembros model)
        {
            try
            {
                var _model = await _db.DbSetAvanceMiembros.FirstOrDefaultAsync(e => e.AvanceMiembroId == model.AvanceMiembroId);
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
                var _model = await _db.DbSetAvanceMiembros.FirstOrDefaultAsync(e => e.AvanceMiembroId == id);
                if (_model != null)
                {
                    _db.DbSetAvanceMiembros.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task DeleteByAvance(int id)
        {
            try
            {
                var _model = await _db.DbSetAvanceMiembros.FirstOrDefaultAsync(e => e.AvanceId == id);
                if (_model != null)
                {
                    _db.DbSetAvanceMiembros.Remove(_model);
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
