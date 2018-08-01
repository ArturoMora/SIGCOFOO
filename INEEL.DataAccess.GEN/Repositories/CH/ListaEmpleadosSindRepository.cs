using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CH;

using INEEL.DataAccess.GEN.Models.GEN.CH.Entities;
using INEEL.DataAccess.GEN.Models.GEN;

using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Linq;
using System.Linq.Dynamic;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class ListaEmpleadosSindRepository : IDisposable
    {

        private SIGCOCHContext _db;
        public ListaEmpleadosSindRepository()
        {
            _db = new SIGCOCHContext();
        }

        public async Task<IEnumerable<ListadoEmpleadosSind>> GetAll()
        {
            try
            {
                var entities = await _db.listadoEmpleadosSind.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<ListadoEmpleadosSind>> GetAllDistinc()
        {
            try
            {
                var entities = await _db.listadoEmpleadosSind.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<ResultadoEvaluacionSindicalizado> GetByPeriodo(BusquedaNivel parametros)
        {
            try
            {

                ResultadoEvaluacionSindicalizado resultadoEvaluacion = new ResultadoEvaluacionSindicalizado();

                //CalificacionSindRepository repCalificacionSindicalizados = new CalificacionSindRepository();
                //IEnumerable<CalificacionSind> calificaciones = await repCalificacionSindicalizados.GetAll();
                
                var entities = await _db.listadoEmpleadosSind.AsNoTracking().FirstOrDefaultAsync(e => e.NoEmpleado == parametros.claveEmpleado);

                EvaluacionEmpleadoSindRepository repEvaluacionSindicalizados = new EvaluacionEmpleadoSindRepository();
                EvaluacionEmpleadosSind evaluacion = await repEvaluacionSindicalizados.GetByPeriodo(entities.ListaId,parametros.periodo);

                RegistroEvaluacionSindRepository repRegistroEvaluacion = new RegistroEvaluacionSindRepository();
                                                     
                
                resultadoEvaluacion.idEmpleado = entities;
                resultadoEvaluacion.RegistroEvaluacion = evaluacion;
                resultadoEvaluacion.Competencias = await repRegistroEvaluacion.CompetenciasEvaluadas(evaluacion.EvaluacionId); 

                return resultadoEvaluacion;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        
        public async Task<Object> competencias(string noEmpleado)
        {

            PersonasRepository ObjetoPersona = new PersonasRepository();
            Personas persona = await ObjetoPersona.GetByClave(noEmpleado);

            int datosConductuales = 0;
            int datostecnicas = 0;

            try
            {
                var resultado = new Object();


                if (persona.TipoPersonalId.Equals("SIN") || persona.TipoPersonalId.Equals("ADM"))
                {

                    var entities = await _db.listadoEmpleadosSind.AsNoTracking().FirstOrDefaultAsync(e => e.NoEmpleado == noEmpleado);

                    if (entities != null)
                    {
                        EvaluacionEmpleadoSindRepository repEvaluacionSindicalizados = new EvaluacionEmpleadoSindRepository();
                        EvaluacionEmpleadosSind evaluacion = await repEvaluacionSindicalizados.Get(entities.ListaId);
                        RegistroEvaluacionSindRepository repRegistroEvaluacion = new RegistroEvaluacionSindRepository();

                        ResultadoEvaluacionSindicalizado resultadoEvaluacion = new ResultadoEvaluacionSindicalizado();
                        resultadoEvaluacion.idEmpleado = entities;
                        resultadoEvaluacion.RegistroEvaluacion = evaluacion;
                        resultadoEvaluacion.Competencias = await repRegistroEvaluacion.CompetenciasEvaluadas(evaluacion.EvaluacionId);


                        EvaluacionEmpleadosCompetenciasConductuales evaluacionConductualDoble = new EvaluacionEmpleadosCompetenciasConductuales();
                        EvaluacionConductualesRepository evaluacionRepository = new EvaluacionConductualesRepository();
                        DetalleEvaluacionConductualesRepository detalleRepository = new DetalleEvaluacionConductualesRepository();

                        evaluacionConductualDoble = await evaluacionRepository.GetTopByPersona(noEmpleado);

                        if (evaluacionConductualDoble != null)
                        {
                            var detalleEvaluacion = await detalleRepository.GetByClaveEvaluacionResultado(evaluacionConductualDoble.claveEvaluacion);
                            if (detalleEvaluacion != null)
                            {
                                var conductual = new { datosEvaluado = evaluacionConductualDoble, competencias = detalleEvaluacion };
                                resultado = new { TipoPersonalId = persona.TipoPersonalId, info = resultadoEvaluacion, conductuales = conductual, incluyeConductuales = 2, incluyeSindicalizados = 1, incluyeTecnicas = 0 };
                            }
                            else
                            {
                                resultado = new { TipoPersonalId = persona.TipoPersonalId, info = resultadoEvaluacion, incluyeConductuales = 0, incluyeSindicalizados = 1, incluyeTecnicas = 0 };
                            }
                        }
                        else
                        {
                            resultado = new { TipoPersonalId = persona.TipoPersonalId, info = resultadoEvaluacion, incluyeConductuales = 0, incluyeSindicalizados = 1, incluyeTecnicas = 0 };
                        }
                    }
                    else {                                           
                        EvaluacionEmpleadosCompetenciasConductuales evaluacionConductual = new EvaluacionEmpleadosCompetenciasConductuales();
                        EvaluacionConductualesRepository evaluacionRepository = new EvaluacionConductualesRepository();
                        DetalleEvaluacionConductualesRepository detalleRepository = new DetalleEvaluacionConductualesRepository();

                        var conductual = new object();

                        evaluacionConductual = await evaluacionRepository.GetTopByPersona(noEmpleado);
                        if (evaluacionConductual != null)
                        {
                            var detalleEvaluacion = await detalleRepository.GetByClaveEvaluacionResultado(evaluacionConductual.claveEvaluacion);
                            conductual = new { datosEvaluado = evaluacionConductual, competencias = detalleEvaluacion };

                            if (detalleEvaluacion != null)
                                datosConductuales = 1;
                            else
                                datosConductuales = 0;
                        }


                        //DATOS DEL PERSONAL DE BASE
                        resultado = new { TipoPersonalId = persona.TipoPersonalId, conductuales = conductual, incluyeConductuales = datosConductuales, incluyeSindicalizados = 0, incluyeTecnicas = 0 };


                    }

                }
                else
                {

                     datosConductuales = 0;
                     datostecnicas = 0;


                    EvaluacionEmpleadosCompetenciasConductuales evaluacionConductual = new EvaluacionEmpleadosCompetenciasConductuales();
                    EvaluacionConductualesRepository evaluacionRepository = new EvaluacionConductualesRepository();
                    DetalleEvaluacionConductualesRepository detalleRepository = new DetalleEvaluacionConductualesRepository();

                    var conductual = new object();

                    evaluacionConductual = await evaluacionRepository.GetTopByPersona(noEmpleado);
                    if (evaluacionConductual != null)
                    {
                        var detalleEvaluacion =await  detalleRepository.GetByClaveEvaluacionResultado(evaluacionConductual.claveEvaluacion);
                         conductual = new { datosEvaluado = evaluacionConductual, competencias = detalleEvaluacion };

                        if(detalleEvaluacion != null)
                           datosConductuales = 1;
                        else
                            datosConductuales = 0;
                    }

                    
                    EvaluacionEmpleadosCompetenciasTecnicas eval = new EvaluacionEmpleadosCompetenciasTecnicas();
                    EvaluacionTecnicasRepository evaluacionTecRepository = new EvaluacionTecnicasRepository();
                    DetalleEvaluacionTecnicasRepository detalleTecRepository = new DetalleEvaluacionTecnicasRepository();

                    eval = await evaluacionTecRepository.GetTopByPersona2(noEmpleado);

                    var tecnica = new Object();
                    if (eval != null)
                    {
                        var detalleEvaluacionTec = await detalleTecRepository.GetByEmpleado2(noEmpleado, eval.idPeriodo);
                        tecnica = new { datosEvaluado = eval, competencias = detalleEvaluacionTec };

                        if (detalleEvaluacionTec != null)
                            datostecnicas = 1;
                        else
                            datostecnicas = 0;
                    }

                   

                    //DATOS DEL PERSONAL DE BASE
                    resultado = new { TipoPersonalId = persona.TipoPersonalId, conductuales = conductual, tecnicas = tecnica, incluyeConductuales = datosConductuales, incluyeSindicalizados = 0, incluyeTecnicas = datostecnicas };

                }

                return resultado;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<Object> misEvaluacionesConductuales(BusquedaNivel parametros)
        {

            PersonasRepository ObjetoPersona = new PersonasRepository();
            Personas persona = await ObjetoPersona.GetByClave(parametros.claveEmpleado);

            try
            {
                var resultado = new Object();

                if (persona.TipoPersonalId.Equals("SIN") || persona.TipoPersonalId.Equals("ADM"))
                {
                    var entities = await _db.listadoEmpleadosSind.AsNoTracking().FirstOrDefaultAsync(e => e.NoEmpleado == parametros.claveEmpleado);

                    if (entities != null)
                    {
                        EvaluacionEmpleadoSindRepository repEvaluacionSindicalizados = new EvaluacionEmpleadoSindRepository();
                        EvaluacionEmpleadosSind evaluacion = await repEvaluacionSindicalizados.GetByPeriodo(entities.ListaId, parametros.periodo);
                        RegistroEvaluacionSindRepository repRegistroEvaluacion = new RegistroEvaluacionSindRepository();

                        ResultadoEvaluacionSindicalizado resultadoEvaluacion = new ResultadoEvaluacionSindicalizado();
                        resultadoEvaluacion.idEmpleado = entities;
                        resultadoEvaluacion.RegistroEvaluacion = evaluacion;
                        resultadoEvaluacion.Competencias = await repRegistroEvaluacion.CompetenciasEvaluadas(evaluacion.EvaluacionId);

                        resultado = new { TipoPersonalId = persona.TipoPersonalId, info = resultadoEvaluacion };
                    }
                    else {
                        EvaluacionEmpleadosCompetenciasConductuales evaluacionConductual = new EvaluacionEmpleadosCompetenciasConductuales();
                        EvaluacionConductualesRepository evaluacionRepository = new EvaluacionConductualesRepository();
                        DetalleEvaluacionConductualesRepository detalleRepository = new DetalleEvaluacionConductualesRepository();

                        var conductual = new object();

                        evaluacionConductual = await evaluacionRepository.GetPeriodoPersona(parametros);
                        if (evaluacionConductual != null)
                        {
                            var detalleEvaluacion = await detalleRepository.GetByClaveEvaluacionResultado(evaluacionConductual.claveEvaluacion);
                            conductual = new { datosEvaluado = evaluacionConductual, competencias = detalleEvaluacion };

                            //DATOS DEL PERSONAL DE BASE
                            resultado = new { TipoPersonalId = persona.TipoPersonalId, conductuales = conductual };
                        }
                    }
                }
                else
                {              
                    EvaluacionEmpleadosCompetenciasConductuales evaluacionConductual = new EvaluacionEmpleadosCompetenciasConductuales();
                    EvaluacionConductualesRepository evaluacionRepository = new EvaluacionConductualesRepository();
                    DetalleEvaluacionConductualesRepository detalleRepository = new DetalleEvaluacionConductualesRepository();

                    var conductual = new object();

                    evaluacionConductual = await evaluacionRepository.GetPeriodoPersona(parametros);
                    if (evaluacionConductual != null)
                    {
                        var detalleEvaluacion = await detalleRepository.GetByClaveEvaluacionResultado(evaluacionConductual.claveEvaluacion);
                        conductual = new { datosEvaluado = evaluacionConductual, competencias = detalleEvaluacion };

                        //DATOS DEL PERSONAL DE BASE
                        resultado = new { TipoPersonalId = persona.TipoPersonalId, conductuales = conductual };
                    }
                    else {
                        //var entities = await _db.listadoEmpleadosSind.AsNoTracking().FirstOrDefaultAsync(e => e.NoEmpleado == parametros.claveEmpleado);

                        //if (entities != null)
                        //{
                        //    EvaluacionEmpleadoSindRepository repEvaluacionSindicalizados = new EvaluacionEmpleadoSindRepository();
                        //    EvaluacionEmpleadosSind evaluacion = await repEvaluacionSindicalizados.GetByPeriodo(entities.ListaId, parametros.periodo);
                        //    RegistroEvaluacionSindRepository repRegistroEvaluacion = new RegistroEvaluacionSindRepository();

                        //    ResultadoEvaluacionSindicalizado resultadoEvaluacion = new ResultadoEvaluacionSindicalizado();
                        //    resultadoEvaluacion.idEmpleado = entities;
                        //    resultadoEvaluacion.RegistroEvaluacion = evaluacion;
                        //    resultadoEvaluacion.Competencias = await repRegistroEvaluacion.CompetenciasEvaluadas(evaluacion.EvaluacionId);

                        //    resultado = new { TipoPersonalId = "SIN", info = resultadoEvaluacion };
                        //}
                    }
                                        
                   
                }

                return resultado;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }




        public async Task<Object> Tecnicas(string noEmpleado)
        {
            try
            {

                EvaluacionTecnicasRepository evaluacionRepository = new EvaluacionTecnicasRepository();
                DetalleEvaluacionTecnicasRepository detalleRepository = new DetalleEvaluacionTecnicasRepository();

                var evaluacionTecnicasDatos = await evaluacionRepository.GetTopByPersona(noEmpleado);
                var detalleEvaluacion = await detalleRepository.GetTopByPersona(noEmpleado);

                return new { datosEvaluado = evaluacionTecnicasDatos, competencias = detalleEvaluacion };

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task Create(ListadoEmpleadosSind model)
        {
            try
            {

                _db.listadoEmpleadosSind.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(ListadoEmpleadosSind model)
        {
            try
            {
                var _model = await _db.listadoEmpleadosSind.FirstOrDefaultAsync(e => e.Id == model.Id);
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
                var _model = await _db.listadoEmpleadosSind.FirstOrDefaultAsync(e => e.Id == id);
                if (_model != null)
                {
                    _db.listadoEmpleadosSind.Remove(_model);
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
