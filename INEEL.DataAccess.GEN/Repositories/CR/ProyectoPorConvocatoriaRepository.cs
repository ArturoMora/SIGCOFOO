using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class ProyectoPorConvocatoriaRepository : IDisposable
    {

        private CR_Context _db;
        public ProyectoPorConvocatoriaRepository()
        {
            _db = new CR_Context();
        }


        public async Task<IEnumerable<ProyectoPorConvocatoria>> GetAll()
        {
            try
            {
                var entities = await _db.ProyectoPorConvocatoria.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<ProyectoPorConvocatoria> Get(int id)
        {
            try
            {
                var entities = await _db.ProyectoPorConvocatoria.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.ProyectoPorConvocatoriaId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(ProyectoPorConvocatoria model)
        {
            try
            {
                if (model.proyectosE.Length >= 0)
                {
                    foreach (var item in model.proyectosE)
                    {
                        model.ProyectoId = item;
                        _db.ProyectoPorConvocatoria.Add(model);
                        await _db.SaveChangesAsync();
                    }
                }
                    

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<ProyectoPorConvocatoria> ValidaConvocatoria(int convocatoriaId)
        {
            try
            {
                var entities = await _db.ProyectoPorConvocatoria.AsNoTracking()
                     .FirstOrDefaultAsync(e => e.ConvocatoriaId == convocatoriaId);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //public async Task<ProyectoPorConvocatoria> ValidaExist(ProyectoPorConvocatoria model)
        //{
        //    try
        //    {
        //        var _model = await _db.ProyectoPorConvocatoria.FirstOrDefaultAsync(e => e.ConvocatoriaId == model.ConvocatoriaId && e.ProyectoId == model.ProyectoId);
        //        if (_model != null)
        //        {
        //            return _model;
        //        }
        //        else {
        //            return null;
        //        }

        //   }
        //    catch (Exception e)
        //    {
        //        throw new Exception(e.Message, e);
        //    }
        //}

        public async Task Update(ProyectoPorConvocatoria model)
        {
            try
            {
                var _model = await _db.ProyectoPorConvocatoria.FirstOrDefaultAsync(e => e.ProyectoPorConvocatoriaId == model.ProyectoPorConvocatoriaId);
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

        public async Task UpdateEstado(ProyectoPorConvocatoria model)
        {
            try
            {
                var _model = await _db.ProyectoPorConvocatoria.FirstOrDefaultAsync(e => e.ProyectoPorConvocatoriaId == model.ProyectoPorConvocatoriaId);
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
                var _model = await _db.ProyectoPorConvocatoria.FirstOrDefaultAsync(e => e.ProyectoPorConvocatoriaId == id);
                if (_model != null)
                {
                    _db.ProyectoPorConvocatoria.Remove(_model);
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

