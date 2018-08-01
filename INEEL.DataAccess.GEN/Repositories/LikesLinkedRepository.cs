using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Util;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories
{
    public class LikesLinkedRepository : IDisposable
    {
        private GEN_Context _db;
        public LikesLinkedRepository()
        {
            _db = new GEN_Context();
            _db.Database.Log = Escribe.Write;
        }

        //public async Task<IEnumerable<LikesLinked>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<LikesLinked>> GetAll()
        {
            try
            {
                var entities = await _db.bdSetLikesLinked.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<Object>> GetAllById_Empleado(string idActitud, string empleadoId)
        {
            try
            {
                var fecha = DateTime.Now;

                var fechaActual = DateTime.Now;
                var likesAprobadores = await _db.bdSetLikesLinked.AsNoTracking()
                    .Where(x => x.Empleado.Equals(empleadoId) && x.IdExteno.Equals(idActitud) 
                            && x.Tipo == 1 && x.Estado==true )
                    .Select(x => x.Aprobador)
                    .ToListAsync();


                
                var personas =await  (from per in _db.dbSetPersonas
                               where (likesAprobadores.Contains(per.ClavePersona) && per.FechaEfectiva == _db.dbSetPersonas.Where(
                                                                           p => p.FechaEfectiva <= fechaActual
                                                                           && p.ClavePersona == per.ClavePersona
                                                                           ).Max(e => e.FechaEfectiva))
                                      join Categoria in _db.dbSetCategoria on per.CategoriaId equals Categoria.CategoriaId
                                      join TipoPersonal in _db.dbSetTipoPersona on per.TipoPersonalId equals TipoPersonal.TipoPersonaId

                                      from u in _db.dbSetUnidadOrganizacional
                                      where u.FechaEfectiva == _db.dbSetUnidadOrganizacional.Where(
                                                                    p => p.FechaEfectiva <= fecha
                                                                    && p.ClaveUnidad == u.ClaveUnidad
                                                                    ).Max(e => e.FechaEfectiva)
                                      where  per.ClaveUnidad.Equals(u.ClaveUnidad)
                                      select new { per, nombreUnidad = u.NombreUnidad, Categoria = Categoria , TipoPersonal= TipoPersonal }
                                     ).ToListAsync();
                

                //var personas = await personas1.Where(x => likesAprobadores.Contains(x.ClavePersona)).ToListAsync();

                if (personas == null || personas.Count<1)
                {
                    return new List<Object>();
                }
                var listCategorias = personas.Select(p => p.per.CategoriaId).ToList();
                //var categorias = await _db.dbSetCategoria.AsNoTracking().Where(
                //                            x => listCategorias.Contains(x.CategoriaId)).ToListAsync();

                var personasId = personas.Select(x => x.per.ClavePersona).ToList();
                var detalles = await _db.DetallePersonas.AsNoTracking()
                    .Include(x => x.Adjunto)
                    .Where(x => personasId.Contains(x.ClaveEmpleado)).ToListAsync();


                List<Object> lista = new List<Object>();
                AdjuntoRepository repo = new AdjuntoRepository();
                foreach (var p in personas)
                {
                    
                    long AdjuntoId = 0;
                    String foto64 = null;
                    //var categoria = "";
                    try
                    {
                        //var ctgria = categorias.Find(x => x.CategoriaId.Equals(p.per.CategoriaId));
                        //if (ctgria != null)
                        //{
                        //    categoria = ctgria.Descripcion;
                        //}

                        AdjuntoId = detalles.Find(x => x.ClaveEmpleado.Equals(p.per.ClavePersona)).Adjunto.AdjuntoId;
                        

                        try
                        {
                            string path = null;
                            var adjunto = await repo.GetAsync(AdjuntoId);
                            if (adjunto != null)
                            {
                                path = adjunto.RutaCompleta;
                                try
                                {
                                    Byte[] bytes = File.ReadAllBytes(path);
                                    foto64 = Convert.ToBase64String(bytes);
                                }
                                catch (Exception e)
                                {
                                    foto64 = null;
                                }
                            }                            

                        }
                        catch (Exception e) { /*throw new Exception("not found");*/  }
                    }
                    catch(Exception e) { }
                    lista.Add(new {
                        nombre = p.per.NombreCompleto,
                        clavePersona = p.per.ClavePersona,
                        fotoId = AdjuntoId,
                        img64 = foto64,
                        categoria= p.Categoria.Descripcion,
                        tipoPersonal= p.TipoPersonal.Descripcion,
                        unidad= p.nombreUnidad
                        //unidad= p.UnidadOrganizacional.NombreUnidad
                    });
                    
                }                

                return lista;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<LikesLinked> Get(long id)
        {
            try
            {
                var entities = await _db.bdSetLikesLinked.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.Id == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        private async Task Create(LikesLinked model)
        {
            try
            {

                _db.bdSetLikesLinked.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task UpdateStadoOrCreate(LikesLinked model)
        {
            try
            {
                var _model = await _db.bdSetLikesLinked.FirstOrDefaultAsync(
                     e => e.Aprobador.Equals(model.Aprobador) && e.Empleado.Equals(model.Empleado)
                     && e.IdExteno.Equals(model.IdExteno) && e.Tipo==1);

                if (_model != null)
                {
                    model.Id = _model.Id;

                    _db.Entry(_model).CurrentValues.SetValues(model);
                    await _db.SaveChangesAsync();
                }
                else
                {
                    await this.Create(model);
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(LikesLinked model)
        {
            try
            {
                var _model = await _db.bdSetLikesLinked.FirstOrDefaultAsync(e => e.Id == model.Id);
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

        public async Task Delete(long id)
        {
            try
            {
                var _model = await _db.bdSetLikesLinked.FirstOrDefaultAsync(e => e.Id == id);
                if (_model != null)
                {
                    _db.bdSetLikesLinked.Remove(_model);
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
            _db.Dispose(); //ayudar al recolector de basura
        }
    }
}
