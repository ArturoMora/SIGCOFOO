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
    public class CategoriasFamiliaRepository : IDisposable
    {
        //----------- AYUDA:
        // CategoriasFamiliaRepository: nombre de clase (y tipicamente el constructor)
        // FooDbContext.- tu Contexto : DbContext
        // CategoriasPorFamilias.- es el modelo
        // FooDbSet.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: FooDbSet =Categories                                  )
        // FooID.-  es el ID del modelo (ID de la tabla)


        SIGCOCHContext _db;
        public CategoriasFamiliaRepository()
        {
            _db = new SIGCOCHContext();
        }

        //public async Task<IEnumerable<CategoriasPorFamilias>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<CategoriasPorFamilia>> GetAll()
        {
            try
            {
                var entities = await _db.categoriasFamilia.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<CategoriasPorFamilia>> GetCategoryByPeriod(string id)
        {
            try
            {
                var entities = await _db.categoriasFamilia
                    .Where(e => e.Periodo == id)
                    .Include(e => e.FamiliaPuestos)
                    .AsNoTracking().ToListAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<CategoriasPorFamilia>> GetCategoryFam(int id)
        {
            try
            {
                var entities = await _db.categoriasFamilia
                    .Where(e => e.FamiliaId == id)
                    .AsNoTracking().ToListAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<CategoriasPorFamilia> Get(int id)
        {
            try
            {
                var entities = await _db.categoriasFamilia.AsNoTracking()
                    .Include(x=> x.FamiliaPuestos)
                    .Include(x => x.FamiliaPuestos.periodo)
                    .FirstOrDefaultAsync(e => e.CategoriaId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(CategoriasPorFamilia model)
        {
            try
            {

                _db.categoriasFamilia.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(CategoriasPorFamilia model)
        {
            try
            {
                var _model = await _db.categoriasFamilia.FirstOrDefaultAsync(e => e.CategoriaId == model.CategoriaId);
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
                var _model = await _db.categoriasFamilia.FirstOrDefaultAsync(e => e.FamiliaId == id);
                if (_model != null)
                {
                    _db.categoriasFamilia.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(CategoriasPorFamilia obj)
        {
            try
            {
                var _obj = await _db.categoriasFamilia.FirstOrDefaultAsync(e => e.CategoriaId == obj.CategoriaId);
                if (_obj != null)
                {
                    _obj.Estado = obj.Estado;
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
