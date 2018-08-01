using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Contexts;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class IdiomaRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        /// <summary>
        /// contexto para la conexión de CH. 
        /// </summary>
        SIGCOCHContext _ctx;

        /// <summary>
        /// Contrucctor de la clase IdiomaRepository
        /// </summary>
        public IdiomaRepository()
        {
            _ctx = new SIGCOCHContext();
        }

        /// <summary>
        /// Obtiene la lista de todos los registros de la tabla tab_idioma
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<Idioma>> GetAll()
        {
            try
            {
                var Idioma = await _ctx.Idioma.Where(e=>e.Estado==1)
                    .OrderBy(i=>i.Descripcion)
                    .AsNoTracking().ToListAsync();
                return Idioma;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<Idioma>> GetAllAdmin()
        {
            try
            {
                var Idioma = await _ctx.Idioma
                    .Where(e=> e.IdiomaId != 13)
                    .OrderBy(i => i.Descripcion)
                    .AsNoTracking().ToListAsync();
                return Idioma;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        /// <summary>
        /// Obtiene un elemento del catalogo idioma 
        /// </summary>
        /// <param name="Id">identificador del elemento a obtener</param>
        /// <returns></returns>
        public async Task<Idioma> GetById(int Id)
        {
            try
            {
                var Idioma = await _ctx.Idioma.AsNoTracking().FirstOrDefaultAsync(p => p.IdiomaId == Id);
                return Idioma;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        /// <summary>
        /// Crea un nuevo registro de Idioma
        /// </summary>
        /// <param name="idioma">objeto tipo Idioma</param>
        /// <returns></returns>
        public async Task Create(Idioma idioma)
        {
            try
            {
                _ctx.Idioma.Add(idioma);
                await _ctx.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        /// <summary>
        /// Actualiza un registro de la tabla de Idioma
        /// </summary>
        /// <param name="idioma">objeto de tipo Idioma con los nuevos datos</param>
        /// <returns></returns>
        public async Task Update(Idioma idioma)
        {
            try
            {
                var _idioma = await _ctx.Idioma.FirstOrDefaultAsync(e => e.IdiomaId == idioma.IdiomaId);
                if (_idioma != null)
                {

                    _idioma.Descripcion = idioma.Descripcion;
                    _idioma.DescripcionCorta = idioma.DescripcionCorta;
                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(Idioma idioma)
        {
            try
            {
                var _idioma = await _ctx.Idioma.FirstOrDefaultAsync(e => e.IdiomaId == idioma.IdiomaId);
                if (_idioma != null)
                {

                    _idioma.Estado = idioma.Estado;
                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        /// <summary>
        /// Elimina un registro de la tabla de Idioma 
        /// </summary>
        /// <param name="Idiomaid">Id del registro a eliminar</param>
        /// <returns></returns>
        public async Task Delete(int Idiomaid)
        {
            try
            {
                var _Idioma = await _ctx.Idioma.FirstOrDefaultAsync(e => e.IdiomaId == Idiomaid);
                if (_Idioma != null)
                {
                    _ctx.Idioma.Remove(_Idioma);
                    await _ctx.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Valida que no existan registros de idiomas
        /// </summary>
        /// <param name="model"><Idioma>model</param>
        /// <returns>Boolean</returns>
        public async Task<Boolean> ValidarDuplicados(Idiomas model)
        {
            try
            {
                // var data= await GetDALikeTituloNuevo(model.TituloPublicacion);
                var registros = await _ctx.Idiomas.Where(e => e.ClavePersona == model.ClavePersona 
                         && e.IdiomaId == model.IdiomaId 
                         && DbFunctions.TruncateTime(e.FechaAcreditacion) == DbFunctions.TruncateTime(model.FechaAcreditacion)
                         && e.IdiomasId!= model.IdiomasId).AsNoTracking().CountAsync();
                if (registros > 0)
                {
                    return true;
                }
                return false;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }


    }
}
