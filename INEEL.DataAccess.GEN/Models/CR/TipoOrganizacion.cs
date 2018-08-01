﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.CR.Models
{
    [Table("CR.cat_TipoOrganizacion")]
    public class TipoOrganizacion
    {
        public TipoOrganizacion() { }

        [Key]
        public int TipoOrganizacionId { get; set; }

        [StringLength(50)]
        [Required]
        //[Index(IsUnique = true)]
        public string Nombre { get; set; }

        [StringLength(300)]
        public string Descripcion { get; set; }

        [Required]
        public DateTime FechaRegistro { get; set; }

        [StringLength(250)]
        [Required]
        public string Autor { get; set; }

        public Boolean Estado { get; set; }

       
    }
}