using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CP;
using INEEL.DataAccess.GEN.Models.GEN;
using System.Linq;

namespace INEEL.DataAccess.GEN.Repositories.CP
{
    public class DocumentoRepository : IDisposable
    {

        AdjuntoRepository _adjuntoRepo;
        private CP_Context _db;
        public DocumentoRepository()
        {
            _db = new CP_Context();
            _adjuntoRepo = new AdjuntoRepository();
        }


        public async Task<IEnumerable<Documento>> GetAll()
        {
            try
            {
                var entities = await _db.DbSetDocumentos
                    .Include(e=>e.Miembros)
                    .Include(e=>e.TipoDocumento)
                    .Include(e=>e.Adjunto)
                    .AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<Object[]> GetByComunidad(int id)
        {
            try
            { 

                  PersonasRepository personas = new PersonasRepository();
               

                var entities = await _db.DbSetDocumentos
                    .Where(e => e.idComunidadCP == id)
                    .Include(e => e.Miembros)
                    .Include(e => e.TipoDocumento)
                    .Include(e => e.Adjunto)
                    .AsNoTracking().ToListAsync();
                Object[] lista = new Object[entities.Count];

                foreach (var item in entities) {
                    item.nombrePersona = "";
                    if (item.idMiembroCP == null)
                    {
                        var datosPersona = await personas.GetByClave(item.idPersona);
                        item.nombrePersona = datosPersona.NombreCompleto;
                    }
                    else
                    {
                        item.nombrePersona = item.Miembros.nombrePersona;
                    }
                    lista[entities.IndexOf(item)] = new {item.nombrePersona
                                                        ,item.TipoDocumento.Nombre
                                                        ,item.Adjunto
                                                        ,item.idMiembroCP
                                                        ,item.TipoAcceso
                                                        ,item.FechaRegistro
                                                        ,item.DocumentoId
                                                        ,item.Estado
                                                        ,item.nombreDocumento
                                                        ,item.idAdjunto
                    };




                }


                return lista;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Object[]> GetByComunidad2(int id)
        {
            try
            {

                PersonasRepository personas = new PersonasRepository();


                var entities = await _db.DbSetDocumentos
                    .Where(e => e.idComunidadCP == id)
                    .Include(e => e.Miembros)
                    .Include(e => e.TipoDocumento)
                    .Include(e => e.Adjunto)
                    .AsNoTracking().ToListAsync();
                Object[] lista = new Object[entities.Count];

                foreach (var item in entities)
                {
                    item.nombrePersona = "";
                    if (item.idMiembroCP == null)
                    {
                        var datosPersona = await personas.GetByClave(item.idPersona);
                        item.nombrePersona = item.idPersona+ " "+datosPersona.NombreCompleto;
                    }
                    else
                    {
                        item.nombrePersona = item.Miembros.idPersonas+" "+ item.Miembros.nombrePersona;
                    }
                    lista[entities.IndexOf(item)] = new
                    {
                        item.nombrePersona
                                                        ,
                        item.TipoDocumento.Nombre
                                                        ,
                        item.Adjunto
                                                        ,
                        item.idMiembroCP
                                                        ,
                        item.TipoAcceso
                                                        ,
                        item.FechaRegistro
                                                        ,
                        item.DocumentoId
                                                        ,
                        item.Estado
                                                        ,
                        item.nombreDocumento
                                                        ,
                        item.idAdjunto
                    };




                }


                return lista;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<Object[]> GetByInvitadoComunidad(int id)
        {
            try
            {
                PersonasRepository personas = new PersonasRepository();

                var entities = await _db.DbSetDocumentos
                    .Where(e => e.idComunidadCP == id && e.TipoAcceso == true )
                    .Include(e => e.Miembros)
                    .Include(e => e.TipoDocumento)
                    .Include(e => e.Adjunto)
                    .AsNoTracking().ToListAsync();

                 Object[] lista = new Object[entities.Count];

                foreach (var item in entities) {
                    item.nombrePersona = "";
                    if (item.idMiembroCP == null)
                    {
                        var datosPersona = await personas.GetByClave(item.idPersona);
                        //item.nombrePersona = datosPersona.NombreCompleto;
                        item.nombrePersona = item.idPersona + " " + datosPersona.NombreCompleto;
                    }
                    else
                    {
                        //item.nombrePersona = item.Miembros.nombrePersona;
                        item.nombrePersona = item.Miembros.idPersonas + " " + item.Miembros.nombrePersona;
                    }
                    lista[entities.IndexOf(item)] = new {item.nombrePersona
                                                        ,item.TipoDocumento.Nombre
                                                        ,item.Adjunto
                                                        ,item.idMiembroCP
                                                        ,item.TipoAcceso
                                                        ,item.FechaRegistro
                                                        ,item.DocumentoId
                                                        ,item.Estado
                                                        ,item.nombreDocumento
                                                        ,item.idAdjunto
                    };




                }


                return lista;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Documento> GetById(int id)
        {
            try
            {
                var entities = await _db.DbSetDocumentos
                    .Include(e => e.Miembros)
                    .Include(e => e.TipoDocumento)
                    .Include(e => e.Adjunto)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(e => e.DocumentoId  == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(Documento model)
        {
            try
            {

                _db.DbSetDocumentos.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(Documento model)
        {
            try
            {
                var _model = await _db.DbSetDocumentos.FirstOrDefaultAsync(e => e.DocumentoId == model.DocumentoId);
                if (_model != null)
                {
                    if (model.Adjunto != null && model.Adjunto.AdjuntoId==0)
                    {
                        var id = _model.idAdjunto;
                        var adjunto = await new AdjuntoRepository().CreateAd(model.Adjunto);
                        _model.idAdjunto = adjunto.AdjuntoId;
                        model.idAdjunto = adjunto.AdjuntoId;
                        await _db.SaveChangesAsync();
                        await new AdjuntoRepository().Delete(id); //Hasta este momento un adjunto debe de venir acompanado con el registro
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
                var _model = await _db.DbSetDocumentos.FirstOrDefaultAsync(e => e.DocumentoId  == id);
                if (_model != null)
                {
                    var adjunto = _model.idAdjunto;
                    
                    _db.DbSetDocumentos.Remove(_model);
                    await _db.SaveChangesAsync();
                    await new AdjuntoRepository().Delete(adjunto);
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
