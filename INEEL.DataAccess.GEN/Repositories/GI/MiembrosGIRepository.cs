using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Models.GI;

namespace INEEL.DataAccess.GEN.Repositories.GI
{
    public class MiembrosGIRepository : IDisposable
    {

        private GI_Context _db;
        private GEN_Context _GENContext;
        RolPersonaRepository _RolPersonaRepo;
        public MiembrosGIRepository()
        {
            _db = new GI_Context();
            _GENContext = new GEN_Context();
            _RolPersonaRepo = new RolPersonaRepository();
        }


        public async Task<IEnumerable<MiembrosGI>> GetAll()
        {
            try
            {
                var entities = await _db.DbSetMiembrosGI.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<MiembrosGI>> GetActivosByGrupo(int id)
        {
            try
            {
                var entities = await _db.DbSetMiembrosGI.Where(e=>e.ComiteGIId==id && e.Activo==true).AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<MiembrosGI>> GetInactivosByGrupo(int id)
        {
            try
            {
                var entities = await _db.DbSetMiembrosGI.Where(e => e.ComiteGIId == id && e.Activo == false).AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<MiembrosGI> GetById(int id)
        {
            try
            {
                var entities = await _db.DbSetMiembrosGI.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.Id == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<string> Create(MiembrosGI model)
        {
            try
            {
                if (!model.ExisteEn(_db.DbSetMiembrosGI.Where(e=> e.ComiteGIId==model.ComiteGIId).Select(e => e.ClavePersona).ToList(), "ClavePersona"))
                {
                    _db.DbSetMiembrosGI.Add(model);
                    await _db.SaveChangesAsync();
                    
                    //Verificamos la existencia del rol evaluador GI en la base de datos
                    var roles = await _GENContext.dbSetRolPersona.Where(e => e.ClavePersona == model.ClavePersona && e.IdRol==1029).AsNoTracking().ToListAsync();
                    if(roles.Count<=0){
                        RolPersona nuevo = new RolPersona();
                        nuevo.Estado = 1;
                        nuevo.IdRol = 1029;
                        nuevo.ClavePersona = model.ClavePersona;
                        await _RolPersonaRepo.Create(nuevo);
                    }

                    return "Registro creado exitosamente!";
                }
                else
                {
                    return "Ya existe un registro con ese nombre.";
                }

               
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(MiembrosGI model)
        {
            try
            {
                var _model = await _db.DbSetMiembrosGI.FirstOrDefaultAsync(e => e.Id == model.Id);
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

        public async Task InactivaMiembro(MiembrosGI model)
        {
            try
            {
                var _model = await _db.DbSetMiembrosGI.FirstOrDefaultAsync(e => e.Id == model.Id);
                if (_model != null)
                {
                    //Contamos la cantidad de grupos en los que se encuentra activo el usuario
                    var gruposActivosMiembro = await _db.DbSetMiembrosGI.Where(e => e.ClavePersona== model.ClavePersona && e.Activo==true).AsNoTracking().CountAsync();

                    var _rol= await _GENContext.dbSetRolPersona.Where(e=> e.ClavePersona==model.ClavePersona && e.IdRol==1029).FirstOrDefaultAsync();
                    if(gruposActivosMiembro== 1 && _rol!=null){ //En teoria hasta este momento solo se deberia de estar en un solo grupo como evaluador
                        // _rol.Estado = 0;
                        // await _GENContext.SaveChangesAsync();
                        RolPersonaRepository repo= new RolPersonaRepository();
                        await repo.Delete(_rol.RolPersonaId);
                    }

                    _db.Entry(_model).CurrentValues.SetValues(model);
                    await _db.SaveChangesAsync();



                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task ActivaMiembro(MiembrosGI model)
        {
            try
            {
                var _model = await _db.DbSetMiembrosGI.FirstOrDefaultAsync(e => e.Id == model.Id);
                if (_model != null)
                {
                    //Verificamos la existencia del rol evaluador GI en la base de datos
                    var roles = await _GENContext.dbSetRolPersona.Where(e => e.ClavePersona == model.ClavePersona && e.IdRol==1029).AsNoTracking().CountAsync();
                    if(roles==0){
                        RolPersona nuevo = new RolPersona();
                        nuevo.Estado = 1;
                        nuevo.IdRol = 1029;
                        nuevo.ClavePersona = model.ClavePersona;
                        await _RolPersonaRepo.Create(nuevo);
                    }

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
                var _model = await _db.DbSetMiembrosGI.FirstOrDefaultAsync(e => e.Id == id);
                if (_model != null)
                {
                    _db.DbSetMiembrosGI.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task DeleteWithRol(int id)
        {
            try
            {
                var _model = await _db.DbSetMiembrosGI.FirstOrDefaultAsync(e => e.Id == id);
                if (_model != null)
                {
                    
                    //Se elimina el rol de la base de datos
                    //var _rol= await _GENContext.dbSetRolPersona.Where(e=> e.ClavePersona==_model.ClavePersona && e.IdRol==1029).FirstOrDefaultAsync();
                    //if(_rol!=null){ //Se agrega esta validacion para los registros viejos que se hayan realizado durante el periodo de pruebas
                    //    _GENContext.dbSetRolPersona.Remove(_rol);
                    //    await _GENContext.SaveChangesAsync();
                    //}
                    
                    //Se elimina al miembro
                    _db.DbSetMiembrosGI.Remove(_model);
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
