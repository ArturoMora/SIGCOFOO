using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CH;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Dynamic;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class EvaluacionEmpleadoSindRepository :IDisposable
    {
        private SIGCOCHContext _db;
        public EvaluacionEmpleadoSindRepository()
        {
            _db = new SIGCOCHContext();
        }

        public async Task<IEnumerable<EvaluacionEmpleadosSind>> GetAll()
        {
            try
            {
                var entities = await _db.evaluacionesEmpleadosSind.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        //OBTEN DATOS DEL EMPLEADO POR PERIODO
        public async Task<EvaluacionEmpleadosSind> GetByPeriodo(int id, string periodoEv)
        {
            try
            {
                var entities = await _db.evaluacionesEmpleadosSind.AsNoTracking()
                    .Include(x=> x.categoriaSind)
                    .Include(x => x.categoriaSind.FamiliaPuestos)
                    .FirstOrDefaultAsync(e => e.ListaEmpleadosId == id && e.Periodo == periodoEv);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<ListadoEmpleadosSind>> GetByCategoriaPeriodo(BusquedaNivel param)
        {
            try
            {
                


                ListaEmpleadosSindRepository repositorioListaSindicalizados = new ListaEmpleadosSindRepository();
                List<ListadoEmpleadosSind> listaEmpleados = new List<ListadoEmpleadosSind>();

                var listaSindicalizados = await repositorioListaSindicalizados.GetAll();

                var entities = await _db.evaluacionesEmpleadosSind
                    .Where(e => e.CategoriaCompetenciaId == param.idCategoria)
                    .Where(e => e.Periodo == param.periodo)
                    .AsNoTracking().ToListAsync();


                foreach (var item in entities)
                {

                    foreach (var item2 in listaSindicalizados) {
                        if (item.ListaEmpleadosId == item2.ListaId) {
                            ListadoEmpleadosSind datos = new ListadoEmpleadosSind();
                            datos.NoEmpleado = item2.NoEmpleado;
                            datos.NombreEmpleado = item2.NombreEmpleado;
                            listaEmpleados.Add(datos);
                        }
                    }

                }



                return listaEmpleados.OrderBy(e => e.NombreEmpleado);

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        //OBTEN LA EVALUACION MAS RECIENTE DEL EMPLEADO
        public async Task<EvaluacionEmpleadosSind> Get(int id)
        {
            try
            {

                var groups = await _db.evaluacionesEmpleadosSind
                .Include(x => x.categoriaSind)
                .Include(x => x.categoriaSind.FamiliaPuestos)
                .Where(p => p.ListaEmpleadosId == id)
                .OrderByDescending(x => x.EvaluacionId)
                .ToArrayAsync();
                
                return groups.FirstOrDefault();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task Create(EvaluacionEmpleadosSind model)
        {
            try
            {

                _db.evaluacionesEmpleadosSind.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(EvaluacionEmpleadosSind model)
        {
            try
            {
                var _model = await _db.evaluacionesEmpleadosSind.FirstOrDefaultAsync(e => e.id == model.id);
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
                var _model = await _db.evaluacionesEmpleadosSind.FirstOrDefaultAsync(e => e.id == id);
                if (_model != null)
                {
                    _db.evaluacionesEmpleadosSind.Remove(_model);
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
