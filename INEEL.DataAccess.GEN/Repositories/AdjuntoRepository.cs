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
    public class AdjuntoRepository : IDisposable
    {
        //----------- AYUDA:
        // AdjuntoRepository: nombre de clase (y tipicamente el constructor)
        // GEN_Context.- tu Contexto : DbContext
        // Adjunto.- es el modelo
        // dbSetAdjuntos.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: dbSetAdjuntos =Categories                                  )
        // AdjuntoId.-  es el ID del modelo (ID de la tabla)


        private GEN_Context _db;
        public AdjuntoRepository()
        {
            _db = new GEN_Context();
        }
        public AdjuntoRepository(GEN_Context db)
        {
            _db = db;
        }

        //public async Task<IEnumerable<Adjunto>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<Adjunto>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetAdjuntos.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Adjunto> GetAsync(long id) //metodo no async ni task
        {
            try
            {
                var entities = await _db.dbSetAdjuntos
                    .AsNoTracking()
                    .FirstOrDefaultAsync(e => e.AdjuntoId == id);                
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public Adjunto Get(long id) //metodo no async ni task
        {
            try
            {
                var entities = _db.dbSetAdjuntos                    
                    .FirstOrDefault(e => e.AdjuntoId == id);
                return entities;             

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(Adjunto model)
        {
            try
            {

                _db.dbSetAdjuntos.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Adjunto> RegistrarAdjunto(Adjunto Obj)
        {
            try
            {
                if (Obj.nombre.Length > 100)
                {
                    Obj.nombre = Obj.nombre.Substring(0, 100);
                }
                var result = _db.dbSetAdjuntos.Add(Obj);
                await _db.SaveChangesAsync();
                return (result);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<Adjunto> CreateAd(Adjunto model)
        {
            try
            {

                _db.dbSetAdjuntos.Add(model);
                await _db.SaveChangesAsync();
                return model;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(Adjunto model)
        {
            try
            {
                var _model = await _db.dbSetAdjuntos.FirstOrDefaultAsync(e => e.AdjuntoId == model.AdjuntoId);
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

        public async Task Delete(long id)
        {
            try
            {
                var _model = await _db.dbSetAdjuntos.FirstOrDefaultAsync(e => e.AdjuntoId == id);
                if (_model != null)
                {
                    _db.dbSetAdjuntos.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        
        public async Task Delete(long? id)
        {
            try
            {
                var _model = await _db.dbSetAdjuntos.FirstOrDefaultAsync(e => e.AdjuntoId == id);
                if (_model != null)
                {
                    _db.dbSetAdjuntos.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task DeleteByCollectionIds(List<long?> lista)
        {
            try
            {
                var _adjuntos = await _db.dbSetAdjuntos.Where(x => lista.Contains(x.AdjuntoId)).ToListAsync();
                if (_adjuntos != null)
                {
                    _db.dbSetAdjuntos.RemoveRange(_adjuntos);
                    await _db.SaveChangesAsync();
                }
            }catch(Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task DeleteByCollectionIds(List<long> lista)
        {
            try
            {
                var _adjuntos = await _db.dbSetAdjuntos.Where(x => lista.Contains(x.AdjuntoId)).ToListAsync();
                if (_adjuntos != null)
                {
                    _db.dbSetAdjuntos.RemoveRange(_adjuntos);
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
