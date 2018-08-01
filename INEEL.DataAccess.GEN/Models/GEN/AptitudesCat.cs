using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GEN
{
    [Table("GEN.cat_Aptitudes")]
    public class AptitudesCat
    {
        public AptitudesCat(String nombre) {
            this.Nombre = nombre;
            this.Estado = true;
        }

        public AptitudesCat()
        {

        }

        public int Id { get; set; }
        [Required]
        
        public string Nombre { get; set; }
        [Required]
        public Boolean Estado { get; set; }
    }

    public class AptitudesModel
    {
        public List<AptitudesCat> Aptitudes { get; set; }
        public string ClaveEmpleado { get; set; }
    }
}
