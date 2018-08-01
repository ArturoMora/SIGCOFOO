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
    public class DetalleEvaluacionTecnicasRepository : IDisposable
    {
        //----------- AYUDA:
        // DetalleEvaluacionTecnicasRepository: nombre de clase (y tipicamente el constructor)
        // FooDbContext.- tu Contexto : DbContext
        // FooEntity.- es el modelo
        // FooDbSet.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: FooDbSet =Categories                                  )
        // FooID.-  es el ID del modelo (ID de la tabla)


        SIGCOCHContext _db;
        public DetalleEvaluacionTecnicasRepository()
        {
            _db = new SIGCOCHContext();
        }
             

        public async Task<IEnumerable<DetalleEvaluacionCompetenciasTecnicas>> GetAll()
        {
            try
            {
                var entities = await _db.detalleTecnicas.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<DetalleEvaluacionCompetenciasTecnicas>> GetByEmpleado(BusquedaNivel parametros)
        {
            try
            {
                var entities = await _db.detalleTecnicas
                    .Where(e => e.claveEmpleado == parametros.claveEmpleado)
                    .Where(e => e.periodoId == parametros.periodo)
                    .Include(e => e.competencia)
                    .Include(e => e.calificacion)
                    .AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<DetalleEvaluacionCompetenciasTecnicas>> GetByEmpleado2(string ClavePersona, string periodo)
        {
            try
            {
                var entities = await _db.detalleTecnicas
                    .Where(e => e.claveEmpleado == ClavePersona)
                    .Where(e => e.periodoId == periodo)
                    .Include(e => e.competencia)
                    .Include(e => e.calificacion)
                    .AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<DetalleEvaluacionCompetenciasTecnicas>> GetTopByPersona(String clavePersona)
        {
            try
            {
                var row = await _db.evaluacionesTecnicas
                       .Where(e => e.claveEmpleado == clavePersona)
                       .OrderByDescending(x => x.idPeriodo)
                    .AsNoTracking().FirstOrDefaultAsync();
                var max = new DateTime().Year.ToString();
                if (row != null)
                {
                    max = row.idPeriodo;
                }
                var entities = await _db.detalleTecnicas
                .Where(e => e.claveEmpleado == clavePersona)
                .Where(e => e.periodoId == max)
                .Include(e => e.competencia)
                .Include(e => e.calificacion)
                .AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<AuxiliarDatosTecnicas>> GetByEmpleadoAuxiliar(BusquedaNivel parametros)
        {
            try
            {

                List<AuxiliarDatosTecnicas> listaCompetencias = new List<AuxiliarDatosTecnicas>();


                var entities = await _db.detalleTecnicas
                    .Where(e => e.claveEmpleado == parametros.claveEmpleado)
                    .Where(e => e.periodoId == parametros.periodo)
                    .Include(e => e.competencia)
                    .Include(e => e.calificacion)
                    .AsNoTracking().ToListAsync();

                foreach (var item in entities)
                {

                    AuxiliarDatosTecnicas datos = new AuxiliarDatosTecnicas();
                    datos.claveEmpleado = item.claveEmpleado;
                    datos.competencia = item.competencia.Competencia;
                    datos.calificacionEvaluacionId = item.calificacionEvaluacionId;
                    datos.idCompetenciaTecnica = item.idCompetenciaTecnica;
                    datos.observaciones = item.observaciones;
                    datos.periodoId = item.periodoId;
                    listaCompetencias.Add(datos);

                }
                return listaCompetencias;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<DetalleEvaluacionCompetenciasTecnicas> Get(int id)
        {
            try
            {
                var entities = await _db.detalleTecnicas.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.detalleId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(DetalleEvaluacionCompetenciasTecnicas model)
        {
            try
            {

                var entities = await _db.detalleTecnicas.FirstOrDefaultAsync(e => e.idCompetenciaTecnica == model.idCompetenciaTecnica && e.claveEmpleado == model.claveEmpleado && e.periodoId == model.periodoId);
                if (entities != null)
                {
                    model.detalleId = entities.detalleId;
                    _db.Entry(entities).CurrentValues.SetValues(model);
                    await _db.SaveChangesAsync();
                }
                else
                {
                    _db.detalleTecnicas.Add(model);
                    await _db.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(DetalleEvaluacionCompetenciasTecnicas model)
        {
            try
            {
                var _model = await _db.detalleTecnicas.FirstOrDefaultAsync(e => e.detalleId == model.detalleId);
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
                var _model = await _db.detalleTecnicas.FirstOrDefaultAsync(e => e.detalleId == id);
                if (_model != null)
                {
                    _db.detalleTecnicas.Remove(_model);
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
