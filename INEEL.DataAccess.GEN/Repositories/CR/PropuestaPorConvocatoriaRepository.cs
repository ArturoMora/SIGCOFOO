using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CR;
using System.Linq;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class PropuestaPorConvocatoriaRepository : IDisposable
    {

        private CR_Context _db;
        public PropuestaPorConvocatoriaRepository()
        {
            _db = new CR_Context();
        }


        public async Task<IEnumerable<PropuestaPorConvocatoria>> GetAll()
        {
            try
            {
                var entities = await _db.PropuestaPorConvocatoria.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<PropuestaPorConvocatoria> Get(int id)
        {
            try
            {
                var entities = await _db.PropuestaPorConvocatoria.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.PropuestaPorConvocatoriaId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //public int ValidaConvocatoria(int convocatoriaId)
        //{
        //    try
        //    {
        //        int cont = 0;
        //        var _result = from PropuestaPorConvocatoria in _db.PropuestaPorConvocatoria
        //                      where (PropuestaPorConvocatoria.ConvocatoriaId == convocatoriaId)
        //                      select PropuestaPorConvocatoria;
        //        _db.PropuestaPorConvocatoria
        //        .AsNoTracking().Where(u => u.ConvocatoriaId == convocatoriaId).ToListAsync();

        //        cont = _result.ToList().Count();

        //        return cont;
        //    }
        //    catch (Exception e)
        //    {
        //        throw new Exception(e.Message, e);
        //    }
        //}

        public async Task<PropuestaPorConvocatoria> ValidaConvocatoria(int convocatoriaId)
        {
            try
            {
                var entities = await _db.PropuestaPorConvocatoria.AsNoTracking()
                     .FirstOrDefaultAsync(e => e.ConvocatoriaId == convocatoriaId);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task Create(PropuestaPorConvocatoria model)
        {
            try
            {
                if (model.propuestasE.Length >= 0)
                {
                    foreach (var item in model.propuestasE)
                    {
                        model.PropuestaId = item;
                        _db.PropuestaPorConvocatoria.Add(model);
                        await _db.SaveChangesAsync();
                    }
                }
               

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(PropuestaPorConvocatoria model)
        {
            try
            {
                var _model = await _db.PropuestaPorConvocatoria.FirstOrDefaultAsync(e => e.PropuestaPorConvocatoriaId == model.PropuestaPorConvocatoriaId);
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

        public async Task UpdateEstado(PropuestaPorConvocatoria model)
        {
            try
            {
                var _model = await _db.PropuestaPorConvocatoria.FirstOrDefaultAsync(e => e.PropuestaPorConvocatoriaId == model.PropuestaPorConvocatoriaId);
                if (_model != null)
                {
                    _model.Estado = model.Estado;

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
                var _model = await _db.PropuestaPorConvocatoria.FirstOrDefaultAsync(e => e.PropuestaPorConvocatoriaId == id);
                if (_model != null)
                {
                    _db.PropuestaPorConvocatoria.Remove(_model);
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
            _db.Dispose();
        }
    }
}

