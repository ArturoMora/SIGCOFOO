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
    public class AmbitoRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        SIGCOCHContext _ctx;
        public AmbitoRepository()
        {
            _ctx = new SIGCOCHContext();
        }
        //Obtener todos los ambitos
        public async Task<IEnumerable<Ambito>> GetAll()
        {
            try
            {
                var AmbitoCat = await _ctx.Ambito.Where(e=>e.estado==1).AsNoTracking()
                    .OrderBy(x=>x.Descripcion)
                                                 .ToListAsync();
                return AmbitoCat;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Ambito>> GetAllAdmin()
        {
            try
            {
                var AmbitoCat = await _ctx.Ambito.AsNoTracking()
                     .OrderBy(x => x.Descripcion)
                                                 .ToListAsync();
                return AmbitoCat;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Obtener un ambito por id
        public async Task<Ambito> GetById(int AmbitoId)
        {
            try
            {
                var AmbitoById = await _ctx.Ambito.Where(e => e.AmbitoId == AmbitoId).AsNoTracking().FirstOrDefaultAsync();
                return AmbitoById;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Crear ambito
        public async Task Create(Ambito Ambito)
        {
            try
            {
                _ctx.Ambito.Add(Ambito);
                await _ctx.SaveChangesAsync();
            } catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Actualizar Ambito
        public async Task Update(Ambito Ambito)
        {
            try
            {
                var _Ambito = await _ctx.Ambito.FirstOrDefaultAsync(e => e.AmbitoId == Ambito.AmbitoId);
                if (_Ambito != null)
                {
                    _Ambito.Descripcion = Ambito.Descripcion;
                    _Ambito.DescripcionCorta = Ambito.DescripcionCorta;

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Actualizar estado
        public async Task UpdateEstado(Ambito Ambito)
        {
            try
            {
                var _Ambito = await _ctx.Ambito.FirstOrDefaultAsync(e => e.AmbitoId == Ambito.AmbitoId);
                if (_Ambito != null)
                {
                    _Ambito.estado = Ambito.estado;

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Eliminar Ambito
        public async Task Delete(int AmbitoId)
        {
            try
            {
                var _Ambito = await _ctx.Ambito.FirstOrDefaultAsync(e => e.AmbitoId == AmbitoId);
                if (_Ambito != null)
                {
                    _ctx.Ambito.Remove(_Ambito);
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
