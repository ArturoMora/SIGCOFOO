using INEEL.DataAccess.CR.Models;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Models.GI;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GI
{
    [Table("GI.tab_TecnologiaLicenciada")]
    public class TecnologiaLicenciada //pendinete
    {
        public int TecnologiaLicenciadaId { get; set; }
        [Index(IsUnique = true)]
        public int? Numero { get; set; }
        [Required]
        public String NombreTecnologiaLic { get; set; }
        
        public DateTime? FechaInicio { get; set; }
        public DateTime? FechaTermino { get; set; }

        [ForeignKey("EstadoLicenciamiento")]
        public int EstadoLicenciamientoId { get; set; }
        public EstadoLicenciamiento EstadoLicenciamiento { get; set; }

        //pendiente la colleccion de propiedad intelectual, pudiera estar en una tabla parte        
        public ICollection<TecnologiaLicenciadaGerencia> Gerencias { get; set; }
        //pendiente el convenio o convenios (preguntar a Mati)
        public int? ProductoId { get; set; } //RSTL-04  dado el producto se sugiere el proyecto y el usuario puede cambiar tal proyecto
        public ProductoGI ProductoGI { get; set; }
        [ForeignKey("Proyecto")]
        [StringLength(10)]
        public string ProyectoId { get; set; }
        public Proyecto Proyecto { get; set; }
        
        public int? AliadoId { get; set; } //a partir de, se llena NombreReceptor
        public Aliado Aliado { get; set; }
        public int ConvenioId { get; set; }
        public Convenio Convenio { get; set; }
        public String NombreReceptor { get; set; }

        public ICollection<TecnologiaLicenciadaPagos> Pagos { get; set; }
        public ICollection<TecnologiaLicenciadaLecciones> Lecciones { get; set; }
        public ICollection<TecnologiaLicenciadaPIDA> TecnologiaLicenciadaPIDA { get; set; }
        public ICollection<TecnologiaLicenciadaPIPIndustrial> TecnologiaLicenciadaPIPIndustrial { get; set; }

        [NotMapped]
        public int TipoPropiedadIndustrialId { get; set; }
        [NotMapped]
        public string Busqueda { get; set; }
        [NotMapped]
        public string ClaveUnidad { get; set; }
        [NotMapped]
        public string estado { get; set; }
        [NotMapped]
        public string claveEmpleado { get; set; }
        [NotMapped]
        public string unidadOrganizacionalId { get; set; }
    }
}
