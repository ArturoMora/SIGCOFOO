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
    public class SeguimientoOportunidadRepository : IDisposable { public void Dispose(){_db.Dispose();}
        CR_Context _db;

        public SeguimientoOportunidadRepository()
        {
            _db = new CR_Context();
        }



        public async Task<IEnumerable<SeguimientoOportunidad>> getAll(int Id)
        {
            try
            {
                var _seguimientoONS = await _db.SeguimientoOportunidad
                    .AsNoTracking()
                    .Where(s => s.OportunidadNegocioId == Id)
                    .ToListAsync();//Dispose();

                return _seguimientoONS;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<SeguimientoOportunidad> getById(int Id)
        {
            try
            {
                var _seguimientoON = await _db.SeguimientoOportunidad
                    .AsNoTracking()
                    .FirstOrDefaultAsync(o => o.SeguimientoOportunidadId == Id);//Dispose();

                return _seguimientoON;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task create(SeguimientoOportunidad seguimientonON)
        {
            try
            {
                _db.SeguimientoOportunidad.Add(seguimientonON);
                await _db.SaveChangesAsync();//Dispose();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task update(SeguimientoOportunidad seguimientoON)
        {
            try
            {
                var _seguimiento = await _db.SeguimientoOportunidad
                    .FirstOrDefaultAsync(t => t.SeguimientoOportunidadId == seguimientoON.SeguimientoOportunidadId);

                if (_seguimiento != null)
                {
                    _db.Entry(_seguimiento).CurrentValues.SetValues(seguimientoON);
                    await _db.SaveChangesAsync();//Dispose();
                }
                else
                {//Dispose();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task delete(int Id)
        {
            try
            {
                var _seguimiento = await _db.SeguimientoOportunidad
                    .FirstOrDefaultAsync(s => s.SeguimientoOportunidadId == Id);

                if (_seguimiento != null)
                {
                    _db.SeguimientoOportunidad.Remove(_seguimiento);
                    await _db.SaveChangesAsync();//Dispose();
                }
                else
                {//Dispose();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
    }
}
