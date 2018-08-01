using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GEN.Interfaces
{
    public interface ICatalogoServiceProvider
    {
        List<SelectListItem> getOpcionesPorIdentificador(string identificador);
        string getEtiquetaOpcion(string valor);
        List<SelectListItem> getEtiquetaOpcionesPorIdentificador(string identificador);

    }
}
