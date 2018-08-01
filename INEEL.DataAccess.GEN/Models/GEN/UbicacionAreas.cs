using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GEN
{
    [Table("GEN.cat_UbicacionAreas")]
    public class UbicacionAreas
    {
        
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UbicacionAreaId { get; set; }

        [StringLength(10)]
        public string NoEdificio { get; set; }   // contraseña

        [StringLength(10)]
        public string NoPiso { get; set; }

        public int Estado { get; set; }


    }
}
