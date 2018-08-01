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
    public class RequisicionesPIRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        PI_Context _ctx;

        public RequisicionesPIRepository()
        {
            _ctx = new PI_Context();
        }

        public async Task<IEnumerable<RequisicionesPI>> GetByClave(string clave)
        {
            try
            {
                var result = await _ctx.RequisicionesPI.Where(e => e.ClavePersona.Equals(clave))
                                        .Include(e => e.UnidadOrganizacional)
                                        .Include(e => e.TipoPI)
                                        .AsNoTracking()
                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<RequisicionesPI> GetById(int id)
        {
            try
            {
                var area = await _ctx.RequisicionesPI.Where(e => e.RequisicionesPIId == id)
                    .Include(e => e.UnidadOrganizacional).Include(e => e.TipoPI).AsNoTracking().FirstOrDefaultAsync();
                return area;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
    }
}
