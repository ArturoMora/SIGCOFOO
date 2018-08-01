using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories
{
    public class PersonasRepositorySupport
    {
        private GEN_Context _db;
        public PersonasRepositorySupport(GEN_Context db)
        {
            _db = db;
        }
        public async Task<Personas> GetByClave(string clave)
        {
            try
            {
                var fechaActual = DateTime.Now;
                //var entities = await _db.dbSetPersonas.AsNoTracking()
                //    .FirstOrDefaultAsync(e => e.ClavePersona == clave); //se comenta porque no considera fecha efectiva
                var entities = await _db.dbSetPersonas.AsNoTracking()
                    .Where(x => x.ClavePersona == clave && x.Estado == 1)
                    .OrderByDescending(x => x.FechaEfectiva)
                    .FirstOrDefaultAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }

        }

        public async Task<Personas> GetByClaveFechaEfectiva(string clave)
        {
            try
            {
                var fechaActual = DateTime.Now;
                var entities = await _db.dbSetPersonas.AsNoTracking()
                    .Where(x => x.ClavePersona == clave && x.Estado == 1 &&
                    x.FechaEfectiva == _db.dbSetPersonas.Where(
                            p => p.FechaEfectiva <= fechaActual
                            && p.ClavePersona == x.ClavePersona
                            ).Max(e => e.FechaEfectiva))
                    .FirstOrDefaultAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }

        }
    }
}
