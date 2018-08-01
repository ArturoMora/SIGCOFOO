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
    public class DesNivelComportamientoRepository : IDisposable
    {
        //----------- AYUDA:
        // DesNivelComportamientoRepository: nombre de clase (y tipicamente el constructor)
        // FooDbContext.- tu Contexto : DbContext
        // DescripcionNivelComportamiento.- es el modelo
        // descripcionComportamiento.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: descripcionComportamiento =Categories                                  )
        // FooID.-  es el ID del modelo (ID de la tabla)


        private SIGCOCHContext _db;
        public DesNivelComportamientoRepository()
        {
            _db = new SIGCOCHContext();
        }

        //public async Task<IEnumerable<DescripcionNivelComportamiento>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<DescripcionNivelComportamiento>> GetAll()
        {
            try
            {
                var entities = await _db.descripcionComportamiento.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<DescripcionNivelComportamiento> Get(int id)
        {
            try
            {
                var entities = await _db.descripcionComportamiento.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.DescComportamientoId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<DescripcionNivelComportamiento> GetByNivel(BusquedaNivel parametros)
        {
            try
            {
                var entities = await _db.descripcionComportamiento.AsNoTracking()
                    .Where(e => e.Periodo == parametros.periodo)
                    .Where(e => e.CompetenciaID == parametros.idCompetencia )
                    .FirstOrDefaultAsync(e => e.NivelId == parametros.idNivel);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task Create(DescripcionNivelComportamiento model)
        {
            try
            {

                _db.descripcionComportamiento.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(DescripcionNivelComportamiento model)
        {
            try
            {
                var _model = await _db.descripcionComportamiento.FirstOrDefaultAsync(e => e.DescComportamientoId == model.DescComportamientoId);
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
                var _model = await _db.descripcionComportamiento.FirstOrDefaultAsync(e => e.DescComportamientoId == id);
                if (_model != null)
                {
                    _db.descripcionComportamiento.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(DescripcionNivelComportamiento obj)
        {
            try
            {
                var _obj = await _db.descripcionComportamiento.FirstOrDefaultAsync(e => e.DescComportamientoId == obj.DescComportamientoId);
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
