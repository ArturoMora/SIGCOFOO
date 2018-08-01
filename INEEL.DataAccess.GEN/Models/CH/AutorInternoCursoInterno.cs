using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.GEN.Models.CH
{
    [Table("CH.tab_AutorInternoCursoInterno")]
    public class AutorInternoCursoInterno
    {
        [Key]
        public int AutorInternoCursoInternoId { get; set; }

        public int CursoInternoId { get; set; }
        public CursoInterno CursoInterno { get; set; }

        public string ClavePersona { get; set; }

        [NotMapped]
        public string NombreCompleto { get; set; }
    }
}
