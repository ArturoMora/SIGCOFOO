using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Contexts;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class UsuarioRepository : IDisposable { public void Dispose(){ _Context.Dispose();}
        //inicializar contexto
        SIGCOCHContext _Context;
        public UsuarioRepository()
        {
            _Context = new SIGCOCHContext();
        }

        //Obtener un solo usuario
        public async Task<Usuario> GetUsuario(string numEmpleado)
        {
            try
            {
                var usuario = await _Context.Usuarios.AsNoTracking().FirstOrDefaultAsync(e => e.numEmpleado == numEmpleado.Replace("u",""));
                return usuario;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
    }
}
