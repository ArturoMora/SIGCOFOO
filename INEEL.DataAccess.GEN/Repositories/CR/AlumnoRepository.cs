using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class AlumnoRepository : IDisposable
    {
        private CR_Context _db;
        public AlumnoRepository()
        {
            _db = new CR_Context();
        }

        public async Task<IEnumerable<Alumno>> GetAll()
        {
            try
            {
                var entities = await _db.Alumno.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Alumno> GetById(int id)
        {
            try
            {
                var entities = await _db.Alumno.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.AlumnoId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(Alumno model)
        {
            try
            {

                _db.Alumno.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(Alumno model)
        {
            try
            {
                var _model = await _db.Alumno.FirstOrDefaultAsync(e => e.AlumnoId == model.AlumnoId);
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
                var _model = await _db.Alumno.FirstOrDefaultAsync(e => e.AlumnoId == id);
                if (_model != null)
                {
                    _db.Alumno.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //public async Task UpdateEstado(Alumno model)
        //{
        //    try
        //    {
        //        var _model = await _db.Alumno.FirstOrDefaultAsync(e => e.AlumnoId == model.AlumnoId);
        //        if (_model != null)
        //        {
        //            _model.Estado = model.Estado;

        //            await _db.SaveChangesAsync();
        //        }
        //    }
        //    catch (Exception e)
        //    {
        //        throw new Exception(e.Message, e);
        //    }
        //}

        public void Dispose()
        {
            _db.Dispose();
        }
    }
}