using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.PI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.GEN.Repositories.PI
{
    public class HistorialPIRepository : IDisposable
    {
        PI_Context _pictx;
        public void Dispose()
        {
            throw new NotImplementedException();
        }

        public HistorialPIRepository()
        {
            _pictx = new PI_Context();
        }

        public async Task<Object> GetAllByPI(int propiedadid)
        {
            try
            {
                var historial = await (from registro in _pictx.PropiedadIndustrial
                                       where registro.PropiedadIndustrialId == propiedadid 
                                       select new {
                                           ConsecutivoInterno = registro.ConsecutivoInterno,
                                           Titulo= registro.Titulo,
                                           Historial = registro.Historial
                                       })
                                 .AsNoTracking()
                                 .FirstOrDefaultAsync();

                return historial;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(HistorialPI historial)
        {
            try
            {
                DateTime hoy = DateTime.Now;
                historial.FechaRegistroAccion = hoy;
                
                _pictx.Historial.Add(historial);
                await _pictx.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update (HistorialPI historial)
        {
            try
            {
                if (historial.Adjunto != null)
                {
                    if (historial.Adjunto.AdjuntoId == 0)
                    {
                        Adjunto key = await new AdjuntoRepository().CreateAd(historial.Adjunto);
                        historial.AdjuntoId = key.AdjuntoId;
                        historial.Adjunto.AdjuntoId = key.AdjuntoId;
                    }
                }
                var _historial = await _pictx.Historial.FirstOrDefaultAsync(e => e.HistorialPIId == historial.HistorialPIId);
                if(_historial != null)
                {
                    _pictx.Entry(_historial).CurrentValues.SetValues(historial);
                    await _pictx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Delete(int historialid)
        {
            try
            {
                var _model = await _pictx.Historial.FirstOrDefaultAsync(e => e.HistorialPIId == historialid);
                if (_model != null)
                {
                    _pictx.Historial.Remove(_model);
                    await _pictx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<HistorialPI> GetById(int historialid)
        {
            try
            {
                var _model = await _pictx.Historial.FirstOrDefaultAsync(e => e.HistorialPIId == historialid);
                return _model;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

    }
}
