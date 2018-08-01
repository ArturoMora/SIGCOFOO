using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GI;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Linq;
using System;

namespace INEEL.DataAccess.GEN.Repositories.GI
{
    public class TecnologiaLicenciadaPIDARepository
    {

        private GI_Context dbGI;
        public TecnologiaLicenciadaPIDARepository()
        {
            dbGI = new GI_Context();
        }
        public async Task<IEnumerable<TecnologiaLicenciadaPIDA>> GetAll()
        {
            try
            {
                var entities = await dbGI.DbSetTecnologiaLicenciadaPIDA.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<TecnologiaLicenciadaPIDA> GetById(int id)
        {
            try
            {
                var entities = await dbGI.DbSetTecnologiaLicenciadaPIDA.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.Id == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(TecnologiaLicenciadaPIDA model)
        {
            try
            {

                dbGI.DbSetTecnologiaLicenciadaPIDA.Add(model);
                await dbGI.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        
         public async Task UpdateAll(List<TecnologiaLicenciadaPIDA> models)
        {
            try
            {
                foreach (var model in models)
                {               
                  
                        if (model.Id > 0)
                        {
                            if (model.DerechosAutor.Titulo.Equals("eliminar"))
                            {
                                await this.Delete(model.Id);
                            }
                        }
                  
                    else
                    {
                        model.TecnologiaLicenciada = null;
                        model.DerechosAutor = null;
                        await this.Create(model);
                    }
                }

            }
            
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task Update(TecnologiaLicenciadaPIDA model)
        {
            try
            {
                var _model = await dbGI.DbSetTecnologiaLicenciadaPIDA.FirstOrDefaultAsync(e => e.Id == model.Id);
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
                var _model = await dbGI.DbSetTecnologiaLicenciadaPIDA.FirstOrDefaultAsync(e => e.Id == id);
                if (_model != null)
                {
                    dbGI.DbSetTecnologiaLicenciadaPIDA.Remove(_model);
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
