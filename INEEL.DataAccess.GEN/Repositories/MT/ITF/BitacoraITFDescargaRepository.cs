using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.MT.ITF;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.MT.ITF
{
    public class BitacoraITFDescargaRepository : IDisposable
    {


        private MT_Context _db;
        public BitacoraITFDescargaRepository(MT_Context ctx)
        {
            _db =ctx;
        }
        public BitacoraITFDescargaRepository()
        {
            _db = new MT_Context();
        }

        //public async Task<IEnumerable<BitacoraITFDescarga>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<BitacoraITFDescarga>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetBitacoraITFDescarga.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<BitacoraITFDescarga> Get(int id)
        {
            try
            {
                var entities = await _db.dbSetBitacoraITFDescarga.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.BitacoraITFDescargaId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(BitacoraITFDescarga model)
        {
            try
            {

                _db.dbSetBitacoraITFDescarga.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(BitacoraITFDescarga model)
        {
            try
            {
                var _model = await _db.dbSetBitacoraITFDescarga.FirstOrDefaultAsync(e => e.BitacoraITFDescargaId == model.BitacoraITFDescargaId);
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
                var _model = await _db.dbSetBitacoraITFDescarga.FirstOrDefaultAsync(e => e.BitacoraITFDescargaId == id);
                if (_model != null)
                {
                    _db.dbSetBitacoraITFDescarga.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
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
