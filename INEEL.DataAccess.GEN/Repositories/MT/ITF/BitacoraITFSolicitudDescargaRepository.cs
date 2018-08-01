using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.MT.ITF;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.MT.ITF
{
    public class BitacoraITFSolicitudDescargaRepository : IDisposable
    {
        private MT_Context _db;
        public BitacoraITFSolicitudDescargaRepository()
        {
            _db = new MT_Context();
        }



        public async Task Create(BitacoraITFSolicitudDescarga model)
        {
            try
            {
                _db.dbSetBitacoraITFSolicitudDescarga.Add(model);
                await _db.SaveChangesAsync();

            }catch(Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<BitacoraITFSolicitudDescarga> Get(int id)
        {
            try
            {
                var result = await _db.dbSetBitacoraITFSolicitudDescarga.Where(e => e.id == id).AsNoTracking().FirstOrDefaultAsync();
                return result;
            }
            catch(Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<BitacoraITFSolicitudDescarga> GetBySolicitud(int id)
        {
            try
            {
                var result = await _db.dbSetBitacoraITFSolicitudDescarga.Where(e => e.idsolicitud == id).AsNoTracking().FirstOrDefaultAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(BitacoraITFSolicitudDescarga model)
        {
            try
            {
                var _model = await _db.dbSetBitacoraITFSolicitudDescarga.Where(e => e.iditf== model.iditf 
                        && e.claveSolicitante== model.claveSolicitante
                        && e.idsolicitud== model.idsolicitud).FirstOrDefaultAsync();
                if (_model != null)
                {
                    _model.claveAutorizador = model.claveAutorizador;
                    _model.permisoDescarga = model.permisoDescarga;
                }
                await _db.SaveChangesAsync();
            }catch(Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task UpdatePermisoDescarga(BitacoraITFSolicitudDescarga model)
        {
            try
            {
                var _model = await _db.dbSetBitacoraITFSolicitudDescarga.Where(e => e.iditf == model.iditf
                        && e.claveSolicitante == model.claveSolicitante
                        && e.idsolicitud == model.idsolicitud).FirstOrDefaultAsync();
                if (_model != null)
                {
                    _model.permisoDescarga = model.permisoDescarga;
                }
                await _db.SaveChangesAsync();
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
                var _model= await _db.dbSetBitacoraITFSolicitudDescarga.Where(e => e.id == id).AsNoTracking().FirstOrDefaultAsync();
                if (_model != null)
                {
                    _db.dbSetBitacoraITFSolicitudDescarga.Remove(_model);
                }
                await _db.SaveChangesAsync();
            }
            catch(Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public void Dispose()
        {
            _db.Dispose(); //ayudar al recolector de basura
        }
    }
}
