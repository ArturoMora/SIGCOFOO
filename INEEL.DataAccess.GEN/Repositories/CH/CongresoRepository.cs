using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Contexts;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Dynamic;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class CongresoRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        SIGCOCHContext _ctx;
        public CongresoRepository()
        {
            _ctx = new SIGCOCHContext();
        }

        //Obtener todos los congresos
        public async Task<IEnumerable<Congreso>> GetAll()
        {
            try
            {
                var Congresos = await _ctx.Congreso.Where(e=>e.Estado==1).AsNoTracking().OrderBy(x=>x.NombreCongreso).ToListAsync();
                return Congresos;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Congreso>> GetAllAdmin()
        {
            try
            {
                var Congresos = await _ctx.Congreso.AsNoTracking().OrderBy(x => x.NombreCongreso).ToListAsync();
                return Congresos;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        //Obtener "todos" los congresos con ServerSide by ACH
        public async Task<IEnumerable<Congreso>> getData(DataServerSide ss)
        {
            try
            {
                var v = (from a in _ctx.Congreso select a);
                ss.recordsTotal = v.Count();
                //search         
                if (!string.IsNullOrEmpty(ss.searchValue))
                {
                    v = v.Where(e => 
                    e.NombreCongreso.Contains(ss.searchValue)
                    || e.numero.ToString().Contains(ss.searchValue)
                    || e.Estado.ToString().Contains(ss.searchValue));
                }
                
                //sort
                if (!(string.IsNullOrEmpty(ss.sortColumn) && string.IsNullOrEmpty(ss.sortColumnDir)))
                {
                    //for make sort simpler we will add Syste.Linq.Dynamic reference                    
                    v=v.OrderBy(ss.sortColumn + " " + ss.sortColumnDir);
                }

                ss.recordsFiltered = v.Count();
                var entities = await v.Skip(ss.skip).Take(ss.pageSize).AsNoTracking().ToListAsync();

                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        

        //Obtener congreso por Id
        public async Task<Congreso> GetById(int CongresoId)
        {
            try
            {
                var Congreso = await _ctx.Congreso.Where(e => e.CongresoId == CongresoId).AsNoTracking().FirstOrDefaultAsync();
                return Congreso;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Crear Congreso
        public async Task Create(Congreso Congreso)
        {
            try
            {
                _ctx.Congreso.Add(Congreso);
                await _ctx.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Actualizar Congreso
        public async Task Update(Congreso Congreso)
        {
            try
            {
                var _Congreso = await _ctx.Congreso.FirstOrDefaultAsync(e => e.CongresoId== Congreso.CongresoId);
                if (_Congreso != null)
                {
                    _Congreso.NombreCongreso = Congreso.NombreCongreso;
                    _Congreso.numero = Congreso.numero;

                    await _ctx.SaveChangesAsync();


                   
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        //Actualizar Congreso
        public async Task UpdateEstado(Congreso Congreso)
        {
            try
            {
                var _Congreso = await _ctx.Congreso.FirstOrDefaultAsync(e => e.CongresoId == Congreso.CongresoId);
                if (_Congreso != null)
                {
                    _Congreso.Estado = Congreso.Estado;

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Eliminar Congreso
        public async Task Delete(int CongresoId)
        {
            try
            {
                var _Congreso = await _ctx.Congreso.FirstOrDefaultAsync(e => e.CongresoId == CongresoId);
                if (_Congreso != null)
                {
                    _ctx.Congreso.Remove(_Congreso);
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
