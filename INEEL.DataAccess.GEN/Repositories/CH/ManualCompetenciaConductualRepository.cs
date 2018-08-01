using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CH;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class ManualCompetenciaConductualRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        SIGCOCHContext _ctx;
        public ManualCompetenciaConductualRepository()
        {
            _ctx = new SIGCOCHContext();
        }
        public async Task<int> countConductualAndTecnica(Boolean estadoFlujo)
        {
            try
            {
                int conductual =await (from t in _ctx.ManualCompetenciaConductual
                               //.Where(f => f.Estado == estadoFlujo)
                              select t).CountAsync();
                int tecnica = await (from t in _ctx.ManualCompetenciaTecnica
                                            //.Where(f => f.Estado == estadoFlujo)
                                        select t).CountAsync();
                return  conductual+tecnica;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<ManualCompetenciaConductual>> GetAll()
        {
            try
            {
                //var result = await _ctx.ManualCompetenciaConductual
                //    .GroupBy(e=>e.PeriodoEvaluacion.Periodo)
                //    .Select(x=>x.OrderByDescending(p=>p.Version).FirstOrDefault())
                //    .OrderByDescending(e=>e.PeriodoEvaluacion.Periodo)
                //    .Include(e => e.PeriodoEvaluacion)
                //    .Take(5)
                //    .AsNoTracking().ToListAsync();
                //return result;

                var result = await _ctx.ManualCompetenciaConductual
                    .Include(e => e.PeriodoEvaluacion)
                    .AsNoTracking().ToListAsync();
                return result;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<ManualCompetenciaConductual>> GetAllConsulta()
        {
            try
            {
                var result = await _ctx.ManualCompetenciaConductual
                    .GroupBy(e => e.PeriodoEvaluacion.Periodo)
                    .Select(x => x.OrderByDescending(p => p.Version).FirstOrDefault())
                    .OrderByDescending(e => e.PeriodoEvaluacion.Periodo)
                    .Where(e=>e.AccesoPublico==1)
                    .Include(e => e.PeriodoEvaluacion)
                    .Take(5)
                    .AsNoTracking().ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<ManualCompetenciaConductual> GetById(int id)
        {
            try
            {
                var idiomas = await _ctx.ManualCompetenciaConductual.Where(e => e.ManualCompetenciaConductualId == id)
                    .Include(e => e.PeriodoEvaluacion)
                    .Include(e => e.Adjunto)
                    .AsNoTracking()
                    .FirstOrDefaultAsync();
                return idiomas;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(ManualCompetenciaConductual Obj)
        {
            try
            {
                _ctx.ManualCompetenciaConductual.Add(Obj);
                await _ctx.SaveChangesAsync();
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
                var result = await _ctx.ManualCompetenciaConductual.FirstOrDefaultAsync(e => e.ManualCompetenciaConductualId == id);
                if (result != null)
                {
                    _ctx.ManualCompetenciaConductual.Remove(result);
                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(ManualCompetenciaConductual Obj)
        {
            try
            {
                var result = await _ctx.ManualCompetenciaConductual.FirstOrDefaultAsync(e => e.ManualCompetenciaConductualId == Obj.ManualCompetenciaConductualId);
                if (result != null)
                {
                    _ctx.Entry(result).CurrentValues.SetValues(Obj);

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
    }
}
