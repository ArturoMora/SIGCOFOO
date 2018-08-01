using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GEN
{

    [Table("GEN.tab_AccesoSistema")]
    public class AccesoSistema
    {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AccesoID { get; set; }

        [StringLength(10)]
        public string UserName { get; set; }   // contraseña

        public Byte[] PasswordSha { get; set; }   // contraseña

        public int Estado { get; set; }

       // [ForeignKey("persona"), Column(Order = 0)]
        public string ClavePersona { get; set; }
        // [ForeignKey("persona"), Column(Order = 1)]
        // public string RUPersona { get; set; }
        //[ForeignKey("persona"), Column(Order = 2)]
        // public DateTime FechaEfectiva { get; set; }
        public string OrigenDatos { get; set; }
        // [NotMapped]
        // public virtual Personas persona { get; set; }

    }
}
