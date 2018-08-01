using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GI;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Linq;
using System;

namespace INEEL.DataAccess.GEN.Repositories.GI
{
    public class BitacoraMovimientosGIRepository
    {

        private GI_Context dbGI;
        public BitacoraMovimientosGIRepository()
        {
            dbGI = new GI_Context();
        }

        public async Task<IEnumerable<Object>> GetAllByRegistroId(int registroId, String OcsId)
        {
            try
            {
                var entities = await dbGI.DbSetBitacoraMovimientosGI.AsNoTracking()
                    .Where(x => x.RegistroId == registroId && OcsId.Equals(x.OcsId))
                    .Select(x => new {
                        Id = x.Id,
                        ClavePersona = x.ClavePersona,
                        Fecha = x.Fecha,
                        Movimiento = x.Movimiento,
                        OcsId = x.OcsId,
                        RegistroId = x.RegistroId,
                        NombrePersona = dbGI.DbSetPersonas
                                        .Where(p => p.ClavePersona.Equals(x.ClavePersona))
                                        .OrderByDescending(p => p.FechaEfectiva)
                                        .Select(p => String.Concat(p.Nombre, " ", p.ApellidoPaterno, " ", p.ApellidoMaterno)).FirstOrDefault(),
                    })
                    .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<BitacoraMovimientosGI>> GetAll()
        {
            try
            {
                var entities = await dbGI.DbSetBitacoraMovimientosGI.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<BitacoraMovimientosGI> GetById(int id)
        {
            try
            {
                var entities = await dbGI.DbSetBitacoraMovimientosGI.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.Id == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(BitacoraMovimientosGI model)
        {
            try
            {

                dbGI.DbSetBitacoraMovimientosGI.Add(model);
                await dbGI.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(BitacoraMovimientosGI model)
        {
            try
            {
                var _model = await dbGI.DbSetBitacoraMovimientosGI.FirstOrDefaultAsync(e => e.Id == model.Id);
                if (_model != null)
                {
                    dbGI.Entry(_model).CurrentValues.SetValues(model);
                    await dbGI.SaveChangesAsync();
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
                var _model = await dbGI.DbSetBitacoraMovimientosGI.FirstOrDefaultAsync(e => e.Id == id);
                if (_model != null)
                {
                    dbGI.DbSetBitacoraMovimientosGI.Remove(_model);
                    await dbGI.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public void Dispose()
        {
            dbGI.Dispose(); //ayudar al recolector de basura
        }

    }
}
