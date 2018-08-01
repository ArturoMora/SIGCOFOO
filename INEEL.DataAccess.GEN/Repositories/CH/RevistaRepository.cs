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
    public class RevistaRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        SIGCOCHContext _ctx;
        public RevistaRepository()
        {
            _ctx = new SIGCOCHContext();
        }

        //Obtener todos las revistas
        public async Task<IEnumerable<Revista>> GetAll()
        {
            try
            {
                var Revista = await _ctx.Revista.Where(e=>e.Estado==1).AsNoTracking().OrderBy(x=>x.RevistaNombre).ToListAsync();
                return Revista;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Revista>> GetAllAdmin()
        {
            try
            {
                var Revista = await _ctx.Revista.AsNoTracking().OrderBy(x => x.RevistaNombre).ToListAsync();
                return Revista;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Obtener revista por Id
        public async Task<Revista> GetById(int RevistaId)
        {
            try
            {
                var Revista = await _ctx.Revista.Where(e => e.RevistaId == RevistaId).AsNoTracking().FirstOrDefaultAsync();
                return Revista;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        //Obtener revista por Id
        public async Task<Revista> GetByNombre(string revista)
        {
            try
            {
                var Revista = await _ctx.Revista.Where(e => e.RevistaNombre == revista).AsNoTracking().FirstOrDefaultAsync();
                return Revista;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Crear Revista
        public async Task Create(Revista Revista)
        {
            try
            {
                _ctx.Revista.Add(Revista);
                await _ctx.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Actualizar Revista
        public async Task Update(Revista Revista)
        {
            try
            {
                var _Revista = await _ctx.Revista.FirstOrDefaultAsync(e => e.RevistaId == Revista.RevistaId);
                if (_Revista != null)
                {

                    _Revista.RevistaNombre = Revista.RevistaNombre;
                    _Revista.Volumen = Revista.Volumen;
                    _Revista.Numero = Revista.Numero;
                    _Revista.ISSN = Revista.ISSN;

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Actualizar Revista
        public async Task UpdateEstado(Revista Revista)
        {
            try
            {
                var _Revista = await _ctx.Revista.FirstOrDefaultAsync(e => e.RevistaId == Revista.RevistaId);
                if (_Revista != null)
                {

                    _Revista.Estado = Revista.Estado;

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Eliminar Revista
        public async Task Delete(int RevistaId)
        {
            try
            {
                var _Revista = await _ctx.Revista.FirstOrDefaultAsync(e => e.RevistaId == RevistaId);
                if (_Revista != null)
                {
                    _ctx.Revista.Remove(_Revista);
                    await _ctx.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
    }
}
