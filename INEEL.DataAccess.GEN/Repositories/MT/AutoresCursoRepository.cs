using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.MT.Models;

namespace INEEL.DataAccess.GEN.Repositories.MT
{
    public class AutoresCursoRepository : IDisposable { public void Dispose(){ _db.Dispose(); _dbGen.Dispose(); }
        private MT_Context _db;
        GEN_Context _dbGen;

        public AutoresCursoRepository()
        {
            _db = new MT_Context();
            _dbGen = new GEN_Context();
        }

        public async Task<IEnumerable<AutoresCursosPersonal>> GetByClave(string clave)
        {
            try
            {
                var entities = await _db.dbSetAutoresCursosPersonal.Where(e => e.Autor_ClavePersona == clave)
                                        .Include(e => e.CursosPersonal)
                                        .AsNoTracking()
                                        .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
    }
}
