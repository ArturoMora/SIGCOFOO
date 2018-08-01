using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CR;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class ClaveEmpresaRepository : IDisposable { public void Dispose(){ _db.Dispose();}
        CR_Context _db;

        public ClaveEmpresaRepository()
        {
            _db = new CR_Context();
        }


        public async Task<IEnumerable<ClaveEmpresas>> get()
        {
            try
            {
                var _claveEmpresas = await _db.ClaveEmpresas
                    .AsNoTracking()
                    .ToListAsync();//Dispose();

                return _claveEmpresas;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<ClaveEmpresas> getById (string Id)
        {
            try
            {
                int id = Convert.ToInt32(Id);
                var _claveEmpresa = await _db.ClaveEmpresas
                    .AsNoTracking()
                    .FirstOrDefaultAsync(c => c.ClaveEmpresasId == id);//Dispose();

                return _claveEmpresa;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task create(ClaveEmpresas cveEmpresa)
        {
            try
            {
                DateTime fechaRegistro = DateTime.Now;
                cveEmpresa.FechaRegistro = fechaRegistro;

                _db.ClaveEmpresas.Add(cveEmpresa);
                await _db.SaveChangesAsync();//Dispose();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task update(ClaveEmpresas cveEmpresa)
        {
            try
            {
                var _evento = await _db.ClaveEmpresas
                    .FirstOrDefaultAsync(t => t.ClaveEmpresasId == cveEmpresa.ClaveEmpresasId);

                if (_evento != null)
                {
                    _db.Entry(_evento).CurrentValues.SetValues(cveEmpresa);
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

        public async Task deleteLogic(ClaveEmpresas cveEmpresa)
        {
            try
            {
                var _claveEmpresa = await _db.ClaveEmpresas
                   .FirstOrDefaultAsync(e => e.ClaveEmpresasId == cveEmpresa.ClaveEmpresasId);

                if (_claveEmpresa != null)
                {
                    _db.Entry(_claveEmpresa).CurrentValues.SetValues(cveEmpresa);
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
