using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories
{
    public class VocabularioRepository : IDisposable
    {
        //----------- AYUDA:
        // VocabularioRepository: nombre de clase (y tipicamente el constructor)
        // GEN_Context.- tu Contexto : DbContext
        // Vocabulario.- es el modelo
        // dbSetVocabulario.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: dbSetVocabulario =Categories                                  )
        // VocabularioId.-  es el ID del modelo (ID de la tabla)


        private GEN_Context _db;
        public VocabularioRepository()
        {
            _db = new GEN_Context();
        }

        //public async Task<IEnumerable<Vocabulario>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<Vocabulario>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetVocabulario.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<Vocabulario>> GetAllLike(String search, int limit)
        {
            try
            {
                //var entities = await _db.dbSetVocabulario.AsNoTracking().ToListAsync();
                var entities = await _db.dbSetVocabulario
                    .Where(x=>x.VocabularioId.Contains(search.ToLower().Trim()))
                    .OrderBy(x=> x.VocabularioId)
                    .Skip(0).Take(limit).AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Vocabulario> GetIdAsync(String id) //metodo no async ni task
        {
            try
            {
                var entities = await _db.dbSetVocabulario
                    .AsNoTracking()
                    .FirstOrDefaultAsync(e => e.VocabularioId == id);                
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<ICollection<String>> GetVocabularioIdByCollection(HashSet<string> lista) //metodo no async ni task
        {
            try
            {
                var entities = await _db.dbSetVocabulario
                    .AsNoTracking()
                    .Where(x => lista.Contains(x.VocabularioId))
                    .Select(x=>x.VocabularioId)
                    .ToListAsync();                    
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        

        public async Task<VocabularioDocumento> GetVocabulariroDocumento(String vocabulario, long documento) //metodo no async ni task
        {
            try
            {
                var entities = await _db.dbSetVocabularioDocumento                    
                    .AsNoTracking()
                    .FirstOrDefaultAsync(e => e.VocabularioId == vocabulario && e.AdjuntoId==documento);
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public Vocabulario Get(String id) //metodo no async ni task
        {
            try
            {
                var entities = _db.dbSetVocabulario                    
                    .FirstOrDefault(e => e.VocabularioId == id);
                return entities;             

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(Vocabulario model)
        {
            try
            {

                _db.dbSetVocabulario.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task CreateVocabularioDocumento(VocabularioDocumento model)
        {
            try
            {

                _db.dbSetVocabularioDocumento.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Vocabulario> CreateAd(Vocabulario model)
        {
            try
            {

                _db.dbSetVocabulario.Add(model);
                await _db.SaveChangesAsync();
                return model;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(Vocabulario model)
        {
            try
            {
                var _model = await _db.dbSetVocabulario.FirstOrDefaultAsync(e => e.VocabularioId == model.VocabularioId);
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

        public async Task Delete(String id)
        {
            try
            {
                var _model = await _db.dbSetVocabulario.FirstOrDefaultAsync(e => e.VocabularioId == id);
                if (_model != null)
                {
                    _db.dbSetVocabulario.Remove(_model);
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
