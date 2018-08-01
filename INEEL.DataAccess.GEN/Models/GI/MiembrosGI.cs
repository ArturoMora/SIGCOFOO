using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GI
{
    [Table("GI.cat_MiembrosGI")]
    public class MiembrosGI
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public String ClavePersona { get; set; }
        [Required]
        public String NombrePersona { get; set; }
        [Required]
        public Boolean Activo { get; set; }


        public int ComiteGIId { get; set; }
        public ComiteGI ComiteGI { get; set; }
    }
}
