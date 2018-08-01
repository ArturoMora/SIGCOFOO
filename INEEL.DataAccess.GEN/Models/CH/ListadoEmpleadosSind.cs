using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.GEN.Models.CH
{

    [Table("CH.tab_ListadoEmpleadosSind")]
    public  class ListadoEmpleadosSind
    {
        [Key]
        public int Id { get; set; }

        public int ListaId { get; set; }

        [StringLength(10)]
        public string EmpleadoId { get; set; }

        [StringLength(200)]
        public string NombreEmpleado { get; set; }

        [StringLength(10)]
        public string NoEmpleado { get; set; }


    }
}
