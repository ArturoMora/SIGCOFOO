using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CH;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class ManualCompetenciaTecnicaRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        SIGCOCHContext _ctx;
        public ManualCompetenciaTecnicaRepository()
        {
            _ctx = new SIGCOCHContext();
        }

        public async Task<IEnumerable<ManualCompetenciaTecnica>> GetAll()
        {
            try
            {
                //var result = await _ctx.ManualCompetenciaTecnica
                //    .GroupBy(e => e.PeriodoEvaluacion.Periodo)
                //    .Select(x => x.OrderByDescending(p => p.Version).FirstOrDefault())
                //    .OrderByDescending(e => e.PeriodoEvaluacion.Periodo)
                //    .Include(e => e.PeriodoEvaluacion)
                //    .Take(5)
                //    .AsNoTracking().ToListAsync();
                //return result;

                var result = await _ctx.ManualCompetenciaTecnica
                   .Include(e => e.PeriodoEvaluacion)
                   .AsNoTracking().ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<ManualCompetenciaTecnica>> GetAllConsulta()
        {
            try
            {
                var result = await _ctx.ManualCompetenciaTecnica
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

        public async Task<ManualCompetenciaTecnica> GetById(int id)
        {
            try
            {
                var idiomas = await _ctx.ManualCompetenciaTecnica.Where(e => e.ManualCompetenciaTecnicaId == id)
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

        public async Task Create(ManualCompetenciaTecnica Obj)
        {
            try
            {
                _ctx.ManualCompetenciaTecnica.Add(Obj);
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
                var result = await _ctx.ManualCompetenciaTecnica.FirstOrDefaultAsync(e => e.ManualCompetenciaTecnicaId == id);
                if (result != null)
                {
                    _ctx.ManualCompetenciaTecnica.Remove(result);
                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(ManualCompetenciaTecnica Obj)// UpdateSolicitud
        {
            try
            {
                var result = await _ctx.ManualCompetenciaTecnica.FirstOrDefaultAsync(e => e.ManualCompetenciaTecnicaId == Obj.ManualCompetenciaTecnicaId);
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
