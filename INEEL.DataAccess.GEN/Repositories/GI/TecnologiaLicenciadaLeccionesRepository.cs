using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GI;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Linq;
using System;

namespace INEEL.DataAccess.GEN.Repositories.GI
{
    public class TecnologiaLicenciadaLeccionesRepository
    {

        private GI_Context dbGI;
        public TecnologiaLicenciadaLeccionesRepository()
        {
            dbGI = new GI_Context();
        }
        public async Task<IEnumerable<TecnologiaLicenciadaLecciones>> GetAll()
        {
            try
            {
                var entities = await dbGI.DbSetTecnologiaLicenciadaLecciones.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<TecnologiaLicenciadaLecciones> GetById(int id)
        {
            try
            {
                var entities = await dbGI.DbSetTecnologiaLicenciadaLecciones.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.Id == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task CreateLecciones(List<TecnologiaLicenciadaLecciones> models, string clavePersona, string nombrePersona)
        {
            try
            {
                foreach (var model in models)
                {
                    if (model.Id <1)
                    {
                        dbGI.DbSetTecnologiaLicenciadaLecciones.Add(model);
                        await dbGI.SaveChangesAsync();
                        await this.AddBitacoraMovimiento(model, clavePersona, nombrePersona, "Se agrega una lección aprendida");
                    }
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task Create(TecnologiaLicenciadaLecciones model, string clavePersona, string nombrePersona)
        {
            try
            {

                dbGI.DbSetTecnologiaLicenciadaLecciones.Add(model);
                await dbGI.SaveChangesAsync();
                await this.AddBitacoraMovimiento(model, clavePersona, nombrePersona, "Se agrega lección aprendida");
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        private async Task AddBitacoraMovimiento(TecnologiaLicenciadaLecciones model,
String clavePersona, String nombrePersona, String movimiento)
        {
            try
            {
                if (model != null)
                {
                    var fecha = DateTime.Now;

                    BitacoraMovimientosGI bita = new BitacoraMovimientosGI();
                    bita.Fecha = fecha;
                    bita.ClavePersona = clavePersona;
                    bita.Movimiento = movimiento;
                    bita.OcsId = "STL";
                    bita.RegistroId = model.TecnologiaLicenciadaId;
                    dbGI.DbSetBitacoraMovimientosGI.Add(bita);
                    await dbGI.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task Update(TecnologiaLicenciadaLecciones model)
        {
            try
            {
                var _model = await dbGI.DbSetTecnologiaLicenciadaLecciones.FirstOrDefaultAsync(e => e.Id == model.Id);
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
                var _model = await dbGI.DbSetTecnologiaLicenciadaLecciones.FirstOrDefaultAsync(e => e.Id == id);
                if (_model != null)
                {
                    dbGI.DbSetTecnologiaLicenciadaLecciones.Remove(_model);
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
