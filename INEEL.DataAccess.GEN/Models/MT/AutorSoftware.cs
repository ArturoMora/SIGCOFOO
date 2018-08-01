using INEEL.DataAccess.GEN.Repositories.MT;
using INEEL.DataAccess.MT.Models;
using INEEL.DataAccess.MT.Models.ITF.catalogos;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.MT
{
    [Table("MT.AutorSoftware")]
    public class AutorSoftware
    {
        public AutorSoftware()
        {
            this.Estado = true;
        }
        [Key]
        public long AutorSoftwareId { get; set; } 

        [ForeignKey("SoftwarePersonal")]
        public int SoftwarePersonalId { get; set; }
        public SoftwarePersonal SoftwarePersonal { get; set; }
        public String ClaveAutor { get; set; }
        public Boolean Estado { get; set; }

        [NotMapped]
        public String NombreCompleto { get; set; }
    }
}
