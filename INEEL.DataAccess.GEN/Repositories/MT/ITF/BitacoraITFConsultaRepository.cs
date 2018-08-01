using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.MT.ITF;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.MT.ITF
{
    public class BitacoraITFConsultaRepository : IDisposable
    {


        private MT_Context _db;
        public BitacoraITFConsultaRepository(MT_Context ctx)
        {
            _db =ctx;
        }
        public BitacoraITFConsultaRepository()
        {
            _db = new MT_Context();
        }

        //public async Task<IEnumerable<BitacoraITFConsulta>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<BitacoraITFConsulta>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetBitacoraITFConsulta.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<BitacoraITFConsulta> Get(int id)
        {
            try
            {
                var entities = await _db.dbSetBitacoraITFConsulta.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.BitacoraITFConsultaId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(BitacoraITFConsulta model)
        {
            try
            {

                _db.dbSetBitacoraITFConsulta.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(BitacoraITFConsulta model)
        {
            try
            {
                var _model = await _db.dbSetBitacoraITFConsulta.FirstOrDefaultAsync(e => e.BitacoraITFConsultaId == model.BitacoraITFConsultaId);
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
                var _model = await _db.dbSetBitacoraITFConsulta.FirstOrDefaultAsync(e => e.BitacoraITFConsultaId == id);
                if (_model != null)
                {
                    _db.dbSetBitacoraITFConsulta.Remove(_model);
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
