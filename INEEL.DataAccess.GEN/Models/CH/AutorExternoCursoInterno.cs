using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.CH
{
    [Table("CH.tab_AutorExternoCursoInterno")]
    public class AutorExternoCursoInterno
    {
        [Key]
        public int AutorExternoCursoInternoId { get; set; }

        public int CursoInternoId { get; set; }
        public CursoInterno CursoInterno { get; set; }

        public string NombreCompleto { get; set; }

        public string Institucion { get; set; }
    }
}
