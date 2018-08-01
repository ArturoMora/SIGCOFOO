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
    public class SolicitudParticiantesDARepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        PI_Context _ctx;

        public SolicitudParticiantesDARepository()
        {
            _ctx = new PI_Context();
        }

        public async Task<IEnumerable<SolicitudParticiantesDA>> GetByClave(string clave)
        {
            try
            {
                var result = await _ctx.SolicitudParticiantesDA.Where(e=>e.AutoresIntDAPatrimonio.ClavePersona.Equals(clave))
                                        .Include(e => e.SolicitudesDA)
                                        .Include(e => e.TipoParticipacionDA)
                                        .Include(e => e.AutoresIntDAPatrimonio)
                                        .AsNoTracking()
                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<SolicitudParticiantesDA>> GetByColaboracion(int clave)
        {
            try
            {
                var result = await _ctx.SolicitudParticiantesDA.Where(e => e.SolicitudesDAId.Equals(clave))
                                        .Where(e=>e.TipoParticipacionDAId==2)
                                        .Include(e => e.SolicitudesDA)
                                        .Include(e => e.TipoParticipacionDA)
                                        .Include(e => e.AutoresIntDAPatrimonio)
                                        .AsNoTracking()
                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
    }
}
