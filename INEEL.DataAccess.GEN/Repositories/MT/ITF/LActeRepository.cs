using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.MT.Models.ITF;
using System.Linq;
using System.Linq.Dynamic;

namespace INEEL.DataAccess.GEN.Repositories.MT.ITF
{
    public class LActeRepository : IDisposable
    {
        //----------- AYUDA:
        // LActeRepository: nombre de clase (y tipicamente el constructor)
        // MT_Context.- tu Contexto : DbContext
        // LActe.- es el modelo
        // dbSetLActes.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: dbSetLActes =Categories                                  )
        // LActeId.-  es el ID del modelo (ID de la tabla)
                       

        private MT_Context _db;
        public LActeRepository()
        {              
            _db = new MT_Context();
        }                      

        //public async Task<IEnumerable<LActe>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<LActe>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetLActes.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<LActe> Get(int id)
        {
            try
            {
                var entities = await _db.dbSetLActes.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.LActeId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(LActe model)
        {
            try
            {

                _db.dbSetLActes.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(LActe model)
        {
            try
            {
                var _model = await _db.dbSetLActes.FirstOrDefaultAsync(e => e.LActeId == model.LActeId);
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
                var _model = await _db.dbSetLActes.FirstOrDefaultAsync(e => e.LActeId == id);
                if (_model != null)
                {
                    _db.dbSetLActes.Remove(_model);
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

        //Para Back-End pero como encontrar el nombre
        public async Task<IEnumerable<LActe>> GetWord(string Palabra)
        {
            try {
                //var entities = await _db.dbSetLActes
                //    .AsNoTracking()
                //    .Where(e => e.Negociacion.Contains(Palabra)
                //    || e.Desarrollo.Contains(Palabra)
                //    || e.Cierre.Contains(Palabra))
                //    .ToListAsync();
                var v = (from a in _db.dbSetLActes select a);

                if (!String.IsNullOrEmpty(Palabra))
                {
                    var pal = Palabra.Split(' ');
                    foreach (var pa in pal)
                    {
                        var p = pa.ToLower();
                        v = v.Where(e =>
                        e.Negociacion.ToLower().Contains(p)
                    || e.Desarrollo.ToLower().Contains(p)
                    || e.Cierre.ToLower().Contains(p));
                    }
                }
                var entities = await v.AsNoTracking().ToListAsync();

                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


    }
}
