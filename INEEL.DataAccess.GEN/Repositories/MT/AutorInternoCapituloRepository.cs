using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.MT.Models;
using INEEL.DataAccess.GEN.Contexts;

namespace INEEL.DataAccess.GEN.Repositories.MT
{
    public class AutorInternoCapituloRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        private MT_Context _ctx;
        public AutorInternoCapituloRepository()
        {
            _ctx = new MT_Context();
        }
        
        public async Task<IEnumerable<AutorInternoCapitulo>> GetAllByAutorAndStatus(string id, List<int> estados)
        {
            try
            {
                var result = await _ctx.dbSetAutorInternoCapitulo.Where(e => e.ClavePersona.Equals(id) && estados.Contains(e.Capitulos.EstadoFlujoId) && e.Estado==1)
                                        .Include(e => e.Capitulos)
                                        .AsNoTracking()
                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<AutorInternoCapitulo>> GetAllByAutor(string id)
        {
            try
            {
                var result = await _ctx.dbSetAutorInternoCapitulo.Where(e => e.ClavePersona.Equals(id))
                                        .Include(e => e.Capitulos)
                                        .AsNoTracking()
                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<AutorInternoCapitulo>> GetByCapitulos(int id)
        {
            try
            {
                var result = await _ctx.dbSetAutorInternoCapitulo.Where(e => e.CapitulosId.Equals(id))
                                        .Include(e => e.Capitulos)
                                        .AsNoTracking()
                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<AutorInternoCapitulo>> GetAllColaboracion(string clave)
        {
            try
            {
                var result = await _ctx.dbSetAutorInternoCapitulo.Where(e => e.ClavePersona == clave).AsNoTracking()
                                                 .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<AutorInternoCapitulo> Create(AutorInternoCapitulo Obj)
        {
            try
            {
                var result = _ctx.dbSetAutorInternoCapitulo.Add(Obj);
                await _ctx.SaveChangesAsync();

                return (result);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var result = await _ctx.dbSetAutorInternoCapitulo.FirstOrDefaultAsync(e => e.AutorInternoCapituloId == id);
                if (result != null)
                {
                    _ctx.dbSetAutorInternoCapitulo.Remove(result);
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
