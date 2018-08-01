using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CR;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class EspecialistaRepository : IDisposable { public void Dispose(){ _db.Dispose();}
        CR_Context _db;

        public EspecialistaRepository()
        {
            _db = new CR_Context();

        }

        public async Task<IEnumerable<Especialista>> getAll()
        {
            try
            {
                var _especialistas = await _db.Especialistas.AsNoTracking().ToListAsync();
//Dispose();

                return _especialistas;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Especialista> getById(int Id)
        {
            try
            {
                var _especialista = await _db.Especialistas
                    .AsNoTracking()
                    .FirstOrDefaultAsync(t => t.EspecialistaId == Id);
//Dispose();

                return _especialista;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task create(Especialista especialista)
        {
            try
            {
                _db.Especialistas.Add(especialista);
                await _db.SaveChangesAsync();
//Dispose();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task update(Especialista especialista)
        {
            try
            {
                var _especialista = await _db.Especialistas
                    .FirstOrDefaultAsync(t => t.EspecialistaId == especialista.EspecialistaId);

                if (_especialista != null)
                {
                    _db.Entry(_especialista).CurrentValues.SetValues(especialista);
                    await _db.SaveChangesAsync();
//Dispose();
                }
                else
                {
//Dispose();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task deleteLogic(Especialista especialista)
        {
            try
            {
                var _especialista = await _db.Especialistas
                   .FirstOrDefaultAsync(t => t.EspecialistaId == especialista.EspecialistaId);

                if (_especialista != null)
                {
                    _db.Entry(_especialista).CurrentValues.SetValues(especialista);
                    await _db.SaveChangesAsync();
//Dispose();
                }
                else
                {
//Dispose();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
    }
}
