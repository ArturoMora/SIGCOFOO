using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Models.GEN.Interfaces;
using INEEL.DataAccess.GEN.Util;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories
{
    public class BitacoraMovimientosRepository : IDisposable
    {
        private GEN_Context _db;
        private ICatalogoServiceProvider _catalogoServiceProvider;
        public BitacoraMovimientosRepository()
        {
            _db = new GEN_Context();
            _catalogoServiceProvider = new CatalogoServiceProvider();
        }
        
        public async Task<IEnumerable<AccesoSistema>> GetAll()
        {
            try
            {
                var lstMovimiento = _catalogoServiceProvider.getOpcionesPorIdentificador("tipoMovimiento");
                lstMovimiento.Insert(0, new SelectListItem { Text = "Todos", Value = "Todos" });

                // ViewBag.lstMovimiento = lstMovimiento;
                //var lstUsuarios = (from U in _db.dbSetAcceso
                //                   from A in _db.AtributoUsuario
                //                   where U.Id == A.usuarioId
                //                   select new SelectListItem
                //                   {
                //                       Text = A.nombre,
                //                       Value = U.UserName
                //                   }).ToList();

                var entities = await _db.dbSetAcceso.AsNoTracking().ToListAsync();
                return entities;

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
