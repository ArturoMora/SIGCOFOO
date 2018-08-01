using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GI;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Linq;
using System;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.GEN.Repositories.GI
{
    public class PeriodoFIRepository
    {

        private GI_Context dbGI;
        public PeriodoFIRepository()
        {
            dbGI = new GI_Context();
        }
        public async Task<IEnumerable<PeriodoFI>> GetAll()
        {
            try
            {
                var entities = await dbGI.DbSetPeriodoFI.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
            
        }
        public async Task<Boolean> GetInPeriodoByActivo()
        {
            
            try
            {                
                var entitie = await dbGI.DbSetPeriodoFI.AsNoTracking()
                    .Where(x => x.Estado == true)
                    .FirstOrDefaultAsync();
                if (entitie != null)
                {
                    var fecha = DateTime.Now;
                    if(entitie.FechaTerminoReal >= fecha)
                    {
                        return true;
                    }
                }
                return false;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<PeriodoFI> GetActivo()
        {
            try
            {
                var entitie = await dbGI.DbSetPeriodoFI.AsNoTracking()
                    .Where(x => x.Estado == true)
                    .FirstOrDefaultAsync();

                return entitie;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<Boolean> ExisteActivo()
        {
            try
            {
                var entities = await dbGI.DbSetPeriodoFI.AsNoTracking()
                    .Where(x=>x.Estado==true)
                    .FirstOrDefaultAsync();
                if (entities != null)
                {
                    return true;
                }
                return false;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<PeriodoFI> GetById(int id)
        {
            try
            {
                var entities = await dbGI.DbSetPeriodoFI.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.PeriodoFIId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(PeriodoFI model)
        {
            try
            {
                if (!model.ExisteEn(dbGI.DbSetPeriodoFI.Where(e => e.PeriodoFIId != model.PeriodoFIId).Select(e => e.Nombre).ToList(), "Nombre"))
                {

                    dbGI.DbSetPeriodoFI.Add(model);
                    await dbGI.SaveChangesAsync();
                    try
                    {
                        //////creacion del periodo de recepcion
                        PeriodoRecepcionRepository precep = new PeriodoRecepcionRepository();
                        PeriodoRecepcion modelRecep = new PeriodoRecepcion();
                        modelRecep.PeriodoFIId = model.PeriodoFIId;
                        modelRecep.FechaInicioPlaneada = model.FechaInicioPlaneada;
                        modelRecep.FechaInicioReal = model.FechaInicioReal;
                        var fechaFin = model.FechaInicioReal;
                        fechaFin = fechaFin.AddDays(30);

                        modelRecep.FechaTerminoPlaneada = fechaFin;
                        modelRecep.FechaTerminoReal = fechaFin;
                        await precep.Create(modelRecep);

                        //////creacion del periodo de replica
                        PeriodoReplicaRepository replicaDB = new PeriodoReplicaRepository();
                        PeriodoReplica replica = new PeriodoReplica();
                        var fechaFInReplica = fechaFin.AddDays(31);
                        replica.PeriodoFIId = model.PeriodoFIId;
                        replica.FechaInicioPlaneada = fechaFin.AddDays(1);
                        replica.FechaInicioReal = replica.FechaInicioPlaneada;
                        replica.FechaTerminoPlaneada = fechaFInReplica;
                        replica.FechaTerminoReal = fechaFInReplica;
                        await replicaDB.Create(replica);
                    }
                    catch (Exception err)
                    {
                        await this.Delete(model.PeriodoFIId);
                        throw new Exception(err.Message, err);
                    }
                }
                else
                {
                    throw new ApplicationException("Ya existe un registro con ese nombre.");
                }

            }
            catch (ApplicationException e)
            {
                throw new ApplicationException(e.Message, e);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        
         public async Task UpdateEstado(PeriodoFI model)
        {
            try
            {
                var _anterior = await dbGI.DbSetPeriodoFI.Where(x => x.Estado == true).FirstOrDefaultAsync();
                if (_anterior != null)
                {
                    _anterior.Estado = false;
                    await dbGI.SaveChangesAsync();
                }


                var _model = await dbGI.DbSetPeriodoFI.FirstOrDefaultAsync(e => e.PeriodoFIId == model.PeriodoFIId);
                if (_model != null)
                {
                    _model.Estado = model.Estado;
                    await dbGI.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task Update(PeriodoFI model)
        {
            try
            {
                var _model = await dbGI.DbSetPeriodoFI.FirstOrDefaultAsync(e => e.PeriodoFIId == model.PeriodoFIId);
                if (_model != null)
                {
                    if (!model.ExisteEn(dbGI.DbSetPeriodoFI.Where(e => e.PeriodoFIId != model.PeriodoFIId).Select(e => e.Nombre).ToList(), "Nombre"))
                    {
                        dbGI.Entry(_model).CurrentValues.SetValues(model);
                        await dbGI.SaveChangesAsync();
                    }
                    else
                    {
                        throw new ApplicationException("Ya existe un registro con ese nombre.");
                    }
                }

            }
            catch (ApplicationException e)
            {
                throw new ApplicationException(e.Message, e);
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
                var _model = await dbGI.DbSetPeriodoFI.FirstOrDefaultAsync(e => e.PeriodoFIId == id);
                if (_model != null)
                {
                    dbGI.DbSetPeriodoFI.Remove(_model);
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
