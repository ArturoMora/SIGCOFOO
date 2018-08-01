using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.MT.Models
{
    [Table("MT.InformeBecario")]
    public class InformeBecario
    {
        public int InformeBecarioId { get; set; }
        [ForeignKey("Proyecto")]
        [StringLength(10)]
        [Required]
        public string ProyectoId { get; set; }
        public Proyecto Proyecto { get; set; }

        [Required]
        [StringLength(300)]
        public string Nombre { get; set; }

        [Required]
        [StringLength(500)]
        public string Descripcion { get; set; }

        [Required]
        [StringLength(150)]
        public string NombreBecario { get; set; }

        [Required]
        [StringLength(300)]
        public string InstitucionProcedencia { get; set; }

        [Required]
        [StringLength(150)]
        public string NombreAsesor{ get; set; }

        [Required]
        [StringLength(300)]
        public string InstitucionEstancia { get; set; }

        [Required]
        public Boolean TipoBeca { get; set; }

        [Required]
        public DateTime FechaInicio { get; set; }

        public DateTime FechaTermino { get; set; }

        [Required]
        [StringLength(900)]
        public String Archivos { get; set; }

        [Required]
        public Boolean Estado { get; set; }

    }
}
