using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.CR.Models
{
    [Table("CR.tab_ActividadAdicional")]
    public class ActividadAdicional
    {
        public ActividadAdicional() { }

        [Key]
        public int ActividadAdicionalId { get; set; }

        [Required]
        [ForeignKey("Aliado")]
        public int AliadoId { get; set; }
        public Aliado Aliado { get; set; }

        [StringLength(300)]
        public string Descripcion { get; set; }

        [Required]
        public DateTime FechaActividad { get; set; }

        [Required]
        public DateTime FechaRegistro { get; set; }

        [StringLength(250)]
        [Required]
        public string Autor { get; set; }

        public Boolean Estado { get; set; }

        public ICollection<AreaActividadAdicional> AreaActividadAdicional { get; set; }
        public ICollection<PersonalActividadAdicional> PersonalActividadAdicional { get; set; }

        [NotMapped]
        public string[] AreasActividad { get; set; }

        [NotMapped]
        public int[] AreasActividadAntDel { get; set; }

        [NotMapped]
        public DateTime[] FechasAreaActividad { get; set; }

        [NotMapped]
        public string[] PersonasActividad { get; set; }

        [NotMapped]
        public int[] PersonasActividadAntDel { get; set; }
        
    }
}