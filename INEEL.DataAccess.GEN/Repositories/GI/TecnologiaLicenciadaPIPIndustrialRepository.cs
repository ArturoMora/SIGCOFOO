using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GI;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Linq;
using System;

namespace INEEL.DataAccess.GEN.Repositories.GI
{
    public  class TecnologiaLicenciadaPIPIndustrialRepository
    {

        private GI_Context dbGI;
        public TecnologiaLicenciadaPIPIndustrialRepository()
        {
            dbGI = new GI_Context();
        }
        public async Task<IEnumerable<TecnologiaLicenciadaPIPIndustrial>> GetAll()
        {
            try
            {
                var entities = await dbGI.DbSetTecnologiaLicenciadaPIPIndustrial.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<TecnologiaLicenciadaPIPIndustrial> GetById(int id)
        {
            try
            {
                var entities = await dbGI.DbSetTecnologiaLicenciadaPIPIndustrial.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.Id == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(TecnologiaLicenciadaPIPIndustrial model)
        {
            try
            {

                dbGI.DbSetTecnologiaLicenciadaPIPIndustrial.Add(model);
                await dbGI.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task UpdateAll(List<TecnologiaLicenciadaPIPIndustrial> models)
        {
            try
            {
                foreach (var model in models)
                {
                    try
                    {

                   

                    if (model.Id > 0)
                    {
                        if (model.PropiedadIndustrial.Titulo.Equals("eliminar"))
                        {
                            await this.Delete(model.Id);
                        }
                    }

                    else
                    {
                        model.TecnologiaLicenciada = null;
                        model.PropiedadIndustrial = null;
                        await this.Create(model);
                    }

                    }
                    catch (Exception err)
                    {

                        throw new Exception(err.Message, err);
                    }


                }

            }

            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task Update(TecnologiaLicenciadaPIPIndustrial model)
        {
            try
            {
                var _model = await dbGI.DbSetTecnologiaLicenciadaPIPIndustrial.FirstOrDefaultAsync(e => e.Id == model.Id);
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
                var _model = await dbGI.DbSetTecnologiaLicenciadaPIPIndustrial.FirstOrDefaultAsync(e => e.Id == id);
                if (_model != null)
                {
                    dbGI.DbSetTecnologiaLicenciadaPIPIndustrial.Remove(_model);
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
