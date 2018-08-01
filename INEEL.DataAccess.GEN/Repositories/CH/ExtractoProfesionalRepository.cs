using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CH;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class ExtractoProfesionalRepository : IDisposable
    {
        //----------- AYUDA:
        // ExtractoProfesionalRepository: nombre de clase (y tipicamente el constructor)
        // SIGCOCHContext.- tu Contexto : DbContext
        // ExtractoProfesional.- es el modelo
        // dbSetExtractoProfesional.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: dbSetExtractoProfesional =Categories                                  )
        // ClaveEmpleado.-  es el ID del modelo (ID de la tabla)


        private SIGCOCHContext _db;
        public ExtractoProfesionalRepository()
        {
            _db = new SIGCOCHContext();
        }

        //public async Task<IEnumerable<ExtractoProfesional>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<ExtractoProfesional>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetExtractoProfesional.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<ExtractoProfesional> Get(string id)
        {
            try
            {
                var entities = await _db.dbSetExtractoProfesional.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.ClaveEmpleado == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(ExtractoProfesional model)
        {
            try
            {
                var extracto = await _db.dbSetExtractoProfesional
                    .FirstOrDefaultAsync(e => e.ClaveEmpleado == model.ClaveEmpleado);
                if (extracto == null)
                {
                    _db.dbSetExtractoProfesional.Add(model);
                    await _db.SaveChangesAsync();
                }
                else
                {
                    await this.Update(model);
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(ExtractoProfesional model)
        {
            try
            {
                var _model = await _db.dbSetExtractoProfesional.FirstOrDefaultAsync(e => e.ClaveEmpleado == model.ClaveEmpleado);
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

        public async Task Delete(string id)
        {
            try
            {
                var _model = await _db.dbSetExtractoProfesional.FirstOrDefaultAsync(e => e.ClaveEmpleado == id);
                if (_model != null)
                {
                    _db.dbSetExtractoProfesional.Remove(_model);
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
