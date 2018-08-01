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
    public class EditorCapituloRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        private MT_Context _ctx;
        public EditorCapituloRepository()
        {
            _ctx = new MT_Context();
        }

        public async Task<IEnumerable<EditoresCapitulo>> GetByCapitulos(int id)
        {
            try
            {
                var result = await _ctx.dbSetEditoresCapitulo.Where(e => e.CapitulosId.Equals(id))
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

        public async Task<IEnumerable<EditoresCapitulo>> GetAllColaboracion(string clave)
        {
            try
            {
                var result = await _ctx.dbSetEditoresCapitulo.Where(e => e.EditoresCapituloId.ToString()==clave).AsNoTracking()
                                                 .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<EditoresCapitulo> Create(EditoresCapitulo Obj)
        {
            try
            {
                var result = _ctx.dbSetEditoresCapitulo.Add(Obj);
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
                var result = await _ctx.dbSetEditoresCapitulo.FirstOrDefaultAsync(e => e.EditoresCapituloId == id);
                if (result != null)
                {
                    _ctx.dbSetEditoresCapitulo.Remove(result);
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
