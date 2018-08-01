using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace INEEL.DataAccess.GEN.Models.GEN
{
    [Table("GEN.cat_FuncionesRol")]
    public class FuncionesRol
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int FuncionesRolId { get; set; }

        public int Estado { get; set; }

        [ForeignKey("Roles")]
        public int IdRol { get; set; }
        public Roles Roles { get; set; }

        [ForeignKey("Funcion")]
        public int IdFuncion { get; set; }
        public Funcion Funcion { get; set; }

        
    }
}
