
using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.MT.Models
{
    public class ProyectoConBandera
    {
        public Boolean bandera { get; set; }

        public ProyectoConBandera(Proyecto p)
        {
            this.ProyectoId = p.ProyectoId;
            this.Nombre = p.Nombre;
            this.NumjefeProyecto = p.NumjefeProyecto;
            this.NombreJefeProyecto = p.NombreJefeProyecto;
            this.FechaInicio = p.FechaInicio;
            this.FechaFin = p.FechaFin;
            this.UnidadOrganizacionalId = p.UnidadOrganizacionalId;
            this.SubPrograma = p.SubPrograma;
            this.Estado = p.Estado;
            this.bandera = false;
        }

        [StringLength(10)]
        public string ProyectoId { get; set; }

        
        public string Nombre { get; set; }

        [StringLength(10)]
        public string NumjefeProyecto { get; set; }

        [StringLength(200)]
        public string NombreJefeProyecto { get; set; }

        public DateTime FechaInicio { get; set; }

        public DateTime FechaFin { get; set; }

        [StringLength(10)]
        public string UnidadOrganizacionalId { get; set; }
        //public string Gerencia { get; set; }

        [StringLength(10)]
        public string SubPrograma { get; set; }

        public bool Estado { get; set; }

    }
}
