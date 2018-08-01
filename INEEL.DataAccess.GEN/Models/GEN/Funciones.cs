using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GEN
{

    [Table("GEN.cat_Funciones")]
    public class Funcion
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int FuncionesId { get; set; }

        [StringLength(255)]
        public string Descripcion { get; set; }

        [StringLength(100)]
        public string Nombre { get; set; }

        [StringLength(255)]
        public string Url { get; set; }

        public int Nivel { get; set; }

        public int Secuencia { get; set; }

        public int Estado { get; set; }

        [ForeignKey("FuncionPadre")]
        public int? IdPadre { get; set; }
        public Funcion FuncionPadre { get; set; }

        public virtual List<Funcion> Children { get; set; }

        [ForeignKey("Modulos")]
        [Required]
        public string IdModulo { get; set; }
        public Modulo Modulos { get; set; }

        public string ClaseIcono { get; set; }
        public string State { get; set; }
        [NotMapped]
        public virtual string nombreFuncionPadre { get; set; }
    }
}
