using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using System.Data.Entity;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.GEN.Repositories
{
    public class PaisesRepository : IDisposable { public void Dispose(){ _db.Dispose();}
        private GEN_Context _db;

        public PaisesRepository()
        {
            _db = new GEN_Context();
        }


        public async Task<IEnumerable<Paises>> GetPaises()
        {
            try
            {
                var _paises = await _db.dbSetPais
                    .AsNoTracking()
                    .OrderBy(p => p.NombrePais)
                    .ToListAsync();
                return _paises;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Estados>> GetEstado(int Id)
        {
            try
            {
                var _estado = await _db.dbSetEstado
                    .AsNoTracking()
                    .Where(p=> p.PaisId == Id)
                    .ToListAsync();
                return _estado;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Municipios>> GetMunicipio(int Id)
        {
            try
            {
                var _municipio = await _db.dbSetMunicipio
                    .AsNoTracking()
                    .Where(m=> m.EstadoId == Id)
                    .ToListAsync();
                return _municipio;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
    }
}
