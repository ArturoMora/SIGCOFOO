﻿using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories
{
    public class UbicacionAreasRepository : IDisposable
    {
       
        private GEN_Context _db;

        public UbicacionAreasRepository()
        { 
            _db = new GEN_Context();
        }

        public async Task<IEnumerable<UbicacionAreas>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetUbicacion.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<UbicacionAreas> GetById(int id)
        {
            try
            {
                var entities = await _db.dbSetUbicacion.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.UbicacionAreaId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(UbicacionAreas model)
        {
            try
            {

                _db.dbSetUbicacion.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(UbicacionAreas model)
        {
            try
            {
                var _model = await _db.dbSetUbicacion.FirstOrDefaultAsync(e => e.UbicacionAreaId == model.UbicacionAreaId);
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
                var _model = await _db.dbSetUbicacion.FirstOrDefaultAsync(e => e.UbicacionAreaId== id);
                if (_model != null)
                {
                    _db.dbSetUbicacion.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(UbicacionAreas obj)
        {
            try
            {
                var _obj = await _db.dbSetUbicacion.FirstOrDefaultAsync(e => e.UbicacionAreaId == obj.UbicacionAreaId);
                if (_obj != null)
                {
                    _obj.Estado = obj.Estado;

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