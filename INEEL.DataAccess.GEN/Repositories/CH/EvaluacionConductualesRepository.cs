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
using INEEL.DataAccess.GEN.Util;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class EvaluacionConductualesRepository : IDisposable
    {
        //----------- AYUDA:
        // EvaluacionConductualesRepository: nombre de clase (y tipicamente el constructor)
        // FooDbContext.- tu Contexto : DbContext
        // FooEntity.- es el modelo
        // FooDbSet.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: FooDbSet =Categories                                  )
        // FooID.-  es el ID del modelo (ID de la tabla)


        private SIGCOCHContext _db;
        public EvaluacionConductualesRepository()
        {
            _db = new SIGCOCHContext();
            _db.Database.Log = Escribe.Write;
        }

        //public async Task<IEnumerable<FooEntity>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<EvaluacionEmpleadosCompetenciasConductuales>> GetAll()
        {
            try
            {
                var entities = await _db.evaluacionesConductuales.OrderBy(e=>e.NombreEmpleado).AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<EvaluacionEmpleadosCompetenciasConductuales> Get(int id)
        {
            try
            {
                var entities = await _db.evaluacionesConductuales.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.EvaluacionId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        
        public async Task<IEnumerable<EvaluacionEmpleadosCompetenciasConductuales>> GetByUnidadPeriodo(BusquedaNivel param)
        {
            try
            {
                var entities = await _db.evaluacionesConductuales
                    .Where(e => e.claveArea == param.claveUnidad)
                    .Where(e => e.Periodo == param.periodo)
                    .Where(e => e.visible == 1)
                    .Include(e => e.calificacion)
                    .Include(e => e.categoria)
                    .Include(e => e.categoria.FamiliaPuestos)
                    .OrderBy(e => e.NombreEmpleado)
                    .AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<EvaluacionEmpleadosCompetenciasConductuales>> GetByCategoriaPeriodo(BusquedaNivel param)
        {
            try
            {
                var entities = await _db.evaluacionesConductuales
                    .Where(e => e.CategoriaCompetenciasId == param.idCategoria)
                    .Where(e => e.Periodo == param.periodo)
                    .Where(e => e.visible == 1)
                    .Include(e => e.calificacion)
                    .Include(e => e.categoria)
                    .Include(e => e.categoria.FamiliaPuestos)
                    .OrderBy(e => e.NombreEmpleado)
                    .AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        
        public async Task<EvaluacionEmpleadosCompetenciasConductuales> GetPeriodoPersona(BusquedaNivel param)
        {
            try
            {
                var entities = await _db.evaluacionesConductuales
                    .Where(e => e.ClaveEmpleado == param.claveEmpleado)
                    .Where(e => e.Periodo == param.periodo)
                    .Include(e => e.calificacion)
                    .Include(e => e.categoria)
                    .Include(e => e.categoria.FamiliaPuestos)
                    .AsNoTracking().FirstOrDefaultAsync();
                                
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        
        public async Task<EvaluacionEmpleadosCompetenciasConductuales> GetTopByPersona(String clavePersona)
        {
            try
            {
                var entities = await _db.evaluacionesConductuales
                    .Where(e => e.ClaveEmpleado == clavePersona)
                    .Include(e => e.calificacion)
                    .Include(e => e.categoria)
                    .Include(e => e.categoria.FamiliaPuestos)                    
                    .OrderByDescending(x => x.Periodo)
                    .AsNoTracking().FirstOrDefaultAsync();


                if (entities == null) {

                    var busqueda = await _db.evaluacionesConductuales
                    .Where(e => e.ClaveEmpleado == clavePersona)
                    .Include(e => e.calificacion)
                    .Include(e => e.categoria)
                    .Include(e => e.categoria.FamiliaPuestos)
                    .OrderByDescending(x => x.Periodo)
                    .AsNoTracking().ToListAsync();

                    foreach (var obj in busqueda) {

                        if (obj != null) {
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

        public async Task<IEnumerable<EvaluacionEmpleadosCompetenciasConductuales>> GetByPersonaPeriodo(BusquedaNivel param)
        {
            try
            {
                var entities = await _db.evaluacionesConductuales
                    .Where(e => e.ClaveEmpleado == param.claveEmpleado)
                    .Where(e => e.Periodo == param.periodo)
                    .Where(e => e.visible == 1)
                    .Include(e => e.calificacion)
                    .Include(e => e.categoria)
                    .Include(e => e.categoria.FamiliaPuestos)
                    .OrderBy(e => e.NombreEmpleado)
                    .AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<EvaluacionEmpleadosCompetenciasConductuales>> GetTodosByUnidadPeriodo(BusquedaNivel param)
        {
            try
            {
                var entities = await _db.evaluacionesConductuales
                    .Where(e => e.claveArea == param.claveUnidad)
                    .Where(e => e.Periodo == param.periodo)
                    .Include(e => e.calificacion)
                    .Include(e => e.categoria)
                    .Include(e => e.categoria.FamiliaPuestos)
                    .OrderBy(e => e.NombreEmpleado)
                    .AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<AuxilarDatosConductuales>> GetByClaveCategoria(int clave)
        {
            try
            {

                List<AuxilarDatosConductuales> listaCompetencias = new List<AuxilarDatosConductuales>();

                var entities = await _db.matrizcompetencias
                    .Where(e => e.categoriaId == clave)
                     .Where(e => e.estado == 1)
                    .Include(e => e.competencia)
                    .Include(e => e.descnivel)
                    .Include(e => e.descnivel.nivel)
                   
                    .AsNoTracking().ToListAsync();

                foreach (var item in entities)
                {

                    AuxilarDatosConductuales datos = new AuxilarDatosConductuales();
                    datos.claveEvaluacion = 0;
                    datos.competencia = item.competencia.Competencia;
                    datos.comportamiento = item.descnivel.Comportamiento;
                    datos.justificacion = "";
                    datos.MatrizId = item.matrizId;
                    datos.nivel = item.descnivel.nivel.Descripcion;
                    datos.valorReal = 0;

                    listaCompetencias.Add(datos);

                }


                return listaCompetencias;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(EvaluacionEmpleadosCompetenciasConductuales model)
        {
            try
            {

                _db.evaluacionesConductuales.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task duplicarCompetencias(int id)
        {
            try
            {

                SqlParameter param1 = new SqlParameter("@PERIODOID", id);
                var SQLString = "EXEC [dbo].[SIGCO3_DUPLICA_COMPETENCIAS] @PERIODOID";
                var result = await  _db.Database.ExecuteSqlCommandAsync(SQLString, param1);
              
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task duplicarFamilias(int id)
        {
            try
            {

                SqlParameter param1 = new SqlParameter("@PERIODOID", id);
                var SQLString = "EXEC [dbo].[SIGCO3_DUPLICA_FAMILIAS] @PERIODOID";
                var result = await _db.Database.ExecuteSqlCommandAsync(SQLString, param1);

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task duplicarCategorias(int id)
        {
            try
            {

                SqlParameter param1 = new SqlParameter("@PERIODOID", id);
                var SQLString = "EXEC [dbo].[SIGCO3_DUPLICA_CATEGORIAS] @PERIODOID";
                var result = await _db.Database.ExecuteSqlCommandAsync(SQLString, param1);

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task duplicarMatriz(int id)
        {
            try
            {

                SqlParameter param1 = new SqlParameter("@PERIODOID", id);
                var SQLString = "EXEC [dbo].[SIGCO3_DUPLICA_MATRIZ] @PERIODOID";
                var result = await _db.Database.ExecuteSqlCommandAsync(SQLString, param1);

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Grafica> GetPromedioCompetencias(BusquedaNivel param) {
            try
            {

                Grafica valoresgrafica = new Grafica();


                List<String> fecha = new List<string>();

                valoresgrafica.Series = new List<string>();
                valoresgrafica.Etiquetas = new List<string>();

                List<string> datobase = new List<string>();
                List<string> dato = new List<string>();

                if (param.periodo == "" || param.periodo == null) {
                    param.periodo = "Todos";
                }

                if (param.idCategoria > 0)
                {

                    if (param.periodo != "Todos")
                    {

                        List<int> evaluaciones = new List<int>(_db.evaluacionesConductuales.Where(x => x.Periodo == param.periodo && x.CategoriaCompetenciasId == param.idCategoria && x.claveArea == param.claveUnidad).Select(x => x.claveEvaluacion).ToList());
                        var evaluacionesConsultadas = await (from f in _db.detalleConductuales
                                                             where evaluaciones.Contains(f.claveEvaluacion)
                                                             orderby f.MatrizId
                                                             group f by new { f.MatrizId, f.matriz.competencia.Competencia, f.matriz.descnivel.nivel.Descripcion } into valores
                                                             select new
                                                             {
                                                                 valores.Key.Competencia,
                                                                 valores.Key.Descripcion,
                                                                 promedio = valores.Average(f => f.valorReal)
                                                             }).AsNoTracking().ToListAsync();


                        fecha.Add("Valor esperado");
                        fecha.Add(param.periodo);

                        valoresgrafica.Series.AddRange(fecha.ToList());

                        foreach (var items in evaluacionesConsultadas)
                        {
                            valoresgrafica.Etiquetas.Add(items.Competencia);
                            datobase.Add(items.Descripcion.ToString());
                            dato.Add(items.promedio.ToString());
                        }

                        valoresgrafica.Datos.Add(datobase);
                        valoresgrafica.Datos.Add(dato);
                    }
                    else
                    {

                        PeriodoEvaluacionRepository p = new PeriodoEvaluacionRepository();
                        IEnumerable<PeriodoEvaluacion> periodosEvaluados = await p.GetAll();

                        PeriodoEvaluacion primerPeriodo =  periodosEvaluados.FirstOrDefault();

                        foreach (var item in periodosEvaluados)
                        {
                                                       
                            List<int> evaluaciones = new List<int>(_db.evaluacionesConductuales.Where(x => x.Periodo == item.Periodo && x.CategoriaCompetenciasId == param.idCategoria && x.claveArea == param.claveUnidad).Select(x => x.claveEvaluacion).ToList());
                            var evaluacionesConsultadas = await (from f in _db.detalleConductuales
                                                                 where evaluaciones.Contains(f.claveEvaluacion)
                                                                 orderby f.MatrizId
                                                                 group f by new { f.MatrizId, f.matriz.competencia.Competencia, f.matriz.descnivel.nivel.Descripcion } into valores
                                                                 
                                                                 select new
                                                                 {
                                                                     valores.Key.Competencia,
                                                                     valores.Key.Descripcion,
                                                                     promedio = valores.Average(f => f.valorReal)
                                                                 }).AsNoTracking().ToListAsync();


                           
                          
                            
                            if (item.Periodo == primerPeriodo.Periodo) {
                                foreach (var items in evaluacionesConsultadas)
                                {
                                    valoresgrafica.Etiquetas.Add(items.Competencia);
                                    datobase.Add(items.Descripcion.ToString());
                                }
                                valoresgrafica.Datos.Add(datobase);
                                fecha.Add("Valor esperado");

                            }


                            fecha.Add(item.Periodo);
                            dato = new List<string>();
                            foreach (var items in evaluacionesConsultadas)
                            {                               
                               dato.Add(items.promedio.ToString());
                            }

                            valoresgrafica.Datos.Add(dato);
                            dato = null;
                        }

                        valoresgrafica.Series.AddRange(fecha.ToList());
                    }
                }

                return valoresgrafica;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }

        }
        
        public void OrganizaPlanesMejorasFortalezas()
        {
            try
            {

                string fort = "";
                string plan = "";
                string mejo = "";

                List<Fortalezas> fortalezasRegs = _db.fortalezas.ToList();
                List<AreasMejora> areasMejoraRegs = _db.areaMejora.ToList();
                List<PlanAccion> planAccionRegs = _db.planAccion.ToList();

                var evaluados = _db.evaluacionesConductuales.ToList();
                foreach (var ev in evaluados)
                {

                    fort = ev.Fortalezas;
                    plan = ev.Debilidades;
                    mejo = ev.AreasMejora;

                    //string datoObj1 = "";
                    //var fortalezasObt = fortalezasRegs.FindAll(x => x.EmpleadoEvaluacionId == ev.claveEvaluacion);
                    //foreach (var obj1 in fortalezasObt)
                    //{
                    //    datoObj1 = datoObj1 + obj1.Descripcion + "\n";
                    //}

                    string datoObj2 = "";
                    var areasmObt = areasMejoraRegs.FindAll(x => x.EmpleadoEvaluacionId == ev.claveEvaluacion);
                    foreach (var obj2 in areasmObt)
                    {
                        datoObj2 = datoObj2 + obj2.Descripcion + "\n";
                    }

                    //string datoObj3 = "";
                    //var planObt = planAccionRegs.FindAll(x => x.EmpleadoEvaluacionId == ev.claveEvaluacion);
                    //foreach (var obj3 in planObt)
                    //{
                    //    datoObj3 = datoObj3 + obj3.Descripcion + "\n";
                    //}

                    //if (fort != null)
                    //    fort = datoObj1;
                    //else
                    //    fort = fort + "\n" + datoObj1;

                    //if (plan != null)
                    //    plan = datoObj3;
                    //else
                    //    plan = plan + "\n" + datoObj3;

                    if (mejo != null)
                        mejo = datoObj2;
                    else
                        mejo = mejo + "\n" + datoObj2;


                    ev.AreasMejora = mejo;
                    //ev.Fortalezas = fort;
                    //ev.Debilidades = plan;



                    fort = "";
                    plan = "";
                    mejo = "";

                }


                _db.SaveChanges();

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

        public async Task cargarEmpleadosPeriodo(string id)
        {
            try
            {

                PersonasRepository personal = new PersonasRepository();
                IEnumerable<Personas> listaPersonal =  await personal.GetAllMAX();


                List<EvaluacionEmpleadosCompetenciasConductuales> listaEvaluacion = new List<EvaluacionEmpleadosCompetenciasConductuales>();


                var  categoria = await _db.relacionCategoria.AsNoTracking().ToListAsync(); 
              
                foreach (var item in listaPersonal)
                {
                    EvaluacionEmpleadosCompetenciasConductuales persona = new EvaluacionEmpleadosCompetenciasConductuales();
                    persona.AreasMejora = "";
                    persona.CalificacionId = 5;
                    persona.CategoriaCompetenciasId = 1;
                   
                    persona.claveArea = item.ClaveUnidad;
                    persona.ClaveEmpleado = item.ClavePersona;
                    persona.claveEvaluacion = 0;
                    persona.Debilidades = "";
                    persona.EstadoEvaluacionId = 1;
                    persona.Fortalezas = "";
                    persona.NombreEmpleado = item.NombreCompleto;
                    persona.Periodo = id;
                    persona.visible = 1;
                   

                    foreach (var cat in categoria)
                    {
                        if (cat.ClaveCategoria.Equals(item.CategoriaId)) {
                            persona.CategoriaCompetenciasId = cat.categoriaCompetencia;
                            persona.CategoriaNomina = cat.categoriaEmpleado;
                            break;
                        }

                    }


                    _db.evaluacionesConductuales.Add(persona);

                  
                }
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(EvaluacionEmpleadosCompetenciasConductuales model)
        {
            try
            {
                var _model = await _db.evaluacionesConductuales.FirstOrDefaultAsync(e => e.EvaluacionId == model.EvaluacionId);
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
                var _model = await _db.evaluacionesConductuales.FirstOrDefaultAsync(e => e.EvaluacionId == id);
                if (_model != null)
                {
                    _db.evaluacionesConductuales.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(EvaluacionEmpleadosCompetenciasConductuales obj)
        {
            try
            {
                var _obj = await _db.evaluacionesConductuales.FirstOrDefaultAsync(e => e.EvaluacionId == obj.EvaluacionId);
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


                var entities = await _db.evaluacionesConductuales
                  .Where(e => e.claveArea == param.claveUnidad)
                  .Where(e => e.Periodo == param.periodo)
                  .Where(e => e.visible == 1)
                  .Include(e => e.calificacion)
                  .Include(e => e.categoria)
                  .Include(e => e.categoria.FamiliaPuestos)

                  .AsNoTracking().ToListAsync();

                foreach (var item in entities) {

                    if (item.CalificacionId == 4) {
                        cuentaExcede = cuentaExcede + 1;
                    }

                    if (item.CalificacionId == 3)
                    {
                        cuentaCumple = cuentaCumple + 1;
                    }

                    if (item.CalificacionId == 2)
                    {
                        cuentaparcial = cuentaparcial + 1;
                    }

                    if (item.CalificacionId == 1)
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
