using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.CR
{
    [Table("CR.tab_BitacoraON")]
    public class BitacoraOportunidadNegocio
    {
        public BitacoraOportunidadNegocio() { }

        [Key]
        public int BitacoraOportunidadNegocioId { get; set; }

        public int OportunidadNegocioId { get; set; }

        [StringLength(500)]
        public string ComentarioPersona { get; set; }

        [StringLength(500)]
        public string ComentarioSistema { get; set; }

        public int EstadoFlujo { get; set; }

        [StringLength(10)]
        public string ClaveUnidad { get; set; }

        public string Investigador { get; set; }

        [ForeignKey("EstadoFlujoON")]
        public int? EstadoFlujoONId { get; set; }
        public EstadoFlujoON EstadoFlujoON { get; set; }

        public DateTime FechaRegistro { get; set; }

        [Column(TypeName = "varchar(MAX)")]
        public string Comentarios { get; set; }

        [StringLength(500)]
        public string Especialista { get; set; }

        [NotMapped]
        public UnidadOrganizacional UnidadOrganizacional { get; set; }


    }
}
