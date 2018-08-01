using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Dynamic;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CP;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.PI.Models;

namespace INEEL.DataAccess.GEN.Repositories.CP
{
    public class AutoresCPRepository : IDisposable
    {

        private CP_Context _db;
        public AutoresCPRepository()
        {
            _db = new CP_Context();
        }


        public async Task<IEnumerable<Autores>> GetAll()
        {
            try
            {
                var entities = await _db.DbSetAutores.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Autores> GetById(int id)
        {
            try
            {
                var entities = await _db.DbSetAutores.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.AutorId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtiene los datos de los OC y Miembros que contiene la tabla Autores
        /// </summary>
        /// <returns>Lista de tipo Object[]</returns>
        public async Task<Object[]> GetAllNames()
        {
            try
            {
                var entities = await _db.DbSetAutores.AsNoTracking().ToListAsync();
                //MiembrosRepository miembros = new MiembrosRepository();
                ListaOCRepository listaOc= new ListaOCRepository();
                Object[] lista = new Object[entities.Count];
                foreach (var obj in entities)
                {
                    lista[entities.IndexOf(obj)] = new {datosOC=await listaOc.GetById(obj.idOC)
                                                       //,datosMiembro=await miembros.GetById(obj.idMiembroCP)
                                                       ,idContenido=obj.ContenidoId
                    };
                }
                return lista;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message,e);
            }
        }


        /// <summary>
        /// Obtiene las PK de los autores que han participado en un determinado OC
        /// </summary>
        /// <returns></returns>
        public async Task<List<int>> GetPKAutoresByCollateLatin1(string nombre, int oc)
        {
            try
            {
                PersonasRepository persona = new PersonasRepository();
                var clavesPersona = await persona.GetAllClavesByLikeNombreLatin1(nombre); //obtenemos las claves de las personas
                var resultados = await _db.DbSetAutores.Where(e => clavesPersona.Contains(e.clave) && e.idOC==oc).Select(e=>e.ContenidoId).ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<IEnumerable<Personas>> GetByOC(Autores model)
        {
            try
            {


                var entities = await _db.DbSetAutores.Where(e => e.ContenidoId == model.ContenidoId  && e.idOC == model.idOC).Select(e => e.clave).AsNoTracking().ToListAsync();

                List<String> clavesInv = new List<string>(entities);
                PersonasRepository autores = new PersonasRepository();
                var lista = await autores.GetAllCollectionWithoutStatus(clavesInv);
                return lista;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<ICollection<Personas>> GetByOC(int contenidoId, int idOC)
        {
            try
            {


                var entities = await _db.DbSetAutores.Where(e => e.ContenidoId == contenidoId && e.idOC == idOC).Select(e => e.clave).AsNoTracking().ToListAsync();

                List<String> clavesInv = new List<string>(entities);
                PersonasRepository autores = new PersonasRepository();
                var lista = await autores.GetAllCollectionWithoutStatus(clavesInv);
                return lista;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(Autores model)
        {
            try
            {

                _db.DbSetAutores.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(Autores model)
        {
            try
            {
                var _model = await _db.DbSetAutores.FirstOrDefaultAsync(e => e.AutorId == model.AutorId);
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

        public async Task Delete(int id)
        {
            try
            {
                var _model = await _db.DbSetAutores.FirstOrDefaultAsync(e => e.AutorId == id);
                if (_model != null)
                {
                    _db.DbSetAutores.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task DeleteByContenido(Autores param)
        {
            try
            {
                var _model =await _db.DbSetAutores.FirstOrDefaultAsync(e => e.ContenidoId == param.ContenidoId && e.clave == param.clave);
                if (_model != null)
                {
                    _db.DbSetAutores.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        
        /// <summary>
        /// Elimina todos los autores relacionados a un determinado OC
        /// </summary>
        /// <param name="id">id del oc (ver CP.cat_ListaOC), id del registro a eliminar</param>
        /// <returns>void</returns>
        public async Task DeleteAllAutoresByOC(int idOC, int idContenido)
        {
            try
            {
                var autores = _db.DbSetAutores.Where(e => e.ContenidoId == idContenido && e.idOC== idOC);
                if(autores!=null){
                     _db.DbSetAutores.RemoveRange(autores);
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
