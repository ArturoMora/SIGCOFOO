using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;
using INEEL.DataAccess.GEN.Models.GEN;
using System.Linq;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class GrupoColegiadoPartIntRepository : IDisposable
    {

        private CR_Context _db;
        private GEN_Context _dbGEN;

        public GrupoColegiadoPartIntRepository()
        {
            _db = new CR_Context();
            _dbGEN = new GEN_Context();
        }
        public async Task<int> countByStatus(Boolean estadoFlujo)
        {
            try
            {
                return await (from t in _db.GrupoColegiadoPartInt
                               .Where(f => f.Estado == estadoFlujo)
                              select t).CountAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<GrupoColegiadoPartInt>> GetAll()
        {
            try
            {
                var entities = await _db.GrupoColegiadoPartInt
                    .AsNoTracking()
                    .Include(e => e.NaturalezaInteraccion)
                    .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<GrupoColegiadoPartInt>> GetAllFKs()
        {
            try
            {
                var entities = await _db.GrupoColegiadoPartInt
                    .AsNoTracking()
                    .Include("Contacto.Empresa")
                    .Include(e => e.NaturalezaInteraccion)
                    .Include(i => i.IntegranteGrupoColegiadoExterno)
                    .Include("IntegranteGrupoColegiadoExterno.Contacto")
                    .ToListAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<GrupoColegiadoPartInt> GetFKById(int id)
        {
            try
            {
                var entities = await _db.GrupoColegiadoPartInt
                     .AsNoTracking()
                    .Include("Contacto.Empresa")
                    .Include(e => e.NaturalezaInteraccion)
                     .Include(f => f.Estados)
                     .Include(g => g.Municipios)
                    .Include(i => i.IntegranteGrupoColegiadoExterno)
                    .Include(x => x.IntegranteGrupoColegiadoInterno)
                    .Include("IntegranteGrupoColegiadoExterno.Contacto.Empresa")
                    .FirstOrDefaultAsync(e => e.GrupoColegiadoPartIntId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<GrupoColegiadoPartInt> Get(int id)
        {
            try
            {
                var entities = await _db.GrupoColegiadoPartInt.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.GrupoColegiadoPartIntId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(GrupoColegiadoPartInt model)
        {
            try
            {

                _db.GrupoColegiadoPartInt.Add(model);
                await _db.SaveChangesAsync();

                if (model.IntegrantesE.Length >= 0)
                {
                    await InsertaIntegranteGC(model);

                }

                if (model.IntegrantesIE.Length >= 0)
                {
                    await InsertaIntegranteIIEGC(model);

                }

                // await new NuevoOCRepository(_dbGEN).Create(new NuevoOC("CR", "PARTINTGRUPC", model.Nombre, "IndexCR.html#/detallesGrupoColegiadoPartIntC/" + model.GrupoColegiadoPartIntId));
                await new NuevoOCRepository(_dbGEN).Create(new NuevoOC("CR", "PARTINTGRUP", model.Nombre, "IndexCR.html#/detallesGrupoColegiadoPartInt/" + model.GrupoColegiadoPartIntId));
                

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        private async Task InsertaIntegranteGC(GrupoColegiadoPartInt model)
        {
            try
            {
                for (int i=0; i<model.IntegrantesE.Length;i++) {
                    IntegranteGrupoColegiadoExterno obj = new IntegranteGrupoColegiadoExterno();

                    var item = model.IntegrantesE[i];
                        var item2=model.Cargos[i];

                        obj.GrupoColegiadoPartIntId = model.GrupoColegiadoPartIntId;
                        obj.ContactoId = item;
                        obj.CargoGC = item2;
                        obj.FechaRegistro = model.FechaRegistro;
                        obj.Autor = model.Autor;
                        obj.Estado = true;

                        var entities = _db.IntegranteGrupoColegiadoExterno.Add(obj);
                        await _db.SaveChangesAsync();
                }
                    
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        private async Task InsertaIntegranteIIEGC(GrupoColegiadoPartInt model)
        {
            try
            {
                for (int i = 0; i < model.IntegrantesIE.Length; i++)
                {
                    IntegranteGrupoColegiadoInterno obj = new IntegranteGrupoColegiadoInterno();

                    var item = model.IntegrantesIE[i];
                    var item2 = model.CargosI[i];
                    var item3 = model.NombresIE[i];

                    obj.GrupoColegiadoPartIntId = model.GrupoColegiadoPartIntId;
                    obj.ClaveEmpleado = item;
                    obj.CargoGC = item2;
                    obj.FechaRegistro = model.FechaRegistro;
                    obj.Autor = model.Autor;
                    obj.Nombre = item3;
                    obj.Estado = true;

                    var entities = _db.IntegranteGrupoColegiadoInterno.Add(obj);
                    await _db.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(GrupoColegiadoPartInt model)
        {
            try
            {
                var _model = await _db.GrupoColegiadoPartInt.FirstOrDefaultAsync(e => e.GrupoColegiadoPartIntId == model.GrupoColegiadoPartIntId);
                if (_model != null)
                {
                    _db.Entry(_model).CurrentValues.SetValues(model);
                    await _db.SaveChangesAsync();

                    //if (model.IntegrantesN.Length >= 0)
                    //{
                    //    await ActualizaIntegranteGC(model);

                    //}
                    //if (model.integrantesAntDel.Length >= 0)
                    //{
                    //    await EliminaIntegranteGC(model);
                    //}
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        private async Task ActualizaIntegranteGC(GrupoColegiadoPartInt model)
        {
            try
            {



                if (model.IntegrantesN == null)
                {
                    foreach (var obj in  model.IntegranteGrupoColegiadoExterno)
                    {
                       
                        obj.GrupoColegiadoPartIntId = model.GrupoColegiadoPartIntId;
                        obj.ContactoId = obj.ContactoId;
                        obj.CargoGC = obj.CargoGC;
                        obj.FechaRegistro = model.FechaRegistro;
                        obj.Autor = model.Autor;
                        obj.Estado = true;

                        var entities = _db.IntegranteGrupoColegiadoExterno.Add(obj);
                        await _db.SaveChangesAsync();
                    }
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        
        }

        private async Task EliminaIntegranteGC(GrupoColegiadoPartInt model)
        {
            try
            {
                foreach (var item in model.integrantesAntDel)
                {
                    //Crea el objeto de la tabla en la que se desea agregar el registro
                    IntegranteGrupoColegiadoExterno objSitioWeb = new IntegranteGrupoColegiadoExterno();

                    var _model = await _db.IntegranteGrupoColegiadoExterno.FirstOrDefaultAsync(e => e.IntegranteGrupoColegiadoExternoId == item);
                    if (_model != null)
                    {
                        _db.IntegranteGrupoColegiadoExterno.Remove(_model);
                        await _db.SaveChangesAsync();
                    }

                }
            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(GrupoColegiadoPartInt model)
        {
            try
            {
                var _model = await _db.GrupoColegiadoPartInt.FirstOrDefaultAsync(e => e.GrupoColegiadoPartIntId == model.GrupoColegiadoPartIntId);
                if (_model != null)
                {
                    _model.Estado = model.Estado;
                    var infoAgregada = await _dbGEN.dbSetNuevoOC.Where(e => e.descripcion.Equals(_model.Contacto.NombreCompleto) && e.OcsId == "PARTINTGRUP").FirstOrDefaultAsync();
                    if (infoAgregada != null && model.Estado == false)
                    {
                        NuevoOCRepository repo = new NuevoOCRepository();
                        await repo.Delete(infoAgregada.NuevoOCId);
                    }
                    else
                    {
                        var _contacto = await _db.Contacto.FirstOrDefaultAsync(e => e.ContactoId == model.ContactoId);
                        if (_contacto != null)
                        {
                            await new NuevoOCRepository(_dbGEN).Create(new NuevoOC("CR", "PARTINTGRUP", _contacto.NombreCompleto, "IndexCR.html#/detallesGrupoColegiadoPartInt/" + model.GrupoColegiadoPartIntId));
                        }
                    }
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
                var _model = await _db.GrupoColegiadoPartInt.FirstOrDefaultAsync(e => e.GrupoColegiadoPartIntId == id);
                if (_model != null)
                {
                    var infoAgregada = await _dbGEN.dbSetNuevoOC.Where(e => e.descripcion.Equals(_model.Nombre) && e.OcsId=="PARTINTGRUP").FirstOrDefaultAsync();
                    if(infoAgregada!=null){
                        NuevoOCRepository repo= new NuevoOCRepository();
                        await repo.Delete(infoAgregada.NuevoOCId);
                    }
                    _db.GrupoColegiadoPartInt.Remove(_model);
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

