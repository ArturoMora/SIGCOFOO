using INEEL.DataAccess.GEN.Models.GEN.CH.Entities;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CH;
using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class EvaluacionTecnicasRepository : IDisposable
    {
       
        SIGCOCHContext _db;
        public EvaluacionTecnicasRepository()
        {
            _db = new SIGCOCHContext();
        }
               
        public async Task<IEnumerable<EvaluacionEmpleadosCompetenciasTecnicas>> GetAll()
        {
            try
            {
                var entities = await _db.evaluacionesTecnicas.OrderBy(e => e.nombreEmpleado).AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<EvaluacionEmpleadosCompetenciasTecnicas>> GetByUnidadPeriodo(BusquedaNivel param)
        {
            try
            {
                var entities = await _db.evaluacionesTecnicas
                    .Where(e => e.claveArea == param.claveUnidad)
                    .Where(e => e.idPeriodo == param.periodo)
                    .Where(e => e.visible == 1)
                    .Include(e => e.calificacion)
                    .Include(e => e.estadoEvaluacion)
                    .Include(e => e.area)
                    .Include(e => e.nivel)
                    .OrderBy(e => e.nombreEmpleado)
                    .AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<EvaluacionEmpleadosCompetenciasTecnicas>> GetByAreaPeriodo(BusquedaNivel param)
        {
            try
            {
                var entities = await _db.evaluacionesTecnicas
                    .Where(e => e.nivelCompetencia == param.idNivel)
                    .Where(e => e.idPeriodo == param.periodo)
                    .Where(e => e.visible == 1)
                    .Include(e => e.calificacion)
                    .Include(e => e.estadoEvaluacion)
                    .Include(e => e.area)
                    .Include(e => e.nivel)
                    .OrderBy(e => e.nombreEmpleado)
                    .AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        
        public async Task<IEnumerable<EvaluacionEmpleadosCompetenciasTecnicas>> GetByPersonaPeriodo(BusquedaNivel param)
        {
            try
            {
                var entities = await _db.evaluacionesTecnicas
                    .Where(e => e.claveEmpleado == param.claveEmpleado)
                    .Where(e => e.idPeriodo == param.periodo)
                    .Where(e => e.visible == 1)
                    .Include(e => e.calificacion)
                    .Include(e => e.estadoEvaluacion)
                    .Include(e => e.area)
                    .Include(e => e.nivel)
                    .OrderBy(e => e.nombreEmpleado)
                    .AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task <EvaluacionEmpleadosCompetenciasTecnicas>  GetTopByPersona2(string claveEmpleado)
        {
            try
            {
                


                var entities = await _db.evaluacionesTecnicas
                    .Where(e => e.claveEmpleado == claveEmpleado)
                    .Include(e => e.calificacion)
                    .Include(e => e.calificacion)
                    .Include(e => e.estadoEvaluacion)
                    .Include(e => e.area)
                    .Include(e => e.nivel)
                    .OrderByDescending(e => e.idPeriodo)
                    .AsNoTracking().FirstOrDefaultAsync();


                if (entities == null)
                {

                    var busqueda = await _db.evaluacionesTecnicas
                    .Where(e => e.claveEmpleado == claveEmpleado)
                    .Include(e => e.calificacion)
                    .Include(e => e.calificacion)
                    .Include(e => e.estadoEvaluacion)
                    .Include(e => e.area)
                    .Include(e => e.nivel)
                    .OrderByDescending(e => e.idPeriodo)
                    .AsNoTracking().ToListAsync();

                    foreach (var obj in busqueda)
                    {

                        if (obj != null)
                        {
                            entities = obj;
                            break;
                        }
                    }
                }
                    return entities;




            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        //obtiene las evaluaciones del ultimo periodo disponible: ultimo año
        public async Task<IEnumerable<EvaluacionEmpleadosCompetenciasTecnicas>> GetTopByPersona(string claveEmpleado)
        {
            try
            {
                var entitie = await _db.evaluacionesTecnicas
                .Where(e => e.claveEmpleado == claveEmpleado)
                .OrderByDescending(e => e.idPeriodo)
                .AsNoTracking().FirstOrDefaultAsync();
                if (entitie != null)
                {
                    var entities = await _db.evaluacionesTecnicas
                      .Where(e => e.claveEmpleado == claveEmpleado)
                      .Where(e => e.idPeriodo == entitie.idPeriodo)
                      .Where(e => e.visible == 1)
                      .Include(e => e.calificacion)
                      .Include(e => e.estadoEvaluacion)
                      .Include(e => e.area)
                      .Include(e => e.nivel)
                      .OrderBy(e => e.nombreEmpleado)
                      .AsNoTracking().ToListAsync();
                    return entities;
                }
                else { return null; }
                
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<EvaluacionEmpleadosCompetenciasTecnicas>> GetTodosByUnidadPeriodo(BusquedaNivel param)
        {
            try
            {
                var entities = await _db.evaluacionesTecnicas
                    .Where(e => e.claveArea == param.claveUnidad)
                    .Where(e => e.idPeriodo == param.periodo)
                    .Include(e => e.calificacion)
                    .Include(e => e.estadoEvaluacion)
                    .Include(e => e.area)
                    .Include(e => e.nivel)
                    .OrderBy(e => e.nombreEmpleado)
                    .AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<EvaluacionEmpleadosCompetenciasTecnicas> Get(int id)
        {
            try
            {
                var entities = await _db.evaluacionesTecnicas.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.idEvaluacion == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task cargarEmpleadosPeriodo(string id)
        {
            try
            {

                PersonasRepository personal = new PersonasRepository();
                IEnumerable<Personas> listaPersonal = await personal.GetAllMAX();


                List<EvaluacionEmpleadosCompetenciasTecnicas> listaEvaluacion = new List<EvaluacionEmpleadosCompetenciasTecnicas>();


                var categoria = await _db.relacionCategoria.AsNoTracking().ToListAsync();

                foreach (var item in listaPersonal)
                {
                    EvaluacionEmpleadosCompetenciasTecnicas persona = new EvaluacionEmpleadosCompetenciasTecnicas();
                    persona.claveArea = item.ClaveUnidad;
                    persona.calificacionEvaluacionId = 5;
                    persona.brecha = "";

                    persona.claveCategoria = "";
                    persona.claveEmpleado = item.ClavePersona;
                    persona.estadoEvaluacionId = 1;
                    persona.idPeriodo = id;
                    persona.nivelCompetencia = 1;
                    persona.nombreEmpleado = item.NombreCompleto;
                    persona.tipoArea = 1;
                    persona.visible = 1;

                    foreach (var cat in categoria)
                    {
                        if (cat.ClaveCategoria.Equals(item.CategoriaId))
                        {
                          
                            persona.claveCategoria = cat.categoriaEmpleado;
                            break;
                        }

                    }


                    _db.evaluacionesTecnicas.Add(persona);


                }
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        
        public async Task<IEnumerable<AuxiliarDatosTecnicas>> GetByNivel(int nivel)
        {
            try
            {

                List<AuxiliarDatosTecnicas> listaCompetencias = new List<AuxiliarDatosTecnicas>();

                var entities = await _db.comptenciasTecnicas
                    .Where(e => e.nivelId == nivel)
                    .AsNoTracking().ToListAsync();

                foreach (var item in entities)
                {

                    AuxiliarDatosTecnicas datos = new AuxiliarDatosTecnicas();
                    datos.claveEmpleado = "";
                    datos.competencia = item.Competencia;
                    datos.calificacionEvaluacionId = 0;
                    datos.idCompetenciaTecnica = item.CompetenciaId;
                    datos.observaciones = "";
                    datos.periodoId = "";
                    listaCompetencias.Add(datos);

                }


                return listaCompetencias;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(EvaluacionEmpleadosCompetenciasTecnicas model)
        {
            try
            {

                _db.evaluacionesTecnicas.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(EvaluacionEmpleadosCompetenciasTecnicas model)
        {
            try
            {
                var _model = await _db.evaluacionesTecnicas.FirstOrDefaultAsync(e => e.idEvaluacion == model.idEvaluacion);
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
                var _model = await _db.evaluacionesTecnicas.FirstOrDefaultAsync(e => e.idEvaluacion == id);
                if (_model != null)
                {
                    _db.evaluacionesTecnicas.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(EvaluacionEmpleadosCompetenciasTecnicas obj)
        {
            try
            {
                var _obj = await _db.evaluacionesTecnicas.FirstOrDefaultAsync(e => e.idEvaluacion == obj.idEvaluacion);
                if (_obj != null)
                {
                    _obj.visible = obj.visible;
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<Grafica> GetGraficaResultados(BusquedaNivel param)
        {
            try
            {


                int cuentaExcede = 0;
                int cuentaCumple = 0;
                int cuentaparcial = 0;
                int cuentanocumple = 0;

                Grafica valoresgrafica = new Grafica();
                List<String> fecha = new List<string>();
                List<string> cumple = new List<string>();
                List<string> nocumple = new List<string>();
                List<string> excede = new List<string>();
                List<string> parcial = new List<string>();


                var entities = await _db.evaluacionesTecnicas
                                    .Where(e => e.claveArea == param.claveUnidad)
                                    .Where(e => e.idPeriodo == param.periodo)
                                    .Where(e => e.visible == 1)
                                    .Include(e => e.calificacion)
                                    .Include(e => e.estadoEvaluacion)
                                    .Include(e => e.area)
                                    .Include(e => e.nivel)
                                    .AsNoTracking().ToListAsync();

                  

                foreach (var item in entities)
                {

                    if (item.calificacionEvaluacionId == 4)
                    {
                        cuentaExcede = cuentaExcede + 1;
                    }

                    if (item.calificacionEvaluacionId == 3)
                    {
                        cuentaCumple = cuentaCumple + 1;
                    }

                    if (item.calificacionEvaluacionId == 2)
                    {
                        cuentaparcial = cuentaparcial + 1;
                    }

                    if (item.calificacionEvaluacionId == 1)
                    {
                        cuentanocumple = cuentanocumple + 1;
                    }

                }


                fecha.Add(param.periodo);
                excede.Add(cuentaExcede.ToString());
                cumple.Add(cuentaCumple.ToString());
                parcial.Add(cuentaparcial.ToString());
                nocumple.Add(cuentanocumple.ToString());

                valoresgrafica.Datos.Add(excede);
                valoresgrafica.Datos.Add(cumple);
                valoresgrafica.Datos.Add(parcial);
                valoresgrafica.Datos.Add(nocumple);
                valoresgrafica.Series = new List<string> { "Excede", "Cumple", "Cumple parcialmente", "No cumple" };
                valoresgrafica.Etiquetas.AddRange(fecha.ToList());

                return valoresgrafica;
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
