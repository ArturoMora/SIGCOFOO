using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GEN
{
    /// <summary>
    /// Jerarquía en la Estructura Organizacional</summary>
    /// /// <remarks>
    /// Modelo, no mapeado con BD</remarks>
    public class Jerarquia
    {
        public Jerarquia(String EmpleadoId, String JefeHiperonimo, String ProyectoId)
        {
            this.JefeHiperonimo = JefeHiperonimo;
            this.EmpleadoId = EmpleadoId;
            this.ProyectoId = ProyectoId;
        }


        public String EmpleadoId { get; set; }
        /// <summary>
        /// Jefe directo, Jefe del Jefe directo, etc..., comunmente el usuario logeado</summary>
        public String JefeHiperonimo { get; set; }

        public String ProyectoId { get; set; }
        public String UnidadOrganizacionalId { get; set; }
    }
}
