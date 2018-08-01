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
    public class DetalleEvaluacionConductualesRepository : IDisposable
    {
        //----------- AYUDA:
        // DetalleConductualesRepository: nombre de clase (y tipicamente el constructor)
        // FooDbContext.- tu Contexto : DbContext
        // FooEntity.- es el modelo
        // FooDbSet.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: FooDbSet =Categories                                  )
        // FooID.-  es el ID del modelo (ID de la tabla)


        private SIGCOCHContext _db;
        public DetalleEvaluacionConductualesRepository()
        {
            _db = new SIGCOCHContext();
        }

        //public async Task<IEnumerable<FooEntity>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<DetalleEvaluacionCompetenciasConductuales>> GetAll()
        {
            try
            {
                var entities = await _db.detalleConductuales.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        
        public async Task<IEnumerable<DetalleEvaluacionCompetenciasConductuales>> GetByClaveEvaluacion(int clave)
        {
            try
            {
                var entities = await _db.detalleConductuales
                    .Where( e => e.claveEvaluacion == clave)
                    .Include(e => e.matriz)
                    .Include(e => e.matriz.competencia)
                    .Include(e => e.matriz.descnivel)
                    .Include(e => e.matriz.descnivel.nivel)
                    .AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<AuxilarDatosConductuales>> GetByClaveEvaluacionResultado(int clave)
        {
            try
            {

                List<AuxilarDatosConductuales> listaCompetencias = new List<AuxilarDatosConductuales>();

                var entities = await _db.detalleConductuales
                    .Where(e => e.claveEvaluacion == clave)
                   
                    .Include(e => e.matriz)
                      
                    .Include(e => e.matriz.competencia)
                    .Include(e => e.matriz.descnivel)
                    .Include(e => e.matriz.descnivel.nivel)
                    .AsNoTracking().ToListAsync();
                
                foreach (var item in entities)
                {

                    AuxilarDatosConductuales datos = new AuxilarDatosConductuales();
                    datos.claveEvaluacion = item.claveEvaluacion;
                    datos.competencia = item.matriz.competencia.Competencia;
                    datos.comportamiento = item.matriz.descnivel.Comportamiento;
                    datos.justificacion = item.justificacion;
                    datos.MatrizId = item.MatrizId;
                    datos.nivel = item.matriz.descnivel.nivel.Descripcion;
                    datos.valorReal = item.valorReal;

                    listaCompetencias.Add(datos);

                }

                return listaCompetencias;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<DetalleEvaluacionCompetenciasConductuales> Get(int id)
        {
            try
            {
                var entities = await _db.detalleConductuales.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.DetalleId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<DetalleEvaluacionCompetenciasConductuales> GetByMatriz(int id)
        {
            try
            {
                var entities = await _db.detalleConductuales.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.MatrizId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<DetalleEvaluacionCompetenciasConductuales> GetByMatrizEvaluacion(BusquedaNivel param)
        {
            try
            {
                var entities = await _db.detalleConductuales.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.MatrizId == param.matrizId && e.claveEvaluacion == param.claveEvaluacion);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(DetalleEvaluacionCompetenciasConductuales model)
        {
            try
            {

                    var entities = await _db.detalleConductuales
                        .FirstOrDefaultAsync(e => e.MatrizId == model.MatrizId && e.claveEvaluacion == model.claveEvaluacion);


                    if (entities != null)
                    {
                        model.DetalleId = entities.DetalleId;
                        _db.Entry(entities).CurrentValues.SetValues(model);
                        await _db.SaveChangesAsync();
                    }
                    else
                    {
                        _db.detalleConductuales.Add(model);
                        await _db.SaveChangesAsync();
                    }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(DetalleEvaluacionCompetenciasConductuales model)
        {
            try
            {
                var _model = await _db.detalleConductuales.FirstOrDefaultAsync(e => e.DetalleId == model.DetalleId);
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
                var _model = await _db.detalleConductuales.FirstOrDefaultAsync(e => e.DetalleId == id);
                if (_model != null)
                {
                    _db.detalleConductuales.Remove(_model);
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
