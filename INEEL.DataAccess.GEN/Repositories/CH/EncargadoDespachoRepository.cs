using INEEL.DataAccess.GEN.Contexts;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Models.CH;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class EncargadoDespachoRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        SIGCOCHContext _ctx;
        GEN_Context _gen;
        public EncargadoDespachoRepository()
        {
            _ctx = new SIGCOCHContext();
            _gen = new GEN_Context();
        }

        public async Task<IEnumerable<EncargadoDespacho>> GetAll()
        {
            try
            {
                DateTime fechahoy = DateTime.Now;
                var result = await _ctx.EncargadoDespacho
                    .AsNoTracking().ToListAsync();

                List<String> claveUniddes = new List<string>(result.Select(x => x.ClaveUnidad));
                var unidades = await _gen.dbSetUnidadOrganizacional
                         .Where(x => claveUniddes.Contains(x.ClaveUnidad))
                         .AsNoTracking().ToListAsync();
                foreach (var item in result)
                {
                    item.UnidadOrganizacional = unidades.Find(x => x.ClaveUnidad == item.ClaveUnidad && x.FechaEfectiva == _gen.dbSetUnidadOrganizacional.Where(p => p.FechaEfectiva <= fechahoy && p.ClaveUnidad == item.ClaveUnidad).Max(p => p.FechaEfectiva));
                }
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<EncargadoDespacho> GetById(int id)
        {
            try
            {
                DateTime fechahoy = DateTime.Now;
                var result = await _ctx.EncargadoDespacho.Where(e => e.EncargadoDespachoId == id)
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

        public async Task Create(EncargadoDespacho Obj)
        {
            try
            {
                _ctx.EncargadoDespacho.Add(Obj);
                await _ctx.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(EncargadoDespacho Obj)
        {
            try
            {
                var result = await _ctx.EncargadoDespacho.FirstOrDefaultAsync(e => e.EncargadoDespachoId == Obj.EncargadoDespachoId);
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
