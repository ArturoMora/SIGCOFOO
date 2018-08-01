using INEEL.DataAccess.GEN.Models.GEN.CH.Entities;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CH;
using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Linq;
using System.Linq.Dynamic;
using System.Text;
using System.Threading.Tasks;


namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class ClasificaCategoriasConductualesRepository : IDisposable
    {
        private SIGCOCHContext _db;
        public ClasificaCategoriasConductualesRepository()
        {
            _db = new SIGCOCHContext();
        }

        public async Task<IEnumerable<RelacionCategoriaNominaCompetencias>> GetAll()
        {
            try
            {
                var entities = await _db.relacionCategoria.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<RelacionCategoriaNominaCompetencias> Get(int id)
        {
            try
            {
                var entities = await _db.relacionCategoria.AsNoTracking()
                   .FirstOrDefaultAsync(e => e.RelacionId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        
        public async Task<IEnumerable<RelacionCategoriaNominaCompetencias>> GetByPeriodo(int id)
        {
            try
            {
                var entities = await _db.relacionCategoria
                     .Where(e => e.periodoId == id)
                     .Include(e => e.categoria)
                     .OrderByDescending(e => e.categoriaEmpleado)
                     .AsNoTracking().ToListAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<RelacionCategoriaNominaCompetencias>> GetByFamilia(int id)
        {
            try
            {
                var entities = await _db.relacionCategoria
                     .Where(e => e.FamiliaId == id)
                     .Include(e => e.categoria)
                     .Include(e => e.FamiliaPuestos)
                     .Include(e => e.periodo)
                     .OrderByDescending(e => e.categoriaEmpleado)
                     .AsNoTracking().ToListAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<Categoria>> GetCategoriasEmpleados()
        {
            try
            {
                CategoriasRepository categorias = new CategoriasRepository();
                IEnumerable<Categoria> listaCategorias = await categorias.GetAll();
                return listaCategorias;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(RelacionCategoriaNominaCompetencias model)
        {
            try
            {
                _db.relacionCategoria.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(RelacionCategoriaNominaCompetencias model)
        {
            try
            {
                var _model = await _db.relacionCategoria.FirstOrDefaultAsync(e => e.RelacionId == model.RelacionId);
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
                var _model = await _db.relacionCategoria.FirstOrDefaultAsync(e => e.RelacionId == id);
                if (_model != null)
                {
                    _db.relacionCategoria.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(RelacionCategoriaNominaCompetencias obj)
        {
            try
            {
                var _obj = await _db.relacionCategoria.FirstOrDefaultAsync(e => e.RelacionId == obj.RelacionId);
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

