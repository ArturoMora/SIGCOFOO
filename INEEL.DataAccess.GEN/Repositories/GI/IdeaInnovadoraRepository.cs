using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GI;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Linq;
using System;
using INEEL.DataAccess.GEN.Util;
using INEEL.DataAccess.GEN.Models.GEN;
using System.Text;

namespace INEEL.DataAccess.GEN.Repositories.GI
{
    public class IdeaInnovadoraRepository
    {

        private GI_Context dbGI;
        private AutoresIdeaRepository autores;
        private AdjuntoRepository _adjuntoRepo;
        private PersonasRepository _personaRepo;
        public IdeaInnovadoraRepository()
        {
            dbGI = new GI_Context();
            //dbGI.Database.Log = Escribe.Write;
            autores = new AutoresIdeaRepository();
            _adjuntoRepo = new AdjuntoRepository();
            _personaRepo = new PersonasRepository();
        }
        public async Task<int> CountIdeaInnovadora()
        {
            try
            {
                var entities = await dbGI.DbSetIdeaInnovadora
                    .Where(e => e.EstadoFlujoId == 10)
                    .AsNoTracking().CountAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<IdeaInnovadora>> GetAll()
        {
            try
            {
                var entities = await dbGI.DbSetIdeaInnovadora.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<Object>> GetAllForModal(string clave)
        {
            try
            {
                var entities = (from p in dbGI.DbSetIdeaInnovadora.AsNoTracking()
                                where p.EstadoFlujoId==10
                                select new
                                {
                                    p.IdeaInnovadoraId,
                                    p.NombreIdea,
                                    p.EstadoFlujoId,
                                    p.TipoAcceso,
                                    p.ClavePersona
                                });


                if (!String.IsNullOrEmpty(clave))
                {
                    var fksideas = await dbGI.DbSetAutoresIdea.AsNoTracking().Where(x => x.ClavePersona == clave).Select(x => x.IdeaInnovadoraId).ToListAsync();
                    entities = entities.Where(x => x.ClavePersona== clave || x.TipoAcceso == 1 || fksideas.Contains(x.IdeaInnovadoraId));
                }

                if (String.IsNullOrEmpty(clave))
                {
                    entities=entities.Where(x=> x.TipoAcceso==1);
                }

                return entities.ToList();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<IdeaInnovadora>> getAllAceptadas()
        {
            try
            {
                var entities = await dbGI.DbSetIdeaInnovadora
                    .Where(e => e.EstadoFlujoId == 10)
                    .Include(e => e.EstadoFlujo)
                    .AsNoTracking().ToListAsync();

                foreach (var item in entities)
                {
                    AutoresIdea proponente = await autores.getProponentePrincipalById(item.IdeaInnovadoraId);
                    if (proponente != null)
                    {
                        Personas autor = await _personaRepo.GetByClave(proponente.ClavePersona);
                        item.proponenteNombre = autor.NombreCompleto;
                    }
                    if (item.TipoAcceso == 1)
                    {
                        item.AccesoPublico = true;
                    }
                    else
                    {
                        item.AccesoPublico = false;
                    }
                }


                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<IdeaInnovadora>> getAllAceptadas2()
        {
            try
            {
                var entities = await dbGI.DbSetIdeaInnovadora
                    .Where(e => e.EstadoFlujoId == 10)
                    .Include(e => e.EstadoFlujo)
                    .AsNoTracking().ToListAsync();

                foreach (var item in entities)
                {
                    AutoresIdea proponente = await autores.getProponentePrincipalById(item.IdeaInnovadoraId);
                    if (proponente != null)
                    {
                        Personas autor = await _personaRepo.GetByClave(proponente.ClavePersona);
                        item.proponenteNombre = autor.NombreCompleto;
                        item.ClaveProponentePrincipal = proponente.ClavePersona;
                    }
                    if (item.TipoAcceso == 1)
                    {
                        item.AccesoPublico = true;
                    }
                    else
                    {
                        item.AccesoPublico = false;
                    }
                }


                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Object> ComentariosSolicitudIdea(string id)
        {
            try
            {
                var solicitud = await dbGI.DbSetBitacoraSolicitudesGI.Where(e => e.Descripcion.Contains("Rechazada") && e.SolicitudId ==
                             (dbGI.DbSetSolicitudGI
                                 .Where(x => x.InformacionId == id && x.TipoInformacionId == 28)
                                 .Select(x => x.SolicitudId)
                                 .FirstOrDefault())
                        ).OrderByDescending(e => e.FechaMovimiento)
                        .AsNoTracking().FirstOrDefaultAsync();
                return solicitud;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Object> ComentariosSolicitudAModificar(string id)
        {
            try
            {
                var solicitud = await dbGI.DbSetBitacoraSolicitudesGI.Where(e => e.Descripcion.Contains("Se envió a modificación") && e.SolicitudId ==
                             (dbGI.DbSetSolicitudGI
                                 .Where(x => x.InformacionId == id && x.TipoInformacionId == 28)
                                 .Select(x => x.SolicitudId)
                                 .FirstOrDefault())
                        ).OrderByDescending(e => e.FechaMovimiento)
                        .AsNoTracking().FirstOrDefaultAsync();
                return solicitud;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Object> ComentariosSolicitudAprobadaIdea(string id)
        {
            try
            {
                var solicitud = await dbGI.DbSetBitacoraSolicitudesGI.Where(e => e.Descripcion.Contains("Aprobada") && e.SolicitudId ==
                             (dbGI.DbSetSolicitudGI
                                 .Where(x => x.InformacionId == id && x.TipoInformacionId == 28)
                                 .Select(x => x.SolicitudId)
                                 .FirstOrDefault())
                        ).OrderByDescending(e => e.FechaMovimiento)
                        .AsNoTracking().FirstOrDefaultAsync();
                return solicitud;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<Boolean> EvidenciaDownload(int idRegistro, String ClavePersona)
        {
            try
            {
                var entitie = await dbGI.DbSetIdeaInnovadora.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.IdeaInnovadoraId == idRegistro);

                if (entitie.TipoAcceso == 1)
                { //1: publico
                    return true;
                }
                else
                {
                    var autores = await dbGI.DbSetAutoresIdea.AsNoTracking()
                        .Where(x => x.IdeaInnovadoraId == entitie.IdeaInnovadoraId
                        && ClavePersona.Equals(x.ClavePersona))
                        .FirstOrDefaultAsync();
                    if (autores != null)
                    {
                        return true;
                    }

                    if (entitie.ClavePersona.Equals(ClavePersona))
                    {
                        return true;
                    }
                    else
                    {
                        JerarquiaRepository hiper = new JerarquiaRepository();
                        Jerarquia jer = new Jerarquia(null, ClavePersona, null);
                        jer.JefeHiperonimo = ClavePersona;

                        var autorPrincipal = await dbGI.DbSetAutoresIdea.AsNoTracking()
                        .Where(x => x.IdeaInnovadoraId == entitie.IdeaInnovadoraId
                        && x.ContribucionProponenteId == 0)
                        .FirstOrDefaultAsync();

                        if (autorPrincipal != null)
                        {
                            var fechaActual = DateTime.Now;
                            var personaRow = await (from persona in dbGI.DbSetPersonas //Investigadores
                                                    where persona.ClavePersona == autorPrincipal.ClavePersona && persona.FechaEfectiva == dbGI.DbSetPersonas.Where(
                                                                                                p => p.FechaEfectiva <= fechaActual
                                                                                                && p.ClavePersona == persona.ClavePersona
                                                                                                ).Max(e => e.FechaEfectiva)
                                                    select persona).FirstOrDefaultAsync();
                            if (personaRow != null)
                            {
                                jer.UnidadOrganizacionalId = personaRow.ClaveUnidad;
                                return await hiper.isJefeHiperonimoByUnidadOrganizacionalId(jer);
                            }
                            else
                            {
                                return false;
                            }

                        }
                        else
                        {
                            return false;
                        }


                    }
                }
                return false;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IdeaInnovadora> GetById(int id)
        {
            try
            {
                var entities = await dbGI.DbSetIdeaInnovadora.AsNoTracking()
                    // .Include(x=> x.FK)
                    .Include(e => e.Adjunto)
                    //.Include(e=> e.Comunidad)
                    .FirstOrDefaultAsync(e => e.IdeaInnovadoraId == id);
                if (entities != null)
                {
                    var comunidad = await dbGI.DbSetComunidad.AsNoTracking().Where(x => x.ComunidadId == entities.ComunidadPracticaId).FirstOrDefaultAsync();
                    entities.Comunidad = comunidad;
                }
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Object>> GetConsultaIdeas(IdeaInnovadora parametros)
        {
            try
            {
                var entities = dbGI.DbSetIdeaInnovadora
                    .Include(e => e.EstadoFlujo)
                    .AsNoTracking();

                if (entities != null)
                {
                    /***Seccion [Buscar idea innovadora]**/
                    if (!String.IsNullOrEmpty(parametros.busqueda))//busqueda en general (seccion buscar 'idea innovadora')
                    {
                        entities = entities.Where(e => e.EstadoFlujoId == 10);
                    }
                    /***Seccion [Mis ideas innovadoras]**/
                    if (!String.IsNullOrEmpty(parametros.ClavePersona))//busqueda por los registros de la persona
                    {
                        var fksautores = await dbGI.DbSetAutoresIdea.Where(e => e.ClavePersona == parametros.ClavePersona).AsNoTracking().Select(x => x.IdeaInnovadoraId).ToListAsync();
                        entities = entities.Where(e => fksautores.Contains(e.IdeaInnovadoraId) || e.ClavePersona == parametros.ClavePersona);
                    }

                    /***Criterios de busqueda en general de ambos formularios**/
                    if (!String.IsNullOrEmpty(parametros.NombreIdea))//busqueda por el nombre de la idea innovadora
                    {
                        var fksideas = await GetIdeasLikeNombreLatin1(parametros.NombreIdea);
                        entities = entities.Where(e => fksideas.Contains(e.IdeaInnovadoraId));
                    }
                    if (!String.IsNullOrEmpty(parametros.busquedaFecha))  //busqueda por fechas
                    {
                        entities = entities.Where(e => (DbFunctions.TruncateTime(e.FechaRegistro) >= DbFunctions.TruncateTime(parametros.fechaInicioComparacion) && DbFunctions.TruncateTime(e.FechaRegistro) <= DbFunctions.TruncateTime(parametros.fechaFinalComparacion)));
                    }
                    if (!String.IsNullOrEmpty(parametros.proponenteNombre))  //busqueda por proponentes
                    {
                        PersonasRepository p = new PersonasRepository();
                        var claves = await p.GetAllClavesByLikeNombreLatin1(parametros.proponenteNombre);
                        var fksproponentes = await dbGI.DbSetAutoresIdea.Where(e => claves.Contains(e.ClavePersona) && e.ContribucionProponenteId == 0).AsNoTracking().Select(x => x.IdeaInnovadoraId).ToListAsync();
                        entities = entities.Where(x => fksproponentes.Contains(x.IdeaInnovadoraId));

                    }
                    if (!String.IsNullOrEmpty(parametros.PalabrasClave))//busqueda por las palabras clave de las ideas innovadoras
                    {
                        var fkspalabras = await GetIdeasByPalabrasClaveLikeNombreLatin1(parametros.PalabrasClave);
                        entities = entities.Where(e => fkspalabras.Contains(e.IdeaInnovadoraId));
                    }

                    var datos = entities.ToList();

                    foreach (var item in datos)
                    {
                        AutoresIdea proponente = await autores.getProponentePrincipalById(item.IdeaInnovadoraId);
                        if (proponente != null)
                        {
                            Personas autor = await _personaRepo.GetByClave(proponente.ClavePersona);
                            item.proponenteNombre = autor.NombreCompleto;
                            item.ClaveProponentePrincipal = proponente.ClavePersona;
                        }
                        if (item.TipoAcceso == 1)
                        {
                            item.AccesoPublico = true;
                        }
                        else
                        {
                            item.AccesoPublico = false;
                        }
                    }

                    return datos;
                }

                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtener todas las claves de las ideas innovadoras que concuerden con la busqueda ingresada por el usuario
        /// </summary>
        /// <returns>List<int></returns>
        public async Task<List<int>> GetIdeasLikeNombreLatin1(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                StringBuilder sql = new StringBuilder();
                foreach (var palabra in palabras)
                {
                    sql.Append(" NombreIdea collate Latin1_General_CI_AI LIKE '%" + palabra + "%' AND ");
                }
                var query = sql.ToString().Substring(0, sql.ToString().Length - 4);
                var resultados = await dbGI.Database.SqlQuery<int>("SELECT IdeaInnovadoraId FROM GI.tab_IdeaInnovadora where " + query).ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        /// <summary>
        /// Obtener todas las claves de las ideas innovadoras que concuerden con el criterio de palabras clave ingresado por el usuario
        /// </summary>
        /// <returns>List<int></returns>
        public async Task<List<int>> GetIdeasByPalabrasClaveLikeNombreLatin1(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                StringBuilder sql = new StringBuilder();
                foreach (var palabra in palabras)
                {
                    sql.Append(" PalabrasClave collate Latin1_General_CI_AI LIKE '%" + palabra + "%' AND ");
                }
                var query = sql.ToString().Substring(0, sql.ToString().Length - 4);
                var resultados = await dbGI.Database.SqlQuery<int>("SELECT IdeaInnovadoraId FROM GI.tab_IdeaInnovadora where " + query).ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<IdeaInnovadora>> GetByClave(String ClavePersona)
        {
            try
            {
                var entities = await dbGI.DbSetIdeaInnovadora.AsNoTracking()
                    .Include(e => e.EstadoFlujo)
                    .Include(e => e.Adjunto)
                    .Where(x => x.ClavePersona == ClavePersona
                     || dbGI.DbSetAutoresIdea.Where(ai => ai.IdeaInnovadoraId == x.IdeaInnovadoraId).Select(ai => ai.ClavePersona).ToList().Contains(ClavePersona)
                    ).ToListAsync();

                foreach (var item in entities)
                {
                    AutoresIdea proponente = await autores.getProponentePrincipalById(item.IdeaInnovadoraId);
                    if (proponente != null)
                    {
                        Personas autor = await _personaRepo.GetByClave(proponente.ClavePersona);
                        item.proponenteNombre = autor.NombreCompleto;
                        item.ClaveProponentePrincipal = autor.ClavePersona;
                    }
                }


                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task CreateConAutores(IdeaInnovadora model, List<AutoresIdea> listaAutores)
        {
            try
            {

                dbGI.DbSetIdeaInnovadora.Add(model);
                await dbGI.SaveChangesAsync();

                try
                {
                    if (listaAutores != null && listaAutores.Count > 0)
                    {
                        await autores.CreateAllSetIdeaInnovadoraId(listaAutores, model.IdeaInnovadoraId);
                    }
                }
                catch (Exception err)
                {
                    dbGI = new GI_Context();
                    var _model = await dbGI.DbSetIdeaInnovadora.FirstOrDefaultAsync(e => e.IdeaInnovadoraId == model.IdeaInnovadoraId);
                    dbGI.DbSetIdeaInnovadora.Remove(_model);
                    await dbGI.SaveChangesAsync();
                    throw err;
                }


            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(IdeaInnovadora model, List<AutoresIdea> listaAutores)
        {
            //throw new Exception("foo");
            try
            {
                var _model = await dbGI.DbSetIdeaInnovadora.FirstOrDefaultAsync(e => e.IdeaInnovadoraId == model.IdeaInnovadoraId);
                if (_model.AdjuntoId != null)
                {
                    var id = _model.AdjuntoId;
                    _model.AdjuntoId = null;
                    await dbGI.SaveChangesAsync();
                    await new AdjuntoRepository().Delete(id);
                }
                if (model.Adjunto != null)
                {
                    Adjunto key = await _adjuntoRepo.CreateAd(model.Adjunto);
                    model.AdjuntoId = key.AdjuntoId;
                    model.Adjunto.AdjuntoId = key.AdjuntoId;
                }
                else
                {
                    model.AdjuntoId = null;
                }

                if (model.EstadoFlujoId == 14)
                {
                    model.FechaRegistro = DateTime.Now;
                };

                
                if (_model != null)
                {
                    dbGI.Entry(_model).CurrentValues.SetValues(model);
                    await dbGI.SaveChangesAsync();
                }
                try
                {
                    if (listaAutores.Count > 0)
                    {
                        foreach (var autor in listaAutores)
                        {
                            if (autor.Persona.Equals("eliminar"))
                            {
                                var _proponenteExist = await dbGI.DbSetAutoresIdea.FirstOrDefaultAsync(e => e.Id == autor.Id);
                                if (_proponenteExist != null) { dbGI.DbSetAutoresIdea.Remove(_proponenteExist); await dbGI.SaveChangesAsync(); }
                            }
                            if (autor.IdeaInnovadoraId == 0)
                            {
                                autor.ContribucionProponente = null;
                                autor.IdeaInnovadoraId = model.IdeaInnovadoraId;
                                var result = dbGI.DbSetAutoresIdea.Add(autor);
                                await dbGI.SaveChangesAsync();
                            }


                        }

                    }
                }
                catch (Exception e)
                {
                    throw new Exception(e.Message, e);
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateTipoAcceso(IdeaInnovadora model)
        {
            try
            {
                var _model = await dbGI.DbSetIdeaInnovadora.FirstOrDefaultAsync(e => e.IdeaInnovadoraId == model.IdeaInnovadoraId);
                if (_model != null)
                {
                    _model.TipoAcceso = model.TipoAcceso;
                    _model.TipoAccesoGI = null;
                    await dbGI.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task UpdateEstado(IdeaInnovadora model)
        {
            try
            {
                //if (model.EstadoFlujoId == 10)
                //{
                //    model.FechaValidacion = DateTime.Now;
                //}
                var _model = await dbGI.DbSetIdeaInnovadora.FirstOrDefaultAsync(e => e.IdeaInnovadoraId == model.IdeaInnovadoraId);
                if (_model != null)
                {
                    _model.EstadoFlujoId = model.EstadoFlujoId;
                    _model.TipoAcceso = model.TipoAcceso;
                    if (model.EstadoFlujoId == 10)
                    {
                        _model.FechaValidacion = DateTime.Now;
                    }
                    await dbGI.SaveChangesAsync();

                    if (model.TipoAcceso == 1 && model.EstadoFlujoId == 10)
                    {
                        NuevoOCRepository nuevo = new NuevoOCRepository();
                        await nuevo.Create(new NuevoOC("GI", "II", _model.NombreIdea,
                        "indexGI.html#/buscarIdeaInnovadoraDetalles/" + _model.IdeaInnovadoraId,
                         _model.IdeaInnovadoraId.ToString()
                        ));
                    }

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
                var _model = await dbGI.DbSetIdeaInnovadora.FirstOrDefaultAsync(e => e.IdeaInnovadoraId == id);
                var id_idea = _model.IdeaInnovadoraId;

                if (_model != null)
                {
                    if (_model.AdjuntoId != null)
                    {
                        var idadjunto = _model.AdjuntoId;
                        _model.AdjuntoId = null;
                        await dbGI.SaveChangesAsync();
                        await new AdjuntoRepository().Delete(idadjunto);
                    }

                    dbGI.DbSetIdeaInnovadora.Remove(_model);
                    await dbGI.SaveChangesAsync();

                    List<AutoresIdea> Autores = await dbGI.DbSetAutoresIdea.Where(x => x.IdeaInnovadoraId == id_idea).ToListAsync();
                    foreach (var item in Autores)
                    {
                        dbGI.DbSetAutoresIdea.Remove(item);
                        await dbGI.SaveChangesAsync();
                    }
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
