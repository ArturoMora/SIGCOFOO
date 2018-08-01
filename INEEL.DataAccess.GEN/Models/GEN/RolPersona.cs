using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GEN
{
    [Table("GEN.cat_RolPersona")]
    public class RolPersona
    {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int RolPersonaId { get; set; }

        public int Estado { get; set; }

        [ForeignKey("Rol")]
        public int IdRol { get; set; }
        public Roles Rol { get; set; }

        //[ForeignKey("persona"), Column(Order = 0)]
        public string ClavePersona { get; set; }
        //[ForeignKey("persona"), Column(Order = 1)]
        //public string RUPersona { get; set; }
        //[ForeignKey("persona"), Column(Order = 2)]
        //public DateTime FechaEfectiva { get; set; }
        
        [NotMapped]
        public virtual Personas persona { get; set; }

    }
}
