using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories
{
    public class ConfiguracionServiceProvider : IConfiguracionServiceProvider
    {
        private GEN_Context db = new GEN_Context();

        //
        //Método que retorna el valor de una variable de configuración del sistema
        //
        public string getValorDeVariable(string variable)
        {
            try
            {
                return (
                        from c in db.Configuracion
                        where c.variable.Equals(variable)
                        select c.valor
                ).Single();
            }
            catch (Exception e)
            {
                Console.WriteLine("ERROR ConfiguracionServiceProvider.getValorDeVariable(): " + e.Message);
                return null;
                //throw;
            }

        }
        /// <summary>
        /// Regresa el valor de una variable de configuración con estatus Vinculado
        /// </summary>
        /// <param name="variable">Nombre de la variable</param>
        /// <returns>Valor de la variable</returns>
        public string getVariableConfiguracion(string variable)
        {
            try
            {
                return (
                        from c in db.Configuracion
                        where (c.variable.Equals(variable) && c.estatus == "Vinculado")
                        select c.valor
                ).FirstOrDefault();
            }
            catch (Exception e)
            {
                Console.WriteLine("ERROR ConfiguracionServiceProvider.getVariableConfiguracion(): " + e.Message);
                return null;
                //throw;
            }
        } //end getVariableConfiguracion

    }
}