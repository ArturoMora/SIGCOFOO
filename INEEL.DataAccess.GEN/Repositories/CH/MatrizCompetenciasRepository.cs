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
    public class MatrizCompetenciasRepository : IDisposable
    {
        //----------- AYUDA:
        // MatrizCompetenciasRepository: nombre de clase (y tipicamente el constructor)
        // FooDbContext.- tu Contexto : DbContext
        // FooEntity.- es el modelo
        // FooDbSet.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: FooDbSet =Categories                                  )
        // FooID.-  es el ID del modelo (ID de la tabla)


        private SIGCOCHContext _db;
        public MatrizCompetenciasRepository()
        {
            _db = new SIGCOCHContext();
        }

        //public async Task<IEnumerable<FooEntity>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<MatrizCompetencias>> GetAll()
        {
            try
            {
                var entities = await _db.matrizcompetencias.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<MatrizCompetencias>> GetMatriz(int categoria)
        {
            try
            {
                var entities = await _db.matrizcompetencias
                    .Where(e => e.categoriaId == categoria)
                    .Where(e => e.estado == 1)
                    .Include(e => e.categoria)
                    .Include(e => e.descnivel)
                    .Include(e => e.descnivel.nivel)
                    .Include(e => e.competencia)
                   
                    .AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<MatrizCompetencias> Get(int id)
        {
            try
            {
                var entities = await _db.matrizcompetencias.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.matrizId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<MatrizCompetencias> GetNivelSeleccionado(BusquedaNivel param)
        {
            try
            {
                var entities = await _db.matrizcompetencias.AsNoTracking()
                    .Where(e => e.categoriaId == param.idCategoria)
                    .Where(e => e.competenciaId == param.idCompetencia)
                    .Where(e => e.estado == 1)
                    .FirstOrDefaultAsync(e => e.periodo == param.periodo);

                if (entities == null) {

                   MatrizCompetencias mat = new MatrizCompetencias();
                    mat.categoria = null;
                    mat.categoriaId = 0;
                    mat.competencia = null;
                    mat.competenciaId = 0;
                    mat.descnivel = null;
                    mat.nivelId = 0;
                    mat.periodo = "";
                    mat.matrizId = 0;

                    entities = mat;
                }


                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        

        public async Task Create(MatrizCompetencias model)
        {
            try
            {

                _db.matrizcompetencias.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(MatrizCompetencias model)
        {
            try
            {
                var _model = await _db.matrizcompetencias.FirstOrDefaultAsync(e => e.matrizId == model.matrizId);
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
                var _model = await _db.matrizcompetencias.FirstOrDefaultAsync(e => e.matrizId == id);
                if (_model != null)
                {
                    _db.matrizcompetencias.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(MatrizCompetencias obj)
        {
            try
            {
                var _obj = await _db.matrizcompetencias.FirstOrDefaultAsync(e => e.matrizId == obj.matrizId);
                if (_obj != null)
                {
                    _obj.estado = obj.estado;
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
