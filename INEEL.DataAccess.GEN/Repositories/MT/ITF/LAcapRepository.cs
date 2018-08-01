using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.MT.Models.ITF;
using System.Linq;
using System.Linq.Dynamic;
using INEEL.DataAccess.MT.Models;

namespace INEEL.DataAccess.GEN.Repositories.MT.ITF
{
    public class LAcapRepository : IDisposable
    {
        //----------- AYUDA:
        // LAcapRepository: nombre de clase (y tipicamente el constructor)
        // MT_Context.- tu Contexto : DbContext
        // LAcap.- es el modelo
        // dbSetLAcaps.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: dbSetLAcaps =Categories                                  )
        // LAcapId.-  es el ID del modelo (ID de la tabla)

                              
        private MT_Context _db;
        public LAcapRepository()            
        {
            _db = new MT_Context();
        }

        //public async Task<IEnumerable<LAcap>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<LAcap>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetLAcaps.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<LAcap> Get(int id)
        {
            try
            {
                var entities = await _db.dbSetLAcaps.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.LAcapId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
                                 


        public async Task Create(LAcap model)
        {
            try
            {

                _db.dbSetLAcaps.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(LAcap model)
        {
            try
            {
                var _model = await _db.dbSetLAcaps.FirstOrDefaultAsync(e => e.LAcapId == model.LAcapId);
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
                var _model = await _db.dbSetLAcaps.FirstOrDefaultAsync(e => e.LAcapId == id);
                if (_model != null)
                {
                    _db.dbSetLAcaps.Remove(_model);
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

        //Para Back-End pero como encontrar el nombre de adjunto? y dentro de archivos?
        public async Task<IEnumerable<InformeTecnicoFinal>> GetWord(string Palabra)
        {
            try
            {
                //var entities = await _db.dbSetLAcaps
                //    .AsNoTracking()
                //    .Where(e => e.Instalaciones.Contains(Palabra)
                //    || e.Servicios.Contains(Palabra))
                //    .ToListAsync();


                var v = (from a in _db.dbSetInformeTFs
                         .Include(e => e.Proyecto)
                         .Include(e => e.LAcap)
                         .Include("InformeTFRepository")
                         select a);

                if (!String.IsNullOrEmpty(Palabra))
                {
                    var pal = Palabra.Split(' ');
                    foreach (var pa in pal)
                    {
                        var p = pa.ToLower();
                        v = v.Where(e =>
                        e.LAcap.Instalaciones.ToLower().Contains(p)
                    || e.LAcap.Servicios.ToLower().Contains(p));
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
