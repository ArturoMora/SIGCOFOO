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
    public class AccesoModulosOCRepository : IDisposable
    {
        
        private GEN_Context _db;

        public AccesoModulosOCRepository()
        {
            _db = new GEN_Context();
        }
        public AccesoModulosOCRepository(GEN_Context ctx)
        {
            _db = ctx;
        }

        public async Task<IEnumerable<AccesoOcModulos>> GetAll()
        {
            try
            {
                var entities = await _db.bdSetAccesoOcModulos.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<AccesoOcModulos> GetById(int id)
        {
            try
            {
                var entities = await _db.bdSetAccesoOcModulos.AsNoTracking()
                   .FirstOrDefaultAsync(e => e.id == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(AccesoOcModulos model)
        {
            try
            {

                var propuesta = await _db.bdSetAccesoOcModulos.FirstOrDefaultAsync(e => e.fecha == model.fecha && e.claveEmpleado == model.claveEmpleado && e.modulo == e.modulo && e.ocID == model.ocID);

                if (propuesta == null)
                {
                    _db.bdSetAccesoOcModulos.Add(model);
                    await _db.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(AccesoOcModulos model)
        {
            try
            {
                var _model = await _db.bdSetAccesoOcModulos.FirstOrDefaultAsync(e => e.id == model.id);
                if (_model != null)
                {
                    _db.Entry(_model).CurrentValues.SetValues(model);
                    await _db.SaveChangesAsync();
                }

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
                var _model = await _db.bdSetAccesoOcModulos.FirstOrDefaultAsync(e => e.id == id);
                if (_model != null)
                {
                    _db.bdSetAccesoOcModulos.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        #region IDisposable Support
        private bool disposedValue = false; // To detect redundant calls

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    // TODO: dispose managed state (managed objects).
                }

                // TODO: free unmanaged resources (unmanaged objects) and override a finalizer below.
                // TODO: set large fields to null.

                disposedValue = true;
            }
        }

        // TODO: override a finalizer only if Dispose(bool disposing) above has code to free unmanaged resources.
        // ~AccesoModulosOCRepository() {
        //   // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
        //   Dispose(false);
        // }

        // This code added to correctly implement the disposable pattern.
        public void Dispose()
        {
            // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
            Dispose(true);
            // TODO: uncomment the following line if the finalizer is overridden above.
            // GC.SuppressFinalize(this);
        }
        #endregion
    }
}
