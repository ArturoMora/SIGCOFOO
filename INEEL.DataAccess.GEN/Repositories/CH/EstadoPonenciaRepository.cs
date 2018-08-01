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
    public class EstadoPonenciaRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        SIGCOCHContext _ctx;
        public EstadoPonenciaRepository()
        {
            _ctx = new SIGCOCHContext();
        }

        //Obtener todos los estados de publicacion
        public async Task<IEnumerable<EstadoPonencia>> GetAll()
        {
            try
            {
                var EP = await _ctx.EstadoPonencia.Where(e => e.Estado == 1).AsNoTracking().ToListAsync();
                return EP;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
    }
}
