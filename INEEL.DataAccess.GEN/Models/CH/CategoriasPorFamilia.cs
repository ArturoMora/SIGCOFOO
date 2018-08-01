using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.GEN.Models.CH
{

    [Table("CH.cat_CategoriasPorFamilia")]
    public class CategoriasPorFamilia
    {
                                    
        [Key]
        public int CategoriaId { get; set; }

        [StringLength(100)]
        public string NombreCategoria { get; set; }
                            
        [StringLength(200)]
        public string Descripcion { get; set; }

        [StringLength(4)]
        public string Periodo { get; set; }

        public int Estado { get; set; }

        public int? FamiliaId { get; set; }
        public FamiliasPuestos FamiliaPuestos { get; set; }

    }
}
