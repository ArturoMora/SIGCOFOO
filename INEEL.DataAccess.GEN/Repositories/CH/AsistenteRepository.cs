using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Contexts;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class AsistenteRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        SIGCOCHContext _ctx;
        GEN_Context _gen;
        public AsistenteRepository()
        {
            _ctx = new SIGCOCHContext();
            _gen = new GEN_Context();
        }

        public async Task<IEnumerable<Asistente>> GetAll()
        {
            try
            {
                DateTime fechahoy = DateTime.Now;
                var result = await _ctx.Asistente
                    .AsNoTracking().ToListAsync();

                List<String> claveUniddes = new List<string>(result.Select(x => x.ClaveUnidad));
                var unidades = await _gen.dbSetUnidadOrganizacional
                         .Where(x => claveUniddes.Contains(x.ClaveUnidad))
                         .AsNoTracking().ToListAsync();
                foreach (var item in result)
                {
                    item.UnidadOrganizacional = unidades.Find(x => x.ClaveUnidad == item.ClaveUnidad && x.FechaEfectiva == _gen.dbSetUnidadOrganizacional.Where(p => p.FechaEfectiva <= fechahoy && p.ClaveUnidad==item.ClaveUnidad).Max(p=>p.FechaEfectiva));
                }
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Asistente> GetById(int id)
        {
            try
            {
                DateTime fechahoy = DateTime.Now;
                var result = await _ctx.Asistente.Where(e => e.AsistenteId == id)
                    //.Include(e => e.UnidadOrganizacional)
                    .AsNoTracking().FirstOrDefaultAsync();
                var unidades = await _gen.dbSetUnidadOrganizacional
                         .Where(x => x.ClaveUnidad == result.ClaveUnidad && x.FechaEfectiva == _gen.dbSetUnidadOrganizacional.Where(p => p.FechaEfectiva <= fechahoy && p.ClaveUnidad == result.ClaveUnidad).Max(p => p.FechaEfectiva))
                         .AsNoTracking().FirstOrDefaultAsync();
                result.UnidadOrganizacional = unidades;
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(Asistente Obj)
        {
            try
            {
                _ctx.Asistente.Add(Obj);
                await _ctx.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(Asistente Obj)
        {
            try
            {
                var result = await _ctx.Asistente.FirstOrDefaultAsync(e => e.AsistenteId == Obj.AsistenteId);
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
