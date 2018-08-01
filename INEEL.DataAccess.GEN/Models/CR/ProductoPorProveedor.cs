﻿using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace INEEL.DataAccess.CR.Models
{
    [Table("CR.tab_ProductoPorProveedor")]
    public class ProductoPorProveedor
    {
        public ProductoPorProveedor() { }

        [Key]
        public int ProductoPorProveedorId { get; set; }

        //[ForeignKey("Producto")]
        //public int ProductoId { get; set; }
        //public Producto Producto { get; set; }

        //[ForeignKey("Proveedor")]
        //public int ProveedorId { get; set; }
        //public Proveedor Proveedor { get; set; }

        [Required]
        public DateTime FechaRegistro { get; set; }

        [StringLength(250)]
        [Required]
        public string Autor { get; set; }

        public Boolean Estado { get; set; }
    }
}
