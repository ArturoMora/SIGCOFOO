using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GEN
{
    [Table("GEN.cat_Modulo")]
    public class Modulo
    {
                         
        [Key]
        [StringLength(3)]
        public string ModuloId { get; set; }
        public string Descripcion {get; set;}
        public string Url { get; set; }
        public string UrlImagen { get; set; }
        public int Secuencia { get; set; }
        public int Estado { get; set; }
        public DateTime FechaEfectiva { get; set; }

        public virtual ICollection<Funcion> Funciones { get; set; }

        [NotMapped]
        public List<Ocs> listaOcs { get; set; }
    }
}
