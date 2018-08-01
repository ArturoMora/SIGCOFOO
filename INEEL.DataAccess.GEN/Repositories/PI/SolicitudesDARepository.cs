using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.PI;

namespace INEEL.DataAccess.GEN.Repositories.PI
{
    public class SolicitudesDARepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        PI_Context _ctx;

        public SolicitudesDARepository()
        {
            _ctx = new PI_Context();
        }

        public async Task<IEnumerable<SolicitudesDA>> GetByClave(string clave)
        {
            try
            {
                var result = await _ctx.SolicitudesDA.Where(e => e.ClavePersona.Equals(clave))
                                        .Include(e => e.RamaDA)
                                        .Include(e => e.TipoDerivadaDA)
                                        .AsNoTracking()
                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<SolicitudesDA> GetById(int id)
        {
            try
            {
                var area = await _ctx.SolicitudesDA.Where(e => e.SolicitudesDAId == id)
                    .Include(e => e.RamaDA).Include(e => e.TipoDerivadaDA).AsNoTracking().FirstOrDefaultAsync();
                return area;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
    }
}
