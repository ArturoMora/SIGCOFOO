using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.CP
{
    [Table("CP.cat_CategoriaSitio")]

    public class CategoriaSitio
    {
        public CategoriaSitio() { }
        [Key]
        public int CatSitioId { get; set; }
        public string NombreCategoria { get; set; }
        public string Descripcion { get; set; }
        public DateTime FechaRegistro { get; set; }
        public string Autor { get; set; }
        public Boolean Estado { get; set; }
    }
}
