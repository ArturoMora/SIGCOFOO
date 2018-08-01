using INEEL.DataAccess.CR.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.CR.Models
{
    [Table("CR.tab_HistorialUnidadesOrganizacionalesEmpresas")]
    public class HistorialUnidadesOrganizacionalesEmpresas
    {

        public HistorialUnidadesOrganizacionalesEmpresas() { }

        [Key]
        public int historialId { get; set; }
        public string nombreActualUnidad { get; set; }
        public string nombreAnteriorUnidad { get; set; }
        public string nombreAnteriorUnidadPadre { get; set; }
        public DateTime fecha { get; set; }
        public string autor { get; set; }
        public int? contactoId { get; set; }
        public string accion { get; set; }

        [ForeignKey("Empresa")]
        public int empresaId { get; set; }
        public virtual Empresa Empresa {get;set;}

        public string claveUnidad { get; set; }

        public string claveUnidadPadre { get; set; }
        public string comentarios { get; set; }

        [NotMapped]
        public Contacto contacto { get; set; }

        [NotMapped]
        public string nombreContacto { get; set; }

        [NotMapped]
        public UnidadOrganizacionalEmpresas unidad { get; set; }

        [NotMapped]
        public string nombreUnidad { get; set; }

        [NotMapped]
        public UnidadOrganizacionalEmpresas unidadPadre { get; set; }

        [NotMapped]
        public string nombreUnidadPadre { get; set; }

    }
}
