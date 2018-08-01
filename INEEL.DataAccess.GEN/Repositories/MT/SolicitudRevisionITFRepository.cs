using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.MT.ITF;
using INEEL.DataAccess.MT.Models;
using INEEL.DataAccess.MT.Models.ITF.catalogos;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Dynamic;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.MT.ITF
{
    public class SolicitudRevisionITFRepository : IDisposable
    {
        private GEN_Context _db;
        private MT_Context _dbMT;
        public SolicitudRevisionITFRepository()
        {
            _db = new GEN_Context();
            _dbMT = new MT_Context();
        }



        /*   public async Task<IEnumerable<SolicitudRevisionITF>> GetAll()
           {
               try
               {
                   var entities = await _dbMT.dbSetSolicitudRevisionITF.AsNoTracking().ToListAsync();
                   return entities;

               }
               catch (Exception e)
               {
                   throw new Exception(e.Message, e);
               }
           }

           public async Task<SolicitudRevisionITF> Get(int id)
           {
               try
               {
                   var entities = await _dbMT.dbSetSolicitudRevisionITF.AsNoTracking()
                       // .Include(x=> x.FK)
                       .FirstOrDefaultAsync(e => e.SolicitudRevisionITFId == id);
                   return entities;
               }
               catch (Exception e)
               {
                   throw new Exception(e.Message, e);
               }
           }



           public async Task Create(SolicitudRevisionITF model)
           {
               try
               {

                   _dbMT.dbSetSolicitudRevisionITF.Add(model);
                   await _dbMT.SaveChangesAsync();

               }
               catch (Exception e)
               {
                   throw new Exception(e.Message, e);
               }
           }

           public async Task Update(SolicitudRevisionITF model)
           {
               try
               {
                   var _model = await _dbMT.dbSetSolicitudRevisionITF.FirstOrDefaultAsync(e => e.SolicitudRevisionITFId == model.SolicitudRevisionITFId && e.ClavePersonaSolicitante == model.ClavePersonaSolicitante && e.ClavePersonaAutorizador == model.ClavePersonaAutorizador);
                   if (_model != null)
                   {
                       _model.Justificacion = model.Justificacion;
                       _model.FechaSolicitud = model.FechaSolicitud;
                       _model.EstadoSolicitudId = model.EstadoSolicitudId;
                       await _dbMT.SaveChangesAsync();
                   }

               }
               catch (Exception e)
               {
                   throw new Exception(e.Message, e);
               }
           }

           public async Task UpdateCreate(SolicitudRevisionITF model)
           {
               try
               {
                   var _model = await _dbMT.dbSetSolicitudRevisionITF.FirstOrDefaultAsync(e => e.SolicitudRevisionITFId == model.SolicitudRevisionITFId && e.ClavePersonaSolicitante==model.ClavePersonaSolicitante&&e.ClavePersonaAutorizador==model.ClavePersonaAutorizador);
                   if (_model != null)
                   {
                       _model.Justificacion = model.Justificacion;
                       _model.FechaSolicitud = model.FechaSolicitud;
                       _model.EstadoSolicitudId = model.EstadoSolicitudId;
                       await _dbMT.SaveChangesAsync();
                   }
                   else {
                       try
                       {

                           _dbMT.dbSetSolicitudRevisionITF.Add(model);
                           await _dbMT.SaveChangesAsync();

                       }
                       catch (Exception e)
                       {
                           throw new Exception(e.Message, e);
                       }
                   }

               }
               catch (Exception e)
               {
                   throw new Exception(e.Message, e);
               }
           }

           public async Task UpdateEstado(SolicitudRevisionITF model)
           {
               try
               {
                   var _model = await _dbMT.dbSetSolicitudRevisionITF.FirstOrDefaultAsync(e => e.SolicitudRevisionITFId == model.SolicitudRevisionITFId);
                   if (_model != null)
                   {
                       _model.EstadoSolicitudId = model.EstadoSolicitudId;
                       await _dbMT.SaveChangesAsync();
                   }

               }
               catch (Exception e)
               {
                   throw new Exception(e.Message, e);
               }
           }
           public async Task UpdateAut(SolicitudRevisionITF model)
           {
               try
               {
                   var _model = await _dbMT.dbSetSolicitudRevisionITF.FirstOrDefaultAsync(e => e.SolicitudRevisionITFId== model.SolicitudRevisionITFId);
                   if (_model != null)
                   {
                       _model.EstadoSolicitudId = model.EstadoSolicitudId;
                       _model.FechaAtencion = model.FechaAtencion;
                       _model.TextoRespuesta = model.TextoRespuesta;
                       await _dbMT.SaveChangesAsync();
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
                   var _model = await _dbMT.dbSetSolicitudRevisionITF.FirstOrDefaultAsync(e => e.SolicitudRevisionITFId == id);
                   if (_model != null)
                   {
                       _dbMT.dbSetSolicitudRevisionITF.Remove(_model);
                       await _dbMT.SaveChangesAsync();
                   }
               }
               catch (Exception e)
               {
                   throw new Exception(e.Message, e);
               }
           }*/


        public async Task<IEnumerable<SolicitudRevisionITF>> GetByResponsableUO(string ClaveResponsableUO)
        {
            try
            {

                var entities = await _db.dbSetUnidadOrganizacional.AsNoTracking()
                   .Where(e => e.ClaveResponsable == ClaveResponsableUO)
                   .OrderByDescending(e => e.FechaEfectiva)
                   .FirstOrDefaultAsync();
             
                if (entities == null)
                {
                    throw new Exception("actualmente no es responsable de alguna Unidad Organizacional");
                }
                var claveUnidad = entities.ClaveUnidad;
                var solicitudes = await _dbMT.dbSetSolicitudRevisionITF
                    .AsNoTracking()
                    .Where(e => e.ClaveUnidad.Equals(claveUnidad) && e.EstadoSolicitudId==1)
                  .ToListAsync();
                foreach (var item in solicitudes)
                {
                    item.PersonaSolicitante =  await _db.dbSetPersonas.AsNoTracking()
                   .Where(x => x.ClavePersona == item.ClavePersonaSolicitante)
                   .OrderByDescending(e => e.FechaEfectiva)
                   .FirstOrDefaultAsync();
                }         
                return solicitudes;

            }

            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<long> CountGetByClave(string Id)
        {
            try
            {                
                var count = (from e in _dbMT.dbSetSolicitudRevisionITF
                             where e.ClavePersonaAutorizador.Equals(Id) && e.EstadoSolicitudId == 2
                             select e.SolicitudRevisionITFId);
                var result= await count.LongCountAsync();
                return result;

            }

            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<SolicitudRevisionITF> GetPermiso(int id)
        {
            try
            {

                var entities = await _dbMT.dbSetSolicitudRevisionITF.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.SolicitudRevisionITFId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public void Dispose()
        {
            _dbMT.Dispose(); //ayudar al recolector de basura
            _db.Dispose();
        }
    }
}
