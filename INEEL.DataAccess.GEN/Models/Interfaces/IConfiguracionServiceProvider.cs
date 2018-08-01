using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GEN.Interfaces
{
    public interface IConfiguracionServiceProvider
    {
        string getValorDeVariable(string variable);
        string getVariableConfiguracion(string variable);
    }
}
