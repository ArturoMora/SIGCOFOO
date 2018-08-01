using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CH;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class FamiliasPuestosRepository : IDisposable
    {
        //----------- AYUDA:
        // FamiliasPuestosRepository: nombre de clase (y tipicamente el constructor)
        // FooDbContext.- tu Contexto : DbContext
        // FamiliasPuestos.- es el modelo
        // FamiliasPuestos.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: FamiliasPuestos =Categories                                  )
        // FooID.-  es el ID del modelo (ID de la tabla)


        private SIGCOCHContext _db;
        public FamiliasPuestosRepository()
        {
            _db = new SIGCOCHContext();
        }

        //public async Task<IEnumerable<FamiliasPuestos>> OtrosMetodos(){ ... }
        public async Task<int> countByStatus(int estadoFlujo)
        {
            try
            {
                return await (from t in _db.familiaPuestos
                               .Where(f => f.estado == estadoFlujo)
                              select t).CountAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<FamiliasPuestos>> GetAll()
        {
            try
            {
                var entities = await _db.familiaPuestos
                    .Where(e => e.estado == 1)
                    .AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<FamiliasPuestos> Get(int id)
        {
            try
            {
                var entities = await _db.familiaPuestos.AsNoTracking()
                    .Where(e => e.estado == 1)
                    .Include(x=> x.periodo)
                    .FirstOrDefaultAsync(e => e.FamiliaId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<FamiliasPuestos>> GetByPeriod(int id)
        {
            try
            {
                var entities = await _db.familiaPuestos
                    .Where(e => e.estado == 1)
                    .Where(e => e.periodoId == id)
                    .AsNoTracking().ToListAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(FamiliasPuestos model)
        {
            try
            {

                _db.familiaPuestos.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(FamiliasPuestos model)
        {
            try
            {
                var _model = await _db.familiaPuestos.FirstOrDefaultAsync(e => e.FamiliaId == model.FamiliaId);
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
                var _model = await _db.familiaPuestos.FirstOrDefaultAsync(e => e.FamiliaId == id);
                if (_model != null)
                {
                    _db.familiaPuestos.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(FamiliasPuestos obj)
        {
            try
            {
                var _obj = await _db.familiaPuestos.FirstOrDefaultAsync(e => e.FamiliaId == obj.FamiliaId);
                if (_obj != null)
                {
                    _obj.estado = obj.estado;
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
