using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.MT.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.MT
{
    public class InformeBecarioRepository : IDisposable
    {
        //----------- AYUDA:
        // InformeBecarioRepository: nombre de clase (y tipicamente el constructor)
        // MT_Context.- tu Contexto : DbContext
        // InformeBecario.- es el modelo
        // dbSetInformeBecario.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: dbSetInformeBecario =Categories                                  )
        // InformeBecarioId.-  es el ID del modelo (ID de la tabla)


        private MT_Context _db;
        public InformeBecarioRepository()
        {
            _db = new MT_Context();
        }

        public async Task<IEnumerable<InformeBecario>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetInformeBecario.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public InformeBecario Get_(int id)
        {
            try
            {
                var entities = _db.dbSetInformeBecario
                    // .Include(x=> x.FK)
                    .FirstOrDefault(e => e.InformeBecarioId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<InformeBecario> GetById(int id)
        {
            try
            {
                var entities = await _db.dbSetInformeBecario.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.InformeBecarioId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

   

        public async Task Create(InformeBecario model)
        {
            try
            {

                _db.dbSetInformeBecario.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(InformeBecario model)
        {
            try
            {
                var _model = await _db.dbSetInformeBecario.FirstOrDefaultAsync(e => e.InformeBecarioId == model.InformeBecarioId);
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

        public async Task UpdateEstado(InformeBecario model)
        {
            try
            {
                var _model = await _db.dbSetInformeBecario.FirstOrDefaultAsync(e => e.InformeBecarioId == model.InformeBecarioId);
                if (_model != null)
                {
                    _model.Estado = model.Estado;
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
                var _model = await _db.dbSetInformeBecario.FirstOrDefaultAsync(e => e.InformeBecarioId == id);
                if (_model != null)
                {
                    _db.dbSetInformeBecario.Remove(_model);
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
