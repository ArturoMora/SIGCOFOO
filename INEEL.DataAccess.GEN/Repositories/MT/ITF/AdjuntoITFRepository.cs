using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.MT.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.MT.ITF
{
    public class AdjuntoITFRepository : IDisposable
    {
        //----------- AYUDA:
        // AdjuntoITFRepository: nombre de clase (y tipicamente el constructor)
        // FooDbContext.- tu Contexto : DbContext
        // AdjuntoITF.- es el modelo
        // dbSetAdjuntosITF.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: dbSetAdjuntosITF =Categories                                  )
        // AdjuntoITFId.-  es el ID del modelo (ID de la tabla)


        private MT_Context _db;
        public AdjuntoITFRepository()
        {
            _db = new MT_Context();
        }
        public async Task<Boolean> CreateAll(List<AdjuntoITF> lista)
        {
            try
            {
                foreach (var model in lista)
                {

                    _db.dbSetAdjuntosITF.Add(model);

                }
                await _db.SaveChangesAsync();
                return true;

            }
            catch (Exception e)
            {
                //throw new Exception(e.Message, e);
                return false;
            }
        }
        public async Task<Boolean> CreateAllSeg(List<AdjuntoITF> lista)
        {
            try
            {
                foreach (var model in lista)
                {
                    try
                    {
                        _db.dbSetAdjuntosITF.Add(model);
                        await _db.SaveChangesAsync();
                    }
                    catch (Exception e)
                    {
                        _db = new MT_Context();
                    }

                }
                await _db.SaveChangesAsync();
                return true;

            }
            catch (Exception e)
            {
                //throw new Exception(e.Message, e);
                return false;
            }
        }
        //public async Task<IEnumerable<AdjuntoITF>> OtrosMetodos(){ ... }
        public async Task UpdateSetProcesado(IEnumerable<int> listaAdjuntoITFId)
        {
            try
            {
                var rows = await _db.dbSetAdjuntosITF
                 .Where(x => listaAdjuntoITFId.Contains(x.AdjuntoITFId))
                 .ToListAsync();

                rows.ForEach(r => r.Procesado = true);

                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<AdjuntoITF>> GetAllUnprocesing()
        {
            try
            {
                var entities = await _db.dbSetAdjuntosITF.AsNoTracking()
                    .Include(x=>x.Adjunto)
                    .Where(x=>x.Procesado==false)
                    .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<AdjuntoITF>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetAdjuntosITF.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<AdjuntoITF> Get(int id)
        {
            try
            {
                var entities = await _db.dbSetAdjuntosITF.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.AdjuntoITFId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(AdjuntoITF model)
        {
            try
            {

                _db.dbSetAdjuntosITF.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(AdjuntoITF model)
        {
            try
            {
                var _model = await _db.dbSetAdjuntosITF.FirstOrDefaultAsync(e => e.AdjuntoITFId == model.AdjuntoITFId);
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
                var _model = await _db.dbSetAdjuntosITF.FirstOrDefaultAsync(e => e.AdjuntoITFId == id);
                if (_model != null)
                {
                    _db.dbSetAdjuntosITF.Remove(_model);
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
