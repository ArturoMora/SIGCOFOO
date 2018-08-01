using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.PI.Models
{
    [Table("PI.tab_AutoresDA")]
    public class AutoresDA
    {
        [Key]
        public int AutoresDAId { get; set; }

        public string ClavePersona { get; set; }

        public string Nombre { get; set; }

        public string Institucion { get; set; }

        public Boolean EsExterno { get; set; }

        public int DerechosAutorId { get; set; }
        public  virtual DerechosAutor DerechoAutor {get; set;}

    }
}
