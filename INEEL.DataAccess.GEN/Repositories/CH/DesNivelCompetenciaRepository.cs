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
    public class DesNivelCompetenciaRepository : IDisposable
    {
        //----------- AYUDA:
        // DesNivelCompetenciaRepository: nombre de clase (y tipicamente el constructor)
        // FooDbContext.- tu Contexto : DbContext
        // DescripcionNivelCompetencias.- es el modelo
        // descripcionNivel.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: descripcionNivel =Categories                                  )
        // FooID.-  es el ID del modelo (ID de la tabla)


        private SIGCOCHContext _db;
        public DesNivelCompetenciaRepository()
        {
            _db = new SIGCOCHContext();
        }

        //public async Task<IEnumerable<DescripcionNivelCompetencias>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<DescripcionNivelCompetencias>> GetAll()
        {
            try
            {
                var entities = await _db.descripcionNivel.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<DescripcionNivelCompetencias> Get(int id)
        {
            try
            {
                var entities = await _db.descripcionNivel.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.descNivelId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<DescripcionNivelCompetencias> GetByNivel(BusquedaNivel parametros)
        {
            try
            {
                var entities = await _db.descripcionNivel.AsNoTracking()
                   .Where(e => e.Periodo == parametros.periodo)
                   .Where(e => e.CompetenciaID == parametros.idCompetencia)
                   .Where(e => e.Estado == 1)
                   .FirstOrDefaultAsync(e => e.NivelId == parametros.idNivel);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<DescripcionNivelCompetencias>> GetByCompetencia(BusquedaNivel parametros)
        {
            try
            {
                var entities = await _db.descripcionNivel
                    .Where(e => e.Periodo == parametros.periodo)
                    .Where(e => e.CompetenciaID == parametros.idCompetencia)
                    .Where(e => e.Estado == 1)
                    .Where(e => e.nivel.Estado == 1)
                    .Include(e=> e.nivel)

                    .AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(DescripcionNivelCompetencias model)
        {
            try
            {

                _db.descripcionNivel.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(DescripcionNivelCompetencias model)
        {
            try
            {
                var _model = await _db.descripcionNivel.FirstOrDefaultAsync(e => e.descNivelId == model.descNivelId);
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
                var _model = await _db.descripcionNivel.FirstOrDefaultAsync(e => e.descNivelId == id);
                if (_model != null)
                {
                    _db.descripcionNivel.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(DescripcionNivelCompetencias obj)
        {
            try
            {
                var _obj = await _db.descripcionNivel.FirstOrDefaultAsync(e => e.descNivelId == obj.descNivelId);
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
