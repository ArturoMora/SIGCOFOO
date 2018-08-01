using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CR;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class BitacoraRepository : IDisposable { public void Dispose() { _db.Dispose(); }
    
        CR_Context _db;

        public BitacoraRepository()
        {
            _db = new CR_Context();
        }



        public async Task<IEnumerable<BitacoraOportunidadNegocio>> getOportunidadesById(int Id)
        {
            try
            {
                var _oportunidadesHistorico = await _db.BitacoraOportunidadNegocio
                    .AsNoTracking()
                    .Where(o => o.OportunidadNegocioId == Id)
                    .ToListAsync();//Dispose();

                return _oportunidadesHistorico;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task create(BitacoraOportunidadNegocio onHistorico)
        {
            try
            {
                _db.BitacoraOportunidadNegocio.Add(onHistorico);
                await _db.SaveChangesAsync();//Dispose();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
    }
}
