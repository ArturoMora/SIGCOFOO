using INEEL.DataAccess.CR.Models;
using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Models.CP;

namespace INEEL.DataAccess.GEN.Models.CR
{
    [Table("CR.cat_Expertos")]
    public class Experto
    {
        public Experto() { }

        public int ExpertoId { get; set; }

        [Required]
        public int ContactoId { get; set; }
        [NotMapped]
        public Contacto Contacto { get; set; }

        /// <summary>
        /// 1=Interno o  2=externo 
        /// </summary>
        [Required]
        public int TipoExperto { get; set; }

        [ForeignKey("Comunidad")]
        public int? ComunidadId { get; set; }
        public virtual Comunidad Comunidad { get; set; }

        [Required]
        public string Especialidad { get; set; }

        public DateTime FechaRegistro { get; set; }
        [Required]
        public int LineaDesarrolloTecnologicoId { get; set; }
        public LineaDesarrolloTecnologico LineaDesarrolloTecnologico { get; set; }
                      
        [StringLength(10)]
        public string ClavePersona { get; set; }
        
        [NotMapped]
        public ICollection<Personas> Investigadores { get; set; }

        [NotMapped]
        public string[] listaInvestigadores { get; set; }
        
        [NotMapped]
        public string investigadorLiderAsociado { get; set; }


        [NotMapped]
        public string Adjunto64 { get; set; }

        [NotMapped]
        public string NombreCompleto { get; set; }

        public Boolean? estado { get; set; }

        [NotMapped]
        public int EmpresaId { get; set; }

        [NotMapped]
        public int PaisId { get; set; }

    }
}
