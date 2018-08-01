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
    public class AceesoModulosRepository : IDisposable
    {

        private GEN_Context _db;

        public AceesoModulosRepository()
        {
            _db = new GEN_Context();
        }
        public AceesoModulosRepository(GEN_Context ctx)
        {
            _db = ctx;
        }

        public async Task<IEnumerable<AccesoModulos>> GetAll()
        {
            try
            {
                var entities = await _db.bdSetAccesoModulos.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<AccesoModulos> GetById(int id)
        {
            try
            {
                var entities = await _db.bdSetAccesoModulos.AsNoTracking()
                   .FirstOrDefaultAsync(e => e.id == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(AccesoModulos model)
        {
            try
            {

                AccesoModulos  propuesta = await _db.bdSetAccesoModulos.FirstOrDefaultAsync(e => e.fecha == model.fecha && e.claveEmpleado == model.claveEmpleado && e.modulo == e.modulo );

                if (propuesta == null)
                {
                    _db.bdSetAccesoModulos.Add(model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(AccesoModulos model)
        {
            try
            {
                var _model = await _db.bdSetAccesoModulos.FirstOrDefaultAsync(e => e.id == model.id);
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
                var _model = await _db.bdSetAccesoModulos.FirstOrDefaultAsync(e => e.id == id);
                if (_model != null)
                {
                    _db.bdSetAccesoModulos.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<string> accesosMT(string id, string trimestre)
        {

            try
            {

                double indicador = 0;

                DateTime fechaInicio;
                DateTime fechaTermino;

                switch (trimestre)
                {

                    case "1":
                        fechaInicio = new DateTime(int.Parse(id), 1, 1, 12, 0, 0);
                        fechaTermino = new DateTime(int.Parse(id), 3, 31, 12, 0, 0);
                        break;

                    case "2":
                        fechaInicio = new DateTime(int.Parse(id), 4, 1, 12, 0, 0);
                        fechaTermino = new DateTime(int.Parse(id), 6, 30, 12, 0, 0);
                        break;

                    case "3":
                        fechaInicio = new DateTime(int.Parse(id), 7, 1, 12, 0, 0);
                        fechaTermino = new DateTime(int.Parse(id), 9, 30, 12, 0, 0);
                        break;

                    case "4":
                        fechaInicio = new DateTime(int.Parse(id), 10, 1, 12, 0, 0);
                        fechaTermino = new DateTime(int.Parse(id), 12, 31, 12, 0, 0);
                        break;

                    default:
                        fechaInicio = new DateTime(int.Parse(id), 1, 1, 12, 0, 0);
                        fechaTermino = new DateTime(int.Parse(id), 12, 31, 12, 0, 0);
                        break;
                }



                var accesoMT = await _db.bdSetAccesoModulos.Where(e => e.fecha > fechaInicio && e.fecha < fechaTermino).CountAsync();

                var accesoOCs = await _db.bdSetAccesoOcModulos.Where(e => e.fecha > fechaInicio && e.fecha < fechaTermino).CountAsync();


                string cant1 = accesoMT.ToString();
                string cant2 = accesoOCs.ToString();


                double porcentaje = double.Parse(cant2) / double.Parse(cant1);

                if (porcentaje > 0)
                {
                    indicador = porcentaje * 100;
                }
                
                return indicador.ToString();

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
        // ~AceesoModulosRepository() {
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
